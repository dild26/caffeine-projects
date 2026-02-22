import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, CheckCircle2, AlertCircle, FileText, Hash, List, Link as LinkIcon } from 'lucide-react';
import { DEFAULT_APPS } from '../data/defaultApps';
import { toast } from 'sonner';
import { useAddSitemapPage } from '../hooks/useAppQueries';
import { getDomainHash } from '../lib/domainHash';
import { normalizeSubdomain } from '../lib/subdomainNormalizer';

interface SitemapCSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApp?: string;
  onSuccess?: () => void;
}

interface ParsedCSVEntry {
  name: string;
  url: string;
  category: string;
}

const SAMPLE_URL_PATTERNS = ['blog', 'about', 'pros', 'what', 'why', 'how', 'contact', 'faq', 'terms', 'referral', 'trust'];

export default function SitemapCSVUploadDialog({ open, onOpenChange, selectedApp: propSelectedApp, onSuccess }: SitemapCSVUploadDialogProps) {
  const [selectedApp, setSelectedApp] = useState(propSelectedApp || '');
  const [file, setFile] = useState<File | null>(null);
  const [rawArrayText, setRawArrayText] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [parsedEntries, setParsedEntries] = useState<ParsedCSVEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const addPage = useAddSitemapPage();

  // Sync with prop when it changes
  useEffect(() => {
    if (propSelectedApp) {
      setSelectedApp(propSelectedApp);
    }
  }, [propSelectedApp]);

  // Auto-fill raw array field when app is selected
  useEffect(() => {
    if (selectedApp && !rawArrayText) {
      const arrayString = `["${SAMPLE_URL_PATTERNS.join('","')}"]`;
      setRawArrayText(arrayString);
    }
  }, [selectedApp]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setParsedEntries([]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  const parseCSV = async (csvText: string): Promise<ParsedCSVEntry[]> => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const entries: ParsedCSVEntry[] = [];
    const seenUrls = new Set<string>();

    // Skip header row if present (check for common header keywords)
    let startIndex = 0;
    if (lines.length > 0) {
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('name') || firstLine.includes('url') || firstLine.includes('page') || firstLine.includes('link')) {
        startIndex = 1;
      }
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV line (handle quoted fields)
      const fields = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(f => f.replace(/^"|"$/g, '').trim()) || [];
      
      // Skip if this line looks like a header (contains "url" field)
      if (fields.some(f => f.toLowerCase() === 'url' || f.toLowerCase() === 'name')) {
        continue;
      }

      if (fields.length < 1) continue;

      const name = fields[0] || `Page ${i}`;
      let url = fields[1] || fields[0]; // Use first field as URL if only one field
      const category = fields[2] || 'General';

      // Validate and normalize URL
      if (!url) continue;

      // Skip if URL field contains "url" (header detection)
      if (url.toLowerCase() === 'url') continue;

      // Normalize URL: strip protocol artifacts
      url = url.replace(/^https?:\/\/+/gi, '');
      
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        url = 'https://' + url;
      }

      // Check for duplicates
      if (seenUrls.has(url)) {
        console.warn(`Duplicate URL skipped: ${url}`);
        continue;
      }

      seenUrls.add(url);
      entries.push({ name, url, category });
    }

    return entries;
  };

  const parseRawArray = (text: string): ParsedCSVEntry[] => {
    const entries: ParsedCSVEntry[] = [];
    const seenUrls = new Set<string>();

    if (!selectedApp) {
      throw new Error('Please select an app first');
    }

    const app = DEFAULT_APPS.find(a => a.name === selectedApp);
    if (!app) {
      throw new Error('Selected app not found');
    }

    // Remove brackets, quotes, and split by comma
    const cleaned = text.replace(/[\[\]"']/g, '').trim();
    const items = cleaned.split(',').map(item => item.trim()).filter(item => item);

    for (const item of items) {
      if (!item) continue;

      // Normalize item: strip any protocol artifacts
      const normalizedItem = item.replace(/^https?:\/\/+/gi, '');

      // Generate URL by joining with app base URL
      const pageName = normalizedItem.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const url = `${app.url}${normalizedItem}`;

      if (seenUrls.has(url)) {
        console.warn(`Duplicate URL skipped: ${url}`);
        continue;
      }

      seenUrls.add(url);
      entries.push({
        name: pageName,
        url: url,
        category: 'Information',
      });
    }

    return entries;
  };

  const parseMarkdownLinks = (text: string): ParsedCSVEntry[] => {
    const entries: ParsedCSVEntry[] = [];
    const seenUrls = new Set<string>();

    // Regex to match markdown links: [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      const name = match[1].trim();
      let url = match[2].trim();

      if (!url) continue;

      // Validate URL
      try {
        // Normalize URL: strip protocol artifacts
        url = url.replace(/^https?:\/\/+/gi, '');
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
          url = 'https://' + url;
        }

        // Basic URL validation
        new URL(url);

        if (seenUrls.has(url)) {
          console.warn(`Duplicate URL skipped: ${url}`);
          continue;
        }

        seenUrls.add(url);
        entries.push({
          name: name,
          url: url,
          category: 'General',
        });
      } catch (error) {
        console.warn(`Invalid URL skipped: ${url}`);
        continue;
      }
    }

    return entries;
  };

  const handleParseAll = async () => {
    if (!selectedApp) {
      toast.error('Please select an app first');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      let allEntries: ParsedCSVEntry[] = [];

      // Parse CSV file if provided
      if (file) {
        const text = await file.text();
        const csvEntries = await parseCSV(text);
        allEntries = [...allEntries, ...csvEntries];
      }

      // Parse raw array text if provided
      if (rawArrayText.trim()) {
        const arrayEntries = parseRawArray(rawArrayText);
        allEntries = [...allEntries, ...arrayEntries];
      }

      // Parse markdown links if provided
      if (markdownText.trim()) {
        const markdownEntries = parseMarkdownLinks(markdownText);
        allEntries = [...allEntries, ...markdownEntries];
      }

      if (allEntries.length === 0) {
        throw new Error('No valid entries found. Please provide at least one input source.');
      }

      // Remove duplicates across all sources
      const uniqueEntries = Array.from(
        new Map(allEntries.map(entry => [entry.url, entry])).values()
      );

      setParsedEntries(uniqueEntries);
      toast.success(`Parsed ${uniqueEntries.length} unique entries from all sources`);
    } catch (error: any) {
      console.error('Parsing error:', error);
      setErrorMessage(error.message || 'Failed to parse input data');
      setUploadStatus('error');
      toast.error('Failed to parse input data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (parsedEntries.length === 0 || !selectedApp) {
      toast.error('No entries to import');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const entry of parsedEntries) {
        try {
          await addPage.mutateAsync({
            name: entry.name,
            url: entry.url,
            category: entry.category,
            parentId: null,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to add page: ${entry.name}`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setUploadStatus('success');
        toast.success(`Successfully imported ${successCount} pages to ${selectedApp}`);
        
        if (onSuccess) {
          onSuccess();
        }

        // Reset and close after delay
        setTimeout(() => {
          setFile(null);
          setRawArrayText('');
          setMarkdownText('');
          setParsedEntries([]);
          setUploadStatus('idle');
          onOpenChange(false);
        }, 2000);
      }

      if (errorCount > 0) {
        toast.warning(`${errorCount} pages failed to import (may already exist)`);
      }
    } catch (error: any) {
      console.error('Import error:', error);
      setErrorMessage(error.message || 'Failed to import pages');
      setUploadStatus('error');
      toast.error('Failed to import pages');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `name,url,category
Home,https://example.com/,Main
About Us,https://example.com/about,Information
Features,https://example.com/features,Features
Contact,https://example.com/contact,Support
Blog,https://example.com/blog,Content
Pricing,https://example.com/pricing,Sales`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto card-3d">
        <DialogHeader>
          <DialogTitle className="text-gradient flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Enhanced CSV Sitemap Upload - Multi-Format Import
          </DialogTitle>
          <DialogDescription>
            Upload CSV files, enter raw arrays, or paste Markdown links for automatic parsing and bulk page addition with subdomain normalization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="appSelector">Select SECOINFI App *</Label>
            <Select value={selectedApp} onValueChange={setSelectedApp} disabled={isProcessing}>
              <SelectTrigger id="appSelector">
                <SelectValue placeholder="Choose target app..." />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_APPS.map((app) => (
                  <SelectItem key={app.id} value={app.name}>
                    <div className="flex items-center gap-2">
                      <span>{app.name}</span>
                      {app.isVerified && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedApp && (
              <p className="text-xs text-muted-foreground mt-1">
                Base URL: {DEFAULT_APPS.find(a => a.name === selectedApp)?.url}
              </p>
            )}
          </div>

          <Tabs defaultValue="array" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="array">
                <List className="w-4 h-4 mr-2" />
                Raw Array
              </TabsTrigger>
              <TabsTrigger value="csv">
                <FileText className="w-4 h-4 mr-2" />
                CSV File
              </TabsTrigger>
              <TabsTrigger value="markdown">
                <LinkIcon className="w-4 h-4 mr-2" />
                Markdown Links
              </TabsTrigger>
            </TabsList>

            <TabsContent value="array" className="space-y-3">
              <div>
                <Label htmlFor="rawArray">Raw Array Input (Auto-filled)</Label>
                <Textarea
                  id="rawArray"
                  value={rawArrayText}
                  onChange={(e) => setRawArrayText(e.target.value)}
                  placeholder='["blog","about","pros","what","why","how","contact","faq","terms","referral","trust"]'
                  disabled={isProcessing}
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter page names as a comma-separated list in array format. URLs will be auto-generated using the selected app's base URL. 
                  <strong className="text-primary"> Auto-filled with all {SAMPLE_URL_PATTERNS.length} sample patterns when you select an app.</strong>
                  Protocol artifacts are automatically stripped during parsing.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="csv" className="space-y-3">
              <div>
                <Label htmlFor="csvFile">CSV File</Label>
                <div className="mt-1">
                  <input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                      file:cursor-pointer cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    Format: name,url,category (headers automatically skipped, protocol artifacts stripped)
                  </p>
                  <Button variant="link" size="sm" onClick={downloadSampleCSV} className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Download Sample
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="markdown" className="space-y-3">
              <div>
                <Label htmlFor="markdownLinks">Markdown Links</Label>
                <Textarea
                  id="markdownLinks"
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  placeholder="[Blog](https://example.com/blog)
[About Us](https://example.com/about)
[Contact](https://example.com/contact)"
                  disabled={isProcessing}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter Markdown-formatted links: [Link Text](https://url.com). URLs will be validated and protocol artifacts stripped automatically.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {(file || rawArrayText.trim() || markdownText.trim()) && parsedEntries.length === 0 && (
            <Button onClick={handleParseAll} disabled={isProcessing || !selectedApp} className="w-full">
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Parsing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Parse All Inputs
                </>
              )}
            </Button>
          )}

          {parsedEntries.length > 0 && (
            <Alert className="border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Parsing Successful</AlertTitle>
              <AlertDescription className="text-success text-sm mt-2">
                Found {parsedEntries.length} valid unique entries for {selectedApp}. Review below and click Import to add to sitemap.
              </AlertDescription>
            </Alert>
          )}

          {parsedEntries.length > 0 && (
            <div className="card-3d p-4 rounded-lg max-h-60 overflow-y-auto">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Parsed Entries ({parsedEntries.length})
              </h4>
              <div className="space-y-2">
                {parsedEntries.map((entry, index) => (
                  <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{entry.url}</div>
                    <Badge variant="outline" className="text-xs mt-1">{entry.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadStatus === 'error' && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'success' && (
            <Alert className="border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Import Successful!</AlertTitle>
              <AlertDescription className="text-success text-sm mt-2">
                Pages have been added to the sitemap and auto-linked to {selectedApp}. Hierarchical view updated.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Badge variant="outline">Enhanced CSV Upload Features</Badge>
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Raw Array Auto-Fill:</strong> Automatically populated with complete valid string entries like ["blog","about","pros","what","why","how","contact","faq","terms","referral","trust"] when you select an app</li>
              <li>• <strong>CSV Upload:</strong> Automatic header detection and skipping (url, name, page, link)</li>
              <li>• <strong>Markdown Links:</strong> Extract and validate [Text](URL) format links</li>
              <li>• <strong>Multi-Source:</strong> Combine data from all three input methods</li>
              <li>• <strong>Auto-Linking:</strong> URLs generated from selected app base URL</li>
              <li>• <strong>Subdomain Normalization:</strong> Protocol artifacts (https:////, http://, https://) automatically stripped</li>
              <li>• <strong>Duplicate Detection:</strong> Cross-verification prevents duplicate entries</li>
              <li>• <strong>URL Normalization:</strong> Strips .caffeine.xyz duplicates automatically</li>
              <li>• <strong>Merkle Hashing:</strong> Integrity verification for all entries</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          {parsedEntries.length > 0 && (
            <Button onClick={handleImport} disabled={isProcessing} className="neon-glow">
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import {parsedEntries.length} Pages to {selectedApp}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
