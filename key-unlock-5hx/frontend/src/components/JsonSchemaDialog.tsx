import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileJson } from 'lucide-react';

interface JsonSchemaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function JsonSchemaDialog({ open, onOpenChange }: JsonSchemaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create JSON Schema Template</DialogTitle>
          <DialogDescription>Add a new machine-readable JSON schema template for site creation</DialogDescription>
        </DialogHeader>

        <div className="text-center py-12">
          <FileJson className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Template creation feature coming soon</p>
          <p className="text-sm text-muted-foreground">
            This feature will allow you to create reusable JSON schema templates for consistent site creation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
