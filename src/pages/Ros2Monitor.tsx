import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRobotStore } from '@/store/useRobotStore';
import { Progress } from '@/components/ui/progress';

export const Ros2Monitor: React.FC = () => {
  const { ros2Agents } = useRobotStore();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm text-primary">AMA Arbitration</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Navigator Agent</span>
              <span>{ros2Agents.navigator.toFixed(2)}</span>
            </div>
            <Progress value={ros2Agents.navigator * 100} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Hazard Agent</span>
              <span>{ros2Agents.hazard.toFixed(2)}</span>
            </div>
            <Progress value={ros2Agents.hazard * 100} className="h-2 bg-secondary [&>div]:bg-red-500" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Social Agent</span>
              <span>{ros2Agents.social.toFixed(2)}</span>
            </div>
            <Progress value={ros2Agents.social * 100} className="h-2" />
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground uppercase text-center mb-1">Active Winner</div>
            <div className="text-center text-lg font-bold text-green-500 bg-green-500/10 p-2 rounded border border-green-500/20">
              {ros2Agents.activeWinner}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
