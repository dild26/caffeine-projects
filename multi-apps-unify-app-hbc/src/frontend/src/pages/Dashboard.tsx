import { useState } from 'react';
import { useIsCallerAdmin, useGetSyncStatus } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { ShieldAlert } from 'lucide-react';
import AdminControls from '../components/AdminControls';
import FileViewer from '../components/FileViewer';
import SyncStatusCard from '../components/SyncStatusCard';

export default function Dashboard() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: syncStatus, isLoading: syncStatusLoading } = useGetSyncStatus();
  const [activeTab, setActiveTab] = useState<'yaml' | 'markdown'>('yaml');

  if (isAdminLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-6 h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              This dashboard is restricted to administrators only. Please contact your system administrator for access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage specification files and synchronization between YAML and Markdown formats
        </p>
      </div>

      <div className="mb-6">
        <Alert className="border-primary/50 bg-primary/5">
          <AlertDescription>
            <strong>spec.yaml</strong> is the authoritative source of truth. Changes automatically propagate to{' '}
            <strong>spec.md</strong> in real-time.
          </AlertDescription>
        </Alert>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <SyncStatusCard syncStatus={syncStatus} isLoading={syncStatusLoading} />
        <AdminControls />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Specification Files</CardTitle>
          <CardDescription>View and edit your specification files</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'yaml' | 'markdown')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="yaml">spec.yaml (Source)</TabsTrigger>
              <TabsTrigger value="markdown">spec.md (Generated)</TabsTrigger>
            </TabsList>
            <TabsContent value="yaml" className="mt-4">
              <FileViewer filename="spec.yaml" editable={true} />
            </TabsContent>
            <TabsContent value="markdown" className="mt-4">
              <FileViewer filename="spec.md" editable={false} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
