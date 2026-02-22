import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LinkPreviewModalProps {
  url: string | null;
  onClose: () => void;
}

export default function LinkPreviewModal({ url, onClose }: LinkPreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useArchive, setUseArchive] = useState(false);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setError(false);
      setUseArchive(false);
    }
  }, [url]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const tryArchive = () => {
    setUseArchive(true);
    setError(false);
    setLoading(true);
  };

  const displayUrl = useArchive && url ? `https://web.archive.org/web/${url}` : url;

  return (
    <Dialog open={!!url} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate mr-4">{url}</span>
            <Button variant="ghost" size="sm" asChild>
              <a href={url || '#'} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center space-y-2">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center space-y-4 max-w-md px-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div className="space-y-2">
                  <p className="font-semibold">Preview Unavailable</p>
                  <p className="text-sm text-muted-foreground">
                    This site cannot be displayed in a preview. Try viewing it directly or using the Internet Archive.
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={tryArchive} disabled={useArchive}>
                    Try Archive
                  </Button>
                  <Button asChild>
                    <a href={url || '#'} target="_blank" rel="noopener noreferrer">
                      Open Directly
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {displayUrl && (
            <iframe
              src={displayUrl}
              className="w-full h-full border-0 rounded-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="Link Preview"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
