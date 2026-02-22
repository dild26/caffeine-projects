import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';

interface MlPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function MlPromptDialog({ open, onOpenChange }: MlPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create ML Prompt Template</DialogTitle>
          <DialogDescription>Add a new ML prompt template for AI-assisted development</DialogDescription>
        </DialogHeader>

        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Template creation feature coming soon</p>
          <p className="text-sm text-muted-foreground">
            This feature will allow you to create ML prompt templates for AI-assisted development
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
