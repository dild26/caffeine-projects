import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetNavItems, useGetPros, useGetSitemapPages, useGetControlledRoutes, useIsCallerAdmin, useAddManualPage, useRemoveManualPage } from '../hooks/useAppQueries';
import { useNavigate } from '@tanstack/react-router';
import { ExternalLink, Loader2, Plus, Trash2, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SitemapPage() {
  const { data: navItems = [], isLoading: navLoading } = useGetNavItems();
  const { data: pros = [], isLoading: prosLoading } = useGetPros();
  const { data: sitemapPages = [], isLoading: sitemapLoading } = useGetSitemapPages();
  const { data: controlledRoutes = [], isLoading: controlledLoading } = useGetControlledRoutes();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  const [newPageSlug, setNewPageSlug] = useState('');
  const addPageMutation = useAddManualPage();
  const removePageMutation = useRemoveManualPage();

  const isLoading = navLoading || prosLoading || sitemapLoading || controlledLoading || adminLoading;

  // Auto-generated pages (from backend)
  const autoPages = ['home', 'dashboard', 'features', 'profile', 'settings', 'help'];

  // Manual pages are all pages not in autoPages
  const manualPages = sitemapPages.filter(page => !autoPages.includes(page));

  // System-reserved pages that cannot be removed
  const systemReservedPages = ['home', 'dashboard', 'features', 'profile', 'settings', 'help', 'about', 'contact', 'sitemap'];

  const handleAddPage = async () => {
    const slug = newPageSlug.trim().toLowerCase();
    
    if (!slug) {
      toast.error('Please enter a page slug');
      return;
    }

    if (slug.includes(' ')) {
      toast.error('Page slug cannot contain spaces');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error('Page slug must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    if (systemReservedPages.includes(slug)) {
      toast.error('Cannot add a system-reserved page');
      return;
    }

    try {
      await addPageMutation.mutateAsync(slug);
      toast.success(`Page "${slug}" added successfully`);
      setNewPageSlug('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
    }
  };

  const handleRemovePage = async (page: string) => {
    if (systemReservedPages.includes(page)) {
      toast.error('Cannot remove system-reserved pages');
      return;
    }

    try {
      await removePageMutation.mutateAsync(page);
      toast.success(`Page "${page}" removed successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove page');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading sitemap...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Sitemap</h1>
          <p className="text-xl text-muted-foreground">
            Complete navigation structure of SECOINFI
          </p>
        </div>

        {isAdmin && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Manual Page
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter page slug (e.g., new-page)"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPage();
                    }
                  }}
                />
                <Button 
                  onClick={handleAddPage}
                  disabled={addPageMutation.isPending}
                >
                  {addPageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="ml-2">Add Page</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Page slug must be lowercase, unique, and contain no spaces. Reserved keywords are blocked.
              </p>
            </CardContent>
          </Card>
        )}

        {controlledRoutes.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Controlled Routes</p>
                <div className="flex flex-wrap gap-2">
                  {controlledRoutes.map(([route, owner]) => (
                    <Badge key={route} variant="outline">
                      /{route} → {owner}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  These routes are dynamically controlled and accessible only when whitelisted by admin.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Auto-Generated Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {autoPages.map((page) => (
                <div
                  key={page}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium capitalize">{page}</p>
                      <p className="text-sm text-muted-foreground">/{page}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">System</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Manual Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {manualPages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No manual pages added yet. {isAdmin && 'Use the form above to add pages.'}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {manualPages.map((page) => {
                  const isReserved = systemReservedPages.includes(page);
                  return (
                    <div
                      key={page}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium capitalize">{page}</p>
                          <p className="text-sm text-muted-foreground">/{page}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isReserved && (
                          <Badge variant="secondary">Protected</Badge>
                        )}
                        {isAdmin && !isReserved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePage(page)}
                            disabled={removePageMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors text-left group"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.adminOnly && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Key-Unlock App Advantages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {pros.map((pro) => (
                <button
                  key={pro.id.toString()}
                  onClick={() => navigate({ to: pro.link })}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors text-left group"
                >
                  <div>
                    <p className="font-medium">{pro.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {pro.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Use the navigation menu in the header to quickly access any page, or use the search function to find specific content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
