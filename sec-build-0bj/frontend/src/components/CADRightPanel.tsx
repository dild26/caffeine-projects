import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Block } from '../types';
import { getBlockDefinition } from '../blockDefinitions';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import WindowControls, { WindowState } from './WindowControls';

interface CADRightPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onClose: () => void;
  wireframeMode: boolean;
  onToggleWireframe: () => void;
  gridVisible: boolean;
  onToggleGrid: () => void;
  ambientLightIntensity: number;
  onAmbientLightChange: (value: number) => void;
}

export default function CADRightPanel({
  selectedBlock,
  onUpdateBlock,
  onClose,
  wireframeMode,
  onToggleWireframe,
  gridVisible,
  onToggleGrid,
  ambientLightIntensity,
  onAmbientLightChange
}: CADRightPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    block: true,
    display: true,
    lighting: false,
    connections: false
  });
  const [windowState, setWindowState] = useState<WindowState>('normal');

  // Global keyboard handlers
  useGlobalKeyboard('cad-right-panel', {
    onEscape: () => {
      if (windowState === 'zoomed') {
        setWindowState('normal');
      } else if (windowState === 'minimized') {
        setWindowState('normal');
      } else {
        onClose();
      }
    },
    enabled: true,
    priority: 7
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const definition = selectedBlock ? getBlockDefinition(selectedBlock.type) : null;

  const handleMinimize = () => {
    setWindowState(windowState === 'minimized' ? 'normal' : 'minimized');
  };

  const handleZoom = () => {
    setWindowState(windowState === 'zoomed' ? 'normal' : 'zoomed');
  };

  const getWidth = () => {
    if (windowState === 'zoomed') {
      return Math.min(window.innerWidth * 0.3, 600);
    }
    return 320;
  };

  return (
    <div 
      className="border-l border-border bg-card flex flex-col shadow-lg gpu-accelerated"
      style={{
        width: getWidth(),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      role="complementary"
      aria-label="CAD properties and settings panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
        <h2 className="text-lg font-semibold">Properties & Settings</h2>
        <WindowControls
          onClose={onClose}
          onMinimize={handleMinimize}
          onZoom={handleZoom}
          windowState={windowState}
        />
      </div>

      {windowState !== 'minimized' && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Block Properties Section */}
            {selectedBlock && definition && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('block')}
                  className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                  aria-expanded={expandedSections.block}
                >
                  <h3 className="text-sm font-semibold">Block Properties</h3>
                  {expandedSections.block ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {expandedSections.block && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Type</div>
                      <div className="text-sm font-medium">{definition.label}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Category</div>
                      <div className="text-sm font-medium capitalize">{definition.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Position</div>
                      <div className="text-xs font-mono">
                        X: {selectedBlock.position.x.toFixed(0)}, Y: {selectedBlock.position.y.toFixed(0)}
                      </div>
                    </div>
                    
                    {definition.configFields && definition.configFields.length > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="space-y-3">
                          {definition.configFields.map(field => (
                            <div key={field.id} className="space-y-1.5">
                              <Label htmlFor={field.id} className="text-xs">{field.label}</Label>
                              {field.type === 'text' && (
                                <Input
                                  id={field.id}
                                  type="text"
                                  value={selectedBlock.config[field.id] || ''}
                                  onChange={(e) => onUpdateBlock(selectedBlock.id, {
                                    config: { ...selectedBlock.config, [field.id]: e.target.value }
                                  })}
                                  placeholder={field.placeholder}
                                  className="h-8 text-xs"
                                />
                              )}
                              {field.type === 'number' && (
                                <Input
                                  id={field.id}
                                  type="number"
                                  value={selectedBlock.config[field.id] || ''}
                                  onChange={(e) => onUpdateBlock(selectedBlock.id, {
                                    config: { ...selectedBlock.config, [field.id]: e.target.value }
                                  })}
                                  placeholder={field.placeholder}
                                  className="h-8 text-xs"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {selectedBlock.outputs && Object.keys(selectedBlock.outputs).length > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">Current Outputs</div>
                          <div className="space-y-2">
                            {Object.entries(selectedBlock.outputs).map(([key, value]) => (
                              <div key={key} className="p-2 bg-muted/50 rounded text-xs">
                                <div className="font-medium text-muted-foreground mb-1">{key}:</div>
                                <div className="font-mono break-all text-[10px]">
                                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {!selectedBlock && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Select a block to view and edit its properties
              </div>
            )}

            <Separator />

            {/* Display Settings Section */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('display')}
                className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                aria-expanded={expandedSections.display}
              >
                <h3 className="text-sm font-semibold">Display Settings</h3>
                {expandedSections.display ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {expandedSections.display && (
                <div className="space-y-3 pl-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wireframe" className="text-xs">Wireframe Mode</Label>
                    <Switch
                      id="wireframe"
                      checked={wireframeMode}
                      onCheckedChange={onToggleWireframe}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-xs">Show Grid</Label>
                    <Switch
                      id="grid"
                      checked={gridVisible}
                      onCheckedChange={onToggleGrid}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Lighting Settings Section */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('lighting')}
                className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                aria-expanded={expandedSections.lighting}
              >
                <h3 className="text-sm font-semibold">Lighting</h3>
                {expandedSections.lighting ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {expandedSections.lighting && (
                <div className="space-y-3 pl-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ambient" className="text-xs">Ambient Light</Label>
                      <span className="text-xs text-muted-foreground">{(ambientLightIntensity * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      id="ambient"
                      value={[ambientLightIntensity]}
                      onValueChange={(values) => onAmbientLightChange(values[0])}
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Connection Info Section */}
            {selectedBlock && (
              <>
                <Separator />
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection('connections')}
                    className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                    aria-expanded={expandedSections.connections}
                  >
                    <h3 className="text-sm font-semibold">Connections</h3>
                    {expandedSections.connections ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  
                  {expandedSections.connections && definition && (
                    <div className="space-y-3 pl-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Input Ports</div>
                        <div className="space-y-1">
                          {definition.inputs.map(input => (
                            <div key={input.id} className="flex items-center gap-2 text-xs p-1.5 bg-success/10 rounded">
                              <div className="w-2 h-2 bg-success rounded-full" />
                              <span>{input.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Output Ports</div>
                        <div className="space-y-1">
                          {definition.outputs.map(output => (
                            <div key={output.id} className="flex items-center gap-2 text-xs p-1.5 bg-warning/10 rounded">
                              <div className="w-2 h-2 bg-warning rounded-full" />
                              <span>{output.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
