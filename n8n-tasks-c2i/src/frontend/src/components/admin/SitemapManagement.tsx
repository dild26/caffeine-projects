import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetSitemap,
  useGetSitemapAuditLogs,
  useGetSecoinfiApps,
  useAddSecoinfiApp,
  useAssignRoutesToApp,
} from '../../hooks/useQueries';
import { MapPin, Plus, Loader2, Shield, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

export default function SitemapManagement() {
  const { data: sitemap, isLoading: sitemapLoading } = useGetSitemap();
  const { data: auditLogs, isLoading: auditLoading } = useGetSitemapAuditLogs();
  const { data: apps, isLoading: appsLoading } = useGetSecoinfiApps();
  const addAppMutation = useAddSecoinfiApp();
  const assignRoutesMutation = useAssignRoutesToApp();

  const [newAppSlug, setNewAppSlug] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');

  const [selectedAppSlug, setSelectedAppSlug] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);

  const allowedRoutes = ['/broadcast', '/remote', '/live'];

  const handleAddApp = async () => {
    if (!newAppSlug.trim() || !newAppName.trim()) {
      toast.error('Please provide both slug and name');
      return;
    }

    try {
      await addAppMutation.mutateAsync({
        slug: newAppSlug,
        name: newAppName,
        description: newAppDescription,
        approvedRoutes: [],
        createdAt: BigInt(Date.now()),
        createdBy: null as any, // Will be set by backend
      });
      toast.success('App added to whitelist');
      setNewAppSlug('');
      setNewAppName('');
      setNewAppDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add app');
    }
  };

  const handleAssignRoutes = async () => {
    if (!selectedAppSlug) {
      toast.error('Please select an app');
      return;
    }

    try {
      await assignRoutesMutation.mutateAsync({
        appSlug: selectedAppSlug,
        routes: selectedRoutes,
      });
      toast.success('Routes assigned successfully');
      setSelectedRoutes([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign routes');
    }
  };

  const toggleRoute = (route: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Sitemap Management
          </CardTitle>
          <CardDescription>
            Manage admin-defined pages, app whitelist, and route delegation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apps">Apps Whitelist</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {!sitemapLoading && sitemap && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Auto Routes</h3>
                    <div className="flex flex-wrap gap-2">
                      {sitemap.autoRoutes.map((route, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      Admin-Defined Pages ({sitemap.adminPages.length})
                    </h3>
                    <div className="space-y-2">
                      {sitemap.adminPages.map((page, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg flex items-start justify-between"
                        >
                          <div>
                            <p className="font-medium">/{page.slug}</p>
                            <p className="text-sm text-muted-foreground">{page.title}</p>
                            {page.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {page.description}
                              </p>
                            )}
                          </div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Priority: {page.priority.toString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">App-Controlled Routes</h3>
                    <div className="flex flex-wrap gap-2">
                      {sitemap.appRoutes.map((route, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm flex items-center gap-1"
                        >
                          <Shield className="h-3 w-3" />
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="apps" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add App to Whitelist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="appSlug">App Slug *</Label>
                    <Input
                      id="appSlug"
                      placeholder="my-app"
                      value={newAppSlug}
                      onChange={(e) => setNewAppSlug(e.target.value.toLowerCase())}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appName">App Name *</Label>
                    <Input
                      id="appName"
                      placeholder="My Application"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appDescription">Description</Label>
                    <Textarea
                      id="appDescription"
                      placeholder="Brief description of the app"
                      value={newAppDescription}
                      onChange={(e) => setNewAppDescription(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleAddApp} disabled={addAppMutation.isPending}>
                    {addAppMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add App
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assign Routes to App</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!appsLoading && apps && apps.length > 0 ? (
                    <>
                      <div>
                        <Label htmlFor="selectApp">Select App</Label>
                        <select
                          id="selectApp"
                          value={selectedAppSlug}
                          onChange={(e) => setSelectedAppSlug(e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                        >
                          <option value="">-- Select an app --</option>
                          {apps.map((app, index) => (
                            <option key={index} value={app.slug}>
                              {app.name} ({app.slug})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Allowed Routes</Label>
                        <div className="space-y-2 mt-2">
                          {allowedRoutes.map((route, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                id={`route-${index}`}
                                checked={selectedRoutes.includes(route)}
                                onCheckedChange={() => toggleRoute(route)}
                              />
                              <label
                                htmlFor={`route-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {route}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleAssignRoutes}
                        disabled={assignRoutesMutation.isPending || !selectedAppSlug}
                      >
                        {assignRoutesMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Assign Routes
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No apps in whitelist yet</p>
                  )}
                </CardContent>
              </Card>

              {!appsLoading && apps && apps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Whitelisted Apps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {apps.map((app, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{app.name}</p>
                              <p className="text-sm text-muted-foreground">{app.slug}</p>
                            </div>
                          </div>
                          {app.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {app.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {app.approvedRoutes.length > 0 ? (
                              app.approvedRoutes.map((route, rIndex) => (
                                <span
                                  key={rIndex}
                                  className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                                >
                                  {route}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No routes assigned
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              {!auditLoading && auditLogs && auditLogs.length > 0 ? (
                <div className="space-y-3">
                  {auditLogs.map((log, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-muted-foreground">
                              Page: /{log.pageSlug}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="text-muted-foreground">
                            Admin: {log.admin.toString().slice(0, 20)}...
                          </p>
                          {log.merkleHash && (
                            <p className="text-muted-foreground font-mono">
                              Hash: {log.merkleHash.slice(0, 32)}...
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No audit logs yet</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
