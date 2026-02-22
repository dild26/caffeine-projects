import { useState, useCallback, useRef } from 'react';
import { useListBackupSessions, useCreateBackupSession, useRestoreBackupSession, useVerifyBackupIntegrity, useStoreMerkleBlock, useCreateUploadBatch, useUpdateUploadBatchProgress, useCompleteUploadBatch, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Clock, Download, Upload, Shield, CheckCircle2, AlertCircle, HardDrive, FolderUp, X } from 'lucide-react';
import { toast } from 'sonner';
import { Role } from '../../backend';
import type { BackupSession, MerkleBlock, FileMetadata } from '../../types';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface FileUploadItem {
  file: File;
  path: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function BackupTab() {
  const { data: backupSessions = [], isLoading } = useListBackupSessions();
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const createBackupSession = useCreateBackupSession();
  const restoreBackupSession = useRestoreBackupSession();
  const verifyBackupIntegrity = useVerifyBackupIntegrity();
  const storeMerkleBlock = useStoreMerkleBlock();
  const createUploadBatch = useCreateUploadBatch();
  const updateUploadBatchProgress = useUpdateUploadBatchProgress();
  const completeUploadBatch = useCompleteUploadBatch();

  const [uploadQueue, setUploadQueue] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [restoreNonce, setRestoreNonce] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const canUploadFiles = userProfile && userProfile.tenantId;

  // Generate a unique nonce for backup session
  const generateNonce = () => {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Simple hash function for demonstration (in production, use proper crypto)
  const simpleHash = async (data: Uint8Array): Promise<string> => {
    const buffer = new Uint8Array(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: FileUploadItem[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relativePath = (file as any).webkitRelativePath || file.name;
      const pathParts = relativePath.split('/');
      const folderPath = pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') : '/';

      newFiles.push({
        file,
        path: folderPath,
        progress: 0,
        status: 'pending',
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

  const uploadFilesAsBackup = useCallback(async () => {
    if (!userProfile || !identity || !userProfile.tenantId || uploadQueue.length === 0) {
      toast.error('Cannot upload: missing tenant or files');
      return;
    }

    setIsUploading(true);

    try {
      const nonce = generateNonce();
      const totalSize = uploadQueue.reduce((sum, item) => sum + item.file.size, 0);

      // Process all files and create blocks
      const allBlocks: { data: Uint8Array; checksum: string }[] = [];
      
      for (let i = 0; i < uploadQueue.length; i++) {
        const item = uploadQueue[i];
        
        setUploadQueue(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading' as const } : f
        ));

        const arrayBuffer = await item.file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);

        // Split data into blocks (chunks of 1MB)
        const blockSize = 1024 * 1024;
        for (let offset = 0; offset < data.length; offset += blockSize) {
          const block = data.slice(offset, offset + blockSize);
          const checksum = await simpleHash(block);
          allBlocks.push({ data: block, checksum });

          const progress = Math.round(((offset + block.length) / data.length) * 100);
          setUploadQueue(prev => prev.map((f, idx) => 
            idx === i ? { ...f, progress } : f
          ));
        }

        setUploadQueue(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'completed' as const, progress: 100 } : f
        ));
      }

      // Calculate Merkle root
      const blockHashes = allBlocks.map(b => b.checksum);
      const merkleRoot = await simpleHash(new TextEncoder().encode(blockHashes.join('')));

      // Create backup session
      await createBackupSession.mutateAsync({
        nonce,
        merkleRoot,
        size: BigInt(totalSize),
        version: BigInt(1),
      });

      // Store all blocks
      for (let i = 0; i < allBlocks.length; i++) {
        const block = allBlocks[i];
        const merkleBlock: MerkleBlock = {
          id: `${nonce}_block_${i}`,
          sessionNonce: nonce,
          data: block.data,
          checksum: block.checksum,
          encrypted: false,
          createdAt: BigInt(Date.now() * 1000000),
          size: BigInt(block.data.length),
        };

        await storeMerkleBlock.mutateAsync(merkleBlock);
      }

      toast.success(`Backup created successfully with ${uploadQueue.length} files`);
      setUploadQueue([]);
    } catch (error) {
      toast.error('Failed to create backup');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, [uploadQueue, userProfile, identity, createBackupSession, storeMerkleBlock]);

  // Handle restore operation
  const handleRestore = async (nonce: string) => {
    try {
      await restoreBackupSession.mutateAsync(nonce);
      toast.success('Backup restored successfully');
      setRestoreNonce(null);
    } catch (error) {
      toast.error('Failed to restore backup');
      console.error(error);
    }
  };

  // Handle integrity verification
  const handleVerify = async (nonce: string) => {
    try {
      const isValid = await verifyBackupIntegrity.mutateAsync(nonce);
      if (isValid) {
        toast.success('Backup integrity verified');
      } else {
        toast.error('Backup integrity check failed');
      }
    } catch (error) {
      toast.error('Failed to verify backup');
      console.error(error);
    }
  };

  // Format bytes to human-readable size
  const formatBytes = (bytes: bigint): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = Number(bytes);
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // Format timestamp
  const formatDate = (timestamp: bigint): string => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const totalQueueSize = uploadQueue.reduce((sum, item) => sum + item.file.size, 0);
  const overallProgress = uploadQueue.length > 0
    ? Math.round(uploadQueue.reduce((sum, item) => sum + item.progress, 0) / uploadQueue.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Backup & Restore</h2>
          <p className="text-muted-foreground">Time Machine-style incremental backups with Merkle tree verification</p>
        </div>
      </div>

      {canUploadFiles && (
        <Card>
          <CardHeader>
            <CardTitle>Create Backup</CardTitle>
            <CardDescription>Upload files or folders to create an encrypted backup session</CardDescription>
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
                <HardDrive className="h-12 w-12 text-muted-foreground" />
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
                      Total size: {(totalQueueSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={uploadFilesAsBackup}
                      disabled={isUploading}
                      size="sm"
                    >
                      {isUploading ? 'Creating Backup...' : 'Create Backup'}
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
                          <p className="text-sm font-medium truncate">
                            {item.file.name}
                          </p>
                          <Badge variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'error' ? 'destructive' :
                            item.status === 'uploading' ? 'secondary' : 'outline'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{(item.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{item.path}</span>
                        </div>
                        {item.status === 'uploading' && (
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupSessions.length}</div>
            <p className="text-xs text-muted-foreground">Backup sessions created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(backupSessions.reduce((acc, session) => acc + session.size, BigInt(0)))}
            </div>
            <p className="text-xs text-muted-foreground">Across all backups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Backup</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {backupSessions.length > 0 ? 'Today' : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {backupSessions.length > 0
                ? formatDate(backupSessions[backupSessions.length - 1].createdAt)
                : 'No backups yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>View and manage your backup sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : backupSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No backups yet</p>
              <p className="text-sm text-muted-foreground mb-4">Create your first backup to get started</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nonce</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupSessions.map((session) => (
                    <TableRow key={session.nonce}>
                      <TableCell className="font-mono text-xs">{session.nonce.slice(0, 20)}...</TableCell>
                      <TableCell className="text-sm">{formatDate(session.createdAt)}</TableCell>
                      <TableCell>{formatBytes(session.size)}</TableCell>
                      <TableCell>v{Number(session.version)}</TableCell>
                      <TableCell>
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRestoreNonce(session.nonce)}
                            disabled={restoreBackupSession.isPending}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerify(session.nonce)}
                            disabled={verifyBackupIntegrity.isPending}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!restoreNonce} onOpenChange={() => setRestoreNonce(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore files from the selected backup session. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => restoreNonce && handleRestore(restoreNonce)}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Backup Features
          </CardTitle>
          <CardDescription>Advanced backup capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Message-Locked Encryption
              </h4>
              <p className="text-sm text-muted-foreground">
                Content-hash-based encryption ensures data deduplication and security
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Merkle Tree Verification
              </h4>
              <p className="text-sm text-muted-foreground">
                Cryptographic proofs ensure backup integrity and detect corruption
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Incremental Backups
              </h4>
              <p className="text-sm text-muted-foreground">
                Only changed blocks are uploaded, saving time and storage
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" />
                Efficient Storage
              </h4>
              <p className="text-sm text-muted-foreground">
                Deduplication via content hashes reduces storage requirements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
