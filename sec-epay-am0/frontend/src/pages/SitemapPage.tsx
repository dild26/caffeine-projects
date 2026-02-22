import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useGetSitemapState, useGetAllPages, useAddManualPage, useDelegateControlledRoute, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import { toast } from 'sonner';
import { Map, Plus, Shield, Lock, Globe, Layers } from 'lucide-react';

export default function SitemapPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: sitemapState, isLoading: sitemapLoading } = useGetSitemapState();
  const { data: allPages = [], isLoading: pagesLoading } = useGetAllPages();
  const addManualPage = useAddManualPage();
  const delegateRoute = useDelegateControlledRoute();

  const [newPageSlug, setNewPageSlug] = useState('');
  const [broadcastApp, setBroadcastApp] = useState('');
  const [remoteApp, setRemoteApp] = useState('');
  const [liveApp, setLiveApp] = useState('');

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageSlug.trim()) {
      toast.error('Please enter a page slug');
      return;
    }

    try {
      await addManualPage.mutateAsync(newPageSlug.toLowerCase().trim());
      toast.success(`Page "${newPageSlug}" added successfully`);
      setNewPageSlug('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
      console.error(error);
    }
  };

  const handleDelegateRoute = async (routeName: string, delegatedApp: string) => {
    if (!delegatedApp.trim()) {
      toast.error('Please enter an app name');
      return;
    }

    try {
      await delegateRoute.mutateAsync({ routeName, delegatedApp: delegatedApp.trim() });
      toast.success(`Route "${routeName}" delegated to "${delegatedApp}"`);
      
      if (routeName === 'broadcast') setBroadcastApp('');
      if (routeName === 'remote') setRemoteApp('');
      if (routeName === 'live') setLiveApp('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delegate route');
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    if (timestamp === 0n) return 'System';
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const autoPages = allPages.filter(p => p.pageType === 'auto');
  const manualPages = allPages.filter(p => p.pageType === 'manual');
  const controlledPages = allPages.filter(p => p.pageType === 'controlled');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Map className="mr-3 h-8 w-8 text-primary" />
          Sitemap Management
        </h1>
        <p className="text-muted-foreground">View and manage application routes and pages</p>
      </div>

      {/* Sitemap Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Sitemap Overview
          </CardTitle>
          <CardDescription>Current sitemap structure and version information</CardDescription>
        </CardHeader>
        <CardContent>
          {sitemapLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading sitemap...</div>
          ) : sitemapState ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Version</div>
                <div className="text-2xl font-bold">{Number(sitemapState.version)}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Pages</div>
                <div className="text-2xl font-bold">{allPages.length}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Last Modified</div>
                <div className="text-sm font-medium">{formatTimestamp(sitemapState.lastModified)}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No sitemap data available</div>
          )}
        </CardContent>
      </Card>

      {/* Admin Controls */}
      {isAdmin && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Add Manual Page
              </CardTitle>
              <CardDescription>Add a new custom page to the sitemap (admin only)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pageSlug">Page Slug</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="pageSlug"
                      type="text"
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(e.target.value)}
                      placeholder="e.g., angel-vc, dex, e-com"
                      className="flex-1"
                      pattern="[a-z0-9-]+"
                      title="Only lowercase letters, numbers, and hyphens allowed"
                    />
                    <Button type="submit" disabled={addManualPage.isPending || !newPageSlug.trim()}>
                      <Plus className="mr-2 h-4 w-4" />
                      {addManualPage.isPending ? 'Adding...' : 'Add Page'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be lowercase, unique, and contain only letters, numbers, and hyphens
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                Controlled Routes
              </CardTitle>
              <CardDescription>Delegate controlled routes to Secoinfi-Apps (admin only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sitemapState?.controlledRoutes.map((route) => (
                  <div key={route.routeName} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">/{route.routeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {route.delegatedApp ? `Delegated to: ${route.delegatedApp}` : 'Not delegated'}
                        </div>
                      </div>
                      <Badge variant={route.delegatedApp ? 'default' : 'secondary'}>
                        {route.delegatedApp ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Input
                        type="text"
                        value={
                          route.routeName === 'broadcast' ? broadcastApp :
                          route.routeName === 'remote' ? remoteApp :
                          route.routeName === 'live' ? liveApp : ''
                        }
                        onChange={(e) => {
                          if (route.routeName === 'broadcast') setBroadcastApp(e.target.value);
                          if (route.routeName === 'remote') setRemoteApp(e.target.value);
                          if (route.routeName === 'live') setLiveApp(e.target.value);
                        }}
                        placeholder="Enter Secoinfi-App name"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleDelegateRoute(
                          route.routeName,
                          route.routeName === 'broadcast' ? broadcastApp :
                          route.routeName === 'remote' ? remoteApp : liveApp
                        )}
                        disabled={delegateRoute.isPending}
                        size="sm"
                      >
                        Delegate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* All Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>Complete list of application pages by type</CardDescription>
        </CardHeader>
        <CardContent>
          {pagesLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading pages...</div>
          ) : (
            <div className="space-y-6">
              {/* Auto-generated Pages */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Auto-Generated Pages ({autoPages.length})
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Slug</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {autoPages.map((page) => (
                        <TableRow key={page.slug}>
                          <TableCell className="font-mono">/{page.slug}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Auto</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">System</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Manual Pages */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Manual Pages ({manualPages.length})
                </h3>
                {manualPages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No manual pages added yet
                    {isAdmin && <div className="text-sm mt-2">Use the form above to add custom pages</div>}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Slug</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {manualPages.map((page) => (
                          <TableRow key={page.slug}>
                            <TableCell className="font-mono">/{page.slug}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Manual</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {page.createdBy.toString().slice(0, 15)}...
                            </TableCell>
                            <TableCell className="text-xs">{formatTimestamp(page.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <Separator />

              {/* Controlled Routes */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Controlled Routes ({sitemapState?.controlledRoutes.length || 0})
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Delegated App</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sitemapState?.controlledRoutes.map((route) => (
                        <TableRow key={route.routeName}>
                          <TableCell className="font-mono">/{route.routeName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Controlled</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {route.delegatedApp || <span className="text-muted-foreground">Not delegated</span>}
                          </TableCell>
                          <TableCell>
                            <Badge variant={route.delegatedApp ? 'default' : 'secondary'}>
                              {route.delegatedApp ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!identity && (
        <Card className="mt-6 border-warning/50">
          <CardHeader>
            <CardTitle className="text-warning">Login Required</CardTitle>
            <CardDescription>Please login to view full sitemap details</CardDescription>
          </CardHeader>
        </Card>
      )}

      {identity && !isAdmin && !adminLoading && (
        <Card className="mt-6 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center text-muted-foreground">
              <Lock className="mr-2 h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              Only administrators can add manual pages and delegate controlled routes
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
