import { useGetAllTasks, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress').length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
  const totalTasks = tasks?.length || 0;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          {isAuthenticated && userProfile ? `Welcome back, ${userProfile.name}!` : 'Op Hotels Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {isAuthenticated
            ? "Manage tasks across Berlin-HQ and Tokyo-Branch"
            : 'A comprehensive task management and data synchronization platform for OP Hotels branches.'}
        </p>
      </div>

      {tasksLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">Across all branches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%'} completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Active tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Task Management Board</CardTitle>
          <CardDescription>
            {isAuthenticated
              ? 'Manage tasks across Berlin-HQ and Tokyo-Branch'
              : 'View tasks across Berlin-HQ and Tokyo-Branch. Login to create and manage tasks.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KanbanBoard />
        </CardContent>
      </Card>
    </div>
  );
}
