import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { useRobotStore } from '@/store/useRobotStore';

export const EmergencyStop: React.FC = () => {
  const setEmergencyStop = useRobotStore(state => state.setEmergencyStop);

  const handleStop = () => {
    setEmergencyStop(true);
    // In a real app, send WS message here
    console.warn("EMERGENCY STOP TRIGGERED");
  };

  return (
    <button
      onClick={handleStop}
      className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center z-50 active:scale-90 transition-all hover:scale-105 animate-pulse"
      aria-label="Emergency Stop"
    >
      <AlertOctagon className="w-8 h-8" />
    </button>
  );
};
