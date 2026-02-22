import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  useGetManualPages, 
  useAddManualPage, 
  useRemoveManualPage,
  useGetControlledRoutes,
  useAddControlledRoute,
  useRemoveControlledRoute,
  useGetSystemPages,
  useGetAdminControlledRoutes
} from '../hooks/useQueries';
import { Plus, Trash2, Shield, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ManualPage, ControlledRoute } from '../backend';

export default function SitemapAdminPanel() {
  const { data: manualPages = [], refetch: refetchManualPages } = useGetManualPages();
  const { data: controlledRoutes = [], refetch: refetchControlledRoutes } = useGetControlledRoutes();
  const { data: systemPages = [] } = useGetSystemPages();
  const { data: adminControlledRoutes = [] } = useGetAdminControlledRoutes();
  
  const addManualPage = useAddManualPage();
  const removeManualPage = useRemoveManualPage();
  const addControlledRoute = useAddControlledRoute();
  const removeControlledRoute = useRemoveControlledRoute();

  const [newPagePath, setNewPagePath] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [newRoutePath, setNewRoutePath] = useState('/broadcast');
  const [newRouteTitle, setNewRouteTitle] = useState('');
  const [newRouteDelegatedApp, setNewRouteDelegatedApp] = useState('Secoinfi-App');

  const handleAddManualPage = async () => {
    if (!newPagePath.trim() || !newPageTitle.trim()) {
      toast.error('Path and title are required');
      return;
    }

    const pathLower = newPagePath.toLowerCase().trim();
    if (!pathLower.startsWith('/')) {
      toast.error('Path must start with /');
      return;
    }

    const page: ManualPage = {
      path: pathLower,
      title: newPageTitle.trim(),
      description: newPageDescription.trim() || `${newPageTitle.trim()} page`,
      isSystem: false,
      isControlled: false,
      lastUpdated: BigInt(Date.now() * 1000000),
      adminSignature: undefined,
    };

    try {
      await addManualPage.mutateAsync(page);
      toast.success('Page added successfully');
      setNewPagePath('');
      setNewPageTitle('');
      setNewPageDescription('');
      refetchManualPages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
    }
  };

  const handleRemoveManualPage = async (path: string) => {
    try {
      await removeManualPage.mutateAsync(path);
      toast.success('Page removed successfully');
      refetchManualPages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove page');
    }
  };

  const handleAddControlledRoute = async () => {
    if (!newRouteTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    const route: ControlledRoute = {
      path: newRoutePath,
      title: newRouteTitle.trim(),
      delegatedApp: newRouteDelegatedApp.trim(),
      adminControl: true,
      lastUpdated: BigInt(Date.now() * 1000000),
      adminSignature: undefined,
    };

    try {
      await addControlledRoute.mutateAsync(route);
      toast.success('Controlled route added successfully');
      setNewRouteTitle('');
      refetchControlledRoutes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add controlled route');
    }
  };

  const handleRemoveControlledRoute = async (path: string) => {
    try {
      await removeControlledRoute.mutateAsync(path);
      toast.success('Controlled route removed successfully');
      refetchControlledRoutes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove controlled route');
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Admin-only page management. Manual pages extend the auto-generated sitemap. System pages cannot be removed.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Pages</TabsTrigger>
          <TabsTrigger value="controlled">Controlled Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Manual Page
              </CardTitle>
              <CardDescription>
                Add a new page to the sitemap. Path must be lowercase and unique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page-path">Path *</Label>
                <Input
                  id="page-path"
                  placeholder="/my-page"
                  value={newPagePath}
                  onChange={(e) => setNewPagePath(e.target.value.toLowerCase())}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-title">Title *</Label>
                <Input
                  id="page-title"
                  placeholder="My Page"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-description">Description</Label>
                <Textarea
                  id="page-description"
                  placeholder="Description of the page"
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleAddManualPage} 
                disabled={addManualPage.isPending}
                className="w-full"
              >
                {addManualPage.isPending ? 'Adding...' : 'Add Page'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Pages ({manualPages.length})</CardTitle>
              <CardDescription>
                Pages added manually by administrators. System pages are read-only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {manualPages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No manual pages added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {manualPages.map((page) => (
                    <div
                      key={page.path}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{page.title}</h4>
                          {page.isSystem && (
                            <Badge variant="default" className="text-xs flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              System
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{page.description}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{page.path}</code>
                      </div>
                      {!page.isSystem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveManualPage(page.path)}
                          disabled={removeManualPage.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {systemPages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Pages ({systemPages.length})
                </CardTitle>
                <CardDescription>
                  Protected system pages that cannot be removed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemPages.map((page) => (
                    <div key={page.path} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <code className="text-xs">{page.path}</code>
                      <span className="text-sm text-muted-foreground">- {page.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="controlled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Add Controlled Route
              </CardTitle>
              <CardDescription>
                Add a controlled route delegated to external apps. Only /broadcast, /remote, and /live are allowed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="route-path">Path *</Label>
                <select
                  id="route-path"
                  value={newRoutePath}
                  onChange={(e) => setNewRoutePath(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="/broadcast">/broadcast</option>
                  <option value="/remote">/remote</option>
                  <option value="/live">/live</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-title">Title *</Label>
                <Input
                  id="route-title"
                  placeholder="Broadcast Page"
                  value={newRouteTitle}
                  onChange={(e) => setNewRouteTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-app">Delegated App</Label>
                <Input
                  id="route-app"
                  placeholder="Secoinfi-App"
                  value={newRouteDelegatedApp}
                  onChange={(e) => setNewRouteDelegatedApp(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddControlledRoute} 
                disabled={addControlledRoute.isPending}
                className="w-full"
              >
                {addControlledRoute.isPending ? 'Adding...' : 'Add Controlled Route'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controlled Routes ({controlledRoutes.length})</CardTitle>
              <CardDescription>
                Routes delegated to external applications with admin control
              </CardDescription>
            </CardHeader>
            <CardContent>
              {controlledRoutes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No controlled routes configured yet
                </div>
              ) : (
                <div className="space-y-3">
                  {controlledRoutes.map((route) => (
                    <div
                      key={route.path}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{route.title}</h4>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            Controlled
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Delegated to: <strong>{route.delegatedApp}</strong>
                        </p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{route.path}</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveControlledRoute(route.path)}
                        disabled={removeControlledRoute.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {adminControlledRoutes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Admin-Controlled Routes ({adminControlledRoutes.length})
                </CardTitle>
                <CardDescription>
                  Routes with admin-only control enabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {adminControlledRoutes.map((route) => (
                    <div key={route.path} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <code className="text-xs">{route.path}</code>
                      <span className="text-sm text-muted-foreground">→ {route.delegatedApp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
