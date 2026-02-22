import { useState } from 'react';
import { useRevertToVersion } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpecVersion, SpecFormat } from '../backend';
import { Clock, RotateCcw, FileCode2 } from 'lucide-react';
import { toast } from 'sonner';

interface SpecHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: SpecVersion[];
  onRevert: () => void;
}

export default function SpecHistoryDialog({ open, onOpenChange, history, onRevert }: SpecHistoryDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState<SpecVersion | null>(null);
  const revertToVersion = useRevertToVersion();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const getFormatBadge = (fmt: SpecFormat) => {
    const colors = {
      [SpecFormat.yaml]: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      [SpecFormat.ml]: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      [SpecFormat.markdown]: 'bg-green-500/10 text-green-700 dark:text-green-400',
    };
    return colors[fmt];
  };

  const handleRevert = async (version: SpecVersion) => {
    try {
      await revertToVersion.mutateAsync(version.timestamp);
      toast.success('Successfully reverted to previous version');
      onRevert();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to revert to version');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Specification History
          </DialogTitle>
          <DialogDescription>
            View and restore previous versions of your specification
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 h-[60vh]">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Version History</h3>
            <ScrollArea className="h-full border rounded-lg">
              <div className="p-4 space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No history available
                  </div>
                ) : (
                  history.map((version) => (
                    <button
                      key={version.timestamp.toString()}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedVersion?.timestamp === version.timestamp
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getFormatBadge(version.format)}>
                          {version.format.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(version.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {version.content.substring(0, 100)}...
                      </p>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Preview</h3>
              {selectedVersion && (
                <Button
                  size="sm"
                  onClick={() => handleRevert(selectedVersion)}
                  disabled={revertToVersion.isPending}
                  className="rounded-full"
                >
                  {revertToVersion.isPending ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Reverting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-3 w-3" />
                      Revert to This
                    </>
                  )}
                </Button>
              )}
            </div>
            <ScrollArea className="h-full border rounded-lg">
              {selectedVersion ? (
                <div className="p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <FileCode2 className="h-4 w-4" />
                    <span>{formatDate(selectedVersion.timestamp)}</span>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{selectedVersion.content}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a version to preview
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
