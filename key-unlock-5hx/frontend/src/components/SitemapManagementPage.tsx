import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Upload, ExternalLink, Hash, Trash2, CheckCircle2, Clock, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useImportedSitemaps, useDeleteImportedSitemap } from '../hooks/useSitemapImport';
import SitemapImportDialog from './SitemapImportDialog';

export default function SitemapManagementPage() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { data: importedSitemaps = [], isLoading, isError } = useImportedSitemaps();
  const deleteSitemap = useDeleteImportedSitemap();

  const handleDelete = async (appName: string) => {
    if (confirm(`Delete imported sitemap for ${appName}?`)) {
      try {
        await deleteSitemap.mutateAsync(appName);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/10 to-background p-8 card-3d">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 border-2 border-primary/50 neon-glow">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">Sitemap Import & Management</h1>
              <p className="text-muted-foreground mt-1">
                Modular XML parsing with hash-based verification and dynamic menu updates
              </p>
            </div>
          </div>
        </div>
        <img
          src="/assets/generated/sitemap-import-interface.dim_1024x768.png"
          alt="Sitemap Import"
          className="absolute top-0 right-0 w-64 h-64 object-cover opacity-20 blur-sm"
        />
      </div>

      {/* Import Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Imported Sitemaps</h2>
          <p className="text-muted-foreground">Manage sitemap imports and view hash verification</p>
        </div>
        <Button onClick={() => setImportDialogOpen(true)} className="neon-glow">
          <Upload className="w-4 h-4 mr-2" />
          Import Sitemap
        </Button>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hash className="w-5 h-5 text-primary" />
              Hash Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Merkle root structure ensures tamper-proof tracking and integrity verification
            </p>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ExternalLink className="w-5 h-5 text-primary" />
              External Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All imported links open in new tabs with clear visual indicators and tooltips
            </p>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Error Tolerant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Handles malformed XML gracefully, extracting all valid URLs even if some fields are missing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load imported sitemaps. The data may be corrupted. Try importing a new sitemap.
          </AlertDescription>
        </Alert>
      )}

      {/* Imported Sitemaps List */}
      {isLoading ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading imported sitemaps...</p>
          </CardContent>
        </Card>
      ) : importedSitemaps.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="py-12 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sitemaps Imported Yet</h3>
            <p className="text-muted-foreground mb-4">
              Import your first sitemap to dynamically update the menu with external links
            </p>
            <Button onClick={() => setImportDialogOpen(true)} className="neon-glow">
              <Upload className="w-4 h-4 mr-2" />
              Import Sitemap
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {importedSitemaps.map((sitemap) => (
            <Card key={sitemap.id} className="card-3d">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {sitemap.appName}
                      <Badge variant="outline" className="ml-2">
                        {sitemap.result.urls.length} URLs
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(sitemap.result.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {sitemap.result.hash.slice(0, 12)}...
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(sitemap.appName)}
                    disabled={deleteSitemap.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Hash className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Merkle Root Hash:</strong> <code className="text-xs">{sitemap.result.hash}</code>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Imported URLs ({sitemap.result.urls.length})
                  </h4>
                  <ScrollArea className="h-48 rounded-md border p-4">
                    <div className="space-y-2">
                      {sitemap.result.urls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <a
                            href={url.loc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {url.loc}
                          </a>
                          {url.priority && (
                            <Badge variant="secondary" className="text-xs">
                              P: {url.priority}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Menu Items Generated</h4>
                  <div className="flex flex-wrap gap-2">
                    {sitemap.menuItems.slice(0, 10).map((item) => (
                      <Badge key={item.id} variant="outline" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {item.menuLabel}
                      </Badge>
                    ))}
                    {sitemap.menuItems.length > 10 && (
                      <Badge variant="secondary">+{sitemap.menuItems.length - 10} more</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Hash Verification Info */}
      <Card className="card-3d border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img
              src="/assets/generated/hash-verification-3d.dim_800x600.png"
              alt="Hash Verification"
              className="w-8 h-8 rounded"
            />
            Hash-Based Integrity Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            All imported sitemaps use Merkle root hash structures for tamper-proof verification and secure tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Real-time integrity verification</li>
                <li>• Tamper-proof link tracking</li>
                <li>• Secure cross-app distribution</li>
                <li>• Scalable hash-based architecture</li>
                <li>• Error-tolerant XML parsing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Benefits:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ensures data integrity</li>
                <li>• Prevents unauthorized changes</li>
                <li>• Enables audit trails</li>
                <li>• Supports distributed systems</li>
                <li>• Handles malformed data gracefully</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <SitemapImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </div>
  );
}
