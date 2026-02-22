import { useState } from 'react';
import { useGetAllFormTemplates, useCreateFormTemplate, useUpdateFormTemplate, useBulkImportMdFiles } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileInput, FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FormTemplate, PostcardContent } from '../backend';
import { cn } from '@/lib/utils';

export function FormTemplatesPage() {
  const { data: formTemplates, isLoading } = useGetAllFormTemplates();
  const createFormTemplate = useCreateFormTemplate();
  const updateFormTemplate = useUpdateFormTemplate();
  const bulkImportMdFiles = useBulkImportMdFiles();

  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [formContent, setFormContent] = useState('');
  const [metadata, setMetadata] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const mdFiles = Array.from(files).filter(file => 
      file.name.endsWith('.md') || file.name.endsWith('.markdown')
    );

    if (mdFiles.length === 0) {
      toast.error('Please upload .md or .markdown files only');
      return;
    }

    setUploadedFiles(mdFiles);
    toast.info(`${mdFiles.length} file(s) ready for import`);
  };

  const handleBulkImport = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to import');
      return;
    }

    setIsUploading(true);

    try {
      const fileContents: [string, string][] = await Promise.all(
        uploadedFiles.map(async (file) => {
          const content = await file.text();
          return [file.name, content] as [string, string];
        })
      );

      await bulkImportMdFiles.mutateAsync(fileContents);
      
      toast.success(`Successfully imported ${uploadedFiles.length} file(s)`);
      setUploadedFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.error(`Import failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      await createFormTemplate.mutateAsync({
        id: `template-${Date.now()}`,
        name: newTemplateName.trim(),
        formContent: formContent.trim(),
        metadata: metadata.trim(),
        detailsOfEContracts: [],
      });

      toast.success('Form template created successfully');
      setIsCreating(false);
      setNewTemplateName('');
      setFormContent('');
      setMetadata('');
    } catch (error: any) {
      toast.error(`Failed to create template: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSelectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setIsCreating(false);
  };

  const renderPostcardContent = (postcards: PostcardContent[]) => {
    if (!postcards || postcards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <FileText className="h-12 w-12 mb-2 opacity-50" />
          <p>No e-Contract details imported yet</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {postcards.map((postcard, index) => (
          <Card key={index} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Page {Number(postcard.pageNumber)}</span>
                <Badge variant="outline">Postcard {index + 1}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {postcard.content}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Form Templates</h2>
        <p className="text-muted-foreground">
          Manage form templates with bulk .md import for e-Contract details
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileInput className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formTemplates?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Form Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Import Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-primary" />
              )}
              <div>
                <p className="text-2xl font-bold">{uploadedFiles.length}</p>
                <p className="text-xs text-muted-foreground">Files Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              size="sm"
              className="w-full"
              onClick={() => setIsCreating(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              New Template
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload .md Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".md,.markdown"
              className="hidden"
              onChange={handleFileUpload}
            />
          </CardContent>
        </Card>
      </div>

      {uploadedFiles.length > 0 && (
        <Card className="mb-6 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Import Ready
            </CardTitle>
            <CardDescription>
              {uploadedFiles.length} file(s) ready to import into form templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <Badge key={index} variant="secondary">
                    {file.name}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={handleBulkImport}
                disabled={isUploading || bulkImportMdFiles.isPending}
                className="w-full"
              >
                {isUploading || bulkImportMdFiles.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Import All Files
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Select or create a template</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {formTemplates && formTemplates.length > 0 ? (
                  formTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {template.name}
                    </Button>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileInput className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No templates yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Template' : selectedTemplate ? selectedTemplate.name : 'Select a Template'}
            </CardTitle>
            <CardDescription>
              {isCreating ? 'Fill in the template details' : selectedTemplate ? 'View and edit template with 3-tab structure' : 'Choose a template from the list'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isCreating ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-content">Form Content</Label>
                  <Textarea
                    id="form-content"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Enter form content"
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metadata">Metadata</Label>
                  <Textarea
                    id="metadata"
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    placeholder="Enter metadata"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateTemplate}
                    disabled={createFormTemplate.isPending}
                  >
                    {createFormTemplate.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Template'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewTemplateName('');
                      setFormContent('');
                      setMetadata('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : selectedTemplate ? (
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="form">Form</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="details">Details of e-Contracts</TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="space-y-4">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Form Content</Label>
                        <div className="mt-2 p-4 rounded-lg border bg-muted/50">
                          <pre className="text-sm whitespace-pre-wrap">
                            {selectedTemplate.formContent || 'No form content available'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="metadata" className="space-y-4">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Metadata</Label>
                        <div className="mt-2 p-4 rounded-lg border bg-muted/50">
                          <pre className="text-sm whitespace-pre-wrap">
                            {selectedTemplate.metadata || 'No metadata available'}
                          </pre>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <Label className="text-xs text-muted-foreground">Created</Label>
                          <p className="text-sm font-medium">
                            {new Date(Number(selectedTemplate.createdAt) / 1000000).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Updated</Label>
                          <p className="text-sm font-medium">
                            {new Date(Number(selectedTemplate.updatedAt) / 1000000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="details" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-sm font-medium">e-Contract Details</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Imported from .md files • {selectedTemplate.detailsOfEContracts.length} postcard(s)
                      </p>
                    </div>
                    <Badge variant="outline">
                      {selectedTemplate.detailsOfEContracts.length > 0 ? 'Populated' : 'Empty'}
                    </Badge>
                  </div>
                  <ScrollArea className="h-[500px] pr-4">
                    {renderPostcardContent(selectedTemplate.detailsOfEContracts)}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                <FileInput className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No Template Selected</p>
                <p className="text-sm">Select a template from the list or create a new one</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
