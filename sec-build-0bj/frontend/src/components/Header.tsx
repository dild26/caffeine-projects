import { Menu, X, Undo2, Redo2, Save, FolderOpen, Trash2, Wrench, FileJson, Cpu, Activity, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '../hooks/useTheme';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import type { UserProfile } from '../backend';

interface HeaderProps {
  onToggleLibrary: () => void;
  onToggleProperties: () => void;
  onOpenWorkspaceManager: () => void;
  onOpenCustomBlockBuilder: () => void;
  onOpenImportExport: () => void;
  onClearWorkspace: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
  historyIndex: number;
  useWebGLRendering: boolean;
  onToggleWebGL: () => void;
  userProfile: UserProfile | null | undefined;
}

export default function Header({
  onToggleLibrary,
  onToggleProperties,
  onOpenWorkspaceManager,
  onOpenCustomBlockBuilder,
  onOpenImportExport,
  onClearWorkspace,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  historySize,
  historyIndex,
  useWebGLRendering,
  onToggleWebGL,
  userProfile
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
      await clear();
      queryClient.clear();
      localStorage.removeItem('eth-sandbox-session');
    }
  };

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Ethereum Visual Sandbox
          </h1>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Production
          </Badge>
        </div>

        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onToggleLibrary}>
                  <Menu className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Block Library</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onToggleProperties}>
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Properties Panel</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Undo (Ctrl+Z) - {historyIndex}/{historySize}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Redo (Ctrl+Y) - {historyIndex}/{historySize}
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onOpenWorkspaceManager}>
                  <Save className="w-4 h-4 mr-2" />
                  Workspace
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save/Load Workspace (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onOpenImportExport}>
                  <FileJson className="w-4 h-4 mr-2" />
                  Import/Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import/Export Workspace (Ctrl+E)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onOpenCustomBlockBuilder}>
                  <Wrench className="w-4 h-4 mr-2" />
                  Custom Blocks
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create Custom Blocks</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={useWebGLRendering ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleWebGL}
                  className="relative"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  {useWebGLRendering ? 'WebGL' : 'CPU'}
                  {useWebGLRendering && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Toggle Rendering Mode (Ctrl+G)<br />
                {useWebGLRendering ? 'GPU-accelerated WebGL' : 'CPU-based rendering'}<br />
                <span className="text-xs text-muted-foreground">Press 'D' to toggle debug overlay</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onClearWorkspace}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Workspace</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-2" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {userProfile?.name || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="w-4 h-4 mr-2" />
                  {userProfile?.name || 'User'}
                </DropdownMenuItem>
                {identity && (
                  <DropdownMenuItem disabled className="text-xs">
                    <span className="truncate">
                      {identity.getPrincipal().toString().slice(0, 20)}...
                    </span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
}
