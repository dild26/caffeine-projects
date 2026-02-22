import { useState } from 'react';
import { useCreateProject } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FolderPlus } from 'lucide-react';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createProject = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      await createProject.mutateAsync({ name: name.trim(), description: description.trim() });
      toast.success('Project created successfully!');
      setName('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      console.error('Create project error:', error);
      toast.error('Failed to create project');
    }
  };

  const handleClose = () => {
    if (!createProject.isPending) {
      setName('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new project to organize your datasets</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="My Analytics Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createProject.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description (Optional)</Label>
            <Textarea
              id="projectDescription"
              placeholder="Describe the purpose of this project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createProject.isPending}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={createProject.isPending} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending} className="flex-1">
              {createProject.isPending ? (
                <>Creating...</>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

