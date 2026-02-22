import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Search, CheckCircle, XCircle, Clock, Hash, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDiscoverSitemapPages, useGetSitemapDiscoveryLogs } from '../hooks/useAppQueries';
import { DEFAULT_APPS } from '../data/defaultApps';
import { toast } from 'sonner';

interface DiscoveryStatus {
  status: 'idle' | 'discovering' | 'success' | 'error';
  pagesFound: number;
  message: string;
  timestamp?: number;
}

export default function PageDiscoveryDashboard() {
  const [discoveryStatuses, setDiscoveryStatuses] = useState<Record<string, DiscoveryStatus>>({});
  const [isDiscovering, setIsDiscovering] = useState(false);
  const discoverPages = useDiscoverSitemapPages();
  const { data: discoveryLogs = [], refetch: refetchLogs } = useGetSitemapDiscoveryLogs();

  const handleDiscoverApp = async (appId: string, appName: string, domain: string) => {
    setDiscoveryStatuses(prev => ({
      ...prev,
      [appId]: { status: 'discovering', pagesFound: 0, message: 'Pinging domain...' }
    }));

    try {
      const result = await discoverPages.mutateAsync(domain);
      setDiscoveryStatuses(prev => ({
        ...prev,
        [appId]: {
          status: 'success',
          pagesFound: result.discoveredPages.length,
          message: `Discovered ${result.discoveredPages.length} pages`,
          timestamp: Number(result.timestamp)
        }
      }));
      toast.success(`Discovered ${result.discoveredPages.length} pages for ${appName}`);
      refetchLogs();
    } catch (error) {
      setDiscoveryStatuses(prev => ({
        ...prev,
        [appId]: { status: 'error', pagesFound: 0, message: 'Discovery failed' }
      }));
      toast.error(`Failed to discover pages for ${appName}`);
    }
  };

  const handleDiscoverAll = async () => {
    setIsDiscovering(true);
    toast.info(`Starting AI-powered discovery across all ${DEFAULT_APPS.length} SECOINFI apps...`);

    for (const app of DEFAULT_APPS) {
      const subdomain = app.url.replace('https://', '').replace('.caffeine.xyz/', '').replace('/', '');
      await handleDiscoverApp(app.id, app.name, subdomain);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsDiscovering(false);
    toast.success('Discovery complete for all apps!');
  };

  const completedCount = Object.values(discoveryStatuses).filter(s => s.status === 'success' || s.status === 'error').length;
  const progressPercent = DEFAULT_APPS.length > 0 ? (completedCount / DEFAULT_APPS.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="card-3d card-3d-hover border-4 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gradient flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
                AI Page Discovery Dashboard
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Deterministic keyword pinging with deduplication and HTTP/canonical verification across all {DEFAULT_APPS.length} SECOINFI apps
              </CardDescription>
            </div>
            <Button
              onClick={handleDiscoverAll}
              disabled={isDiscovering}
              size="lg"
              className="neon-glow"
            >
              <Search className="w-5 h-5 mr-2" />
              {isDiscovering ? 'Discovering...' : `Discover All ${DEFAULT_APPS.length} Apps`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isDiscovering && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discovery Progress</span>
                <span className="font-semibold">{completedCount} / {DEFAULT_APPS.length}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_APPS.map(app => {
              const subdomain = app.url.replace('https://', '').replace('.caffeine.xyz/', '').replace('/', '');
              const status = discoveryStatuses[app.id] || { status: 'idle', pagesFound: 0, message: 'Ready to discover' };
              
              return (
                <Card key={app.id} className="card-3d card-3d-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      {status.status === 'discovering' && <Clock className="w-5 h-5 text-primary animate-spin" />}
                      {status.status === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                      {status.status === 'error' && <XCircle className="w-5 h-5 text-destructive" />}
                    </div>
                    <CardDescription className="text-xs font-mono">{subdomain}.caffeine.xyz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={
                        status.status === 'success' ? 'default' :
                        status.status === 'error' ? 'destructive' :
                        status.status === 'discovering' ? 'secondary' : 'outline'
                      }>
                        {status.message}
                      </Badge>
                    </div>
                    {status.pagesFound > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pages Found:</span>
                        <span className="font-bold text-primary">{status.pagesFound}</span>
                      </div>
                    )}
                    <Button
                      onClick={() => handleDiscoverApp(app.id, app.name, subdomain)}
                      disabled={status.status === 'discovering' || isDiscovering}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {status.status === 'discovering' ? 'Discovering...' : 'Discover Pages'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Discovery Process:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>Keyword pinging with common page identifiers (about, contact, faq, features, pros, etc.)</li>
                  <li>HTTP/HTTPS protocol verification and canonical URL detection</li>
                  <li>Automatic deduplication using content hash comparison</li>
                  <li>Merkle-leaf hash generation for each discovered page</li>
                  <li>All discoveries logged with timestamps and verification proofs</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {discoveryLogs.length > 0 && (
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Recent Discovery Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {discoveryLogs.slice(0, 10).map((log, idx) => (
                <div key={idx} className="card-3d p-3 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">{log.domain}</div>
                    <div className="text-sm text-muted-foreground">
                      {log.discoveredPages.length} pages discovered • {log.status}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
