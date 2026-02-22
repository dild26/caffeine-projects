import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetSitemapData, useAddManualPage, useIsCallerAdmin } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Lock, AlertCircle } from 'lucide-react';

export default function Sitemap() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: sitemapData, isLoading: sitemapLoading } = useGetSitemapData();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const addManualPage = useAddManualPage();
  const [newSlug, setNewSlug] = useState('');

  const isAuthenticated = !!identity;

  const publicSections = [
    {
      title: 'Information',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Blog', path: '/blog' },
        { label: 'About Us', path: '/about' },
        { label: 'What We Do', path: '/what-we-do' },
        { label: 'Why Us', path: '/why-us' },
        { label: 'Pros of e-Contracts', path: '/pros-of-e-contracts' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Help', path: '/help' },
        { label: 'Terms & Conditions', path: '/terms' },
      ],
    },
    {
      title: 'Other',
      links: [
        { label: 'Referral Program', path: '/referral' },
        { label: 'Proof of Trust', path: '/proof-of-trust' },
        { label: 'Templates', path: '/templates' },
      ],
    },
  ];

  const protectedSections = [
    {
      title: 'Main Pages',
      links: [
        { label: 'Dashboard', path: '/' },
        { label: 'CRM', path: '/crm' },
        { label: 'Billing', path: '/billing' },
        { label: 'Products', path: '/products' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'Reports', path: '/reports' },
        { label: 'Settings', path: '/settings' },
        { label: 'Admin Dashboard', path: '/admin' },
      ],
    },
  ];

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

  const handleNavigate = (path: string) => {
    if (path === '/' || path.startsWith('/crm') || path.startsWith('/billing') || 
        path.startsWith('/products') || path.startsWith('/analytics') || 
        path.startsWith('/reports') || path.startsWith('/settings') || 
        path.startsWith('/admin')) {
      window.location.href = path;
    } else {
      navigate({ to: path });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Sitemap</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Navigate through all pages of SECOINFI
        </p>
      </div>

      {isAuthenticated && isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin: Manage Manual Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                Enter a lowercase slug (letters, numbers, hyphens only). Must be unique.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Manual Pages</Label>
              {sitemapLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
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
                <strong>Protected Routes:</strong> broadcast, remote, and live are controlled by Secoinfi-App and cannot be modified or deleted.
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
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Public Pages</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicSections.map((section, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                  <div className="space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <Button
                        key={linkIdx}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigate(link.path)}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Protected Pages (Login Required)</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {protectedSections.map((section, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                  <div className="space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <Button
                        key={linkIdx}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigate(link.path)}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
