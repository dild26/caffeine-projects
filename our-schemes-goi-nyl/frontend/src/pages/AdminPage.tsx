import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <ShieldIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        <Alert className="mb-6 border-primary/30 bg-primary/5">
          <ShieldIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Restricted Access:</strong> This page is only accessible to authenticated users.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheme Management</CardTitle>
              <CardDescription>Upload and manage government schemes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Use this section to upload new government schemes to the database. Only administrators
                can add or modify scheme information.
              </p>
              <Button variant="outline" disabled>
                Upload New Scheme (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                View and manage user accounts, assign roles, and control access permissions.
              </p>
              <Button variant="outline" disabled>
                Manage Users (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View application statistics and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Monitor search trends, popular schemes, and user engagement metrics.
              </p>
              <Button variant="outline" disabled>
                View Analytics (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Alert className="border-warning/30 bg-warning/5">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Admin features are currently under development. 
              Full functionality will be available in future updates.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
