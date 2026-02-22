import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  useGetSpecFiles,
  useAddSpecFile,
  useProcessSpecFile,
  useValidateSpecFile,
  usePromoteSpecFileToLeaderboard,
  useGetManifestLogs,
  useAddManifestLog,
} from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SpecFile, ManifestLog } from '../../backend';
import {
  FileText,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  Shield,
  FileCode,
  Database,
  AlertCircle,
} from 'lucide-react';

export default function SpecificationManagement() {
  const { identity } = useInternetIdentity();
  const { data: specFiles, isLoading } = useGetSpecFiles();
  const { data: manifestLogs, isLoading: manifestLoading } = useGetManifestLogs();
  const addSpecFile = useAddSpecFile();
  const processSpecFile = useProcessSpecFile();
  const validateSpecFile = useValidateSpecFile();
  const promoteSpecFile = usePromoteSpecFileToLeaderboard();
  const addManifestLog = useAddManifestLog();

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileType, setFileType] = useState<'md' | 'ml' | 'yaml'>('md');

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName.trim() || !fileContent.trim()) {
      toast.error('Please provide file name and content');
      return;
    }

    try {
      const specFile: SpecFile = {
        id: `spec-${Date.now()}`,
        fileName: fileName.trim(),
        fileType,
        content: fileContent.trim(),
        uploadTime: BigInt(Date.now() * 1000000),
        uploader: identity!.getPrincipal(),
        validationStatus: 'uploaded',
        conversionLog: 'File uploaded successfully',
        schemaRevision: BigInt(0),
      };

      await addSpecFile.mutateAsync(specFile);

      // Create initial manifest log
      const manifestLog: ManifestLog = {
        id: specFile.id,
        fileName: specFile.fileName,
        fileType: specFile.fileType,
        validationStatus: 'uploaded',
        errors: '',
        schemaCompliance: 'pending',
        conversionLog: 'File uploaded, awaiting processing',
        uploadTime: specFile.uploadTime,
        uploader: identity!.getPrincipal(),
      };

      await addManifestLog.mutateAsync(manifestLog);

      toast.success('Specification file uploaded and logged in manifest');
      setFileName('');
      setFileContent('');
      setShowUploadForm(false);

      // Auto-process if it's a .md file
      if (fileType === 'md') {
        setTimeout(() => {
          handleProcess(specFile.id);
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to upload specification file');
    }
  };

  const handleProcess = async (specFileId: string) => {
    try {
      await processSpecFile.mutateAsync(specFileId);
      toast.success('Specification processed through conversion pipeline');
    } catch (error) {
      toast.error('Failed to process specification file');
    }
  };

  const handleValidate = async (specFileId: string) => {
    try {
      await validateSpecFile.mutateAsync(specFileId);
      toast.success('Specification validated against schema successfully');
    } catch (error) {
      toast.error('Failed to validate specification file');
    }
  };

  const handlePromote = async (specFileId: string) => {
    try {
      await promoteSpecFile.mutateAsync(specFileId);
      toast.success('Specification promoted to leaderboard successfully');
    } catch (error) {
      toast.error('Failed to promote specification file');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Badge variant="secondary">Uploaded</Badge>;
      case 'converted':
        return <Badge variant="outline">Converted</Badge>;
      case 'validated':
        return <Badge variant="default">Validated</Badge>;
      case 'promoted':
        return <Badge className="bg-green-500 hover:bg-green-600">Promoted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'converted':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'promoted':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'Schema validation passed':
        return <Badge variant="default" className="bg-green-500">Compliant</Badge>;
      case 'failed':
        return <Badge variant="destructive">Non-Compliant</Badge>;
      default:
        return <Badge variant="outline">{compliance}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p>Loading specification files...</p>
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
                src="/assets/generated/conversion-pipeline-icon-transparent.dim_64x64.png"
                alt="Conversion Pipeline"
                className="h-6 w-6"
              />
              <CardTitle>Specification Management & Validation</CardTitle>
            </div>
            <Button onClick={() => setShowUploadForm(!showUploadForm)} variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Spec
            </Button>
          </div>
          <CardDescription>
            Automated spec detection, conversion pipeline, schema validation, and manifest logging system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>Schema Validation Enforcement</AlertTitle>
            <AlertDescription>
              All uploaded spec files (.md, .ml, .yaml) are validated against the backend schema. The conversion
              pipeline automatically converts spec.md to normalized YAML format when no .ml or .yaml version exists.
              Only schema-compliant, manifest-logged files are processed for feature extraction and leaderboard
              promotion.
            </AlertDescription>
          </Alert>

          {showUploadForm && (
            <form onSubmit={handleFileUpload} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., spec.md, spec.ml, spec.yaml"
                />
              </div>
              <div>
                <Label htmlFor="fileType">File Type</Label>
                <select
                  id="fileType"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as 'md' | 'ml' | 'yaml')}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="md">.md (Markdown)</option>
                  <option value="ml">.ml (Machine Learning)</option>
                  <option value="yaml">.yaml (YAML)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="fileContent">File Content</Label>
                <Textarea
                  id="fileContent"
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="Paste your specification content here"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addSpecFile.isPending}>
                  {addSpecFile.isPending ? 'Uploading...' : 'Upload & Log to Manifest'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <Tabs defaultValue="specs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specs">
                <FileCode className="mr-2 h-4 w-4" />
                Specification Files
              </TabsTrigger>
              <TabsTrigger value="manifest">
                <Database className="mr-2 h-4 w-4" />
                Manifest Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs">
              <ScrollArea className="h-[500px] pr-4">
                {specFiles && specFiles.length > 0 ? (
                  <div className="space-y-4">
                    {specFiles.map((specFile) => (
                      <div key={specFile.id} className="p-4 border rounded-lg space-y-3 bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(specFile.validationStatus)}
                              <h3 className="font-semibold">{specFile.fileName}</h3>
                              <Badge variant="outline" className="text-xs">
                                .{specFile.fileType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Uploaded: {new Date(Number(specFile.uploadTime) / 1000000).toLocaleString()}
                            </p>
                            {specFile.conversionLog && (
                              <div className="text-xs bg-muted p-2 rounded space-y-1">
                                <p className="font-medium">Conversion Log:</p>
                                <p className="text-muted-foreground">{specFile.conversionLog}</p>
                              </div>
                            )}
                          </div>
                          {getStatusBadge(specFile.validationStatus)}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {specFile.fileType === 'md' && specFile.validationStatus === 'uploaded' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProcess(specFile.id)}
                              disabled={processSpecFile.isPending}
                            >
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Process Pipeline
                            </Button>
                          )}

                          {(specFile.validationStatus === 'converted' || 
                            (specFile.fileType !== 'md' && specFile.validationStatus === 'uploaded')) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleValidate(specFile.id)}
                              disabled={validateSpecFile.isPending}
                            >
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Validate Schema
                            </Button>
                          )}

                          {specFile.validationStatus === 'validated' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handlePromote(specFile.id)}
                              disabled={promoteSpecFile.isPending}
                            >
                              <TrendingUp className="mr-2 h-3 w-3" />
                              Promote to Leaderboard
                            </Button>
                          )}

                          {specFile.validationStatus === 'promoted' && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <img
                                src="/assets/generated/schema-validation-badge-transparent.dim_80x80.png"
                                alt="Schema Validated"
                                className="h-5 w-5"
                              />
                              <span className="font-medium">Schema-Compliant & Promoted</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No specification files uploaded yet</p>
                    <p className="text-sm mt-2">Upload a spec file to start the validation pipeline</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="manifest">
              <ScrollArea className="h-[500px] pr-4">
                {manifestLoading ? (
                  <div className="text-center py-12">
                    <p>Loading manifest logs...</p>
                  </div>
                ) : manifestLogs && manifestLogs.length > 0 ? (
                  <div className="space-y-4">
                    {manifestLogs.map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg space-y-3 bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src="/assets/generated/manifest-log-icon-transparent.dim_64x64.png"
                                alt="Manifest Log"
                                className="h-5 w-5"
                              />
                              <h3 className="font-semibold">{log.fileName}</h3>
                              <Badge variant="outline" className="text-xs">
                                .{log.fileType}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                <span className="text-muted-foreground">Status:</span>{' '}
                                {getStatusBadge(log.validationStatus)}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Schema:</span>{' '}
                                {getComplianceBadge(log.schemaCompliance)}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Logged: {new Date(Number(log.uploadTime) / 1000000).toLocaleString()}
                            </p>
                            {log.errors && (
                              <Alert variant="destructive" className="mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Validation Errors</AlertTitle>
                                <AlertDescription className="text-xs">{log.errors}</AlertDescription>
                              </Alert>
                            )}
                            {log.conversionLog && (
                              <div className="text-xs bg-muted p-2 rounded mt-2">
                                <p className="font-medium mb-1">Conversion Log:</p>
                                <p className="text-muted-foreground">{log.conversionLog}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No manifest logs recorded yet</p>
                    <p className="text-sm mt-2">Upload and process spec files to generate manifest logs</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <FileCheck className="h-4 w-4" />
            <AlertTitle>AI Processing Instructions</AlertTitle>
            <AlertDescription className="text-sm">
              <strong>Step-by-step validation workflow:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Upload spec file (.md, .ml, or .yaml) - automatically logged in manifest</li>
                <li>For .md files: System checks for existing .ml/.yaml versions</li>
                <li>If not found: Automatic conversion to normalized YAML format</li>
                <li>Schema validation enforced against backend schema</li>
                <li>Only schema-compliant files proceed to AI processing</li>
                <li>Manifest logs track all validation status and errors</li>
                <li>Admin review required before leaderboard promotion</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
