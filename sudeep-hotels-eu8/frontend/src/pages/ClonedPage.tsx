import { useParams } from '@tanstack/react-router';
import { useGetClonedPage } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Clock, AlertCircle, Globe, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function ClonedPage() {
  const { pageId } = useParams({ from: '/pages/$pageId' });
  const { data: page, isLoading, error } = useGetClonedPage(pageId);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes('map-56b')) return 'Map Application';
      if (hostname.includes('etutorial-lgc')) return 'eTutorial Platform';
      return hostname;
    } catch {
      return 'External Source';
    }
  };

  const getSourceBadgeVariant = (url: string) => {
    if (url.includes('map-56b')) return 'default';
    if (url.includes('etutorial-lgc')) return 'secondary';
    return 'outline';
  };

  const getSourceShortName = (url: string) => {
    if (url.includes('map-56b')) return 'Map';
    if (url.includes('etutorial-lgc')) return 'eTutorial';
    return 'Other';
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading page: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                Page not found. This cloned page may not exist or has not been synced yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  let metadata: any = {};
  try {
    metadata = JSON.parse(page.metadata);
  } catch (e) {
    metadata = { title: page.id, description: page.metadata };
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-bold capitalize bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {metadata.title || page.id.replace(/-/g, ' ')}
            </h1>
            <Badge variant={getSourceBadgeVariant(page.url)} className="gap-1.5 px-3 py-1">
              <Globe className="h-3.5 w-3.5" />
              {getSourceShortName(page.url)}
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-primary transition-colors"
              >
                {page.url}
              </a>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Last synced: {formatTimestamp(page.lastSynced)}</span>
            </div>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Synchronized Content
                </CardTitle>
                <CardDescription className="mt-2">
                  Content synchronized from {getSourceName(page.url)}
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1.5">
                <Clock className="h-3 w-3" />
                Synced
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className="prose prose-sm dark:prose-invert rainbow:prose-invert max-w-none 
                prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary 
                prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted
                prose-li:text-foreground prose-blockquote:text-foreground"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </CardContent>
        </Card>

        {(metadata.description || (metadata.keywords && Array.isArray(metadata.keywords))) && (
          <Card>
            <CardHeader>
              <CardTitle>Page Metadata</CardTitle>
              <CardDescription>Additional information about this page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metadata.description && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{metadata.description}</p>
                  </div>
                )}
                {metadata.keywords && Array.isArray(metadata.keywords) && metadata.keywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {metadata.keywords.map((keyword: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Synchronization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Source</p>
                <p className="font-medium">{getSourceName(page.url)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Page ID</p>
                <p className="font-medium font-mono">{page.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">{formatTimestamp(page.lastSynced)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
