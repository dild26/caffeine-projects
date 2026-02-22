import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreateTask, useUpdateTask, useGetTaskEvents } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Task } from '../backend';
import { ExternalLink, Clock } from 'lucide-react';

interface TaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  createMode: boolean;
}

export default function TaskDialog({ task, isOpen, onClose, createMode }: TaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: events } = useGetTaskEvents(task.id);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  }, [task]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const taskData: Task = {
      id: createMode ? `task-${Date.now()}` : task.id,
      title: title.trim(),
      description: description.trim(),
      status,
      branch: task.branch,
      createdAt: task.createdAt,
      updatedAt: BigInt(Date.now() * 1000000),
      merkleProof: createMode ? `proof-${Date.now()}` : task.merkleProof,
    };

    try {
      if (createMode) {
        await createTask.mutateAsync(taskData);
        toast.success('Task created successfully!');
      } else {
        await updateTask.mutateAsync(taskData);
        toast.success('Task updated successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(createMode ? 'Failed to create task' : 'Failed to update task');
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{createMode ? 'Create New Task' : 'Task Details'}</DialogTitle>
          <DialogDescription>
            {createMode ? `Creating task for ${task.branch}` : `Task ID: ${task.id}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!createMode && (
            <>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Badge variant="outline">{task.branch}</Badge>
              </div>

              <div className="space-y-2">
                <Label>Merkle Proof</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-xs">
                    {task.merkleProof}
                  </code>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timestamps</Label>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created: {formatTimestamp(task.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Updated: {formatTimestamp(task.updatedAt)}
                  </div>
                </div>
              </div>

              {events && events.length > 0 && (
                <div className="space-y-2">
                  <Label>Event History</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {events.map((event, idx) => (
                      <div key={idx} className="rounded border border-border p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="capitalize">
                            {event.eventType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{event.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createTask.isPending || updateTask.isPending}
          >
            {createTask.isPending || updateTask.isPending
              ? 'Saving...'
              : createMode
              ? 'Create Task'
              : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
