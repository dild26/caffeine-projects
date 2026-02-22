import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useGetAllSecoinfiApps } from '../hooks/useQueries';
import { Loader2, ExternalLink, Home, FileText, Award, Grid3x3 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export default function SitemapPage() {
  const { data: apps = [], isLoading } = useGetAllSecoinfiApps();
  const navigate = useNavigate();

  const appCount = apps.length;

  const publicPages = [
    { name: 'Home', path: '/', icon: Home, description: 'Platform overview and features' },
    { name: 'Blog', path: '/blog', icon: FileText, description: 'Updates, guides, and insights' },
    { name: 'Pros', path: '/pros', icon: Award, description: 'Platform advantages and benefits' },
    { 
      name: appCount > 0 ? `${appCount}${appCount >= 26 ? '+' : ''} Secoinfi-Apps` : 'Secoinfi-Apps', 
      path: '/apps', 
      icon: Grid3x3, 
      description: `Integrated applications${appCount > 0 ? ` (${appCount} available)` : ''}` 
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Sitemap</h1>
        <p className="text-lg text-muted-foreground">
          Complete overview of all pages and applications in Multi-Apps-Unify
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Public Pages Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Public Pages</h2>
            <Badge variant="outline">{publicPages.length} Pages</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {publicPages.map((page) => {
              const Icon = page.icon;
              return (
                <Card key={page.path} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{page.name}</CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ to: page.path })}
                      className="w-full"
                    >
                      Visit Page
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Secoinfi-Apps Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Secoinfi-Apps</h2>
            {!isLoading && appCount > 0 && (
              <Badge variant="secondary">
                {appCount} {appCount === 1 ? 'App' : 'Apps'}
              </Badge>
            )}
          </div>
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading applications from spec.yaml...</p>
              </div>
            </div>
          ) : apps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Grid3x3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 text-lg font-semibold">No applications available</p>
                <p className="text-sm text-muted-foreground">
                  Applications will appear here once they are added to spec.yaml.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                All {appCount} {appCount === 1 ? 'application is' : 'applications are'} listed below and accessible from the Apps page.
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {apps.map((app, index) => (
                  <Card key={index} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="mb-2 flex items-start justify-between">
                        <Badge variant="default" className="text-xs">
                          App
                        </Badge>
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-primary"
                            title={`Visit ${app.name}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {app.description}
                      </CardDescription>
                    </CardHeader>
                    {app.url && (
                      <CardContent>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Visit
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            This sitemap is dynamically generated from spec.yaml and updates in real-time.
            {appCount > 0 && ` Currently tracking ${appCount} ${appCount === 1 ? 'application' : 'applications'}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
