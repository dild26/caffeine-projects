import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useGetPages, useAddPage, useRemovePage, useGetPageAuditLog, useIsCallerAdmin } from '../hooks/useQueries';
import { AlertCircle, Plus, Trash2, Lock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Sitemap() {
  const navigate = useNavigate();
  const [pageSlug, setPageSlug] = useState('');
  const [error, setError] = useState('');

  const { data: pages = [], isLoading: pagesLoading } = useGetPages();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: auditLog = [] } = useGetPageAuditLog();
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

  if (pagesLoading || adminLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center">Loading sitemap...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center mb-2">Sitemap</h1>
          <p className="text-center text-muted-foreground">
            Navigate to any page in the application
          </p>
        </div>

        {isAdmin && (
          <>
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Admin: Page Management
                </CardTitle>
                <CardDescription>
                  Add or remove custom pages. System pages cannot be deleted.
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

            {auditLog.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Page Audit Log</CardTitle>
                  <CardDescription>
                    History of page additions and removals with Merkle root signatures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {auditLog.map((entry, idx) => (
                      <div key={idx} className="text-sm p-2 border rounded">
                        <div className="flex justify-between">
                          <span className="font-semibold">{entry.action}: /{entry.page}</span>
                          <span className="text-muted-foreground">
                            {new Date(Number(entry.timestamp) / 1000000).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Admin: {entry.adminId.toString().slice(0, 10)}...
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          Merkle: {entry.merkleRoot}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>
              Click any page to navigate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate({ to: `/${page}` as any })}
                >
                  /{page}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
