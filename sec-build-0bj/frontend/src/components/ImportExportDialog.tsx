import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Block, Connection } from '../types';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import WindowControls, { WindowState } from './WindowControls';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  blocks: Block[];
  connections: Connection[];
  onImport: (data: { blocks: Block[]; connections: Connection[] }) => void;
}

export default function ImportExportDialog({
  open,
  onClose,
  blocks,
  connections,
  onImport
}: ImportExportDialogProps) {
  const [importData, setImportData] = useState('');
  const [copied, setCopied] = useState(false);
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [lastClickTime, setLastClickTime] = useState(0);

  const exportData = JSON.stringify(
    {
      version: '1.0',
      timestamp: new Date().toISOString(),
      blocks,
      connections
    },
    null,
    2
  );

  // Global keyboard handlers
  useGlobalKeyboard('import-export-dialog', {
    onEscape: () => {
      if (windowState === 'zoomed') {
        setWindowState('normal');
      } else if (windowState === 'minimized') {
        setWindowState('normal');
      } else {
        onClose();
      }
    },
    onEnter: () => {
      if (importData.trim()) {
        handleImport();
      }
    },
    enabled: open,
    priority: 9
  });

  const handleExport = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eth-sandbox-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Workspace exported successfully!');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      
      if (!data.blocks || !Array.isArray(data.blocks)) {
        throw new Error('Invalid workspace data: missing blocks array');
      }
      
      if (!data.connections || !Array.isArray(data.connections)) {
        throw new Error('Invalid workspace data: missing connections array');
      }

      onImport({
        blocks: data.blocks,
        connections: data.connections
      });

      toast.success('Workspace imported successfully!');
      setImportData('');
      onClose();
    } catch (error: any) {
      toast.error('Import failed: ' + error.message);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-h-[90vh] gpu-accelerated"
        style={{
          maxWidth: getMaxWidth(),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        aria-describedby="import-export-description"
      >
        <DialogHeader 
          className="cursor-pointer"
          onClick={handleHeaderClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Import / Export Workspace</DialogTitle>
              <DialogDescription id="import-export-description">
                Export your workspace to JSON or import a previously saved workspace. Press Esc to close, Enter to import.
              </DialogDescription>
            </div>
            <WindowControls
              onClose={onClose}
              onMinimize={handleMinimize}
              onZoom={handleZoom}
              windowState={windowState}
            />
          </div>
        </DialogHeader>

        {windowState !== 'minimized' && (
          <>
            <Tabs defaultValue="export" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="import">Import</TabsTrigger>
              </TabsList>

              <TabsContent value="export" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Export your current workspace as JSON. You can save this file or share it with others.
                  </p>
                  <Textarea
                    value={exportData}
                    readOnly
                    className="font-mono text-xs min-h-[400px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExport} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                  <Button onClick={handleCopy} variant="outline" className="flex-1">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="import" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Import a workspace from JSON. This will replace your current workspace.
                  </p>
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                        <input
                          id="file-upload"
                          type="file"
                          accept=".json"
                          onChange={handleFileImport}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>
                  <Textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste JSON workspace data here..."
                    className="font-mono text-xs min-h-[400px]"
                  />
                </div>
                <Button onClick={handleImport} disabled={!importData.trim()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Workspace
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
