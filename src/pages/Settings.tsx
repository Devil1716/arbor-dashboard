import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Settings: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Connection Settings</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">WebSocket URL</label>
            <input type="text" defaultValue="ws://robot-ip:9090" className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Video Stream URL</label>
            <input type="text" defaultValue="http://robot-ip:8080/video" className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button className="w-full py-2 bg-primary text-primary-foreground text-sm rounded font-semibold active:opacity-80">
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
