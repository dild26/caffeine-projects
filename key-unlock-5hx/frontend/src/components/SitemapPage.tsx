import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Map, Network, Hash, RefreshCw, Share2, Layers, Plus, Edit, Trash2, Sparkles, Search, AlertCircle, CheckCircle, XCircle, Upload, FileText, ExternalLink, Shield } from 'lucide-react';
import { useSitemapData, useSitemapByApp, useSitemapStats } from '../hooks/useSitemapData';
import { useDiscoverAllApps, useAddSitemapPage, useDeleteSitemapPage, useSetSelectAllState, useGetSelectAllState } from '../hooks/useAppQueries';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useGetAllApps } from '../hooks/useApps';
import SitemapImportDialog from './SitemapImportDialog';
import SitemapCSVUploadDialog from './SitemapCSVUploadDialog';
import DomainPreviewDialog from './DomainPreviewDialog';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

const SAMPLE_URL_PATTERNS = ['blog', 'about', 'pros', 'what', 'why', 'how', 'contact', 'faq', 'terms', 'referral', 'trust'];

export default function SitemapPage({ onNavigate }: SitemapPageProps) {
  const { data: sitemapData = [], isLoading, refetch } = useSitemapData();
  const { data: sitemapByApp = {} } = useSitemapByApp();
  const { data: stats } = useSitemapStats();
  const { data: liveApps = [] } = useGetAllApps();
  const discoverAllApps = useDiscoverAllApps();
  const addPage = useAddSitemapPage();
  const deletePage = useDeleteSitemapPage();
  const setSelectAllState = useSetSelectAllState();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [newPage, setNewPage] = useState({ name: '', url: '', category: '', appName: '' });
  const [discoveryStatus, setDiscoveryStatus] = useState<Record<string, string>>({});
  const [discoveredPagesMap, setDiscoveredPagesMap] = useState<Record<string, string[]>>({});
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  // Get current app ID - ensure it's always a number
  const currentAppId: number = selectedApp 
    ? Number(liveApps.find(a => a.name === selectedApp)?.id ?? 0)
    : 0;

  // Get select all state for current app
  const { data: selectAllStateData } = useGetSelectAllState(currentAppId);

  // Update local state when backend state changes
  useEffect(() => {
    if (selectAllStateData) {
      setSelectAllChecked(selectAllStateData.isSelected);
    }
  }, [selectAllStateData]);

  // Real-time auto-sync: refetch every 30 seconds for incremental updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Self-healing consistency module: auto-fix on data mismatch detection
  useEffect(() => {
    if (stats && !stats.isConsistent) {
      console.error('[Consistency Alert] Data inconsistency detected!', stats);
      toast.error('Data inconsistency detected. Running self-healing process...', {
        duration: 5000,
      });
      
      // Trigger immediate refetch to run self-healing
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  }, [stats, refetch]);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const handleOpenPreview = (url: string) => {
    let domain = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      domain = url.replace(/^https?:\/\//, '').split('/')[0];
    } else if (url.startsWith('/')) {
      domain = window.location.hostname;
    }
    setPreviewUrl(domain);
    setPreviewDialogOpen(true);
  };

  const handleDiscoverAll = async () => {
    toast.info(`Starting AI-powered sitemap discovery for all ${liveApps.length} SECOINFI apps from backend registry...`);
    setDiscoveryStatus({});
    const newDiscoveredPages: Record<string, string[]> = {};

    try {
      const results = await discoverAllApps.mutateAsync();
      
      // Process results and update discovery status
      results.forEach((result) => {
        const app = liveApps.find(a => {
          const subdomain = a.subdomain || a.url.replace('https://', '').replace('http://', '').split('.')[0];
          return subdomain === result.appIdentifier;
        });
        
        if (app) {
          newDiscoveredPages[app.name] = result.discoveredPages;
          setDiscoveryStatus(prev => ({ 
            ...prev, 
            [result.appIdentifier]: `✓ Found ${result.discoveredPages.length} pages` 
          }));
        }
      });

      // Update discovered pages map
      setDiscoveredPagesMap(prev => ({ ...prev, ...newDiscoveredPages }));

      // Force refetch for real-time incremental append
      await refetch();
      toast.success(`AI discovery complete for all ${liveApps.length} apps! Sitemap updated with normalized URLs.`);
    } catch (error) {
      console.error('[Discovery] Error:', error);
      toast.error('Failed to discover apps. Please try again.');
    }
  };

  const handleAddPage = async () => {
    if (!newPage.name || !newPage.url || !newPage.category || !newPage.appName) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addPage.mutateAsync({
        name: newPage.name,
        url: newPage.url,
        category: newPage.category,
        parentId: null,
      });
      toast.success('Page added successfully with normalized URL');
      setAddDialogOpen(false);
      setNewPage({ name: '', url: '', category: '', appName: '' });
      
      // Trigger real-time incremental append
      await refetch();
    } catch (error) {
      toast.error('Failed to add page');
    }
  };

  const handleDeletePage = async (id: bigint, name: string) => {
    if (!confirm(`Delete "${name}" from sitemap?`)) return;

    try {
      await deletePage.mutateAsync(id);
      toast.success('Page deleted successfully');
      
      // Force immediate refetch
      await refetch();
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleQuickAddFromPattern = (pattern: string) => {
    if (!selectedApp) {
      toast.error('Please select an app first');
      return;
    }
    
    const app = liveApps.find(a => a.name === selectedApp);
    if (!app) return;

    setNewPage({
      name: pattern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      url: `${app.url}${pattern}`,
      category: 'Information',
      appName: selectedApp,
    });
    setAddDialogOpen(true);
  };

  const handleSelectAllChange = async (checked: boolean) => {
    if (!selectedApp) {
      toast.error('Please select an app first');
      return;
    }

    const app = liveApps.find(a => a.name === selectedApp);
    if (!app) return;

    setSelectAllChecked(checked);

    try {
      // Save state to backend
      await setSelectAllState.mutateAsync({
        appId: BigInt(app.id),
        isSelected: checked,
      });

      if (checked) {
        // Bulk add all sample URL patterns with real-time incremental append
        setIsBulkAdding(true);
        toast.info(`Adding all ${SAMPLE_URL_PATTERNS.length} sample pages to ${selectedApp}...`);

        let successCount = 0;
        let errorCount = 0;

        for (const pattern of SAMPLE_URL_PATTERNS) {
          try {
            await addPage.mutateAsync({
              name: pattern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              url: `${app.url}${pattern}`,
              category: 'Information',
              parentId: null,
            });
            successCount++;
          } catch (error) {
            console.error(`Failed to add ${pattern}:`, error);
            errorCount++;
          }
        }

        setIsBulkAdding(false);

        if (successCount > 0) {
          toast.success(`Successfully added ${successCount} pages with normalized URLs`);
          await refetch();
        }

        if (errorCount > 0) {
          toast.warning(`${errorCount} pages failed to add (may already exist)`);
        }
      } else {
        toast.info('Select All state cleared');
      }
    } catch (error) {
      console.error('Select All error:', error);
      toast.error('Failed to update Select All state');
      setSelectAllChecked(!checked);
    }
  };

  // Helper function to check if a page pattern is discovered
  const isPageDiscovered = (appName: string, pattern: string): boolean => {
    const appEntries = sitemapByApp[appName] || [];
    return appEntries.some(entry => 
      entry.url.toLowerCase().includes(`/${pattern}`) || 
      entry.name.toLowerCase().includes(pattern)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading sitemap with URL normalization...</p>
        </div>
      </div>
    );
  }

  const appNames = Object.keys(sitemapByApp).sort();
  const totalEntriesInHierarchy = Object.values(sitemapByApp).reduce((sum, entries) => sum + entries.length, 0);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="card-3d card-3d-hover border-4 border-primary/30">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4">
              <Map className="w-16 h-16 text-primary mx-auto animate-pulse-glow" />
            </div>
            <CardTitle className="text-4xl font-bold text-gradient mb-4">
              Enhanced Hierarchical Sitemap Management
            </CardTitle>
            <CardDescription className="text-lg">
              Full-screen hierarchical sitemap viewer with double-sanitization pipeline, self-healing consistency module, and real-time incremental sync for all {liveApps.length} SECOINFI apps from backend registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="card-3d p-4 rounded-lg text-center">
                <Network className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient">{stats?.uniqueUrls || sitemapData.length}</div>
                <div className="text-xs text-muted-foreground">Unique Pages</div>
                {stats && !stats.isConsistent && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Healing...
                  </Badge>
                )}
                {stats && stats.isConsistent && (
                  <Badge variant="outline" className="mt-1 text-xs text-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Synced
                  </Badge>
                )}
              </div>
              <div className="card-3d p-4 rounded-lg text-center">
                <Layers className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient-secondary">{appNames.length}</div>
                <div className="text-xs text-muted-foreground">SECOINFI Apps</div>
              </div>
              <div className="card-3d p-4 rounded-lg text-center">
                <Sparkles className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient">{stats?.aiDiscoveredCount || 0}</div>
                <div className="text-xs text-muted-foreground">AI Discovered</div>
              </div>
              <div className="card-3d p-4 rounded-lg text-center">
                <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-gradient">Protected</div>
                <div className="text-xs text-muted-foreground">Self-Healing</div>
              </div>
            </div>

            {/* Self-Healing Consistency Alert */}
            {stats && !stats.isConsistent && (
              <Alert variant="destructive" className="mb-6 animate-pulse">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Data Inconsistency Detected:</strong> Total entries ({stats.totalEntries}) doesn't match hierarchical structure ({stats.groupedTotal}). 
                  Root: {stats.rootEntries}, Children: {stats.childEntries}. 
                  <strong className="text-primary"> Self-healing module activated!</strong> Re-running normalization and deduplication...
                </AlertDescription>
              </Alert>
            )}

            {/* Enhanced Admin Controls */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">Admin Controls & AI Discovery</h3>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setCsvDialogOpen(true)} variant="outline" className="neon-glow">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                  <Button onClick={() => setImportDialogOpen(true)} variant="outline" className="neon-glow">
                    <FileText className="w-4 h-4 mr-2" />
                    Import XML
                  </Button>
                  <Button onClick={() => setAddDialogOpen(true)} variant="outline" className="neon-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Page
                  </Button>
                  <Button onClick={handleDiscoverAll} disabled={discoverAllApps.isPending} className="neon-glow">
                    <Search className="w-4 h-4 mr-2" />
                    {discoverAllApps.isPending ? 'Discovering...' : `Discover Secoinfi-Apps`}
                  </Button>
                  <Button onClick={() => refetch()} variant="outline" size="icon" title="Refresh">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* App Selector with Sample URL Patterns and Select All */}
              <div className="card-3d p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Quick Add from SECOINFI Apps</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appSelector">Select SECOINFI App</Label>
                    <Select value={selectedApp} onValueChange={setSelectedApp}>
                      <SelectTrigger id="appSelector">
                        <SelectValue placeholder="Choose an app..." />
                      </SelectTrigger>
                      <SelectContent>
                        {liveApps.map((app) => (
                          <SelectItem key={app.id} value={app.name}>
                            <div className="flex items-center gap-2">
                              <span>{app.name}</span>
                              {app.isVerified && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedApp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-semibold">Canonical URL:</span>{' '}
                        <span className="underline decoration-dotted decoration-primary/50 hover:decoration-primary transition-colors">
                          {liveApps.find(a => a.name === selectedApp)?.url}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Sample URL Patterns</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="selectAll"
                          checked={selectAllChecked}
                          onCheckedChange={handleSelectAllChange}
                          disabled={!selectedApp || isBulkAdding}
                        />
                        <Label
                          htmlFor="selectAll"
                          className="text-sm font-medium cursor-pointer select-none"
                        >
                          Select All Pages
                        </Label>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_URL_PATTERNS.map((pattern) => {
                        const isDiscovered = selectedApp && isPageDiscovered(selectedApp, pattern);
                        return (
                          <Tooltip key={pattern}>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickAddFromPattern(pattern)}
                                disabled={!selectedApp || isBulkAdding}
                                className={`text-xs underline decoration-dotted hover:decoration-solid transition-all ${
                                  isDiscovered 
                                    ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20' 
                                    : 'text-muted-foreground hover:text-primary opacity-60 hover:opacity-100'
                                }`}
                              >
                                {pattern}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {selectedApp 
                                  ? isDiscovered 
                                    ? `✓ ${pattern} page discovered in ${selectedApp}` 
                                    : `Add ${pattern} page to ${selectedApp}` 
                                  : 'Select an app first'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                    {isBulkAdding && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Adding all pages with URL normalization...</span>
                      </div>
                    )}
                  </div>
                </div>
                <Alert className="bg-primary/5 border-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs">
                    <strong>Single Source of Truth:</strong> All discovery operations now use live apps data from backend Secoinfi-App Registry. 
                    When apps are added (26+ or more), the "Discover Secoinfi-Apps" button automatically updates to reflect the current count. 
                    <strong> Real-Time Sync:</strong> Changes to the Apps tab trigger automatic updates across all dependent systems (sitemap, menu, broadcast) without page reload.
                  </AlertDescription>
                </Alert>
              </div>

              {Object.keys(discoveryStatus).length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <strong className="text-primary">Discovery Log (Normalized Subdomains from Backend Registry):</strong>
                      {Object.entries(discoveryStatus).map(([domain, status]) => (
                        <div key={domain} className="text-sm">
                          <strong>{domain}:</strong> {status}
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="card-3d p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>AI Discovery:</strong> Automatically pings each of the {liveApps.length} SECOINFI apps with normalized subdomains from backend registry to prevent auto-duplication errors. 
                  <strong> URL Normalization:</strong> Enhanced logic detects and permanently fixes malformed links by stripping duplicate domain segments. 
                  <strong> Post-Discovery Validation:</strong> Re-checks each discovered link against normalized app identifiers and deduplicates the URL set before writing to sitemap tree. 
                  <strong> Runtime Watcher:</strong> Subscribes to backend registry changes, ensuring the discovery button and sitemap tree automatically refresh when apps are added/removed.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">Hierarchical Sitemap Tree - All {liveApps.length} SECOINFI Apps</h3>
                </div>
                <Badge variant="outline" className="text-sm">
                  {stats?.uniqueUrls || totalEntriesInHierarchy} unique pages across {appNames.length} apps
                </Badge>
              </div>

              <Accordion type="multiple" className="space-y-3">
                {appNames.map((appName) => {
                  const appEntries = sitemapByApp[appName] || [];
                  const rootEntry = appEntries.find(e => e.parentId === null);
                  const childEntries = appEntries.filter(e => e.parentId !== null);
                  const discoveredPages = discoveredPagesMap[appName] || [];

                  return (
                    <AccordionItem key={appName} value={appName} className="card-3d card-3d-hover rounded-lg border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-lg">{appName}</span>
                            <Badge variant="secondary" className="text-xs">Root Node</Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {appEntries.length + discoveredPages.length} {appEntries.length + discoveredPages.length === 1 ? 'page' : 'pages'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2 mt-2">
                          {rootEntry && (
                            <div className="card-3d p-3 rounded-lg mb-3 group">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <a
                                        href={rootEntry.url}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleOpenPreview(rootEntry.url);
                                        }}
                                        className="text-primary hover:text-accent transition-colors font-semibold underline decoration-dotted hover:decoration-solid cursor-pointer"
                                      >
                                        {rootEntry.name}
                                      </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Click to preview in sandboxed viewer</p>
                                      <p className="text-xs text-muted-foreground">{rootEntry.url}</p>
                                      <p className="text-xs text-success mt-1">✓ Normalized URL</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      Root
                                    </Badge>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      Hash: {rootEntry.hash.substring(0, 12)}...
                                    </span>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingEntry(rootEntry)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeletePage(BigInt(rootEntry.id), rootEntry.name)}
                                    className="h-8 w-8 p-0 text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {childEntries.length > 0 && (
                            <div className="ml-6 space-y-2">
                              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                                <div className="h-px bg-border flex-1" />
                                <span>Child Pages ({childEntries.length})</span>
                                <div className="h-px bg-border flex-1" />
                              </div>
                              {childEntries.map((entry) => (
                                <div key={Number(entry.id)} className="card-3d p-3 rounded-lg group bg-primary/5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <a
                                            href={entry.url}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleOpenPreview(entry.url);
                                            }}
                                            className="text-primary hover:text-accent transition-colors font-medium underline decoration-dotted hover:decoration-solid cursor-pointer"
                                          >
                                            {entry.name}
                                          </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Click to preview in sandboxed viewer</p>
                                          <p className="text-xs text-muted-foreground">{entry.url}</p>
                                          <p className="text-xs text-success mt-1">✓ Normalized & Deduplicated</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {entry.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono">
                                          Hash: {entry.hash.substring(0, 12)}...
                                        </span>
                                        {entry.isAiDiscovered && (
                                          <Badge variant="secondary" className="text-xs">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            AI
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingEntry(entry)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeletePage(BigInt(entry.id), entry.name)}
                                        className="h-8 w-8 p-0 text-destructive"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Display discovered pages as clickable links */}
                          {discoveredPages.length > 0 && (
                            <div className="ml-6 space-y-2 mt-4">
                              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                                <div className="h-px bg-border flex-1" />
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-primary" />
                                  AI Discovered Pages ({discoveredPages.length})
                                </span>
                                <div className="h-px bg-border flex-1" />
                              </div>
                              {discoveredPages.map((pageUrl, idx) => {
                                const pageName = pageUrl.split('/').pop() || pageUrl;
                                return (
                                  <div key={idx} className="card-3d p-3 rounded-lg group bg-primary/10 border-primary/20">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <a
                                              href={pageUrl}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOpenPreview(pageUrl);
                                              }}
                                              className="text-primary hover:text-accent transition-colors font-medium underline decoration-dotted hover:decoration-solid cursor-pointer inline-flex items-center gap-1"
                                            >
                                              {pageName}
                                              <ExternalLink className="w-3 h-3" />
                                            </a>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs font-semibold">Click to preview in sandboxed viewer</p>
                                            <p className="text-xs text-muted-foreground mt-1">{pageUrl}</p>
                                            <p className="text-xs text-success mt-1">✓ Discovered by AI with normalized URL</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="secondary" className="text-xs bg-primary/20">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            AI Discovered
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">
                                            Pending integration
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {childEntries.length === 0 && discoveredPages.length === 0 && rootEntry && (
                            <div className="ml-6 text-sm text-muted-foreground italic">
                              No child pages yet. Use AI Discovery, CSV Upload, or Select All to add pages.
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Enhanced Features: Single Source of Truth & Runtime Watcher
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="card-3d p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Unified Source of Truth: Backend Secoinfi-App Registry
                </h4>
                <p className="text-sm text-muted-foreground">
                  All sitemap discovery operations now use the live SECOINFI apps list directly from backend Secoinfi-App Registry as the single source of truth. 
                  The "Discover Secoinfi-Apps" button dynamically queries all {liveApps.length} entries from the backend registry, ensuring when apps are added (26+ or more), the sitemap discovery function and hierarchical tree update immediately. 
                  AI-powered URL-to-app matching uses exact subdomain patterns with safe extraction and sanitization from the canonical app list. 
                  Post-discovery validation re-checks each discovered link against normalized app identifiers before writing to the sitemap tree. 
                  No hardcoded fallback arrays or local variables reference old app lists - backend registry is the only source.
                </p>
              </div>
              <div className="card-3d p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-accent flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Runtime Watcher & Auto-Refresh
                </h4>
                <p className="text-sm text-muted-foreground">
                  Subscribes to backend registry changes via React Query invalidation, ensuring the discovery button and sitemap tree automatically refresh when apps are added/removed in the Apps tab. 
                  When apps are added, modified, or removed, the sitemap page receives real-time notifications and triggers automatic refetch without page reload. 
                  The "Discover Secoinfi-Apps" button text updates dynamically to reflect the current app count from the live data source. 
                  All dependent systems (sitemap, menu, broadcast) receive synchronized updates through the centralized backend registry.
                </p>
              </div>
              <div className="card-3d p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-secondary flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Self-Healing Consistency Module
                </h4>
                <p className="text-sm text-muted-foreground">
                  Automatic consistency validation runs on every data fetch. On detecting data mismatches (Root != total entries), the self-healing module instantly re-runs normalization and deduplication to fix inconsistencies. 
                  Prevents "Data inconsistency detected" alerts by maintaining accurate Root and Children totals across all {liveApps.length} SECOINFI apps. 
                  Validation checks include: orphaned children detection, invalid parent references, duplicate URL detection, and canonical format verification.
                </p>
              </div>
              <div className="card-3d p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-success flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Double-Sanitization Pipeline
                </h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Phase 1:</strong> Trims .caffeine.xyz from incoming app identifiers found in discovery logs. 
                  <strong> Phase 2:</strong> Ensures base URLs are always in format https://&lt;subdomain&gt;.caffeine.xyz/ before page concatenation. 
                  <strong> Phase 3:</strong> Comprehensive normalization removes duplicate domain segments (e.g., .caffeine.xyz.caffeine.xyz), converts protocols to https, and validates canonical format. 
                  All URLs are deduplicated with timestamp-based conflict resolution before storage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Page Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sitemap Page</DialogTitle>
              <DialogDescription>
                Manually add a new page with automatic URL normalization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Page Name</Label>
                <Input
                  id="name"
                  value={newPage.name}
                  onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                  placeholder="e.g., About Us"
                />
              </div>
              <div>
                <Label htmlFor="url">URL (will be normalized)</Label>
                <Input
                  id="url"
                  value={newPage.url}
                  onChange={(e) => setNewPage({ ...newPage, url: e.target.value })}
                  placeholder="e.g., about or https://app.caffeine.xyz/about"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newPage.category}
                  onChange={(e) => setNewPage({ ...newPage, category: e.target.value })}
                  placeholder="e.g., Information"
                />
              </div>
              <div>
                <Label htmlFor="appName">App Name</Label>
                <Select value={newPage.appName} onValueChange={(value) => setNewPage({ ...newPage, appName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select app" />
                  </SelectTrigger>
                  <SelectContent>
                    {liveApps.map((app) => (
                      <SelectItem key={app.id} value={app.name}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPage} disabled={addPage.isPending}>
                {addPage.isPending ? 'Adding...' : 'Add Page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* CSV Upload Dialog */}
        <SitemapCSVUploadDialog
          open={csvDialogOpen}
          onOpenChange={setCsvDialogOpen}
          selectedApp={selectedApp}
          onSuccess={() => {
            refetch();
            toast.success('CSV imported with normalized URLs! Sitemap updated.');
          }}
        />

        {/* XML Import Dialog */}
        <SitemapImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
        />

        {/* Sandboxed Preview Dialog */}
        <DomainPreviewDialog
          domain={previewUrl}
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
        />
      </div>
    </TooltipProvider>
  );
}
