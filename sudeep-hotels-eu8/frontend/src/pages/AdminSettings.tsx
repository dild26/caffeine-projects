import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetIntegrityLogs, useGetSyncOperations, useIsCallerAdmin, useCloneSitemapPages, useGetAllClonedPages, useGetAllThemeConfigs, useGetAllMenuItems, useGetAllVerificationResults, useGetAllManualPages, useGetAllControlledRoutes } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, RefreshCw, Download, CheckCircle2, XCircle, Clock, Globe, Loader2, Palette, Sparkles, AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManualPageManager from '../components/ManualPageManager';
import ControlledRoutesManager from '../components/ControlledRoutesManager';

export default function AdminSettings() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: integrityLogs, isLoading: logsLoading } = useGetIntegrityLogs();
  const { data: syncOperations, isLoading: syncLoading } = useGetSyncOperations();
  const { data: clonedPages, isLoading: pagesLoading, isFetching: pagesFetching } = useGetAllClonedPages();
  const { data: themeConfigs, isLoading: themesLoading } = useGetAllThemeConfigs();
  const { data: menuItems, isLoading: menuLoading } = useGetAllMenuItems();
  const { data: verificationResults, isLoading: verificationLoading } = useGetAllVerificationResults();
  const { data: manualPages, isLoading: manualPagesLoading } = useGetAllManualPages();
  const { data: controlledRoutes, isLoading: routesLoading } = useGetAllControlledRoutes();
  const cloneSitemapMutation = useCloneSitemapPages();
  const navigate = useNavigate();

  // Group pages by source
  const pagesBySource = useMemo(() => {
    if (!clonedPages) return { map: 0, etutorial: 0, other: 0 };
    return clonedPages.reduce((acc, page) => {
      if (page.url.includes('map-56b')) acc.map++;
      else if (page.url.includes('etutorial-lgc')) acc.etutorial++;
      else acc.other++;
      return acc;
    }, { map: 0, etutorial: 0, other: 0 });
  }, [clonedPages]);

  // Group menu items by category
  const menuItemsByCategory = useMemo(() => {
    if (!menuItems) return { standard: 0, cloned: 0, external: 0, total: 0, visible: 0 };
    return menuItems.reduce((acc, item) => {
      acc.total++;
      if (item.isVisible) acc.visible++;
      if (item.category === 'standard') acc.standard++;
      else if (item.category === 'cloned') acc.cloned++;
      else if (item.category === 'external') acc.external++;
      return acc;
    }, { standard: 0, cloned: 0, external: 0, total: 0, visible: 0 });
  }, [menuItems]);

  // Get latest verification results
  const latestVerifications = useMemo(() => {
    if (!verificationResults) return [];
    return verificationResults.slice(0, 10).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  }, [verificationResults]);

  if (adminLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. This page is only accessible to administrators.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate({ to: '/' })}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  const handleExportLogs = () => {
    const data = JSON.stringify({ 
      integrityLogs, 
      syncOperations, 
      clonedPages, 
      themeConfigs, 
      menuItems, 
      verificationResults,
      manualPages,
      controlledRoutes,
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit trail exported successfully');
  };

  const handleCloneSitemap = async () => {
    try {
      toast.loading('Cloning sitemap pages from multiple sources...', { id: 'clone-sitemap' });
      await cloneSitemapMutation.mutateAsync();
      toast.success('Sitemap pages cloned successfully from all sources!', { id: 'clone-sitemap' });
    } catch (error) {
      toast.error('Failed to clone sitemap pages', { id: 'clone-sitemap' });
      console.error('Clone error:', error);
    }
  };

  const isSyncing = cloneSitemapMutation.isPending || pagesFetching;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">
              System integrity monitoring, multi-source content synchronization, AI-assisted menu management, and manual page configuration
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCloneSitemap} disabled={isSyncing}>
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isSyncing ? 'Syncing...' : 'Sync All Sources'}
            </Button>
            <Button onClick={handleExportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Audit Trail
            </Button>
          </div>
        </div>
        {isSyncing && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Synchronizing sitemap pages from map-56b.caffeine.xyz and etutorial-lgc.caffeine.xyz. This may take a moment...
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrity Logs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrityLogs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total operations logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Operations</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncOperations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Cross-origin syncs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cloned Pages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{clonedPages?.length || 0}</div>
              {pagesFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {clonedPages?.length ? 'Pages in navigation' : 'No pages synced'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Theme Configs</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{themeConfigs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Cloned theme settings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItemsByCategory.visible}</div>
            <p className="text-xs text-muted-foreground">
              {menuItemsByCategory.total} total items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manual Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manualPages?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Custom page slugs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manual-pages">Manual Pages</TabsTrigger>
          <TabsTrigger value="controlled-routes">Controlled Routes</TabsTrigger>
          <TabsTrigger value="menu">Dynamic Menu</TabsTrigger>
          <TabsTrigger value="verification">Auto-Verification</TabsTrigger>
          <TabsTrigger value="logs">Logs & History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Content Sources</CardTitle>
                <CardDescription>
                  Pages synchronized from multiple sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Map App</Badge>
                      <span className="text-sm text-muted-foreground">map-56b.caffeine.xyz</span>
                    </div>
                    <span className="text-2xl font-bold">{pagesBySource.map}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">eTutorial</Badge>
                      <span className="text-sm text-muted-foreground">etutorial-lgc.caffeine.xyz</span>
                    </div>
                    <span className="text-2xl font-bold">{pagesBySource.etutorial}</span>
                  </div>
                  {pagesBySource.other > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Other</Badge>
                        <span className="text-sm text-muted-foreground">Other sources</span>
                      </div>
                      <span className="text-2xl font-bold">{pagesBySource.other}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cloned Pages</CardTitle>
                    <CardDescription>
                      Pages synchronized from external sitemaps
                    </CardDescription>
                  </div>
                  {pagesFetching && (
                    <Badge variant="outline" className="gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Refreshing
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : clonedPages && clonedPages.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {clonedPages.slice(0, 10).map((page) => {
                      const isMapSource = page.url.includes('map-56b');
                      const isEtutorialSource = page.url.includes('etutorial-lgc');
                      return (
                        <Card key={page.id}>
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="gap-1 capitalize">
                                    <Globe className="h-3 w-3" />
                                    {page.id.replace(/-/g, ' ')}
                                  </Badge>
                                  <Badge variant={isMapSource ? 'default' : isEtutorialSource ? 'secondary' : 'outline'}>
                                    {isMapSource ? 'Map' : isEtutorialSource ? 'eTutorial' : 'Other'}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(page.lastSynced)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{page.url}</p>
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0"
                                onClick={() => navigate({ to: '/pages/$pageId', params: { pageId: page.id } })}
                              >
                                View Page →
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No cloned pages available. Click "Sync All Sources" to fetch pages from external sources.
                    </p>
                    <Button onClick={handleCloneSitemap} disabled={isSyncing}>
                      {isSyncing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {isSyncing ? 'Syncing...' : 'Sync All Sources Now'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manual-pages" className="space-y-6">
          <ManualPageManager />
        </TabsContent>

        <TabsContent value="controlled-routes" className="space-y-6">
          <ControlledRoutesManager />
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Assisted Dynamic Menu System</CardTitle>
              <CardDescription>
                Manage menu items with AI-powered auto-generation and live search capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <Badge variant="default" className="text-xs">Standard Pages</Badge>
                        <div className="text-3xl font-bold">{menuItemsByCategory.standard}</div>
                        <p className="text-xs text-muted-foreground">Core navigation items</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <Badge variant="secondary" className="text-xs">Cloned Pages</Badge>
                        <div className="text-3xl font-bold">{menuItemsByCategory.cloned}</div>
                        <p className="text-xs text-muted-foreground">From external sources</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <Badge variant="outline" className="text-xs">External Links</Badge>
                        <div className="text-3xl font-bold">{menuItemsByCategory.external}</div>
                        <p className="text-xs text-muted-foreground">Third-party resources</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {menuLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : menuItems && menuItems.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {menuItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.menuLabel}</span>
                                <Badge variant={item.category === 'standard' ? 'default' : item.category === 'cloned' ? 'secondary' : 'outline'}>
                                  {item.category}
                                </Badge>
                                {!item.isVisible && <Badge variant="destructive">Hidden</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{item.url}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>v{item.version.toString()}</span>
                                <span>•</span>
                                <span>{formatTimestamp(item.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No menu items available. Use the "+ Add Page" button in the navigation menu to create items.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Verification System</CardTitle>
              <CardDescription>
                Automated integrity checks triggered on menu and page updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verificationLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : latestVerifications.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {latestVerifications.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="gap-1">
                              {getStatusIcon(result.status)}
                              Verification
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(result.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.details}</p>
                          <Badge variant={result.status === 'passed' ? 'default' : result.status === 'warning' ? 'secondary' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No verification results available. Verifications run automatically on menu and page updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Integrity Logs</CardTitle>
                <CardDescription>
                  Automatic corrections and verification results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : integrityLogs && integrityLogs.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {integrityLogs.slice(0, 20).map((log, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="gap-1">
                                {getStatusIcon(log.result)}
                                {log.operation}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(log.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{log.details}</p>
                            <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                              {log.result}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No integrity logs available
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Operations</CardTitle>
                <CardDescription>
                  Cross-origin synchronization history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {syncLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : syncOperations && syncOperations.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {syncOperations.slice(0, 20).map((op, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="gap-1">
                                {getStatusIcon(op.status)}
                                Sync
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(op.timestamp)}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <p className="text-muted-foreground">
                                <span className="font-medium">Source:</span> {op.source}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-medium">Target:</span> {op.target}
                              </p>
                              <p className="text-muted-foreground">{op.details}</p>
                            </div>
                            <Badge variant={op.status === 'completed' ? 'default' : 'secondary'}>
                              {op.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No sync operations recorded
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {themeConfigs && themeConfigs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Theme Configurations</CardTitle>
                <CardDescription>
                  Cloned theme settings from external sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {themesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {themeConfigs.map((config) => (
                      <Card key={config.id}>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="gap-1">
                                <Palette className="h-3 w-3" />
                                {config.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(config.lastUpdated)}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <p className="text-muted-foreground">
                                <span className="font-medium">Mode:</span> {config.mode}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
