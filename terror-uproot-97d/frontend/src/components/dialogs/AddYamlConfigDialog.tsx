import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAddYamlConfig, useGetYamlConfigs } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { YamlConfig } from '../../backend';

interface AddYamlConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddYamlConfigDialog({ open, onOpenChange }: AddYamlConfigDialogProps) {
  const [content, setContent] = useState('');
  const addConfig = useAddYamlConfig();
  const { data: existingConfigs } = useGetYamlConfigs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please enter YAML configuration content');
      return;
    }

    // Calculate next version number
    const maxVersion = existingConfigs?.reduce((max, config) => {
      const version = Number(config.version);
      return version > max ? version : max;
    }, 0) || 0;

    const newConfig: YamlConfig = {
      content: content.trim(),
      version: BigInt(maxVersion + 1),
      timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    };

    try {
      await addConfig.mutateAsync(newConfig);
      toast.success('YAML configuration added successfully');
      onOpenChange(false);
      setContent('');
    } catch (error: any) {
      console.error('Error adding YAML config:', error);
      toast.error(error.message || 'Failed to add YAML configuration');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add YAML Configuration</DialogTitle>
          <DialogDescription>
            Upload a new YAML specification to configure the platform. The configuration will be parsed and synchronized automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">YAML Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter YAML configuration here...&#10;&#10;Example:&#10;modules:&#10;  - name: crisis-management&#10;    enabled: true&#10;compliance:&#10;  gdpr: true&#10;  hipaa: false"
              className="min-h-[400px] font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Paste your YAML specification content. The system will automatically validate and integrate the configuration.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addConfig.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addConfig.isPending}>
              {addConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Configuration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
