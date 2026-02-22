import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, SplitSquareHorizontal } from 'lucide-react';

export type ViewPreset = 'isometric' | 'front' | 'side' | 'top' | 'free';

interface ViewportControlsProps {
  currentView: ViewPreset;
  onViewChange: (view: ViewPreset) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleSplitView: () => void;
  splitViewEnabled: boolean;
}

export default function ViewportControls({
  currentView,
  onViewChange,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleSplitView,
  splitViewEnabled
}: ViewportControlsProps) {
  const views: { id: ViewPreset; label: string; icon: string; tooltip: string }[] = [
    { id: 'isometric', label: 'ISO', icon: '/assets/generated/isometric-view-icon-transparent.dim_32x32.png', tooltip: 'Isometric View' },
    { id: 'front', label: 'X', icon: '/assets/generated/front-view-icon-transparent.dim_32x32.png', tooltip: 'Front View (X-Axis)' },
    { id: 'side', label: 'Y', icon: '/assets/generated/side-view-icon-transparent.dim_32x32.png', tooltip: 'Side View (Y-Axis)' },
    { id: 'top', label: 'Z', icon: '/assets/generated/top-view-icon-transparent.dim_32x32.png', tooltip: 'Top View (Z-Axis)' }
  ];

  return (
    <div className="absolute top-4 right-4 z-10 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2">
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          {/* View Presets */}
          <div className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-muted-foreground px-2 mb-1">CAD Views</div>
            {views.map((view) => (
              <Tooltip key={view.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentView === view.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange(view.id)}
                    className="w-full justify-start gap-2"
                  >
                    <img src={view.icon} alt={view.label} className="w-4 h-4" />
                    <span className="text-xs font-medium">{view.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{view.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator />

          {/* Zoom Controls */}
          <div className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-muted-foreground px-2 mb-1">Zoom</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onZoomIn} className="w-full justify-start gap-2">
                  <ZoomIn className="w-4 h-4" />
                  <span className="text-xs">Zoom In</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom In (Scroll Up)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onZoomOut} className="w-full justify-start gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <span className="text-xs">Zoom Out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom Out (Scroll Down)</TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          {/* Additional Controls */}
          <div className="flex flex-col gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onReset} className="w-full justify-start gap-2">
                  <img src="/assets/generated/camera-reset-icon-transparent.dim_32x32.png" alt="Reset" className="w-4 h-4" />
                  <span className="text-xs">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Reset Camera (R)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={splitViewEnabled ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={onToggleSplitView} 
                  className="w-full justify-start gap-2"
                >
                  <img src="/assets/generated/split-viewport-icon-transparent.dim_32x32.png" alt="Split" className="w-4 h-4" />
                  <span className="text-xs">Split</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Toggle Split View (S)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
