import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRobotStore, type RobotMode } from '@/store/useRobotStore';
import { Joystick } from '@/components/Joystick';
import { Slider } from '@/components/ui/slider';
import { Wifi, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { mode, setMode, piIpAddress, setPiIpAddress } = useRobotStore();
  const modes: RobotMode[] = ['Manual', 'Autonomous', 'GPS Follow', 'Human Tracking'];
  
  const [tempIp, setTempIp] = useState('');

  const handleConnect = () => {
    if (tempIp.trim()) {
      setPiIpAddress(tempIp.trim());
    }
  };

  const handleDisconnect = () => {
    setPiIpAddress(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-primary/20 shadow-panel">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Live Telecast
          </CardTitle>
          {piIpAddress && (
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 text-[10px]">LIVE</Badge>
              <button onClick={handleDisconnect} className="text-muted-foreground hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-black w-full aspect-video flex items-center justify-center relative overflow-hidden shadow-screen rounded-b-md">
            {!piIpAddress ? (
              <div className="flex flex-col items-center gap-4 p-6 w-full max-w-sm">
                <div className="text-center">
                  <h3 className="font-bold text-white mb-1">Connect to ARBOR</h3>
                  <p className="text-xs text-muted-foreground">Enter your Raspberry Pi IP Address</p>
                </div>
                <input 
                  type="text" 
                  value={tempIp}
                  onChange={(e) => setTempIp(e.target.value)}
                  placeholder="e.g. 192.168.1.50"
                  className="w-full bg-card border-2 border-white/10 rounded-md p-2 text-center text-sm shadow-bevel focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  onClick={handleConnect}
                  className="bg-primary text-white font-bold py-2 px-6 rounded-md shadow-bevel active:translate-y-1 active:shadow-bevel-pressed transition-all text-sm w-full"
                >
                  Connect Stream
                </button>
              </div>
            ) : (
              <>
                <img 
                  src={`http://${piIpAddress}:8080/video`} 
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
