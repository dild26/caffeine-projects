import { useState } from 'react';
import { Column, Task } from '../backend';
import TaskCard from './TaskCard';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface BoardColumnProps {
  column: Column;
  title: string;
  tasks: Task[];
  onCreateTask: () => void;
}

export default function BoardColumn({ column, title, tasks, onCreateTask }: BoardColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const getColumnColor = () => {
    switch (column) {
      case Column.toDo:
        return 'border-blue-500/20 bg-blue-500/5';
      case Column.inProgress:
        return 'border-amber-500/20 bg-amber-500/5';
      case Column.done:
        return 'border-green-500/20 bg-green-500/5';
    }
  };

  const getHeaderColor = () => {
    switch (column) {
      case Column.toDo:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case Column.inProgress:
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case Column.done:
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border-2 bg-card transition-colors',
        isDragOver ? getColumnColor() : 'border-border'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn('flex items-center justify-between rounded-t-lg px-4 py-3', getHeaderColor())}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/50 text-xs font-medium">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCreateTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-3 p-4 min-h-[400px]">
        {tasks.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id.toString()} task={task} targetColumn={column} />)
        )}
      </div>
    </div>
  );
}
