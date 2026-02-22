import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DomainPreviewDialogProps {
  domain: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DomainPreviewDialog({ domain, open, onOpenChange }: DomainPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] h-[98vh] p-0 card-3d">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-gradient">Web Preview: {domain}</DialogTitle>
              <DialogDescription className="mt-1">
                Sandboxed preview with strict security. Content is isolated and cannot navigate away from this dialog.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="hover:bg-destructive/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This is a secure, sandboxed preview. Some features may not work due to security restrictions 
              that prevent navigation escape, click-jacking, and breaking out of the preview mode.
            </AlertDescription>
          </Alert>
          <iframe
            src={`https://${domain}`}
            className="w-full h-[calc(98vh-220px)] border-2 border-primary/20 rounded-lg bg-background"
            sandbox="allow-scripts allow-same-origin"
            title={`Secure preview of ${domain}`}
            style={{ colorScheme: 'normal' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
