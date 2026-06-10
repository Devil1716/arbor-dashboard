import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRobotStore } from '@/store/useRobotStore';

export const GpsTracking: React.FC = () => {
  const { robotLocation } = useRobotStore();

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">GPS Tracking</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-muted">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {/* Minimal Map Placeholder */}
            <span>Map View (Requires Leaflet Map setup)</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs text-muted-foreground">Robot Position</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-sm font-mono">
              {robotLocation ? `${robotLocation.lat.toFixed(4)}, ${robotLocation.lng.toFixed(4)}` : 'Waiting...'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs text-muted-foreground">Distance</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-lg font-bold text-primary">
              12.4m
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
