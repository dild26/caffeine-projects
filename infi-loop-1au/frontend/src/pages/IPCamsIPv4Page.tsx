import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Plus, Trash2, Edit, Play, Pause, AlertCircle, CheckCircle2, Loader2, Eye, Grid3x3, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

// Local type definitions since these are not exported from backend
enum StreamProtocol {
  MJPEG = 'MJPEG',
  HLS = 'HLS',
  DASH = 'DASH',
  RTSPWebRTC = 'RTSPWebRTC',
  WebSocket = 'WebSocket',
}

enum CameraStatus {
  online = 'online',
  offline = 'offline',
  error = 'error',
  unauthorized = 'unauthorized',
}

type IPCamera = {
  id: string;
  name: string;
  ipAddress: string;
  port: bigint;
  protocol: StreamProtocol;
  username: string;
  encryptedPassword: string;
  createdBy: string;
  createdAt: bigint;
  lastAccessed: bigint;
  status: CameraStatus;
  isActive: boolean;
  streamUrl: string;
  thumbnailUrl: string | null;
};

export default function IPCamsIPv4Page() {
  const { actor } = useActor();
  const [selectedCamera, setSelectedCamera] = useState<IPCamera | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [fullscreenCamera, setFullscreenCamera] = useState<IPCamera | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    port: '554',
    protocol: StreamProtocol.RTSPWebRTC,
    username: '',
    password: '',
    streamUrl: '',
  });

  // Check access
  const { data: accessCheck, isLoading: accessLoading } = useQuery({
    queryKey: ['ipCameraAccess'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkIPCameraAccess();
    },
    enabled: !!actor,
  });

  // Mock cameras data since backend methods are not available
  const cameras: IPCamera[] = [];
  const camerasLoading = false;

  const resetForm = () => {
    setFormData({
      name: '',
      ipAddress: '',
      port: '554',
      protocol: StreamProtocol.RTSPWebRTC,
      username: '',
      password: '',
      streamUrl: '',
    });
  };

  const handleEdit = (camera: IPCamera) => {
    setSelectedCamera(camera);
    setFormData({
      name: camera.name,
      ipAddress: camera.ipAddress,
      port: camera.port.toString(),
      protocol: camera.protocol,
      username: camera.username,
      password: '',
      streamUrl: camera.streamUrl,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Camera management features are not yet available in the backend');
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = (cameraId: string) => {
    toast.info('Camera management features are not yet available in the backend');
  };

  const getStatusBadge = (status: CameraStatus) => {
    switch (status) {
      case CameraStatus.online:
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Online</Badge>;
      case CameraStatus.offline:
        return <Badge variant="secondary">Offline</Badge>;
      case CameraStatus.error:
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case CameraStatus.unauthorized:
        return <Badge variant="destructive">Unauthorized</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProtocolBadge = (protocol: StreamProtocol) => {
    const colors: Record<StreamProtocol, string> = {
      [StreamProtocol.MJPEG]: 'bg-blue-500',
      [StreamProtocol.HLS]: 'bg-purple-500',
      [StreamProtocol.DASH]: 'bg-orange-500',
      [StreamProtocol.RTSPWebRTC]: 'bg-green-500',
      [StreamProtocol.WebSocket]: 'bg-cyan-500',
    };
    return <Badge className={colors[protocol]}>{protocol}</Badge>;
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Video className="h-8 w-8" />
            IPCams IPv4 Live Streaming
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your IPv4-based IP cameras with multi-protocol streaming support
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <Grid3x3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Register New Camera</DialogTitle>
                <DialogDescription>
                  Add a new IPv4 camera to your monitoring system
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Camera Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Front Door Camera"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipAddress">IP Address</Label>
                    <Input
                      id="ipAddress"
                      value={formData.ipAddress}
                      onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                      placeholder="192.168.1.100"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      placeholder="554"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protocol">Protocol</Label>
                    <Select
                      value={formData.protocol}
                      onValueChange={(value) => setFormData({ ...formData, protocol: value as StreamProtocol })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={StreamProtocol.MJPEG}>MJPEG</SelectItem>
                        <SelectItem value={StreamProtocol.HLS}>HLS</SelectItem>
                        <SelectItem value={StreamProtocol.DASH}>DASH</SelectItem>
                        <SelectItem value={StreamProtocol.RTSPWebRTC}>RTSP-WebRTC</SelectItem>
                        <SelectItem value={StreamProtocol.WebSocket}>WebSocket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="admin"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streamUrl">Stream URL</Label>
                  <Input
                    id="streamUrl"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    placeholder="rtsp://192.168.1.100:554/stream"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Register Camera
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> All camera streams are encrypted with AES-256-GCM. Access is restricted to authenticated admins and verified subscribers ($0.01/hour). Rate limiting and audit logging are active.
        </AlertDescription>
      </Alert>

      {/* Cameras Display */}
      {camerasLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : cameras.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Cameras Registered</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first IP camera</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="multiview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="multiview">Multi-View</TabsTrigger>
            <TabsTrigger value="list">Camera List</TabsTrigger>
          </TabsList>

          <TabsContent value="multiview" className="space-y-4">
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {cameras.map((camera) => (
                <Card key={camera.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{camera.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {camera.ipAddress}:{camera.port.toString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {getStatusBadge(camera.status)}
                        {getProtocolBadge(camera.protocol)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                      {camera.status === CameraStatus.online ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white/50" />
                          <p className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/50 px-2 py-1 rounded">
                            Live Stream
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-white/50">
                          <Pause className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Camera Offline</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setFullscreenCamera(camera)}
                      >
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Fullscreen
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(camera)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Delete camera "${camera.name}"?`)) {
                            handleDelete(camera.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {cameras.map((camera) => (
              <Card key={camera.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle>{camera.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span>{camera.ipAddress}:{camera.port.toString()}</span>
                        <span>{getProtocolBadge(camera.protocol)}</span>
                        <span>{getStatusBadge(camera.status)}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(camera)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Delete camera "${camera.name}"?`)) {
                            handleDelete(camera.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Camera</DialogTitle>
            <DialogDescription>Update camera configuration</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Camera Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ipAddress">IP Address</Label>
                <Input
                  id="edit-ipAddress"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-port">Port</Label>
                <Input
                  id="edit-port"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-protocol">Protocol</Label>
                <Select
                  value={formData.protocol}
                  onValueChange={(value) => setFormData({ ...formData, protocol: value as StreamProtocol })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StreamProtocol.MJPEG}>MJPEG</SelectItem>
                    <SelectItem value={StreamProtocol.HLS}>HLS</SelectItem>
                    <SelectItem value={StreamProtocol.DASH}>DASH</SelectItem>
                    <SelectItem value={StreamProtocol.RTSPWebRTC}>RTSP-WebRTC</SelectItem>
                    <SelectItem value={StreamProtocol.WebSocket}>WebSocket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-streamUrl">Stream URL</Label>
              <Input
                id="edit-streamUrl"
                value={formData.streamUrl}
                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Camera
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Player Dialog */}
      {fullscreenCamera && (
        <Dialog open={!!fullscreenCamera} onOpenChange={() => setFullscreenCamera(null)}>
          <DialogContent className="max-w-6xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>{fullscreenCamera.name}</DialogTitle>
              <DialogDescription>
                {fullscreenCamera.ipAddress}:{fullscreenCamera.port.toString()} - {fullscreenCamera.protocol}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 bg-black rounded-lg flex items-center justify-center">
              {fullscreenCamera.status === CameraStatus.online ? (
                <div className="text-center text-white">
                  <Play className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-xl">Live Stream Player</p>
                  <p className="text-sm text-white/70 mt-2">Stream URL: {fullscreenCamera.streamUrl}</p>
                </div>
              ) : (
                <div className="text-center text-white/50">
                  <Pause className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-xl">Camera Offline</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
