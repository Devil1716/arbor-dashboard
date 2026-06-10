import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { EmergencyStop } from './EmergencyStop';

export const Layout: React.FC = () => {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Subtle ambient glow in the background */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 pb-24 z-10 relative">
        <Outlet />
      </main>
      <BottomNav />
      <EmergencyStop />
    </div>
  );
};
