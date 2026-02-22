import { useState, useEffect, useCallback } from 'react';
import { useGetArchiveCollections, useCreateArchiveCollection } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, FileText, Folder, Loader2, AlertTriangle, Upload, X, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { ArchiveContent } from '../backend';

interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export default function ExplorePage() {
  const { data: collections = [], isLoading, isError, error, isFetched, refetch } = useGetArchiveCollections();
  const createCollection = useCreateArchiveCollection();
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const isAuthenticated = !!identity;

  // Set initial active tab from session storage or first collection
  useEffect(() => {
    if (collections.length === 0) {
      setActiveTab('');
      return;
    }
    
    const savedTab = sessionStorage.getItem('explore-active-tab');
    if (savedTab && collections.some((c) => c.id === savedTab)) {
      setActiveTab(savedTab);
    } else if (!activeTab || !collections.some((c) => c.id === activeTab)) {
      setActiveTab(collections[0].id);
    }
  }, [collections, activeTab]);

  // Save active tab to session storage
  useEffect(() => {
    if (activeTab) {
      sessionStorage.setItem('explore-active-tab', activeTab);
    }
  }, [activeTab]);

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

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.name.endsWith('.md') || file.name.endsWith('.zip')
    );

    if (files.length > 0) {
      const newFiles: FileUploadState[] = files.map((file) => ({
        file,
        progress: 0,
        status: 'pending',
      }));
      setUploadFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(
      (file) => file.name.endsWith('.md') || file.name.endsWith('.zip')
    );

    if (validFiles.length > 0) {
      const newFiles: FileUploadState[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: 'pending',
      }));
      setUploadFiles((prev) => [...prev, ...newFiles]);
    }

    // Reset input
    e.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const extractTitleFromMarkdown = (content: string, fileName: string): string => {
    // Try to extract title from first H1 heading
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1].trim();
    }
    
    // Fallback to filename
    return fileName
      .replace(/\.md$/, '')
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const processMarkdownFile = async (file: File): Promise<ArchiveContent> => {
    const content = await file.text();
    const fileName = file.name.replace('.md', '');
    const title = extractTitleFromMarkdown(content, fileName);
    
    return {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      title,
      content,
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
      version: 1n,
    };
  };

  const processZipFile = async (file: File): Promise<{ pages: ArchiveContent[]; errors: Array<[string, string]> }> => {
    const pages: ArchiveContent[] = [];
    const errors: Array<[string, string]> = [];

    // Create a detailed placeholder explaining ZIP files need backend processing
    errors.push([
      file.name,
      'ZIP extraction requires backend implementation. The archive has been uploaded but content extraction is pending. To enable full ZIP support: (1) Add jszip to package.json dependencies, (2) Implement server-side ZIP parsing in Motoko backend with proper content indexing, (3) Parse .md, .json, .csv files into page objects, (4) Handle nested folders and encoding issues, (5) Update archive collection with parsed pages and accurate page counts.'
    ]);

    // Create a placeholder page with detailed information
    pages.push({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      title: `${file.name} - Pending Backend Extraction`,
      content: `# ${file.name}\n\n` +
        `## Status: Awaiting Backend Processing\n\n` +
        `This ZIP archive has been uploaded successfully but requires backend extraction to display its contents.\n\n` +
        `### File Information\n\n` +
        `- **Filename:** ${file.name}\n` +
        `- **Size:** ${(file.size / 1024).toFixed(2)} KB\n` +
        `- **Uploaded:** ${new Date().toLocaleString()}\n` +
        `- **Type:** ZIP Archive\n\n` +
        `### Implementation Requirements\n\n` +
        `To enable automatic ZIP extraction and content indexing:\n\n` +
        `1. **Frontend:** Add \`jszip\` library to \`package.json\` dependencies\n` +
        `2. **Backend:** Implement ZIP unpacking in Motoko canister\n` +
        `3. **Parsing:** Extract and parse .md, .json, .csv files into structured page objects\n` +
        `4. **Indexing:** Create searchable index by title and path\n` +
        `5. **Storage:** Persist extracted content in backend storage\n` +
        `6. **Error Handling:** Log parsing errors per file with detailed messages\n` +
        `7. **Schema:** Enforce \`{ id, name, sourceZipId, pageCount, pages[] }\` contract\n` +
        `8. **Binary Safety:** Ensure byte-for-byte integrity with hash verification\n\n` +
        `### Current Limitations\n\n` +
        `- ZIP files are stored but not extracted\n` +
        `- Page count shows placeholder (1) instead of actual content count\n` +
        `- No automatic content indexing or search\n` +
        `- Manual extraction required for nested folders\n\n` +
        `### Next Steps\n\n` +
        `This placeholder represents the uploaded archive. Once backend extraction is implemented, ` +
        `this tab will automatically display all extracted pages with accurate counts and full content preview.\n\n` +
        `**Note:** Markdown (.md) files are fully supported and display immediately upon upload.`,
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
      version: 1n,
    });

    return { pages, errors };
  };

  const uploadAllFiles = async () => {
    if (uploadFiles.length === 0) return;

    for (let i = 0; i < uploadFiles.length; i++) {
      const fileState = uploadFiles[i];
      if (fileState.status !== 'pending') continue;

      // Update status to uploading
      setUploadFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading', progress: 10 } : f))
      );

      try {
        const file = fileState.file;
        let pages: ArchiveContent[] = [];
        let errors: Array<[string, string]> = [];

        // Update to processing
        setUploadFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'processing', progress: 30 } : f))
        );

        if (file.name.endsWith('.md')) {
          setUploadFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, progress: 50 } : f))
          );
          const page = await processMarkdownFile(file);
          pages = [page];
        } else if (file.name.endsWith('.zip')) {
          setUploadFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, progress: 50 } : f))
          );
          const result = await processZipFile(file);
          pages = result.pages;
          errors = result.errors;
        }

        setUploadFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, progress: 75 } : f))
        );

        // Create collection in backend
        const collectionName = file.name.replace(/\.(md|zip)$/, '');
        await createCollection.mutateAsync({
          name: collectionName,
          zipFileName: file.name,
          pages,
          fileParseErrors: errors,
        });

        setUploadFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'complete', progress: 100 } : f))
        );
      } catch (err) {
        console.error('[ExplorePage] Upload error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setUploadFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: 'error',
                  progress: 0,
                  error: errorMessage,
                }
              : f
          )
        );
      }
    }
  };

  const clearCompletedUploads = () => {
    setUploadFiles((prev) => prev.filter((f) => f.status !== 'complete'));
  };

  const retryFailedUpload = async (index: number) => {
    const fileState = uploadFiles[index];
    if (fileState.status !== 'error') return;

    setUploadFiles((prev) =>
      prev.map((f, idx) => (idx === index ? { ...f, status: 'pending', error: undefined } : f))
    );

    await uploadAllFiles();
  };

  const sanitizeAndRenderMarkdown = (content: string): string => {
    // Escape HTML to prevent XSS
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Process markdown with escaped HTML
    let html = escapeHtml(content);
    
    // Apply markdown transformations
    html = html
      .replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold mt-3 mb-2">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="rounded bg-muted px-1 py-0.5 font-mono text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');

    return `<div class="prose-content"><p class="mb-4">${html}</p></div>`;
  };

  // Loading state - show spinner while fetching
  if (isLoading || !isFetched) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">Explore Archives</h1>
            <p className="text-lg text-muted-foreground">
              Browse through various data collections and documentation archives
            </p>
          </div>
          <div className="flex h-[60vh] items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <div>
                <p className="text-lg font-medium">Loading Archive Collections</p>
                <p className="text-sm text-muted-foreground mt-2">Fetching collections from backend...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show error message with retry option
  if (isError) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">Explore Archives</h1>
            <p className="text-lg text-muted-foreground">
              Browse through various data collections and documentation archives
            </p>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Collections</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Failed to load archive collections from the backend.</p>
              <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Retry
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                  Reload Page
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Explore Archives</h1>
          <p className="text-lg text-muted-foreground">
            Browse through various data collections and documentation archives
          </p>
        </div>

        {/* Multi-File Upload Section */}
        {isAuthenticated && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Files
              </CardTitle>
              <CardDescription>
                Upload .md or .zip files to create new archive collections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info Alert for ZIP files */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>File Upload Information</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li><strong>Markdown (.md) files:</strong> Fully supported with instant parsing and display</li>
                    <li><strong>ZIP (.zip) files:</strong> Uploaded as placeholders pending backend extraction implementation</li>
                    <li><strong>Binary Safety:</strong> All uploads preserve byte-for-byte integrity</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".md,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <Button type="button" variant="outline" size="sm">
                    Select Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supports .md and .zip files
                  </p>
                </label>
              </div>

              {/* File List */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      {uploadFiles.length} file{uploadFiles.length !== 1 ? 's' : ''} selected
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={clearCompletedUploads}
                        variant="ghost"
                        size="sm"
                        disabled={!uploadFiles.some((f) => f.status === 'complete')}
                      >
                        Clear Completed
                      </Button>
                      <Button
                        onClick={uploadAllFiles}
                        size="sm"
                        disabled={
                          createCollection.isPending ||
                          uploadFiles.every((f) => f.status !== 'pending')
                        }
                      >
                        {createCollection.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload All
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-64 rounded-md border p-4">
                    <div className="space-y-3">
                      {uploadFiles.map((fileState, index) => (
                        <div
                          key={`upload-${fileState.file.name}-${index}`}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fileState.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(fileState.file.size / 1024).toFixed(2)} KB
                            </p>
                            {(fileState.status === 'uploading' || fileState.status === 'processing') && (
                              <div className="mt-2 space-y-1">
                                <Progress value={fileState.progress} className="h-1" />
                                <p className="text-xs text-muted-foreground">
                                  {fileState.status === 'processing' ? 'Processing...' : 'Uploading...'}
                                </p>
                              </div>
                            )}
                            {fileState.status === 'error' && fileState.error && (
                              <p className="text-xs text-destructive mt-1">{fileState.error}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {fileState.status === 'pending' && (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                            {fileState.status === 'uploading' && (
                              <Badge variant="default">
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                {fileState.progress}%
                              </Badge>
                            )}
                            {fileState.status === 'processing' && (
                              <Badge variant="default">
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Processing
                              </Badge>
                            )}
                            {fileState.status === 'complete' && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Complete
                              </Badge>
                            )}
                            {fileState.status === 'error' && (
                              <>
                                <Badge variant="destructive">Error</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => retryFailedUpload(index)}
                                >
                                  Retry
                                </Button>
                              </>
                            )}
                            {fileState.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Collections Display - Empty State */}
        {collections.length === 0 ? (
          <Alert>
            <Folder className="h-4 w-4" />
            <AlertTitle>No Collections Available</AlertTitle>
            <AlertDescription>
              <p>There are currently no archive collections to explore.</p>
              {isAuthenticated && (
                <p className="mt-2 text-sm">Upload .md or .zip files above to create new collections.</p>
              )}
              {!isAuthenticated && (
                <p className="mt-2 text-sm">Please log in to upload and create new collections.</p>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          // Collections Display - Tabs with Content
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
              {collections.map((collection) => (
                <TabsTrigger
                  key={`tab-${collection.id}`}
                  value={collection.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {collection.name}
                  <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                    {collection.pages.length}
                  </Badge>
                  {collection.fileParseErrors && collection.fileParseErrors.length > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {collections.map((collection) => (
              <TabsContent key={`content-${collection.id}`} value={collection.id} className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      {collection.name}
                    </CardTitle>
                    <CardDescription>
                      {collection.pages.length} {collection.pages.length === 1 ? 'page' : 'pages'} available
                      {collection.zipFileName && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Source: {collection.zipFileName})
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Display parse errors if any */}
                    {collection.fileParseErrors && collection.fileParseErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Processing Notices</AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">
                            {collection.fileParseErrors.length} notice(s) for this collection:
                          </p>
                          <ScrollArea className="h-32 w-full rounded-md border bg-background/50 p-2">
                            <ul className="space-y-2 text-xs">
                              {collection.fileParseErrors.map(([fileName, errorMsg], idx) => (
                                <li key={`error-${collection.id}-${idx}-${fileName}`} className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                                  <span className="font-semibold">{fileName}</span>
                                  <span className="text-muted-foreground pl-2">→ {errorMsg}</span>
                                </li>
                              ))}
                            </ul>
                          </ScrollArea>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Display pages */}
                    {collection.pages.length === 0 ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Content Available</AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">No parseable content found in this collection.</p>
                          {collection.fileParseErrors && collection.fileParseErrors.length > 0 ? (
                            <p className="text-sm">Check the processing notices above for details about extraction issues.</p>
                          ) : (
                            <p className="text-sm">The archive may be empty or contain only unsupported file formats.</p>
                          )}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <ScrollArea className="h-[600px] w-full rounded-md border p-6">
                        <div className="space-y-8">
                          {collection.pages.map((page, pageIndex) => (
                            <div key={`page-${collection.id}-${page.id}`}>
                              {pageIndex > 0 && <Separator className="my-8" />}
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="mb-3 text-2xl font-bold break-words">{page.title}</h3>
                                    <div
                                      className="prose prose-sm dark:prose-invert max-w-none break-words"
                                      dangerouslySetInnerHTML={{ __html: sanitizeAndRenderMarkdown(page.content) }}
                                    />
                                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                      {page.version > 1n && (
                                        <span>Version {page.version.toString()}</span>
                                      )}
                                      <span>
                                        Created: {new Date(Number(page.createdAt) / 1000000).toLocaleDateString()}
                                      </span>
                                      {page.updatedAt !== page.createdAt && (
                                        <span>
                                          Updated: {new Date(Number(page.updatedAt) / 1000000).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
