import { useState } from 'react';
import { useGetDomains, useGenerateDomains, useIsAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileJson, FileText, FileCode, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ImportExport() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: domains = [] } = useGetDomains();
  const generateMutation = useGenerateDomains();
  const [importing, setImporting] = useState(false);

  const isAuthenticated = !!identity;

  const handleExport = (format: 'json' | 'csv' | 'markdown' | 'txt') => {
    if (domains.length === 0) {
      toast.error('No domains to export');
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(domains, null, 2);
        filename = 'domains.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = 'URL,Upvotes,Downvotes,Clicks\n' +
          domains.map(d => `"${d.url}",${d.upvotes},${d.downvotes},${d.clickCount}`).join('\n');
        filename = 'domains.csv';
        mimeType = 'text/csv';
        break;
      case 'markdown':
        content = '# Domain Collection\n\n' +
          domains.map(d => {
            const score = Number(d.upvotes) - Number(d.downvotes);
            return `- [${d.url}](${d.url}) - Score: ${score}, Clicks: ${d.clickCount}`;
          }).join('\n');
        filename = 'domains.md';
        mimeType = 'text/markdown';
        break;
      case 'txt':
        content = domains.map(d => d.url).join('\n');
        filename = 'domains.txt';
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${domains.length} domains as ${format.toUpperCase()}`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      toast.error('Please login to import domains');
      return;
    }

    if (!isAdmin) {
      toast.error('Only admins can import domains');
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const text = await file.text();
      let urls: string[] = [];

      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          urls = data.map(item => typeof item === 'string' ? item : item.url).filter(Boolean);
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n').slice(1);
        urls = lines.map(line => {
          const match = line.match(/^"?([^",]+)"?/);
          return match ? match[1] : '';
        }).filter(Boolean);
      } else if (file.name.endsWith('.md')) {
        const matches = text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
        urls = Array.from(matches).map(match => match[2]);
      } else {
        urls = text.split('\n').map(line => line.trim()).filter(Boolean);
      }

      if (urls.length === 0) {
        toast.error('No valid URLs found in file');
        return;
      }

      await generateMutation.mutateAsync(urls);
      toast.success(`Imported ${urls.length} domains!`);
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import domains. Please check the file format.');
    } finally {
      setImporting(false);
    }
  };

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Alert className="border-destructive/50 bg-destructive/5">
        <Lock className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-base">
          {!isAuthenticated 
            ? 'Please login to access import/export features.'
            : 'Only administrators can import/export domains. This feature is restricted to maintain data quality.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="export" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="export">
          <Download className="h-4 w-4 mr-2" />
          Export
        </TabsTrigger>
        <TabsTrigger value="import">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </TabsTrigger>
      </TabsList>

      <TabsContent value="export" className="space-y-4">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <p className="text-sm text-muted-foreground">
              Download your domain collection in various formats for backup or analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleExport('json')}
              className="h-auto py-4 flex-col gap-2"
            >
              <FileJson className="h-6 w-6" />
              <span className="font-medium">JSON</span>
              <span className="text-xs text-muted-foreground">Full data with metadata</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              className="h-auto py-4 flex-col gap-2"
            >
              <FileText className="h-6 w-6" />
              <span className="font-medium">CSV</span>
              <span className="text-xs text-muted-foreground">Spreadsheet compatible</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('markdown')}
              className="h-auto py-4 flex-col gap-2"
            >
              <FileCode className="h-6 w-6" />
              <span className="font-medium">Markdown</span>
              <span className="text-xs text-muted-foreground">Formatted documentation</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport('txt')}
              className="h-auto py-4 flex-col gap-2"
            >
              <FileText className="h-6 w-6" />
              <span className="font-medium">Plain Text</span>
              <span className="text-xs text-muted-foreground">URLs only</span>
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              Currently exporting <strong>{domains.length}</strong> domain{domains.length !== 1 ? 's' : ''}.
            </AlertDescription>
          </Alert>
        </Card>
      </TabsContent>

      <TabsContent value="import" className="space-y-4">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Import Domains</Label>
            <p className="text-sm text-muted-foreground">
              Upload a file containing domain URLs. Supported formats: JSON, CSV, Markdown, or plain text.
            </p>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">Choose a file</span> or drag and drop
              </Label>
              <input
                id="file-upload"
                type="file"
                accept=".json,.csv,.md,.txt"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                JSON, CSV, Markdown, or TXT files
              </p>
            </div>
          </div>

          {importing && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Importing domains... Please wait.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              <strong>Note:</strong> Imported domains will be added to your existing collection. Duplicates will be handled automatically.
            </AlertDescription>
          </Alert>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
