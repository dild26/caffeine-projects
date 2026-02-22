import { useState, useEffect } from 'react';
import { useCreateDataset } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadDatasetDialog({ open, onOpenChange }: UploadDatasetDialogProps) {
  const { identity } = useInternetIdentity();
  const createDataset = useCreateDataset();
  const [name, setName] = useState('');
  const [format, setFormat] = useState('csv');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!name) {
        setName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !name) {
      toast.error('Please provide a file and name');
      return;
    }

    if (!identity) {
      toast.error('Please log in to upload datasets');
      return;
    }

    try {
      setUploadProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      setUploadProgress(50);

      const schema = JSON.stringify({
        columns: [],
        rowCount: 0,
        fileSize: file.size,
      });

      await createDataset.mutateAsync({
        name,
        format,
        schema,
        blob: uint8Array,
        isPublic,
      });

      setUploadProgress(100);
      toast.success('Dataset uploaded successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload dataset');
    } finally {
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setName('');
    setFormat('csv');
    setFile(null);
    setIsPublic(false);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Dataset</DialogTitle>
          <DialogDescription>Upload a new dataset to your collection</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept=".csv,.json,.xlsx" />
            {file && <p className="text-xs text-muted-foreground">Selected: {file.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Dataset Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Dataset" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="public">Make Public</Label>
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || !name || createDataset.isPending}>
            {createDataset.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
