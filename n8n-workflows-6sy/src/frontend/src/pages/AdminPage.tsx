import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkflowUploadDialog from '../components/WorkflowUploadDialog';
import AdminConfigPanel from '../components/AdminConfigPanel';
import SpecConversionPanel from '../components/SpecConversionPanel';
import DeduplicationPanel from '../components/DeduplicationPanel';
import NodeOptimizationPanel from '../components/NodeOptimizationPanel';
import { Shield, Upload, Settings, FileText, Copy, Package } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useGetAllPages, useGetAllSitemapEntries, useGetSitemapSnapshots, useGetWhitelistedApps, useGetAppRouteRequests } from '../hooks/useQueries';

function AdminPageContent() {
  const { data: allPages } = useGetAllPages();
  const { data: sitemapEntries } = useGetAllSitemapEntries();
  const { data: snapshots } = useGetSitemapSnapshots();
  const { data: whitelistedApps } = useGetWhitelistedApps();
  const { data: appRouteRequests } = useGetAppRouteRequests();

  const manualPages = sitemapEntries?.filter(entry => entry.routeType === 'manual') || [];
  const appControlledRoutes = sitemapEntries?.filter(entry => entry.routeType === 'appControlled') || [];
  const pendingRequests = appRouteRequests?.filter(req => req.status === 'pending') || [];

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-lg text-muted-foreground">
              Manage workflows, payments, and system configuration
            </p>
          </div>
        </div>

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="specs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Specs</span>
            </TabsTrigger>
            <TabsTrigger value="dedup" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Dedup</span>
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Optimize</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Workflows</CardTitle>
                <CardDescription>
                  Upload new n8n workflow templates to the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowUploadDialog />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <AdminConfigPanel />
          </TabsContent>

          <TabsContent value="specs" className="space-y-6">
            <SpecConversionPanel />
          </TabsContent>

          <TabsContent value="dedup" className="space-y-6">
            <DeduplicationPanel />
          </TabsContent>

          <TabsContent value="optimize" className="space-y-6">
            <NodeOptimizationPanel />
          </TabsContent>
        </Tabs>

        {/* Enhanced Sitemap Management Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Sitemap Management Overview</CardTitle>
            <CardDescription>
              Current status of manual pages, app-controlled routes, and system snapshots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{allPages?.length || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Manual Pages</p>
                <p className="text-2xl font-bold">{manualPages.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">App-Controlled Routes</p>
                <p className="text-2xl font-bold">{appControlledRoutes.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Snapshots</p>
                <p className="text-2xl font-bold">{snapshots?.length || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Whitelisted Apps</p>
                <p className="text-2xl font-bold">{whitelistedApps?.length || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
