import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Map, ExternalLink, Info } from 'lucide-react';
import { useGetPages } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export default function SitemapPage() {
  const { data: pages, isLoading, error } = useGetPages();

  // Group pages by category (simple alphabetical grouping)
  const groupedPages = pages?.reduce((acc, page) => {
    const firstLetter = page[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(page);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="gradient-bg p-8 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Map className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Sitemap</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse all available pages in the application. This sitemap combines auto-generated 
          and manually managed pages.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load sitemap: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This sitemap includes {pages?.length || 0} pages. Protected routes (broadcast, remote, live) 
          are managed through Secoinfi-Apps integration.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>
            Complete list of application pages organized alphabetically
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-8 w-32" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : groupedPages && Object.keys(groupedPages).length > 0 ? (
            <div className="space-y-6">
              {Object.keys(groupedPages).sort().map((letter) => (
                <div key={letter}>
                  <h3 className="text-lg font-semibold mb-3 text-primary">{letter}</h3>
                  <div className="flex flex-wrap gap-2">
                    {groupedPages[letter].sort().map((page) => (
                      <Badge 
                        key={page} 
                        variant="outline" 
                        className="text-sm px-3 py-1.5 hover:bg-secondary cursor-pointer transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        /{page}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No pages found in sitemap</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Sitemap</CardTitle>
          <CardDescription>
            Administrators can add new pages to the sitemap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin">
            <Button variant="outline">
              Go to Admin Panel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
