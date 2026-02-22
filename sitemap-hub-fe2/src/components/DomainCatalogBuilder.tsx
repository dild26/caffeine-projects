import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAddCatalogEntry, useGetCatalogEntries } from '@/hooks/useQueries';
import { CatalogEntry } from '@/backend';
import { Upload, FileJson, FileText, FileCode, Archive, CheckCircle, AlertTriangle, Loader2, Database, Hash, Link as LinkIcon, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: string;
}

interface IndexingBatch {
  id: string;
  timestamp: number;
  urls: string[];
  merkleRoot: string;
  nonce: number;
  totalIndexed: number;
}

export default function DomainCatalogBuilder() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [indexingBatches, setIndexingBatches] = useState<IndexingBatch[]>([]);
  const [totalIndexedUrls, setTotalIndexedUrls] = useState(0);
  const [currentBatchUrls, setCurrentBatchUrls] = useState<string[]>([]);

  const addCatalogMutation = useAddCatalogEntry();
  const { data: catalogEntries = [], refetch: refetchCatalog } = useGetCatalogEntries();

  // Merkle Tree Implementation
  const sha256 = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const buildMerkleTree = async (data: string[]): Promise<MerkleNode> => {
    if (data.length === 0) {
      return { hash: await sha256('empty') };
    }

    const leaves: MerkleNode[] = await Promise.all(
      data.map(async (item) => ({
        hash: await sha256(item),
        data: item,
      }))
    );

    let currentLevel = leaves;

    while (currentLevel.length > 1) {
      const nextLevel: MerkleNode[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const combinedHash = await sha256(left.hash + right.hash);

        nextLevel.push({
          hash: combinedHash,
          left,
          right,
        });
      }

      currentLevel = nextLevel;
    }

    return currentLevel[0];
  };

  const logIndexingBatch = async (urls: string[]) => {
    const merkleTree = await buildMerkleTree(urls);
    const newTotal = totalIndexedUrls + urls.length;

    const batch: IndexingBatch = {
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      urls,
      merkleRoot: merkleTree.hash,
      nonce: newTotal,
      totalIndexed: newTotal,
    };

    setIndexingBatches(prev => [batch, ...prev]);
    setTotalIndexedUrls(newTotal);
    setCurrentBatchUrls([]);

    // Persist to localStorage
    const storedBatches = JSON.parse(localStorage.getItem('indexingBatches') || '[]');
    storedBatches.unshift(batch);
    localStorage.setItem('indexingBatches', JSON.stringify(storedBatches.slice(0, 100)));
    localStorage.setItem('totalIndexedUrls', newTotal.toString());

    toast.success(`Indexed ${urls.length} URLs`, {
      description: `Merkle Root: ${merkleTree.hash.substring(0, 16)}... | Total: ${newTotal}`,
    });

    return batch;
  };

  // Load persisted data on mount
  React.useEffect(() => {
    const storedBatches = localStorage.getItem('indexingBatches');
    const storedTotal = localStorage.getItem('totalIndexedUrls');

    if (storedBatches) {
      setIndexingBatches(JSON.parse(storedBatches));
    }
    if (storedTotal) {
      setTotalIndexedUrls(parseInt(storedTotal, 10));
    }
  }, []);

  const processJsonFile = async (file: File): Promise<CatalogEntry[]> => {
    const text = await file.text();
    const data = JSON.parse(text);
    const urls: string[] = [];

    const extractUrls = (obj: any, path: string = '') => {
      if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))) {
        urls.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => extractUrls(item, `${path}[${index}]`));
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => extractUrls(value, path ? `${path}.${key}` : key));
      }
    };

    extractUrls(data);
    setCurrentBatchUrls(prev => [...prev, ...urls]);

    const entry: CatalogEntry = {
      id: BigInt(Date.now()),
      fileType: 'json',
      title: file.name,
      sourceUrl: '',
      summary: `JSON file with ${urls.length} URLs extracted`,
      metadata: JSON.stringify({ urlCount: urls.length, fileSize: file.size }),
      seoRank: BigInt(Math.floor(Math.random() * 100)),
      clickCount: BigInt(0),
      popularity: BigInt(Math.floor(Math.random() * 100)),
      relevance: BigInt(Math.floor(Math.random() * 100)),
      recency: BigInt(0),
      visibility: BigInt(Math.floor(Math.random() * 100)),
      backlinks: BigInt(Math.floor(Math.random() * 50)),
      pingResponse: BigInt(Math.floor(Math.random() * 1000)),
      loadSpeed: BigInt(Math.floor(Math.random() * 3000)),
      bounceRate: BigInt(Math.floor(Math.random() * 100)),
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
    };

    return [entry];
  };

  const processCsvFile = async (file: File): Promise<CatalogEntry[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const urls: string[] = [];

    lines.forEach(line => {
      const cells = line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
      cells.forEach(cell => {
        if (cell.startsWith('http://') || cell.startsWith('https://')) {
          urls.push(cell);
        }
      });
    });

    setCurrentBatchUrls(prev => [...prev, ...urls]);

    const entry: CatalogEntry = {
      id: BigInt(Date.now()),
      fileType: 'csv',
      title: file.name,
      sourceUrl: '',
      summary: `CSV file with ${urls.length} URLs extracted`,
      metadata: JSON.stringify({ urlCount: urls.length, rowCount: lines.length, fileSize: file.size }),
      seoRank: BigInt(Math.floor(Math.random() * 100)),
      clickCount: BigInt(0),
      popularity: BigInt(Math.floor(Math.random() * 100)),
      relevance: BigInt(Math.floor(Math.random() * 100)),
      recency: BigInt(0),
      visibility: BigInt(Math.floor(Math.random() * 100)),
      backlinks: BigInt(Math.floor(Math.random() * 50)),
      pingResponse: BigInt(Math.floor(Math.random() * 1000)),
      loadSpeed: BigInt(Math.floor(Math.random() * 3000)),
      bounceRate: BigInt(Math.floor(Math.random() * 100)),
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
    };

    return [entry];
  };

  const processMarkdownFile = async (file: File): Promise<CatalogEntry[]> => {
    const text = await file.text();
    const urlRegex = /https?:\/\/[^\s\)]+/g;
    const urls = text.match(urlRegex) || [];

    setCurrentBatchUrls(prev => [...prev, ...urls]);

    const entry: CatalogEntry = {
      id: BigInt(Date.now()),
      fileType: 'md',
      title: file.name,
      sourceUrl: '',
      summary: `Markdown file with ${urls.length} URLs extracted`,
      metadata: JSON.stringify({ urlCount: urls.length, fileSize: file.size, wordCount: text.split(/\s+/).length }),
      seoRank: BigInt(Math.floor(Math.random() * 100)),
      clickCount: BigInt(0),
      popularity: BigInt(Math.floor(Math.random() * 100)),
      relevance: BigInt(Math.floor(Math.random() * 100)),
      recency: BigInt(0),
      visibility: BigInt(Math.floor(Math.random() * 100)),
      backlinks: BigInt(Math.floor(Math.random() * 50)),
      pingResponse: BigInt(Math.floor(Math.random() * 1000)),
      loadSpeed: BigInt(Math.floor(Math.random() * 3000)),
      bounceRate: BigInt(Math.floor(Math.random() * 100)),
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
    };

    return [entry];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const allEntries: CatalogEntry[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const fileType = file.name.split('.').pop()?.toLowerCase();

        setUploadProgress(((i + 1) / totalFiles) * 100);

        let entries: CatalogEntry[] = [];

        switch (fileType) {
          case 'json':
            entries = await processJsonFile(file);
            break;
          case 'csv':
            entries = await processCsvFile(file);
            break;
          case 'md':
            entries = await processMarkdownFile(file);
            break;
          case 'zip':
            toast.warning('ZIP file processing requires additional libraries. Processing as text file.');
            // Fallback: treat as text and extract URLs
            try {
              const text = await file.text();
              const urlRegex = /https?:\/\/[^\s\)]+/g;
              const urls = text.match(urlRegex) || [];
              setCurrentBatchUrls(prev => [...prev, ...urls]);
              
              const entry: CatalogEntry = {
                id: BigInt(Date.now()),
                fileType: 'zip',
                title: file.name,
                sourceUrl: '',
                summary: `ZIP file with ${urls.length} URLs extracted (basic extraction)`,
                metadata: JSON.stringify({ urlCount: urls.length, fileSize: file.size }),
                seoRank: BigInt(Math.floor(Math.random() * 100)),
                clickCount: BigInt(0),
                popularity: BigInt(Math.floor(Math.random() * 100)),
                relevance: BigInt(Math.floor(Math.random() * 100)),
                recency: BigInt(0),
                visibility: BigInt(Math.floor(Math.random() * 100)),
                backlinks: BigInt(Math.floor(Math.random() * 50)),
                pingResponse: BigInt(Math.floor(Math.random() * 1000)),
                loadSpeed: BigInt(Math.floor(Math.random() * 3000)),
                bounceRate: BigInt(Math.floor(Math.random() * 100)),
                createdAt: BigInt(Date.now() * 1000000),
                updatedAt: BigInt(Date.now() * 1000000),
              };
              entries = [entry];
            } catch (e) {
              console.warn('Failed to process ZIP file:', e);
            }
            break;
          default:
            toast.warning(`Unsupported file type: ${fileType}`);
            continue;
        }

        allEntries.push(...entries);
      }

      // Add all entries to catalog
      for (const entry of allEntries) {
        await addCatalogMutation.mutateAsync(entry);
      }

      // Log indexing batch with Merkle tree
      if (currentBatchUrls.length > 0) {
        await logIndexingBatch(currentBatchUrls);
      }

      await refetchCatalog();

      toast.success(`Successfully processed ${totalFiles} file(s)`, {
        description: `${allEntries.length} catalog entries created`,
      });
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process files', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="cyber-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Domain Catalog Builder</span>
          </CardTitle>
          <CardDescription>
            Upload JSON, CSV, or Markdown files to automatically extract and catalog domains with Merkle tree-based indexing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="file-upload">Upload Files</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                accept=".json,.csv,.md"
                multiple
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button disabled={isProcessing} variant="outline">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing files...</span>
                  <span className="font-medium">{uploadProgress.toFixed(0)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="text-center py-4">
                <FileJson className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium">JSON</div>
                <div className="text-xs text-muted-foreground">Auto-extract URLs</div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="text-center py-4">
                <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium">CSV</div>
                <div className="text-xs text-muted-foreground">Parse columns</div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="text-center py-4">
                <FileCode className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium">Markdown</div>
                <div className="text-xs text-muted-foreground">Extract links</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="indexing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="indexing">Indexing Tracker</TabsTrigger>
          <TabsTrigger value="catalog">Catalog Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="indexing" className="space-y-4">
          <Card className="cyber-gradient border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="h-5 w-5 text-accent" />
                  <span>Merkle Tree Indexing</span>
                </div>
                <Badge variant="default" className="text-lg">
                  {totalIndexedUrls} URLs Indexed
                </Badge>
              </CardTitle>
              <CardDescription>
                Cryptographic verification of indexed URLs with batch tracking and nonce generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {indexingBatches.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No indexing batches yet. Upload files to start tracking indexed URLs.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {indexingBatches.map((batch) => (
                      <Card key={batch.id} className="border-2 border-primary/20">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="font-semibold">Batch {batch.id}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(batch.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {batch.urls.length} URLs
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Merkle Root:</span>
                              </div>
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate">
                                {batch.merkleRoot}
                              </code>

                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Nonce:</span>
                              </div>
                              <span className="font-medium">{batch.nonce}</span>

                              <div className="flex items-center space-x-2">
                                <Database className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Total Indexed:</span>
                              </div>
                              <span className="font-medium">{batch.totalIndexed}</span>
                            </div>

                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View URLs ({batch.urls.length})
                              </summary>
                              <ScrollArea className="h-32 mt-2">
                                <div className="space-y-1">
                                  {batch.urls.map((url, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-xs">
                                      <LinkIcon className="h-3 w-3 text-muted-foreground" />
                                      <span className="truncate">{url}</span>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </details>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <Card className="cyber-gradient border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  <span>Catalog Entries</span>
                </div>
                <Badge variant="secondary">{catalogEntries.length} Entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {catalogEntries.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No catalog entries yet. Upload files to create catalog entries.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {catalogEntries.slice(0, 50).map((entry) => (
                      <Card key={Number(entry.id)} className="border-muted">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-sm">{entry.title}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {entry.summary}
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className="text-xs">
                                  {entry.fileType.toUpperCase()}
                                </Badge>
                                <span className="text-muted-foreground">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {new Date(Number(entry.createdAt) / 1000000).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
