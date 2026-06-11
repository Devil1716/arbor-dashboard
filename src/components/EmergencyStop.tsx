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
      className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-red-400 to-red-800 text-white rounded-full shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_6px_10px_rgba(0,0,0,0.6)] flex items-center justify-center z-50 active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.6)] active:translate-y-1 transition-all border-b-4 border-red-900 active:border-b-0"
      aria-label="Emergency Stop"
    >
      <AlertOctagon className="w-8 h-8" />
    </button>
  );
};
