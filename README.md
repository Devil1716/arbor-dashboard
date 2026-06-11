# ARBOR Control & Monitoring Dashboard

This is the production-ready React application for controlling and monitoring the ARBOR Autonomous Service Robot.

## Features
- **Live Video Feed**: Supports MJPEG video streams.
- **WebSocket Telemetry**: Real-time stats for battery, IMU, ultrasonics, and ROS2 arbitration.
- **Control Modes**: Manual Joystick, Autonomous, GPS Follow, and Human Tracking.
- **PWA Ready**: Can be installed on mobile devices for native-like experience.

---

## Raspberry Pi Integration Guide

To connect your Raspberry Pi to this dashboard, you need to run two primary services on the Pi:
1. **A Video Streamer (MJPEG)** on port `8080`.
2. **A WebSocket Server** on port `9090` for telemetry and commands.

### 1. Python WebSocket Server (Telemetry & Commands)
You can use the `websockets` library in Python to communicate with the app.

**Install dependencies on the Pi:**
```bash
pip install websockets asyncio
```

**Example `server.py`:**
```python
import asyncio
import websockets
import json
import random

async def arbor_server(websocket, path):
    print("Dashboard connected!")
    try:
        while True:
            # 1. Send Telemetry to Dashboard
            telemetry = {
                "battery": random.randint(50, 100),
                "wifiStrength": "Strong",
                "ultrasonics": {"front": 45, "rear": 120, "left": 30, "right": 80},
                "imu": {"roll": 1.2, "pitch": -0.5, "yaw": 90.0},
                "motors": {"left": 0, "right": 0},
                "ros2Agents": {
                    "navigator": 0.72,
                    "hazard": 0.89,
                    "social": 0.31,
                    "activeWinner": "Hazard Agent"
                }
            }
            await websocket.send(json.dumps(telemetry))
            
            # 2. Receive Commands from Dashboard (Non-blocking)
            try:
                command_msg = await asyncio.wait_for(websocket.recv(), timeout=0.1)
                cmd = json.loads(command_msg)
                print(f"Received command: {cmd}")
                if cmd.get("command") == "emergency_stop":
                    print("EMERGENCY STOP TRIGGERED!")
            except asyncio.TimeoutError:
                pass # No command received this tick

            await asyncio.sleep(1) # Send telemetry every second
    except websockets.exceptions.ConnectionClosed:
        print("Dashboard disconnected")

start_server = websockets.serve(arbor_server, "0.0.0.0", 9090)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
```

### 2. MJPEG Video Streamer
For the camera feed, you can use a simple Flask server with OpenCV.

**Install dependencies:**
```bash
pip install flask opencv-python
```

**Example `video_stream.py`:**
```python
from flask import Flask, Response
import cv2

app = Flask(__name__)
camera = cv2.VideoCapture(0) # Use 0 for Pi Camera or USB camera

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

## Update Pipeline (CI/CD)
This repository includes a GitHub Actions workflow `.github/workflows/release.yml`.
To trigger an automated build and release:
1. Commit your changes.
2. Tag the commit with a version number starting with `v` (e.g., `git tag v1.0.0`).
3. Push the tag to GitHub (`git push origin v1.0.0`).
4. Go to the "Releases" tab on your GitHub repository to download the compiled `.apk` file for Android.

---

## GPS Follow Mode Setup (Raspberry Pi)

To enable the robot to follow your phone:
1. Ensure your phone app has Location Permissions granted.
2. The phone will continuously stream a `gps_target` JSON payload over the WebSocket when in **GPS Follow** mode.
3. Install the required Python packages on your Pi for Serial GPS reading:
   ```bash
   pip install pyserial pynmea2
   ```
4. Use the provided Python script `pi/gps_follow.py` on your Raspberry Pi to parse this target, read from `/dev/serial0`, calculate the Haversine distance and bearing, and steer the robot's motors towards your phone using a P-controller.

