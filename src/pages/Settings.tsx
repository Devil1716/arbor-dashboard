import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRobotStore } from '@/store/useRobotStore';

export const Settings: React.FC = () => {
  const { wsUrl, videoUrl, setUrls } = useRobotStore();
  const [tempWs, setTempWs] = useState(wsUrl || "ws://robot-ip:9090");
  const [tempVid, setTempVid] = useState(videoUrl || "http://robot-ip:8080/video");

  useEffect(() => {
    if (wsUrl) setTempWs(wsUrl);
    if (videoUrl) setTempVid(videoUrl);
  }, [wsUrl, videoUrl]);

  const handleSave = () => {
    setUrls(tempWs, tempVid);
    alert('Connections Saved! Return to the Dashboard to view the live feed.');
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-panel">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Connection Settings</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">WebSocket URL</label>
            <input 
              type="text" 
              value={tempWs} 
              onChange={e => setTempWs(e.target.value)}
              className="w-full bg-card border-2 border-white/10 shadow-bevel rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Video Stream URL</label>
            <input 
              type="text" 
              value={tempVid} 
              onChange={e => setTempVid(e.target.value)}
              className="w-full bg-card border-2 border-white/10 shadow-bevel rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full py-2 bg-primary text-white text-sm rounded shadow-bevel active:shadow-bevel-pressed active:translate-y-[1px] font-semibold transition-all"
          >
            Save Connections
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Robot Configuration</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Maximum Speed (%)</label>
            <input type="number" defaultValue={100} className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Follow Distance (m)</label>
            <input type="number" defaultValue={2} className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button className="w-full py-2 bg-secondary text-foreground text-sm rounded font-semibold active:opacity-80 border border-border">
            Update Config
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
