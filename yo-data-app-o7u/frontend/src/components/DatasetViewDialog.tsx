import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Dataset } from '../backend';
import { FileText, Info, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface DatasetViewDialogProps {
  dataset: Dataset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DatasetViewDialog({ dataset, open, onOpenChange }: DatasetViewDialogProps) {
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && dataset) {
      loadPreview();
    }
  }, [open, dataset]);

  const loadPreview = async () => {
    setIsLoading(true);
    try {
      const bytes = new Uint8Array(dataset.blob);
      const text = new TextDecoder().decode(bytes.slice(0, 1000));
      setPreview(text);
    } catch (error) {
      console.error('Failed to load preview:', error);
      setPreview('Failed to load preview');
    } finally {
      setIsLoading(false);
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

  const getPublicLink = () => {
    if (!dataset.cid) return null;
    return `${window.location.origin}/dataset/${dataset.cid}`;
  };

  const handleCopyLink = async () => {
    const link = getPublicLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Public link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenPublicView = () => {
    const link = getPublicLink();
    if (link) {
      window.open(link, '_blank');
    }
  };

  const publicLink = getPublicLink();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dataset.name}
            <Badge>{dataset.format.toUpperCase()}</Badge>
            {dataset.isPublic && <Badge variant="secondary">Public</Badge>}
          </DialogTitle>
          <DialogDescription>Dataset details and preview</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">
              <Info className="mr-2 h-4 w-4" />
              Information
            </TabsTrigger>
            <TabsTrigger value="preview">
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm">{dataset.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Format</p>
                <p className="text-sm">{dataset.format.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                <p className="text-sm">{dataset.isPublic ? 'Public' : 'Private'}</p>
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
              {dataset.isPublic && publicLink && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Public Link</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-1">
                      {copied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button variant="default" size="sm" onClick={handleOpenPublicView}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Public View
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this link to allow anyone to view this dataset without authentication
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <ScrollArea className="h-96 rounded-md border bg-muted/50 p-4">
              {isLoading ? (
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
