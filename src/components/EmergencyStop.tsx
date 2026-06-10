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
      className="fixed bottom-20 right-4 w-16 h-16 bg-destructive text-destructive-foreground rounded-full shadow-lg shadow-destructive/50 flex items-center justify-center z-50 active:scale-95 transition-transform"
      aria-label="Emergency Stop"
    >
      <AlertOctagon className="w-8 h-8" />
    </button>
  );
};
