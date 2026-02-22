import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner';
import SchemaEditorDialog from './SchemaEditorDialog';

interface SchemaCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORMIO_EXAMPLES = [
  {
    id: 'simple',
    name: 'Simple Form',
    description: 'A basic form with text inputs and validation',
    url: 'https://formio.github.io/formio.js/app/examples/simple.json',
  },
  {
    id: 'wizard',
    name: 'Wizard Form',
    description: 'Multi-step wizard form with navigation',
    url: 'https://formio.github.io/formio.js/app/examples/wizard.json',
  },
  {
    id: 'conditional',
    name: 'Conditional Form',
    description: 'Form with conditional field visibility',
    url: 'https://formio.github.io/formio.js/app/examples/conditional.json',
  },
  {
    id: 'calculated',
    name: 'Calculated Values',
    description: 'Form with calculated field values',
    url: 'https://formio.github.io/formio.js/app/examples/calculated.json',
  },
  {
    id: 'datagrid',
    name: 'Data Grid',
    description: 'Form with repeating data grid component',
    url: 'https://formio.github.io/formio.js/app/examples/datagrid.json',
  },
  {
    id: 'survey',
    name: 'Survey Form',
    description: 'Survey-style form with rating components',
    url: 'https://formio.github.io/formio.js/app/examples/survey.json',
  },
];

export default function SchemaCatalogDialog({ open, onOpenChange }: SchemaCatalogDialogProps) {
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [previewSchema, setPreviewSchema] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleImport = async (url: string, id: string) => {
    setLoading(id);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Validate that we got valid JSON
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid schema format received');
      }
      
      setPreviewSchema(JSON.stringify(data, null, 2));
      setEditorOpen(true);
      toast.success('Schema loaded successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`Failed to import schema: ${errorMessage}`);
      console.error('Schema import error:', error);
    } finally {
      setLoading(null);
    }
  };

  const handlePreview = async (url: string, id: string) => {
    setLoading(id);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Validate that we got valid JSON
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid schema format received');
      }
      
      setSelectedSchema(JSON.stringify(data, null, 2));
      toast.success('Schema preview loaded');
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`Failed to load preview: ${errorMessage}`);
      console.error('Schema preview error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Schema Catalog</DialogTitle>
            <DialogDescription>
              Browse and import form schemas from Form.io examples
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                {FORMIO_EXAMPLES.map((example) => (
                  <Card key={example.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{example.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {example.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          Form.io
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(example.url, example.id)}
                          disabled={loading === example.id}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleImport(example.url, example.id)}
                          disabled={loading === example.id}
                          className="gap-1"
                        >
                          <Download className="h-3 w-3" />
                          {loading === example.id ? 'Loading...' : 'Import'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="gap-1"
                        >
                          <a href={example.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold mb-2">Schema Preview</h3>
              {selectedSchema ? (
                <ScrollArea className="h-[calc(100%-2rem)]">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                    {selectedSchema}
                  </pre>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-2rem)] text-muted-foreground text-sm">
                  Select a schema to preview
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {previewSchema && (
        <SchemaEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          initialSchema={previewSchema}
          isFormIoSchema={true}
        />
      )}
    </>
  );
}
