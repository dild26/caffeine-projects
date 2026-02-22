import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetSitemap, useAddPage, useIsCallerAdmin } from '../hooks/useQueries';
import { useState } from 'react';
import { Plus, MapPin, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Sitemap() {
  const navigate = useNavigate();
  const { data: sitemap, isLoading } = useGetSitemap();
  const { data: isAdmin } = useIsCallerAdmin();
  const addPageMutation = useAddPage();

  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [newPagePriority, setNewPagePriority] = useState('5');

  const handleAddPage = async () => {
    if (!newPageSlug.trim() || !newPageTitle.trim()) {
      toast.error('Please provide both slug and title');
      return;
    }

    // Validate slug format (lowercase, alphanumeric, hyphens)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(newPageSlug)) {
      toast.error('Slug must be lowercase alphanumeric with hyphens only');
      return;
    }

    try {
      await addPageMutation.mutateAsync({
        slug: newPageSlug,
        title: newPageTitle,
        description: newPageDescription,
        priority: BigInt(parseInt(newPagePriority) || 5),
      });
      toast.success('Page added successfully');
      setNewPageSlug('');
      setNewPageTitle('');
      setNewPageDescription('');
      setNewPagePriority('5');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add page');
    }
  };

  const publicSections = [
    {
      title: 'Main Pages',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Blog', path: '/blog' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Information',
      links: [
        { label: 'Pros', path: '/pros' },
        { label: 'What We Do', path: '/what-we-do' },
        { label: 'Why Us', path: '/why-us' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Features', path: '/features' },
        { label: 'Referral', path: '/referral' },
      ],
    },
    {
      title: 'Legal & Trust',
      links: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Trust & Security', path: '/trust' },
        { label: 'Sitemap', path: '/sitemap' },
      ],
    },
  ];

  const protectedSections = [
    {
      title: 'Protected Pages',
      description: 'Requires authentication',
      links: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Subscribers', path: '/subscribers' },
        { label: 'Admin Panel', path: '/admin' },
      ],
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Navigate through all pages of our platform
        </p>
      </div>

      {/* Admin Page Management - Only visible to admins */}
      {isAdmin && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Admin: Add New Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Page Slug *</Label>
                <Input
                  id="slug"
                  placeholder="my-new-page"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value.toLowerCase())}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lowercase, alphanumeric, hyphens only
                </p>
              </div>
              <div>
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  placeholder="My New Page"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the page"
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  value={newPagePriority}
                  onChange={(e) => setNewPagePriority(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleAddPage}
              disabled={addPageMutation.isPending}
              className="mt-4"
            >
              {addPageMutation.isPending ? (
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
          </CardContent>
        </Card>
      )}

      {/* Public Pages */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Public Pages</h2>
        <p className="text-muted-foreground mb-6">
          These pages are accessible to everyone without authentication
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {publicSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => navigate({ to: link.path })}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Protected Pages */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Protected Pages</h2>
        <p className="text-muted-foreground mb-6">
          These pages require authentication and specific roles
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {protectedSections.map((section, index) => (
            <Card key={index} className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => navigate({ to: link.path })}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <Lock className="h-3 w-3" />
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin-Defined Pages - Visible to all, but only admins can add */}
      {!isLoading && sitemap && sitemap.adminPages.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Admin-Defined Pages</CardTitle>
            <p className="text-sm text-muted-foreground">
              Custom pages added by administrators
            </p>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sitemap.adminPages.map((page, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate({ to: `/${page.slug}` })}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {page.title}
                  </button>
                  {page.description && (
                    <p className="text-xs text-muted-foreground ml-6">{page.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* App-Controlled Routes - Visible to all */}
      {!isLoading && sitemap && sitemap.appRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>App-Controlled Routes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Special routes managed by whitelisted applications
            </p>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sitemap.appRoutes.map((route, index) => (
                <li key={index}>
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {route}
                  </span>
                  <p className="text-xs text-muted-foreground ml-6">
                    Controlled by whitelisted apps
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
