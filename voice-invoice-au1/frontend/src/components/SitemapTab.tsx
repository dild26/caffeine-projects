import { useState } from 'react';
import { useGetSitemap, useAddPage, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageType } from '../backend';
import { Plus, Loader2, Map, Lock, Radio, AlertCircle, CheckCircle2, Hash } from 'lucide-react';

export default function SitemapTab() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: sitemap, isLoading } = useGetSitemap();
  const { mutate: addPage, isPending } = useAddPage();
  const [pageSlug, setPageSlug] = useState('');
  const [validationError, setValidationError] = useState('');

  const isAuthenticated = !!identity;

  const validateSlug = (slug: string): boolean => {
    setValidationError('');

    if (!slug) {
      setValidationError('Page slug cannot be empty');
      return false;
    }

    // Check for lowercase, digits, and hyphens only
    const validPattern = /^[a-z0-9-]+$/;
    if (!validPattern.test(slug)) {
      setValidationError('Page slug must contain only lowercase letters, digits, and hyphens');
      return false;
    }

    // Check if reserved
    if (sitemap?.reservedRoutes.includes(slug)) {
      setValidationError('This slug is a reserved keyword');
      return false;
    }

    // Check if already exists
    if (sitemap?.pages.some((p) => p.slug === slug)) {
      setValidationError('This page already exists');
      return false;
    }

    return true;
  };

  const handleAddPage = () => {
    if (!validateSlug(pageSlug)) return;

    addPage(
      { slug: pageSlug, pageType: PageType.manual },
      {
        onSuccess: () => {
          setPageSlug('');
          setValidationError('');
        },
      }
    );
  };

  const formatHash = (hash: Uint8Array) => {
    const hashStr = Array.from(hash)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashStr.length <= 8 ? hashStr : `${hashStr.slice(0, 4)}...${hashStr.slice(-4)}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Sitemap Management
          </CardTitle>
          <CardDescription>
            View application pages with three-tier resolution: system sitemap → manual pages → app-controlled dynamic
            routes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Merkle Root Audit Trail */}
      {sitemap?.merkleRoot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hash className="h-4 w-4" />
              Merkle Root Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Latest Sitemap Hash</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatHash(sitemap.merkleRoot.rootHash)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Modified</p>
                <p className="text-sm font-medium">{formatDate(sitemap.merkleRoot.timestamp)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Page Form - Admin Only */}
      {isAuthenticated && isAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" />
              Add New Page
            </CardTitle>
            <CardDescription>Create a new manual page entry (admin only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageSlug">Page Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="pageSlug"
                  placeholder="e.g., my-custom-page"
                  value={pageSlug}
                  onChange={(e) => {
                    setPageSlug(e.target.value.toLowerCase());
                    setValidationError('');
                  }}
                  className={validationError ? 'border-destructive' : ''}
                />
                <Button onClick={handleAddPage} disabled={isPending || !pageSlug}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add Page
                </Button>
              </div>
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-muted-foreground">
                Must be lowercase, no spaces. Use hyphens to separate words.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !isAuthenticated ? (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Login required to add new pages to the sitemap.</span>
            <Button onClick={login} disabled={isLoggingIn} size="sm">
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>Only administrators can add new pages to the sitemap.</AlertDescription>
        </Alert>
      )}

      {/* Manual Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4" />
            Manual Pages ({sitemap?.pages.filter((p) => p.pageType === PageType.manual).length || 0})
          </CardTitle>
          <CardDescription>Pages manually added by administrators</CardDescription>
        </CardHeader>
        <CardContent>
          {sitemap?.pages.filter((p) => p.pageType === PageType.manual).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No manual pages added yet</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {sitemap?.pages
                  .filter((p) => p.pageType === PageType.manual)
                  .map((page) => (
                    <div key={page.slug} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          /{page.slug}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Added {formatDate(page.createdAt)}</span>
                      </div>
                      <Badge variant="secondary">Manual</Badge>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* System Reserved Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" />
            System Reserved Routes ({sitemap?.reservedRoutes.length || 0})
          </CardTitle>
          <CardDescription>Protected system routes that cannot be used for manual pages</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="flex flex-wrap gap-2">
              {sitemap?.reservedRoutes.map((route) => (
                <Badge key={route} variant="outline" className="font-mono">
                  /{route}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Runtime-Controlled Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Radio className="h-4 w-4" />
            Runtime-Controlled Routes ({sitemap?.runtimeControlledRoutes.length || 0})
          </CardTitle>
          <CardDescription>
            Dynamic routes managed by Secoinfi-Apps delegation (broadcast, remote, live)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sitemap?.runtimeControlledRoutes.map((route) => (
              <Badge key={route} variant="secondary" className="font-mono">
                /{route}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resolution Order Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Three-Tier Resolution Order:</strong> System sitemap → Manual pages array → App-controlled dynamic
          routes. This ensures proper routing priority and prevents conflicts.
        </AlertDescription>
      </Alert>
    </div>
  );
}
