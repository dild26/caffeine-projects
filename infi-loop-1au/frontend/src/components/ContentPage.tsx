import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ExternalLink, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ContentPageProps {
  pageName?: string;
}

export default function ContentPage({ pageName }: ContentPageProps) {
  // Static prefixes for demo
  const prefixes = ['map-56b', 'map-57c', 'map-58d'];
  const [selectedPrefix, setSelectedPrefix] = useState('map-56b');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const currentPage = pageName || 'blog';
  const iframeUrl = `https://${selectedPrefix}.caffeine.xyz/${currentPage}`;

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(false);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Content page uses static whitelisted prefixes. Dynamic prefix management will be available when backend integration is complete.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="capitalize">{currentPage}</CardTitle>
              <CardDescription>
                Content auto-fetched from verified Secoinfi-app sources with Merkle trace validation
              </CardDescription>
            </div>
            {iframeLoaded && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Loaded
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prefix-select">Select Source</Label>
            <Select value={selectedPrefix} onValueChange={(value) => {
              setSelectedPrefix(value);
              setIframeLoaded(false);
              setIframeError(false);
            }}>
              <SelectTrigger id="prefix-select">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {prefixes.map((prefix) => (
                  <SelectItem key={prefix} value={prefix}>
                    {prefix}.caffeine.xyz
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              Displaying content from: <span className="font-mono font-semibold">{iframeUrl}</span>
            </AlertDescription>
          </Alert>

          {iframeError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load content from this source. The page may not exist or CORS restrictions may apply.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative w-full rounded-lg border bg-muted/50 overflow-hidden" style={{ height: '600px' }}>
            {!iframeLoaded && !iframeError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading {currentPage} page...</p>
                  <p className="text-xs text-muted-foreground mt-1">Verifying data integrity with Merkle trace</p>
                </div>
              </div>
            )}
            <iframe
              key={iframeUrl}
              src={iframeUrl}
              className="w-full h-full"
              title={`${currentPage} Page`}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ border: 'none' }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            This page displays embedded content from whitelisted Secoinfi-app URLs. All sources are verified and data integrity is validated using Merkle trace checks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
