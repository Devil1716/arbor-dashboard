import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRobotStore, type RobotMode } from '@/store/useRobotStore';
import { Joystick } from '@/components/Joystick';
import { Slider } from '@/components/ui/slider';

export const Dashboard: React.FC = () => {
  const { mode, setMode } = useRobotStore();
  const modes: RobotMode[] = ['Manual', 'Autonomous', 'GPS Follow', 'Human Tracking'];

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-primary/20">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Live Camera</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-500 border-green-500/50 text-[10px]">30 FPS</Badge>
            <Badge variant="outline" className="text-green-500 border-green-500/50 text-[10px]">12ms</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-black w-full aspect-video flex items-center justify-center relative overflow-hidden">
            {/* Placeholder for real MJPEG stream */}
            <span className="text-muted-foreground animate-pulse">Waiting for video stream...</span>
            <div className="absolute inset-0 border border-primary/20 pointer-events-none" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Operation Mode</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {modes.map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`p-2 rounded border text-xs font-semibold transition-colors ${
                  mode === m 
                    ? 'bg-gradient-to-r from-primary to-blue-500 text-white border-transparent shadow-[0_0_15px_rgba(14,165,233,0.4)] scale-105' 
                    : 'bg-card/50 text-muted-foreground border-border/50 hover:border-primary/50 hover:bg-card'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {mode === 'Manual' && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm">Manual Control</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex flex-col items-center gap-6">
            <Joystick />
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Speed</span>
                <span>50%</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
