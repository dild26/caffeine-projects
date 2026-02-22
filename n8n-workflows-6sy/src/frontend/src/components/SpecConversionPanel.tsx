import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, CheckCircle2, AlertCircle, Clock, RefreshCw, FileText, Shield, Database, FileCheck, Hash } from 'lucide-react';
import { useGetAllSpecConversions, useGetSpecConversionReport, useRetrySpecConversion } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SpecConversionPanel() {
  const { data: conversions, isLoading: conversionsLoading } = useGetAllSpecConversions();
  const { data: report, isLoading: reportLoading } = useGetSpecConversionReport();
  const retryConversion = useRetrySpecConversion();

  const handleRetry = async (workflowId: string) => {
    try {
      await retryConversion.mutateAsync(workflowId);
      toast.success('Conversion retry initiated');
    } catch (error: any) {
      toast.error(`Failed to retry conversion: ${error.message}`);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  const getStatusIcon = (status: any) => {
    if (status.__kind__ === 'success') {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    } else if (status.__kind__ === 'error') {
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    } else {
      return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: any) => {
    if (status.__kind__ === 'success') {
      return <Badge variant="default" className="bg-green-600">Success</Badge>;
    } else if (status.__kind__ === 'error') {
      return <Badge variant="destructive">Error</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/admin-spec-conversion-panel.dim_800x600.png"
            alt="Spec Conversion"
            className="h-12 w-auto rounded"
          />
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Enhanced Spec Conversion with Schema Validation
            </CardTitle>
            <CardDescription>
              Automatic spec.md to YAML conversion with schema validation and manifest logging
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Conversion Statistics */}
        {reportLoading ? (
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : report ? (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-muted/50">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold">{Number(report.totalConversions)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">{Number(report.successfulConversions)}</p>
              <p className="text-xs text-muted-foreground">Successful</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-amber-50 dark:bg-amber-950">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-amber-500">{Number(report.pendingConversions)}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-2xl font-bold text-destructive">{Number(report.errorConversions)}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
        ) : null}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Schema Validation</TabsTrigger>
            <TabsTrigger value="manifest">Manifest Logs</TabsTrigger>
            <TabsTrigger value="status">Conversion Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Information Alert */}
            <Alert>
              <FileCode className="h-4 w-4" />
              <AlertTitle>Enhanced Conversion Pipeline</AlertTitle>
              <AlertDescription className="text-sm space-y-1">
                <p>• <strong>Schema Validation:</strong> All spec files are validated against a normalized YAML schema before ingestion</p>
                <p>• <strong>Manifest Logging:</strong> Every workflow includes version, checksum, and dependencies tracking</p>
                <p>• <strong>Duplicate Prevention:</strong> System checks for existing spec.ml or .yaml files before conversion</p>
                <p>• <strong>Error Tracking:</strong> All validation and conversion errors are logged with admin notifications</p>
                <p>• <strong>AI Pipeline Instructions:</strong> Precise ingestion rules eliminate ambiguity in spec file processing</p>
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-2 border-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <img
                      src="/assets/generated/yaml-conversion-flowchart.dim_600x400.png"
                      alt="YAML Conversion"
                      className="h-6 w-auto rounded"
                    />
                    YAML Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Robust parser converts spec.md to clean, normalized YAML format before ingestion
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <img
                      src="/assets/generated/schema-compliance-interface.dim_700x500.png"
                      alt="Schema Compliance"
                      className="h-6 w-auto rounded"
                    />
                    Schema Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive validation rules ensure all spec files meet required standards
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Schema Validation System</AlertTitle>
              <AlertDescription>
                All workflow and spec file uploads are validated against a normalized YAML schema with comprehensive validation rules.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Validation Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Upload Detection</p>
                      <p className="text-xs text-muted-foreground">System automatically detects spec.md files during upload</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">YAML Conversion</p>
                      <p className="text-xs text-muted-foreground">Robust parser converts spec.md to clean, normalized YAML format</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Schema Validation</p>
                      <p className="text-xs text-muted-foreground">Validates against comprehensive schema rules with error categorization</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Manifest Generation</p>
                      <p className="text-xs text-muted-foreground">Creates manifest with version, checksum, and dependencies</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">5</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Ingestion & Tracking</p>
                      <p className="text-xs text-muted-foreground">Consistent processing and tracking for all spec files (.md, .ml, .yaml)</p>
                    </div>
                  </div>
                </div>

                <img
                  src="/assets/generated/schema-validation-dashboard.dim_800x600.png"
                  alt="Schema Validation Dashboard"
                  className="w-full rounded-lg border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Validation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Required fields: title, version, description</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Version format validation (semantic versioning)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Dependency resolution and compatibility checking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Checksum integrity verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Schema evolution and backward compatibility</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manifest" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Manifest Logging System</AlertTitle>
              <AlertDescription>
                Every workflow includes comprehensive manifest logging with version tracking, checksum validation, and dependency management.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Manifest Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="font-semibold text-sm mb-1">Version Tracking</p>
                    <p className="text-xs text-muted-foreground">
                      Semantic versioning with compatibility checks and upgrade paths
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="font-semibold text-sm mb-1">Checksum Validation</p>
                    <p className="text-xs text-muted-foreground">
                      SHA-256 checksums ensure file integrity and detect tampering
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="font-semibold text-sm mb-1">Dependencies</p>
                    <p className="text-xs text-muted-foreground">
                      Track required libraries, APIs, and workflow dependencies
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="font-semibold text-sm mb-1">Metadata</p>
                    <p className="text-xs text-muted-foreground">
                      Author, creation date, last modified, and usage statistics
                    </p>
                  </div>
                </div>

                <img
                  src="/assets/generated/manifest-logging-interface.dim_700x500.png"
                  alt="Manifest Logging Interface"
                  className="w-full rounded-lg border"
                />

                <div className="p-4 rounded-lg border bg-muted/50 font-mono text-xs space-y-1">
                  <p className="text-muted-foreground">// Example Manifest Structure</p>
                  <p>{'{'}</p>
                  <p className="pl-4">"version": "1.0.0",</p>
                  <p className="pl-4">"checksum": "sha256:abc123...",</p>
                  <p className="pl-4">"dependencies": ["n8n@1.0.0", "axios@1.4.0"],</p>
                  <p className="pl-4">"author": "workflow-creator",</p>
                  <p className="pl-4">"created": "2025-11-03T12:00:00Z",</p>
                  <p className="pl-4">"validated": true</p>
                  <p>{'}'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            {/* Conversion Status Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Conversion Status & Validation Results</h3>
                {conversions && conversions.length > 0 && (
                  <Badge variant="secondary">{conversions.length} Workflows</Badge>
                )}
              </div>

              {conversionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : conversions && conversions.length > 0 ? (
                <ScrollArea className="h-[500px] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow ID</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead>Validation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conversions.map((conversion) => (
                        <TableRow key={conversion.workflowId}>
                          <TableCell className="font-mono text-xs">
                            {conversion.workflowId.substring(0, 16)}...
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {conversion.specMdExists && (
                                <Badge variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  .md
                                </Badge>
                              )}
                              {conversion.specMlExists && (
                                <Badge variant="default" className="text-xs bg-blue-600">
                                  <FileCode className="h-3 w-3 mr-1" />
                                  .ml
                                </Badge>
                              )}
                              {conversion.yamlExists && (
                                <Badge variant="default" className="text-xs bg-purple-600">
                                  <FileCode className="h-3 w-3 mr-1" />
                                  .yaml
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {conversion.conversionStatus.__kind__ === 'success' ? (
                              <Badge variant="default" className="bg-green-600 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Validated
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(conversion.conversionStatus)}
                              {getStatusBadge(conversion.conversionStatus)}
                            </div>
                            {conversion.conversionStatus.__kind__ === 'error' && (
                              <p className="text-xs text-destructive mt-1">
                                {conversion.conversionStatus.error}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(conversion.lastUpdated)}
                          </TableCell>
                          <TableCell>
                            {conversion.conversionStatus.__kind__ === 'error' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetry(conversion.workflowId)}
                                disabled={retryConversion.isPending}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                  <FileCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No spec conversions yet</p>
                  <p className="text-sm mt-1">Upload workflows with spec.md files to see conversions here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
