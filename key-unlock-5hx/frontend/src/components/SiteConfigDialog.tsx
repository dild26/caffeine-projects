import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FolderKanban } from 'lucide-react';
import type { SiteConfig } from '../types';

interface SiteConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: SiteConfig;
  onSuccess: () => void;
}

export default function SiteConfigDialog({ open, onOpenChange, site }: SiteConfigDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{site ? 'Edit Site Configuration' : 'Create New Site'}</DialogTitle>
          <DialogDescription>
            {site ? 'Update the site configuration details' : 'Add a new site to the platform catalog'}
          </DialogDescription>
        </DialogHeader>

        <div className="text-center py-12">
          <FolderKanban className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Site creation/editing feature coming soon</p>
          <p className="text-sm text-muted-foreground">
            Currently displaying the 26 pre-configured default sites. Custom site creation will be available in a future update.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
