import { useState } from 'react';
import { useGetAllModuleConfigs, useIsCallerAdmin } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import ModuleConfigTab from '../components/ModuleConfigTab';
import BlueprintsTab from '../components/BlueprintsTab';
import FixturesTab from '../components/FixturesTab';
import OverviewTab from '../components/OverviewTab';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: modules, isLoading: modulesLoading } = useGetAllModuleConfigs();
  const [activeTab, setActiveTab] = useState('overview');

  if (isAdminLoading || modulesLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have admin permissions to access this dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage modules, blueprints, and fixtures for the Evolved-AI platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab modules={modules || []} />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Configuration</CardTitle>
              <CardDescription>
                Configure and manage system modules with real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModuleConfigTab modules={modules || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blueprints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blueprint Management</CardTitle>
              <CardDescription>
                Import and manage YAML/Markdown pipeline blueprints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlueprintsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixtures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fixture Management</CardTitle>
              <CardDescription>
                Import CSV fixtures and manage fixture data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FixturesTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
