import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRobotStore, type RobotMode } from '@/store/useRobotStore';
import { Joystick } from '@/components/Joystick';
import { Slider } from '@/components/ui/slider';
import { Wifi } from 'lucide-react';
export const Dashboard: React.FC = () => {
  const { mode, setMode, videoUrl } = useRobotStore();
  const modes: RobotMode[] = ['Manual', 'Autonomous', 'GPS Follow', 'Human Tracking'];

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-primary/20 shadow-panel">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Live Telecast
          </CardTitle>
          {videoUrl && (
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 text-[10px]">LIVE</Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-black w-full aspect-video flex items-center justify-center relative overflow-hidden shadow-screen rounded-b-md">
            {!videoUrl ? (
              <div className="flex flex-col items-center gap-4 p-6 w-full text-center">
                <h3 className="font-bold text-white mb-1">No Video Stream Configured</h3>
                <p className="text-xs text-muted-foreground">Please configure the connection URLs in the Settings tab.</p>
              </div>
            ) : (
              <>
                <img 
                  src={videoUrl} 
                  alt="Live Telecast" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('error-state');
                  }}
                />
                <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none rounded-b-md" />
              </>
            )}
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
                    ? 'bg-primary text-white border-black/50 shadow-bevel-pressed translate-y-[1px]' 
                    : 'bg-card text-muted-foreground border-black/50 shadow-bevel hover:text-primary'
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
