import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { EmergencyStop } from './EmergencyStop';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <EmergencyStop />
    </div>
  );
};
