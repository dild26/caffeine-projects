import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type WindowState = 'normal' | 'minimized' | 'zoomed';

interface WindowControlsProps {
  onClose: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
  windowState?: WindowState;
  className?: string;
}

export default function WindowControls({
  onClose,
  onMinimize,
  onZoom,
  windowState = 'normal',
  className = ''
}: WindowControlsProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${className}`}>
        {onMinimize && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                aria-label="Minimize window"
              >
                <img 
                  src="/assets/generated/minimize-window-icon-transparent.dim_16x16.png" 
                  alt="" 
                  className="w-4 h-4"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Minimize (collapse to title bar)</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onZoom && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoom();
                }}
                aria-label={windowState === 'zoomed' ? 'Restore window' : 'Zoom window'}
              >
                <img 
                  src="/assets/generated/zoom-window-icon-transparent.dim_16x16.png" 
                  alt="" 
                  className="w-4 h-4"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{windowState === 'zoomed' ? 'Restore to normal size' : 'Zoom to 30% of display (double-click header)'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/20 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close window"
            >
              <img 
                src="/assets/generated/close-window-icon-transparent.dim_16x16.png" 
                alt="" 
                className="w-4 h-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close window</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
