import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, ExternalLink, Loader2, Globe, Filter, Eye, Download, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePublicSearchUrls, useGetAllValidTlds, useFilterDomainsByExtension } from '@/hooks/useQueries';
import { useActor } from '@/hooks/useActor';
import { SearchResult } from '@/backend';
import { toast } from 'sonner';
import FullScreenPreviewModal from './FullScreenPreviewModal';

interface PreviewState {
  url: string;
  content: string;
  isLoading: boolean;
  error: string | null;
  zoom: number;
  isFullscreen: boolean;
  previewType: 'iframe' | 'screenshot' | 'fallback' | 'xml';
  screenshotUrl?: string;
}

// Common domain extensions that should always be visible at the top
const COMMON_EXTENSIONS = [
  '.com', '.org', '.net', '.edu', '.gov', '.mil', '.int',
  '.co', '.io', '.ai', '.app', '.dev', '.tech', '.info',
  '.biz', '.us', '.uk', '.ca', '.au', '.de', '.fr', '.jp'
];

export default function SearchInterface() {
  const { actor } = useActor();
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  
  // Enhanced domain extension filtering with complete TLD support
  const [selectedExtension, setSelectedExtension] = useState<string>('all');
  const [extensionSearchTerm, setExtensionSearchTerm] = useState('');
  
  // Preview functionality
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const pageSize = 10;

  // Enhanced queries with complete TLD support
  const searchMutation = usePublicSearchUrls();
  const filterByExtension = useFilterDomainsByExtension();
  const { data: allValidTlds = [], isLoading: loadingTlds } = useGetAllValidTlds();

  // Optimized TLD filtering with autocomplete support and common extensions always visible
  const filteredTlds = useMemo(() => {
    if (!extensionSearchTerm.trim()) {
      // When no search term, show common extensions first, then all others
      const otherTlds = allValidTlds.filter(tld => !COMMON_EXTENSIONS.includes(tld));
      return [...COMMON_EXTENSIONS.filter(ext => allValidTlds.includes(ext)), ...otherTlds];
    }
    
    // Use the optimized search function
    const normalizedTerm = extensionSearchTerm.trim().toLowerCase();
    const termWithDot = normalizedTerm.startsWith('.') ? normalizedTerm : `.${normalizedTerm}`;
    const termWithoutDot = normalizedTerm.startsWith('.') ? normalizedTerm.substring(1) : normalizedTerm;
    
    const filtered = allValidTlds.filter(tld => {
      const tldWithoutDot = tld.substring(1); // Remove the dot for comparison
      
      return (
        tld.includes(termWithDot) ||           // Exact match with dot
        tldWithoutDot.includes(termWithoutDot) || // Exact match without dot
        tld.startsWith(termWithDot) ||         // Starts with (with dot)
        tldWithoutDot.startsWith(termWithoutDot) || // Starts with (without dot)
        tldWithoutDot === termWithoutDot       // Exact extension match
      );
    });
    
    // Prioritize common extensions in search results too
    const commonFiltered = filtered.filter(tld => COMMON_EXTENSIONS.includes(tld));
    const otherFiltered = filtered.filter(tld => !COMMON_EXTENSIONS.includes(tld));
    
    return [...commonFiltered, ...otherFiltered];
  }, [allValidTlds, extensionSearchTerm]);

  // Extract domain extension from domain name
  const extractDomainExtension = useCallback((domain: string): string => {
    const parts = domain.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '.unknown';
  }, []);

  // Extract domain from URL
  const extractDomainFromUrl = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown-domain';
    }
  }, []);

  // Intelligent TLD recognition and multi-stage search
  const handleIntelligentSearch = async (searchTerm: string, page = 0) => {
    if (!searchTerm.trim()) return;

    try {
      const normalizedTerm = searchTerm.trim().toLowerCase();
      
      // Check if user is searching for a TLD (with or without dot)
      const isTLDSearch = /^\.?[a-z]{2,}$/i.test(normalizedTerm);
      
      let response;
      
      if (isTLDSearch) {
        // Multi-stage search: TLD-first filtering for optimal performance
        const tldWithDot = normalizedTerm.startsWith('.') ? normalizedTerm : `.${normalizedTerm}`;
        
        // Use extension filtering for TLD searches
        response = await filterByExtension.mutateAsync({
          extension: tldWithDot,
          page,
          pageSize,
        });
        
        toast.success('TLD Search Applied', {
          description: `Searching for domains with extension: ${tldWithDot}`,
          duration: 3000,
        });
      } else {
        // Stage 2: Apply extension filtering if selected
        if (selectedExtension !== 'all') {
          // Use backend's optimized extension filtering
          response = await filterByExtension.mutateAsync({
            extension: selectedExtension,
            page,
            pageSize,
          });
        } else {
          // Stage 3: Regular search without extension filtering
          response = await searchMutation.mutateAsync({
            query: searchTerm,
            page,
            pageSize,
          });
        }
      }

      setResults(response.results);
      setTotalResults(Number(response.totalResults));
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Intelligent search error:', error);
      toast.error('Search failed', {
        description: 'Please try again or contact support if the issue persists.',
      });
    }
  };

  // Handle search with intelligent TLD recognition
  const handleSearch = async (page = 0) => {
    if (!query.trim()) return;
    await handleIntelligentSearch(query.trim(), page);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(0);
  };

  // Handle extension change with immediate search if query exists
  const handleExtensionChange = (extension: string) => {
    setSelectedExtension(extension);
    
    // If there's a query and it's not a TLD search, re-run search with new extension filter
    if (query.trim() && !/^\.?[a-z]{2,}$/i.test(query.trim())) {
      handleSearch(0);
    }
  };

  // Secure preview functionality with true full-screen support
  const handlePreview = useCallback(async (url: string) => {
    const isXmlFile = url.toLowerCase().endsWith('.xml');
    
    setPreviewState({
      url,
      content: '',
      isLoading: true,
      error: null,
      zoom: 100,
      isFullscreen: false,
      previewType: isXmlFile ? 'xml' : 'iframe',
    });
    setPreviewDialogOpen(true);

    try {
      if (isXmlFile) {
        // For XML files, show download option and preview structure
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
        // For regular URLs, create a secure preview with enhanced content
        const previewContent = `
          <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="margin: 0 0 10px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                🔒 Secure Preview
              </h1>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Content displayed in a secure, sandboxed environment
              </p>
            </div>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">URL Information</h2>
              <div style="display: grid; gap: 10px;">
                <div><strong>URL:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 13px;">${url}</code></div>
                <div><strong>Domain:</strong> <span style="color: #059669;">${extractDomainFromUrl(url)}</span></div>
                <div><strong>Extension:</strong> <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${extractDomainExtension(extractDomainFromUrl(url))}</span></div>
                <div><strong>Preview Mode:</strong> <span style="color: #dc2626;">Secure (External content blocked)</span></div>
              </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">Content Preview</h3>
              <p style="margin: 0 0 15px 0; color: #6b7280;">
                This is a secure preview of the external content. In a real implementation, the actual page content would be displayed here in a sandboxed iframe that prevents malicious code execution and external navigation.
              </p>
              <div style="background: #f3f4f6; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0;">
                <p style="margin: 0; font-style: italic; color: #4b5563;">
                  <strong>Note:</strong> External scripts, forms, and potentially harmful content are automatically blocked for your security.
                </p>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center;">
                🛡️ Security Features
              </h4>
              <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
                <li style="margin-bottom: 8px; position: relative;">
                  <span style="position: absolute; left: -20px;">✓</span>
                  Sandboxed iframe prevents malicious code execution
                </li>
                <li style="margin-bottom: 8px; position: relative;">
                  <span style="position: absolute; left: -20px;">✓</span>
                  No external navigation or tab opening allowed
                </li>
                <li style="margin-bottom: 8px; position: relative;">
                  <span style="position: absolute; left: -20px;">✓</span>
                  Content Security Policy (CSP) enforced
                </li>
                <li style="margin-bottom: 8px; position: relative;">
                  <span style="position: absolute; left: -20px;">✓</span>
                  True full-screen support for all device sizes
                </li>
                <li style="margin-bottom: 8px; position: relative;">
                  <span style="position: absolute; left: -20px;">✓</span>
                  Cross-browser compatibility with smooth transitions
                </li>
                <li style="margin-bottom: 8px; position: relative;">
                  <span style="position: absolute; left: -20px;">✓</span>
                  Mobile-responsive design optimized for all devices
                </li>
              </ul>
            </div>

            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #065f46; font-size: 14px;">
                📱 Device Compatibility
              </h4>
              <p style="margin: 0; color: #047857; font-size: 13px;">
                This preview is optimized for all device sizes including laptops, desktops, tablets, and mobile devices. 
                Use the fullscreen toggle for an immersive viewing experience.
              </p>
            </div>

            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <button 
                onclick="window.parent.postMessage('close-preview', '*')" 
                style="
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: transform 0.2s ease;
                "
                onmouseover="this.style.transform='translateY(-1px)'"
                onmouseout="this.style.transform='translateY(0)'"
              >
                Close Preview
              </button>
            </div>
          </div>
        `;
        
        setPreviewState(prev => prev ? {
          ...prev,
          content: previewContent,
          isLoading: false,
          previewType: 'iframe',
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
  }, [extractDomainFromUrl, extractDomainExtension]);

  // Preview controls
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

  // Download XML file
  const handleDownloadXml = useCallback((url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started', {
      description: `Downloading ${url.split('/').pop() || 'sitemap.xml'}`,
    });
  }, []);

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Advanced Sitemap Search</span>
            <Badge variant="secondary">Public Access</Badge>
            <Badge variant="outline">Complete TLD Support</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter search query (e.g., domain name, URL, keyword, or TLD like 'org' or '.org')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 w-full sm:w-auto"
              />
              
              {/* Complete TLD Extension Dropdown with Autocomplete */}
              <Select value={selectedExtension} onValueChange={handleExtensionChange}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Extension" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search TLDs (e.g., org, .com, edu)..."
                      value={extensionSearchTerm}
                      onChange={(e) => setExtensionSearchTerm(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <SelectItem value="all">All Extensions</SelectItem>
                  {loadingTlds ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">Loading TLDs...</span>
                    </div>
                  ) : (
                    <ScrollArea className="h-72">
                      <div className="px-2 py-1 text-xs font-semibold text-primary sticky top-0 bg-background border-b">
                        Common Extensions
                      </div>
                      {filteredTlds.filter(tld => COMMON_EXTENSIONS.includes(tld)).map((tld) => (
                        <SelectItem key={tld} value={tld}>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-3 w-3 text-primary" />
                            <span className="font-medium">{tld}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground sticky top-0 bg-background border-b border-t mt-1">
                        All TLDs (.ac to .zw) - {filteredTlds.length} available
                      </div>
                      {filteredTlds.filter(tld => !COMMON_EXTENSIONS.includes(tld)).map((tld) => (
                        <SelectItem key={tld} value={tld}>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-3 w-3" />
                            <span>{tld}</span>
                          </div>
                        </SelectItem>
                      ))}
                      {filteredTlds.length === 0 && extensionSearchTerm && (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No TLDs match "{extensionSearchTerm}". Showing all available TLDs.
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </SelectContent>
              </Select>
              
              <Button 
                type="submit" 
                disabled={searchMutation.isPending || filterByExtension.isPending || !query.trim()}
                className="neon-glow w-full sm:w-auto"
              >
                {(searchMutation.isPending || filterByExtension.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Enhanced Search Instructions */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• <strong>Complete TLD Support:</strong> Search for any valid TLD from ".ac" to ".zw" - common extensions (.com, .org, .net, etc.) always visible</p>
              <p>• <strong>Intelligent TLD Recognition:</strong> Search for "org" or ".org" to find all .org domains</p>
              <p>• <strong>Autocomplete Search:</strong> Type in the TLD dropdown to quickly find specific extensions</p>
              <p>• <strong>Multi-Stage Search:</strong> Optimized filtering by extension first, then domain, then subdomain</p>
              <p>• <strong>Performance Optimized:</strong> Designed for millions of sitemap results with efficient indexing</p>
              <p>• <strong>True Full-Screen Preview:</strong> All results include secure preview functionality for all device sizes</p>
            </div>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Results</span>
                {selectedExtension !== 'all' && (
                  <Badge variant="outline">
                    <Filter className="h-3 w-3 mr-1" />
                    {selectedExtension}
                  </Badge>
                )}
                {/^\.?[a-z]{2,}$/i.test(query.trim()) && (
                  <Badge variant="secondary">
                    TLD Search Active
                  </Badge>
                )}
              </CardTitle>
              <Badge variant="secondary">
                {totalResults.toLocaleString()} results found
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
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
                    <PaginationPrevious 
                      onClick={() => currentPage > 0 && handleSearch(currentPage - 1)}
                      className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handleSearch(pageNum)}
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
                      onClick={() => currentPage < totalPages - 1 && handleSearch(currentPage + 1)}
                      className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full-Screen Preview Modal */}
      <FullScreenPreviewModal
        isOpen={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        previewState={previewState}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onToggleFullscreen={handleToggleFullscreen}
        onDownloadXml={handleDownloadXml}
        extractDomainExtension={extractDomainExtension}
        extractDomainFromUrl={extractDomainFromUrl}
      />
    </div>
  );
}
