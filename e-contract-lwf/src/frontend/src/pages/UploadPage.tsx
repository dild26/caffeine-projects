import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddFileMetadata, usePaginateFiles, useAddManifestEntry } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, CheckCircle2, AlertCircle, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FileType } from '../backend';
import { Progress } from '@/components/ui/progress';
import { maskHash } from '../lib/hashUtils';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  hash?: string;
  error?: string;
  retryCount: number;
}

// Extract basename from filename (removes extension, normalized to lowercase)
function getBaseName(filename: string): string {
  // Remove extension and normalize to lowercase for case-insensitive matching
  return filename.replace(/\.(json|md|txt|zip)$/i, '').toLowerCase();
}

export default function UploadPage() {
  const { identity } = useInternetIdentity();
  const { data: paginatedResult } = usePaginateFiles(0, 1000);
  const files = paginatedResult?.items || [];
  const addFileMetadata = useAddFileMetadata();
  const addManifestEntry = useAddManifestEntry();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const calculateSHA256 = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (hashArray.length !== 32) {
      throw new Error('Invalid SHA-256 hash length');
    }
    
    return hash;
  };

  const sanitizeContent = (content: string, fileType: FileType): string => {
    let sanitized = content.normalize('NFKC').replace(/\r\n/g, '\n');
    
    if (fileType === FileType.markdown) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }
    
    return sanitized;
  };

  const getFileType = (file: File): FileType => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'json': return FileType.json;
      case 'md': return FileType.markdown;
      case 'txt': return FileType.text;
      case 'zip': return FileType.zip;
      default: return FileType.text;
    }
  };

  const uploadSingleFile = async (uploadFile: UploadFile, retryAttempt: number = 0): Promise<void> => {
    try {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ));

      const fileType = getFileType(uploadFile.file);
      const content = await uploadFile.file.text();
      const sanitizedContent = sanitizeContent(content, fileType);
      
      const hash = await calculateSHA256(sanitizedContent);

      // Check for duplicate hash
      const existingFile = files.find(f => f.hash === hash);
      if (existingFile) {
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed' as const, hash, progress: 100 } 
            : f
        ));
        
        await addManifestEntry.mutateAsync({
          action: 'FILE_DEDUPLICATED',
          details: JSON.stringify({
            file_name: uploadFile.file.name,
            basename: getBaseName(uploadFile.file.name),
            type: fileType,
            status: 'deduplicated',
            hash,
            existing_file: existingFile.name,
            timestamp: Date.now(),
          }),
        });
        
        toast.info(`File already exists: ${uploadFile.file.name}`);
        return;
      }

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: i } : f
        ));
      }

      // Extract basename for pairing validation (normalized to lowercase)
      const basename = getBaseName(uploadFile.file.name);
      console.log('📁 Processing file:', uploadFile.file.name, '| Basename:', basename, '| Type:', fileType);
      
      // Find potential pair by basename (case-insensitive, using fileType metadata ONLY)
      const pairedJson = files.find(f => {
        const fBasename = getBaseName(f.name);
        const matches = fBasename === basename && f.fileType === FileType.json;
        if (matches) {
          console.log('✓ Found JSON pair:', f.name, '| Basename:', fBasename);
        }
        return matches;
      });
      
      const pairedMd = files.find(f => {
        const fBasename = getBaseName(f.name);
        const matches = fBasename === basename && f.fileType === FileType.markdown;
        if (matches) {
          console.log('✓ Found MD pair:', f.name, '| Basename:', fBasename);
        }
        return matches;
      });

      // Add file metadata
      await addFileMetadata.mutateAsync({
        id: uploadFile.id,
        name: uploadFile.file.name,
        fileType,
        size: BigInt(sanitizedContent.length),
        hash,
        uploadTime: BigInt(Date.now() * 1_000_000),
        owner: identity!.getPrincipal(),
      });

      // Log pairing status to manifest
      const pairingStatus = {
        file_name: uploadFile.file.name,
        basename,
        type: fileType,
        status: 'uploaded',
        hash,
        size: sanitizedContent.length,
        paired: false,
        pair_file: null as string | null,
        timestamp: Date.now(),
      };

      // Check pairing based on fileType metadata ONLY
      if (fileType === FileType.json && pairedMd) {
        pairingStatus.paired = true;
        pairingStatus.pair_file = pairedMd.name;
        console.log('✓ JSON file paired with MD:', pairedMd.name);
      } else if (fileType === FileType.markdown && pairedJson) {
        pairingStatus.paired = true;
        pairingStatus.pair_file = pairedJson.name;
        console.log('✓ MD file paired with JSON:', pairedJson.name);
      } else if (fileType === FileType.json || fileType === FileType.markdown) {
        // Log unpaired file as info (not error)
        const expectedPairType = fileType === FileType.json ? '.md' : '.json';
        console.log(`⚠ Unpaired ${fileType === FileType.json ? 'JSON' : 'MD'} file: ${uploadFile.file.name} | Expected pair: ${basename}${expectedPairType}`);
        
        await addManifestEntry.mutateAsync({
          action: 'FILE_UNPAIRED',
          details: JSON.stringify({
            ...pairingStatus,
            info: `No matching ${expectedPairType} file found for basename: ${basename}`,
            expected_pair: `${basename}${expectedPairType}`,
          }),
        });
      }

      await addManifestEntry.mutateAsync({
        action: 'FILE_UPLOADED',
        details: JSON.stringify(pairingStatus),
      });

      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'completed' as const, hash, progress: 100 } 
          : f
      ));

      toast.success(`Uploaded: ${uploadFile.file.name}`);
      console.log('✓ Upload complete:', uploadFile.file.name);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      console.error('✗ Upload error:', errorMessage);
      
      if (retryAttempt < 3) {
        console.log(`🔄 Retrying upload (${retryAttempt + 1}/3):`, uploadFile.file.name);
        toast.warning(`Retrying upload: ${uploadFile.file.name} (Attempt ${retryAttempt + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryAttempt + 1)));
        return uploadSingleFile(uploadFile, retryAttempt + 1);
      }
      
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error' as const, error: errorMessage, retryCount: retryAttempt } 
          : f
      ));
      
      await addManifestEntry.mutateAsync({
        action: 'FILE_UPLOAD_FAILED',
        details: JSON.stringify({
          file_name: uploadFile.file.name,
          basename: getBaseName(uploadFile.file.name),
          error: errorMessage,
          retry_count: retryAttempt,
          timestamp: Date.now(),
        }),
      });
      
      toast.error(`Failed to upload: ${uploadFile.file.name} - ${errorMessage}`);
    }
  };

  const handleFiles = useCallback(async (fileList: FileList) => {
    if (!identity) {
      toast.error('Please login to upload files');
      return;
    }

    const newFiles: UploadFile[] = Array.from(fileList).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending' as const,
      retryCount: 0,
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);

    for (const uploadFile of newFiles) {
      await uploadSingleFile(uploadFile);
    }
  }, [identity, files, addFileMetadata, addManifestEntry]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const totalPages = Math.ceil(files.length / pageSize);
  const paginatedFiles = files.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
        <p className="text-muted-foreground">
          Upload contract templates with SHA-256 deduplication and strict basename pairing
        </p>
      </div>

      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Upload className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports .json, .md files • Strict basename pairing • SHA-256 deduplication
          </p>
          <p className="text-xs text-muted-foreground mb-4 max-w-md">
            Files are paired by basename only (e.g., "contract.json" pairs with "contract.md"). Extensions and case are ignored during matching. Pairing uses fileType metadata exclusively.
          </p>
          <Button asChild className="rounded-full">
            <label>
              <input
                type="file"
                multiple
                accept=".json,.md"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              Select Files
            </label>
          </Button>
        </CardContent>
      </Card>

      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
            <CardDescription>
              {uploadFiles.filter(f => f.status === 'completed').length} of {uploadFiles.length} files uploaded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <File className="h-8 w-8 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.file.size / 1024).toFixed(2)} KB • Basename: {getBaseName(file.file.name)}
                  </p>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mt-2" />
                  )}
                  {file.error && (
                    <p className="text-sm text-destructive mt-1">{file.error}</p>
                  )}
                </div>
                <div className="shrink-0">
                  {file.status === 'completed' && (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  {file.status === 'uploading' && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
            <CardDescription>All your uploaded contract templates with pairing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {paginatedFiles.map((file) => {
                const basename = getBaseName(file.name);
                const hasPair = files.some(f => {
                  const fBasename = getBaseName(f.name);
                  return fBasename === basename && 
                         f.id !== file.id && 
                         ((file.fileType === FileType.json && f.fileType === FileType.markdown) ||
                          (file.fileType === FileType.markdown && f.fileType === FileType.json));
                });

                return (
                  <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <File className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Basename: {basename} • Hash: {maskHash(file.hash)} • Type: {file.fileType}
                      </p>
                      {(file.fileType === FileType.json || file.fileType === FileType.markdown) && (
                        <p className={`text-xs ${hasPair ? 'text-green-600' : 'text-amber-600'}`}>
                          {hasPair ? '✓ Paired' : '⚠ Unpaired'}
                        </p>
                      )}
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  title="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
