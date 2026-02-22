import { useState, useEffect } from 'react';
import { useCreateTask } from '../hooks/useQueries';
import { Column } from '../backend';
import { validateTask, getFieldError, ValidationError } from '../lib/validation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumn?: Column;
}

export default function CreateTaskDialog({ open, onOpenChange, defaultColumn }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<Column>(defaultColumn || Column.toDo);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const createTask = useCreateTask();

  useEffect(() => {
    if (defaultColumn) {
      setColumn(defaultColumn);
    }
  }, [defaultColumn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors([]);

    // Validate input
    const validation = validateTask({
      title: title.trim(),
      description: description.trim(),
      column,
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        column,
      });
      toast.success('Task created successfully');
      setTitle('');
      setDescription('');
      setColumn(defaultColumn || Column.toDo);
      setValidationErrors([]);
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create task';
      toast.error(errorMessage);
      console.error('Create task error:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle('');
      setDescription('');
      setColumn(defaultColumn || Column.toDo);
      setValidationErrors([]);
    }
    onOpenChange(newOpen);
  };

  const titleError = getFieldError(validationErrors, 'title');
  const descriptionError = getFieldError(validationErrors, 'description');
  const columnError = getFieldError(validationErrors, 'column');

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your board</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error.message}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title" className={titleError ? 'text-destructive' : ''}>
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title (3-200 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createTask.isPending}
              className={titleError ? 'border-destructive' : ''}
              autoFocus
            />
            {titleError && (
              <p className="text-sm text-destructive">{titleError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className={descriptionError ? 'text-destructive' : ''}>
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional, max 2000 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createTask.isPending}
              className={descriptionError ? 'border-destructive' : ''}
              rows={4}
            />
            {descriptionError && (
              <p className="text-sm text-destructive">{descriptionError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="column" className={columnError ? 'text-destructive' : ''}>
              Column *
            </Label>
            <Select value={column} onValueChange={(value) => setColumn(value as Column)}>
              <SelectTrigger id="column" className={columnError ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Column.toDo}>To Do</SelectItem>
                <SelectItem value={Column.inProgress}>In Progress</SelectItem>
                <SelectItem value={Column.done}>Done</SelectItem>
              </SelectContent>
            </Select>
            {columnError && (
              <p className="text-sm text-destructive">{columnError}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createTask.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
