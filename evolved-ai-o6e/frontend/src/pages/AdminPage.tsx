import { useState } from 'react';
import { useGetAllModuleConfigs, useGetAllBlueprints, useGetAllFixtures, useIsCallerAdmin } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Activity, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdminQuickEditTab from '../components/AdminQuickEditTab';

export default function AdminPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: modules = [], isLoading: modulesLoading } = useGetAllModuleConfigs();
  const { data: blueprints = [], isLoading: blueprintsLoading } = useGetAllBlueprints();
  const { data: fixtures = [], isLoading: fixturesLoading } = useGetAllFixtures();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isAdminLoading || modulesLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
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

  const enabledModules = modules.filter((m) => m.enabled);
  const moduleHealth = modules.length > 0 ? (enabledModules.length / modules.length) * 100 : 0;
  const blueprintHealth = blueprints.length > 0 ? 100 : 0;
  const fixtureHealth = fixtures.length > 0 ? 100 : 0;

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">System Overview Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Read-only dashboards with inline quick-edit modal popups for admin-level controls
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="quick-edit">Quick Edit</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Module Status</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moduleHealth.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {enabledModules.length} of {modules.length} modules enabled
                </p>
                <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${moduleHealth}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blueprint Pipelines</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blueprintHealth.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {blueprints.length} active pipelines
                </p>
                <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all"
                    style={{ width: `${blueprintHealth}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fixture Sync</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fixtureHealth.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {fixtures.length} fixtures synced
                </p>
                <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${fixtureHealth}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Health Monitor</CardTitle>
              <CardDescription>Real-time status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Module System</h4>
                      <p className="text-sm text-muted-foreground">All modules operational</p>
                    </div>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {blueprints.length > 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <h4 className="font-semibold">Blueprint Pipelines</h4>
                      <p className="text-sm text-muted-foreground">
                        {blueprints.length > 0 ? 'Pipelines active' : 'No pipelines configured'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={blueprints.length > 0 ? 'default' : 'secondary'}>
                    {blueprints.length > 0 ? 'Active' : 'Idle'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {fixtures.length > 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <h4 className="font-semibold">Fixture Data</h4>
                      <p className="text-sm text-muted-foreground">
                        {fixtures.length > 0 ? 'Data synchronized' : 'No fixtures imported'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={fixtures.length > 0 ? 'default' : 'secondary'}>
                    {fixtures.length > 0 ? 'Synced' : 'Empty'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-edit" className="space-y-6">
          <AdminQuickEditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
