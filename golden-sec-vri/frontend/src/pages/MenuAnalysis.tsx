import { useEffect, useState } from 'react';
import { useAnalyzeMenuStructure, useGetCorrectedMenuStructure, useEnsureCriticalMenuItems } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Menu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  List, 
  Shield,
  Copy,
  ExternalLink,
  FileSearch,
  CheckSquare,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MenuAnalysis() {
  const { data: analysis, isLoading: analysisLoading, refetch: refetchAnalysis } = useAnalyzeMenuStructure();
  const { data: corrected, isLoading: correctedLoading, refetch: refetchCorrected } = useGetCorrectedMenuStructure();
  const ensureCritical = useEnsureCriticalMenuItems();
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetchAnalysis();
      refetchCorrected();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchAnalysis, refetchCorrected]);

  const handleEnsureCritical = async () => {
    try {
      await ensureCritical.mutateAsync();
      toast.success('Critical menu items ensured successfully');
      refetchAnalysis();
      refetchCorrected();
    } catch (error) {
      toast.error('Failed to ensure critical menu items');
      console.error(error);
    }
  };

  const handleCopyList = (list: string[]) => {
    navigator.clipboard.writeText(list.join('\n'));
    toast.success('List copied to clipboard');
  };

  if (analysisLoading || correctedLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const hasIssues = analysis && (
    !analysis.isAdminPresent || 
    analysis.missingCriticalPages.length > 0 || 
    analysis.hasDuplicates
  );

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <FileSearch className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Menu Structure Analysis</h1>
            <p className="text-muted-foreground">
              Analyze and validate all unique pages in the navigation menu
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
          </Button>
          <Button
            onClick={() => {
              refetchAnalysis();
              refetchCorrected();
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {analysis && (
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card className={`border-2 ${hasIssues ? 'border-destructive/50' : 'border-green-500/50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Unique Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Number(analysis.totalUniquePages)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Deduplicated menu entries
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${analysis.isAdminPresent ? 'border-green-500/50' : 'border-destructive/50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {analysis.isAdminPresent ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">Present</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-destructive" />
                    <span className="text-xl font-bold text-destructive">Missing</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                /admin page status
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${analysis.hasDuplicates ? 'border-destructive/50' : 'border-green-500/50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Duplicates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {analysis.hasDuplicates ? (
                  <>
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <span className="text-xl font-bold text-destructive">
                      {analysis.duplicateUrls.length}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">None</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Duplicate URL entries
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${analysis.missingCriticalPages.length > 0 ? 'border-destructive/50' : 'border-green-500/50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Missing Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {analysis.missingCriticalPages.length > 0 ? (
                  <>
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <span className="text-xl font-bold text-destructive">
                      {analysis.missingCriticalPages.length}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">None</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Missing essential pages
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Issues Alert */}
      {hasIssues && analysis && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Menu Structure Issues Detected</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>The following issues were found in the menu structure:</p>
            <ul className="list-disc list-inside space-y-1">
              {!analysis.isAdminPresent && (
                <li><strong>/admin</strong> page is missing from the menu</li>
              )}
              {analysis.missingCriticalPages.length > 0 && (
                <li>
                  <strong>{analysis.missingCriticalPages.length}</strong> critical page(s) missing: {analysis.missingCriticalPages.join(', ')}
                </li>
              )}
              {analysis.hasDuplicates && (
                <li>
                  <strong>{analysis.duplicateUrls.length}</strong> duplicate URL(s) found: {analysis.duplicateUrls.join(', ')}
                </li>
              )}
            </ul>
            <div className="mt-4">
              <Button
                onClick={handleEnsureCritical}
                disabled={ensureCritical.isPending}
                className="gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                {ensureCritical.isPending ? 'Fixing...' : 'Fix Issues Automatically'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {!hasIssues && analysis && (
        <Alert className="mb-8 border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-600 dark:text-green-400">Menu Structure Valid</AlertTitle>
          <AlertDescription className="text-green-600/80 dark:text-green-400/80">
            All critical pages are present, no duplicates found, and the menu structure is properly configured.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Menu Items */}
        {analysis && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Menu className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Current Menu Items</CardTitle>
                    <CardDescription>
                      All menu entries ({analysis.menuItems.length} total)
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyList(analysis.uniquePages)}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy URLs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-[80px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.menuItems.map((item) => {
                      const isDuplicate = analysis.duplicateUrls.includes(item.url);
                      const isCritical = ['/features', '/dashboard', '/admin'].includes(item.url);
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">
                            {Number(item.order)}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {item.title}
                              {isCritical && (
                                <Badge variant="outline" className="text-xs">
                                  Critical
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={item.url}
                              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                            >
                              {item.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell>
                            {isDuplicate ? (
                              <Badge variant="destructive" className="text-xs">
                                Duplicate
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
                                OK
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unique Pages List */}
        {analysis && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <List className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Unique Pages</CardTitle>
                    <CardDescription>
                      Deduplicated list ({analysis.uniquePages.length} unique)
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyList(analysis.uniquePages)}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.uniquePages.map((url, index) => {
                  const isCritical = ['/features', '/dashboard', '/admin'].includes(url);
                  const isAdmin = url === '/admin';
                  
                  return (
                    <div
                      key={url}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        isAdmin ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground w-8">
                          {index + 1}.
                        </span>
                        <a
                          href={url}
                          className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Badge variant="default" className="text-xs gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                        {isCritical && !isAdmin && (
                          <Badge variant="outline" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Corrected Structure */}
        {corrected && (
          <Card className="border-2 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Corrected Menu Structure</CardTitle>
                  <CardDescription>
                    Proposed structure with all critical pages and no duplicates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {corrected.addedPages.length > 0 && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-600 dark:text-green-400">
                      Pages to Add
                    </AlertTitle>
                    <AlertDescription className="text-green-600/80 dark:text-green-400/80">
                      The following pages will be added: {corrected.addedPages.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}

                {corrected.removedDuplicates.length > 0 && (
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-600 dark:text-yellow-400">
                      Duplicates to Remove
                    </AlertTitle>
                    <AlertDescription className="text-yellow-600/80 dark:text-yellow-400/80">
                      The following duplicate URLs will be removed: {corrected.removedDuplicates.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Order</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {corrected.correctedMenuItems.map((item) => {
                        const isNew = corrected.addedPages.includes(item.url);
                        const isCritical = ['/features', '/dashboard', '/admin'].includes(item.url);
                        
                        return (
                          <TableRow key={item.id} className={isNew ? 'bg-green-500/5' : ''}>
                            <TableCell className="font-mono text-xs">
                              {Number(item.order)}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {item.title}
                                {isCritical && (
                                  <Badge variant="outline" className="text-xs">
                                    Critical
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <a
                                href={item.url}
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                {item.url}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                            <TableCell>
                              {isNew ? (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  New
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Existing
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
