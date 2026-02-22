import { useState } from 'react';
import { useGetUserTasks } from '../hooks/useQueries';
import { Column } from '../backend';
import BoardColumn from './BoardColumn';
import CreateTaskDialog from './CreateTaskDialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

export default function Board() {
  const { data: tasks = [], isLoading } = useGetUserTasks();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | undefined>(undefined);

  const columns: { id: Column; title: string }[] = [
    { id: Column.toDo, title: 'To Do' },
    { id: Column.inProgress, title: 'In Progress' },
    { id: Column.done, title: 'Done' },
  ];

  const getTasksByColumn = (column: Column) => {
    return tasks.filter((task) => task.column === column);
  };

  const handleCreateTask = (column?: Column) => {
    setSelectedColumn(column);
    setCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Board</h2>
          <p className="text-sm text-muted-foreground">
            Organize your tasks across different stages
          </p>
        </div>
        <Button onClick={() => handleCreateTask()} className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column.id}
            title={column.title}
            tasks={getTasksByColumn(column.id)}
            onCreateTask={() => handleCreateTask(column.id)}
          />
        ))}
      </div>

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultColumn={selectedColumn}
      />
    </div>
  );
}
