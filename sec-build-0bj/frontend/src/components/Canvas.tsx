import { useState, useRef, useCallback } from 'react';
import WebGLCanvas from './WebGLCanvas';
import { Block, Connection, ExecutionState } from '../types';
import { ViewPreset } from './ViewportControls';

interface CanvasProps {
  blocks: Block[];
  connections: Connection[];
  selectedBlockId: string | null;
  executionState: ExecutionState;
  onAddBlock: (blockType: string, position: { x: number; y: number }) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
  onSelectBlock: (id: string | null) => void;
  onAddConnection: (connection: Connection) => void;
  onDeleteConnection: (fromBlockId: string, fromPort: string, toBlockId: string, toPort: string) => void;
  useWebGLRendering: boolean;
  currentView?: ViewPreset;
  splitViewEnabled?: boolean;
}

export default function Canvas(props: CanvasProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [connectingFrom, setConnectingFrom] = useState<{ blockId: string; port: string } | null>(null);
  const [tempConnection, setTempConnection] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    if (blockType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      props.onAddBlock(blockType, { x, y });
    }
  }, [pan, zoom, props]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  if (props.useWebGLRendering) {
    return (
      <div 
        ref={canvasRef}
        className="flex-1 relative bg-background overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <WebGLCanvas
          blocks={props.blocks}
          connections={props.connections}
          selectedBlockId={props.selectedBlockId}
          executionState={props.executionState}
          pan={pan}
          zoom={zoom}
          onPanChange={setPan}
          onZoomChange={setZoom}
          onSelectBlock={props.onSelectBlock}
          onUpdateBlock={props.onUpdateBlock}
          onDeleteBlock={props.onDeleteBlock}
          onStartConnection={(blockId, port) => setConnectingFrom({ blockId, port })}
          onEndConnection={(blockId, port) => {
            if (connectingFrom) {
              props.onAddConnection({
                fromBlockId: connectingFrom.blockId,
                fromPort: connectingFrom.port,
                toBlockId: blockId,
                toPort: port
              });
              setConnectingFrom(null);
            }
          }}
          connectingFrom={connectingFrom}
          tempConnection={tempConnection}
          currentView={props.currentView}
          splitViewEnabled={props.splitViewEnabled}
        />
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className="flex-1 relative bg-background overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <p>CPU Rendering Mode - Enable WebGL for 3D visualization</p>
      </div>
    </div>
  );
}
