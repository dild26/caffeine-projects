import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, FileText, AlertCircle, CheckCircle, XCircle, Hash, Calendar, Search, TrendingUp } from 'lucide-react';
import { useGetAllImportReports } from '../hooks/useQueries';
import { TemplateFileType } from '../backend';

export default function ImportReportsViewer() {
  const { data: reports, isLoading } = useGetAllImportReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reports) return null;

    const totalReports = reports.length;
    const successCount = reports.filter(r => r.status === 'success').length;
    const warningCount = reports.filter(r => r.status === 'warning').length;
    const errorCount = reports.filter(r => r.status === 'error').length;
    const totalSize = reports.reduce((sum, r) => sum + Number(r.size), 0);
    
    // File type breakdown
    const fileTypeMap = new Map<TemplateFileType, number>();
    reports.forEach(r => {
      fileTypeMap.set(r.fileType, (fileTypeMap.get(r.fileType) || 0) + 1);
    });

    // Error summary
    const errorMap = new Map<string, number>();
    reports.forEach(r => {
      r.errors.forEach(error => {
        errorMap.set(error, (errorMap.get(error) || 0) + 1);
      });
    });

    // Warning summary
    const warningMap = new Map<string, number>();
    reports.forEach(r => {
      r.warnings.forEach(warning => {
        warningMap.set(warning, (warningMap.get(warning) || 0) + 1);
      });
    });

    // Hash deduplication
    const uniqueHashes = new Set(reports.map(r => r.hash));
    const duplicateCount = totalReports - uniqueHashes.size;

    return {
      totalReports,
      successCount,
      warningCount,
      errorCount,
      totalSize,
      fileTypeBreakdown: Array.from(fileTypeMap.entries()),
      errorSummary: Array.from(errorMap.entries()).sort((a, b) => b[1] - a[1]),
      warningSummary: Array.from(warningMap.entries()).sort((a, b) => b[1] - a[1]),
      duplicateCount,
      uniqueHashes: uniqueHashes.size,
    };
  }, [reports]);

  // Filter reports
  const filteredReports = useMemo(() => {
    if (!reports) return [];

    let filtered = reports;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.fileName.toLowerCase().includes(query) ||
        r.hash.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [reports, searchQuery, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getFileTypeBadge = (fileType: TemplateFileType) => {
    const colors: Record<string, string> = {
      [TemplateFileType.markdown]: 'bg-blue-500/10 text-blue-500',
      [TemplateFileType.json]: 'bg-green-500/10 text-green-500',
      [TemplateFileType.solidity]: 'bg-purple-500/10 text-purple-500',
      [TemplateFileType.text]: 'bg-gray-500/10 text-gray-500',
    };

    return (
      <Badge variant="outline" className={colors[fileType] || ''}>
        {fileType}
      </Badge>
    );
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold">No Import Reports</h3>
        <p className="text-muted-foreground">
          Upload templates to see import reports and analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {stats && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Imports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalReports}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {stats.totalReports > 0 ? Math.round((stats.successCount / stats.totalReports) * 100) : 0}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatSize(stats.totalSize)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Unique Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.uniqueHashes}</div>
                    {stats.duplicateCount > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {stats.duplicateCount} duplicate(s)
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-green-500">{stats.successCount}</div>
                      <div className="text-sm text-muted-foreground">Success</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-500">{stats.warningCount}</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-red-500">{stats.errorCount}</div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Type Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>File Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.fileTypeBreakdown.map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileTypeBadge(type)}
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by filename or hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Badge
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Badge>
              <Badge
                variant={statusFilter === 'success' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter('success')}
              >
                Success
              </Badge>
              <Badge
                variant={statusFilter === 'warning' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter('warning')}
              >
                Warnings
              </Badge>
              <Badge
                variant={statusFilter === 'error' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setStatusFilter('error')}
              >
                Errors
              </Badge>
            </div>
          </div>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Import History ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredReports.map((report, index) => (
                    <div key={report.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{report.fileName}</span>
                          </div>
                          {getStatusIcon(report.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>{' '}
                            {getFileTypeBadge(report.fileType)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Size:</span>{' '}
                            <span>{formatSize(Number(report.size))}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Hash:</span>{' '}
                            <span className="font-mono text-xs break-all">{report.hash}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Date:</span>{' '}
                            <span className="text-xs">{formatDate(report.createdAt)}</span>
                          </div>
                        </div>

                        {report.extractedFields.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Extracted Fields ({report.extractedFields.length}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {report.extractedFields.map((field, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {report.codeBlocks.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Code Blocks: {report.codeBlocks.length}</p>
                          </div>
                        )}

                        {report.errors.length > 0 && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <ul className="list-disc pl-4 text-xs">
                                {report.errors.map((error, idx) => (
                                  <li key={idx}>{error}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        {report.warnings.length > 0 && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <ul className="list-disc pl-4 text-xs">
                                {report.warnings.map((warning, idx) => (
                                  <li key={idx}>{warning}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <>
              {/* Error Summary */}
              {stats.errorSummary.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Common Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.errorSummary.slice(0, 10).map(([error, count], idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-red-500/5 rounded">
                          <span className="text-sm flex-1">{error}</span>
                          <Badge variant="destructive">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warning Summary */}
              {stats.warningSummary.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      Common Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.warningSummary.slice(0, 10).map(([warning, count], idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-yellow-500/5 rounded">
                          <span className="text-sm flex-1">{warning}</span>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Deduplication Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    SHA-256 Deduplication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{stats.uniqueHashes}</div>
                        <div className="text-sm text-muted-foreground">Unique Files</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{stats.duplicateCount}</div>
                        <div className="text-sm text-muted-foreground">Duplicates Detected</div>
                      </div>
                    </div>
                    <Alert>
                      <Hash className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        All files are hashed using SHA-256 after normalization (NFKC, LF). 
                        Duplicate content is automatically detected and flagged during import.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
