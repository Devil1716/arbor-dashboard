import math
import time
import json
import threading
import serial
import pynmea2

class GPSFollowMode:
    def __init__(self):
        self.active = False
        self.phone_target = None  # { 'lat': 0, 'lng': 0 }
        self.robot_location = {'lat': 0.0, 'lng': 0.0}
        self.robot_heading = 0.0  # From IMU, 0 is North
        self.min_follow_distance = 2.0  # Meters
        self.serial_port = '/dev/serial0'  # Default Pi Serial Pin
        self.baud_rate = 9600

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
        
    def haversine_distance(self, lat1, lon1, lat2, lon2):
        """Calculate the great circle distance between two points on the earth."""
        R = 6371000  # Radius of earth in meters
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

    def receive_websocket_data(self, data):
        """Called when a websocket message is received from the phone."""
        try:
            payload = json.loads(data)
            if payload.get('command') == 'gps_target':
                self.phone_target = {
                    'lat': payload.get('targetLat'),
                    'lng': payload.get('targetLng')
                }
            elif payload.get('command') == 'set_mode':
                self.active = payload.get('mode') == 'GPS Follow'
        except Exception as e:
            print("Error parsing GPS data:", e)

    def control_loop(self):
        """Main loop to drive the robot towards the target."""
        while True:
            if not self.active or not self.phone_target:
                time.sleep(0.5)
                continue
                
            dist = self.haversine_distance(
                self.robot_location['lat'], self.robot_location['lng'],
                self.phone_target['lat'], self.phone_target['lng']
            )
            
            if dist < self.min_follow_distance:
                # Stop motors
                print(f"Target reached (Distance: {dist:.1f}m). Stopping.")
                self.drive_motors(0, 0)
                time.sleep(0.5)
                continue

            target_bearing = self.calculate_bearing(
                self.robot_location['lat'], self.robot_location['lng'],
                self.phone_target['lat'], self.phone_target['lng']
            )
            
            # Simple P-Controller for steering
            error = target_bearing - self.robot_heading
            
            # Normalize error to -180 to +180
            if error > 180:
                error -= 360
            elif error < -180:
                error += 360
                
            print(f"Dist: {dist:.1f}m | Bearing: {target_bearing:.1f} | Error: {error:.1f}")
            
            base_speed = 50
            kP = 0.5
            steering = error * kP
            
            left_motor = base_speed + steering
            right_motor = base_speed - steering
            
            self.drive_motors(left_motor, right_motor)
            time.sleep(0.1)

    def drive_motors(self, left, right):
        """Interface to actual motor controller hardware."""
        # Cap values between -100 and 100
        left = max(-100, min(100, left))
        right = max(-100, min(100, right))
        # print(f"Motors -> L: {left:.1f} R: {right:.1f}")
        pass

if __name__ == "__main__":
    follower = GPSFollowMode()
    
    print("Starting GPS Serial Reader on /dev/serial0...")
    follower.start_gps_serial_reader()
    
    # Start control loop in background
    t = threading.Thread(target=follower.control_loop, daemon=True)
    t.start()
    
    # Simulate data
    print("Simulating GPS Follow...")
    follower.robot_location = {'lat': 37.7749, 'lng': -122.4194}
    follower.robot_heading = 90.0 # Facing East
    
    follower.receive_websocket_data(json.dumps({
        'command': 'set_mode',
        'mode': 'GPS Follow'
    }))
    
    follower.receive_websocket_data(json.dumps({
        'command': 'gps_target',
        'targetLat': 37.7749,  # Same latitude
        'targetLng': -122.4184 # Further East
    }))
    
    time.sleep(5)
