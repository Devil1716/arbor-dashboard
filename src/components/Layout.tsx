import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { EmergencyStop } from './EmergencyStop';

export const Layout: React.FC = () => {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Matte / Carbon Texture Simulation */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 pb-24 z-10 relative">
        <Outlet />
      </main>
      <BottomNav />
      <EmergencyStop />
    </div>
  );
};
