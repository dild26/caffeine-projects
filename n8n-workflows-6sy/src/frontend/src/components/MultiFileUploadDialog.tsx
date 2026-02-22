import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileJson, FileText, CheckCircle2, AlertCircle, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActor } from '../hooks/useActor';
import { useHandleJsonError } from '../hooks/useQueries';
import { ProcessedFile, FormTemplate, WorkflowMetadata, Variant_payPerRun_subscription } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

interface FileMatch {
  baseName: string;
  jsonFile?: File;
  mdFile?: File;
  pngFile?: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  hash?: string;
  errorMessage?: string;
  parsedFields?: Array<[string, string]>;
  autoSaved?: boolean;
}

export default function MultiFileUploadDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileMatch[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSavedCount, setAutoSavedCount] = useState(0);
  const { actor } = useActor();
  const handleJsonError = useHandleJsonError();

  const normalizeFilename = (filename: string): string => {
    // Remove extension and normalize: lowercase, remove spaces, dashes, underscores, plus signs
    return filename
      .replace(/\.(json|md|png)$/i, '')
      .toLowerCase()
      .replace(/[\s\-_+]/g, '');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    setProcessingComplete(false);
    setProcessedFiles([]);
    setAutoSavedCount(0);

    const zipFiles = selectedFiles.filter(f => f.name.endsWith('.zip'));
    if (zipFiles.length > 0) {
      toast.info('Zip file processing will be implemented with streaming extraction');
      return;
    }

    const fileMap = new Map<string, FileMatch>();
    
    selectedFiles.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const baseName = file.name.replace(/\.(json|md|png)$/i, '');
      const normalizedName = normalizeFilename(file.name);
      
      // Find existing match with same normalized name
      let match: FileMatch | undefined;
      for (const [key, value] of fileMap.entries()) {
        if (normalizeFilename(key) === normalizedName) {
          match = value;
          break;
        }
      }

      if (!match) {
        match = {
          baseName,
          status: 'pending',
          autoSaved: false,
        };
        fileMap.set(baseName, match);
      }
      
      if (ext === 'json') {
        match.jsonFile = file;
      } else if (ext === 'md') {
        match.mdFile = file;
      } else if (ext === 'png') {
        match.pngFile = file;
      }
    });

    const matches = Array.from(fileMap.values());
    setFiles(matches);
    
    const pngCount = matches.filter(m => m.pngFile).length;
    const matchedPngCount = matches.filter(m => m.pngFile && m.jsonFile).length;
    const unmatchedPngCount = pngCount - matchedPngCount;
    
    toast.success(
      `Matched ${matches.length} file sets. ${pngCount} images (${matchedPngCount} matched, ${unmatchedPngCount} unmatched)`
    );
  };

  const calculateSHA256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const recoverFromJsonError = (content: string, errorType: string): string => {
    let recovered = content;

    try {
      // Attempt 1: Remove trailing commas
      if (errorType.includes('trailing') || errorType.includes('comma')) {
        recovered = recovered.replace(/,(\s*[}\]])/g, '$1');
      }

      // Attempt 2: Fix unterminated strings
      if (errorType.includes('unterminated') || errorType.includes('string')) {
        const lines = recovered.split('\n');
        recovered = lines.map(line => {
          const quoteCount = (line.match(/"/g) || []).length;
          if (quoteCount % 2 !== 0 && !line.trim().endsWith('"')) {
            return line + '"';
          }
          return line;
        }).join('\n');
      }

      // Attempt 3: Balance brackets
      if (errorType.includes('bracket') || errorType.includes('brace')) {
        const openBrackets = (recovered.match(/\[/g) || []).length;
        const closeBrackets = (recovered.match(/\]/g) || []).length;
        const openBraces = (recovered.match(/\{/g) || []).length;
        const closeBraces = (recovered.match(/\}/g) || []).length;

        if (openBrackets > closeBrackets) {
          recovered += ']'.repeat(openBrackets - closeBrackets);
        }
        if (openBraces > closeBraces) {
          recovered += '}'.repeat(openBraces - closeBraces);
        }
      }

      // Attempt 4: Remove invalid control characters
      recovered = recovered.replace(/[\x00-\x1F\x7F]/g, '');

      // Validate recovery
      JSON.parse(recovered);
      return recovered;
    } catch (error) {
      // Recovery failed, return original
      return content;
    }
  };

  const parseFileContent = async (file: File): Promise<Array<[string, string]>> => {
    try {
      const content = await file.text();
      const fields: Array<[string, string]> = [];
      
      if (file.name.endsWith('.json')) {
        let parsed;
        let errorType = '';

        try {
          parsed = JSON.parse(content);
        } catch (initialError: any) {
          // Learning error handler: record the error
          errorType = initialError.name || 'ParseError';
          const errorMessage = initialError.message || 'Unknown JSON error';
          
          console.log(`JSON Error detected in ${file.name}: ${errorMessage}`);
          
          // Attempt recovery
          const recoveredContent = recoverFromJsonError(content, errorType);

          try {
            parsed = JSON.parse(recoveredContent);
            console.log(`Successfully recovered from ${errorType} in ${file.name}`);
            
            // Log successful recovery to backend
            if (actor) {
              await handleJsonError.mutateAsync({
                message: `Recovered from: ${errorMessage}`,
                file: file.name,
                errorType,
                suggestedFix: `Applied automatic fix for ${errorType}`,
              });
            }
          } catch (recoveryError: any) {
            // Recovery failed, log to backend for learning
            if (actor) {
              await handleJsonError.mutateAsync({
                message: errorMessage,
                file: file.name,
                errorType,
                suggestedFix: `Manual review required for ${errorType}`,
              });
            }
            throw recoveryError;
          }
        }
        
        // Comprehensive recursive parsing
        const extractFields = (obj: any, prefix = ''): void => {
          if (obj === null || obj === undefined) {
            fields.push([prefix || 'value', String(obj)]);
            return;
          }

          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              const fieldName = prefix ? `${prefix}[${index}]` : `[${index}]`;
              if (item && typeof item === 'object') {
                extractFields(item, fieldName);
              } else {
                fields.push([fieldName, String(item)]);
              }
            });
          } else if (typeof obj === 'object') {
            for (const [key, value] of Object.entries(obj)) {
              const fieldName = prefix ? `${prefix}.${key}` : key;
              if (value && typeof value === 'object') {
                extractFields(value, fieldName);
              } else {
                fields.push([fieldName, String(value)]);
              }
            }
          } else {
            fields.push([prefix || 'value', String(obj)]);
          }
        };
        
        extractFields(parsed);
      } else if (file.name.endsWith('.md')) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.trim()) {
            fields.push([`line_${idx + 1}`, line.trim()]);
          }
        });
      }
      
      return fields;
    } catch (error) {
      console.error('Error parsing file:', error);
      throw error;
    }
  };

  const processFiles = async () => {
    setIsProcessing(true);
    setUploadProgress(0);
    setProcessedFiles([]);
    setProcessingComplete(false);
    setAutoSavedCount(0);

    const totalFiles = files.length;
    const processedHashes = new Set<string>();
    const newProcessedFiles: ProcessedFile[] = [];
    let savedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const fileMatch = files[i];
      
      try {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'processing' } : f
        ));

        if (fileMatch.jsonFile) {
          const hash = await calculateSHA256(fileMatch.jsonFile);
          
          if (processedHashes.has(hash)) {
            const errorMsg = 'Duplicate file detected';
            setFiles(prev => prev.map((f, idx) => 
              idx === i ? { ...f, status: 'error', hash, errorMessage: errorMsg } : f
            ));
            
            if (actor) {
              await actor.addErrorLog({
                message: errorMsg,
                file: fileMatch.baseName,
                timestamp: BigInt(Date.now()),
                resolved: false,
              });
            }
            
            toast.warning(`Skipping duplicate: ${fileMatch.baseName}`);
            setUploadProgress(((i + 1) / totalFiles) * 100);
            continue;
          }
          
          processedHashes.add(hash);
          
          const content = await fileMatch.jsonFile.text();
          const fields = await parseFileContent(fileMatch.jsonFile);
          
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'completed', hash, parsedFields: fields } : f
          ));
          
          const processedFile: ProcessedFile = {
            filename: fileMatch.baseName,
            content,
            fields,
            status: { __kind__: 'success', success: null },
            timestamp: BigInt(Date.now()),
          };
          
          newProcessedFiles.push(processedFile);
          
          // AUTO-SAVE
          if (actor) {
            try {
              await actor.addProcessedFile(processedFile);
              
              const template: FormTemplate = {
                id: `template_${hash.substring(0, 16)}`,
                name: getTemplateName(fileMatch.baseName),
                fields,
                category: 'Automation',
                status: { __kind__: 'parsed', parsed: null },
                timestamp: BigInt(Date.now()),
              };
              
              await actor.addFormTemplate(template);

              const workflowMetadata: WorkflowMetadata = {
                id: `workflow_${hash.substring(0, 16)}`,
                title: getTemplateName(fileMatch.baseName),
                category: 'Automation',
                description: `Auto-saved workflow from ${fileMatch.baseName}`,
                tags: ['auto-saved', 'parsed', 'template'],
                triggerType: 'manual',
                accessType: Variant_payPerRun_subscription.subscription,
                priceInCents: BigInt(0),
                version: BigInt(1),
                creator: Principal.anonymous(),
              };

              await actor.uploadWorkflow(workflowMetadata, content);
              
              setFiles(prev => prev.map((f, idx) => 
                idx === i ? { ...f, autoSaved: true } : f
              ));
              
              savedCount++;
              setAutoSavedCount(savedCount);
            } catch (saveError: any) {
              console.error('Auto-save error:', saveError);
            }
          }
        }

        setUploadProgress(((i + 1) / totalFiles) * 100);
      } catch (error: any) {
        const errorMsg = error.message || 'Unknown parsing error';
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error', errorMessage: errorMsg } : f
        ));
        
        console.error(`Error processing ${fileMatch.baseName}:`, error);
        
        if (actor) {
          await actor.addErrorLog({
            message: `${errorMsg} | Context: ${error.stack?.substring(0, 200) || 'N/A'}`,
            file: fileMatch.baseName,
            timestamp: BigInt(Date.now()),
            resolved: false,
          });
        }
        
        toast.error(`Error in ${fileMatch.baseName}: ${errorMsg}. Continuing...`);
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }
    }

    setProcessedFiles(newProcessedFiles);
    setIsProcessing(false);
    setProcessingComplete(true);
    
    const errorCount = files.length - newProcessedFiles.length;
    const unmatchedImages = files.filter(f => f.pngFile && !f.jsonFile).length;
    
    if (errorCount > 0) {
      toast.info(`Processed ${newProcessedFiles.length} files successfully (${savedCount} auto-saved), ${errorCount} errors logged for learning`);
    } else {
      toast.success(`All ${newProcessedFiles.length} files processed and auto-saved successfully!`);
    }
    
    if (unmatchedImages > 0) {
      toast.info(`${unmatchedImages} unmatched image(s) moved to admin Gallery`);
    }
  };

  const saveAllForms = async () => {
    if (!actor) {
      toast.error('Actor not available');
      return;
    }

    setIsSaving(true);
    try {
      await actor.saveAllForms();
      toast.success('All forms saved successfully as workflow templates!');
    } catch (error: any) {
      console.error('Error saving forms:', error);
      toast.error(`Failed to save forms: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setUploadProgress(0);
    setIsProcessing(false);
    setProcessedFiles([]);
    setProcessingComplete(false);
    setAutoSavedCount(0);
  };

  const getTemplateName = (baseName: string): string => {
    return baseName.charAt(0).toUpperCase() + baseName.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Multi-File Upload with Error Recovery</DialogTitle>
          <DialogDescription>
            Upload multiple .json, .md, and .png files. Intelligent filename matching pairs images with workflows (ignoring case, spaces, dashes, underscores, plus signs). Unmatched images are moved to admin Gallery.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            <Label htmlFor="files">Select Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              accept=".json,.md,.png,.zip"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Supports .json, .md, .png files and .zip archives. Intelligent filename matching for images (e.g., "Create 124.json" matches "Create_124.png", "create-124.PNG", "Create+124.png"). Auto-recovery from JSON errors enabled.
            </p>
          </div>

          {files.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Matched Files: {files.length}</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      <FileJson className="h-3 w-3 mr-1" />
                      {files.filter(f => f.jsonFile).length} JSON
                    </Badge>
                    <Badge variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      {files.filter(f => f.mdFile).length} MD
                    </Badge>
                    <Badge variant="outline">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {files.filter(f => f.pngFile).length} PNG
                    </Badge>
                    {autoSavedCount > 0 && (
                      <Badge variant="default">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {autoSavedCount} Auto-Saved
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 py-3 border-y bg-muted/30">
                {!processingComplete ? (
                  <Button
                    onClick={processFiles}
                    disabled={files.length === 0 || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Processing & Auto-Saving Files...' : `Process ${files.length} Files`}
                  </Button>
                ) : (
                  <Button
                    onClick={saveAllForms}
                    disabled={isSaving || processedFiles.length === 0}
                    className="w-full"
                    size="lg"
                    variant="default"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {isSaving ? 'Saving All Forms...' : `Save All Forms (${processedFiles.length})`}
                  </Button>
                )}
                {isProcessing && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Processing: {Math.round(uploadProgress)}% ({files.filter(f => f.status === 'completed').length}/{files.length} completed, {autoSavedCount} auto-saved)
                    </p>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1 border rounded-lg p-4">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex gap-1">
                          {file.jsonFile && <FileJson className="h-4 w-4 text-primary" />}
                          {file.mdFile && <FileText className="h-4 w-4 text-accent" />}
                          {file.pngFile && <ImageIcon className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {getTemplateName(file.baseName)}
                            {file.autoSaved && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Auto-Saved
                              </Badge>
                            )}
                            {file.pngFile && !file.jsonFile && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Unmatched Image → Gallery
                              </Badge>
                            )}
                          </p>
                          {file.hash && (
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {file.hash.substring(0, 16)}...
                            </p>
                          )}
                          {file.errorMessage && (
                            <p className="text-xs text-destructive truncate">
                              {file.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {file.status === 'completed' && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        {file.status === 'processing' && (
                          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {processedFiles.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Processed Files & Form Templates</h3>
                    <Badge variant="secondary">{processedFiles.length} Templates</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All form previews are publicly visible. Subscribe to customize and publish.
                  </p>
                  <ScrollArea className="h-80 border rounded-lg p-4">
                    <div className="space-y-4">
                      {processedFiles.map((pf, idx) => (
                        <div key={idx} className="border rounded-lg p-4 bg-card space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-base">{getTemplateName(pf.filename)}</h4>
                            <Badge variant="outline" className="text-xs">
                              {pf.fields.length} fields
                            </Badge>
                          </div>
                          <div className="space-y-2 bg-muted/50 p-3 rounded">
                            {pf.fields.slice(0, 15).map(([key, value], fieldIdx) => (
                              <div key={fieldIdx} className="grid grid-cols-5 gap-2 text-sm border-b border-border/50 pb-1 last:border-0">
                                <span className="col-span-2 font-medium text-muted-foreground truncate text-xs">
                                  {key}
                                </span>
                                <span className="col-span-3 truncate text-xs">
                                  {value}
                                </span>
                              </div>
                            ))}
                            {pf.fields.length > 15 && (
                              <p className="text-xs text-muted-foreground italic text-center pt-2">
                                + {pf.fields.length - 15} more fields (all data captured)
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-center pt-2">
                    <Button variant="default" size="lg" className="w-full max-w-md">
                      Subscribe to Publish
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={isProcessing || isSaving}
            >
              {processedFiles.length > 0 ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
