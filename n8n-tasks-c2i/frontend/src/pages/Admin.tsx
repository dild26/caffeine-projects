import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAdminDashboard } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Upload, AlertTriangle, CheckCircle, FileText, FileCode, Database, Settings, Package, MapPin } from 'lucide-react';
import WorkflowUpload from '../components/admin/WorkflowUpload';
import ErrorLogsPanel from '../components/admin/ErrorLogsPanel';
import FixtureManagement from '../components/admin/FixtureManagement';
import TestingModeControl from '../components/admin/TestingModeControl';
import LeaderboardPromotion from '../components/admin/LeaderboardPromotion';
import SpecificationManagement from '../components/admin/SpecificationManagement';
import SystemLogs from '../components/admin/SystemLogs';
import SpecDeduplication from '../components/admin/SpecDeduplication';
import SitemapManagement from '../components/admin/SitemapManagement';

export default function Admin() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: dashboard, isLoading: dashboardLoading } = useGetAdminDashboard();

  if (!identity) {
    return (
      <div className="container py-12 text-center">
        <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please login to access the admin panel</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-12 text-center">
        <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to access this page</p>
        <Button onClick={() => navigate({ to: '/dashboard' })}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage workflows, specifications, optimization, sitemap, and system settings
        </p>
      </div>

      {/* Dashboard Overview */}
      {!dashboardLoading && dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Features</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.newFeatures.length}</div>
              <p className="text-xs text-muted-foreground">Workflows uploaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Logs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.errorLogs.length}</div>
              <p className="text-xs text-muted-foreground">Parsing errors logged</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fixtures</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.validationStatus.length}</div>
              <p className="text-xs text-muted-foreground">Features validated</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="specs">
            <FileCode className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Specs</span>
          </TabsTrigger>
          <TabsTrigger value="dedup">
            <Database className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dedup</span>
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Errors</span>
          </TabsTrigger>
          <TabsTrigger value="fixtures">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Fixtures</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Board</span>
          </TabsTrigger>
          <TabsTrigger value="sitemap">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Sitemap</span>
          </TabsTrigger>
          <TabsTrigger value="system">
            <Package className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <WorkflowUpload />
        </TabsContent>

        <TabsContent value="specs">
          <SpecificationManagement />
        </TabsContent>

        <TabsContent value="dedup">
          <SpecDeduplication />
        </TabsContent>

        <TabsContent value="errors">
          <ErrorLogsPanel />
        </TabsContent>

        <TabsContent value="fixtures">
          <FixtureManagement />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardPromotion />
        </TabsContent>

        <TabsContent value="sitemap">
          <SitemapManagement />
        </TabsContent>

        <TabsContent value="system">
          <SystemLogs />
        </TabsContent>

        <TabsContent value="settings">
          <TestingModeControl />
        </TabsContent>
      </Tabs>
    </div>
  );
}
