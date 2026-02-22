import { useState } from 'react';
import { useIsCallerAdmin, useGetAllRoutes, useAddAdminPage } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Plus, AlertCircle, CheckCircle, Globe, Shield, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function SitemapPage() {
  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsCallerAdmin();
  const { data: allRoutes, isLoading: isLoadingRoutes } = useGetAllRoutes();
  const addAdminPage = useAddAdminPage();

  const [newSlug, setNewSlug] = useState('');
  const [slugError, setSlugError] = useState('');

  const validateSlug = (slug: string): boolean => {
    if (!slug) {
      setSlugError('Slug cannot be empty');
      return false;
    }
    if (slug.includes(' ')) {
      setSlugError('Slug must not contain spaces');
      return false;
    }
    if (slug.includes('/')) {
      setSlugError('Slug must not contain slashes');
      return false;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
      setSlugError('Slug must only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    
    // Check for duplicates
    if (allRoutes) {
      const exists = 
        allRoutes.autoRoutes.some(r => r.path === slug) ||
        allRoutes.adminPriorityPages.some(p => p.slug === slug) ||
        allRoutes.controlledRoutes.some(r => r.path === slug);
      
      if (exists) {
        setSlugError('Route already exists');
        return false;
      }
    }
    
    setSlugError('');
    return true;
  };

  const handleAddPage = async () => {
    if (!validateSlug(newSlug)) return;

    try {
      await addAdminPage.mutateAsync(newSlug);
      setNewSlug('');
      setSlugError('');
    } catch (error: any) {
      setSlugError(error.message || 'Failed to add page');
    }
  };

  if (isLoadingAdmin || isLoadingRoutes) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sitemap...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Map className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Sitemap</h1>
              <p className="text-muted-foreground">Browse all available routes and pages</p>
            </div>
          </div>

          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle>Admin Controls</CardTitle>
                </div>
                <CardDescription>
                  Add new pages to the admin-priority sitemap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Page Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      placeholder="e.g., new-feature"
                      value={newSlug}
                      onChange={(e) => {
                        setNewSlug(e.target.value);
                        setSlugError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddPage();
                        }
                      }}
                      className={slugError ? 'border-destructive' : ''}
                    />
                    <Button 
                      onClick={handleAddPage}
                      disabled={addAdminPage.isPending || !newSlug}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Page
                    </Button>
                  </div>
                  {slugError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {slugError}
                    </p>
                  )}
                  {addAdminPage.isSuccess && !slugError && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Page added successfully
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Routes</TabsTrigger>
              <TabsTrigger value="auto">Auto-Generated</TabsTrigger>
              <TabsTrigger value="admin">Admin Pages</TabsTrigger>
              <TabsTrigger value="controlled">Controlled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Route Resolution Order:</strong> Auto-generated routes (highest priority) → Admin priority pages → Controlled routes
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>All Available Routes</CardTitle>
                  <CardDescription>Complete list of all routes in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allRoutes && (
                      <>
                        {allRoutes.autoRoutes.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Auto-Generated Routes
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {allRoutes.autoRoutes.map((route) => (
                                <Badge key={route.path} variant="default" className="justify-center py-2">
                                  {route.path}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {allRoutes.adminPriorityPages.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Admin Priority Pages
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {allRoutes.adminPriorityPages.map((page) => (
                                <Badge key={page.slug} variant="secondary" className="justify-center py-2">
                                  {page.slug}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {allRoutes.controlledRoutes.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Controlled Routes
                            </h3>
                            <div className="space-y-2">
                              {allRoutes.controlledRoutes.map((route) => (
                                <div key={route.path} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{route.path}</Badge>
                                    <span className="text-sm text-muted-foreground">→</span>
                                    <span className="text-sm font-medium">{route.delegatedTo}</span>
                                  </div>
                                  <Badge variant="secondary">Delegated</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auto">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Generated Routes</CardTitle>
                  <CardDescription>System-generated routes with highest priority</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {allRoutes?.autoRoutes.map((route) => (
                      <Badge key={route.path} variant="default" className="justify-center py-2">
                        <Globe className="w-3 h-3 mr-1" />
                        {route.path}
                      </Badge>
                    ))}
                  </div>
                  {allRoutes?.autoRoutes.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No auto-generated routes</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Priority Pages</CardTitle>
                  <CardDescription>Pages managed by administrators with priority routing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {allRoutes?.adminPriorityPages.map((page) => (
                      <Badge key={page.slug} variant="secondary" className="justify-center py-2">
                        {page.slug}
                      </Badge>
                    ))}
                  </div>
                  {allRoutes?.adminPriorityPages.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No admin pages yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="controlled">
              <Card>
                <CardHeader>
                  <CardTitle>Controlled Routes</CardTitle>
                  <CardDescription>Routes delegated to external applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {allRoutes?.controlledRoutes.map((route) => (
                      <div key={route.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{route.path}</Badge>
                          <span className="text-sm text-muted-foreground">→</span>
                          <span className="text-sm font-medium">{route.delegatedTo}</span>
                        </div>
                        <Badge variant="secondary">Delegated</Badge>
                      </div>
                    ))}
                  </div>
                  {allRoutes?.controlledRoutes.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No controlled routes</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
