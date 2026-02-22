import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle, TrendingUp, Layers, Search } from 'lucide-react';
import { useGetAppManagementPages } from '../hooks/usePages';
import { validateUrl } from '../lib/urlValidator';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

export default function AppsManagement() {
  // Fetch app management pages with appended Secoinfi-Apps registry
  const { data: appPages = [], isLoading, error } = useGetAppManagementPages();
  
  // Separate original pages (no rank) from appended Secoinfi apps (with rank)
  const originalPages = appPages.filter(page => page.rank === null && validateUrl(page.url));
  const secoInfiApps = appPages.filter(page => page.rank !== null && validateUrl(page.url));

  // Merge both arrays into allApps for unified discovery operations
  const allApps = [...originalPages, ...secoInfiApps];

  // Discovery state
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const [discoveredCount, setDiscoveredCount] = useState(0);

  // Handle discovery for all apps
  const handleDiscoverAll = async () => {
    setIsDiscovering(true);
    setDiscoveryProgress(0);
    setDiscoveredCount(0);

    // Simulate sequential discovery across all apps
    for (let i = 0; i < allApps.length; i++) {
      // Simulate discovery delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setDiscoveredCount(i + 1);
      setDiscoveryProgress(((i + 1) / allApps.length) * 100);
    }

    setIsDiscovering(false);
  };

  if (isLoading) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading app management pages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('[AppsManagement] Error loading app management pages:', error);
  }

  return (
    <div className="space-y-6">
      {/* Discovery Control Panel */}
      {allApps.length > 0 && (
        <Card className="card-3d border-4 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Search className="w-6 h-6 text-primary" />
                  App Discovery
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Discover and validate all {allApps.length} apps (Original + SECOINFI)
                </CardDescription>
              </div>
              <Badge variant="default" className="neon-glow text-lg px-4 py-2">
                {allApps.length} Total Apps
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleDiscoverAll}
                disabled={isDiscovering}
                className="neon-glow"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                {isDiscovering ? `Discovering... (${discoveredCount}/${allApps.length})` : `Discover All ${allApps.length} Apps`}
              </Button>
              {isDiscovering && (
                <div className="flex-1 space-y-2">
                  <Progress value={discoveryProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Progress: {discoveredCount} of {allApps.length} apps ({Math.round(discoveryProgress)}%)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Original App Management Pages */}
      {originalPages.length > 0 && (
        <Card className="card-3d border-4 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  App Management Pages
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Predefined app management content for the platform
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
      {secoInfiApps.length > 0 && (
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
                {secoInfiApps.length} Apps
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {secoInfiApps.map((app) => (
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

      {allApps.length === 0 && (
        <Card className="card-3d">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
              <p className="text-muted-foreground text-lg">
                No app management pages available
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
