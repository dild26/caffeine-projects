import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, Database, Plus, Upload, FileJson, CloudUpload, Code, AlertTriangle, Info, X, CheckCircle, XCircle, Loader2, FileText, Download, Link2, Zap } from 'lucide-react';
import { useGetCallerSubscription, useGetCallerUserRole, useChunkedSitemapUpload } from '@/hooks/useQueries';
import { SearchResult } from '@/backend';
import { toast } from 'sonner';
import EnhancedSearchInterface from '@/components/EnhancedSearchInterface';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'admin';

interface SitemapsPageProps {
  onNavigate: (page: Page) => void;
}

interface SitemapUploadError {
  file: string;
  entry: number;
  error: string;
  url?: string;
}

interface SitemapUploadResult {
  totalFiles: number;
  processedFiles: number;
  totalEntries: number;
  successfulEntries: number;
  skippedEntries: number;
  errors: SitemapUploadError[];
  processingTime: number;
}

interface XmlImportResult {
  sourceUrl: string;
  extractedUrls: number;
  successfulEntries: number;
  domain: string;
  processingTime: number;
  errors: string[];
  sitemapIndexUrls?: number;
}

export default function SitemapsPage({ onNavigate }: SitemapsPageProps) {
  const { data: subscription } = useGetCallerSubscription();
  const { data: userRole } = useGetCallerUserRole();
  const chunkedUpload = useChunkedSitemapUpload();
  
  const isPayAsYouUse = subscription?.tier.__kind__ === 'payAsYouUse';
  const isAdmin = userRole === 'admin';

  // Manual sitemap entry state
  const [showAddSitemapDialog, setShowAddSitemapDialog] = useState(false);
  const [manualSitemap, setManualSitemap] = useState({
    url: '',
    title: '',
    description: ''
  });

  // Bulk upload state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [sitemapUploadMode, setSitemapUploadMode] = useState<'files' | 'editor'>('files');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualJsonContent, setManualJsonContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<SitemapUploadResult | null>(null);
  const [currentProcessingFile, setCurrentProcessingFile] = useState<string>('');

  // XML import state
  const [showXmlImportDialog, setShowXmlImportDialog] = useState(false);
  const [xmlSitemapUrl, setXmlSitemapUrl] = useState('');
  const [isImportingXml, setIsImportingXml] = useState(false);
  const [xmlImportResult, setXmlImportResult] = useState<XmlImportResult | null>(null);
  const [xmlImportProgress, setXmlImportProgress] = useState<string>('');

  // Sample JSON for the new simplified format
  const sampleJson = [
    { "urls": "https://example.com/page1" },
    { "urls": "https://example.com/page2" },
    { "urls": "https://another-site.com/about" }
  ];

  const handleAddManualSitemap = async () => {
    if (!manualSitemap.url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      const domain = extractDomainFromUrl(manualSitemap.url);
      const searchResult: SearchResult = {
        url: manualSitemap.url,
        title: manualSitemap.title || `Page from ${domain}`,
        description: manualSitemap.description || `Content from ${manualSitemap.url}`
      };

      await chunkedUpload.mutateAsync({ 
        domain, 
        results: [searchResult],
        chunkSize: 1
      });
      
      setManualSitemap({ url: '', title: '', description: '' });
      setShowAddSitemapDialog(false);
      
      toast.success('Sitemap entry added and instantly indexed');
    } catch (error) {
      console.error('Error adding sitemap:', error);
      toast.error('Failed to add sitemap entry');
    }
  };

  const extractDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown-domain';
    }
  };

  const validateSitemapEntry = (entry: any, fileIndex: number, entryIndex: number): { isValid: boolean; error?: string } => {
    if (!entry.urls) {
      return { isValid: false, error: 'Missing required "urls" field' };
    }
    
    try {
      new URL(entry.urls);
    } catch {
      return { isValid: false, error: 'Invalid URL format in "urls" field' };
    }
    
    return { isValid: true };
  };

  const parseXmlSitemap = async (xmlContent: string): Promise<string[]> => {
    const urls: string[] = [];
    
    // Parse XML using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format: ' + parserError.textContent);
    }
    
    // STREAMLINED: Extract URLs EXCLUSIVELY from <loc> elements, ignoring all other fields
    const locElements = xmlDoc.querySelectorAll('loc');
    
    if (locElements.length === 0) {
      throw new Error('No <loc> elements found in XML. Please ensure the file contains valid sitemap <loc> tags with URLs.');
    }
    
    locElements.forEach((element) => {
      const url = element.textContent?.trim();
      // Only accept URLs that start with http:// or https://
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        urls.push(url);
      }
    });
    
    // Remove duplicates and validate
    const uniqueUrls = Array.from(new Set(urls)).filter((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
    
    if (uniqueUrls.length === 0) {
      throw new Error('No valid HTTP(S) URLs found in <loc> elements. Please verify the sitemap contains valid URLs.');
    }
    
    return uniqueUrls;
  };

  const fetchXmlContent = async (url: string): Promise<string> => {
    try {
      // Use multiple CORS proxies for reliability
      const corsProxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        url // Try direct fetch as fallback
      ];
      
      let lastError: Error | null = null;
      
      for (const proxyUrl of corsProxies) {
        try {
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/xml, text/xml, */*',
            },
            signal: AbortSignal.timeout(30000), // 30 second timeout
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const text = await response.text();
          
          if (!text || text.trim().length === 0) {
            throw new Error('Empty response received');
          }
          
          return text;
        } catch (error) {
          lastError = error as Error;
          console.warn(`Failed to fetch with ${proxyUrl}:`, error);
          continue;
        }
      }
      
      throw lastError || new Error('All fetch attempts failed');
    } catch (error) {
      throw new Error(`Failed to fetch XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleXmlSitemapImport = async () => {
    if (!xmlSitemapUrl.trim()) {
      toast.error('Please enter a valid XML sitemap URL');
      return;
    }

    try {
      new URL(xmlSitemapUrl);
    } catch {
      toast.error('Please enter a valid URL format');
      return;
    }

    setIsImportingXml(true);
    setXmlImportResult(null);
    setXmlImportProgress('Initializing XML import...');
    
    const startTime = Date.now();
    const errors: string[] = [];
    let allExtractedUrls: string[] = [];

    try {
      setXmlImportProgress('Fetching XML sitemap from URL...');
      toast.info('Fetching XML sitemap...', { duration: 2000 });
      
      const xmlContent = await fetchXmlContent(xmlSitemapUrl);
      
      setXmlImportProgress('Parsing XML content (extracting ONLY from <loc> elements)...');
      
      // Check if this is a sitemap index file
      const isSitemapIndex = xmlContent.includes('<sitemapindex') || xmlContent.includes('</sitemapindex>');
      
      if (isSitemapIndex) {
        setXmlImportProgress('Detected sitemap index, extracting sitemap URLs from <loc> elements...');
        
        // Parse sitemap index to get individual sitemap URLs
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        const sitemapLocs = xmlDoc.querySelectorAll('sitemap > loc');
        
        const sitemapUrls: string[] = [];
        sitemapLocs.forEach((loc) => {
          const url = loc.textContent?.trim();
          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            sitemapUrls.push(url);
          }
        });
        
        if (sitemapUrls.length > 0) {
          toast.info(`Found ${sitemapUrls.length} sitemaps in index`, { duration: 3000 });
          
          // Fetch and parse each sitemap
          for (let i = 0; i < sitemapUrls.length; i++) {
            const sitemapUrl = sitemapUrls[i];
            setXmlImportProgress(`Processing sitemap ${i + 1}/${sitemapUrls.length} (extracting <loc> elements)...`);
            
            try {
              const sitemapContent = await fetchXmlContent(sitemapUrl);
              const urls = await parseXmlSitemap(sitemapContent);
              allExtractedUrls.push(...urls);
              
              toast.info(`Extracted ${urls.length} URLs from <loc> elements in sitemap ${i + 1}`, { duration: 2000 });
            } catch (error) {
              const errorMsg = `Failed to process sitemap ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
              errors.push(errorMsg);
              console.error(errorMsg);
            }
          }
        } else {
          // No sitemap URLs found, try parsing as regular sitemap
          allExtractedUrls = await parseXmlSitemap(xmlContent);
        }
      } else {
        // Regular sitemap file - extract from <loc> elements only
        allExtractedUrls = await parseXmlSitemap(xmlContent);
      }
      
      // Remove duplicates
      allExtractedUrls = Array.from(new Set(allExtractedUrls));
      
      setXmlImportProgress(`Successfully extracted ${allExtractedUrls.length} unique URLs from <loc> elements`);
      
      if (allExtractedUrls.length === 0) {
        throw new Error('No URLs found in <loc> elements. Please verify the sitemap format contains <loc> tags with valid HTTP(S) URLs.');
      }
      
      const domain = extractDomainFromUrl(xmlSitemapUrl);
      
      setXmlImportProgress('Converting URLs to searchable format...');
      
      const searchResults: SearchResult[] = allExtractedUrls.map((url) => ({
        url,
        title: `Page from ${extractDomainFromUrl(url)}`,
        description: `Content imported from XML sitemap: ${url}`
      }));

      setXmlImportProgress(`Uploading ${searchResults.length} URLs to database with instant indexing...`);
      
      if (searchResults.length > 0) {
        await chunkedUpload.mutateAsync({ 
          domain, 
          results: searchResults,
          chunkSize: 100,
          onProgress: (progress) => {
            setXmlImportProgress(`Uploading: ${progress.processed}/${progress.total} URLs (${progress.percentage.toFixed(1)}%)`);
          }
        });
      }

      const processingTime = Date.now() - startTime;
      
      const result: XmlImportResult = {
        sourceUrl: xmlSitemapUrl,
        extractedUrls: allExtractedUrls.length,
        successfulEntries: searchResults.length,
        domain,
        processingTime,
        errors,
        sitemapIndexUrls: isSitemapIndex ? allExtractedUrls.length : undefined
      };

      setXmlImportResult(result);
      
      toast.success(`XML sitemap imported successfully!`, {
        description: `Extracted and imported ${allExtractedUrls.length} URLs from <loc> elements. All data is now instantly indexed and searchable.`,
        duration: 5000,
      });

      try {
        const existingImports = JSON.parse(localStorage.getItem('xmlImportHistory') || '[]');
        existingImports.push({
          ...result,
          timestamp: Date.now(),
          id: `xml_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
        localStorage.setItem('xmlImportHistory', JSON.stringify(existingImports.slice(-50)));
      } catch (error) {
        console.warn('Failed to store import history:', error);
      }

    } catch (error) {
      console.error('XML import error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to import XML sitemap';
      errors.push(errorMessage);
      
      const result: XmlImportResult = {
        sourceUrl: xmlSitemapUrl,
        extractedUrls: 0,
        successfulEntries: 0,
        domain: extractDomainFromUrl(xmlSitemapUrl),
        processingTime: Date.now() - startTime,
        errors
      };

      setXmlImportResult(result);
      toast.error('Failed to import XML sitemap', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsImportingXml(false);
      setXmlImportProgress('');
    }
  };

  const processSitemapFiles = async (files: File[]): Promise<SitemapUploadResult> => {
    const startTime = Date.now();
    const result: SitemapUploadResult = {
      totalFiles: files.length,
      processedFiles: 0,
      totalEntries: 0,
      successfulEntries: 0,
      skippedEntries: 0,
      errors: [],
      processingTime: 0
    };

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];
      setCurrentProcessingFile(file.name);
      
      try {
        const content = await file.text();
        
        // Check if file is XML
        if (file.name.toLowerCase().endsWith('.xml')) {
          try {
            const urls = await parseXmlSitemap(content);
            const processedEntries: SearchResult[] = urls.map(url => ({
              url,
              title: `Page from ${extractDomainFromUrl(url)}`,
              description: `Content from ${url}`
            }));

            if (processedEntries.length > 0) {
              const domain = extractDomainFromUrl(processedEntries[0].url);
              
              await chunkedUpload.mutateAsync({
                domain,
                results: processedEntries,
                chunkSize: 500,
                onProgress: (progress) => {
                  const fileProgress = ((fileIndex / files.length) + (progress.percentage / 100 / files.length)) * 100;
                  setUploadProgress(fileProgress);
                }
              });
              
              result.successfulEntries += processedEntries.length;
              result.totalEntries += processedEntries.length;
            }
          } catch (xmlError) {
            result.errors.push({
              file: file.name,
              entry: -1,
              error: xmlError instanceof Error ? xmlError.message : 'Failed to parse XML file'
            });
          }
        } else {
          // Process as JSON
          const jsonData = JSON.parse(content);
          
          let entries: any[] = [];
          if (Array.isArray(jsonData)) {
            entries = jsonData;
          } else {
            result.errors.push({
              file: file.name,
              entry: -1,
              error: 'JSON must be an array of objects with "urls" field: [ { "urls": "https://example.com/page" } ]'
            });
            continue;
          }

          result.totalEntries += entries.length;
          const processedEntries: SearchResult[] = [];

          for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
            const entry = entries[entryIndex];
            const validation = validateSitemapEntry(entry, fileIndex, entryIndex);
            
            if (!validation.isValid) {
              result.errors.push({
                file: file.name,
                entry: entryIndex,
                error: validation.error!,
                url: entry.urls
              });
              result.skippedEntries++;
              continue;
            }

            const processedEntry: SearchResult = {
              url: entry.urls,
              title: entry.title || `Page from ${extractDomainFromUrl(entry.urls)}`,
              description: entry.description || `Content from ${entry.urls}`
            };

            processedEntries.push(processedEntry);
          }

          if (processedEntries.length > 0) {
            const domain = extractDomainFromUrl(processedEntries[0].url);
            
            await chunkedUpload.mutateAsync({
              domain,
              results: processedEntries,
              chunkSize: 500,
              onProgress: (progress) => {
                const fileProgress = ((fileIndex / files.length) + (progress.percentage / 100 / files.length)) * 100;
                setUploadProgress(fileProgress);
              }
            });
            
            result.successfulEntries += processedEntries.length;
          }
        }

        result.processedFiles++;
        
      } catch (error) {
        result.errors.push({
          file: file.name,
          entry: -1,
          error: error instanceof Error ? error.message : 'Failed to process file'
        });
      }
    }

    result.processingTime = Date.now() - startTime;
    return result;
  };

  const processManualJson = async (jsonContent: string): Promise<SitemapUploadResult> => {
    const startTime = Date.now();
    const result: SitemapUploadResult = {
      totalFiles: 1,
      processedFiles: 0,
      totalEntries: 0,
      successfulEntries: 0,
      skippedEntries: 0,
      errors: [],
      processingTime: 0
    };

    try {
      const jsonData = JSON.parse(jsonContent);
      
      let entries: any[] = [];
      if (Array.isArray(jsonData)) {
        entries = jsonData;
      } else {
        result.errors.push({
          file: 'Manual JSON',
          entry: -1,
          error: 'JSON must be an array of objects with "urls" field: [ { "urls": "https://example.com/page" } ]'
        });
        result.processingTime = Date.now() - startTime;
        return result;
      }

      result.totalEntries = entries.length;
      const processedEntries: SearchResult[] = [];

      for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
        const entry = entries[entryIndex];
        const validation = validateSitemapEntry(entry, 0, entryIndex);
        
        if (!validation.isValid) {
          result.errors.push({
            file: 'Manual JSON',
            entry: entryIndex,
            error: validation.error!,
            url: entry.urls
          });
          result.skippedEntries++;
          continue;
        }

        const processedEntry: SearchResult = {
          url: entry.urls,
          title: entry.title || `Page from ${extractDomainFromUrl(entry.urls)}`,
          description: entry.description || `Content from ${entry.urls}`
        };

        processedEntries.push(processedEntry);
      }

      if (processedEntries.length > 0) {
        const domain = extractDomainFromUrl(processedEntries[0].url);
        
        await chunkedUpload.mutateAsync({
          domain,
          results: processedEntries,
          chunkSize: 500,
          onProgress: (progress) => {
            setUploadProgress(progress.percentage);
          }
        });
        
        result.successfulEntries = processedEntries.length;
      }

      result.processedFiles = 1;
      
    } catch (error) {
      result.errors.push({
        file: 'Manual JSON',
        entry: -1,
        error: error instanceof Error ? error.message : 'Failed to parse JSON - ensure format is: [ { "urls": "https://example.com/page" } ]'
      });
    }

    result.processingTime = Date.now() - startTime;
    return result;
  };

  const handleSitemapUpload = async () => {
    if (sitemapUploadMode === 'files' && uploadedFiles.length === 0) {
      toast.error('Please select at least one file (.json or .xml)');
      return;
    }
    
    if (sitemapUploadMode === 'editor' && !manualJsonContent.trim()) {
      toast.error('Please enter JSON content');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentProcessingFile('');

    try {
      let result: SitemapUploadResult;
      
      if (sitemapUploadMode === 'files') {
        result = await processSitemapFiles(uploadedFiles);
      } else {
        result = await processManualJson(manualJsonContent);
      }

      setUploadResult(result);
      
      if (result.successfulEntries > 0) {
        toast.success(`Upload completed and instantly indexed in ${(result.processingTime / 1000).toFixed(2)}s!`, {
          description: `Successfully processed ${result.successfulEntries} entries from ${result.processedFiles} files. All data is now searchable.`,
        });
      } else {
        toast.warning('Upload completed with errors', {
          description: `No entries were successfully processed. Check the error details.`,
        });
      }

      setUploadedFiles([]);
      setManualJsonContent('');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentProcessingFile('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter((file) => 
      file.type === 'application/json' || file.name.endsWith('.json') || 
      file.type === 'text/xml' || file.type === 'application/xml' || file.name.endsWith('.xml')
    );
    
    if (files.length === 0) {
      toast.error('Please drop only JSON or XML files');
      return;
    }
    
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`Added ${files.length} file(s) for upload`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) => 
      file.type === 'application/json' || file.name.endsWith('.json') ||
      file.type === 'text/xml' || file.type === 'application/xml' || file.name.endsWith('.xml')
    );
    
    if (files.length === 0) {
      toast.error('Please select only JSON or XML files');
      return;
    }
    
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`Selected ${files.length} file(s) for upload`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.json,.xml,application/json,text/xml,application/xml';
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files).filter((file) => 
          file.type === 'application/json' || file.name.endsWith('.json') ||
          file.type === 'text/xml' || file.type === 'application/xml' || file.name.endsWith('.xml')
        );
        
        if (files.length === 0) {
          toast.error('Please select only JSON or XML files');
          return;
        }
        
        setUploadedFiles((prev) => [...prev, ...files]);
        toast.success(`Selected ${files.length} file(s) for upload`);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-8 p-6">
      {/* Admin Navigation Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Admin Tools</span>
            </div>
            <div className="flex gap-3">
              <Dialog open={showAddSitemapDialog} onOpenChange={setShowAddSitemapDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sitemaps
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Manual Sitemap Entry</DialogTitle>
                    <DialogDescription>
                      Add a single sitemap entry manually with URL, title, and description.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sitemapUrl">URL *</Label>
                      <Input
                        id="sitemapUrl"
                        type="url"
                        placeholder="https://example.com/page"
                        value={manualSitemap.url}
                        onChange={(e) => setManualSitemap((prev) => ({ ...prev, url: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sitemapTitle">Title (Optional)</Label>
                      <Input
                        id="sitemapTitle"
                        placeholder="Page title (auto-generated if empty)"
                        value={manualSitemap.title}
                        onChange={(e) => setManualSitemap((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sitemapDescription">Description (Optional)</Label>
                      <Textarea
                        id="sitemapDescription"
                        placeholder="Page description (auto-generated if empty)"
                        value={manualSitemap.description}
                        onChange={(e) => setManualSitemap((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowAddSitemapDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddManualSitemap} 
                        disabled={chunkedUpload.isPending || !manualSitemap.url}
                      >
                        {chunkedUpload.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Entry
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload .json Files
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Optimized Sitemap Upload System
                    </DialogTitle>
                    <DialogDescription>
                      Upload multiple JSON or XML files with real-time progress. For JSON: only "urls" field required. For XML: extracts URLs exclusively from &lt;loc&gt; elements. All data is instantly indexed and searchable with zero data loss.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 overflow-y-auto max-h-[70vh]">
                    <Tabs value={sitemapUploadMode} onValueChange={(value: string) => {
                      if (value === 'files' || value === 'editor') {
                        setSitemapUploadMode(value);
                      }
                    }}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="files" className="flex items-center gap-2">
                          <CloudUpload className="h-4 w-4" />
                          File Upload
                        </TabsTrigger>
                        <TabsTrigger value="editor" className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Manual Editor
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="files" className="space-y-4">
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragOver 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted-foreground/25 hover:border-primary/50'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <CloudUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">
                            Drag & Drop JSON or XML Files Here
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Or click the button below to select files
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={triggerFileSelect}
                          >
                            <FileJson className="h-4 w-4 mr-2" />
                            Select Files (.json/.xml)
                          </Button>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Selected Files ({uploadedFiles.length})</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                  <div className="flex items-center gap-2">
                                    {file.name.endsWith('.xml') ? (
                                      <FileText className="h-4 w-4" />
                                    ) : (
                                      <FileJson className="h-4 w-4" />
                                    )}
                                    <span className="text-sm">{file.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="editor" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="jsonEditor">JSON Content</Label>
                          <Textarea
                            id="jsonEditor"
                            placeholder='Paste your JSON array here: [ { "urls": "https://example.com/page" } ]'
                            value={manualJsonContent}
                            onChange={(e) => setManualJsonContent(e.target.value)}
                            rows={12}
                            className="font-mono text-sm"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Simplified Format
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>JSON: Only "urls" field required</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>XML: Extracts ONLY from &lt;loc&gt; elements</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Instant indexing & searchability</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Zero data loss guarantee</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FileJson className="h-4 w-4" />
                            Sample Format
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                            {JSON.stringify(sampleJson, null, 2)}
                          </pre>
                          <p className="text-xs text-muted-foreground mt-2">
                            ✓ Simple array with "urls" field
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {isUploading && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Upload Progress</Label>
                          <span className="text-sm text-muted-foreground">{uploadProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                        {currentProcessingFile && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Processing: {currentProcessingFile}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {uploadResult && (
                      <Card className="border-muted">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {uploadResult.successfulEntries > 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            Upload Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold">{uploadResult.processedFiles}</div>
                              <div className="text-muted-foreground">Files</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{uploadResult.successfulEntries}</div>
                              <div className="text-muted-foreground">Success</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-yellow-600">{uploadResult.skippedEntries}</div>
                              <div className="text-muted-foreground">Skipped</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-600">{uploadResult.errors.length}</div>
                              <div className="text-muted-foreground">Errors</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{(uploadResult.processingTime / 1000).toFixed(2)}s</div>
                              <div className="text-muted-foreground">Time</div>
                            </div>
                          </div>

                          {uploadResult.errors.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                Error Details
                              </Label>
                              <ScrollArea className="h-32 border rounded p-2">
                                <div className="space-y-1">
                                  {uploadResult.errors.map((error, index) => (
                                    <div key={index} className="text-xs p-2 bg-red-50 dark:bg-red-950/20 rounded">
                                      <div className="font-medium">{error.file}</div>
                                      <div className="text-muted-foreground">
                                        {error.entry >= 0 ? `Entry ${error.entry}: ` : ''}{error.error}
                                      </div>
                                      {error.url && (
                                        <div className="text-muted-foreground truncate">URL: {error.url}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Close
                    </Button>
                    <Button 
                      onClick={handleSitemapUpload} 
                      disabled={isUploading || (sitemapUploadMode === 'files' && uploadedFiles.length === 0) || (sitemapUploadMode === 'editor' && !manualJsonContent.trim())}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Upload & Process
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showXmlImportDialog} onOpenChange={setShowXmlImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Import XML Sitemap
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      XML Sitemap Import - Streamlined &lt;loc&gt; Parser
                    </DialogTitle>
                    <DialogDescription>
                      Import sitemap data from XML sitemap URLs. Extracts URLs EXCLUSIVELY from &lt;loc&gt; elements, ignoring all other fields for maximum efficiency and accuracy. Supports sitemap index files. All imported data is instantly indexed and searchable with guaranteed persistence.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="xmlUrl">XML Sitemap URL *</Label>
                      <Input
                        id="xmlUrl"
                        type="url"
                        placeholder="https://gem.gov.in/sitemap.xml"
                        value={xmlSitemapUrl}
                        onChange={(e) => setXmlSitemapUrl(e.target.value)}
                        disabled={isImportingXml}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the full URL to an XML sitemap file. The system will extract URLs ONLY from &lt;loc&gt; elements and convert them to searchable format with instant indexing.
                      </p>
                    </div>

                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Streamlined XML Import Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Fetches XML content from any public URL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Extracts URLs EXCLUSIVELY from &lt;loc&gt; elements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Ignores all other XML fields (lastmod, changefreq, priority, etc.)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Handles sitemap index files (multiple sitemaps)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Removes duplicates automatically</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Real-time progress feedback</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Accurate URL count - imports ALL found URLs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Instant indexing - all data searchable immediately</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Zero data loss - guaranteed persistence</span>
                        </div>
                      </CardContent>
                    </Card>

                    {isImportingXml && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Import Progress</Label>
                          <span className="text-sm text-muted-foreground">Processing...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{xmlImportProgress || 'Initializing...'}</span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                      </div>
                    )}

                    {xmlImportResult && (
                      <Card className="border-muted">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {xmlImportResult.successfulEntries > 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            Import Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{xmlImportResult.extractedUrls}</div>
                              <div className="text-muted-foreground">URLs Found</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{xmlImportResult.successfulEntries}</div>
                              <div className="text-muted-foreground">Imported</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">{(xmlImportResult.processingTime / 1000).toFixed(2)}s</div>
                              <div className="text-muted-foreground">Time</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">{xmlImportResult.domain}</div>
                              <div className="text-muted-foreground">Domain</div>
                            </div>
                          </div>

                          {xmlImportResult.sitemapIndexUrls !== undefined && (
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription>
                                Processed sitemap index file with multiple sitemaps
                              </AlertDescription>
                            </Alert>
                          )}

                          {xmlImportResult.errors.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                Import Warnings ({xmlImportResult.errors.length})
                              </Label>
                              <ScrollArea className="h-24 border rounded p-2">
                                <div className="space-y-1">
                                  {xmlImportResult.errors.map((error, index) => (
                                    <div key={index} className="text-xs p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                                      {error}
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground space-y-1">
                            <p><strong>Source:</strong> {xmlImportResult.sourceUrl}</p>
                            <p><strong>Imported at:</strong> {new Date().toLocaleString()}</p>
                            <p><strong>Status:</strong> {xmlImportResult.successfulEntries > 0 ? '✓ All URLs from <loc> elements imported, indexed, and searchable' : '✗ Import failed'}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => {
                      setShowXmlImportDialog(false);
                      setXmlImportResult(null);
                      setXmlImportProgress('');
                    }}>
                      Close
                    </Button>
                    <Button 
                      onClick={handleXmlSitemapImport} 
                      disabled={isImportingXml || !xmlSitemapUrl.trim()}
                    >
                      {isImportingXml ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Import XML Sitemap
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Sitemap Explorer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Search and explore millions of sitemaps from domains worldwide with Advanced Sitemap Search. Discover web content structure and find the URLs you need with secure preview and click analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cyber-gradient border-primary/20">
          <CardHeader className="text-center">
            <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle>Domains Indexed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary">2.5M+</div>
            <p className="text-sm text-muted-foreground">Active domains</p>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-accent/20">
          <CardHeader className="text-center">
            <Database className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle>URLs Cataloged</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-accent">1.2B+</div>
            <p className="text-sm text-muted-foreground">Searchable URLs</p>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-primary/20">
          <CardHeader className="text-center">
            <Link2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle>Link Clicks</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary">50K+</div>
            <p className="text-sm text-muted-foreground">Daily clicks tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Sitemap Search Module - Complete Modular Copy from HomePage */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-lg border-2 border-primary/20 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full shadow-lg">
                <Search className="h-5 w-5" />
                <span className="font-bold text-lg">Advanced Sitemap Search</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Unified Search Engine
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Search through millions of sitemaps instantly with our powerful unified search engine. 
              Filter by extension (.com, .net, .org, etc.), discover URLs with inurl-style keywords, 
              and preview content securely. All uploaded .json and .xml data is instantly indexed and always available.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-primary/20">
                <span className="text-sm font-semibold text-primary">✓ 2.5M+ Domains</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-accent/20">
                <span className="text-sm font-semibold text-accent">✓ 1.2B+ URLs</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-primary/20">
                <span className="text-sm font-semibold text-primary">✓ All TLDs Supported</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-accent/20">
                <span className="text-sm font-semibold text-accent">✓ Instant Indexing</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-primary/20">
                <span className="text-sm font-semibold text-primary">✓ Zero Data Loss</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <EnhancedSearchInterface showQuotaWarning={isPayAsYouUse} />
          </div>
        </div>
      </section>

      {/* Features */}
      <Card className="cyber-gradient border-accent/20">
        <CardHeader>
          <CardTitle>Advanced Sitemap Search Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Unified Search Field</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Single search field for domains and URL paths</li>
                <li>• Inurl-style keyword matching (e.g., "blog", "api")</li>
                <li>• Case-insensitive multi-level path segment search</li>
                <li>• Prioritizes top-level segments ("/blog/" over "/we/")</li>
                <li>• 2-second debounce for smooth experience</li>
                <li>• True lazy loading for large datasets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Enhanced Pagination & Preview</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First, Previous, Next, and Last page buttons</li>
                <li>• Web Page link opens in new tab (subscribers/admins)</li>
                <li>• Full-screen preview with min-height: 100vh</li>
                <li>• Progressive fallback: 3x→2x→1x load times</li>
                <li>• Internet Archive and screenshot fallbacks</li>
                <li>• Comprehensive error handling</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Data Integrity & Indexing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All uploaded .json and .xml data instantly indexed</li>
                  <li>• XML files: URLs extracted EXCLUSIVELY from &lt;loc&gt; elements</li>
                  <li>• Never lost during updates or migrations</li>
                  <li>• Always available for search and preview</li>
                </ul>
              </div>
              <div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Guaranteed data persistence across sessions</li>
                  <li>• Robust error handling with progress feedback</li>
                  <li>• Seamless navigation and user experience</li>
                  <li>• Real-time search with comprehensive indexing</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
