import React from 'react';
import { useRobotStore } from '@/store/useRobotStore';
import { Battery, Wifi, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TopBar: React.FC = () => {
  const { connected, battery, wifiStrength, mode, wsUrl } = useRobotStore();

  return (
    <div className="sticky top-0 z-40 flex flex-col gap-2 p-4 bg-card border-b-2 border-black/80 shadow-panel">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-widest bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent drop-shadow-sm">ARBOR</h1>
        <div className="flex items-center gap-2">
          {wsUrl && (
            <span className="text-[10px] text-muted-foreground mr-1 border border-white/10 px-1 rounded bg-black/20 max-w-[100px] truncate">
              {wsUrl}
            </span>
          )}
          <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_currentColor]`} />
          <span className="text-sm text-muted-foreground uppercase">{connected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-primary" />
          <span>{battery}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-primary" />
          <span>{wifiStrength}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Activity className="w-4 h-4 text-primary" />
          <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 shadow-[0_0_10px_rgba(14,165,233,0.2)]">{mode}</Badge>
        </div>
      </div>
    </div>
  );
};
