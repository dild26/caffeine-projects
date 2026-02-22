import { useEffect, useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, ShieldAlert, Eye, Clock, DollarSign, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdvancedGodsEyePage() {
  const { actor, isFetching: actorFetching } = useActor();
  const navigate = useNavigate();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check access permissions with auto-retry
  const {
    data: accessCheck,
    isLoading: accessLoading,
    error: accessError,
    refetch: refetchAccess,
  } = useQuery({
    queryKey: ['advancedGodsEyeAccess'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkAdvancedGodsEyeAccess();
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: 1000,
  });

  // Self-healing: Auto-retry on error
  useEffect(() => {
    if (accessError && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetchAccess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [accessError, retryCount, refetchAccess]);

  // Apply multilayered security protections when content is visible
  useEffect(() => {
    if (!isContentVisible || !accessCheck?.hasAccess) return;

    // Layer 1: Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toast.error('Content protection active', {
        description: 'Right-click is disabled on this page.',
      });
      return false;
    };

    // Layer 2: Disable keyboard shortcuts for screenshots, dev tools, and copying
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable PrintScreen, Ctrl+P, Cmd+P
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.key === 'p')
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Content protection active', {
          description: 'Screenshots and printing are disabled.',
        });
        return false;
      }

      // Disable F12, Ctrl+Shift+I, Cmd+Option+I (DevTools)
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Content protection active', {
          description: 'Developer tools are disabled.',
        });
        return false;
      }

      // Disable Ctrl+U, Cmd+Option+U (View Source)
      if ((e.ctrlKey && e.key === 'u') || (e.metaKey && e.altKey && e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Content protection active', {
          description: 'View source is disabled.',
        });
        return false;
      }

      // Disable Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey && e.key === 's') || (e.metaKey && e.key === 's')) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Content protection active', {
          description: 'Saving is disabled.',
        });
        return false;
      }

      // Disable Ctrl+C, Cmd+C (Copy)
      if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Content protection active', {
          description: 'Copying is disabled.',
        });
        return false;
      }

      // Disable Ctrl+A, Cmd+A (Select All)
      if ((e.ctrlKey && e.key === 'a') || (e.metaKey && e.key === 'a')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Layer 3: Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Layer 4: Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Layer 5: Disable copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toast.error('Content protection active', {
        description: 'Copying is disabled.',
      });
      return false;
    };

    // Layer 6: Disable cut event
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);

    // Apply CSS protection
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    bodyStyle.MozUserSelect = 'none';
    bodyStyle.msUserSelect = 'none';
    bodyStyle.webkitTouchCallout = 'none';

    // Layer 7: Prevent iframe inspection
    if (contentRef.current) {
      const contentStyle = contentRef.current.style as any;
      contentStyle.userSelect = 'none';
      contentStyle.webkitUserSelect = 'none';
      contentStyle.MozUserSelect = 'none';
      contentStyle.msUserSelect = 'none';
      contentStyle.pointerEvents = 'auto';
    }

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      bodyStyle.userSelect = '';
      bodyStyle.webkitUserSelect = '';
      bodyStyle.MozUserSelect = '';
      bodyStyle.msUserSelect = '';
      bodyStyle.webkitTouchCallout = '';
    };
  }, [isContentVisible, accessCheck?.hasAccess]);

  // Self-healing: Monitor iframe health
  useEffect(() => {
    if (!isContentVisible || !iframeRef.current) return;

    const checkIframeHealth = () => {
      try {
        if (iframeRef.current && !iframeRef.current.contentWindow) {
          setIframeError(true);
          toast.error('Content loading issue detected', {
            description: 'Attempting to reload...',
          });
          // Auto-reload iframe
          setTimeout(() => {
            if (iframeRef.current) {
              iframeRef.current.src = iframeRef.current.src;
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Iframe health check failed:', error);
      }
    };

    const healthCheckInterval = setInterval(checkIframeHealth, 5000);
    return () => clearInterval(healthCheckInterval);
  }, [isContentVisible]);

  // Show loading state
  if (actorFetching || accessLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying access permissions...</p>
          {retryCount > 0 && (
            <p className="text-xs text-muted-foreground">Retry attempt {retryCount}/3</p>
          )}
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (accessError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Error</AlertTitle>
          <AlertDescription>
            Failed to verify access permissions. {retryCount < 3 ? 'Retrying...' : 'Please try again later.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
          <Button variant="outline" onClick={() => {
            setRetryCount(0);
            refetchAccess();
          }}>
            Retry Now
          </Button>
        </div>
      </div>
    );
  }

  // Show access denied state
  if (!accessCheck?.hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-destructive" />
              <CardTitle>Access Restricted - Advanced God's Eye</CardTitle>
            </div>
            <CardDescription>
              This advanced content requires admin privileges or verified subscription with active payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{accessCheck?.reason || 'Access denied'}</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Access Requirements:</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Admin Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Full unrestricted access for administrators
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Subscriber Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Verified subscription required
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">$0.01 per hour</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4 space-y-2">
                <h4 className="font-semibold">How to Get Access:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Create a subscription account</li>
                  <li>Wait for admin verification</li>
                  <li>Pay $0.01 for hourly access</li>
                  <li>Access granted for 1 hour per payment</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
              <Button variant="outline" onClick={() => navigate({ to: '/contact' })}>
                Contact Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show content with multilayered security protections
  return (
    <div className="h-screen w-screen overflow-hidden bg-background" ref={contentRef}>
      {/* Security overlay warning */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-destructive">Advanced Protected Content</span>
            <Badge variant="outline" className="ml-2">
              Multi-Layer Security Active
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Access Granted</span>
            </div>
            {iframeError && (
              <div className="flex items-center gap-2 text-sm text-yellow-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Auto-healing...</span>
              </div>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
            >
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Protected content iframe */}
      <div className="h-full w-full pt-12">
        <iframe
          ref={iframeRef}
          src="/assets/final-algo.htm"
          className="w-full h-full border-0"
          title="Advanced God's Eye - Protected Content"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => {
            setIsContentVisible(true);
            setIframeError(false);
            // Apply additional iframe protections
            try {
              if (iframeRef.current?.contentDocument) {
                const iframeDoc = iframeRef.current.contentDocument;
                const iframeBodyStyle = iframeDoc.body.style as any;
                iframeBodyStyle.userSelect = 'none';
                iframeBodyStyle.webkitUserSelect = 'none';
                iframeBodyStyle.MozUserSelect = 'none';
                iframeBodyStyle.msUserSelect = 'none';
                iframeDoc.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }, true);
                iframeDoc.addEventListener('selectstart', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }, true);
                iframeDoc.addEventListener('copy', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }, true);
              }
            } catch (error) {
              console.error('Failed to apply iframe protections:', error);
            }
          }}
          onError={() => {
            setIframeError(true);
            toast.error('Content loading failed', {
              description: 'Attempting to reload...',
            });
          }}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        />
      </div>

      {/* Anti-scraping watermark overlay (subtle, non-intrusive) */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(0,0,0,0.01) 100px, rgba(0,0,0,0.01) 200px)',
        }}
      />

      {/* Additional anti-theft layer */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          mixBlendMode: 'overlay',
          opacity: 0.02,
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}
