import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { useSearchSitemaps, useGetAllTlds, useGetSitemapCountByTld } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import LinkPreviewModal from '../components/LinkPreviewModal';
import PaginationControls from '../components/PaginationControls';
import { SubscriptionStatus } from '../backend';

export default function SearchPage() {
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [debouncedTerm1, setDebouncedTerm1] = useState('');
  const [debouncedTerm2, setDebouncedTerm2] = useState('');
  const [selectedTld, setSelectedTld] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: tlds = [] } = useGetAllTlds();
  const { data: tldCount } = useGetSitemapCountByTld(selectedTld === 'all' ? '' : selectedTld);

  const isAuthenticated = !!identity;
  const subscriptionStatus = userProfile?.subscriptionStatus || SubscriptionStatus.none;

  const getSearchLimit = () => {
    if (!isAuthenticated) return 10;
    switch (subscriptionStatus) {
      case SubscriptionStatus.basic:
        return 50;
      case SubscriptionStatus.pro:
        return 200;
      case SubscriptionStatus.enterprise:
        return 1000;
      case SubscriptionStatus.payAsYouUse:
        return 25;
      default:
        return 10;
    }
  };

  const searchLimit = getSearchLimit();
  const combinedTerm = [debouncedTerm1, debouncedTerm2].filter(Boolean).join(' ');
  const { data: results = [], isLoading } = useSearchSitemaps(combinedTerm, searchLimit);

  useEffect(() => {
    const timer1 = setTimeout(() => setDebouncedTerm1(searchTerm1), 500);
    return () => clearTimeout(timer1);
  }, [searchTerm1]);

  useEffect(() => {
    const timer2 = setTimeout(() => setDebouncedTerm2(searchTerm2), 500);
    return () => clearTimeout(timer2);
  }, [searchTerm2]);

  const filteredResults = selectedTld === 'all' ? results : results.filter((r) => r.tld === selectedTld);

  const pageSize = 20;
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const paginatedResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Search Sitemaps</h1>
          {!isAuthenticated && (
            <Link to="/subscription">
              <Button variant="outline" size="sm">
                Upgrade for More Results
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Advanced Search
            </CardTitle>
            <CardDescription>
              Search through millions of sitemap entries. {isAuthenticated ? `Limit: ${searchLimit} results` : 'Login for more results'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Term 1</label>
                <Input
                  placeholder="Enter first search term..."
                  value={searchTerm1}
                  onChange={(e) => setSearchTerm1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Term 2</label>
                <Input
                  placeholder="Enter second search term..."
                  value={searchTerm2}
                  onChange={(e) => setSearchTerm2(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by TLD
                </label>
                <Select value={selectedTld} onValueChange={setSelectedTld}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All TLDs</SelectItem>
                    {tlds.map((tld) => (
                      <SelectItem key={tld} value={tld}>
                        {tld}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTld !== 'all' && tldCount !== undefined && (
                <div className="pt-7">
                  <Badge variant="secondary">{Number(tldCount)} URLs</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Results {filteredResults.length > 0 && `(${filteredResults.length})`}
          </h2>
          {filteredResults.length >= searchLimit && (
            <Badge variant="outline">Showing first {searchLimit} results</Badge>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Searching...</div>
        ) : paginatedResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {combinedTerm ? 'No results found. Try different search terms.' : 'Enter search terms to begin.'}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4">
              {paginatedResults.map((result, idx) => (
                <Card key={idx} className="hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.tld}</Badge>
                          <Badge variant="secondary">{result.category}</Badge>
                        </div>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium break-all"
                        >
                          {result.url}
                        </a>
                        <p className="text-sm text-muted-foreground">{result.metadata}</p>
                        <p className="text-xs text-muted-foreground">
                          Added: {new Date(Number(result.createdAt) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewUrl(result.url)}
                        >
                          Preview
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <LinkPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  );
}
