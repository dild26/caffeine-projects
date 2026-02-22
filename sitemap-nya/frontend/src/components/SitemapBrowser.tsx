import { useState, useMemo } from 'react';
import { useGetCallerSubscription, useGetSitemapsByTier } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, Globe, Calendar } from 'lucide-react';
import { SubscriptionTier } from '../backend';
import { toast } from 'sonner';

export default function SitemapBrowser() {
  const { data: subscription } = useGetCallerSubscription();
  const { data: sitemaps, isLoading } = useGetSitemapsByTier(
    subscription?.tier || SubscriptionTier.basic
  );
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSitemaps = useMemo(() => {
    if (!sitemaps) return [];
    return sitemaps.filter(sitemap =>
      sitemap.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sitemaps, searchTerm]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = ['Domain', 'Last Updated', 'Data Size'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.domain,
        formatDate(item.lastUpdated),
        item.jsonData.length
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('JSON exported successfully');
  };

  if (!subscription || !subscription.active) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
          <p className="text-muted-foreground">
            Subscribe to a plan to access sitemap data from millions of domains.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Sitemap Browser</span>
          </CardTitle>
          <Badge className="bg-primary/10 text-primary">
            {subscription.tier.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(filteredSitemaps, 'sitemaps.csv')}
            disabled={!filteredSitemaps.length}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToJSON(filteredSitemaps, 'sitemaps.json')}
            disabled={!filteredSitemaps.length}
          >
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredSitemaps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No domains found matching your search.' : 'No sitemap data available.'}
                </div>
              ) : (
                filteredSitemaps.map((sitemap, index) => (
                  <Card key={index} className="border-border/30 bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{sitemap.domain}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Updated: {formatDate(sitemap.lastUpdated)}</span>
                            </span>
                            <span>Size: {(sitemap.jsonData.length / 1024).toFixed(1)}KB</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([sitemap.jsonData], { type: 'application/json' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${sitemap.domain}-sitemap.json`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                            toast.success('Sitemap downloaded');
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Showing {filteredSitemaps.length} of {sitemaps?.length || 0} available domains
        </div>
      </CardContent>
    </Card>
  );
}
