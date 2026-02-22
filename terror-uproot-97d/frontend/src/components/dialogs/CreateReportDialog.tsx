import { useState } from 'react';
import { useCreateReport } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateReportDialog({ open, onOpenChange }: CreateReportDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { identity } = useInternetIdentity();
  
  const createReport = useCreateReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!identity) {
      toast.error('Authentication required');
      return;
    }

    try {
      await createReport.mutateAsync({
        id: `RPT-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        created: BigInt(Date.now() * 1000000),
        author: identity.getPrincipal(),
      });
      
      toast.success('Report created successfully');
      onOpenChange(false);
      
      // Reset form
      setTitle('');
      setContent('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create report');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Research Report</DialogTitle>
          <DialogDescription>
            Generate an analytical report for policy planning and research purposes
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Q4 2024 Security Trends Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Report Content *</Label>
            <Textarea
              id="content"
              placeholder="Provide detailed analysis, findings, and recommendations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createReport.isPending}>
              {createReport.isPending ? 'Creating...' : 'Create Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

