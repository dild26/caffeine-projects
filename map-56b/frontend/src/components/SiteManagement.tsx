import { useState, useMemo } from 'react';
import { useGetAllSecoinfiApps, useGetRegistrySize } from '../hooks/usePages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, ExternalLink, TrendingUp, Award, BarChart3, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import DomainPreviewDialog from './DomainPreviewDialog';
import { useNavigate } from '@tanstack/react-router';
import { validateUrl, extractSubdomain } from '../lib/urlValidator';

interface SiteManagementProps {
  isAdmin: boolean;
}

interface ProcessedPage {
  url: string;
  name: string;
  rank: number | null;
  topAppUrl?: string;
  topApp?: string;
  category: string;
  isValidUrl: boolean;
  clickCount: number;
  voteCount: number;
  leaderboardScore: number;
  globalScore: number;
  lastUpdated: string;
}

// Simulated leaderboard data for demonstration
const generateLeaderboardData = () => {
  const baseScore = Math.floor(Math.random() * 100) + 50;
  const clickCount = Math.floor(Math.random() * 1000) + 100;
  const voteCount = Math.floor(Math.random() * 500) + 50;
  
  return {
    clickCount,
    voteCount,
    leaderboardScore: baseScore,
    globalScore: baseScore - Math.floor(Math.random() * 20),
    lastUpdated: new Date().toISOString(),
  };
};

export default function SiteManagement({ isAdmin }: SiteManagementProps) {
  // DEFENSIVE: Use Secoinfi-Apps registry as single source of truth
  const { data: secoinfiApps = [], isLoading, error } = useGetAllSecoinfiApps();
  const { data: registrySize = 0 } = useGetRegistrySize();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewDomain, setPreviewDomain] = useState<string | null>(null);
  const navigate = useNavigate();

  // Process apps: validate URLs and add leaderboard data
  // IMPORTANT: Keep all apps from registry, only mark validation status
  const processedApps = useMemo((): ProcessedPage[] => {
    return secoinfiApps.map(app => {
      const isValid = validateUrl(app.url);
      
      // Log validation issues but keep the app
      if (!isValid) {
        console.warn(`[SiteManagement] App "${app.name}" has invalid URL: ${app.url}`);
      }
      
      return {
        ...app,
        isValidUrl: isValid,
        ...generateLeaderboardData(),
      };
    });
  }, [secoinfiApps]);

  // Sort by rank (ascending, #1 first) then by name A-Z
  const sortedApps = useMemo(() => {
    return [...processedApps].sort((a, b) => {
      // Rank #1 first, then ascending
      if (a.rank === null && b.rank === null) return a.name.localeCompare(b.name);
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.name.localeCompare(b.name);
    });
  }, [processedApps]);

  // Filter data based on search and category
  const filteredData = useMemo(() => {
    return sortedApps.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.topApp && item.topApp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [sortedApps, searchQuery, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(sortedApps.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [sortedApps]);

  // Calculate real-time comparison status
  const getComparisonStatus = (secoinfScore: number, globalScore: number) => {
    const diff = secoinfScore - globalScore;
    if (diff > 10) return { status: 'leading', color: 'text-green-500', icon: '↑' };
    if (diff > 0) return { status: 'ahead', color: 'text-blue-500', icon: '→' };
    return { status: 'improving', color: 'text-yellow-500', icon: '↗' };
  };

  // Check if URL is internal MOAP route
  const isInternalRoute = (url: string): boolean => {
    const internalRoutes = [
      '/home', '/blog', '/about', '/pros', '/what', '/why', '/contact',
      '/faq', '/terms', '/referral', '/trust', '/sitemap', '/rank', '/live',
      '/dashboard', '/payment', '/angel-vc', '/fixtures', '/compare'
    ];
    return internalRoutes.some(route => url.startsWith(route));
  };

  // Handle page navigation (internal vs external)
  const handleViewPage = (url: string) => {
    if (isInternalRoute(url)) {
      // Internal MOAP route - use router navigation
      navigate({ to: url as any });
    } else {
      // External URL - open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // DEFENSIVE: Show loading state
  if (isLoading) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading Secoinfi-Apps registry...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // DEFENSIVE: Show error state but don't block rendering
  if (error) {
    console.error('[SiteManagement] Error loading Secoinfi apps:', error);
  }

  // DEFENSIVE: Fail-safe render - always show UI even if no data
  const hasData = sortedApps.length > 0;
  const validAppsCount = sortedApps.filter(app => app.isValidUrl).length;
  const invalidAppsCount = sortedApps.length - validAppsCount;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="card-3d gradient-border">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Sites - Secoinfi-Apps Registry
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {hasData ? (
                    <>
                      {sortedApps.length} Secoinfi apps from canonical registry (sorted by Rank #1 first) • 
                      {validAppsCount > 0 && ` ${validAppsCount} valid URLs`}
                      {invalidAppsCount > 0 && ` • ${invalidAppsCount} need validation`}
                    </>
                  ) : (
                    'Loading Secoinfi-Apps registry...'
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="neon-glow">
                  <Globe className="w-3 h-3 mr-1" />
                  {filteredData.length} Apps
                </Badge>
                {registrySize > 0 && (
                  <Badge variant="secondary">
                    <Award className="w-3 h-3 mr-1" />
                    Registry: {registrySize}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by app name, category, or URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-2"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'neon-glow' : ''}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="card-3d">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{sortedApps.length}</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Apps</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-3d">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{validAppsCount}</div>
                    <div className="text-sm text-muted-foreground mt-1">Valid URLs</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-3d">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">{invalidAppsCount}</div>
                    <div className="text-sm text-muted-foreground mt-1">Need Validation</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-3d">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">
                      {filteredData.length > 0 ? Math.round(filteredData.reduce((acc, d) => acc + d.leaderboardScore, 0) / filteredData.length) : 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Avg Score</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* DEFENSIVE: Always render grid, show message if empty */}
            {!hasData ? (
              <div className="text-center py-16 gradient-border rounded-lg">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <p className="text-muted-foreground text-lg mb-2">
                  Secoinfi-Apps registry is loading or empty
                </p>
                <p className="text-sm text-muted-foreground">
                  Expected: 26+ apps from backend registry
                </p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-16 gradient-border rounded-lg">
                <p className="text-muted-foreground text-lg">
                  No apps found matching your search criteria
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item, index) => {
                  const comparison = getComparisonStatus(item.leaderboardScore, item.globalScore);
                  const subdomain = extractSubdomain(item.url);
                  const isInternal = isInternalRoute(item.url);
                  const hasValidUrl = item.isValidUrl;
                  
                  return (
                    <Card key={`${item.name}-${index}`} className="card-3d card-3d-hover gradient-border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="text-primary">{item.name}</span>
                              {hasValidUrl ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>URL needs validation</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={`text-xl ${comparison.color}`}>
                                    {comparison.icon}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="capitalize">{comparison.status} vs Global</p>
                                </TooltipContent>
                              </Tooltip>
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="default" className="neon-glow text-xs">
                                {item.category}
                              </Badge>
                              {item.rank !== null && (
                                <Badge variant="secondary" className="text-xs font-mono">
                                  Rank #{item.rank}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* App URL as clickable link */}
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">App URL:</span>
                          <a
                            href={item.url}
                            target={isInternal ? '_self' : '_blank'}
                            rel={isInternal ? undefined : 'noopener noreferrer'}
                            className="text-sm text-primary hover:text-accent transition-colors hover:underline flex items-center gap-1 break-all"
                            onClick={(e) => {
                              if (isInternal) {
                                e.preventDefault();
                                handleViewPage(item.url);
                              }
                            }}
                          >
                            {item.url}
                            {!isInternal && <ExternalLink className="w-3 h-3 flex-shrink-0" />}
                          </a>
                        </div>
                        
                        {/* Top App Info - safe fallback if not available */}
                        {item.topApp ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Top App:</span>
                              {item.topAppUrl ? (
                                <a
                                  href={item.topAppUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-primary hover:text-accent transition-colors hover:underline flex items-center gap-1"
                                >
                                  {item.topApp}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs text-muted-foreground italic flex items-center gap-1 cursor-help">
                                      {item.topApp}
                                      <AlertCircle className="w-3 h-3" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>URL not available - using safe fallback</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Top App:</span>
                              <span className="text-xs text-muted-foreground italic">Not assigned</span>
                            </div>
                          </div>
                        )}

                        {/* Metrics */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">SECOINFI Score</span>
                              <span className="font-bold text-primary">{item.leaderboardScore}</span>
                            </div>
                            <Progress value={item.leaderboardScore} className="h-2" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Global Score</span>
                              <span className="font-bold">{item.globalScore}</span>
                            </div>
                            <Progress value={item.globalScore} className="h-2 opacity-50" />
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="text-center p-2 rounded-lg bg-muted/50">
                              <div className="text-lg font-bold text-blue-500">{item.clickCount}</div>
                              <div className="text-xs text-muted-foreground">Clicks</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-muted/50">
                              <div className="text-lg font-bold text-purple-500">{item.voteCount}</div>
                              <div className="text-xs text-muted-foreground">Votes</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {isInternal ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewPage(item.url)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Page
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              asChild
                            >
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-3 h-3 mr-1" />
                                View Page
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          )}
                          {subdomain && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="neon-glow"
                                  onClick={() => setPreviewDomain(subdomain)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Preview in Sandbox</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Security & Sync Status */}
            <Card className="card-3d gradient-border">
              <CardContent className="py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      Secoinfi-Apps registry active • Rank-based sorting enabled • URL validation active • All apps rendered
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Last updated: {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      {previewDomain && (
        <DomainPreviewDialog
          domain={`${previewDomain}.caffeine.xyz`}
          open={!!previewDomain}
          onOpenChange={(open) => !open && setPreviewDomain(null)}
        />
      )}
    </TooltipProvider>
  );
}

