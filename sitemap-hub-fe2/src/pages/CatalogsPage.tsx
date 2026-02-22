import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearchCatalogEntries } from '@/hooks/useQueries';
import { Search, Filter, ChevronDown, ChevronUp, List, Grid, FileText, FileJson, FileCode, Archive, Link as LinkIcon, Loader2, TrendingUp, Clock, Star, Eye } from 'lucide-react';

type ViewMode = 'list' | 'card';

export default function CatalogsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recency');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Advanced filters
  const [minSeoRank, setMinSeoRank] = useState<number>(0);
  const [minClickCount, setMinClickCount] = useState<number>(0);
  const [minPopularity, setMinPopularity] = useState<number>(0);
  const [minRelevance, setMinRelevance] = useState<number>(0);
  const [maxRecency, setMaxRecency] = useState<number>(365);
  const [minVisibility, setMinVisibility] = useState<number>(0);
  const [minBacklinks, setMinBacklinks] = useState<number>(0);
  const [maxPingResponse, setMaxPingResponse] = useState<number>(5000);
  const [maxLoadSpeed, setMaxLoadSpeed] = useState<number>(10000);
  const [maxBounceRate, setMaxBounceRate] = useState<number>(100);

  const pageSize = 20;

  const { mutate: searchCatalog, data: searchResults, isPending: isSearching } = useSearchCatalogEntries();

  React.useEffect(() => {
    const filter = {
      fileType: fileTypeFilter === 'all' ? undefined : fileTypeFilter,
      minSeoRank: minSeoRank > 0 ? BigInt(minSeoRank) : undefined,
      minClickCount: minClickCount > 0 ? BigInt(minClickCount) : undefined,
      minPopularity: minPopularity > 0 ? BigInt(minPopularity) : undefined,
      minRelevance: minRelevance > 0 ? BigInt(minRelevance) : undefined,
      maxRecency: maxRecency < 365 ? BigInt(maxRecency) : undefined,
      minVisibility: minVisibility > 0 ? BigInt(minVisibility) : undefined,
      minBacklinks: minBacklinks > 0 ? BigInt(minBacklinks) : undefined,
      maxPingResponse: maxPingResponse < 5000 ? BigInt(maxPingResponse) : undefined,
      maxLoadSpeed: maxLoadSpeed < 10000 ? BigInt(maxLoadSpeed) : undefined,
      maxBounceRate: maxBounceRate < 100 ? BigInt(maxBounceRate) : undefined,
    };

    searchCatalog({
      searchTerm,
      filter,
      sort: { sortBy: sortBy as any, sortOrder: sortOrder as any },
      page: BigInt(page),
      pageSize: BigInt(pageSize),
    });
  }, [searchTerm, fileTypeFilter, sortBy, sortOrder, page, minSeoRank, minClickCount, minPopularity, minRelevance, maxRecency, minVisibility, minBacklinks, maxPingResponse, maxLoadSpeed, maxBounceRate]);

  const entries = searchResults?.entries || [];
  const totalEntries = Number(searchResults?.totalEntries || 0);
  const totalPages = Math.ceil(totalEntries / pageSize);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'json': return <FileJson className="h-5 w-5 text-blue-500" />;
      case 'csv': return <FileText className="h-5 w-5 text-green-500" />;
      case 'md': return <FileCode className="h-5 w-5 text-purple-500" />;
      case 'zip': return <Archive className="h-5 w-5 text-orange-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const hasActiveFilters = fileTypeFilter !== 'all' || minSeoRank > 0 || minClickCount > 0 || minPopularity > 0 || minRelevance > 0 || maxRecency < 365 || minVisibility > 0 || minBacklinks > 0 || maxPingResponse < 5000 || maxLoadSpeed < 10000 || maxBounceRate < 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Catalog Browser
          </h1>
          <p className="text-muted-foreground">
            Search and explore uploaded data files with advanced filtering and sorting
          </p>
        </div>

        {/* Search and Controls */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, summary, or metadata..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  className="pl-10"
                />
              </div>
              <Button
                variant={filtersOpen ? "default" : "outline"}
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {[fileTypeFilter !== 'all', minSeoRank > 0, minClickCount > 0, minPopularity > 0, minRelevance > 0, maxRecency < 365, minVisibility > 0, minBacklinks > 0, maxPingResponse < 5000, maxLoadSpeed < 10000, maxBounceRate < 100].filter(Boolean).length}
                  </Badge>
                )}
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Advanced Filters */}
            <Collapsible open={filtersOpen}>
              <CollapsibleContent className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* File Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">File Type</label>
                    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="md">Markdown</SelectItem>
                        <SelectItem value="zip">ZIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SEO Rank */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min SEO Rank: {minSeoRank}</label>
                    <Slider
                      value={[minSeoRank]}
                      onValueChange={([value]) => setMinSeoRank(value)}
                      max={100}
                      step={1}
                    />
                  </div>

                  {/* Click Count */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Clicks: {minClickCount}</label>
                    <Slider
                      value={[minClickCount]}
                      onValueChange={([value]) => setMinClickCount(value)}
                      max={1000}
                      step={10}
                    />
                  </div>

                  {/* Popularity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Popularity: {minPopularity}</label>
                    <Slider
                      value={[minPopularity]}
                      onValueChange={([value]) => setMinPopularity(value)}
                      max={100}
                      step={1}
                    />
                  </div>

                  {/* Relevance */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Relevance: {minRelevance}</label>
                    <Slider
                      value={[minRelevance]}
                      onValueChange={([value]) => setMinRelevance(value)}
                      max={100}
                      step={1}
                    />
                  </div>

                  {/* Recency */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Age (days): {maxRecency}</label>
                    <Slider
                      value={[maxRecency]}
                      onValueChange={([value]) => setMaxRecency(value)}
                      max={365}
                      step={1}
                    />
                  </div>

                  {/* Visibility */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Visibility: {minVisibility}</label>
                    <Slider
                      value={[minVisibility]}
                      onValueChange={([value]) => setMinVisibility(value)}
                      max={100}
                      step={1}
                    />
                  </div>

                  {/* Backlinks */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Backlinks: {minBacklinks}</label>
                    <Slider
                      value={[minBacklinks]}
                      onValueChange={([value]) => setMinBacklinks(value)}
                      max={1000}
                      step={10}
                    />
                  </div>

                  {/* Ping Response */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Ping (ms): {maxPingResponse}</label>
                    <Slider
                      value={[maxPingResponse]}
                      onValueChange={([value]) => setMaxPingResponse(value)}
                      max={5000}
                      step={100}
                    />
                  </div>

                  {/* Load Speed */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Load Speed (ms): {maxLoadSpeed}</label>
                    <Slider
                      value={[maxLoadSpeed]}
                      onValueChange={([value]) => setMaxLoadSpeed(value)}
                      max={10000}
                      step={100}
                    />
                  </div>

                  {/* Bounce Rate */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Bounce Rate: {maxBounceRate}%</label>
                    <Slider
                      value={[maxBounceRate]}
                      onValueChange={([value]) => setMaxBounceRate(value)}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setFileTypeFilter('all');
                    setMinSeoRank(0);
                    setMinClickCount(0);
                    setMinPopularity(0);
                    setMinRelevance(0);
                    setMaxRecency(365);
                    setMinVisibility(0);
                    setMinBacklinks(0);
                    setMaxPingResponse(5000);
                    setMaxLoadSpeed(10000);
                    setMaxBounceRate(100);
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* View Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recency">Recency</SelectItem>
                    <SelectItem value="seoRank">SEO Rank</SelectItem>
                    <SelectItem value="clickCount">Click Count</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="visibility">Visibility</SelectItem>
                    <SelectItem value="backlinks">Backlinks</SelectItem>
                    <SelectItem value="pingResponse">Ping Response</SelectItem>
                    <SelectItem value="loadSpeed">Load Speed</SelectItem>
                    <SelectItem value="bounceRate">Bounce Rate</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <Alert>
            <AlertDescription>
              No catalog entries found. Try adjusting your search or filters.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {entries.length} of {totalEntries} results
              </p>
            </div>

            {viewMode === 'list' ? (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={Number(entry.id)} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getFileIcon(entry.fileType)}
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">{entry.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{entry.summary}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{entry.fileType.toUpperCase()}</Badge>
                          {entry.sourceUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">SEO:</span>
                          <span className="font-medium">{Number(entry.seoRank)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Clicks:</span>
                          <span className="font-medium">{Number(entry.clickCount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Popular:</span>
                          <span className="font-medium">{Number(entry.popularity)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">{Number(entry.recency)}d</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Links:</span>
                          <span className="font-medium">{Number(entry.backlinks)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Visible:</span>
                          <span className="font-medium">{Number(entry.visibility)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.map((entry) => (
                  <Card key={Number(entry.id)} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        {getFileIcon(entry.fileType)}
                        <Badge variant="secondary" className="text-xs">{entry.fileType.toUpperCase()}</Badge>
                      </div>
                      <CardTitle className="text-base line-clamp-2">{entry.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-xs">{entry.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          SEO: {Number(entry.seoRank)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          {Number(entry.clickCount)} clicks
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {Number(entry.popularity)}
                        </Badge>
                      </div>
                      {entry.sourceUrl && (
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            View Source
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                >
                  Last
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
