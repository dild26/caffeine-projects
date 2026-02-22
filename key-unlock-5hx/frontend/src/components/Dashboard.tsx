import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole, useGetCallerUserProfile, useSubscribeToKeyUnlock, useGetFileCheckStatus, useIsCallerAdmin, useUploadFileMetadata, useGetFileUploads, useGetAuthMetrics, useGetRouteStatuses, useCheckRouteStatus, useUpdateRouteStatus, useUpdateFilePresence } from '../hooks/useAppQueries';
import { User, Shield, CheckCircle2, Info, AlertCircle, AlertTriangle, FileWarning, FileCheck, FileX, Hash, Upload, Activity, Zap, TrendingUp, TrendingDown, RefreshCw, Server, Monitor, RotateCcw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import type { FileCheckResult } from '../backend';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: fileCheckStatus, isLoading: fileCheckLoading } = useGetFileCheckStatus();
  const { data: fileUploads } = useGetFileUploads();
  const { data: authMetrics } = useGetAuthMetrics();
  const { data: routeStatuses } = useGetRouteStatuses();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribeToKeyUnlock();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFileMetadata();
  const { mutate: checkRoute, isPending: isCheckingRoute } = useCheckRouteStatus();
  const { mutate: updateRoute } = useUpdateRouteStatus();
  const { mutate: updateFilePresence } = useUpdateFilePresence();
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const principal = identity?.getPrincipal().toString() || '';
  const shortPrincipal = principal ? `${principal.slice(0, 8)}...${principal.slice(-6)}` : '';

  const isAuthenticated = !!identity;
  const isSubscribed = userProfile?.subscribed || false;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const generateMerkleRoot = (principalId: string): string => {
    let hash = 0;
    for (let i = 0; i < principalId.length; i++) {
      const char = principalId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  };

  const generateNonce = (): bigint => {
    return BigInt(Date.now() + Math.floor(Math.random() * 1000000));
  };

  const handleSubscribe = () => {
    const merkleRoot = generateMerkleRoot(principal);
    const nonce = generateNonce();
    
    subscribe(
      { merkleRoot, nonce },
      {
        onSuccess: () => {
          toast.success('Successfully subscribed to Key-Unlock services!');
        },
        onError: (error: any) => {
          toast.error(`Subscription failed: ${error.message}`);
        }
      }
    );
  };

  // Normalize filename for case-insensitive comparison
  const normalizeFileName = (fileName: string): string => {
    return fileName.toLowerCase().trim();
  };

  // Extract base filename from path
  const extractFileName = (filePath: string): string => {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  // Check if uploaded file matches expected file (case-insensitive)
  const matchesExpectedFile = (uploadedName: string, expectedPath: string): boolean => {
    const uploadedNorm = normalizeFileName(uploadedName);
    const expectedNorm = normalizeFileName(extractFileName(expectedPath));
    return uploadedNorm === expectedNorm;
  };

  // Get matched files from uploads
  const getMatchedFiles = useMemo(() => {
    if (!fileUploads || !fileCheckStatus) return new Set<string>();
    
    const matched = new Set<string>();
    const uploadedFileNames = fileUploads.map(u => normalizeFileName(u.fileName));
    
    fileCheckStatus.expectedFiles.forEach(expected => {
      const expectedName = normalizeFileName(extractFileName(expected.fileName));
      if (uploadedFileNames.includes(expectedName)) {
        matched.add(expected.fileName);
      }
    });
    
    return matched;
  }, [fileUploads, fileCheckStatus]);

  // Detect duplicate uploads
  const getDuplicateFiles = useMemo(() => {
    if (!fileUploads) return new Map<string, number>();
    
    const counts = new Map<string, number>();
    fileUploads.forEach(upload => {
      const normalized = normalizeFileName(upload.fileName);
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    });
    
    return new Map(Array.from(counts.entries()).filter(([_, count]) => count > 1));
  }, [fileUploads]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (!fileCheckStatus) return 0;
    const total = fileCheckStatus.expectedFiles.length;
    const matched = getMatchedFiles.size;
    return total > 0 ? Math.round((matched / total) * 100) : 0;
  }, [fileCheckStatus, getMatchedFiles]);

  // Get unmatched files
  const unmatchedFiles = useMemo(() => {
    if (!fileCheckStatus) return [];
    return fileCheckStatus.expectedFiles
      .filter(f => !getMatchedFiles.has(f.fileName))
      .map(f => f.fileName);
  }, [fileCheckStatus, getMatchedFiles]);

  const hasMissingFiles = fileCheckStatus && !fileCheckStatus.isComplete;
  const missingFilesCount = unmatchedFiles.length;

  // Helper function to extract file type from filename
  const getFileType = (fileName: string): string => {
    if (fileName.endsWith('.node.js')) return '.js';
    if (fileName.endsWith('.js')) return '.js';
    if (fileName.endsWith('.md')) return '.md';
    if (fileName.endsWith('.yaml')) return '.yaml';
    if (fileName.endsWith('.zip')) return '.zip';
    if (fileName.endsWith('.log')) return '.log';
    return 'unknown';
  };

  // Helper function to determine correct upload path with folder correction
  const getCorrectPath = (fileName: string): string => {
    const normalized = normalizeFileName(fileName);
    
    // Root files
    if (normalized === 'server.js' || normalized === 'manifest.yaml') {
      return '/';
    }
    
    // Routes folder - all .node.js files go here
    if (normalized.endsWith('.node.js')) {
      return '/routes/';
    }
    
    // Utils folder
    if (normalized === 'compliance.js') {
      return '/utils/';
    }
    
    // Logs folder
    if (normalized.endsWith('.log')) {
      return '/logs/';
    }
    
    return '/';
  };

  // Helper function to get file size from uploads or mock
  const getFileSize = (fileName: string): string => {
    if (!fileUploads) return '—';
    
    const upload = fileUploads.find(u => 
      normalizeFileName(u.fileName) === normalizeFileName(extractFileName(fileName))
    );
    
    if (upload) {
      const sizeKB = Number(upload.fileSize) / 1024;
      return `${Math.round(sizeKB)} KB`;
    }
    
    return '—';
  };

  // Helper function to get file hash from uploads
  const getFileHash = (fileName: string): string => {
    if (!fileUploads) return '—';
    
    const upload = fileUploads.find(u => 
      normalizeFileName(u.fileName) === normalizeFileName(extractFileName(fileName))
    );
    
    return upload?.hashEdges || '—';
  };

  // Check if file is matched
  const isFileMatched = (fileName: string): boolean => {
    return getMatchedFiles.has(fileName);
  };

  // Check if file is duplicate
  const isFileDuplicate = (fileName: string): boolean => {
    const normalized = normalizeFileName(extractFileName(fileName));
    return (getDuplicateFiles.get(normalized) || 0) > 1;
  };

  // Auto-update file presence when uploads change
  useEffect(() => {
    if (!fileCheckStatus || !fileUploads) return;
    
    fileCheckStatus.expectedFiles.forEach(expected => {
      const isMatched = getMatchedFiles.has(expected.fileName);
      if (isMatched !== expected.isPresent) {
        updateFilePresence({ fileName: expected.fileName, isPresent: isMatched });
      }
    });
  }, [fileUploads, fileCheckStatus, getMatchedFiles, updateFilePresence]);

  // File upload handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const validateFileExtension = (fileName: string): boolean => {
    const validExtensions = ['.js', '.md', '.yaml', '.zip', '.log'];
    return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext)) || 
           fileName.toLowerCase().endsWith('.node.js');
  };

  const validateFilePlacement = (fileName: string): { valid: boolean; message?: string } => {
    const normalized = normalizeFileName(fileName);
    const correctPath = getCorrectPath(fileName);
    
    // Check if file contains incorrect path separators
    if (fileName.includes('\\')) {
      return { valid: false, message: 'Use forward slashes (/) for paths' };
    }
    
    // Check if .js file is in wrong folder
    if (normalized.endsWith('.node.js') && fileName.includes('/') && !fileName.includes('/routes/')) {
      return { valid: false, message: `Should be in ${correctPath} folder` };
    }
    
    return { valid: true };
  };

  const handleFiles = (files: File[]) => {
    const results: { file: File; valid: boolean; error?: string }[] = [];
    
    files.forEach(file => {
      if (!validateFileExtension(file.name)) {
        results.push({ 
          file, 
          valid: false, 
          error: 'Invalid file type. Only .js, .md, .yaml, .zip, and .log files allowed.' 
        });
        return;
      }
      
      const placementCheck = validateFilePlacement(file.name);
      if (!placementCheck.valid) {
        results.push({ 
          file, 
          valid: false, 
          error: placementCheck.message 
        });
        return;
      }
      
      results.push({ file, valid: true });
    });

    const invalidFiles = results.filter(r => !r.valid);
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ file, error }) => {
        toast.error(`${file.name}: ${error}`);
        setUploadErrors(prev => ({ ...prev, [file.name]: error || 'Unknown error' }));
      });
    }

    const validFiles = results.filter(r => r.valid).map(r => r.file);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadstart = () => {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        setUploadErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[file.name];
          return newErrors;
        });
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        }
      };
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        const hash = generateFileHash(bytes);
        const hashEdges = `${hash.slice(0, 4)}...${hash.slice(-4)}`;
        
        uploadFile(
          {
            fileName: file.name,
            fileType: getFileType(file.name),
            fileSize: BigInt(file.size),
            hashEdges
          },
          {
            onSuccess: () => {
              toast.success(`✅ ${file.name} uploaded successfully`);
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
              });
            },
            onError: (error: any) => {
              const errorMsg = error.message || 'Upload failed';
              toast.error(`❌ ${file.name}: ${errorMsg}`);
              setUploadErrors(prev => ({ ...prev, [file.name]: errorMsg }));
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
              });
            }
          }
        );
      };
      reader.onerror = () => {
        const errorMsg = 'Failed to read file';
        toast.error(`${file.name}: ${errorMsg}`);
        setUploadErrors(prev => ({ ...prev, [file.name]: errorMsg }));
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const generateFileHash = (bytes: Uint8Array): string => {
    let hash = 0;
    for (let i = 0; i < Math.min(bytes.length, 1000); i++) {
      hash = ((hash << 5) - hash) + bytes[i];
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  };

  const retryUpload = (fileName: string) => {
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileName];
      return newErrors;
    });
    toast.info(`Retry upload for ${fileName} by selecting the file again`);
  };

  // Auth optimization handlers
  const subdomainApps = [
    { name: 'Business Management', subdomain: 'ia-niqaw-947', route: 'ia-niqaw-947.node.js' },
    { name: 'IPFS', subdomain: 'ipfs-lrm', route: 'ipfs-lrm.node.js' },
    { name: 'Your Networth', subdomain: 'networth-htm', route: 'networth-htm.node.js' },
    { name: 'Geo-Map', subdomain: 'geo-map-w9s', route: 'geo-map-w9s.node.js' },
    { name: 'e-Contract', subdomain: 'e-contract-lwf', route: 'e-contract-lwf.node.js' },
    { name: 'SECOIN Realty', subdomain: 'secoin-ep6', route: 'secoin-ep6.node.js' },
    { name: 'N8n Tasks', subdomain: 'n8n-tasks-c2i', route: 'n8n-tasks-c2i.node.js' },
    { name: 'N8N Workflows', subdomain: 'n8n-workflows-6sy', route: 'n8n-workflows-6sy.node.js' },
    { name: 'e-Contracts', subdomain: 'e-contracts-bqe', route: 'e-contracts-bqe.node.js' },
    { name: 'Infytask', subdomain: 'infytask-mia', route: 'infytask-mia.node.js' },
    { name: 'SitemapAi', subdomain: 'sitemaps-fwh', route: 'infysitemaps-fwh.node.js' },
    { name: 'KeyUnlock', subdomain: 'key-unlock-5hx', route: 'key-unlock-5hx.node.js' },
    { name: 'DomainHub', subdomain: 'xcaller-0aw', route: 'xcaller-0aw.node.js' },
    { name: 'Dynamic e-Forms', subdomain: 'forms-sxn', route: 'forms-sxn.node.js' },
  ];

  const handlePingCheck = (subdomain: string, routeName: string) => {
    const url = `https://${subdomain}.caffeine.xyz/login-health`;
    checkRoute(url, {
      onSuccess: (response) => {
        const status = response.includes('ok') || response.includes('success') ? 'active' : 'inactive';
        updateRoute({ routeName, status });
        toast.success(`${subdomain}: ${status}`);
      },
      onError: () => {
        updateRoute({ routeName, status: 'inactive' });
        toast.error(`${subdomain}: inactive`);
      }
    });
  };

  const handlePingAllApps = () => {
    subdomainApps.forEach((app, index) => {
      setTimeout(() => handlePingCheck(app.subdomain, app.route), index * 300);
    });
  };

  const getRouteStatus = (routeName: string): string => {
    const route = routeStatuses?.find(r => r.routeName === routeName);
    return route?.status || 'unknown';
  };

  const calculateMetrics = () => {
    if (!authMetrics || authMetrics.length === 0) {
      return { latency: 0, successRate: 0, errorRate: 0 };
    }
    
    const latencyMetric = authMetrics.find(m => m.metricName === 'latency');
    const successMetric = authMetrics.find(m => m.metricName === 'successRate');
    const errorMetric = authMetrics.find(m => m.metricName === 'errorRate');
    
    return {
      latency: latencyMetric ? Number(latencyMetric.value) : 0,
      successRate: successMetric ? Number(successMetric.value) : 0,
      errorRate: errorMetric ? Number(errorMetric.value) : 0,
    };
  };

  const metrics = calculateMetrics();

  // Group files by server/client structure
  const groupFilesByStructure = () => {
    const serverFiles: FileCheckResult[] = [];
    const clientFiles: FileCheckResult[] = [];
    
    fileCheckStatus?.expectedFiles.forEach(file => {
      const path = getCorrectPath(file.fileName);
      if (path === '/') {
        clientFiles.push(file);
      } else {
        serverFiles.push(file);
      }
    });
    
    return { serverFiles, clientFiles };
  };

  const { serverFiles, clientFiles } = fileCheckStatus ? groupFilesByStructure() : { serverFiles: [], clientFiles: [] };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.name || 'User'}!
          </p>
        </div>

        {isAdmin && hasMissingFiles && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Missing Required Files</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">
                The dual directory structure is incomplete. {missingFilesCount} required {missingFilesCount === 1 ? 'file is' : 'files are'} missing or not yet uploaded:
              </p>
              <div className="bg-destructive/10 rounded-md p-3 mb-3">
                <ul className="space-y-1 text-sm font-mono">
                  {unmatchedFiles.slice(0, 5).map((file) => (
                    <li key={file} className="flex items-center gap-2">
                      <FileWarning className="h-4 w-4 flex-shrink-0" />
                      <span>{file}</span>
                    </li>
                  ))}
                  {missingFilesCount > 5 && (
                    <li className="text-muted-foreground">...and {missingFilesCount - 5} more</li>
                  )}
                </ul>
              </div>
              <p className="text-sm">
                Please upload or create these files to ensure proper system functionality.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated && !isSubscribed && (
          <Alert className="border-2 border-primary">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Subscribe to all Key-Unlock services for enhanced security features.</span>
              <Button 
                size="sm" 
                onClick={handleSubscribe}
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isAdmin && <TabsTrigger value="files">File Upload & Verification</TabsTrigger>}
            {isAdmin && <TabsTrigger value="auth">Auth Optimization</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle>Profile Information</CardTitle>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                    <p className="text-lg font-semibold">{userProfile?.name || 'Not set'}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                    <Badge variant={getRoleBadgeVariant(userRole || 'guest')}>
                      {userRole || 'guest'}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Principal ID</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded break-all">
                      {shortPrincipal}
                    </p>
                  </div>
                  {isSubscribed && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Subscription Status</p>
                        <Badge variant="default" className="bg-green-600">
                          ✓ Subscribed
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Security Status</CardTitle>
                  </div>
                  <CardDescription>Your authentication details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <button
                    onClick={() => navigate({ to: '/authenticated' })}
                    className="w-full flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors text-left"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Authenticated</p>
                      <p className="text-xs text-muted-foreground">
                        Secured with Internet Identity
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate({ to: '/blockchain-based' })}
                    className="w-full flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-left"
                  >
                    <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Blockchain-based</p>
                      <p className="text-xs text-muted-foreground">
                        Your identity is stored on the Internet Computer
                      </p>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>About This System</CardTitle>
                <CardDescription>
                  Authentication system demonstration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate({ to: '/cryptographic-security' })}
                    className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <img
                      src="/assets/generated/merkle-tree-diagram.dim_600x400.png"
                      alt="Merkle Tree"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm font-medium">Cryptographic Security</p>
                  </button>
                  <button
                    onClick={() => navigate({ to: '/multi-device-support' })}
                    className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <img
                      src="/assets/generated/qr-phone-display.dim_400x300.png"
                      alt="QR Authentication"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm font-medium">Multi-device Support</p>
                  </button>
                  <button
                    onClick={() => navigate({ to: '/protected-identity' })}
                    className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <img
                      src="/assets/generated/security-shield-transparent.dim_64x64.png"
                      alt="Security Shield"
                      className="w-full h-32 object-contain rounded-lg mb-2"
                    />
                    <p className="text-sm font-medium">Protected Identity</p>
                  </button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  This application demonstrates secure authentication using Internet Identity on the Internet Computer blockchain.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="files" className="space-y-6">
              {/* Progress Overview Card */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                        Upload Progress
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {getMatchedFiles.size} of {fileCheckStatus?.expectedFiles.length || 0} files matched
                      </CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'} className={`text-lg px-4 py-2 ${completionPercentage === 100 ? 'bg-green-600' : ''}`}>
                            {completionPercentage}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{getMatchedFiles.size} / {fileCheckStatus?.expectedFiles.length || 0} files matched</p>
                          {unmatchedFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium mb-1">Unmatched files:</p>
                              <ul className="text-xs space-y-0.5">
                                {unmatchedFiles.slice(0, 5).map(f => (
                                  <li key={f}>• {f}</li>
                                ))}
                                {unmatchedFiles.length > 5 && (
                                  <li>...and {unmatchedFiles.length - 5} more</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={completionPercentage} className="h-3" />
                  {getDuplicateFiles.size > 0 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>⚠ Duplicate files detected:</strong> {Array.from(getDuplicateFiles.keys()).join(', ')}. Only the most recent upload will be validated.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Multi-File Uploader
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Upload .js, .md, .yaml, .zip, and .log files via drag-and-drop or file selection
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Drag and drop files here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      Select Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".js,.md,.yaml,.zip,.log"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported formats: .js, .md, .yaml, .zip, .log
                    </p>
                  </div>

                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Uploading files...</p>
                      {Object.entries(uploadProgress).map(([fileName, progress]) => (
                        <div key={fileName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono">{fileName}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {Object.keys(uploadErrors).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-destructive">Upload Errors:</p>
                      {Object.entries(uploadErrors).map(([fileName, error]) => (
                        <Alert key={fileName} variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="flex items-center justify-between">
                            <div>
                              <span className="font-mono text-xs">{fileName}</span>
                              <p className="text-xs mt-1">{error}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryUpload(fileName)}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                        Server Structure Verification
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Monitor server file structure with auto-validation and path correction
                      </CardDescription>
                    </div>
                    <Badge variant={serverFiles.every(f => isFileMatched(f.fileName)) ? 'default' : 'destructive'} className={`text-sm ${serverFiles.every(f => isFileMatched(f.fileName)) ? 'bg-green-600' : ''}`}>
                      {serverFiles.filter(f => isFileMatched(f.fileName)).length} / {serverFiles.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Server Files</h3>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30%]">File Name</TableHead>
                            <TableHead className="w-[18%]">Correct Path</TableHead>
                            <TableHead className="w-[10%]">Type</TableHead>
                            <TableHead className="w-[10%]">Size</TableHead>
                            <TableHead className="w-[15%]">Status</TableHead>
                            <TableHead className="w-[17%]">Hash</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fileCheckLoading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Loading file status...</p>
                              </TableCell>
                            </TableRow>
                          ) : serverFiles.length > 0 ? (
                            serverFiles.map((file) => {
                              const matched = isFileMatched(file.fileName);
                              const duplicate = isFileDuplicate(file.fileName);
                              return (
                                <TableRow key={file.fileName} className={!matched ? 'bg-destructive/5' : ''}>
                                  <TableCell className="font-mono text-xs">
                                    {extractFileName(file.fileName)}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {getCorrectPath(file.fileName)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                      {getFileType(file.fileName)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {matched ? getFileSize(file.fileName) : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {matched ? (
                                      duplicate ? (
                                        <Badge variant="secondary" className="text-xs bg-yellow-600 text-white">
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          Duplicate
                                        </Badge>
                                      ) : (
                                        <Badge variant="default" className="bg-green-600 text-xs">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          ✅ OK
                                        </Badge>
                                      )
                                    ) : (
                                      <Badge variant="destructive" className="text-xs">
                                        <FileX className="h-3 w-3 mr-1" />
                                        Missing
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {matched ? (
                                      <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                                        <Hash className="h-3 w-3" />
                                        {getFileHash(file.fileName)}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No server files configured
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Client Files</h3>
                      <Badge variant="outline" className="ml-auto">
                        {clientFiles.filter(f => isFileMatched(f.fileName)).length} / {clientFiles.length}
                      </Badge>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30%]">File Name</TableHead>
                            <TableHead className="w-[18%]">Correct Path</TableHead>
                            <TableHead className="w-[10%]">Type</TableHead>
                            <TableHead className="w-[10%]">Size</TableHead>
                            <TableHead className="w-[15%]">Status</TableHead>
                            <TableHead className="w-[17%]">Hash</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientFiles.length > 0 ? (
                            clientFiles.map((file) => {
                              const matched = isFileMatched(file.fileName);
                              const duplicate = isFileDuplicate(file.fileName);
                              return (
                                <TableRow key={file.fileName} className={!matched ? 'bg-destructive/5' : ''}>
                                  <TableCell className="font-mono text-xs">
                                    {file.fileName}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {getCorrectPath(file.fileName)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                      {getFileType(file.fileName)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {matched ? getFileSize(file.fileName) : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {matched ? (
                                      duplicate ? (
                                        <Badge variant="secondary" className="text-xs bg-yellow-600 text-white">
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          Duplicate
                                        </Badge>
                                      ) : (
                                        <Badge variant="default" className="bg-green-600 text-xs">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          ✅ OK
                                        </Badge>
                                      )
                                    ) : (
                                      <Badge variant="destructive" className="text-xs">
                                        <FileX className="h-3 w-3 mr-1" />
                                        Missing
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {matched ? (
                                      <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                                        <Hash className="h-3 w-3" />
                                        {getFileHash(file.fileName)}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No client-specific files configured
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {fileCheckStatus && (
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>
                          Last checked: {new Date(Number(fileCheckStatus.lastChecked) / 1000000).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {getMatchedFiles.size} / {fileCheckStatus.expectedFiles.length} files matched
                        </span>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Path Auto-Correction:</strong> All <code className="bg-muted px-1 py-0.5 rounded">.node.js</code> files are automatically mapped to <code className="bg-muted px-1 py-0.5 rounded">/routes/</code> regardless of upload location. Files like <code className="bg-muted px-1 py-0.5 rounded">compliance.js</code> go to <code className="bg-muted px-1 py-0.5 rounded">/utils/</code>, while <code className="bg-muted px-1 py-0.5 rounded">server.js</code> and <code className="bg-muted px-1 py-0.5 rounded">manifest.yaml</code> remain in root.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="auth" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Live Authentication Metrics
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Real-time performance monitoring for login and auth operations
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={handlePingAllApps} disabled={isCheckingRoute}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingRoute ? 'animate-spin' : ''}`} />
                      Refresh All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Latency
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{metrics.latency}ms</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Average response time
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Success Rate
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{metrics.successRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Successful authentications
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Error Rate
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{metrics.errorRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Failed authentication attempts
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Subdomain Route Status</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30%]">Application</TableHead>
                            <TableHead className="w-[25%]">Subdomain</TableHead>
                            <TableHead className="w-[25%]">Route Module</TableHead>
                            <TableHead className="w-[15%]">Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subdomainApps.map((app) => {
                            const status = getRouteStatus(app.route);
                            return (
                              <TableRow key={app.subdomain}>
                                <TableCell className="font-medium">{app.name}</TableCell>
                                <TableCell className="font-mono text-xs">{app.subdomain}.caffeine.xyz</TableCell>
                                <TableCell className="font-mono text-xs">{app.route}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={status === 'active' ? 'default' : status === 'inactive' ? 'destructive' : 'secondary'}
                                    className={status === 'active' ? 'bg-green-600' : ''}
                                  >
                                    <div className={`h-2 w-2 rounded-full mr-2 ${
                                      status === 'active' ? 'bg-white' : 
                                      status === 'inactive' ? 'bg-white' : 
                                      'bg-muted-foreground'
                                    }`} />
                                    {status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePingCheck(app.subdomain, app.route)}
                                    disabled={isCheckingRoute}
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
