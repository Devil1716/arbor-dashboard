import { create } from 'zustand'

export type RobotMode = 'Manual' | 'Autonomous' | 'GPS Follow' | 'Human Tracking'

interface RobotState {
  connected: boolean;
  battery: number;
  wifiStrength: 'Strong' | 'Medium' | 'Weak' | 'Disconnected';
  mode: RobotMode;
  emergencyStop: boolean;
  wsUrl: string | null;
  videoUrl: string | null;
  
  // Telemetry
  ultrasonics: { front: number, rear: number, left: number, right: number };
  imu: { roll: number, pitch: number, yaw: number };
  motors: { left: number, right: number };
  
  // GPS
  robotLocation: { lat: number, lng: number } | null;
  phoneLocation: { lat: number, lng: number } | null;
  
  // ROS2
  ros2Agents: {
    navigator: number;
    hazard: number;
    social: number;
    activeWinner: string;
  };

  // Actions
  setConnected: (status: boolean) => void;
  setMode: (mode: RobotMode) => void;
  setEmergencyStop: (status: boolean) => void;
  setUrls: (ws: string | null, video: string | null) => void;
  updateTelemetry: (data: Partial<RobotState>) => void;
  setPhoneLocation: (lat: number, lng: number) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
  connected: false,
  battery: 0,
  wifiStrength: 'Disconnected',
  mode: 'Manual',
  emergencyStop: false,
  wsUrl: null,
  videoUrl: null,
  
  ultrasonics: { front: 0, rear: 0, left: 0, right: 0 },
  imu: { roll: 0, pitch: 0, yaw: 0 },
  motors: { left: 0, right: 0 },
  
  robotLocation: null,
  phoneLocation: null,
  
  ros2Agents: {
    navigator: 0,
    hazard: 0,
    social: 0,
    activeWinner: 'None',
  },

  setConnected: (status) => set({ connected: status }),
  setMode: (mode) => set({ mode }),
  setEmergencyStop: (status) => set({ emergencyStop: status }),
  setUrls: (ws, video) => {
    set({ wsUrl: ws, videoUrl: video });
    if (ws) {
      import('@/lib/ws').then(({ wsService }) => {
        wsService.connect(ws);
        wsService.onStatusChange = (status) => set({ connected: status });
      });
    }
  },
  updateTelemetry: (data) => set((state) => ({ ...state, ...data })),
  setPhoneLocation: (lat, lng) => set({ phoneLocation: { lat, lng } }),
}))
