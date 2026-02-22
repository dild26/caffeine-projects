import { useGetAllTasks, useCreateTask, useUpdateTask } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TaskDialog from './TaskDialog';
import type { Task } from '../backend';

export default function KanbanBoard() {
  const { data: tasks, isLoading } = useGetAllTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const branches = ['Berlin-HQ', 'Tokyo-Branch'];
  const statuses = ['pending', 'in-progress', 'completed'];

  const getTasksByBranchAndStatus = (branch: string, status: string) => {
    return tasks?.filter(t => t.branch === branch && t.status === status) || [];
  };

  const handleCreateTask = (branch: string) => {
    setCreateMode(true);
    setSelectedTask({
      id: '',
      title: '',
      description: '',
      status: 'pending',
      branch,
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
      merkleProof: '',
    });
    setIsDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setCreateMode(false);
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {branches.map(branch => (
          <div key={branch} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid gap-4 md:grid-cols-3">
              {statuses.map(status => (
                <Skeleton key={status} className="h-64" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {branches.map(branch => (
          <div key={branch} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{branch}</h3>
              <Button size="sm" onClick={() => handleCreateTask(branch)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {statuses.map(status => (
                <Card key={status} className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                      {status.replace('-', ' ')}
                      <Badge variant="secondary" className="ml-auto">
                        {getTasksByBranchAndStatus(branch, status).length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getTasksByBranchAndStatus(branch, status).map(task => (
                      <Card
                        key={task.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleTaskClick(task)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{task.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    {getTasksByBranchAndStatus(branch, status).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No tasks
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedTask(null);
            setCreateMode(false);
          }}
          createMode={createMode}
        />
      )}
    </>
  );
}
