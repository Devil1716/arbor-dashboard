import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRobotStore } from '@/store/useRobotStore';

export const Sensors: React.FC = () => {
  const { ultrasonics, imu, motors } = useRobotStore();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Ultrasonic Sensors</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-secondary rounded border border-border">
              <div className="text-xs text-muted-foreground uppercase">Front</div>
              <div className="text-xl font-bold text-primary">{ultrasonics.front} cm</div>
            </div>
            <div className="p-3 bg-secondary rounded border border-border">
              <div className="text-xs text-muted-foreground uppercase">Rear</div>
              <div className="text-xl font-bold text-primary">{ultrasonics.rear} cm</div>
            </div>
            <div className="p-3 bg-secondary rounded border border-border">
              <div className="text-xs text-muted-foreground uppercase">Left</div>
              <div className="text-xl font-bold text-primary">{ultrasonics.left} cm</div>
            </div>
            <div className="p-3 bg-secondary rounded border border-border">
              <div className="text-xs text-muted-foreground uppercase">Right</div>
              <div className="text-xl font-bold text-primary">{ultrasonics.right} cm</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">IMU Data</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex justify-between items-center text-sm">
            <div>Roll: <span className="text-primary font-mono">{imu.roll.toFixed(2)}°</span></div>
            <div>Pitch: <span className="text-primary font-mono">{imu.pitch.toFixed(2)}°</span></div>
            <div>Yaw: <span className="text-primary font-mono">{imu.yaw.toFixed(2)}°</span></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Motors</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-xs text-muted-foreground uppercase">Left</div>
              <div className="text-lg font-bold">{motors.left}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase">Right</div>
              <div className="text-lg font-bold">{motors.right}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
