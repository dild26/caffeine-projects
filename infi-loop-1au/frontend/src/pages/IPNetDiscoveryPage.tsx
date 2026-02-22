import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Network, Search, Wifi, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

export default function IPNetDiscoveryPage() {
  const { actor } = useActor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredCameras, setDiscoveredCameras] = useState<any[]>([]);

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
    // Initialize discovery UI with embedded HTML/CSS/JS
    if (iframeRef.current && accessCheck?.hasAccess) {
      const iframe = iframeRef.current;
      
      // Create the complete HTML document with embedded styles and scripts
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPNet Discovery UI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .discovery-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .discovery-header {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .discovery-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 8px;
    }

    .discovery-header p {
      color: #718096;
      font-size: 14px;
    }

    .scan-controls {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .scan-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #48bb78;
      color: white;
    }

    .btn-secondary:hover {
      background: #38a169;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .scan-status {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      background: #edf2f7;
      color: #2d3748;
      font-size: 14px;
    }

    .scan-status.scanning {
      background: #bee3f8;
      color: #2c5282;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .cameras-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .camera-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .camera-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .camera-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .camera-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .camera-info h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 8px;
    }

    .camera-info p {
      font-size: 14px;
      color: #718096;
      margin-bottom: 4px;
    }

    .camera-actions {
      margin-top: 16px;
      display: flex;
      gap: 8px;
    }

    .btn-small {
      padding: 8px 16px;
      font-size: 13px;
    }

    .protocol-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }

    .protocol-ssdp {
      background: #bee3f8;
      color: #2c5282;
    }

    .protocol-rtsp {
      background: #c6f6d5;
      color: #22543d;
    }

    .empty-state {
      background: white;
      border-radius: 12px;
      padding: 48px 24px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .empty-state svg {
      width: 64px;
      height: 64px;
      color: #cbd5e0;
      margin: 0 auto 16px;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #718096;
      font-size: 14px;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="discovery-container">
    <div class="discovery-header">
      <h1>🔍 IPNet Camera Discovery</h1>
      <p>Scan your network for SSDP and RTSP compatible IP cameras</p>
    </div>

    <div class="scan-controls">
      <div class="scan-buttons">
        <button class="btn btn-primary" id="scanSsdpBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          Scan SSDP
        </button>
        <button class="btn btn-secondary" id="scanRtspBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
            <polyline points="17 2 12 7 7 2"></polyline>
          </svg>
          Scan RTSP
        </button>
        <button class="btn btn-primary" id="scanAllBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Scan All Protocols
        </button>
      </div>
      <div id="scanStatus" class="scan-status" style="display: none;">
        Ready to scan
      </div>
    </div>

    <div id="camerasContainer">
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
        <h3>No Cameras Discovered</h3>
        <p>Click one of the scan buttons above to discover IP cameras on your network</p>
      </div>
    </div>
  </div>

  <script>
    // Discovery Engine Core
    class DiscoveryEngine {
      constructor() {
        this.cameras = [];
        this.isScanning = false;
      }

      async scanSsdp() {
        console.log('Starting SSDP scan...');
        this.isScanning = true;
        this.updateStatus('Scanning for SSDP devices...', true);

        // Simulate SSDP discovery
        await this.simulateDiscovery('SSDP');
        
        this.isScanning = false;
        this.updateStatus(\`Found \${this.cameras.length} camera(s)\`, false);
        this.renderCameras();
      }

      async scanRtsp() {
        console.log('Starting RTSP scan...');
        this.isScanning = true;
        this.updateStatus('Scanning for RTSP streams...', true);

        // Simulate RTSP discovery
        await this.simulateDiscovery('RTSP');
        
        this.isScanning = false;
        this.updateStatus(\`Found \${this.cameras.length} camera(s)\`, false);
        this.renderCameras();
      }

      async scanAll() {
        console.log('Starting comprehensive scan...');
        this.isScanning = true;
        this.updateStatus('Scanning all protocols...', true);

        // Simulate comprehensive discovery
        await this.simulateDiscovery('ALL');
        
        this.isScanning = false;
        this.updateStatus(\`Found \${this.cameras.length} camera(s)\`, false);
        this.renderCameras();
      }

      async simulateDiscovery(protocol) {
        // Simulate network discovery delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate mock camera data
        const mockCameras = [
          {
            id: 'cam-' + Date.now() + '-1',
            name: 'Front Door Camera',
            ip: '192.168.1.101',
            port: 554,
            protocol: protocol === 'RTSP' ? 'RTSP' : 'SSDP',
            manufacturer: 'Hikvision',
            model: 'DS-2CD2042WD',
            streamUrl: 'rtsp://192.168.1.101:554/stream1'
          },
          {
            id: 'cam-' + Date.now() + '-2',
            name: 'Backyard Camera',
            ip: '192.168.1.102',
            port: 554,
            protocol: protocol === 'SSDP' ? 'SSDP' : 'RTSP',
            manufacturer: 'Dahua',
            model: 'IPC-HFW4431R-Z',
            streamUrl: 'rtsp://192.168.1.102:554/stream1'
          },
          {
            id: 'cam-' + Date.now() + '-3',
            name: 'Garage Camera',
            ip: '192.168.1.103',
            port: 8080,
            protocol: 'SSDP',
            manufacturer: 'Axis',
            model: 'M3045-V',
            streamUrl: 'http://192.168.1.103:8080/mjpg/video.mjpg'
          }
        ];

        if (protocol === 'ALL') {
          this.cameras = mockCameras;
        } else {
          this.cameras = mockCameras.filter(cam => cam.protocol === protocol);
        }
      }

      updateStatus(message, isScanning) {
        const statusEl = document.getElementById('scanStatus');
        if (statusEl) {
          statusEl.textContent = message;
          statusEl.style.display = 'block';
          if (isScanning) {
            statusEl.classList.add('scanning');
          } else {
            statusEl.classList.remove('scanning');
          }
        }
      }

      renderCameras() {
        const container = document.getElementById('camerasContainer');
        if (!container) return;

        if (this.cameras.length === 0) {
          container.innerHTML = \`
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
              <h3>No Cameras Found</h3>
              <p>No cameras were discovered on your network. Try scanning again or check your network configuration.</p>
            </div>
          \`;
          return;
        }

        const camerasHtml = this.cameras.map(camera => \`
          <div class="camera-card">
            <div class="camera-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
            </div>
            <div class="camera-info">
              <h3>\${camera.name}</h3>
              <p><strong>IP:</strong> \${camera.ip}:\${camera.port}</p>
              <p><strong>Manufacturer:</strong> \${camera.manufacturer}</p>
              <p><strong>Model:</strong> \${camera.model}</p>
              <span class="protocol-badge protocol-\${camera.protocol.toLowerCase()}">\${camera.protocol}</span>
            </div>
            <div class="camera-actions">
              <button class="btn btn-primary btn-small" onclick="engine.registerCamera('\${camera.id}')">
                Register
              </button>
              <button class="btn btn-secondary btn-small" onclick="engine.testStream('\${camera.id}')">
                Test Stream
              </button>
            </div>
          </div>
        \`).join('');

        container.innerHTML = \`<div class="cameras-grid">\${camerasHtml}</div>\`;
      }

      registerCamera(cameraId) {
        const camera = this.cameras.find(c => c.id === cameraId);
        if (camera) {
          console.log('Registering camera:', camera);
          alert(\`Camera "\${camera.name}" will be registered with the backend.\\n\\nIP: \${camera.ip}\\nProtocol: \${camera.protocol}\`);
          // Here you would call the backend registration API
          window.parent.postMessage({
            type: 'REGISTER_CAMERA',
            camera: camera
          }, '*');
        }
      }

      testStream(cameraId) {
        const camera = this.cameras.find(c => c.id === cameraId);
        if (camera) {
          console.log('Testing stream:', camera);
          alert(\`Testing stream for "\${camera.name}"\\n\\nStream URL: \${camera.streamUrl}\`);
          // Here you would test the stream connection
          window.parent.postMessage({
            type: 'TEST_STREAM',
            camera: camera
          }, '*');
        }
      }
    }

    // Initialize discovery engine
    const engine = new DiscoveryEngine();

    // Setup event listeners
    document.getElementById('scanSsdpBtn').addEventListener('click', () => {
      if (!engine.isScanning) {
        engine.scanSsdp();
      }
    });

    document.getElementById('scanRtspBtn').addEventListener('click', () => {
      if (!engine.isScanning) {
        engine.scanRtsp();
      }
    });

    document.getElementById('scanAllBtn').addEventListener('click', () => {
      if (!engine.isScanning) {
        engine.scanAll();
      }
    });

    // Notify parent that discovery UI is ready
    window.parent.postMessage({ type: 'DISCOVERY_UI_READY' }, '*');
  </script>
</body>
</html>
      `;

      // Write the HTML content to the iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }

      // Listen for messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'DISCOVERY_UI_READY') {
          console.log('Discovery UI initialized successfully');
          toast.success('Discovery UI loaded successfully');
        } else if (event.data.type === 'REGISTER_CAMERA') {
          console.log('Camera registration requested:', event.data.camera);
          toast.info(`Registering camera: ${event.data.camera.name}`);
          // Here you would call the backend to register the camera
        } else if (event.data.type === 'TEST_STREAM') {
          console.log('Stream test requested:', event.data.camera);
          toast.info(`Testing stream: ${event.data.camera.name}`);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [accessCheck]);

  if (accessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
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
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Network className="h-8 w-8" />
          IPNet Discovery UI
        </h1>
        <p className="text-muted-foreground mt-2">
          SSDP and RTSP camera scanning and registration interface
        </p>
      </div>

      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> This interface provides network discovery capabilities for IP cameras. 
          Access is restricted to authenticated admins and verified subscribers. All discovered cameras can be 
          registered and managed through the backend system.
        </AlertDescription>
      </Alert>

      {/* Discovery UI Container */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Camera Discovery & Registration</CardTitle>
          <CardDescription>
            Scan your network for SSDP and RTSP compatible cameras. Click the scan buttons to discover devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
            <iframe
              ref={iframeRef}
              title="IPNet Discovery UI"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              SSDP Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Simple Service Discovery Protocol for UPnP devices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Video className="h-4 w-4" />
              RTSP Scanning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Real-Time Streaming Protocol camera detection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Auto Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              One-click camera registration to backend
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
