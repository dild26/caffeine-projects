import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Layers, TrendingUp, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useGetOverviewPages } from '../hooks/usePages';
import { validateUrl } from '../lib/urlValidator';

export default function SitesOverview() {
  // Fetch overview pages with appended Secoinfi-Apps registry
  const { data: overviewPages = [], isLoading, error } = useGetOverviewPages();
  
  // Separate original pages (no rank) from appended Secoinfi apps (with rank)
  const originalPages = overviewPages.filter(page => page.rank === null && validateUrl(page.url));
  const secoinfiApps = overviewPages.filter(page => page.rank !== null && validateUrl(page.url));

  if (isLoading) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading overview pages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('[SitesOverview] Error loading overview pages:', error);
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with 3D Artwork - Images scaled to 50% */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-3d card-3d-hover border-4 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gradient">Modular Architecture</CardTitle>
            <CardDescription className="text-base">
              Unified platform with 26+ interconnected sites, each leveraging insights from global domain leaders
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <img
              src="/assets/generated/modular-architecture-3d.dim_1024x768.png"
              alt="Modular Architecture"
              className="rounded-lg shadow-lg"
              style={{ 
                width: '50%', 
                height: 'auto',
                maxWidth: '512px'
              }}
              loading="lazy"
            />
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover border-4 border-accent/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gradient-secondary">Billion-User Scalability</CardTitle>
            <CardDescription className="text-base">
              Built for massive scale with advanced caching, CDN integration, and horizontal scaling capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <img
              src="/assets/generated/scalability-visualization-3d.dim_800x600.png"
              alt="Scalability"
              className="rounded-lg shadow-lg"
              style={{ 
                width: '50%', 
                height: 'auto',
                maxWidth: '400px'
              }}
              loading="lazy"
            />
          </CardContent>
        </Card>
      </div>

      {/* Platform Capabilities */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unified Features</CardTitle>
            <Zap className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">130+</div>
            <p className="text-xs text-muted-foreground mt-1">Total features across all sites</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domain References</CardTitle>
            <ExternalLink className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">26</div>
            <p className="text-xs text-muted-foreground mt-1">Global platforms analyzed</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
            <Layers className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{secoinfiApps.length}</div>
            <p className="text-xs text-muted-foreground mt-1">SECOINFI applications</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overview Pages</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{originalPages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Predefined overview content</p>
          </CardContent>
        </Card>
      </div>

      {/* Original Overview Pages */}
      {originalPages.length > 0 && (
        <Card className="card-3d border-4 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Overview Pages
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Predefined overview content for the platform
                </CardDescription>
              </div>
              <Badge variant="default" className="neon-glow text-lg px-4 py-2">
                {originalPages.length} Pages
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {originalPages.map((page) => (
                <Card key={`${page.name}-${page.url}`} className="card-3d-hover border-2 border-primary/20">
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
                    <Button
                      size="sm"
                      className="w-full neon-glow"
                      onClick={() => window.open(page.url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Page
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
                      onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit App
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
                No overview pages available
              </p>
              <p className="text-sm text-muted-foreground">
                Visit the Sites tab to see all 26 SECOINFI applications
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Exploration Notice */}
      <Card className="card-3d border-4 border-accent/30">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gradient">Legal Exploration of 26 Global Domains</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              This platform represents a comprehensive legal exploration and analysis of the top 26 global domain leaders,
              extracting best practices, features, and architectural patterns to build a unified, scalable platform
              capable of serving billions of users.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
