import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, CheckCircle2, AlertCircle, FileText, Trash2, Database, Shield, Archive, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useGetDeduplicationResults, useRunDeduplication, useGetAllSpecConversions } from '../hooks/useQueries';

export default function DeduplicationPanel() {
  const { data: deduplicationResults, isLoading: resultsLoading } = useGetDeduplicationResults();
  const { data: specConversions, isLoading: conversionsLoading } = useGetAllSpecConversions();
  const runDeduplication = useRunDeduplication();

  const handleDeduplication = async () => {
    try {
      toast.info('Starting deduplication process...');
      await runDeduplication.mutateAsync();
      toast.success('Deduplication completed successfully');
    } catch (error: any) {
      toast.error(`Deduplication failed: ${error.message}`);
      console.error('Deduplication error:', error);
    }
  };

  const latestResult = deduplicationResults && deduplicationResults.length > 0 
    ? deduplicationResults[deduplicationResults.length - 1] 
    : null;

  const totalSpecFiles = specConversions?.length || 0;

  if (resultsLoading || conversionsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/spec-deduplication-flowchart.dim_700x500.png"
            alt="Deduplication System"
            className="h-12 w-auto rounded"
          />
          <div>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Spec File Deduplication System
            </CardTitle>
            <CardDescription>
              Content-based duplicate detection and removal for spec.md and spec.yaml files using SHA-256 hashing
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deduplication Overview */}
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Advanced Deduplication Process</AlertTitle>
          <AlertDescription className="text-sm space-y-1">
            <p>• <strong>Content Hash Validation:</strong> SHA-256 hashing identifies duplicate specifications across different filenames</p>
            <p>• <strong>Canonical Spec Retention:</strong> Maintains one canonical copy per workflow spec group while removing duplicates</p>
            <p>• <strong>Reference Integrity Validation:</strong> Ensures deduplication does not break spec.ml or .yaml links or manifest references</p>
            <p>• <strong>Post-Deduplication Schema Validation:</strong> Re-runs schema validation and manifest generation for retained canonical specs</p>
            <p>• <strong>Pre-Deduplication Backup:</strong> Automatic backup of all specs before deduplication to support restore if rollback is required</p>
            <p>• <strong>Comprehensive Audit Trail:</strong> Detailed logging of all deduplication operations, removed duplicates, and storage reclaimed</p>
          </AlertDescription>
        </Alert>

        {/* Current System Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Spec Files</span>
            </div>
            <p className="text-2xl font-bold">{totalSpecFiles}</p>
            <p className="text-xs text-muted-foreground mt-1">In system</p>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Archive className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Deduplication Runs</span>
            </div>
            <p className="text-2xl font-bold">{deduplicationResults?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total executions</p>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Backup Protection</span>
            </div>
            <p className="text-2xl font-bold">Active</p>
            <p className="text-xs text-muted-foreground mt-1">Auto-backup enabled</p>
          </div>
        </div>

        {/* Deduplication Action */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div className="flex-1">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Run Deduplication
            </h3>
            <p className="text-sm text-muted-foreground">
              Scan all spec.md files, identify duplicates using SHA-256 content hashing, and remove redundant copies while preserving canonical versions
            </p>
            <Alert className="mt-3">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Safety:</strong> All specs are automatically backed up before deduplication. Reference integrity and manifest data are preserved.
              </AlertDescription>
            </Alert>
          </div>
          <Button
            onClick={handleDeduplication}
            disabled={runDeduplication.isPending}
            className="ml-4"
            size="lg"
          >
            {runDeduplication.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Hash className="h-4 w-4 mr-2" />
                Start Deduplication
              </>
            )}
          </Button>
        </div>

        {/* Latest Deduplication Results */}
        {latestResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Latest Deduplication Results
              </h3>
              <Badge variant="outline">
                {new Date(Number(latestResult.timestamp)).toLocaleString()}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <span className="text-sm font-medium">Duplicates Removed</span>
                </div>
                <p className="text-2xl font-bold text-destructive">{latestResult.removedDuplicates.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Redundant files deleted</p>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Canonical Specs Preserved</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{latestResult.canonicalSpecs.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Unique specifications retained</p>
              </div>

              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Storage Reclaimed</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{Number(latestResult.storageReclaimed)} bytes</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(Number(latestResult.storageReclaimed) / 1024 / 1024).toFixed(2)} MB freed
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium">Affected File Paths</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">{latestResult.affectedFilePaths.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Files processed</p>
              </div>

              <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-950">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Efficiency Gain</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {latestResult.affectedFilePaths.length > 0
                    ? ((latestResult.removedDuplicates.length / latestResult.affectedFilePaths.length) * 100).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Duplicate reduction</p>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Reference Integrity</span>
                </div>
                <p className="text-2xl font-bold text-green-600">Validated</p>
                <p className="text-xs text-muted-foreground mt-1">All links preserved</p>
              </div>
            </div>

            {/* Removed Duplicates List */}
            {latestResult.removedDuplicates.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  Removed Duplicate Files
                </h4>
                <ScrollArea className="h-64 rounded-lg border">
                  <div className="p-4 space-y-2">
                    {latestResult.removedDuplicates.map((filename, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-xs">{filename}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Canonical Specs List */}
            {latestResult.canonicalSpecs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Preserved Canonical Specifications
                </h4>
                <ScrollArea className="h-64 rounded-lg border">
                  <div className="p-4 space-y-2">
                    {latestResult.canonicalSpecs.map((filename, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 rounded bg-green-50 dark:bg-green-950">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-mono text-xs">{filename}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <img
              src="/assets/generated/reference-integrity-dashboard.dim_700x500.png"
              alt="Reference Integrity Validation"
              className="w-full rounded-lg border"
            />
          </div>
        )}

        {/* Deduplication History */}
        {deduplicationResults && deduplicationResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Deduplication History
            </h3>
            <ScrollArea className="h-96 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Duplicates Removed</TableHead>
                    <TableHead className="text-right">Canonical Specs</TableHead>
                    <TableHead className="text-right">Storage Reclaimed</TableHead>
                    <TableHead className="text-right">Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deduplicationResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">
                        {new Date(Number(result.timestamp)).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="destructive">{result.removedDuplicates.length}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                          {result.canonicalSpecs.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {(Number(result.storageReclaimed) / 1024 / 1024).toFixed(2)} MB
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {result.affectedFilePaths.length > 0
                            ? ((result.removedDuplicates.length / result.affectedFilePaths.length) * 100).toFixed(1)
                            : '0.0'}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {/* Deduplication Features */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Deduplication Features & Safeguards</h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Content Hash Validation</span>
              </div>
              <p className="text-xs text-muted-foreground">
                SHA-256 content hashing identifies duplicate specifications across different filenames with cryptographic accuracy
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-sm">Canonical Spec Retention</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maintains one canonical copy per workflow spec group while removing all duplicate versions
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-sm">Manifest Preservation</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Version, checksum, and dependencies maintained during deduplication process with full integrity
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-sm">Reference Integrity Validation</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ensures deduplication does not break associated spec.ml or .yaml links or manifest references
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-sm">Pre-Deduplication Backup</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Automatic backup of all specs before deduplication to support restore if rollback is required
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-sm">Post-Deduplication Validation</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Re-runs schema validation and manifest generation for retained canonical specs to ensure integrity
              </p>
            </div>
          </div>
        </div>

        <img
          src="/assets/generated/deduplication-audit-log.dim_800x600.png"
          alt="Deduplication Audit Log"
          className="w-full rounded-lg border"
        />
      </CardContent>
    </Card>
  );
}
