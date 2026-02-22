import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetSitemap, useAddManualPage, useRemoveManualPage } from '../hooks/useQueries';
import { Plus, Trash2, Globe, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SitemapManager() {
  const { data: sitemap, isLoading } = useGetSitemap();
  const addPageMutation = useAddManualPage();
  const removePageMutation = useRemoveManualPage();

  const [newPagePath, setNewPagePath] = useState('');
  const [isPublicPage, setIsPublicPage] = useState(true);

  const handleAddPage = async () => {
    const trimmedPath = newPagePath.trim().toLowerCase();

    // Validation
    if (!trimmedPath) {
      toast.error('Page path cannot be empty');
      return;
    }

    if (!trimmedPath.startsWith('/')) {
      toast.error('Page path must start with /');
      return;
    }

    if (trimmedPath.includes(' ')) {
      toast.error('Page path cannot contain spaces');
      return;
    }

    // Check for reserved keywords
    const reservedPaths = ['/admin', '/api', '/system', '/internal'];
    if (reservedPaths.some((reserved) => trimmedPath.startsWith(reserved))) {
      toast.error('Cannot use reserved path prefix');
      return;
    }

    // Check for duplicates
    const allPaths = [
      ...(sitemap?.auto || []),
      ...(sitemap?.manualPages.map((p) => p.path) || []),
    ];
    if (allPaths.includes(trimmedPath)) {
      toast.error('Page path already exists in sitemap');
      return;
    }

    try {
      await addPageMutation.mutateAsync({ path: trimmedPath, isPublic: isPublicPage });
      setNewPagePath('');
      setIsPublicPage(true);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRemovePage = async (path: string) => {
    if (window.confirm(`Are you sure you want to remove "${path}" from the sitemap?`)) {
      try {
        await removePageMutation.mutateAsync(path);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading sitemap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Sitemap Management</h2>
        <p className="text-muted-foreground mt-1">
          Manage site pages with public and restricted access control
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Control Policy</AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="font-semibold">Public Pages:</span>
              <span className="text-sm">Accessible without authentication (forms, portal, about, contact, etc.)</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-600" />
              <span className="font-semibold">Restricted Pages:</span>
              <span className="text-sm">Require authentication (admin, subscriptions, audit logs, etc.)</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Add New Page</CardTitle>
          <CardDescription>
            Add a new page to the sitemap with access control settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-path" className="font-bold">
              Page Path
            </Label>
            <Input
              id="page-path"
              placeholder="/example-page"
              value={newPagePath}
              onChange={(e) => setNewPagePath(e.target.value)}
              disabled={addPageMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Must start with /, lowercase only, no spaces
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="public-access" className="font-bold">
                Public Access
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow anonymous users to access this page
              </p>
            </div>
            <Switch
              id="public-access"
              checked={isPublicPage}
              onCheckedChange={setIsPublicPage}
              disabled={addPageMutation.isPending}
            />
          </div>

          <Button
            onClick={handleAddPage}
            disabled={addPageMutation.isPending || !newPagePath.trim()}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {addPageMutation.isPending ? 'Adding...' : 'Add Page'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatic Pages</CardTitle>
          <CardDescription>
            System-generated pages from application routes (public access)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sitemap?.auto.map((path) => (
              <div
                key={path}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="font-mono text-sm">{path}</span>
                  <Badge variant="outline" className="text-xs">
                    Auto
                  </Badge>
                  <Badge variant="default" className="text-xs gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Public
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Pages</CardTitle>
          <CardDescription>
            Admin-defined pages with custom access control
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sitemap?.manualPages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No manual pages added yet
            </p>
          ) : (
            <div className="space-y-2">
              {sitemap?.manualPages.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {page.isPublic ? (
                      <Globe className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="font-mono text-sm">{page.path}</span>
                    <Badge variant="secondary" className="text-xs">
                      Manual
                    </Badge>
                    <Badge
                      variant={page.isPublic ? 'default' : 'outline'}
                      className="text-xs gap-1"
                    >
                      {page.isPublic ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          Restricted
                        </>
                      )}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePage(page.path)}
                    disabled={removePageMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
