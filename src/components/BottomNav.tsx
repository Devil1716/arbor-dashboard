import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, Activity, Radio, Settings, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/gps", icon: MapIcon, label: "GPS" },
    { to: "/sensors", icon: Activity, label: "Sensors" },
    { to: "/ros2", icon: Radio, label: "ROS2" },
    { to: "/status", icon: Server, label: "Status" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-card/80 backdrop-blur-md border-t border-border/50 p-2 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <ul className="flex justify-around items-center">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center p-2 text-xs transition-colors rounded-lg",
                  isActive ? "text-primary bg-primary/20 shadow-[inset_0_0_12px_rgba(14,165,233,0.1)]" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )
              }
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
