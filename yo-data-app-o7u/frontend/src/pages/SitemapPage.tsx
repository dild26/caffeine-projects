import { useEffect } from 'react';
import { useGetNavigationPages, useGetSitemapPages } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Map } from 'lucide-react';

export default function SitemapPage() {
  const { data: navigationPages = [], isLoading: navLoading } = useGetNavigationPages();
  const { data: sitemapPages = [], isLoading: sitemapLoading } = useGetSitemapPages();
  const navigate = useNavigate();

  const isLoading = navLoading || sitemapLoading;

  useEffect(() => {
    document.title = 'Sitemap – YO-Data';
  }, []);

  const builtInPages = [
    { route: '/', title: 'Home', description: 'Welcome to YO-Data platform' },
    { route: '/dashboard', title: 'Dashboard', description: 'Manage your datasets and projects' },
    { route: '/explore', title: 'Explore', description: 'Browse archive collections' },
    { route: '/feature', title: 'Feature Progress', description: 'Track implementation status of all features' },
    { route: '/contact', title: 'Contact', description: 'Get in touch with SECOINFI' },
    { route: '/sitemap', title: 'Sitemap', description: 'Navigate all available pages' },
  ];

  const contentPages = sitemapPages
    .filter((page) => page.visibility)
    .map((page) => ({
      route: page.route,
      title: page.title,
      description: page.metadata || 'Content page',
    }));

  const customPages = navigationPages.map((page) => ({
    route: page.route,
    title: page.title,
    description: page.metadata || 'Custom page',
  }));

  const allPages = [...builtInPages, ...contentPages, ...customPages];

  const handleNavigate = (route: string) => {
    navigate({ to: route });
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mb-4 inline-block h-8 w-8 animate-spin text-primary" role="status" aria-label="Loading" />
            <p className="text-muted-foreground">Loading sitemap...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center">
          <Map className="h-12 w-12 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Sitemap</h1>
        <p className="text-lg text-muted-foreground">
          Navigate through all available pages on YO-Data platform
        </p>
      </div>

      {/* Pages Grid */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">All Pages</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allPages.map((page) => (
              <Card
                key={page.route}
                className="group cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleNavigate(page.route)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{page.title}</span>
                    <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {page.route}
                  </code>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Core Pages</CardTitle>
              <CardDescription>Essential platform pages</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {builtInPages.map((page) => (
                  <li key={page.route}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate(page.route)}
                    >
                      <span className="font-medium">{page.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{page.route}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {contentPages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Content Pages</CardTitle>
                <CardDescription>Markdown-based content pages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {contentPages.map((page) => (
                    <li key={page.route}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigate(page.route)}
                      >
                        <span className="font-medium">{page.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{page.route}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {customPages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Pages</CardTitle>
                <CardDescription>Additional pages created by admins</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {customPages.map((page) => (
                    <li key={page.route}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigate(page.route)}
                      >
                        <span className="font-medium">{page.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{page.route}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* SEO Information */}
        <div className="mt-12">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle>About This Sitemap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                This sitemap provides an overview of all available pages on the YO-Data platform.
                It includes core platform pages, markdown content pages, and custom pages created by administrators.
              </p>
              <p>
                The sitemap is automatically updated when new pages are added or removed through
                the admin navigation management interface.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
