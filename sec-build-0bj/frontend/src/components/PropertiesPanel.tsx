import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '../types';
import { getBlockDefinition } from '../blockDefinitions';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import WindowControls, { WindowState } from './WindowControls';

interface PropertiesPanelProps {
  block?: Block;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onClose: () => void;
}

export default function PropertiesPanel({ block, onUpdateBlock, onClose }: PropertiesPanelProps) {
  const [livePreview, setLivePreview] = useState<any>(null);
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [lastClickTime, setLastClickTime] = useState(0);

  // Global keyboard handlers
  useGlobalKeyboard('properties-panel', {
    onEscape: () => {
      if (windowState === 'zoomed') {
        setWindowState('normal');
      } else if (windowState === 'normal') {
        setWindowState('minimized');
      } else {
        onClose();
      }
    },
    enabled: true,
    priority: 8
  });

  useEffect(() => {
    if (!block) return;
    
    const definition = getBlockDefinition(block.type);
    if (!definition || !definition.execute) return;

    // Generate live preview for conversion blocks
    if (['to-hex', 'to-hash', 'to-binary', 'to-decimal', 'to-ascii', 'to-base64'].includes(block.type)) {
      const inputs: Record<string, any> = {};
      
      // Get input values from config or use defaults
      if (block.type === 'to-hex') {
        inputs.input = block.config.previewInput || 'Hello';
      } else if (block.type === 'to-hash') {
        inputs.input = block.config.previewInput || 'Hello World';
      } else if (block.type === 'to-binary') {
        inputs.input = block.config.previewInput || '0x48656c6c6f';
      } else if (block.type === 'to-decimal') {
        inputs.input = block.config.previewInput || '0xFF';
      } else if (block.type === 'to-ascii') {
        inputs.input = block.config.previewInput || '0x48656c6c6f';
      } else if (block.type === 'to-base64') {
        inputs.input = block.config.previewInput || 'Hello World';
      }

      definition.execute(block.config, inputs)
        .then(result => setLivePreview(result))
        .catch(error => setLivePreview({ error: error.message }));
    }
  }, [block?.config, block?.type]);

  const handleHeaderDoubleClick = () => {
    if (windowState === 'zoomed') {
      setWindowState('normal');
    } else {
      setWindowState('zoomed');
    }
  };

  const handleHeaderClick = () => {
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

  const getWidth = () => {
    if (windowState === 'zoomed') {
      return Math.min(window.innerWidth * 0.3, 600);
    }
    return 320;
  };

  if (!block) {
    return (
      <div 
        className="border-l border-border bg-card flex flex-col gpu-accelerated"
        style={{
          width: getWidth(),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        role="complementary"
        aria-label="Properties panel"
      >
        <div 
          className="p-4 border-b border-border flex items-center justify-between cursor-pointer"
          onClick={handleHeaderClick}
        >
          <h2 className="text-lg font-semibold">Properties</h2>
          <WindowControls
            onClose={onClose}
            onMinimize={handleMinimize}
            onZoom={handleZoom}
            windowState={windowState}
          />
        </div>
        {windowState !== 'minimized' && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a block to edit properties
          </div>
        )}
      </div>
    );
  }

  const definition = getBlockDefinition(block.type);
  if (!definition) return null;

  const handleConfigChange = (fieldId: string, value: any) => {
    onUpdateBlock(block.id, {
      config: { ...block.config, [fieldId]: value }
    });
  };

  const isConversionBlock = ['to-hex', 'to-hash', 'to-binary', 'to-decimal', 'to-ascii', 'to-base64'].includes(block.type);

  const getDocumentation = () => {
    switch (block.type) {
      case 'to-hex':
        return {
          description: 'Converts string, number, or binary input to hexadecimal format with 0x prefix.',
          examples: [
            { title: 'String to Hex', code: 'echo -n "Hello" | xxd -p', result: '48656c6c6f' },
            { title: 'Number to Hex', code: 'printf "0x%x\\n" 255', result: '0xff' },
            { title: 'JavaScript', code: 'Buffer.from("Hello").toString("hex")', result: '48656c6c6f' }
          ]
        };
      case 'to-hash':
        return {
          description: 'Generates SHA256 or Keccak256 hash from input data.',
          examples: [
            { title: 'SHA256 Hash', code: 'echo -n "Hello World" | sha256sum', result: 'a591a6d4...' },
            { title: 'Keccak256 (Ethereum)', code: 'web3.utils.keccak256("Hello World")', result: '0x592fa743...' },
            { title: 'JavaScript', code: 'crypto.subtle.digest("SHA-256", data)', result: 'ArrayBuffer' }
          ]
        };
      case 'to-binary':
        return {
          description: 'Converts hex or string input to binary representation (grouped every 8 bits).',
          examples: [
            { title: 'Hex to Binary', code: 'echo "obase=2; ibase=16; FF" | bc', result: '11111111' },
            { title: 'String to Binary', code: 'echo -n "A" | xxd -b', result: '01000001' },
            { title: 'JavaScript', code: '(0xFF).toString(2)', result: '11111111' }
          ]
        };
      default:
        return null;
    }
  };

  const docs = getDocumentation();

  return (
    <div 
      className="border-l border-border bg-card flex flex-col gpu-accelerated"
      style={{
        width: getWidth(),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxHeight: windowState === 'zoomed' ? '90vh' : 'none'
      }}
      role="complementary"
      aria-label="Properties panel"
    >
      <div 
        className="p-4 border-b border-border flex items-center justify-between cursor-pointer"
        onClick={handleHeaderClick}
      >
        <h2 className="text-lg font-semibold">Properties</h2>
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
            <div>
              <h3 className="font-semibold mb-1">{definition.label}</h3>
              <p className="text-xs text-muted-foreground capitalize">{definition.category}</p>
            </div>

            {isConversionBlock && docs ? (
              <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                </TabsList>

                <TabsContent value="config" className="space-y-4 mt-4">
                  {definition.configFields && definition.configFields.length > 0 && (
                    <div className="space-y-4">
                      {definition.configFields.map(field => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={field.id}>{field.label}</Label>
                          {field.type === 'text' && (
                            <Input
                              id={field.id}
                              type="text"
                              value={block.config[field.id] || ''}
                              onChange={(e) => handleConfigChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}
                          {field.type === 'number' && (
                            <Input
                              id={field.id}
                              type="number"
                              value={block.config[field.id] || ''}
                              onChange={(e) => handleConfigChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}
                          {field.type === 'textarea' && (
                            <Textarea
                              id={field.id}
                              value={block.config[field.id] || ''}
                              onChange={(e) => handleConfigChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              rows={4}
                            />
                          )}
                          {field.type === 'select' && field.options && (
                            <Select
                              value={block.config[field.id] || field.options[0]?.value}
                              onValueChange={(value) => handleConfigChange(field.id, value)}
                            >
                              <SelectTrigger id={field.id}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {field.type === 'checkbox' && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={field.id}
                                checked={block.config[field.id] ?? field.defaultValue ?? false}
                                onCheckedChange={(checked) => handleConfigChange(field.id, checked)}
                              />
                              <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
                                {field.label}
                              </Label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="preview-input">Test Input</Label>
                    <Input
                      id="preview-input"
                      type="text"
                      value={block.config.previewInput || ''}
                      onChange={(e) => handleConfigChange('previewInput', e.target.value)}
                      placeholder="Enter test input..."
                    />
                  </div>
                  
                  {livePreview && (
                    <div className="space-y-2">
                      <Label>Live Output</Label>
                      <div className="p-3 bg-muted rounded-md border border-border">
                        {livePreview.error ? (
                          <div className="text-destructive text-xs font-mono">
                            Error: {livePreview.error}
                          </div>
                        ) : (
                          <div className="text-xs font-mono break-all">
                            {Object.entries(livePreview).map(([key, value]) => (
                              <div key={key} className="mb-2 last:mb-0">
                                <span className="text-muted-foreground">{key}: </span>
                                <span className="text-foreground">
                                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="docs" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">{docs.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Examples</h4>
                      {docs.examples.map((example, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">{example.title}</div>
                          <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                            <div className="text-primary mb-1">$ {example.code}</div>
                            <div className="text-muted-foreground">{example.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <>
                {definition.configFields && definition.configFields.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold">Configuration</h4>
                    {definition.configFields.map(field => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        {field.type === 'text' && (
                          <Input
                            id={field.id}
                            type="text"
                            value={block.config[field.id] || ''}
                            onChange={(e) => handleConfigChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        )}
                        {field.type === 'number' && (
                          <Input
                            id={field.id}
                            type="number"
                            value={block.config[field.id] || ''}
                            onChange={(e) => handleConfigChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        )}
                        {field.type === 'textarea' && (
                          <Textarea
                            id={field.id}
                            value={block.config[field.id] || ''}
                            onChange={(e) => handleConfigChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                          />
                        )}
                        {field.type === 'select' && field.options && (
                          <Select
                            value={block.config[field.id] || field.options[0]?.value}
                            onValueChange={(value) => handleConfigChange(field.id, value)}
                          >
                            <SelectTrigger id={field.id}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {field.type === 'checkbox' && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={field.id}
                              checked={block.config[field.id] ?? field.defaultValue ?? false}
                              onCheckedChange={(checked) => handleConfigChange(field.id, checked)}
                            />
                            <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {block.outputs && Object.keys(block.outputs).length > 0 && (
              <div className="space-y-2 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold">Current Outputs</h4>
                <div className="space-y-2">
                  {Object.entries(block.outputs).map(([key, value]) => (
                    <div key={key} className="p-2 bg-muted rounded text-xs">
                      <div className="font-medium text-muted-foreground mb-1">{key}:</div>
                      <div className="font-mono break-all">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
