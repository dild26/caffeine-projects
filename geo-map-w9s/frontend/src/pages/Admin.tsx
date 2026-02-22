import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useIsCallerAdmin, useGetPages, useAddPage, useRemovePage, useGetControlledRoutes } from '../hooks/useQueries';
import { Shield, Plus, Trash2, ExternalLink, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const [pageSlug, setPageSlug] = useState('');
  const [error, setError] = useState('');

  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: pages = [], isLoading: pagesLoading } = useGetPages();
  const { data: controlledRoutes = [] } = useGetControlledRoutes();
  const addPageMutation = useAddPage();
  const removePageMutation = useRemovePage();

  const systemPages = [
    'about', 'admin', 'analytics', 'blog', 'contact', 'dashboard', 
    'faq', 'features', 'help', 'map', 'pros', 'referral', 
    'reports', 'settings', 'sitemap', 'subscription', 'templates', 
    'terms', 'trust', 'upload', 'what', 'why'
  ];

  const handleAddPage = async () => {
    setError('');

    if (!pageSlug.trim()) {
      setError('Page slug cannot be empty');
      return;
    }

    const normalizedSlug = pageSlug.trim().toLowerCase();

    if (normalizedSlug !== pageSlug.trim()) {
      setError('Page slug must be lowercase');
      return;
    }

    if (normalizedSlug.includes(' ')) {
      setError('Page slug cannot contain spaces');
      return;
    }

    if (pages.includes(normalizedSlug)) {
      setError('Page slug must be unique');
      return;
    }

    try {
      await addPageMutation.mutateAsync(normalizedSlug);
      toast.success(`Page "${normalizedSlug}" added successfully`);
      setPageSlug('');
    } catch (err: any) {
      setError(err.message || 'Failed to add page');
      toast.error('Failed to add page');
    }
  };

  const handleRemovePage = async (page: string) => {
    if (systemPages.includes(page)) {
      toast.error('Cannot remove system pages');
      return;
    }

    try {
      await removePageMutation.mutateAsync(page);
      toast.success(`Page "${page}" removed successfully`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove page');
    }
  };

  const isSystemPage = (page: string) => systemPages.includes(page);

  if (adminLoading || pagesLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center">Loading admin panel...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage application settings and configurations
          </p>
        </div>

        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Page Management
            </CardTitle>
            <CardDescription>
              Add or remove custom pages from the sitemap. System pages cannot be deleted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageSlug">Page Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="pageSlug"
                  placeholder="e.g., custom-page"
                  value={pageSlug}
                  onChange={(e) => {
                    setPageSlug(e.target.value);
                    setError('');
                  }}
                  disabled={addPageMutation.isPending}
                />
                <Button
                  onClick={handleAddPage}
                  disabled={addPageMutation.isPending || !pageSlug.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-muted-foreground">
                Page slug must be lowercase, unique, and contain no spaces
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">Existing Pages ({pages.length})</h3>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {pages.map((page) => (
                  <div
                    key={page}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">/{page}</span>
                      {isSystemPage(page) && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">System</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate({ to: `/${page}` as any })}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePage(page)}
                        disabled={isSystemPage(page) || removePageMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controlled Routes</CardTitle>
            <CardDescription>
              Special routes delegated to Secoinfi-App logic (admin-only access)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {controlledRoutes.length > 0 ? (
              <div className="space-y-2">
                {controlledRoutes.map((route, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-mono text-sm">{route.path}</span>
                      <p className="text-xs text-muted-foreground">
                        Delegate: {route.delegate}
                      </p>
                    </div>
                    {route.adminOnly && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Admin Only
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No controlled routes configured</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: '/sitemap' })}
              >
                View Full Sitemap
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: '/dashboard' })}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pages:</span>
                <span className="font-semibold">{pages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Pages:</span>
                <span className="font-semibold">{systemPages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custom Pages:</span>
                <span className="font-semibold">{pages.length - systemPages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Controlled Routes:</span>
                <span className="font-semibold">{controlledRoutes.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
