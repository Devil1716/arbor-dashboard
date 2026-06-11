import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRobotStore } from '@/store/useRobotStore';
import { Geolocation } from '@capacitor/geolocation';

export const GpsTracking: React.FC = () => {
  const { robotLocation, phoneLocation, setPhoneLocation, mode } = useRobotStore();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    let watchId: string;

    const startTracking = async () => {
      try {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location !== 'granted') {
          const request = await Geolocation.requestPermissions();
          if (request.location !== 'granted') return;
        }
        setPermissionGranted(true);

        watchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, (position, err) => {
          if (err) {
            console.error("Watch position error:", err);
            return;
          }
          if (position) {
            setPhoneLocation(position.coords.latitude, position.coords.longitude);
            
            // In a real app, send to Raspberry Pi here via WebSocket:
            // if (useRobotStore.getState().mode === 'GPS Follow') {
            //   ws.send(JSON.stringify({ command: 'gps_target', lat: position.coords.latitude, lng: position.coords.longitude }));
            // }
          }
        });
      } catch (e) {
        console.error("Error setting up GPS tracking", e);
      }
    };

    startTracking();

    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [setPhoneLocation]);

  // Calculate distance for UI demonstration (Haversine)
  const calculateDistance = () => {
    if (!robotLocation || !phoneLocation) return 'Waiting...';
    
    const R = 6371e3; // metres
    const φ1 = robotLocation.lat * Math.PI/180; // φ, λ in radians
    const φ2 = phoneLocation.lat * Math.PI/180;
    const Δφ = (phoneLocation.lat - robotLocation.lat) * Math.PI/180;
    const Δλ = (phoneLocation.lng - robotLocation.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return `${d.toFixed(1)}m`;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">GPS Tracking</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-muted/50 rounded-b-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-4 text-center">
            {mode === 'GPS Follow' && permissionGranted ? (
              <span className="text-primary font-bold animate-pulse">Transmitting Location to ARBOR...</span>
            ) : (
              <span>Map View (Requires Leaflet Map setup)</span>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs text-muted-foreground">Phone Location</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-sm font-mono text-primary truncate">
              {phoneLocation ? `${phoneLocation.lat.toFixed(5)}, ${phoneLocation.lng.toFixed(5)}` : 'Locating...'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs text-muted-foreground">Distance to Target</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-lg font-bold text-primary">
              {calculateDistance()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
