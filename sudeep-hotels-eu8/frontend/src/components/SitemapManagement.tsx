import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetPages, useAddPage, useInitializePages, useGrantSecoinfiAppAccess, useRevokeSecoinfiAppAccess } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Plus, Loader2, Lock, Unlock, AlertCircle, Radio, CheckCircle } from 'lucide-react';
import { Page } from '../backend';

export function SitemapManagement() {
  const [newSlug, setNewSlug] = useState('');
  const [appPrincipal, setAppPrincipal] = useState('');
  const { data: pages, isLoading, error } = useGetPages();
  const { mutate: addPage, isPending: isAdding } = useAddPage();
  const { mutate: initializePages, isPending: isInitializing } = useInitializePages();
  const { mutate: grantAccess, isPending: isGranting } = useGrantSecoinfiAppAccess();
  const { mutate: revokeAccess, isPending: isRevoking } = useRevokeSecoinfiAppAccess();

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = newSlug.trim().toLowerCase();
    
    if (!slug) {
      toast.error('Please enter a page slug');
      return;
    }

    if (slug.includes(' ')) {
      toast.error('Slug cannot contain spaces');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    addPage(slug, {
      onSuccess: () => {
        toast.success(`Page "${slug}" added successfully!`);
        setNewSlug('');
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to add page: ${errorMessage}`);
      },
    });
  };

  const handleInitialize = () => {
    initializePages(undefined, {
      onSuccess: () => {
        toast.success('Pages initialized successfully!');
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to initialize pages: ${errorMessage}`);
      },
    });
  };

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    
    const principal = appPrincipal.trim();
    
    if (!principal) {
      toast.error('Please enter a principal ID');
      return;
    }

    grantAccess(principal, {
      onSuccess: () => {
        toast.success('Access granted successfully!');
        setAppPrincipal('');
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast.error(`Failed to grant access: ${errorMessage}`);
      },
    });
  };

  const systemPages = pages?.filter((p: Page) => p.isSystem) || [];
  const customPages = pages?.filter((p: Page) => !p.isSystem) || [];
  const runtimeControlledPages = pages?.filter((p: Page) => p.isRuntimeControlled) || [];
  const publicPages = pages?.filter((p: Page) => !p.isRuntimeControlled) || [];

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading sitemap data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sitemap Management</h1>
        <p className="text-muted-foreground">
          Manage your website's pages and access control
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {(!pages || pages.length === 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>No pages found. Initialize the system pages to get started.</span>
                <Button
                  onClick={handleInitialize}
                  disabled={isInitializing}
                  size="sm"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    'Initialize Pages'
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Page
              </CardTitle>
              <CardDescription>
                Add a custom page to your sitemap. Slug must be lowercase, no spaces, and unique.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPage} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="slug" className="sr-only">
                    Page Slug
                  </Label>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="e.g., new-page"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    disabled={isAdding}
                  />
                </div>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Page
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Public Access Pages
              </CardTitle>
              <CardDescription>
                These pages are publicly accessible to all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {publicPages.length > 0 ? (
                  publicPages.map((page: Page) => (
                    <Badge key={page.slug} variant="outline" className="gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {page.slug}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No public pages found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {runtimeControlledPages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-orange-500" />
                  Runtime-Controlled Pages
                </CardTitle>
                <CardDescription>
                  These pages require special permissions from Secoinfi-Apps (admin or authorized apps only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {runtimeControlledPages.map((page: Page) => (
                      <Badge key={page.slug} variant="secondary" className="gap-2">
                        <Radio className="h-3 w-3 text-orange-500" />
                        {page.slug}
                      </Badge>
                    ))}
                  </div>
                  <Separator />
                  <form onSubmit={handleGrantAccess} className="space-y-4">
                    <div>
                      <Label htmlFor="principal">Grant Access to Secoinfi-App</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Enter the principal ID of the app to grant access to runtime-controlled pages
                      </p>
                      <div className="flex gap-4">
                        <Input
                          id="principal"
                          type="text"
                          placeholder="Principal ID"
                          value={appPrincipal}
                          onChange={(e) => setAppPrincipal(e.target.value)}
                          disabled={isGranting}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={isGranting}>
                          {isGranting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Granting...
                            </>
                          ) : (
                            <>
                              <Unlock className="mr-2 h-4 w-4" />
                              Grant Access
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                System Pages
              </CardTitle>
              <CardDescription>
                These pages are protected and cannot be modified or deleted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {systemPages.length > 0 ? (
                  systemPages.map((page: Page) => (
                    <Badge key={page.slug} variant="secondary" className="gap-2">
                      <Lock className="h-3 w-3" />
                      {page.slug}
                      {page.isRuntimeControlled && (
                        <Radio className="h-3 w-3 text-orange-500" />
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No system pages found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {customPages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Pages</CardTitle>
                <CardDescription>
                  Pages you have added to the sitemap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {customPages.map((page: Page) => (
                    <Badge key={page.slug} variant="outline">
                      {page.slug}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Sitemap Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{pages?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Pages</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{systemPages.length}</div>
                  <div className="text-sm text-muted-foreground">System Pages</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{customPages.length}</div>
                  <div className="text-sm text-muted-foreground">Custom Pages</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{runtimeControlledPages.length}</div>
                  <div className="text-sm text-muted-foreground">Runtime-Controlled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
