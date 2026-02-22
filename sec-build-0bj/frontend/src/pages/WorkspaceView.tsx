import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import Header from '../components/Header';
import BlockLibrary from '../components/BlockLibrary';
import Canvas from '../components/Canvas';
import PropertiesPanel from '../components/PropertiesPanel';
import ExecutionControls from '../components/ExecutionControls';
import WorkspaceManager from '../components/WorkspaceManager';
import CustomBlockBuilder from '../components/CustomBlockBuilder';
import ImportExportDialog from '../components/ImportExportDialog';
import LoginScreen from '../components/LoginScreen';
import ProfileSetup from '../components/ProfileSetup';
import SubscriptionPrompt from '../components/SubscriptionPrompt';
import ViewportControls, { ViewPreset } from '../components/ViewportControls';
import CADToolbar from '../components/CADToolbar';
import CADStatusBar from '../components/CADStatusBar';
import CADRightPanel from '../components/CADRightPanel';
import CLIInterface from '../components/CLIInterface';
import { Block, Connection, ExecutionState, BlockType, HistoryState } from '../types';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { executeCommandChain, highlightChainBlocks } from '../lib/cliParser';

const MAX_HISTORY = 200;

export default function WorkspaceView() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isCADPanelOpen, setIsCADPanelOpen] = useState(true);
  const [isCLIOpen, setIsCLIOpen] = useState(true);
  const [workspaceManagerOpen, setWorkspaceManagerOpen] = useState(false);
  const [customBlockBuilderOpen, setCustomBlockBuilderOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [subscriptionPromptOpen, setSubscriptionPromptOpen] = useState(false);
  const [useWebGLRendering, setUseWebGLRendering] = useState(true);
  const [currentView, setCurrentView] = useState<ViewPreset>('isometric');
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);
  
  const [wireframeMode, setWireframeMode] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [perspectiveMode, setPerspectiveMode] = useState(true);
  const [showViewCube, setShowViewCube] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, z: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [notification, setNotification] = useState<string>('');
  const [fps, setFps] = useState<number>(60);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.7);
  
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Check subscription status
  useEffect(() => {
    if (isAuthenticated && !showProfileSetup) {
      const subscriptionStatus = localStorage.getItem('eth-sandbox-subscription');
      if (subscriptionStatus !== 'active') {
        const timer = setTimeout(() => {
          setSubscriptionPromptOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, showProfileSetup]);

  const createStateDiff = useCallback((prevState: HistoryState, newState: HistoryState) => {
    const diff = {
      blocksChanged: JSON.stringify(prevState.blocks) !== JSON.stringify(newState.blocks),
      connectionsChanged: JSON.stringify(prevState.connections) !== JSON.stringify(newState.connections)
    };
    return diff;
  }, []);

  const saveToHistory = useCallback(() => {
    const newState: HistoryState = {
      blocks: JSON.parse(JSON.stringify(blocks)),
      connections: JSON.parse(JSON.stringify(connections)),
      timestamp: Date.now()
    };
    
    if (history.length > 0 && historyIndex >= 0) {
      const lastState = history[historyIndex];
      const diff = createStateDiff(lastState, newState);
      if (!diff.blocksChanged && !diff.connectionsChanged) {
        return;
      }
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    if (newHistory.length > MAX_HISTORY) {
      const prunedHistory = [newHistory[0], ...newHistory.slice(-MAX_HISTORY + 1)];
      setHistory(prunedHistory);
      setHistoryIndex(prunedHistory.length - 1);
    } else {
      setHistory(newHistory);
      setHistoryIndex(historyIndex + 1);
    }
  }, [blocks, connections, history, historyIndex, createStateDiff]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setBlocks(JSON.parse(JSON.stringify(prevState.blocks)));
      setConnections(JSON.parse(JSON.stringify(prevState.connections)));
      setHistoryIndex(historyIndex - 1);
      setNotification('Undo applied');
      setTimeout(() => setNotification(''), 2000);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setBlocks(JSON.parse(JSON.stringify(nextState.blocks)));
      setConnections(JSON.parse(JSON.stringify(nextState.connections)));
      setHistoryIndex(historyIndex + 1);
      setNotification('Redo applied');
      setTimeout(() => setNotification(''), 2000);
    }
  }, [history, historyIndex]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3.0));
    setNotification('Zoom In');
    setTimeout(() => setNotification(''), 1000);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
    setNotification('Zoom Out');
    setTimeout(() => setNotification(''), 1000);
  }, []);

  const handleFitToView = useCallback(() => {
    setZoomLevel(1.0);
    setCurrentView('isometric');
    setNotification('Fit to View');
    setTimeout(() => setNotification(''), 1500);
  }, []);

  const handleViewChange = useCallback((view: ViewPreset) => {
    setCurrentView(view);
    setNotification(`View: ${view.charAt(0).toUpperCase() + view.slice(1)}`);
    setTimeout(() => setNotification(''), 1500);
  }, []);

  const handleExecuteCLIChain = useCallback((command: string) => {
    const result = executeCommandChain(command, blocks, connections);
    
    if (!result.success) {
      toast.error('CLI Execution Failed', {
        description: result.errors.join(', ')
      });
      return;
    }

    // Add new blocks and connections
    setBlocks(prev => [...prev, ...result.blocks]);
    setConnections(prev => [...prev, ...result.connections]);
    saveToHistory();

    // Highlight the chain
    highlightChainBlocks(result.blocks.map(b => b.id));

    toast.success('CLI Chain Executed', {
      description: `Created ${result.blocks.length} blocks and ${result.connections.length} connections`
    });

    setNotification(`CLI: ${result.blocks.length} blocks created`);
    setTimeout(() => setNotification(''), 3000);
  }, [blocks, connections, saveToHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setWorkspaceManagerOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setImportExportOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setUseWebGLRendering(!useWebGLRendering);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsCLIOpen(!isCLIOpen);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        handleViewChange('isometric');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleViewChange('front');
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleViewChange('side');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleViewChange('top');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleFitToView();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setGridVisible(!gridVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, useWebGLRendering, gridVisible, isCLIOpen, handleViewChange, handleFitToView]);

  useEffect(() => {
    if (isAuthenticated) {
      const savedSession = localStorage.getItem('eth-sandbox-session');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          setBlocks(session.blocks || []);
          setConnections(session.connections || []);
          setHistory(session.history || []);
          setHistoryIndex(session.historyIndex || -1);
        } catch (error) {
          console.error('Failed to restore session:', error);
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const saveSession = () => {
        const session = {
          blocks,
          connections,
          history: history.slice(-50),
          historyIndex: Math.min(historyIndex, 49)
        };
        localStorage.setItem('eth-sandbox-session', JSON.stringify(session));
      };

      const timer = setTimeout(saveSession, 2000);
      return () => clearTimeout(timer);
    }
  }, [blocks, connections, history, historyIndex, isAuthenticated]);

  const addBlock = (blockType: string, position: { x: number; y: number }) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      type: blockType as BlockType,
      position,
      config: {},
      outputs: {}
    };
    setBlocks([...blocks, newBlock]);
    saveToHistory();
    setNotification('Block added');
    setTimeout(() => setNotification(''), 1500);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    setConnections(connections.filter(c => c.fromBlockId !== id && c.toBlockId !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    saveToHistory();
    setNotification('Block deleted');
    setTimeout(() => setNotification(''), 1500);
  };

  const addConnection = (connection: Connection) => {
    const exists = connections.some(
      c => c.fromBlockId === connection.fromBlockId &&
           c.fromPort === connection.fromPort &&
           c.toBlockId === connection.toBlockId &&
           c.toPort === connection.toPort
    );
    if (!exists) {
      setConnections([...connections, connection]);
      saveToHistory();
      setNotification('Connection created');
      setTimeout(() => setNotification(''), 1500);
    }
  };

  const deleteConnection = (fromBlockId: string, fromPort: string, toBlockId: string, toPort: string) => {
    setConnections(connections.filter(
      c => !(c.fromBlockId === fromBlockId && c.fromPort === fromPort && 
             c.toBlockId === toBlockId && c.toPort === toPort)
    ));
    saveToHistory();
    setNotification('Connection removed');
    setTimeout(() => setNotification(''), 1500);
  };

  const clearWorkspace = () => {
    setBlocks([]);
    setConnections([]);
    setSelectedBlockId(null);
    setExecutionState('idle');
    setHistory([]);
    setHistoryIndex(-1);
    localStorage.removeItem('eth-sandbox-session');
    setNotification('Workspace cleared');
    setTimeout(() => setNotification(''), 2000);
  };

  const handleImportWorkspace = (data: { blocks: Block[]; connections: Connection[] }) => {
    setBlocks(data.blocks);
    setConnections(data.connections);
    setSelectedBlockId(null);
    setExecutionState('idle');
    setHistory([]);
    setHistoryIndex(-1);
    saveToHistory();
    setNotification('Workspace imported');
    setTimeout(() => setNotification(''), 2000);
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing Ethereum Visual Sandbox...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header 
        onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
        onToggleProperties={() => setIsCADPanelOpen(!isCADPanelOpen)}
        onOpenWorkspaceManager={() => setWorkspaceManagerOpen(true)}
        onOpenCustomBlockBuilder={() => setCustomBlockBuilderOpen(true)}
        onOpenImportExport={() => setImportExportOpen(true)}
        onClearWorkspace={clearWorkspace}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        historySize={history.length}
        historyIndex={historyIndex}
        useWebGLRendering={useWebGLRendering}
        onToggleWebGL={() => setUseWebGLRendering(!useWebGLRendering)}
        userProfile={userProfile}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {isLibraryOpen && (
          <BlockLibrary onClose={() => setIsLibraryOpen(false)} />
        )}
        
        <div className="flex-1 flex flex-col relative">
          {useWebGLRendering && (
            <CADToolbar
              currentView={currentView}
              onViewChange={handleViewChange}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitToView={handleFitToView}
              onReset={handleFitToView}
              wireframeMode={wireframeMode}
              onToggleWireframe={() => setWireframeMode(!wireframeMode)}
              gridVisible={gridVisible}
              onToggleGrid={() => setGridVisible(!gridVisible)}
              perspectiveMode={perspectiveMode}
              onTogglePerspective={() => setPerspectiveMode(!perspectiveMode)}
              showViewCube={showViewCube}
              onToggleViewCube={() => setShowViewCube(!showViewCube)}
            />
          )}
          
          <ExecutionControls
            executionState={executionState}
            onExecutionStateChange={setExecutionState}
            blocks={blocks}
            connections={connections}
            onUpdateBlock={updateBlock}
          />
          
          <Canvas
            blocks={blocks}
            connections={connections}
            selectedBlockId={selectedBlockId}
            executionState={executionState}
            onAddBlock={addBlock}
            onUpdateBlock={updateBlock}
            onDeleteBlock={deleteBlock}
            onSelectBlock={setSelectedBlockId}
            onAddConnection={addConnection}
            onDeleteConnection={deleteConnection}
            useWebGLRendering={useWebGLRendering}
            currentView={currentView}
            splitViewEnabled={splitViewEnabled}
          />

          {useWebGLRendering && (
            <CADStatusBar
              cursorPosition={cursorPosition}
              zoomLevel={zoomLevel}
              currentView={currentView}
              blockCount={blocks.length}
              connectionCount={connections.length}
              notification={notification}
              fps={fps}
            />
          )}
        </div>
        
        {useWebGLRendering && isCADPanelOpen ? (
          <CADRightPanel
            selectedBlock={selectedBlock || null}
            onUpdateBlock={updateBlock}
            onClose={() => setIsCADPanelOpen(false)}
            wireframeMode={wireframeMode}
            onToggleWireframe={() => setWireframeMode(!wireframeMode)}
            gridVisible={gridVisible}
            onToggleGrid={() => setGridVisible(!gridVisible)}
            ambientLightIntensity={ambientLightIntensity}
            onAmbientLightChange={setAmbientLightIntensity}
          />
        ) : !useWebGLRendering && isPropertiesOpen ? (
          <PropertiesPanel
            block={selectedBlock}
            onUpdateBlock={updateBlock}
            onClose={() => setIsPropertiesOpen(false)}
          />
        ) : null}
      </div>

      {isCLIOpen && (
        <CLIInterface
          blocks={blocks}
          connections={connections}
          onExecuteChain={handleExecuteCLIChain}
          onClose={() => setIsCLIOpen(false)}
        />
      )}
      
      <WorkspaceManager
        open={workspaceManagerOpen}
        onClose={() => setWorkspaceManagerOpen(false)}
        blocks={blocks}
        connections={connections}
        onLoadWorkspace={(loadedBlocks, loadedConnections) => {
          setBlocks(loadedBlocks);
          setConnections(loadedConnections);
          setSelectedBlockId(null);
          setExecutionState('idle');
          setHistory([]);
          setHistoryIndex(-1);
          setNotification('Workspace loaded');
          setTimeout(() => setNotification(''), 2000);
        }}
      />

      <CustomBlockBuilder
        open={customBlockBuilderOpen}
        onClose={() => setCustomBlockBuilderOpen(false)}
      />

      <ImportExportDialog
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        blocks={blocks}
        connections={connections}
        onImport={handleImportWorkspace}
      />

      <SubscriptionPrompt
        open={subscriptionPromptOpen}
        onClose={() => setSubscriptionPromptOpen(false)}
      />
      
      <Toaster />
    </div>
  );
}
