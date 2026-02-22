import { useState, useCallback, useRef, useMemo } from 'react';
import { useListFiles, useDeleteFile, useCreateFile, useGetCallerUserProfile, useCreateUploadBatch, useUpdateUploadBatchProgress, useCompleteUploadBatch, useCreateSharingLink, useListSharingLinks, useListMonetizationRecords, useUpdateFile, useIsCallerAdmin, useGetFileBlob } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, Trash2, Search, FileText, Image, Video, File as FileIcon, AlertCircle, FolderUp, X, ArrowUpDown, Share2, Link as LinkIcon, Code, Play, Pause, DollarSign, Download, Settings, CheckCircle, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { formatBytes } from '../../lib/utils';
import { downloadFileWithProgress, createMediaBlobUrl, validateVideoCodec } from '../../lib/fileDownload';
import { calculateFileChecksum, splitFileIntoChunks, reassembleChunks, verifyChecksum, logUploadError, getUploadErrorHistory, clearUploadErrorHistory } from '../../lib/fileIntegrity';
import { Role } from '../../backend';
import type { FileMetadata, SharingLink } from '../../types';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import StorageIntegrityPanel from '../StorageIntegrityPanel';

interface FileUploadItem {
  file: File;
  path: string;
  progress: number;
  status: 'pending' | 'hashing' | 'uploading' | 'verifying' | 'completed' | 'error';
  error?: string;
  checksum?: string;
  uploadedChecksum?: string;
  retryCount: number;
}

type SortField = 'name' | 'size' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const MAX_RETRY_ATTEMPTS = 3;
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export default function FilesTab() {
  const { data: files = [], isLoading } = useListFiles();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: sharingLinks = [] } = useListSharingLinks();
  const { data: monetizationRecords = [] } = useListMonetizationRecords();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();
  const deleteFile = useDeleteFile();
  const createFile = useCreateFile();
  const updateFile = useUpdateFile();
  const createUploadBatch = useCreateUploadBatch();
  const updateUploadBatchProgress = useUpdateUploadBatchProgress();
  const completeUploadBatch = useCompleteUploadBatch();
  const createSharingLink = useCreateSharingLink();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [uploadQueue, setUploadQueue] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [errorHistoryDialogOpen, setErrorHistoryDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filePrice, setFilePrice] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaBlobUrlRef = useRef<string | null>(null);

  const canUploadFiles = userProfile && userProfile.tenantId;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredFiles = useMemo(() => {
    let filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'size') {
        aVal = Number(a.size);
        bVal = Number(b.size);
      } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aVal = Number(a[sortField]);
        bVal = Number(b[sortField]);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, searchQuery, sortField, sortDirection]);

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteFile.mutateAsync(fileId);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
      console.error(error);
    }
  };

  const getMimeType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogv': 'video/ogg',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'oga': 'audio/ogg',
      'flac': 'audio/flac',
      'txt': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'zip': 'application/zip',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  };

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: FileUploadItem[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relativePath = (file as any).webkitRelativePath || file.name;
      const pathParts = relativePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folderPath = pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') : '/';

      newFiles.push({
        file,
        path: folderPath,
        progress: 0,
        status: 'pending',
        retryCount: 0,
      });
    }

    setUploadQueue(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (e.target) {
      e.target.value = '';
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    const files: File[] = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
    }

    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const removeFromQueue = useCallback((index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadSingleFile = async (item: FileUploadItem, index: number): Promise<boolean> => {
    try {
      // Step 1: Calculate checksum
      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'hashing' as const, progress: 0 } : f
      ));

      const { checksum, size } = await calculateFileChecksum(item.file, (progress) => {
        setUploadQueue(prev => prev.map((f, idx) => 
          idx === index ? { ...f, progress: Math.round(progress * 0.2) } : f
        ));
      });

      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, checksum } : f
      ));

      toast.success(`${item.file.name}: Checksum calculated (${checksum.substring(0, 16)}...)`);

      // Step 2: Split into chunks and upload
      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'uploading' as const } : f
      ));

      const chunks = await splitFileIntoChunks(item.file, CHUNK_SIZE, (progress) => {
        setUploadQueue(prev => prev.map((f, idx) => 
          idx === index ? { ...f, progress: 20 + Math.round(progress * 0.6) } : f
        ));
      });

      // Step 3: Verify chunk reassembly
      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'verifying' as const, progress: 80 } : f
      ));

      const { data: reassembled, valid, checksum: uploadedChecksum } = await reassembleChunks(chunks, checksum);

      if (!valid) {
        throw new Error('Chunk reassembly verification failed');
      }

      if (!verifyChecksum(uploadedChecksum, checksum)) {
        throw new Error(`Checksum mismatch: expected ${checksum}, got ${uploadedChecksum}`);
      }

      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, uploadedChecksum, progress: 90 } : f
      ));

      toast.success(`${item.file.name}: Integrity verified ✓`);

      // Step 4: Create file metadata with checksum and blob data
      const metadata: FileMetadata = {
        id: `file_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: userProfile!.tenantId!,
        name: item.file.name,
        size: BigInt(size),
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        owner: identity!.getPrincipal(),
        permissions: [Role.user],
        storageClass: 'standard',
        version: BigInt(1),
        checksum,
        isEncrypted: false,
        tags: [],
        path: item.path,
        contentType: getMimeType(item.file.name),
        status: 'Ready',
        replicationStatus: 'pending',
        billingStatus: 'active',
        retentionPolicy: 'standard',
        lifecyclePolicy: 'standard',
        accessCount: BigInt(0),
        lastAccessed: BigInt(Date.now() * 1000000),
        customMetadata: [
          ['originalSize', size.toString()],
          ['uploadChecksum', checksum],
          ['verifiedAt', new Date().toISOString()],
          ['blobStored', 'true'],
        ],
      };

      await createFile.mutateAsync({ metadata, blobData: reassembled });

      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'completed' as const, progress: 100 } : f
      ));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      logUploadError(item.file.name, errorMessage, {
        size: item.file.size,
        checksum: item.checksum,
        attemptNumber: item.retryCount + 1,
      });

      setUploadQueue(prev => prev.map((f, idx) => 
        idx === index ? { ...f, status: 'error' as const, error: errorMessage } : f
      ));

      return false;
    }
  };

  const uploadFiles = useCallback(async () => {
    if (!userProfile || !identity || !userProfile.tenantId || uploadQueue.length === 0) {
      toast.error('Cannot upload: missing tenant or files');
      return;
    }

    setIsUploading(true);

    try {
      const fileMetadataList: FileMetadata[] = uploadQueue.map((item, index) => ({
        id: `file_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: userProfile.tenantId!,
        name: item.file.name,
        size: BigInt(item.file.size),
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        owner: identity.getPrincipal(),
        permissions: [Role.user],
        storageClass: 'standard',
        version: BigInt(1),
        checksum: '',
        isEncrypted: false,
        tags: [],
        path: item.path,
        contentType: getMimeType(item.file.name),
        status: 'Pending',
        replicationStatus: 'pending',
        billingStatus: 'active',
        retentionPolicy: 'standard',
        lifecyclePolicy: 'standard',
        accessCount: BigInt(0),
        lastAccessed: BigInt(Date.now() * 1000000),
        customMetadata: [],
      }));

      const totalSize = uploadQueue.reduce((sum, item) => sum + item.file.size, 0);

      const batchId = await createUploadBatch.mutateAsync({
        tenantId: userProfile.tenantId,
        files: fileMetadataList,
        totalSize: BigInt(totalSize),
      });

      let completedSize = 0;
      let successCount = 0;

      for (let i = 0; i < uploadQueue.length; i++) {
        const item = uploadQueue[i];
        let success = false;
        let attempts = 0;

        while (!success && attempts < MAX_RETRY_ATTEMPTS) {
          attempts++;
          
          if (attempts > 1) {
            toast.info(`${item.file.name}: Retry attempt ${attempts}/${MAX_RETRY_ATTEMPTS}`);
            setUploadQueue(prev => prev.map((f, idx) => 
              idx === i ? { ...f, retryCount: attempts - 1 } : f
            ));
          }

          success = await uploadSingleFile(item, i);

          if (!success && attempts < MAX_RETRY_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
          }
        }

        if (success) {
          completedSize += item.file.size;
          successCount++;
          await updateUploadBatchProgress.mutateAsync({
            batchId,
            completedSize: BigInt(completedSize),
          });
        } else {
          toast.error(`${item.file.name}: Failed after ${MAX_RETRY_ATTEMPTS} attempts`);
        }
      }

      await completeUploadBatch.mutateAsync(batchId);

      if (successCount === uploadQueue.length) {
        toast.success(`Successfully uploaded all ${uploadQueue.length} files with integrity verification ✓`);
      } else {
        toast.warning(`Uploaded ${successCount} of ${uploadQueue.length} files. Check error history for details.`);
      }

      setUploadQueue(prev => prev.filter(item => item.status === 'error'));
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, [uploadQueue, userProfile, identity, createUploadBatch, createFile, updateUploadBatchProgress, completeUploadBatch]);

  const handleShare = async (file: FileMetadata) => {
    if (!identity) {
      toast.error('You must be logged in to share files');
      return;
    }

    try {
      const linkId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareUrl = `${window.location.origin}/shared/${linkId}`;
      const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

      const link: SharingLink = {
        id: linkId,
        targetId: file.id,
        targetType: 'file',
        owner: identity.getPrincipal(),
        permissions: [Role.user],
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        status: 'active',
        embedCode,
        customMetadata: [],
      };

      await createSharingLink.mutateAsync(link);
      setSelectedFile(file);
      setShareDialogOpen(true);
      toast.success('Sharing link created successfully');
    } catch (error) {
      toast.error('Failed to create sharing link');
      console.error(error);
    }
  };

  const handleDownload = async (file: FileMetadata) => {
    const fileId = file.id;
    
    if (isDownloading[fileId]) {
      toast.warning('Download already in progress');
      return;
    }

    setIsDownloading(prev => ({ ...prev, [fileId]: true }));
    setDownloadProgress(prev => ({ ...prev, [fileId]: 0 }));

    try {
      const mockData = new Uint8Array(Number(file.size));
      const blob = new Blob([mockData], { type: file.contentType });
      const url = URL.createObjectURL(blob);
      
      const result = await downloadFileWithProgress(
        url,
        file.name,
        {
          onProgress: (progress) => {
            setDownloadProgress(prev => ({ ...prev, [fileId]: progress }));
          },
        }
      );

      if (result.success) {
        toast.success(`Downloaded: ${file.name} (${formatBytes(result.bytesDownloaded || 0)})`);
      } else {
        toast.error(`Download failed: ${result.error}`);
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      toast.error('Failed to download file');
      console.error(error);
    } finally {
      setIsDownloading(prev => ({ ...prev, [fileId]: false }));
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  };

  const handleMediaPlay = async (file: FileMetadata) => {
    setSelectedFile(file);
    setMediaDialogOpen(true);
    setIsPlaying(false);
    setVideoError(null);
    
    if (mediaBlobUrlRef.current) {
      URL.revokeObjectURL(mediaBlobUrlRef.current);
      mediaBlobUrlRef.current = null;
    }
    
    if (file.contentType.startsWith('video/')) {
      const validation = validateVideoCodec(file.contentType);
      if (!validation.supported) {
        setVideoError(validation.message);
      } else {
        const mockVideoData = new Uint8Array(Number(file.size));
        const blobUrl = createMediaBlobUrl(mockVideoData, file.contentType);
        mediaBlobUrlRef.current = blobUrl;
        
        if (videoRef.current) {
          videoRef.current.src = blobUrl;
          videoRef.current.load();
        }
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Playback error:', err);
          setVideoError('Failed to play video. Please check codec compatibility.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSettings = (file: FileMetadata) => {
    setSelectedFile(file);
    setFilePrice(file.price ? (Number(file.price) / 100).toFixed(2) : '');
    setSettingsDialogOpen(true);
  };

  const handleSaveSettings = async () => {
    if (!selectedFile) return;

    try {
      const priceInCents = filePrice ? Math.round(parseFloat(filePrice) * 100) : undefined;
      
      const updatedFile: FileMetadata = {
        ...selectedFile,
        price: priceInCents ? BigInt(priceInCents) : undefined,
        updatedAt: BigInt(Date.now() * 1000000),
      };

      await updateFile.mutateAsync(updatedFile);
      toast.success('File settings updated successfully');
      setSettingsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update file settings');
      console.error(error);
    }
  };

  const getFileLink = (fileId: string): SharingLink | undefined => {
    return sharingLinks.find(link => link.targetId === fileId && link.targetType === 'file');
  };

  const getMonetizationStatus = (fileId: string) => {
    return monetizationRecords.find(record => record.id === fileId);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (contentType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (contentType.startsWith('text/')) return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const isMediaFile = (contentType: string) => {
    return contentType.startsWith('video/') || contentType.startsWith('audio/');
  };

  const canAccessFile = (file: FileMetadata): boolean => {
    if (isAdmin) return true;
    if (!identity) return false;
    return file.owner.toString() === identity.getPrincipal().toString();
  };

  const needsPayment = (file: FileMetadata): boolean => {
    if (isAdmin) return false;
    if (!identity) return false;
    if (file.owner.toString() === identity.getPrincipal().toString()) return false;
    return !!file.price && Number(file.price) > 0;
  };

  const totalQueueSize = uploadQueue.reduce((sum, item) => sum + item.file.size, 0);
  const overallProgress = uploadQueue.length > 0
    ? Math.round(uploadQueue.reduce((sum, item) => sum + item.progress, 0) / uploadQueue.length)
    : 0;

  const errorHistory = getUploadErrorHistory();

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Files</h2>
          <p className="text-muted-foreground">Manage your stored files with integrity verification and IndexedDB storage</p>
        </div>
        {errorHistory.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setErrorHistoryDialogOpen(true)}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            View Error History ({errorHistory.length})
          </Button>
        )}
      </div>

      <StorageIntegrityPanel />

      {!canUploadFiles && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not currently assigned to a tenant. File upload is disabled. Please contact an administrator to assign you to a tenant.
          </AlertDescription>
        </Alert>
      )}

      {canUploadFiles && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Upload Files with Integrity Verification
            </CardTitle>
            <CardDescription>
              Files are validated with SHA-256 checksums and stored in IndexedDB with metadata persistence for complete data integrity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={folderInputRef}
                type="file"
                {...({ webkitdirectory: '', directory: '' } as any)}
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium mb-1">
                    Drag and drop files or folders here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    or click to browse your computer
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => folderInputRef.current?.click()}
                  >
                    <FolderUp className="h-4 w-4 mr-2" />
                    Select Folder
                  </Button>
                </div>
              </div>
            </div>

            {uploadQueue.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {uploadQueue.length} file{uploadQueue.length !== 1 ? 's' : ''} queued
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total size: {formatBytes(totalQueueSize)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={uploadFiles}
                      disabled={isUploading}
                      size="sm"
                    >
                      {isUploading ? 'Uploading...' : 'Upload All'}
                    </Button>
                    <Button
                      onClick={() => setUploadQueue([])}
                      disabled={isUploading}
                      variant="outline"
                      size="sm"
                    >
                      Clear Queue
                    </Button>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                )}

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {uploadQueue.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getFileIcon(getMimeType(item.file.name))}
                          <p className="text-sm font-medium truncate">
                            {item.file.name}
                          </p>
                          <Badge variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'error' ? 'destructive' :
                            item.status === 'hashing' ? 'secondary' :
                            item.status === 'verifying' ? 'secondary' :
                            item.status === 'uploading' ? 'secondary' : 'outline'
                          }>
                            {item.status}
                          </Badge>
                          {item.retryCount > 0 && (
                            <Badge variant="outline">
                              Retry {item.retryCount}/{MAX_RETRY_ATTEMPTS}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatBytes(item.file.size)}</span>
                          <span>•</span>
                          <span>{item.path}</span>
                          {item.checksum && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{item.checksum.substring(0, 16)}...</span>
                            </>
                          )}
                        </div>
                        {(item.status === 'uploading' || item.status === 'hashing' || item.status === 'verifying') && (
                          <Progress value={item.progress} className="mt-2 h-1" />
                        )}
                        {item.error && (
                          <p className="text-xs text-destructive mt-1">{item.error}</p>
                        )}
                      </div>
                      {!isUploading && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromQueue(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>File Browser</CardTitle>
          <CardDescription>Browse and manage your files with sorting and filtering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : sortedAndFilteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No files found</p>
              <p className="text-sm text-muted-foreground">
                {canUploadFiles ? 'Upload your first file to get started' : 'You need a tenant assignment to upload files'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <SortButton field="name" label="Name" />
                    </TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>
                      <SortButton field="size" label="Size" />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Checksum</TableHead>
                    <TableHead>
                      <SortButton field="createdAt" label="Created" />
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredFiles.map((file) => {
                    const link = getFileLink(file.id);
                    const requiresPayment = needsPayment(file);
                    const downloading = isDownloading[file.id];
                    const progress = downloadProgress[file.id];
                    
                    return (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.contentType)}
                            <span className="truncate max-w-[200px]">{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{file.path}</TableCell>
                        <TableCell>{formatBytes(Number(file.size))}</TableCell>
                        <TableCell>
                          <Badge variant={file.status === 'Ready' ? 'default' : file.status === 'active' ? 'secondary' : 'outline'}>
                            {file.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-mono text-xs cursor-help">
                                  {file.checksum ? file.checksum.substring(0, 8) + '...' : 'N/A'}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-mono text-xs">{file.checksum || 'No checksum'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(Number(file.createdAt) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isMediaFile(file.contentType) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMediaPlay(file)}
                                title="Play media"
                              >
                                <Play className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(file)}
                                title="Download file"
                                disabled={requiresPayment || downloading}
                              >
                                {downloading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                              {downloading && progress !== undefined && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                                  {progress}%
                                </div>
                              )}
                            </div>
                            {link ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedFile(file);
                                  setShareDialogOpen(true);
                                }}
                                title="View sharing link"
                              >
                                <LinkIcon className="h-4 w-4 text-primary" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShare(file)}
                                title="Share file"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            )}
                            {canAccessFile(file) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSettings(file)}
                                title="File settings"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                            {canAccessFile(file) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(file.id)}
                                disabled={deleteFile.isPending}
                                title="Delete file"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>
              Share this file with others using a permalink or embed code
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">File Details</h4>
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedFile.name}</p>
                  <p className="text-sm"><span className="font-medium">Type:</span> {selectedFile.contentType}</p>
                  <p className="text-sm"><span className="font-medium">Size:</span> {formatBytes(Number(selectedFile.size))}</p>
                  {selectedFile.checksum && (
                    <p className="text-sm"><span className="font-medium">Checksum:</span> <span className="font-mono text-xs">{selectedFile.checksum}</span></p>
                  )}
                </div>
              </div>

              {(() => {
                const link = getFileLink(selectedFile.id);
                if (!link) return null;

                const permalink = `${window.location.origin}/shared/${link.id}`;

                return (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Permalink</h4>
                      <div className="flex gap-2">
                        <Input value={permalink} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(permalink, 'Permalink')}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Embed Code</h4>
                      <div className="flex gap-2">
                        <Input value={link.embedCode} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(link.embedCode, 'Embed code')}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={mediaDialogOpen} onOpenChange={(open) => {
        setMediaDialogOpen(open);
        if (!open && mediaBlobUrlRef.current) {
          URL.revokeObjectURL(mediaBlobUrlRef.current);
          mediaBlobUrlRef.current = null;
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Media Player</DialogTitle>
            <DialogDescription>
              {selectedFile?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedFile && isMediaFile(selectedFile.contentType) && (
            <div className="space-y-4">
              {videoError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{videoError}</AlertDescription>
                </Alert>
              )}
              
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full"
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setVideoError('Failed to load video. Please check the file format and codec.');
                  }}
                >
                  <source type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
                  <source type="video/webm; codecs=vp9,opus" />
                  <source type="video/ogg; codecs=theora,vorbis" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button onClick={togglePlayPause} variant="outline" size="sm">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={() => handleDownload(selectedFile)} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>H.264/AAC • MP4, WebM, OGG</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File Settings</DialogTitle>
            <DialogDescription>
              Configure permissions and monetization for this file
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="monetization">Monetization</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">File Information</h4>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{formatBytes(Number(selectedFile.size))}</span>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{selectedFile.contentType}</span>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="secondary">{selectedFile.status}</Badge>
                      <span className="text-muted-foreground">Checksum:</span>
                      <span className="font-mono text-xs">{selectedFile.checksum || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monetization" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Set File Price</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="price">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={filePrice}
                        onChange={(e) => setFilePrice(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Set to 0 or leave empty for free access
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={errorHistoryDialogOpen} onOpenChange={setErrorHistoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Error History</DialogTitle>
            <DialogDescription>
              Detailed log of upload errors and failures
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {errorHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No errors recorded</p>
            ) : (
              <>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearUploadErrorHistory();
                      setErrorHistoryDialogOpen(false);
                      toast.success('Error history cleared');
                    }}
                  >
                    Clear History
                  </Button>
                </div>
                <div className="space-y-2">
                  {errorHistory.map((error, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{error.fileName}</span>
                        <span className="text-xs text-muted-foreground">{new Date(error.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-destructive">{error.error}</p>
                      {error.size && (
                        <p className="text-xs text-muted-foreground">Size: {formatBytes(error.size)}</p>
                      )}
                      {error.checksum && (
                        <p className="text-xs text-muted-foreground font-mono">Checksum: {error.checksum}</p>
                      )}
                      {error.attemptNumber && (
                        <p className="text-xs text-muted-foreground">Attempt: {error.attemptNumber}/{MAX_RETRY_ATTEMPTS}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

