import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, AlertCircle, Layers } from 'lucide-react';
import { useGetComparePages } from '../hooks/usePages';
import { validateUrl } from '../lib/urlValidator';

export default function ComparePage() {
  // Fetch compare pages with appended Secoinfi-Apps registry
  const { data: comparePages = [], isLoading, error } = useGetComparePages();
  
  // Separate original pages (no rank) from appended Secoinfi apps (with rank)
  const originalPages = comparePages.filter(page => page.rank === null && validateUrl(page.url));
  const secoinfiApps = comparePages.filter(page => page.rank !== null && validateUrl(page.url));

  if (isLoading) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading comparison pages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('[ComparePage] Error loading compare pages:', error);
  }

  return (
    <div className="space-y-6">
      {/* Original Comparison Pages */}
      {originalPages.length > 0 && (
        <Card className="card-3d border-4 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Comparison Pages
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Predefined comparison content for the platform
                </CardDescription>
              </div>
              <Badge variant="default" className="neon-glow text-lg px-4 py-2">
                {originalPages.length} Pages
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {originalPages.map((page) => (
                <Card key={`${page.name}-${page.url}`} className="card-3d-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg">
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent transition-colors hover:underline flex items-center gap-1"
                          >
                            {page.name}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {page.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Page URL:</span>
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-accent transition-colors hover:underline flex items-center gap-1 break-all"
                      >
                        {page.url}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    {page.topApp && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Top App:</span>
                        {page.topAppUrl ? (
                          <a
                            href={page.topAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:text-accent transition-colors hover:underline flex items-center gap-1 break-all"
                          >
                            {page.topApp}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">{page.topApp}</span>
                        )}
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full neon-glow mt-3"
                      asChild
                    >
                      <a href={page.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Page
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appended Secoinfi Apps */}
      {secoinfiApps.length > 0 && (
        <Card className="card-3d border-4 border-accent/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Layers className="w-6 h-6 text-accent" />
                  SECOINFI Applications
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  All 26+ SECOINFI apps from the canonical registry
                </CardDescription>
              </div>
              <Badge variant="secondary" className="neon-glow text-lg px-4 py-2">
                {secoinfiApps.length} Apps
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {secoinfiApps.map((app) => (
                <Card key={`${app.name}-${app.url}`} className="card-3d-hover border-2 border-accent/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-primary transition-colors hover:underline flex items-center gap-1"
                          >
                            {app.name}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            Rank #{app.rank}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {app.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">App URL:</span>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:text-primary transition-colors hover:underline flex items-center gap-1 break-all"
                      >
                        {app.url}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a href={app.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit App
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {originalPages.length === 0 && secoinfiApps.length === 0 && (
        <Card className="card-3d">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
              <p className="text-muted-foreground text-lg">
                No comparison pages available
              </p>
              <p className="text-sm text-muted-foreground">
                Visit the Sites tab to see all 26 SECOINFI applications
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
