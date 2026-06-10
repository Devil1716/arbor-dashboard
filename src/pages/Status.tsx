import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const Status: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">System Health</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>CPU Usage</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>RAM Usage</span>
              <span>2.1 GB / 8 GB</span>
            </div>
            <Progress value={26} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Temperature</span>
              <span>55°C</span>
            </div>
            <Progress value={55} className="h-2 [&>div]:bg-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Nodes & Connections</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span>ROS2 Node Health</span>
            <Badge variant="outline" className="text-green-500 border-green-500">Healthy</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Arduino Connection</span>
            <Badge variant="outline" className="text-green-500 border-green-500">Connected</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Uptime</span>
            <span className="font-mono text-muted-foreground">04:12:35</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
