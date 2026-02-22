import { useState } from 'react';
import { useIsCallerAdmin, useGetAllRoutes, useAddAdminPage, useAddPageMetadata } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, AlertCircle, CheckCircle, Lock, Globe } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AdminPage() {
  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsCallerAdmin();
  const { data: allRoutes, isLoading: isLoadingRoutes } = useGetAllRoutes();
  const addAdminPage = useAddAdminPage();
  const addPageMetadata = useAddPageMetadata();

  const [newSlug, setNewSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [metadataPage, setMetadataPage] = useState('');
  const [metadataHash, setMetadataHash] = useState('');
  const [metadataSignature, setMetadataSignature] = useState('');

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

  const handleAddMetadata = async () => {
    if (!metadataPage || !metadataHash || !metadataSignature) {
      return;
    }

    try {
      await addPageMetadata.mutateAsync({
        page: metadataPage,
        hash: metadataHash,
        adminSignature: metadataSignature
      });
      setMetadataPage('');
      setMetadataHash('');
      setMetadataSignature('');
    } catch (error: any) {
      console.error('Failed to add metadata:', error);
    }
  };

  if (isLoadingAdmin || isLoadingRoutes) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin panel...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <Lock className="w-6 h-6" />
                <CardTitle>Access Denied</CardTitle>
              </div>
              <CardDescription>
                You do not have administrator privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Only users with admin role can manage the sitemap and system configuration.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
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
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage sitemap, routes, and system configuration</p>
            </div>
          </div>

          <Tabs defaultValue="pages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">Admin Pages</TabsTrigger>
              <TabsTrigger value="routes">All Routes</TabsTrigger>
              <TabsTrigger value="metadata">Page Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Admin Page</CardTitle>
                  <CardDescription>
                    Add a new page to the admin-priority sitemap. Pages must have unique slugs without spaces or slashes.
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

              <Card>
                <CardHeader>
                  <CardTitle>Admin Priority Pages</CardTitle>
                  <CardDescription>
                    Pages in the admin-controlled sitemap with priority routing
                  </CardDescription>
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

            <TabsContent value="routes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Generated Routes</CardTitle>
                  <CardDescription>System-generated routes (highest priority)</CardDescription>
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

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Route Resolution Order:</strong> Auto-generated routes → Admin priority pages → Controlled routes
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Page Metadata</CardTitle>
                  <CardDescription>
                    Add audit metadata for pages including hash and admin signature
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metadata-page">Page</Label>
                    <Input
                      id="metadata-page"
                      placeholder="Page slug"
                      value={metadataPage}
                      onChange={(e) => setMetadataPage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metadata-hash">Hash</Label>
                    <Input
                      id="metadata-hash"
                      placeholder="Page content hash"
                      value={metadataHash}
                      onChange={(e) => setMetadataHash(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metadata-signature">Admin Signature</Label>
                    <Input
                      id="metadata-signature"
                      placeholder="Admin signature"
                      value={metadataSignature}
                      onChange={(e) => setMetadataSignature(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddMetadata}
                    disabled={addPageMetadata.isPending || !metadataPage || !metadataHash || !metadataSignature}
                  >
                    Add Metadata
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Page Metadata Records</CardTitle>
                  <CardDescription>Audit trail for page authenticity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allRoutes?.pageMetadata.map((metadata, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge>{metadata.page}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Number(metadata.timestamp) / 1000000).toLocaleString()}
                          </span>
                        </div>
                        <Separator />
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Hash:</span>
                            <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">{metadata.hash}</code>
                          </div>
                          <div>
                            <span className="font-medium">Signature:</span>
                            <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">{metadata.adminSignature}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {allRoutes?.pageMetadata.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No metadata records</p>
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
