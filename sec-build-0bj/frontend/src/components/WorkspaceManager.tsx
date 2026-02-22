import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { Block, Connection } from '../types';
import { useWorkspaceQueries } from '../hooks/useQueries';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import { toast } from 'sonner';
import WindowControls, { WindowState } from './WindowControls';

interface WorkspaceManagerProps {
  open: boolean;
  onClose: () => void;
  blocks: Block[];
  connections: Connection[];
  onLoadWorkspace: (blocks: Block[], connections: Connection[]) => void;
}

export default function WorkspaceManager({
  open,
  onClose,
  blocks,
  connections,
  onLoadWorkspace
}: WorkspaceManagerProps) {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [lastClickTime, setLastClickTime] = useState(0);
  
  const { 
    workspaces, 
    isLoadingWorkspaces, 
    saveWorkspace, 
    deleteWorkspace 
  } = useWorkspaceQueries();

  // Global keyboard handlers
  useGlobalKeyboard('workspace-manager', {
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
      if (workspaceName.trim()) {
        handleSave();
      }
    },
    enabled: open,
    priority: 9
  });

  const handleSave = async () => {
    if (!workspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    const workspaceId = `workspace-${Date.now()}`;
    
    try {
      await saveWorkspace.mutateAsync({
        id: workspaceId,
        name: workspaceName,
        description: workspaceDescription,
        blocks,
        connections
      });
      
      toast.success('Workspace saved successfully');
      setWorkspaceName('');
      setWorkspaceDescription('');
    } catch (error) {
      toast.error('Failed to save workspace');
      console.error(error);
    }
  };

  const handleLoad = (workspace: any) => {
    const loadedBlocks: Block[] = workspace.data.blocks.map((b: any) => ({
      id: b.id,
      type: b.blockType,
      position: { x: Number(b.position.x), y: Number(b.position.y) },
      config: b.config ? JSON.parse(b.config) : {},
      outputs: {}
    }));

    const loadedConnections: Connection[] = workspace.data.connections;

    onLoadWorkspace(loadedBlocks, loadedConnections);
    toast.success(`Loaded workspace: ${workspace.name}`);
    onClose();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete workspace "${name}"?`)) {
      try {
        await deleteWorkspace.mutateAsync(id);
        toast.success('Workspace deleted');
      } catch (error) {
        toast.error('Failed to delete workspace');
        console.error(error);
      }
    }
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
    return '42rem';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-h-[80vh] gpu-accelerated"
        style={{
          maxWidth: getMaxWidth(),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        aria-describedby="workspace-manager-description"
      >
        <DialogHeader 
          className="cursor-pointer"
          onClick={handleHeaderClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Workspace Manager</DialogTitle>
              <DialogDescription id="workspace-manager-description">
                Save your current workspace or load a previously saved one. Press Esc to close, Enter to save.
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
          <Tabs defaultValue="save" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="save">Save Workspace</TabsTrigger>
              <TabsTrigger value="load">Load Workspace</TabsTrigger>
            </TabsList>

            <TabsContent value="save" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="My Ethereum Workflow"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  placeholder="Describe what this workspace does..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Current workspace: {blocks.length} blocks, {connections.length} connections
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saveWorkspace.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveWorkspace.isPending ? 'Saving...' : 'Save Workspace'}
              </Button>
            </TabsContent>

            <TabsContent value="load" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {isLoadingWorkspaces ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading workspaces...
                  </div>
                ) : workspaces && workspaces.length > 0 ? (
                  <div className="space-y-2">
                    {workspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{workspace.name}</h3>
                            {workspace.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {workspace.description}
                              </p>
                            )}
                            <div className="text-xs text-muted-foreground mt-2">
                              {workspace.data.blocks.length} blocks • {workspace.data.connections.length} connections
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Created: {new Date(Number(workspace.createdAt) / 1000000).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoad(workspace)}
                            >
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(workspace.id, workspace.name)}
                              disabled={deleteWorkspace.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No saved workspaces yet
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
