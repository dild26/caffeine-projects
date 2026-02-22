import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Calendar, Globe } from 'lucide-react';
import { useGetSitemaps } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Sitemap } from '../backend';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSitemap, setSelectedSitemap] = useState<Sitemap | null>(null);
  const { data: sitemaps, isLoading } = useGetSitemaps();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const filteredSitemaps = sitemaps?.filter(sitemap => 
    sitemap.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sitemap.url.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Search Sitemaps</h1>
          <p className="text-muted-foreground">
            Discover and explore website sitemaps from across the web
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by domain or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredSitemaps.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No sitemaps found matching your search' : 'No sitemaps available yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSitemaps.map((sitemap) => (
              <Card key={sitemap.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        {sitemap.domain}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {sitemap.url}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">.{sitemap.tld}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      {Number(sitemap.urlCount)} URLs
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Added {formatDate(sitemap.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSitemap(sitemap)}
                    >
                      View Details
                    </Button>
                    {isAuthenticated ? (
                      <Button 
                        size="sm"
                        onClick={() => window.open(sitemap.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open Sitemap
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        Login to Access
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedSitemap} onOpenChange={() => setSelectedSitemap(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sitemap Details</DialogTitle>
          </DialogHeader>
          {selectedSitemap && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Domain</h3>
                <p className="text-muted-foreground">{selectedSitemap.domain}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">URL</h3>
                <p className="text-muted-foreground break-all">{selectedSitemap.url}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">TLD</h3>
                  <Badge>.{selectedSitemap.tld}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">URL Count</h3>
                  <p className="text-muted-foreground">{Number(selectedSitemap.urlCount)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Created</h3>
                  <p className="text-muted-foreground">{formatDate(selectedSitemap.createdAt)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Last Updated</h3>
                  <p className="text-muted-foreground">{formatDate(selectedSitemap.lastUpdated)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
