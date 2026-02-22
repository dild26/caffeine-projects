import { useGetManifestLog } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, AlertCircle, AlertTriangle, FileText, Clock } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ManifestStats {
  total: number;
  successes: number;
  warnings: number;
  failures: number;
  recentEntries: any[];
}

interface ParsedManifestDetails {
  basename?: string;
  file_name?: string;
  type?: string;
  paired?: boolean;
  pair_file?: string;
  error?: string;
  validationError?: string;
  validationWarning?: string;
  steps?: Array<{
    step: string;
    status: string;
    error?: string;
  }>;
  [key: string]: any;
}

export default function ManifestHealthPanel() {
  const { data: manifestLog = [] } = useGetManifestLog();
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');

  // Parse manifest entries and categorize
  const stats: ManifestStats = manifestLog.reduce(
    (acc, entry) => {
      acc.total++;
      
      try {
        const details = JSON.parse(entry.details);
        
        // Categorize by action type
        if (entry.action.includes('SUCCESS') || entry.action.includes('COMPLETED')) {
          acc.successes++;
        } else if (entry.action.includes('WARNING') || entry.action.includes('UNPAIRED')) {
          acc.warnings++;
        } else if (entry.action.includes('ERROR') || entry.action.includes('FAILED')) {
          acc.failures++;
        }
        
        // Add to recent entries
        if (acc.recentEntries.length < 10) {
          acc.recentEntries.push({ ...entry, parsedDetails: details });
        }
      } catch (e) {
        // If parsing fails, treat as raw entry
        if (acc.recentEntries.length < 10) {
          acc.recentEntries.push({ ...entry, parsedDetails: null });
        }
      }
      
      return acc;
    },
    { total: 0, successes: 0, warnings: 0, failures: 0, recentEntries: [] as any[] }
  );

  const filteredEntries = manifestLog.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'success') return entry.action.includes('SUCCESS') || entry.action.includes('COMPLETED');
    if (filter === 'warning') return entry.action.includes('WARNING') || entry.action.includes('UNPAIRED');
    if (filter === 'error') return entry.action.includes('ERROR') || entry.action.includes('FAILED');
    return true;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('SUCCESS') || action.includes('COMPLETED')) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (action.includes('WARNING') || action.includes('UNPAIRED')) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else if (action.includes('ERROR') || action.includes('FAILED')) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const getActionBadge = (action: string) => {
    if (action.includes('SUCCESS') || action.includes('COMPLETED')) {
      return <Badge variant="default" className="bg-green-500">Success</Badge>;
    } else if (action.includes('WARNING') || action.includes('UNPAIRED')) {
      return <Badge variant="secondary" className="bg-amber-500 text-white">Warning</Badge>;
    } else if (action.includes('ERROR') || action.includes('FAILED')) {
      return <Badge variant="destructive">Error</Badge>;
    }
    return <Badge variant="outline">Info</Badge>;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manifest Health Dashboard</CardTitle>
          <CardDescription>
            Real-time monitoring of file pairing, parsing, and validation operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Total Operations</p>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Successes</p>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.successes}</p>
            </div>
            <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Warnings</p>
              </div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.warnings}</p>
            </div>
            <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Failures</p>
              </div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.failures}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manifest Log</CardTitle>
          <CardDescription>
            Detailed log of all file operations with pairing status, validation results, and errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" onClick={() => setFilter('all')}>
                All ({manifestLog.length})
              </TabsTrigger>
              <TabsTrigger value="success" onClick={() => setFilter('success')}>
                Success ({stats.successes})
              </TabsTrigger>
              <TabsTrigger value="warning" onClick={() => setFilter('warning')}>
                Warnings ({stats.warnings})
              </TabsTrigger>
              <TabsTrigger value="error" onClick={() => setFilter('error')}>
                Errors ({stats.failures})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={filter} className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No manifest entries found for this filter
                    </div>
                  ) : (
                    filteredEntries.map((entry, index) => {
                      let parsedDetails: ParsedManifestDetails | null = null;
                      try {
                        parsedDetails = JSON.parse(entry.details) as ParsedManifestDetails;
                      } catch (e) {
                        // Ignore parse errors
                      }

                      return (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getActionIcon(entry.action)}
                              <div>
                                <p className="font-medium">{entry.action}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(entry.timestamp)}
                                </p>
                              </div>
                            </div>
                            {getActionBadge(entry.action)}
                          </div>
                          
                          {parsedDetails && (
                            <div className="mt-2 p-3 bg-muted/50 rounded text-xs font-mono">
                              <div className="space-y-1">
                                {parsedDetails.basename && (
                                  <div><strong>Basename:</strong> {parsedDetails.basename}</div>
                                )}
                                {parsedDetails.file_name && (
                                  <div><strong>File:</strong> {parsedDetails.file_name}</div>
                                )}
                                {parsedDetails.type && (
                                  <div><strong>Type:</strong> {parsedDetails.type}</div>
                                )}
                                {parsedDetails.paired !== undefined && (
                                  <div>
                                    <strong>Paired:</strong> {parsedDetails.paired ? '✓ Yes' : '✗ No'}
                                    {parsedDetails.pair_file && ` (with ${parsedDetails.pair_file})`}
                                  </div>
                                )}
                                {parsedDetails.error && (
                                  <div className="text-red-600 dark:text-red-400">
                                    <strong>Error:</strong> {parsedDetails.error}
                                  </div>
                                )}
                                {parsedDetails.validationError && (
                                  <div className="text-red-600 dark:text-red-400">
                                    <strong>Validation Error:</strong> {parsedDetails.validationError}
                                  </div>
                                )}
                                {parsedDetails.validationWarning && (
                                  <div className="text-amber-600 dark:text-amber-400">
                                    <strong>Validation Warning:</strong> {parsedDetails.validationWarning}
                                  </div>
                                )}
                                {parsedDetails.steps && (
                                  <div className="mt-2">
                                    <strong>Processing Steps:</strong>
                                    <div className="ml-4 mt-1 space-y-1">
                                      {parsedDetails.steps.map((step, i) => (
                                        <div key={i}>
                                          {step.step}: <Badge variant="outline" className="text-xs">{step.status}</Badge>
                                          {step.error && <span className="text-red-600 ml-2">({step.error})</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

