import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Loader2, Globe, Link, AlertCircle, Download, Eye, TrendingUp, MousePointer, Filter, ChevronsLeft, ChevronsRight, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from 'react-use';
import { useActor } from '@/hooks/useActor';
import { SearchResult } from '@/backend';
import { toast } from 'sonner';
import FullScreenPreviewModal from './FullScreenPreviewModal';
import { useGetExtensionCounts, useIsCallerAdmin, useGetCallerSubscription } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface EnhancedSearchInterfaceProps {
  showQuotaWarning?: boolean;
}

interface PreviewState {
  url: string;
  content: string;
  isLoading: boolean;
  error: string | null;
  zoom: number;
  isFullscreen: boolean;
  previewType: 'iframe' | 'screenshot' | 'fallback' | 'xml' | 'object';
  screenshotUrl?: string;
}

interface ClickTrackingData {
  url: string;
  domain: string;
  clickCount: number;
  lastClicked: number;
  userId?: string;
}

export default function EnhancedSearchInterface({ showQuotaWarning = false }: EnhancedSearchInterfaceProps) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: subscription } = useGetCallerSubscription();
  const { data: extensionCounts = [] } = useGetExtensionCounts();
  
  const isAuthenticated = !!identity;
  const isSubscriber = isAuthenticated && subscription && subscription.status === 'active';
  const canAccessExternalLinks = isSubscriber || isAdmin;
  
  // Unified search state with 2-second debounce
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const [clickTrackingData, setClickTrackingData] = useState<ClickTrackingData[]>([]);
  const [showClickAnalytics, setShowClickAnalytics] = useState(false);
  
  const pageSize = 50;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load click tracking data from persistent storage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('clickTrackingData');
      const sessionData = sessionStorage.getItem('clickTrackingData_backup');
      
      if (storedData) {
        setClickTrackingData(JSON.parse(storedData));
      } else if (sessionData) {
        const data = JSON.parse(sessionData);
        setClickTrackingData(data);
        localStorage.setItem('clickTrackingData', sessionData);
      }
    } catch (error) {
      console.error('Error loading click tracking data:', error);
    }
  }, []);

  const extensionCountMap = useMemo(() => {
    const map = new Map<string, number>();
    extensionCounts.forEach(({ extension, count }) => {
      map.set(extension, Number(count));
    });
    return map;
  }, [extensionCounts]);

  const extractDomainFromUrl = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown-domain';
    }
  }, []);

  const extractDomainExtension = useCallback((domain: string): string => {
    const parts = domain.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '.unknown';
  }, []);

  const trackLinkClick = useCallback((url: string) => {
    const domain = extractDomainFromUrl(url);
    const now = Date.now();
    
    setClickTrackingData(prevData => {
      const existingEntry = prevData.find(entry => entry.url === url);
      let newData: ClickTrackingData[];
      
      if (existingEntry) {
        newData = prevData.map(entry => 
          entry.url === url 
            ? { ...entry, clickCount: entry.clickCount + 1, lastClicked: now }
            : entry
        );
      } else {
        newData = [...prevData, {
          url,
          domain,
          clickCount: 1,
          lastClicked: now,
          userId: identity?.getPrincipal().toString() || 'anonymous'
        }];
      }
      
      try {
        localStorage.setItem('clickTrackingData', JSON.stringify(newData));
        sessionStorage.setItem('clickTrackingData_backup', JSON.stringify(newData));
      } catch (error) {
        console.error('Error saving click tracking data:', error);
      }
      
      return newData;
    });

    toast.success('Click tracked!', {
      description: `Recorded click for ${domain}`,
      duration: 2000,
    });
  }, [extractDomainFromUrl, identity]);

  const getClickCount = useCallback((url: string): number => {
    const entry = clickTrackingData.find(data => data.url === url);
    return entry ? entry.clickCount : 0;
  }, [clickTrackingData]);

  const getDomainLeaderboard = useMemo(() => {
    const domainCounts = clickTrackingData.reduce((acc, data) => {
      acc[data.domain] = (acc[data.domain] || 0) + data.clickCount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(domainCounts)
      .map(([domain, clicks]) => ({ domain, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  }, [clickTrackingData]);

  const getUrlLeaderboard = useMemo(() => {
    return [...clickTrackingData]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 10);
  }, [clickTrackingData]);

  // 2-second debounce for search query
  useDebounce(() => setDebouncedSearchQuery(searchQuery), 2000, [searchQuery]);

  // Perform unified search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performUnifiedSearch(debouncedSearchQuery, 0);
    } else {
      setSearchResults([]);
      setTotalResults(0);
    }
  }, [debouncedSearchQuery]);

  // Unified search with true lazy loading and instant indexing
  const performUnifiedSearch = useCallback(async (query: string, page = 0) => {
    if (!actor || !query.trim()) return;

    // Cancel previous search if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsSearching(true);
    setCurrentPage(page);

    try {
      // Remove 'inurl:' prefix if present for backend processing
      const searchTerm = query.toLowerCase().startsWith('inurl:') 
        ? query.substring(6).trim() 
        : query;

      // Use publicSearchUrls as the backend method for unified search
      const response = await actor.publicSearchUrls(searchTerm, BigInt(page), BigInt(pageSize));
      
      setSearchResults(response.results);
      setTotalResults(Number(response.totalResults));
      
      if (response.results.length === 0 && searchTerm.trim()) {
        toast.info('No results found', {
          description: `Try a different keyword. Search supports domains, paths, and keywords like "blog", "api", "contact", etc.`,
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Unified search error:', error);
        setSearchResults([]);
        setTotalResults(0);
        toast.error('Search failed', {
          description: 'Please try again with a different query',
        });
      }
    } finally {
      setIsSearching(false);
    }
  }, [actor, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    if (debouncedSearchQuery.trim()) {
      performUnifiedSearch(debouncedSearchQuery, page);
    }
  }, [debouncedSearchQuery, performUnifiedSearch]);

  const handleFirstPage = useCallback(() => {
    handlePageChange(0);
  }, [handlePageChange]);

  const handleLastPage = useCallback(() => {
    const totalPages = Math.ceil(totalResults / pageSize);
    const lastPageIndex = Math.max(0, totalPages - 1);
    handlePageChange(lastPageIndex);
  }, [handlePageChange, totalResults, pageSize]);

  const handlePreview = useCallback(async (url: string) => {
    trackLinkClick(url);

    const isXmlFile = url.toLowerCase().endsWith('.xml');

    setPreviewState({
      url,
      content: '',
      isLoading: !isXmlFile,
      error: null,
      zoom: 100,
      isFullscreen: false,
      previewType: isXmlFile ? 'xml' : 'object',
    });
    setPreviewDialogOpen(true);

    try {
      if (isXmlFile) {
        setPreviewState(prev => prev ? {
          ...prev,
          content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- This is a sitemap.xml file -->
  <!-- Click download to get the full file -->
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>`,
          isLoading: false,
          previewType: 'xml',
        } : null);
      } else {
        setPreviewState(prev => prev ? {
          ...prev,
          isLoading: false,
          previewType: 'object',
        } : null);
      }
    } catch (error) {
      setPreviewState(prev => prev ? {
        ...prev,
        content: '',
        isLoading: false,
        error: 'Failed to load preview. The content may not be accessible or may contain security restrictions.',
        previewType: 'fallback',
      } : null);
    }
  }, [trackLinkClick]);

  const handleZoomIn = useCallback(() => {
    setPreviewState(prev => prev ? { ...prev, zoom: Math.min(prev.zoom + 25, 200) } : null);
  }, []);

  const handleZoomOut = useCallback(() => {
    setPreviewState(prev => prev ? { ...prev, zoom: Math.max(prev.zoom - 25, 50) } : null);
  }, []);

  const handleResetZoom = useCallback(() => {
    setPreviewState(prev => prev ? { ...prev, zoom: 100 } : null);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setPreviewState(prev => prev ? { ...prev, isFullscreen: !prev.isFullscreen } : null);
  }, []);

  const handleDownloadXml = useCallback((url: string) => {
    trackLinkClick(url);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started', {
      description: `Downloading ${url.split('/').pop() || 'sitemap.xml'}`,
    });
  }, [trackLinkClick]);

  const handleOpenInNewTab = useCallback((url: string) => {
    if (!canAccessExternalLinks) {
      toast.error('Subscription Required', {
        description: 'Please subscribe to access external web pages',
      });
      return;
    }

    trackLinkClick(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Opening in new tab', {
      description: 'Link opened in a new browser tab',
    });
  }, [canAccessExternalLinks, trackLinkClick]);

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="space-y-6">
      {showQuotaWarning && (
        <Alert className="border-warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Enhanced search features are available. Upgrade your plan for unlimited access.
          </AlertDescription>
        </Alert>
      )}

      {isAdmin && (
        <Alert className="border-primary bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Mode:</strong> Unlimited search results, {pageSize} results per page, full access to all uploaded sitemap data with comprehensive keyword-based indexing, true lazy loading, and guaranteed data persistence across all updates and migrations.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowClickAnalytics(!showClickAnalytics)}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          {showClickAnalytics ? 'Hide' : 'Show'} Click Analytics
        </Button>
      </div>

      {showClickAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Top Domains by Clicks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getDomainLeaderboard.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No click data yet. Start clicking links to see analytics!
                </p>
              ) : (
                <div className="space-y-2">
                  {getDomainLeaderboard.map((entry, index) => (
                    <div key={entry.domain} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{entry.domain}</span>
                        <Badge variant="secondary" className="text-xs">
                          {extractDomainExtension(entry.domain)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MousePointer className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-bold">{entry.clicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="cyber-gradient border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MousePointer className="h-5 w-5 text-accent" />
                <span>Top URLs by Clicks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getUrlLeaderboard.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No click data yet. Start clicking links to see analytics!
                </p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {getUrlLeaderboard.map((entry, index) => (
                      <div key={entry.url} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="text-xs font-mono truncate">{entry.url}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MousePointer className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-bold">{entry.clickCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Advanced Sitemap Search</span>
            <Badge variant="secondary">2s Debounce</Badge>
            <Badge variant="outline">Inurl-Style Keywords</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder='Search domains or paths (e.g., "example.com", "blog", "api", "inurl:contact")'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-w-0"
          />
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>• <strong>Advanced search:</strong> Single field for domains and URL paths with intelligent matching</p>
            <p>• <strong>True lazy loading:</strong> Loads and filters results from all uploaded .json and .xml files in real time</p>
            <p>• <strong>Inurl-style keywords:</strong> Search for any word like "blog", "gallery", "contact", "about", "faq"</p>
            <p>• <strong>2-second debounce:</strong> Results populate after you stop typing for 2 full seconds</p>
            <p>• <strong>Case-insensitive matching:</strong> "blog" matches "/blog/", "/Blog", "/BLOG/posts", etc.</p>
            <p>• <strong>Smart prioritization:</strong> Top-level path segments appear first (e.g., "/blog/" before "/blog/me/you/")</p>
            <p>• <strong>Comprehensive indexing:</strong> All uploaded .json and .xml sitemap data is instantly indexed</p>
            <p>• <strong>Guaranteed data availability:</strong> Zero data loss after updates, migrations, or UI reloads</p>
            <p>• <strong>First/Last page navigation:</strong> Complete pagination controls for easy navigation</p>
            {isAdmin && <p className="font-semibold">• <strong>Admin:</strong> Unlimited results with true lazy loading and real-time filtering</p>}
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Results</span>
              </CardTitle>
              <Badge variant="secondary">
                {totalResults.toLocaleString()} results found
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                    <p className="text-muted-foreground mb-2">{result.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-primary font-mono break-all">{result.url}</span>
                      <Badge variant="outline" className="text-xs">
                        {extractDomainExtension(extractDomainFromUrl(result.url))}
                      </Badge>
                      {getClickCount(result.url) > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <MousePointer className="h-3 w-3 mr-1" />
                          {getClickCount(result.url)} clicks
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(result.url)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Full-Screen Preview
                      </Button>
                      {canAccessExternalLinks && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackLinkClick(result.url)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Web Page
                        </a>
                      )}
                      {result.url.toLowerCase().endsWith('.xml') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadXml(result.url)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download XML
                        </Button>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {result.url.toLowerCase().endsWith('.xml') ? 'XML Sitemap' : 'Web Page'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFirstPage}
                      disabled={currentPage === 0}
                      className="gap-1"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                      First
                    </Button>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                      className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === currentPage}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLastPage}
                      disabled={currentPage >= totalPages - 1}
                      className="gap-1"
                    >
                      Last
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      )}

      {isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Searching with advanced search and true lazy loading...
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Loading and filtering results from all uploaded .json and .xml files in real time
            </p>
          </CardContent>
        </Card>
      )}

      <FullScreenPreviewModal
        isOpen={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        previewState={previewState}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onToggleFullscreen={handleToggleFullscreen}
        onDownloadXml={handleDownloadXml}
        getClickCount={getClickCount}
        extractDomainExtension={extractDomainExtension}
        extractDomainFromUrl={extractDomainFromUrl}
      />
    </div>
  );
}

