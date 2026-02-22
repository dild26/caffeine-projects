import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, TrendingUp, TrendingDown, Plus, Minus, Edit, Save, Archive, RotateCcw, Sparkles, Filter, X, ExternalLink } from 'lucide-react';
import { DEFAULT_APPS } from '../data/defaultApps';
import { useFilters } from '../hooks/useFilters';

interface PageMetrics {
  pageName: string;
  appId: string;
  appName: string;
  appUrl: string;
  clicks: number;
  avgVisitDuration: number;
  earnings: number;
  uniqueFeatures: number;
  favorites: number;
  likes: number;
  seoRank: number;
  totalScore: number;
}

const COMMON_PAGES = [
  { name: 'Pros', path: '/pros' },
  { name: 'Features', path: '/features' },
  { name: 'Contact', path: '/contact' },
  { name: 'Sitemap', path: '/sitemap' },
  { name: 'Payment', path: '/payment' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
];

export default function FixturesPage() {
  const [selectedPage, setSelectedPage] = useState<string>('Pros');
  const [sortBy, setSortBy] = useState<string>('totalScore');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const {
    filters,
    activeFilters,
    archivedFilters,
    aiGeneratedFilters,
    addFilter,
    updateFilter,
    archiveFilter,
    resetFilters,
    bulkAddFilters,
    isLoading,
  } = useFilters();

  // Generate mock metrics for demonstration
  const generateMetrics = (): PageMetrics[] => {
    return DEFAULT_APPS.flatMap(app => 
      COMMON_PAGES.map(page => ({
        pageName: page.name,
        appId: app.id,
        appName: app.name,
        appUrl: app.url,
        clicks: Math.floor(Math.random() * 10000) + 100,
        avgVisitDuration: Math.floor(Math.random() * 300) + 30,
        earnings: Math.floor(Math.random() * 5000) + 100,
        uniqueFeatures: Math.floor(Math.random() * 20) + 1,
        favorites: Math.floor(Math.random() * 500) + 10,
        likes: Math.floor(Math.random() * 1000) + 50,
        seoRank: Math.floor(Math.random() * 100) + 1,
        totalScore: 0,
      }))
    ).map(metric => ({
      ...metric,
      totalScore: (
        metric.clicks * 0.3 +
        metric.avgVisitDuration * 0.1 +
        metric.earnings * 0.2 +
        metric.uniqueFeatures * 10 +
        metric.favorites * 0.5 +
        metric.likes * 0.4 +
        (100 - metric.seoRank) * 2
      ),
    }));
  };

  const allMetrics = useMemo(() => generateMetrics(), []);

  const filteredMetrics = useMemo(() => {
    let filtered = allMetrics.filter(m => m.pageName === selectedPage);
    
    if (filterKeyword) {
      filtered = filtered.filter(m => 
        m.appName.toLowerCase().includes(filterKeyword.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof PageMetrics] as number;
      const bValue = b[sortBy as keyof PageMetrics] as number;
      return bValue - aValue;
    });
  }, [allMetrics, selectedPage, sortBy, filterKeyword]);

  const handleAddFilter = async (keyword: string, isAi: boolean = false) => {
    if (!keyword.trim()) return;
    await addFilter({ keyword: keyword.trim(), value: keyword.trim(), isAiGenerated: isAi });
  };

  const handleUpdateFilter = async (id: number, keyword: string, value: string) => {
    await updateFilter({
      id,
      keyword,
      value,
      isActive: true,
      isArchived: false,
      isAiGenerated: false,
    });
    setEditingFilter(null);
    setEditValue('');
  };

  const handleArchiveFilter = async (id: number) => {
    await archiveFilter({ id, isArchived: true });
  };

  const handleResetFilters = async (type: 'all' | 'active' | 'archived') => {
    await resetFilters({ resetType: type });
  };

  const handleAiPopulate = async () => {
    const aiSuggestions = [
      'High Performance',
      'Top Rated',
      'Most Popular',
      'Best SEO',
      'Highest Earnings',
      'Most Features',
    ];
    
    await bulkAddFilters({
      filters: aiSuggestions.map(s => ({
        keyword: s,
        value: s,
        isAiGenerated: true,
      })),
    });
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500">🥇 1st</Badge>;
    if (index === 1) return <Badge className="bg-gray-400">🥈 2nd</Badge>;
    if (index === 2) return <Badge className="bg-orange-600">🥉 3rd</Badge>;
    return <Badge variant="outline">{index + 1}th</Badge>;
  };

  const getTrendIcon = (index: number) => {
    if (index < 3) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Fixtures - Cross-App Page Comparison
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare common pages across all {DEFAULT_APPS.length} SECOINFI applications with real-time leaderboard rankings
          </p>
        </div>
        <img 
          src="/assets/generated/fixtures-leaderboard-interface.dim_1024x768.png" 
          alt="Fixtures Leaderboard" 
          className="w-16 h-16 rounded-lg shadow-lg"
        />
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="filters">Filter Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Selection & Sorting</CardTitle>
              <CardDescription>Select a page type to compare across all apps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Type</label>
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_PAGES.map(page => (
                        <SelectItem key={page.name} value={page.name}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="totalScore">Total Score</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                      <SelectItem value="avgVisitDuration">Avg Visit Duration</SelectItem>
                      <SelectItem value="earnings">Earnings</SelectItem>
                      <SelectItem value="uniqueFeatures">Unique Features</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      <SelectItem value="likes">Likes</SelectItem>
                      <SelectItem value="seoRank">SEO Rank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by App</label>
                  <Input
                    placeholder="Search apps..."
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Dynamic Leaderboard - {selectedPage} Pages
              </CardTitle>
              <CardDescription>
                Real-time rankings with clickable app links to verified URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Rank</TableHead>
                      <TableHead>App</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Avg Duration (s)</TableHead>
                      <TableHead className="text-right">Earnings ($)</TableHead>
                      <TableHead className="text-right">Features</TableHead>
                      <TableHead className="text-right">Favorites</TableHead>
                      <TableHead className="text-right">Likes</TableHead>
                      <TableHead className="text-right">SEO Rank</TableHead>
                      <TableHead className="text-right">Total Score</TableHead>
                      <TableHead className="text-center">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetrics.map((metric, index) => (
                      <TableRow key={`${metric.appId}-${metric.pageName}`} className="hover:bg-muted/50">
                        <TableCell>{getRankBadge(index)}</TableCell>
                        <TableCell className="font-medium">
                          <a
                            href={metric.appUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent transition-colors hover:underline flex items-center gap-1"
                          >
                            {metric.appName}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell className="text-right">{metric.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{metric.avgVisitDuration}s</TableCell>
                        <TableCell className="text-right">${metric.earnings.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{metric.uniqueFeatures}</TableCell>
                        <TableCell className="text-right">{metric.favorites.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{metric.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-right">#{metric.seoRank}</TableCell>
                        <TableCell className="text-right font-bold">{Math.round(metric.totalScore).toLocaleString()}</TableCell>
                        <TableCell className="text-center">{getTrendIcon(index)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filter Management
              </CardTitle>
              <CardDescription>
                Add, edit, modify, save, delete, archive, or reset filters manually or via AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter filter keyword..."
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFilter(editValue);
                      setEditValue('');
                    }
                  }}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          handleAddFilter(editValue);
                          setEditValue('');
                        }}
                        disabled={!editValue.trim()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add new filter</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleAiPopulate} variant="secondary">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Populate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Auto-populate with AI suggestions</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button onClick={() => handleResetFilters('all')} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Filters</h3>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading filters...</div>
                ) : activeFilters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    No active filters. Add filters to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {activeFilters.map((filter) => (
                      <Card key={filter.id.toString()} className="relative group">
                        <CardContent className="p-3">
                          {editingFilter === filter.id.toString() ? (
                            <div className="flex gap-2">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleUpdateFilter(filter.id, editValue, editValue)}
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{filter.keyword}</span>
                                {filter.isAiGenerated && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditingFilter(filter.id.toString());
                                          setEditValue(filter.keyword);
                                        }}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit filter</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleArchiveFilter(filter.id)}
                                      >
                                        <Archive className="w-3 h-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Archive filter</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleArchiveFilter(filter.id)}
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete filter</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {archivedFilters.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Archived Filters</h3>
                      <Button onClick={() => handleResetFilters('archived')} variant="outline" size="sm">
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Restore All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {archivedFilters.map((filter) => (
                        <Card key={filter.id.toString()} className="opacity-60">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{filter.keyword}</span>
                              <Badge variant="outline">Archived</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cross-App Analytics</CardTitle>
              <CardDescription>Comprehensive performance insights across all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allMetrics.length}</div>
                    <p className="text-xs text-muted-foreground">Across {DEFAULT_APPS.length} apps</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allMetrics.reduce((sum, m) => sum + m.clicks, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">All pages combined</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${allMetrics.reduce((sum, m) => sum + m.earnings, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Revenue generated</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg SEO Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      #{Math.round(allMetrics.reduce((sum, m) => sum + m.seoRank, 0) / allMetrics.length)}
                    </div>
                    <p className="text-xs text-muted-foreground">Average position</p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Top Performing Apps by Page Type</h3>
                {COMMON_PAGES.map(page => {
                  const pageMetrics = allMetrics.filter(m => m.pageName === page.name);
                  const topApp = pageMetrics.sort((a, b) => b.totalScore - a.totalScore)[0];
                  
                  return (
                    <div key={page.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{page.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Winner: <span className="font-semibold text-foreground">{topApp?.appName}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round(topApp?.totalScore || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total Score</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
