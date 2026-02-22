import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Plus, AlertCircle, CheckCircle2, Loader2, LogIn } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetPages, useAddPage } from '@/hooks/useQueries';
import { toast } from 'sonner';
import UserProfileSetup from '@/components/UserProfileSetup';

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: pages, isLoading: pagesLoading } = useGetPages();
  const addPageMutation = useAddPage();

  const [newPageSlug, setNewPageSlug] = useState('');
  const [validationError, setValidationError] = useState('');

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const validatePageSlug = (slug: string): string | null => {
    if (!slug) return 'Page slug cannot be empty';
    if (slug !== slug.toLowerCase()) return 'Page slug must be lowercase';
    if (slug.includes(' ')) return 'Page slug cannot contain spaces';
    if (!/^[a-z0-9-]+$/.test(slug)) return 'Page slug can only contain lowercase letters, numbers, and hyphens';
    return null;
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validatePageSlug(newPageSlug);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');

    try {
      const result = await addPageMutation.mutateAsync(newPageSlug);
      
      if (result === 'Page added successfully') {
        toast.success('Page added successfully!');
        setNewPageSlug('');
      } else {
        toast.error(result);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
      console.error(error);
    }
  };

  const handleInputChange = (value: string) => {
    setNewPageSlug(value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Please login with Internet Identity to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleLogin} disabled={isLoggingIn} size="lg">
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to Continue
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show profile setup if needed
  if (showProfileSetup) {
    return <UserProfileSetup open={showProfileSetup} />;
  }

  // Show loading state while checking admin status
  if (profileLoading || adminLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators can access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render admin panel for authenticated admins
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="gradient-bg p-8 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage sitemap pages and application settings
        </p>
        {userProfile && (
          <p className="text-sm text-muted-foreground mt-2">
            Welcome, {userProfile.name}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Page
          </CardTitle>
          <CardDescription>
            Add a new page to the sitemap. Page slugs must be lowercase with no spaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageSlug">Page Slug</Label>
              <Input
                id="pageSlug"
                value={newPageSlug}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g., new-page"
                className={validationError ? 'border-destructive' : ''}
              />
              {validationError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationError}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Note: Protected routes (broadcast, remote, live) require Secoinfi-Apps integration
              </p>
            </div>
            <Button type="submit" disabled={addPageMutation.isPending || !newPageSlug}>
              {addPageMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Pages</CardTitle>
          <CardDescription>
            List of all pages in the sitemap ({pages?.length || 0} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pagesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : pages && pages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pages.map((page) => (
                <Badge key={page} variant="secondary" className="text-sm">
                  /{page}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No pages found</p>
          )}
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          The sitemap automatically merges auto-generated pages with manually added pages.
          Changes are reflected immediately across the application.
        </AlertDescription>
      </Alert>
    </div>
  );
}
