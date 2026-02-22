import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAddWorkflow, useLogParsingError } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ExternalBlob, ParsingError } from '../../backend';
import { Upload, AlertTriangle, CheckCircle, FileWarning } from 'lucide-react';

interface ParseResult {
  success: boolean;
  fileName: string;
  error?: string;
  suggestedFix?: string;
}

export default function WorkflowUpload() {
  const { identity } = useInternetIdentity();
  const addWorkflow = useAddWorkflow();
  const logParsingError = useLogParsingError();

  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [parseResults, setParseResults] = useState<ParseResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateJSON = (content: string, fileName: string): ParseResult => {
    try {
      JSON.parse(content);
      return { success: true, fileName };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      let suggestedFix = '';

      // Analyze common JSON errors and suggest fixes
      if (errorMessage.includes('Unexpected token')) {
        suggestedFix = 'Check for missing commas, brackets, or quotes';
      } else if (errorMessage.includes('Unexpected end of JSON')) {
        suggestedFix = 'File appears incomplete - check for missing closing brackets';
      } else if (errorMessage.includes('Unexpected string')) {
        suggestedFix = 'Check for unescaped quotes or missing commas';
      } else {
        suggestedFix = 'Review JSON syntax and structure';
      }

      return {
        success: false,
        fileName,
        error: errorMessage,
        suggestedFix,
      };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isValid = file.name.endsWith('.json') || file.name.endsWith('.md') || file.name.endsWith('.zip');
      if (!isValid) {
        toast.error(`Skipped ${file.name}: Only .json, .md, or .zip files are allowed`);
      }
      return isValid;
    });
    setFiles(validFiles);
    setParseResults([]);
  };

  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workflowName.trim() || !workflowDescription.trim() || files.length === 0) {
      toast.error('Please fill in all fields and select at least one file');
      return;
    }

    setIsProcessing(true);
    const results: ParseResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Validate JSON files
        if (file.name.endsWith('.json')) {
          const content = new TextDecoder().decode(bytes);
          const parseResult = validateJSON(content, file.name);
          results.push(parseResult);

          if (!parseResult.success) {
            // Log parsing error to backend
            const parsingError: ParsingError = {
              timestamp: BigInt(Date.now() * 1000000),
              fileName: file.name,
              errorMessage: parseResult.error || 'Unknown parsing error',
              severity: 'error',
              suggestedFix: parseResult.suggestedFix || 'Review file structure',
            };
            await logParsingError.mutateAsync(parsingError);
            errorCount++;
            continue; // Skip this file
          }
        }

        const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
        });

        const workflow = {
          id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: files.length === 1 ? workflowName.trim() : `${workflowName.trim()} - ${file.name}`,
          description: workflowDescription.trim(),
          fileHash: `sha256-${Date.now()}`,
          isPublic,
          uploadTime: BigInt(Date.now() * 1000000),
          uploader: identity!.getPrincipal(),
          file: externalBlob,
        };

        await addWorkflow.mutateAsync(workflow);
        successCount++;
        results.push({ success: true, fileName: file.name });
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          success: false,
          fileName: file.name,
          error: errorMessage,
          suggestedFix: 'Check file format and try again',
        });
        errorCount++;
      }
    }

    setParseResults(results);
    setIsProcessing(false);

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} workflow(s)`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} file(s) - see details below`);
    }

    if (successCount === files.length) {
      setWorkflowName('');
      setWorkflowDescription('');
      setIsPublic(false);
      setFiles([]);
      setUploadProgress({});
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Workflows with Error Handling</CardTitle>
        <CardDescription>
          Upload single or multiple workflow files. JSON files are validated automatically, and errors are logged for
          learning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBatchUpload} className="space-y-4">
          <div>
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Describe what this workflow does"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public">Make this workflow public (free access)</Label>
          </div>

          <div>
            <Label htmlFor="files">Workflow Files (.json, .md, .zip)</Label>
            <Input id="files" type="file" onChange={handleFileChange} accept=".json,.md,.zip" multiple />
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected {files.length} file(s): {files.map((f) => f.name).join(', ')}
              </p>
            )}
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {parseResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Upload Results:</h3>
              {parseResults.map((result, index) => (
                <Alert key={index} variant={result.success ? 'default' : 'destructive'}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertTitle>{result.fileName}</AlertTitle>
                  <AlertDescription>
                    {result.success ? (
                      'Successfully uploaded'
                    ) : (
                      <>
                        <p className="font-semibold">Error: {result.error}</p>
                        {result.suggestedFix && <p className="mt-1">Suggested fix: {result.suggestedFix}</p>}
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isProcessing || addWorkflow.isPending}>
            <Upload className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : `Upload ${files.length} Workflow(s)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
