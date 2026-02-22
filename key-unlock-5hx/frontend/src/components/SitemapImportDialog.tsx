import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, Link as LinkIcon, CheckCircle2, AlertCircle, Hash, Info } from 'lucide-react';
import { useImportSitemapFromXML, useImportSitemapFromURL } from '../hooks/useSitemapImport';

interface SitemapImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/features</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/pricing</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://example.com/blog</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

const SAMPLE_PLAIN_TEXT = `https://example.com/
https://example.com/about
https://example.com/features
https://example.com/pricing
https://example.com/blog
https://example.com/contact`;

export default function SitemapImportDialog({ open, onOpenChange }: SitemapImportDialogProps) {
  const [appName, setAppName] = useState('');
  const [xmlContent, setXmlContent] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [activeTab, setActiveTab] = useState('xml');

  const importFromXML = useImportSitemapFromXML();
  const importFromURL = useImportSitemapFromURL();

  const handleImportXML = async () => {
    if (!xmlContent.trim() || !appName.trim()) return;

    try {
      await importFromXML.mutateAsync({ xmlContent, appName });
      setXmlContent('');
      setAppName('');
      // Keep dialog open to show success message
      setTimeout(() => {
        importFromXML.reset();
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const handleImportURL = async () => {
    if (!sitemapUrl.trim() || !appName.trim()) return;

    try {
      await importFromURL.mutateAsync({ sitemapUrl, appName });
      setSitemapUrl('');
      setAppName('');
      // Keep dialog open to show success message
      setTimeout(() => {
        importFromURL.reset();
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const loadSampleXML = () => {
    setXmlContent(SAMPLE_SITEMAP);
    setAppName('Sample App');
  };

  const loadSamplePlainText = () => {
    setXmlContent(SAMPLE_PLAIN_TEXT);
    setAppName('Sample App');
  };

  const isLoading = importFromXML.isPending || importFromURL.isPending;
  const error = importFromXML.error || importFromURL.error;
  const success = importFromXML.isSuccess || importFromURL.isSuccess;

  const getErrorMessage = (err: Error | null): string => {
    if (!err) return 'An unknown error occurred';
    return err.message || 'Failed to import sitemap';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto card-3d">
        <DialogHeader>
          <DialogTitle className="text-gradient flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Sitemap - XML, Plain Text & URL Support
          </DialogTitle>
          <DialogDescription>
            Import sitemap XML, plain text URLs (multiline), or fetch from URL to dynamically update menu with hierarchical external links and Merkle root hash verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="appName">App Name *</Label>
            <Input
              id="appName"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g., N8n Tasks, N8n Workflows, e-Contracts, Infitask"
              className="mt-1"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Imported links will be grouped under this app in the hierarchical menu structure
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="xml" disabled={isLoading}>
                <Upload className="w-4 h-4 mr-2" />
                XML / Plain Text
              </TabsTrigger>
              <TabsTrigger value="url" disabled={isLoading}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Sitemap URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="xml" className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="xmlContent">Sitemap XML or Plain Text URLs *</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadSampleXML} disabled={isLoading}>
                      Load XML Sample
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadSamplePlainText} disabled={isLoading}>
                      Load Text Sample
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="xmlContent"
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  placeholder="Paste sitemap XML or plain text URLs (one per line)...&#10;&#10;Examples:&#10;XML: <?xml version=&quot;1.0&quot;?>...&#10;Plain Text:&#10;https://example.com/&#10;https://example.com/about&#10;https://example.com/features"
                  className="font-mono text-sm min-h-[300px]"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Supports both formats:</strong> XML sitemap format and plain text URLs (one per line). All URLs will be extracted and displayed hierarchically in the menu.
                </p>
              </div>

              <Alert>
                <Hash className="h-4 w-4" />
                <AlertDescription>
                  <strong>Merkle Root Hash Verification:</strong> A cryptographic hash will be generated for integrity tracking and tamper-proof verification of all imported URLs.
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Hierarchical Display & External Links</AlertTitle>
                <AlertDescription className="text-xs space-y-1 mt-2">
                  <p>• All imported URLs displayed as hierarchical tree structure in menu</p>
                  <p>• URLs organized by path segments for easy navigation</p>
                  <p>• External links marked with unique icon and open in new tabs</p>
                  <p>• Robust error handling prevents blank screens on malformed data</p>
                  <p>• Supports multiline text input for bulk URL import</p>
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="sitemapUrl">Sitemap URL *</Label>
                <Input
                  id="sitemapUrl"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="mt-1"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the full URL to your sitemap.xml file (supports both XML and plain text formats)
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>CORS & Network Considerations</AlertTitle>
                <AlertDescription className="text-xs space-y-1 mt-2">
                  <p>• The sitemap server must allow cross-origin requests (CORS)</p>
                  <p>• If CORS fails, download the sitemap and use the XML/Plain Text tab instead</p>
                  <p>• Network timeout is set to 30 seconds</p>
                  <p>• Comprehensive error handling with user-friendly messages</p>
                  <p>• Robust error boundaries prevent blank screens on failure</p>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription className="text-sm mt-2">
                {getErrorMessage(error as Error)}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Success!</AlertTitle>
              <AlertDescription className="text-success text-sm mt-2">
                Sitemap imported successfully! Menu has been updated with hierarchical external links and Merkle root hash verification.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Badge variant="outline">Enhanced Features</Badge>
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Parses XML and plain text formats (multiline support)</li>
              <li>• Manual sitemap URL input field for both XML and plain text</li>
              <li>• Error-tolerant: handles malformed entries gracefully</li>
              <li>• Generates Merkle root hash for integrity verification</li>
              <li>• External links marked with unique icon and open in new tabs</li>
              <li>• Hierarchical tree display for all imported URLs in menu</li>
              <li>• Scalable system supporting unlimited sitemap sources</li>
              <li>• Real-time menu updates without code changes</li>
              <li>• Robust error boundaries prevent blank screens</li>
              <li>• All 7 SECOINFI apps with verified production URLs</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={activeTab === 'xml' ? handleImportXML : handleImportURL}
            disabled={isLoading || (activeTab === 'xml' ? !xmlContent.trim() : !sitemapUrl.trim()) || !appName.trim()}
            className="neon-glow"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Importing...
              </>
            ) : (
              'Import Sitemap'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

