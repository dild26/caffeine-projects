import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useDeleteYamlConfig } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Copy, Trash2, Clock, FileCode, CheckCircle } from 'lucide-react';
import type { YamlConfig } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface YamlConfigDetailsDialogProps {
  config: YamlConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

export default function YamlConfigDetailsDialog({
  config,
  open,
  onOpenChange,
  isAdmin,
}: YamlConfigDetailsDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteConfig = useDeleteYamlConfig();

  const timestamp = new Date(Number(config.timestamp) / 1000000);
  const lines = config.content.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(config.content);
    toast.success('Configuration copied to clipboard');
  };

  const handleDelete = async () => {
    try {
      await deleteConfig.mutateAsync(config.content);
      toast.success('Configuration deleted successfully');
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting config:', error);
      toast.error(error.message || 'Failed to delete configuration');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCode className="h-6 w-6 text-primary" />
                <div>
                  <DialogTitle>YAML Configuration - Version {config.version.toString()}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" />
                    {timestamp.toLocaleString()}
                  </DialogDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {lines.length} lines
              </Badge>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[500px] w-full rounded-md border">
              <div className="p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                  {config.content}
                </pre>
              </div>
            </ScrollArea>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Configuration Status</p>
                <p className="text-muted-foreground text-xs">
                  This configuration is stored and available for synchronization across the platform.
                  Changes will be reflected in dashboard components, analytics, and data sources.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-between">
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteConfig.isPending}
                >
                  {deleteConfig.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="default" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this YAML configuration (Version {config.version.toString()})?
              This action cannot be undone and may affect platform synchronization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
