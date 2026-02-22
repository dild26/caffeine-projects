import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PortDefinition } from '../types';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import WindowControls, { WindowState } from './WindowControls';

interface CustomBlockBuilderProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomBlockBuilder({ open, onClose }: CustomBlockBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'inputs' | 'logic' | 'cryptographic' | 'blockchain' | 'display'>('logic');
  const [inputPorts, setInputPorts] = useState<PortDefinition[]>([]);
  const [outputPorts, setOutputPorts] = useState<PortDefinition[]>([]);
  const [logic, setLogic] = useState('// Define your block logic here\n// Available: config, inputs\n// Return: outputs object\n\nreturn { result: inputs.value };');
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [lastClickTime, setLastClickTime] = useState(0);

  // Global keyboard handlers
  useGlobalKeyboard('custom-block-builder', {
    onEscape: () => {
      if (windowState === 'zoomed') {
        setWindowState('normal');
      } else if (windowState === 'minimized') {
        setWindowState('normal');
      } else {
        handleClose();
      }
    },
    onEnter: () => {
      if (name.trim()) {
        handleSave();
      }
    },
    enabled: open,
    priority: 9
  });

  const addInputPort = () => {
    setInputPorts([...inputPorts, { id: `input${inputPorts.length + 1}`, label: 'Input', type: 'any' }]);
  };

  const addOutputPort = () => {
    setOutputPorts([...outputPorts, { id: `output${outputPorts.length + 1}`, label: 'Output', type: 'any' }]);
  };

  const removeInputPort = (index: number) => {
    setInputPorts(inputPorts.filter((_, i) => i !== index));
  };

  const removeOutputPort = (index: number) => {
    setOutputPorts(outputPorts.filter((_, i) => i !== index));
  };

  const updateInputPort = (index: number, field: keyof PortDefinition, value: string) => {
    const updated = [...inputPorts];
    updated[index] = { ...updated[index], [field]: value };
    setInputPorts(updated);
  };

  const updateOutputPort = (index: number, field: keyof PortDefinition, value: string) => {
    const updated = [...outputPorts];
    updated[index] = { ...updated[index], [field]: value };
    setOutputPorts(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a block name');
      return;
    }

    const customBlock = {
      id: `custom-${Date.now()}`,
      name,
      description,
      category,
      inputPorts,
      outputPorts,
      logic
    };

    // Save to localStorage for now (could be extended to backend)
    const savedBlocks = JSON.parse(localStorage.getItem('custom-blocks') || '[]');
    savedBlocks.push(customBlock);
    localStorage.setItem('custom-blocks', JSON.stringify(savedBlocks));

    toast.success('Custom block created successfully!');
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setCategory('logic');
    setInputPorts([]);
    setOutputPorts([]);
    setLogic('// Define your block logic here\n// Available: config, inputs\n// Return: outputs object\n\nreturn { result: inputs.value };');
    onClose();
  };

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

  const getMaxWidth = () => {
    if (windowState === 'zoomed') {
      return '90vw';
    }
    return '48rem';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto gpu-accelerated"
        style={{
          maxWidth: getMaxWidth(),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        aria-describedby="custom-block-builder-description"
      >
        <DialogHeader 
          className="cursor-pointer"
          onClick={handleHeaderClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Custom Block Builder</DialogTitle>
              <DialogDescription id="custom-block-builder-description">
                Create your own custom blocks with defined inputs, outputs, and logic. Press Esc to close, Enter to save.
              </DialogDescription>
            </div>
            <WindowControls
              onClose={handleClose}
              onMinimize={handleMinimize}
              onZoom={handleZoom}
              windowState={windowState}
            />
          </div>
        </DialogHeader>

        {windowState !== 'minimized' && (
          <>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Block Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Custom Block"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this block do?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inputs">Inputs</SelectItem>
                    <SelectItem value="logic">Logic</SelectItem>
                    <SelectItem value="cryptographic">Cryptographic</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="display">Display</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Input Ports</Label>
                  <Button size="sm" variant="outline" onClick={addInputPort}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Input
                  </Button>
                </div>
                <div className="space-y-2">
                  {inputPorts.map((port, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="Port ID"
                        value={port.id}
                        onChange={(e) => updateInputPort(idx, 'id', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Label"
                        value={port.label}
                        onChange={(e) => updateInputPort(idx, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Select value={port.type} onValueChange={(v) => updateInputPort(idx, 'type', v)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => removeInputPort(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Output Ports</Label>
                  <Button size="sm" variant="outline" onClick={addOutputPort}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Output
                  </Button>
                </div>
                <div className="space-y-2">
                  {outputPorts.map((port, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="Port ID"
                        value={port.id}
                        onChange={(e) => updateOutputPort(idx, 'id', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Label"
                        value={port.label}
                        onChange={(e) => updateOutputPort(idx, 'label', e.target.value)}
                        className="flex-1"
                      />
                      <Select value={port.type} onValueChange={(v) => updateOutputPort(idx, 'type', v)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => removeOutputPort(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logic">Block Logic (JavaScript)</Label>
                <Textarea
                  id="logic"
                  value={logic}
                  onChange={(e) => setLogic(e.target.value)}
                  className="font-mono text-sm min-h-[200px]"
                  placeholder="// Your block logic here"
                />
                <p className="text-xs text-muted-foreground">
                  Write JavaScript code that returns an object with output values. Available variables: config, inputs
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Create Block
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
