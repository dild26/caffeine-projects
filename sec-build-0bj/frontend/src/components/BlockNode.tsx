import { useRef, useState, useEffect } from 'react';
import { Block } from '../types';
import { getBlockDefinition } from '../blockDefinitions';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import WindowControls, { WindowState } from './WindowControls';

interface BlockNodeProps {
  block: Block;
  isSelected: boolean;
  isExecuting: boolean;
  onSelect: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onStartConnection: (blockId: string, port: string) => void;
  onEndConnection: (blockId: string, port: string) => void;
  onDelete: () => void;
}

export default function BlockNode({
  block,
  isSelected,
  isExecuting,
  onSelect,
  onMove,
  onStartConnection,
  onEndConnection,
  onDelete
}: BlockNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [lastClickTime, setLastClickTime] = useState(0);

  const definition = getBlockDefinition(block.type);

  // Global keyboard handlers for selected block
  useGlobalKeyboard(`block-${block.id}`, {
    onEscape: () => {
      if (isSelected) {
        if (windowState === 'zoomed') {
          setWindowState('normal');
        } else if (windowState === 'normal') {
          setWindowState('minimized');
        }
      }
    },
    enabled: isSelected,
    priority: 10
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === nodeRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - block.position.x,
        y: e.clientY - block.position.y
      });
      onSelect();
      e.stopPropagation();
    }
  };

  const handleHeaderDoubleClick = () => {
    if (windowState === 'zoomed') {
      setWindowState('normal');
    } else {
      setWindowState('zoomed');
    }
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      handleHeaderDoubleClick();
    }
    setLastClickTime(now);
  };

  const handleMinimize = () => {
    setWindowState(windowState === 'minimized' ? 'normal' : 'minimized');
  };

  const handleZoom = () => {
    setWindowState(windowState === 'zoomed' ? 'normal' : 'zoomed');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, onMove]);

  if (!definition) return null;

  const categoryColors = {
    inputs: 'from-blue-500 to-blue-600',
    logic: 'from-purple-500 to-purple-600',
    conversion: 'from-teal-500 to-teal-600',
    cryptographic: 'from-pink-500 to-pink-600',
    ethereum: 'from-indigo-500 to-indigo-600',
    blockchain: 'from-emerald-500 to-emerald-600',
    display: 'from-orange-500 to-orange-600'
  };

  // Calculate dimensions based on window state
  const getWidth = () => {
    if (windowState === 'zoomed') {
      return Math.min(window.innerWidth * 0.3, 600);
    }
    return 200;
  };

  const getTransform = () => {
    if (windowState === 'zoomed') {
      return 'scale(1.0)';
    }
    return 'scale(1.0)';
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move select-none gpu-accelerated ${isExecuting ? 'animate-pulse' : ''}`}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: getWidth(),
        transform: getTransform(),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: windowState === 'zoomed' ? 1000 : isSelected ? 100 : 1
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`${definition.label} block`}
    >
      <div
        className={`rounded-lg border-2 bg-card shadow-lg transition-all ${
          isSelected ? 'border-primary shadow-primary/50' : 'border-border'
        } ${windowState === 'zoomed' ? 'shadow-2xl' : ''}`}
      >
        {/* Header */}
        <div 
          className={`px-3 py-2 rounded-t-md bg-gradient-to-r ${categoryColors[definition.category]} text-white flex items-center justify-between cursor-pointer`}
          onClick={handleHeaderClick}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img src={definition.icon} alt="" className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium truncate">{definition.label}</span>
          </div>
          <WindowControls
            onClose={onDelete}
            onMinimize={handleMinimize}
            onZoom={handleZoom}
            windowState={windowState}
          />
        </div>

        {/* Body - hidden when minimized */}
        {windowState !== 'minimized' && (
          <div className="p-3 space-y-2">
            {/* Input ports */}
            {definition.inputs.map(input => (
              <div key={input.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full bg-primary border-2 border-background cursor-pointer hover:scale-125 transition-transform"
                  onMouseUp={() => onEndConnection(block.id, input.id)}
                  role="button"
                  aria-label={`${input.label} input port`}
                />
                <span className="text-xs text-muted-foreground">{input.label}</span>
              </div>
            ))}

            {/* Output display for display blocks */}
            {definition.category === 'display' && block.outputs?.displayValue !== undefined && (
              <div className="mt-2 p-2 bg-muted rounded text-xs font-mono break-all max-h-40 overflow-y-auto">
                {String(block.outputs.displayValue)}
              </div>
            )}

            {/* Output ports */}
            {definition.outputs.map(output => (
              <div key={output.id} className="flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">{output.label}</span>
                <div
                  className="w-3 h-3 rounded-full bg-accent border-2 border-background cursor-pointer hover:scale-125 transition-transform"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onStartConnection(block.id, output.id);
                  }}
                  role="button"
                  aria-label={`${output.label} output port`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
