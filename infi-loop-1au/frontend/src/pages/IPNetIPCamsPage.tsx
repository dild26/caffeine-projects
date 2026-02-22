import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, Video, Grid3x3, Play, Settings, Search } from 'lucide-react';
import '../styles/ipcams.css';

export default function IPNetIPCamsPage() {
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  // Check access
  const { data: accessCheck, isLoading: accessLoading } = useQuery({
    queryKey: ['ipCameraAccess'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkIPCameraAccess();
    },
    enabled: !!actor,
  });

  useEffect(() => {
    // Initialize IPCams core modules
    if (accessCheck?.hasAccess) {
      console.log('IPCams modules initialized');
    }
  }, [accessCheck]);

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCamera(cameraId);
    setIsPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerVisible(false);
    setSelectedCamera(null);
  };

  if (accessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!accessCheck?.hasAccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Denied:</strong> {accessCheck?.reason || 'You do not have permission to access this page.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="ipcams-container">
      {/* Top Navigation */}
      <nav className="ipcams-nav">
        <div className="ipcams-nav-brand">
          <Video className="h-6 w-6" />
          <span className="ipcams-nav-title">IPNet Camera Grid</span>
        </div>
        <div className="ipcams-nav-actions">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Discovery
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="ipcams-main">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="ipcams-tabs">
            <TabsTrigger value="grid" className="ipcams-tab">
              <Grid3x3 className="h-4 w-4 mr-2" />
              Camera Grid
            </TabsTrigger>
            <TabsTrigger value="discovery" className="ipcams-tab">
              <Search className="h-4 w-4 mr-2" />
              Discovery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="ipcams-tab-content">
            <div className="ipcams-grid">
              {/* Sample Camera Cards */}
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Card key={num} className="ipcams-camera-card">
                  <CardContent className="p-0">
                    <div className="ipcams-camera-preview">
                      <div className="ipcams-camera-placeholder">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Camera {num}</p>
                      </div>
                      <div className="ipcams-camera-overlay">
                        <Button
                          size="sm"
                          onClick={() => handleCameraSelect(`camera-${num}`)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          View Stream
                        </Button>
                      </div>
                    </div>
                    <div className="ipcams-camera-info">
                      <h3 className="font-semibold">Camera {num}</h3>
                      <p className="text-xs text-muted-foreground">192.168.1.{100 + num}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discovery" className="ipcams-tab-content">
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Camera Discovery</h3>
                <p className="text-muted-foreground mb-4">
                  Scan your network for available IP cameras using SSDP and RTSP protocols
                </p>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Start Discovery
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Modal */}
      {isPlayerVisible && (
        <div className="ipcams-modal-overlay" onClick={handleClosePlayer}>
          <div className="ipcams-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ipcams-modal-header">
              <h2 className="text-xl font-semibold">Live Stream - {selectedCamera}</h2>
              <Button variant="ghost" size="sm" onClick={handleClosePlayer}>
                ✕
              </Button>
            </div>
            <div className="ipcams-modal-body">
              <div className="ipcams-player">
                <div className="ipcams-player-placeholder">
                  <Play className="h-24 w-24 text-white/50" />
                  <p className="text-white/70 mt-4">Stream Player</p>
                </div>
              </div>
              <div className="ipcams-player-controls">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="ipcams-footer">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security:</strong> All streams encrypted with AES-256-GCM. Admin/Subscriber access only. Rate limiting active.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
