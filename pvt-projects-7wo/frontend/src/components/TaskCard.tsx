import { useState } from 'react';
import { Task, Column } from '../backend';
import { useUpdateTaskColumn, useDeleteTask } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface TaskCardProps {
  task: Task;
  targetColumn: Column;
}

export default function TaskCard({ task, targetColumn }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const updateColumn = useUpdateTaskColumn();
  const deleteTask = useDeleteTask();

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id.toString());
    e.dataTransfer.setData('sourceColumn', task.column);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    setIsDragging(false);
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (taskId && sourceColumn !== targetColumn) {
      try {
        await updateColumn.mutateAsync({
          taskId: BigInt(taskId),
          newColumn: targetColumn,
        });
        toast.success('Task moved successfully');
      } catch (error) {
        toast.error('Failed to move task');
        console.error('Move task error:', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id);
      toast.success('Task deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', error);
    }
  };

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`cursor-move transition-all hover:shadow-md ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <CardTitle className="text-base leading-tight">{task.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        {task.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
          </CardContent>
        )}
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
