import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormSubmission } from '../backend';
import { convertToClickableLink } from '../lib/utils';

interface SubmissionDetailDialogProps {
  submission: FormSubmission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubmissionDetailDialog({ submission, open, onOpenChange }: SubmissionDetailDialogProps) {
  const renderValue = (value: typeof submission.values[0]['value']) => {
    if (value.__kind__ === 'text') {
      const link = convertToClickableLink(value.text);
      if (link) {
        return (
          <a href={link.href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {value.text}
          </a>
        );
      }
      return value.text;
    }
    if (value.__kind__ === 'number') return value.number.toString();
    if (value.__kind__ === 'boolean') return value.boolean ? 'Yes' : 'No';
    if (value.__kind__ === 'array') return JSON.stringify(value.array);
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Submission Details</DialogTitle>
          <DialogDescription>View complete submission information</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Metadata</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold">Submission ID:</span>
                  <span className="font-mono">{submission.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold">Schema ID:</span>
                  <span>{submission.schemaId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold">Timestamp:</span>
                  <span>{new Date(Number(submission.timestamp) / 1000000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold">User:</span>
                  <span className="font-mono text-xs">{submission.user.toString()}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-bold">Form Values</h3>
              <div className="space-y-3">
                {submission.values.map((entry) => (
                  <div key={entry.fieldId} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-muted-foreground">{entry.fieldId}:</span>
                      <span className="text-sm text-right flex-1">{renderValue(entry.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-bold">Cryptographic Verification</h3>
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-bold text-muted-foreground mb-1">Merkle Root:</p>
                  <p className="text-xs font-mono break-all">
                    {Array.from(submission.merkleRoot)
                      .map((b) => b.toString(16).padStart(2, '0'))
                      .join('')}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-bold text-muted-foreground mb-1">Manifest Hash:</p>
                  <p className="text-xs font-mono break-all">
                    {Array.from(submission.manifestHash)
                      .map((b) => b.toString(16).padStart(2, '0'))
                      .join('')}
                  </p>
                </div>
                <Badge variant="secondary">{submission.merkleProofs.length} Merkle Proofs Available</Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
