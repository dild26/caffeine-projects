import { useState } from 'react';
import { useAddDataSource } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface AddDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddDataSourceDialog({ open, onOpenChange }: AddDataSourceDialogProps) {
  const [name, setName] = useState('');
  const [sourceType, setSourceType] = useState('');
  
  const addDataSource = useAddDataSource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !sourceType.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addDataSource.mutateAsync({
        id: `DS-${Date.now()}`,
        name: name.trim(),
        sourceType: sourceType.trim(),
        verified: false,
        lastUpdated: BigInt(Date.now() * 1000000),
      });
      
      toast.success('Data source added successfully');
      onOpenChange(false);
      
      // Reset form
      setName('');
      setSourceType('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add data source');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
          <DialogDescription>
            Register a new public safety data source for verification
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Source Name *</Label>
            <Input
              id="name"
              placeholder="e.g., National Emergency Database"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceType">Source Type *</Label>
            <Input
              id="sourceType"
              placeholder="e.g., Government Agency, NGO, Research Institution"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addDataSource.isPending}>
              {addDataSource.isPending ? 'Adding...' : 'Add Source'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

