import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRobotStore } from '@/store/useRobotStore';
import { Geolocation } from '@capacitor/geolocation';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create a custom icon for the robot
const robotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when tracking
const RecenterAutomatically = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

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
            // WebSocket logic goes here for GPS target
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
    const φ1 = robotLocation.lat * Math.PI/180;
    const φ2 = phoneLocation.lat * Math.PI/180;
    const Δφ = (phoneLocation.lat - robotLocation.lat) * Math.PI/180;
    const Δλ = (phoneLocation.lng - robotLocation.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c;
    return `${d.toFixed(1)}m`;
  };

  // Determine map center (prefer phone, fallback to robot, fallback to generic 0,0)
  const mapCenter: [number, number] = phoneLocation ? [phoneLocation.lat, phoneLocation.lng] : 
                                      (robotLocation ? [robotLocation.lat, robotLocation.lng] : [0, 0]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="flex-1 flex flex-col p-1 border-4 border-black/30 shadow-panel">
        <CardHeader className="py-2 px-3 border-b border-white/5 bg-background/50">
          <CardTitle className="text-sm font-bold flex justify-between">
            <span>Satellite Tracking</span>
            {mode === 'GPS Follow' && permissionGranted && (
              <span className="text-primary animate-pulse">Transmitting...</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-black overflow-hidden shadow-screen rounded-b-md z-0">
          <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {phoneLocation && (
              <>
                <Marker position={[phoneLocation.lat, phoneLocation.lng]}>
                  <Popup>Your Phone</Popup>
                </Marker>
                <RecenterAutomatically lat={phoneLocation.lat} lng={phoneLocation.lng} />
              </>
            )}

            {robotLocation && (
              <Marker position={[robotLocation.lat, robotLocation.lng]} icon={robotIcon}>
                <Popup>ARBOR Robot</Popup>
              </Marker>
            )}
          </MapContainer>
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
