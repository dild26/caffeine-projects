import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3x3, 
  Box,
  Eye,
  Camera,
  Layers
} from 'lucide-react';
import { ViewPreset } from './ViewportControls';

interface CADToolbarProps {
  currentView: ViewPreset;
  onViewChange: (view: ViewPreset) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
  onReset: () => void;
  wireframeMode: boolean;
  onToggleWireframe: () => void;
  gridVisible: boolean;
  onToggleGrid: () => void;
  perspectiveMode: boolean;
  onTogglePerspective: () => void;
  showViewCube: boolean;
  onToggleViewCube: () => void;
}

export default function CADToolbar({
  currentView,
  onViewChange,
  onZoomIn,
  onZoomOut,
  onFitToView,
  onReset,
  wireframeMode,
  onToggleWireframe,
  gridVisible,
  onToggleGrid,
  perspectiveMode,
  onTogglePerspective,
  showViewCube,
  onToggleViewCube
}: CADToolbarProps) {
  const views: { id: ViewPreset; label: string; icon: string; tooltip: string; shortcut: string }[] = [
    { id: 'isometric', label: 'ISO', icon: '/assets/generated/isometric-view-icon-transparent.dim_32x32.png', tooltip: 'Isometric View', shortcut: 'I' },
    { id: 'front', label: 'Front', icon: '/assets/generated/front-view-icon-transparent.dim_32x32.png', tooltip: 'Front View (X-Axis)', shortcut: 'F' },
    { id: 'side', label: 'Side', icon: '/assets/generated/side-view-icon-transparent.dim_32x32.png', tooltip: 'Side View (Y-Axis)', shortcut: 'S' },
    { id: 'top', label: 'Top', icon: '/assets/generated/top-view-icon-transparent.dim_32x32.png', tooltip: 'Top View (Z-Axis)', shortcut: 'T' }
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
      <TooltipProvider>
        <div className="flex items-center gap-2 px-4 py-2">
          {/* View Presets */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-muted-foreground mr-2">View:</span>
            {views.map((view) => (
              <Tooltip key={view.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentView === view.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange(view.id)}
                    className="gap-2"
                  >
                    <img src={view.icon} alt={view.label} className="w-4 h-4" />
                    <span className="text-xs">{view.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div>{view.tooltip}</div>
                    <div className="text-xs text-muted-foreground mt-1">Press {view.shortcut}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-muted-foreground mr-2">Zoom:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In (Scroll Up)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out (Scroll Down)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onFitToView}>
                  <img src="/assets/generated/fit-to-view-icon-transparent.dim_32x32.png" alt="Fit" className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit to View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onReset}>
                  <img src="/assets/generated/camera-reset-icon-transparent.dim_32x32.png" alt="Reset" className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View (R)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Display Mode Controls */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-muted-foreground mr-2">Display:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={wireframeMode ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={onToggleWireframe}
                >
                  <img 
                    src={wireframeMode ? '/assets/generated/wireframe-toggle-icon-transparent.dim_32x32.png' : '/assets/generated/solid-toggle-icon-transparent.dim_32x32.png'} 
                    alt="Mode" 
                    className="w-4 h-4" 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{wireframeMode ? 'Wireframe Mode' : 'Solid Mode'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={gridVisible ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={onToggleGrid}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Grid (G)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={perspectiveMode ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={onTogglePerspective}
                >
                  <img 
                    src={perspectiveMode ? '/assets/generated/perspective-icon-transparent.dim_32x32.png' : '/assets/generated/orthographic-icon-transparent.dim_32x32.png'} 
                    alt="Projection" 
                    className="w-4 h-4" 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{perspectiveMode ? 'Perspective' : 'Orthographic'}</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Additional Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showViewCube ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={onToggleViewCube}
                >
                  <img src="/assets/generated/view-cube-icon-transparent.dim_64x64.png" alt="View Cube" className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle View Cube</TooltipContent>
            </Tooltip>
          </div>

          {/* Keyboard Shortcuts Indicator */}
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <img src="/assets/generated/keyboard-shortcut-icon-transparent.dim_16x16.png" alt="Shortcuts" className="w-3 h-3" />
            <span>I/F/S/T: Views | R: Reset | G: Grid</span>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
