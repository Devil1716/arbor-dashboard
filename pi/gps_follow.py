import math
import time
import json
import threading
import serial
import pynmea2
import random

STATE_IDLE = "IDLE"
STATE_GO_TO_GOAL = "GO_TO_GOAL"
STATE_WALL_FOLLOW = "WALL_FOLLOW"

class GPSFollowMode:
    def __init__(self):
        self.state = STATE_IDLE
        self.phone_target = None  # { 'lat': 0, 'lng': 0 }
        self.robot_location = {'lat': 0.0, 'lng': 0.0}
        self.robot_heading = 0.0  # From IMU, 0 is North
        self.min_follow_distance = 2.0  # Meters
        
        self.serial_port = '/dev/serial0'
        self.baud_rate = 9600

        # Bug 2 specific variables
        self.m_line_start = None  # { 'lat': 0, 'lng': 0 }
        self.hit_distance = float('inf')  # Distance to goal when obstacle encountered
        self.wall_follow_turn_state = "TURN_AWAY" # "TURN_AWAY", "MOVE_FORWARD", "CHECK_WALL"

    def start_gps_serial_reader(self):
        """Runs in a background thread to continuously read GPS serial data."""
        def read_serial():
            try:
                ser = serial.Serial(self.serial_port, self.baud_rate, timeout=1)
                while True:
                    line = ser.readline().decode('ascii', errors='replace')
                    if line.startswith('$GPGGA') or line.startswith('$GPRMC'):
                        try:
                            msg = pynmea2.parse(line)
                            if hasattr(msg, 'latitude') and hasattr(msg, 'longitude'):
                                if msg.latitude != 0.0:
                                    self.robot_location['lat'] = msg.latitude
                                    self.robot_location['lng'] = msg.longitude
                        except pynmea2.ParseError:
                            pass
            except Exception as e:
                print(f"Error opening GPS Serial: {e}")
        
        t = threading.Thread(target=read_serial, daemon=True)
        t.start()
        
    def read_front_ultrasonic(self):
        """
        DUMMY FUNCTION: Replace with actual GPIO reading code.
        Returns distance in cm.
        """
        # For testing, return a high number so it normally drives straight.
        # Returning < 50 would trigger wall follow.
        return 100.0

    def haversine_distance(self, lat1, lon1, lat2, lon2):
        """Calculate the great circle distance between two points on the earth."""
        R = 6371000
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) * math.sin(dlon / 2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def calculate_bearing(self, lat1, lon1, lat2, lon2):
        """Calculate the bearing from point 1 to point 2."""
        dLon = math.radians(lon2 - lon1)
        lat1 = math.radians(lat1)
        lat2 = math.radians(lat2)
        y = math.sin(dLon) * math.cos(lat2)
        x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dLon)
        brng = math.degrees(math.atan2(y, x))
        return (brng + 360) % 360

    def point_to_line_distance(self, pt_lat, pt_lng, line_start_lat, line_start_lng, line_end_lat, line_end_lng):
        """Cross-track distance: shortest distance from point to the great circle line (m-line)."""
        dist_start_to_pt = self.haversine_distance(line_start_lat, line_start_lng, pt_lat, pt_lng)
        bearing_start_to_pt = self.calculate_bearing(line_start_lat, line_start_lng, pt_lat, pt_lng)
        bearing_start_to_end = self.calculate_bearing(line_start_lat, line_start_lng, line_end_lat, line_end_lng)
        
        R = 6371000
        angular_dist = dist_start_to_pt / R
        bearing_diff = math.radians(bearing_start_to_pt - bearing_start_to_end)
        
        # Cross-track distance
        xtd = math.asin(math.sin(angular_dist) * math.sin(bearing_diff)) * R
        return abs(xtd)

    def receive_websocket_data(self, data):
        """Called when a websocket message is received from the phone."""
        try:
            payload = json.loads(data)
            if payload.get('command') == 'gps_target':
                self.phone_target = {
                    'lat': payload.get('targetLat'),
                    'lng': payload.get('targetLng')
                }
                # If we just got a target, define the M-Line start point
                if self.state == STATE_IDLE:
                    self.m_line_start = {'lat': self.robot_location['lat'], 'lng': self.robot_location['lng']}
                    self.state = STATE_GO_TO_GOAL

            elif payload.get('command') == 'set_mode':
                if payload.get('mode') == 'GPS Follow':
                    if self.phone_target:
                        self.m_line_start = {'lat': self.robot_location['lat'], 'lng': self.robot_location['lng']}
                        self.state = STATE_GO_TO_GOAL
                else:
                    self.state = STATE_IDLE
        except Exception as e:
            print("Error parsing GPS data:", e)

    def control_loop(self):
        """Main loop executing the Bug 2 algorithm."""
        while True:
            if self.state == STATE_IDLE or not self.phone_target:
                time.sleep(0.5)
                continue
                
            dist_to_goal = self.haversine_distance(
                self.robot_location['lat'], self.robot_location['lng'],
                self.phone_target['lat'], self.phone_target['lng']
            )
            
            if dist_to_goal < self.min_follow_distance:
                print(f"Target reached (Distance: {dist_to_goal:.1f}m). Stopping.")
                self.drive_motors(0, 0)
                self.state = STATE_IDLE
                continue

            front_dist = self.read_front_ultrasonic()

            # STATE: GO TO GOAL
            if self.state == STATE_GO_TO_GOAL:
                if front_dist < 50.0:  # Obstacle detected!
                    print("Obstacle detected! Switching to WALL_FOLLOW.")
                    self.hit_distance = dist_to_goal
                    self.state = STATE_WALL_FOLLOW
                    self.wall_follow_turn_state = "TURN_AWAY"
                    continue

                # Standard P-Controller to drive to goal
                target_bearing = self.calculate_bearing(
                    self.robot_location['lat'], self.robot_location['lng'],
                    self.phone_target['lat'], self.phone_target['lng']
                )
                error = target_bearing - self.robot_heading
                if error > 180: error -= 360
                elif error < -180: error += 360
                
                steering = error * 0.5
                self.drive_motors(50 + steering, 50 - steering)
            
            # STATE: WALL FOLLOW (Bug 2 single-sensor boundary tracing)
            elif self.state == STATE_WALL_FOLLOW:
                # Check if we crossed the M-line closer to the goal
                m_line_dist = self.point_to_line_distance(
                    self.robot_location['lat'], self.robot_location['lng'],
                    self.m_line_start['lat'], self.m_line_start['lng'],
                    self.phone_target['lat'], self.phone_target['lng']
                )
                
                # If we are exactly on the m-line AND closer to the target than when we hit the obstacle
                if m_line_dist < 1.0 and dist_to_goal < (self.hit_distance - 1.0):
                    print("M-Line crossed closer to goal! Switching to GO_TO_GOAL.")
                    self.state = STATE_GO_TO_GOAL
                    continue

                # Bang-Bang wall following with front sensor
                if self.wall_follow_turn_state == "TURN_AWAY":
                    # Turn Right heavily to face parallel to the wall
                    self.drive_motors(50, -50)
                    time.sleep(0.5) # Turn for a bit
                    self.wall_follow_turn_state = "MOVE_FORWARD"
                    
                elif self.wall_follow_turn_state == "MOVE_FORWARD":
                    # Drive forward a bit
                    self.drive_motors(50, 50)
                    time.sleep(0.5)
                    self.wall_follow_turn_state = "CHECK_WALL"
                    
                elif self.wall_follow_turn_state == "CHECK_WALL":
                    # Turn Left slightly to see if wall is still there
                    self.drive_motors(-40, 40)
                    time.sleep(0.2)
                    self.drive_motors(0,0)
                    
                    # Look at sensor
                    check_dist = self.read_front_ultrasonic()
                    if check_dist < 50.0:
                        # Wall is still there! Turn away again.
                        self.wall_follow_turn_state = "TURN_AWAY"
                    else:
                        # Wall is gone! Move forward slightly to wrap around corner
                        self.wall_follow_turn_state = "MOVE_FORWARD"

            time.sleep(0.1)

    def drive_motors(self, left, right):
        """Interface to actual motor controller hardware."""
        left = max(-100, min(100, left))
        right = max(-100, min(100, right))
        # print(f"Motors -> L: {left:.1f} R: {right:.1f}")
        pass

if __name__ == "__main__":
    follower = GPSFollowMode()
    
    print("Starting GPS Serial Reader on /dev/serial0...")
    follower.start_gps_serial_reader()
    
    t = threading.Thread(target=follower.control_loop, daemon=True)
    t.start()
    
    print("Simulating Bug 2 Algorithm...")
    follower.robot_location = {'lat': 37.7749, 'lng': -122.4194}
    follower.robot_heading = 90.0
    
    follower.receive_websocket_data(json.dumps({
        'command': 'set_mode',
        'mode': 'GPS Follow'
    }))
    
    follower.receive_websocket_data(json.dumps({
        'command': 'gps_target',
        'targetLat': 37.7749,
        'targetLng': -122.4184
    }))
    
    time.sleep(5)
