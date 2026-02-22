import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  useGetSpecFiles,
  useRunDeduplicationCheck,
  useDeduplicateSpecFiles,
  useGetDeduplicationLogs,
  useGetDeduplicationStatistics,
  useCompareSchemaRevisions,
  useNormalizeSpecFile,
} from '../../hooks/useQueries';
import {
  FileText,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
  FileCheck,
  Merge,
  Database,
  GitCompare,
  Layers,
} from 'lucide-react';

export default function SpecDeduplication() {
  const { data: specFiles, isLoading: specFilesLoading } = useGetSpecFiles();
  const { data: deduplicationLogs, isLoading: logsLoading } = useGetDeduplicationLogs();
  const { data: statistics, isLoading: statsLoading } = useGetDeduplicationStatistics();
  const runDeduplicationCheck = useRunDeduplicationCheck();
  const deduplicateSpecFiles = useDeduplicateSpecFiles();
  const compareSchemaRevisions = useCompareSchemaRevisions();
  const normalizeSpecFile = useNormalizeSpecFile();

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunDeduplicationCheck = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await runDeduplicationCheck.mutateAsync();
      clearInterval(interval);
      setProgress(100);

      toast.success(result.result);
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      toast.error('Failed to run deduplication check');
    }
  };

  const handleDeduplicateSelected = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to deduplicate');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await deduplicateSpecFiles.mutateAsync(selectedFiles);
      clearInterval(interval);
      setProgress(100);

      toast.success(result.result);
      setSelectedFiles([]);
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      toast.error('Failed to deduplicate files');
    }
  };

  const handleNormalizeFile = async (fileId: string) => {
    try {
      await normalizeSpecFile.mutateAsync(fileId);
      toast.success('File normalized to YAML format successfully');
    } catch (error) {
      toast.error('Failed to normalize file');
    }
  };

  const handleCompareRevisions = async (fileId1: string, fileId2: string) => {
    try {
      const result = await compareSchemaRevisions.mutateAsync({ fileId1, fileId2 });
      toast.info(result);
    } catch (error) {
      toast.error('Failed to compare schema revisions');
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Badge variant="secondary">Uploaded</Badge>;
      case 'converted':
        return <Badge variant="outline">Converted</Badge>;
      case 'validated':
        return <Badge variant="default">Validated</Badge>;
      case 'normalized':
        return <Badge className="bg-green-500 hover:bg-green-600">Normalized</Badge>;
      case 'promoted':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Promoted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'yaml':
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'ml':
        return <Database className="h-4 w-4 text-blue-500" />;
      case 'md':
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const groupedFiles = specFiles?.reduce((acc, file) => {
    const baseName = file.fileName.replace(/\.(md|ml|yaml)$/, '');
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(file);
    return acc;
  }, {} as Record<string, typeof specFiles>);

  if (specFilesLoading || statsLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p>Loading deduplication data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/deduplication-process-icon-transparent.dim_64x64.png"
                alt="Deduplication"
                className="h-6 w-6"
              />
              <CardTitle>Specification Deduplication System</CardTitle>
            </div>
          </div>
          <CardDescription>
            Identify and remove redundant or outdated specification files to maintain a single source of truth with
            schema validation and normalization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>Background Validation & Schema Revision Comparison</AlertTitle>
            <AlertDescription>
              The system automatically compares schema revisions and discards duplicate or conflicting data during
              validation and ingestion. Background validation jobs run during uploads to check for redundant or
              outdated spec files before allowing ingestion. All deduplication actions are logged in the manifest
              system for full auditability.
            </AlertDescription>
          </Alert>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Specs</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(statistics.totalSpecFiles)}</div>
                  <p className="text-xs text-muted-foreground">All specification files</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Normalized</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(statistics.normalizedFiles)}</div>
                  <p className="text-xs text-muted-foreground">YAML normalized</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Duplicate Groups</CardTitle>
                  <Layers className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(statistics.duplicateGroups)}</div>
                  <p className="text-xs text-muted-foreground">Groups identified</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(statistics.pendingDeduplication)}</div>
                  <p className="text-xs text-muted-foreground">Awaiting deduplication</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={handleRunDeduplicationCheck}
              disabled={isProcessing || runDeduplicationCheck.isPending}
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Deduplication Check
            </Button>
            <Button
              onClick={handleDeduplicateSelected}
              disabled={isProcessing || selectedFiles.length === 0 || deduplicateSpecFiles.isPending}
              variant="outline"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deduplicate Selected ({selectedFiles.length})
            </Button>
          </div>

          {isProcessing && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing deduplication...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Grouped Specification Files */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <img
                src="/assets/generated/schema-revision-icon-transparent.dim_64x64.png"
                alt="Schema Revision"
                className="h-5 w-5"
              />
              Specification Files by Group
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              {groupedFiles && Object.keys(groupedFiles).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedFiles).map(([baseName, files]) => (
                    <div key={baseName} className="p-4 border rounded-lg bg-card space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-base flex items-center gap-2">
                          <Merge className="h-4 w-4 text-blue-500" />
                          {baseName}
                        </h4>
                        {files.length > 1 && (
                          <Badge variant="destructive" className="text-xs">
                            {files.length} versions found
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-start justify-between p-3 border rounded bg-muted/30"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <Checkbox
                                checked={selectedFiles.includes(file.id)}
                                onCheckedChange={() => toggleFileSelection(file.id)}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getFileTypeIcon(file.fileType)}
                                  <span className="font-medium text-sm">{file.fileName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    .{file.fileType}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    Rev {Number(file.schemaRevision)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Uploaded: {new Date(Number(file.uploadTime) / 1000000).toLocaleString()}
                                </p>
                                {file.conversionLog && (
                                  <p className="text-xs text-muted-foreground mt-1 italic">
                                    {file.conversionLog}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(file.validationStatus)}
                              {file.fileType !== 'yaml' && file.validationStatus !== 'normalized' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleNormalizeFile(file.id)}
                                  disabled={normalizeSpecFile.isPending}
                                >
                                  <Merge className="h-3 w-3 mr-1" />
                                  Normalize
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {files.length > 1 && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/20 p-2 rounded">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            Multiple versions detected - select files to deduplicate and maintain single source of
                            truth
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                  <p>No specification files found</p>
                  <p className="text-sm mt-2">Upload spec files to start deduplication process</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Deduplication Logs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <img
                src="/assets/generated/audit-trail-icon-transparent.dim_64x64.png"
                alt="Audit Trail"
                className="h-5 w-5"
              />
              Deduplication Audit Trail
            </h3>
            <ScrollArea className="h-[300px] pr-4">
              {!logsLoading && deduplicationLogs && deduplicationLogs.length > 0 ? (
                <div className="space-y-3">
                  {deduplicationLogs.map((log) => (
                    <div key={log.id} className="p-3 border rounded-lg bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm capitalize">{log.action}</span>
                            <Badge variant="outline" className="text-xs">
                              Rev {Number(log.schemaRevision)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm mb-2">
                        <p className="text-muted-foreground">{log.result}</p>
                      </div>
                      {log.affectedFiles.length > 0 && (
                        <div className="text-xs bg-muted p-2 rounded">
                          <p className="font-medium mb-1">Affected Files ({log.affectedFiles.length}):</p>
                          <p className="text-muted-foreground">{log.affectedFiles.join(', ')}</p>
                        </div>
                      )}
                      {log.normalizedFileId && (
                        <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                          <FileCheck className="h-3 w-3" />
                          <span>Normalized file: {log.normalizedFileId}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No deduplication logs yet</p>
                  <p className="text-sm mt-2">Run deduplication checks to generate audit trail</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <Alert className="mt-6">
            <RefreshCw className="h-4 w-4" />
            <AlertTitle>Automated Deduplication Process</AlertTitle>
            <AlertDescription className="text-sm">
              The deduplication system runs background validation jobs during uploads to identify redundant or
              outdated spec files. Schema revisions are compared automatically, and duplicate or conflicting data is
              discarded during validation. All actions are logged in the manifest system with normalization metadata
              for full auditability. Only the validated, normalized YAML version is retained as the single source of
              truth.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
