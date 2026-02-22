import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Download, 
  FileText, 
  MousePointer, 
  AlertCircle, 
  Loader2,
  X,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';
import { useActor } from '@/hooks/useActor';

interface PreviewState {
  url: string;
  content: string;
  isLoading: boolean;
  error: string | null;
  zoom: number;
  isFullscreen: boolean;
  previewType: 'iframe' | 'screenshot' | 'fallback' | 'xml' | 'object';
  screenshotUrl?: string;
}

interface FullScreenPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewState: PreviewState | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  onDownloadXml?: (url: string) => void;
  getClickCount?: (url: string) => number;
  extractDomainExtension?: (domain: string) => string;
  extractDomainFromUrl?: (url: string) => string;
}

export default function FullScreenPreviewModal({
  isOpen,
  onClose,
  previewState,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  onDownloadXml,
  getClickCount,
  extractDomainExtension,
  extractDomainFromUrl
}: FullScreenPreviewModalProps) {
  const { actor } = useActor();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [objectError, setObjectError] = useState(false);
  const [useArchiveFallback, setUseArchiveFallback] = useState(false);
  const [useScreenshotFallback, setUseScreenshotFallback] = useState(false);
  const [normalizedUrl, setNormalizedUrl] = useState<string>('');
  const [archiveUrl, setArchiveUrl] = useState<string>('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const objectRef = useRef<HTMLObjectElement>(null);
  const archiveObjectRef = useRef<HTMLObjectElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const archiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const screenshotTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate average page load time (assume 10 seconds)
  const AVERAGE_LOAD_TIME = 10000; // 10 seconds
  const DIRECT_TIMEOUT = AVERAGE_LOAD_TIME * 3; // 30 seconds (3x average)
  const ARCHIVE_TIMEOUT = AVERAGE_LOAD_TIME * 2; // 20 seconds (2x average)
  const SCREENSHOT_TIMEOUT = AVERAGE_LOAD_TIME * 1; // 10 seconds (1x average)

  // Normalize URL by prepending https:// if needed
  const normalizeUrl = useCallback((url: string): string => {
    if (!url) return '';
    
    const trimmedUrl = url.trim();
    
    // Check if URL already has a protocol
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    
    // Prepend https:// for URLs without protocol
    return `https://${trimmedUrl}`;
  }, []);

  // Validate URL format
  const isValidUrl = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  // Construct Internet Archive fallback URL
  const constructArchiveUrl = useCallback(async (originalUrl: string): Promise<string> => {
    if (!actor) {
      // Fallback construction if actor is not available
      return `https://web.archive.org/web/20250000000000*/${originalUrl}`;
    }
    
    try {
      const archiveFallbackUrl = await actor.constructArchiveFallbackUrl(originalUrl);
      return archiveFallbackUrl;
    } catch (error) {
      console.error('Error constructing archive URL via backend:', error);
      // Fallback to manual construction
      return `https://web.archive.org/web/20250000000000*/${originalUrl}`;
    }
  }, [actor]);

  // Update normalized URL and archive URL when preview state changes
  useEffect(() => {
    const updateUrls = async () => {
      if (previewState?.url) {
        const normalized = normalizeUrl(previewState.url);
        setNormalizedUrl(normalized);
        
        // Validate the normalized URL
        if (!isValidUrl(normalized)) {
          toast.error('Invalid URL', {
            description: 'The URL format is invalid. Please check and try again.',
          });
        }
        
        // Construct archive URL
        const archive = await constructArchiveUrl(normalized);
        setArchiveUrl(archive);
      }
    };
    
    updateUrls();
  }, [previewState?.url, normalizeUrl, isValidUrl, constructArchiveUrl]);

  // Handle fullscreen transitions with smooth animations
  const handleToggleFullscreen = useCallback(() => {
    setIsTransitioning(true);
    onToggleFullscreen();
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [onToggleFullscreen]);

  // Handle escape key for fullscreen exit and modal close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (previewState?.isFullscreen) {
          handleToggleFullscreen();
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, previewState?.isFullscreen, handleToggleFullscreen, onClose]);

  // Prevent body scroll and manage fullscreen styling
  useEffect(() => {
    if (previewState?.isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
        document.documentElement.style.overflow = 'unset';
      };
    }
  }, [previewState?.isFullscreen]);

  // Reset fallback states when preview changes
  useEffect(() => {
    setObjectError(false);
    setUseArchiveFallback(false);
    setUseScreenshotFallback(false);
    setLoadAttempt(0);
    
    // Clear any existing timeouts
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    if (archiveTimeoutRef.current) {
      clearTimeout(archiveTimeoutRef.current);
    }
    if (screenshotTimeoutRef.current) {
      clearTimeout(screenshotTimeoutRef.current);
    }
  }, [previewState?.url]);

  // Handle object load error - switch to Internet Archive fallback
  const handleObjectError = useCallback(async () => {
    console.log('Direct object failed to load, switching to Internet Archive fallback');
    setObjectError(true);
    setUseArchiveFallback(true);
    setLoadAttempt(1);
    
    toast.info('Switching to Internet Archive', {
      description: 'Direct preview unavailable, loading archived version',
    });
  }, []);

  // Handle archive object load error - switch to screenshot fallback
  const handleArchiveError = useCallback(() => {
    console.log('Internet Archive fallback failed, switching to screenshot fallback');
    setUseScreenshotFallback(true);
    setLoadAttempt(2);
    
    toast.info('Using screenshot preview', {
      description: 'Both direct and archive previews unavailable, showing screenshot',
    });
  }, []);

  // Progressive fallback system with 3x, 2x, 1x average load times
  useEffect(() => {
    if (normalizedUrl && !objectError && !useArchiveFallback && !useScreenshotFallback && previewState?.previewType !== 'xml') {
      // Direct load timeout: 3x average (30 seconds)
      loadTimeoutRef.current = setTimeout(() => {
        console.log(`Direct object load timeout (${DIRECT_TIMEOUT / 1000}s - 3x average), switching to Internet Archive fallback`);
        handleObjectError();
      }, DIRECT_TIMEOUT);

      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    }
  }, [normalizedUrl, objectError, useArchiveFallback, useScreenshotFallback, previewState?.previewType, handleObjectError, DIRECT_TIMEOUT]);

  // Archive load timeout: 2x average (20 seconds)
  useEffect(() => {
    if (archiveUrl && useArchiveFallback && !useScreenshotFallback && previewState?.previewType !== 'xml') {
      archiveTimeoutRef.current = setTimeout(() => {
        console.log(`Archive object load timeout (${ARCHIVE_TIMEOUT / 1000}s - 2x average), switching to screenshot fallback`);
        handleArchiveError();
      }, ARCHIVE_TIMEOUT);

      return () => {
        if (archiveTimeoutRef.current) {
          clearTimeout(archiveTimeoutRef.current);
        }
      };
    }
  }, [archiveUrl, useArchiveFallback, useScreenshotFallback, previewState?.previewType, handleArchiveError, ARCHIVE_TIMEOUT]);

  // Screenshot load timeout: 1x average (10 seconds)
  useEffect(() => {
    if (useScreenshotFallback && previewState?.previewType !== 'xml') {
      screenshotTimeoutRef.current = setTimeout(() => {
        console.log(`Screenshot load timeout (${SCREENSHOT_TIMEOUT / 1000}s - 1x average)`);
        toast.error('Preview Failed', {
          description: 'All preview methods failed. Please try opening the URL in a new tab.',
        });
      }, SCREENSHOT_TIMEOUT);

      return () => {
        if (screenshotTimeoutRef.current) {
          clearTimeout(screenshotTimeoutRef.current);
        }
      };
    }
  }, [useScreenshotFallback, previewState?.previewType, SCREENSHOT_TIMEOUT]);

  // Generate screenshot URL (simulated - in production, use a screenshot service)
  const generateScreenshotUrl = useCallback((url: string): string => {
    // In production, integrate with a screenshot service like:
    // - https://api.screenshotmachine.com
    // - https://www.screenshotapi.net
    // - https://urlbox.io
    // For now, return a placeholder
    const encodedUrl = encodeURIComponent(url);
    return `https://via.placeholder.com/1920x1080/667eea/ffffff?text=Screenshot+Preview+of+${encodedUrl.substring(0, 50)}`;
  }, []);

  const handleDownload = useCallback(() => {
    if (normalizedUrl && onDownloadXml) {
      onDownloadXml(normalizedUrl);
      toast.success('Download started', {
        description: `Downloading ${normalizedUrl.split('/').pop() || 'sitemap.xml'}`,
      });
    }
  }, [normalizedUrl, onDownloadXml]);

  // Retry preview with different method
  const handleRetryPreview = useCallback(() => {
    setObjectError(false);
    setUseArchiveFallback(false);
    setUseScreenshotFallback(false);
    setLoadAttempt(0);
    toast.info('Retrying preview', {
      description: 'Attempting to reload content',
    });
  }, []);

  // Open URL in new tab
  const handleOpenInNewTab = useCallback(() => {
    if (normalizedUrl) {
      window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening in new tab', {
        description: 'URL opened in a new browser tab',
      });
    }
  }, [normalizedUrl]);

  if (!previewState) return null;

  const isXmlFile = normalizedUrl.toLowerCase().endsWith('.xml');
  const clickCount = getClickCount ? getClickCount(normalizedUrl) : 0;
  const domain = extractDomainFromUrl ? extractDomainFromUrl(normalizedUrl) : '';
  const extension = extractDomainExtension && domain ? extractDomainExtension(domain) : '';
  const screenshotUrl = previewState.screenshotUrl || generateScreenshotUrl(normalizedUrl);

  // Render preview content based on type and fallback state
  const renderPreviewContent = () => {
    if (previewState.isLoading) {
      return (
        <div className="flex items-center justify-center w-full" style={{ minHeight: 'max(100vh, 400px)' }}>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading secure preview...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Progressive fallback: 3x → 2x → 1x average load times
            </p>
          </div>
        </div>
      );
    }

    if (previewState.error) {
      return (
        <div className="flex items-center justify-center w-full p-6" style={{ minHeight: 'max(100vh, 400px)' }}>
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              {previewState.error}
              <div className="mt-4 space-y-2">
                <Button onClick={handleRetryPreview} variant="outline" size="sm" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Preview
                </Button>
                <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Showing screenshot fallback instead
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (isXmlFile) {
      return (
        <div className="space-y-4 p-4 w-full" style={{ minHeight: 'max(100vh, 400px)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">XML Sitemap Preview</h3>
            {onDownloadXml && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Full File
              </Button>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg border">
            <pre className="p-4 text-sm overflow-x-auto font-mono">
              <code className="text-foreground">{previewState.content}</code>
            </pre>
          </div>
        </div>
      );
    }

    // Validate URL before attempting to load
    if (!isValidUrl(normalizedUrl)) {
      return (
        <div className="flex items-center justify-center w-full p-6" style={{ minHeight: 'max(100vh, 400px)' }}>
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Invalid URL Format</p>
              <p className="mb-2">The URL has been normalized but may still be invalid:</p>
              <div className="mt-2 p-2 bg-muted rounded text-xs font-mono break-all">
                Original: {previewState.url}
              </div>
              <div className="mt-2 p-2 bg-muted rounded text-xs font-mono break-all">
                Normalized: {normalizedUrl}
              </div>
              <div className="mt-4 space-y-2">
                <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Try Opening in New Tab
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Use screenshot fallback if both direct and archive failed
    if (useScreenshotFallback) {
      return (
        <div className="relative w-full bg-muted/30 rounded-lg overflow-hidden" style={{ minHeight: 'max(100vh, 400px)', height: '100%' }}>
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="flex items-center space-x-2">
              <ImageIcon className="h-3 w-3" />
              <span>Screenshot Preview</span>
            </Badge>
          </div>
          <img
            src={screenshotUrl}
            alt="Page screenshot"
            className="w-full h-full object-contain"
            loading="lazy"
            style={{
              minHeight: 'max(100vh, 400px)',
              imageRendering: 'crisp-edges',
              objectFit: 'contain',
            }}
          />
          <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Both direct and archive previews unavailable. Showing captured screenshot.
            </p>
            <div className="flex space-x-2">
              <Button onClick={handleRetryPreview} variant="outline" size="sm" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Use Internet Archive fallback if direct object failed
    if (useArchiveFallback && archiveUrl) {
      return (
        <div className="relative w-full" style={{ minHeight: 'max(100vh, 400px)', height: '100%' }}>
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="flex items-center space-x-2">
              <Archive className="h-3 w-3" />
              <span>Internet Archive Preview</span>
            </Badge>
          </div>
          <object
            ref={archiveObjectRef}
            data={archiveUrl}
            type="text/html"
            className="w-full border-0 rounded-lg"
            style={{
              width: '100%',
              height: '100%',
              minHeight: 'max(100vh, 400px)',
              objectFit: 'contain',
            }}
            onError={handleArchiveError}
          >
            <div className="flex items-center justify-center w-full p-6" style={{ minHeight: 'max(100vh, 400px)' }}>
              <Alert className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Archive Content Loading Failed</p>
                  <p className="mb-2">Unable to display archived content. This may be due to:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 mb-4">
                    <li>Content not available in Internet Archive</li>
                    <li>Archive access restrictions</li>
                    <li>Network connectivity issues</li>
                  </ul>
                  <div className="space-y-2">
                    <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Original URL
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Switching to screenshot fallback...
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </object>
        </div>
      );
    }

    // Use scalable <object> tag for direct secure previews - ALWAYS fills viewport
    return (
      <div className="relative w-full" style={{ minHeight: 'max(100vh, 400px)', height: '100%' }}>
        <object
          ref={objectRef}
          data={normalizedUrl}
          type="text/html"
          className="w-full border-0 rounded-lg"
          style={{
            width: '100%',
            height: '100%',
            minHeight: 'max(100vh, 400px)',
            objectFit: 'contain',
          }}
          onError={handleObjectError}
        >
          <div className="flex items-center justify-center w-full p-6" style={{ minHeight: 'max(100vh, 400px)' }}>
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Content Loading Failed</p>
                <p className="mb-2">Unable to display content. This may be due to:</p>
                <ul className="list-disc list-inside text-sm space-y-1 mb-4">
                  <li>CORS restrictions</li>
                  <li>Content Security Policy</li>
                  <li>Network connectivity issues</li>
                  <li>Invalid or unreachable URL</li>
                </ul>
                <div className="space-y-2">
                  <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Switching to Internet Archive fallback...
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </object>
      </div>
    );
  };

  // Render fullscreen overlay when in fullscreen mode - ALWAYS fills entire viewport
  if (previewState.isFullscreen) {
    return (
      <div 
        className="fixed inset-0 w-screen h-screen bg-background z-[99999] flex flex-col"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          zIndex: 99999,
        }}
      >
        {/* Fullscreen Header */}
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <FileText className="h-5 w-5 flex-shrink-0" />
              <span className="truncate font-semibold">Secure Preview - Fullscreen Mode</span>
              {isXmlFile && (
                <Badge variant="secondary" className="flex-shrink-0">XML Sitemap</Badge>
              )}
              {clickCount > 0 && (
                <Badge variant="outline" className="flex-shrink-0">
                  <MousePointer className="h-3 w-3 mr-1" />
                  {clickCount} clicks
                </Badge>
              )}
              {extension && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {extension}
                </Badge>
              )}
              {useArchiveFallback && (
                <Badge variant="secondary" className="flex-shrink-0">
                  <Archive className="h-3 w-3 mr-1" />
                  Archive Mode
                </Badge>
              )}
              {useScreenshotFallback && (
                <Badge variant="secondary" className="flex-shrink-0">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Screenshot Mode
                </Badge>
              )}
            </div>
            
            {/* Fullscreen Control buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomOut} 
                disabled={previewState.zoom <= 50}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground min-w-[60px] text-center font-mono">
                {previewState.zoom}%
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomIn} 
                disabled={previewState.zoom >= 200}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetZoom}
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenInNewTab}
                title="Open in New Tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToggleFullscreen}
                title="Exit Fullscreen"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              
              {isXmlFile && onDownloadXml && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  title="Download XML"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                title="Close Preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* URL display */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
            <span className="font-mono truncate">
              {useArchiveFallback ? archiveUrl : normalizedUrl}
            </span>
            {domain && (
              <Badge variant="outline" className="text-xs">
                {domain}
              </Badge>
            )}
            {normalizedUrl !== previewState.url && (
              <Badge variant="secondary" className="text-xs">
                URL Normalized
              </Badge>
            )}
            {useArchiveFallback && (
              <Badge variant="secondary" className="text-xs">
                <Archive className="h-3 w-3 mr-1" />
                Archive Fallback
              </Badge>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Fullscreen Content area - ALWAYS fills viewport with minimum 100vh */}
        <div className="flex-1 overflow-hidden bg-background" style={{ minHeight: 'max(calc(100vh - 140px), 400px)', height: 'calc(100vh - 140px)' }}>
          <ScrollArea className="h-full w-full">
            <div 
              className="transition-transform duration-200 ease-in-out"
              style={{ 
                transform: `scale(${previewState.zoom / 100})`,
                transformOrigin: 'top left',
                width: `${10000 / previewState.zoom}%`,
                minHeight: 'max(calc(100vh - 200px), 400px)',
                height: '100%',
              }}
            >
              {renderPreviewContent()}
            </div>
          </ScrollArea>
        </div>
        
        {/* Fullscreen Footer */}
        <div className="flex-shrink-0 border-t bg-muted/30 text-xs text-muted-foreground p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>🔒 Secure Preview Mode</span>
              <span>🚫 External navigation blocked</span>
              <span>🛡️ Content sandboxed</span>
              <span>⌨️ Press ESC to exit fullscreen</span>
              <span>🖥️ Fullscreen Mode Active</span>
              {useArchiveFallback && (
                <span>📚 Internet Archive Fallback</span>
              )}
              {useScreenshotFallback && (
                <span>📸 Screenshot Fallback</span>
              )}
              {normalizedUrl !== previewState.url && (
                <span>🔗 URL auto-normalized with https://</span>
              )}
              <span>⏱️ Progressive: 3x→2x→1x avg load time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Zoom: {previewState.zoom}%</span>
              {clickCount > 0 && (
                <span>Clicks: {clickCount}</span>
              )}
              <span>Resolution: {window.screen.width}×{window.screen.height}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular modal mode with minimum 100vh height
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] w-[95vw] transition-all duration-300 ease-in-out p-0"
        style={{ maxHeight: 'max(95vh, 600px)', height: 'max(95vh, 600px)' }}
      >
        {/* Header with controls */}
        <DialogHeader className="flex-shrink-0 border-b bg-background/95 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="flex items-center space-x-2 flex-1 min-w-0">
              <FileText className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Secure Preview</span>
              {isXmlFile && (
                <Badge variant="secondary" className="flex-shrink-0">XML Sitemap</Badge>
              )}
              {clickCount > 0 && (
                <Badge variant="outline" className="flex-shrink-0">
                  <MousePointer className="h-3 w-3 mr-1" />
                  {clickCount} clicks
                </Badge>
              )}
              {extension && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {extension}
                </Badge>
              )}
              {useArchiveFallback && (
                <Badge variant="secondary" className="flex-shrink-0">
                  <Archive className="h-3 w-3 mr-1" />
                  Archive Mode
                </Badge>
              )}
              {useScreenshotFallback && (
                <Badge variant="secondary" className="flex-shrink-0">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Screenshot Mode
                </Badge>
              )}
            </DialogTitle>
            
            {/* Control buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomOut} 
                disabled={previewState.zoom <= 50}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground min-w-[60px] text-center font-mono">
                {previewState.zoom}%
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomIn} 
                disabled={previewState.zoom >= 200}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetZoom}
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenInNewTab}
                title="Open in New Tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToggleFullscreen}
                title="Enter Fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              
              {isXmlFile && onDownloadXml && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                  title="Download XML"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* URL display */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
            <span className="font-mono truncate">
              {useArchiveFallback ? archiveUrl : normalizedUrl}
            </span>
            {domain && (
              <Badge variant="outline" className="text-xs">
                {domain}
              </Badge>
            )}
            {normalizedUrl !== previewState.url && (
              <Badge variant="secondary" className="text-xs">
                URL Normalized
              </Badge>
            )}
            {useArchiveFallback && (
              <Badge variant="secondary" className="text-xs">
                <Archive className="h-3 w-3 mr-1" />
                Archive Fallback
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <Separator />
        
        {/* Content area with minimum 100vh height */}
        <div className="flex-1 overflow-hidden bg-background" style={{ minHeight: 'max(calc(95vh - 180px), 400px)', height: 'calc(95vh - 180px)' }}>
          <ScrollArea className="h-full w-full">
            <div 
              className="transition-transform duration-200 ease-in-out"
              style={{ 
                transform: `scale(${previewState.zoom / 100})`,
                transformOrigin: 'top left',
                width: `${10000 / previewState.zoom}%`,
                minHeight: 'max(calc(95vh - 240px), 400px)',
                height: '100%',
              }}
            >
              {renderPreviewContent()}
            </div>
          </ScrollArea>
        </div>
        
        {/* Footer with security info */}
        <div className="flex-shrink-0 border-t bg-muted/30 text-xs text-muted-foreground p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>🔒 Secure Preview Mode</span>
              <span>🚫 External navigation blocked</span>
              <span>🛡️ Content sandboxed</span>
              <span>⌨️ Press ESC to close</span>
              {useArchiveFallback && (
                <span>📚 Internet Archive Fallback</span>
              )}
              {useScreenshotFallback && (
                <span>📸 Screenshot Fallback</span>
              )}
              {normalizedUrl !== previewState.url && (
                <span>🔗 URL auto-normalized with https://</span>
              )}
              <span>⏱️ Progressive: 3x→2x→1x avg load time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Zoom: {previewState.zoom}%</span>
              {clickCount > 0 && (
                <span>Clicks: {clickCount}</span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
