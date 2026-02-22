import { useParams } from '@tanstack/react-router';
import { useGetPublicDatasetByCID } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Info, Download, AlertCircle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicDatasetPage() {
  const { cid } = useParams({ from: '/dataset/$cid' });
  const { data: dataset, isLoading, error } = useGetPublicDatasetByCID(cid);
  const [preview, setPreview] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    if (dataset) {
      loadPreview();
    }
  }, [dataset]);

  const loadPreview = async () => {
    if (!dataset) return;
    setIsLoadingPreview(true);
    try {
      const bytes = new Uint8Array(dataset.blob);
      const text = new TextDecoder().decode(bytes.slice(0, 1000));
      setPreview(text);
    } catch (error) {
      console.error('Failed to load preview:', error);
      setPreview('Failed to load preview');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const formatDate = (time: bigint) => {
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    if (!dataset) return;
    try {
      const buffer = new ArrayBuffer(dataset.blob.length);
      const view = new Uint8Array(buffer);
      view.set(dataset.blob);
      
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name}.${dataset.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download dataset:', error);
    }
  };

  const getOwnerDisplay = () => {
    if (!dataset) return '';
    const principal = dataset.owner.toString();
    if (principal.length > 12) {
      return `${principal.slice(0, 6)}...${principal.slice(-6)}`;
    }
    return principal;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-muted-foreground">Loading public dataset...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Dataset Not Found
            </CardTitle>
            <CardDescription>
              The public dataset with CID "{cid}" could not be found or is no longer available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This dataset may have been removed or made private by its owner.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{dataset.name}</h1>
            <p className="mt-2 text-muted-foreground">Public dataset preview</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="h-fit">
              {dataset.format.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="h-fit">
              Public
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">
            <FileText className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="info">
            <Info className="mr-2 h-4 w-4" />
            Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Content</CardTitle>
              <CardDescription>Read-only preview of the dataset content</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 rounded-md border bg-muted/50 p-4">
                {isLoadingPreview ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                      <p className="text-sm text-muted-foreground">Loading preview...</p>
                    </div>
                  </div>
                ) : (
                  <pre className="text-xs">{preview}</pre>
                )}
              </ScrollArea>
              <p className="mt-2 text-xs text-muted-foreground">Showing first 1000 characters</p>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Dataset
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Information</CardTitle>
              <CardDescription>Metadata and verification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm">{dataset.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Format</p>
                <p className="text-sm">{dataset.format.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Owner</p>
                <code className="text-xs font-mono">{getOwnerDisplay()}</code>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(dataset.createdAt)}</p>
              </div>
              {dataset.cid && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content ID (CID)</p>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-xs font-mono">{dataset.cid}</code>
                    <Badge variant="outline" className="text-xs">Merkle Hash</Badge>
                  </div>
                </div>
              )}
              {dataset.merkleHash && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Merkle Root Hash</p>
                  <code className="block rounded bg-muted px-2 py-1 text-xs font-mono break-all">{dataset.merkleHash}</code>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Schema</p>
                <ScrollArea className="h-32 rounded-md border bg-muted/50 p-3">
                  <pre className="text-xs">{dataset.schema}</pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                Verification & Traceability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>
                This dataset is cryptographically verified using a Merkle-root hash. The Content ID (CID) is derived from the first and last 4 characters of the hash, ensuring data integrity and ownership traceability.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
