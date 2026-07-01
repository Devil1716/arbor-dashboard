import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Circle } from 'lucide-react';
import { wsService } from '@/lib/ws';

export const Joystick: React.FC = () => {
  const [activeDir, setActiveDir] = useState<string | null>(null);

  const handleCommand = (cmd: string) => {
    setActiveDir(cmd);
    wsService.send({ type: 'cmd', val: cmd });
  };

  const handleRelease = () => {
    setActiveDir(null);
    wsService.send({ type: 'cmd', val: 'stop' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handleCommand('forward');
      if (e.key === 'ArrowDown') handleCommand('backward');
      if (e.key === 'ArrowLeft') handleCommand('left');
      if (e.key === 'ArrowRight') handleCommand('right');
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const btnClass = "w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-primary active:bg-primary active:text-primary-foreground transition-colors border border-border touch-none select-none";
  const activeClass = "bg-primary text-primary-foreground";

  return (
    <div className="relative w-48 h-48 bg-card rounded-full flex items-center justify-center shadow-inner border border-border">
      <div className="absolute top-2">
        <button 
          className={`${btnClass} ${activeDir === 'forward' ? activeClass : ''}`}
          onPointerDown={() => handleCommand('forward')}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          <ArrowUp />
        </button>
      </div>
      <div className="absolute bottom-2">
        <button 
          className={`${btnClass} ${activeDir === 'backward' ? activeClass : ''}`}
          onPointerDown={() => handleCommand('backward')}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          <ArrowDown />
        </button>
      </div>
      <div className="absolute left-2">
        <button 
          className={`${btnClass} ${activeDir === 'left' ? activeClass : ''}`}
          onPointerDown={() => handleCommand('left')}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          <ArrowLeft />
        </button>
      </div>
      <div className="absolute right-2">
        <button 
          className={`${btnClass} ${activeDir === 'right' ? activeClass : ''}`}
          onPointerDown={() => handleCommand('right')}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          <ArrowRight />
        </button>
      </div>
      <div className="absolute">
        <button 
          className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center active:bg-red-500 active:text-white border border-red-500/50 transition-colors touch-none"
          onPointerDown={() => handleCommand('stop')}
        >
          <Circle className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
};
