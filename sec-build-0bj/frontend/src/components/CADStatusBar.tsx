import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ViewPreset } from './ViewportControls';

interface CADStatusBarProps {
  cursorPosition: { x: number; y: number; z: number };
  zoomLevel: number;
  currentView: ViewPreset;
  blockCount: number;
  connectionCount: number;
  notification?: string;
  fps?: number;
}

export default function CADStatusBar({
  cursorPosition,
  zoomLevel,
  currentView,
  blockCount,
  connectionCount,
  notification,
  fps
}: CADStatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const viewLabels: Record<ViewPreset, string> = {
    isometric: 'Isometric',
    front: 'Front (X)',
    side: 'Side (Y)',
    top: 'Top (Z)',
    free: 'Free'
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 text-xs">
        {/* Left Section - Cursor Coordinates */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-muted-foreground">X:</span>
            <span className="text-primary font-semibold">{cursorPosition.x.toFixed(2)}</span>
            <span className="text-muted-foreground">Y:</span>
            <span className="text-secondary font-semibold">{cursorPosition.y.toFixed(2)}</span>
            <span className="text-muted-foreground">Z:</span>
            <span className="text-accent font-semibold">{cursorPosition.z.toFixed(2)}</span>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Zoom:</span>
            <span className="font-semibold">{(zoomLevel * 100).toFixed(0)}%</span>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">View:</span>
            <Badge variant="outline" className="text-xs">
              {viewLabels[currentView]}
            </Badge>
          </div>
        </div>

        {/* Center Section - Notifications */}
        <div className="flex-1 flex items-center justify-center">
          {notification && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-md">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-medium">{notification}</span>
            </div>
          )}
        </div>

        {/* Right Section - Stats and Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Blocks:</span>
            <span className="font-semibold text-success">{blockCount}</span>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Connections:</span>
            <span className="font-semibold text-warning">{connectionCount}</span>
          </div>
          
          {fps !== undefined && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">FPS:</span>
                <span className={`font-semibold ${fps > 50 ? 'text-success' : fps > 30 ? 'text-warning' : 'text-destructive'}`}>
                  {fps.toFixed(0)}
                </span>
              </div>
            </>
          )}
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="font-mono text-muted-foreground">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
