import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Users, FileText, Settings, Activity, AlertCircle } from 'lucide-react';
import { useIsCallerAdmin, useGetAllNavigationItemsSorted } from '../hooks/useQueries';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import PageManagementPanel from '../components/PageManagementPanel';

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: pages, isLoading: pagesLoading } = useGetAllNavigationItemsSorted();

  if (adminLoading || pagesLoading) {
    return (
      <div className="container py-12 space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You must be an administrator to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Shield className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage platform settings, users, and content
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Navigation items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active themes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Recent actions</p>
            </CardContent>
          </Card>
        </div>

        {pages && <PageManagementPanel pages={pages} />}

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Platform health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Backend Connection</span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme System</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Navigation System</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold mb-1">Manage Users</h4>
                <p className="text-sm text-muted-foreground">View and manage user accounts</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold mb-1">Content Moderation</h4>
                <p className="text-sm text-muted-foreground">Review and approve content</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold mb-1">System Settings</h4>
                <p className="text-sm text-muted-foreground">Configure platform settings</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold mb-1">View Logs</h4>
                <p className="text-sm text-muted-foreground">Access system logs and activity</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
