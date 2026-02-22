import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetSitemapData, useAddManualPage, useIsCallerAdmin } from '@/hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Lock, AlertCircle, Settings, Map } from 'lucide-react';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: sitemapData, isLoading: sitemapLoading } = useGetSitemapData();
  const addManualPage = useAddManualPage();
  const [newSlug, setNewSlug] = useState('');

  const controlledRoutes = ['broadcast', 'remote', 'live'];

  const handleAddPage = async () => {
    if (!newSlug.trim()) {
      toast.error('Please enter a page slug');
      return;
    }

    const slug = newSlug.trim().toLowerCase();

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error('Slug must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    try {
      await addManualPage.mutateAsync(slug);
      toast.success(`Page "${slug}" added successfully`);
      setNewSlug('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add page';
      if (errorMessage.includes('already exists')) {
        toast.error('This page slug already exists in the sitemap');
      } else if (errorMessage.includes('controlled routes')) {
        toast.error('Cannot modify controlled routes (broadcast, remote, live)');
      } else if (errorMessage.includes('lowercase')) {
        toast.error('Slug must be lowercase');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('Only admins can add pages');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You do not have permission to access the admin dashboard. Only administrators can view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>

      <Tabs defaultValue="sitemap" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sitemap" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Sitemap Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sitemap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Management</CardTitle>
              <CardDescription>
                Add and manage manual pages in the sitemap. Resolution order: auto &gt; manual pages &gt; controlled routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newSlug">Add New Page Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="newSlug"
                    placeholder="e.g., new-page"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddPage();
                      }
                    }}
                    disabled={addManualPage.isPending}
                  />
                  <Button
                    onClick={handleAddPage}
                    disabled={addManualPage.isPending || !newSlug.trim()}
                  >
                    {addManualPage.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Page
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a lowercase slug (letters, numbers, hyphens only). Must be unique across all sitemap layers.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Manual Pages ({sitemapData?.manualPages.length || 0})</Label>
                {sitemapLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                    {sitemapData && sitemapData.manualPages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {sitemapData.manualPages.map((page) => (
                          <Badge
                            key={page}
                            variant={controlledRoutes.includes(page) ? 'secondary' : 'default'}
                            className="flex items-center gap-1"
                          >
                            {page}
                            {controlledRoutes.includes(page) && (
                              <Lock className="h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No manual pages added yet
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Protected Routes:</strong> broadcast, remote, and live are controlled by Secoinfi-App and cannot be modified or deleted through this interface.
                </AlertDescription>
              </Alert>

              {sitemapData && (
                <div className="space-y-2">
                  <Label>Controlled Routes</Label>
                  <div className="border rounded-lg p-4">
                    <div className="space-y-2">
                      {sitemapData.controlledRoutes.map(([route, app]) => (
                        <div key={route} className="flex items-center justify-between text-sm">
                          <span className="font-medium">/{route}</span>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            {app}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These routes are managed by external applications and are read-only.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Additional system settings will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
