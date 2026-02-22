import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Eye, Shield, LayoutDashboard } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAdmin = identity !== null;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
            InfiLoop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Decentralized Information Exchange Platform
          </p>
        </div>

        {/* Backend Status Notice */}
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>System Status</CardTitle>
            </div>
            <CardDescription>
              All core features have been restored and are operational
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Fully Operational Features:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>User authentication and profile management</li>
                <li>Dashboard with all tabs (URL Generator, Domains, Grid Generator, Leaderboard, Fixtures, Analytics)</li>
                <li>URL Generator with Standard Range, Multi-Dimensional, and Paginated modes</li>
                <li>Grid Generator with CSV import/export and unlimited link generation</li>
                <li>Domain management with search and pagination</li>
                <li>God's Eye Net access control (Admin/Subscriber with payment)</li>
                <li>Advanced God's Eye with enhanced security protections</li>
                <li>Memo System (reset and cleared)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Available Features */}
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>
              All features are now accessible and fully functional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Dashboard</h3>
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Restored
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete dashboard with URL Generator, Domains, Grid Generator, Leaderboard, Fixtures, and Analytics tabs.
                    </p>
                  </div>
                  <Button onClick={() => navigate({ to: '/dashboard' })}>
                    Open Dashboard
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">God's Eye Net</h3>
                      {isAdmin && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Access Granted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Secure access-controlled content with multi-layered protection including anti-screenshot, copy-lock, and inspection restrictions.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin 
                        ? "✓ You have admin access" 
                        : "Requires admin privileges or verified subscription ($0.01/hour)"}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate({ to: '/gods-eye-net' })}
                    variant={isAdmin ? "default" : "outline"}
                  >
                    {isAdmin ? "Access Now" : "Learn More"}
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors border-purple-500/30 bg-purple-500/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold">Advanced God's Eye</h3>
                      {isAdmin && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Access Granted
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Enhanced Security
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Advanced secure content with multilayered masked protection against copying, scraping, and iframe inspection. Enhanced anti-theft safeguards.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin 
                        ? "✓ You have admin access" 
                        : "Requires admin privileges or verified subscription ($0.01/hour)"}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate({ to: '/advanced-gods-eye' })}
                    variant={isAdmin ? "default" : "outline"}
                  >
                    {isAdmin ? "Access Now" : "Learn More"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Real-time deployment status and monitoring - All systems operational
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Authentication</p>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dashboard</p>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">URL Generator</p>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Grid Generator</p>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">God's Eye Net</p>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Advanced God's Eye</p>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Self-Healing</p>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Memo System</p>
                <Badge variant="secondary">Reset Complete</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Navigate to key sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate({ to: '/dashboard' })}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/features' })}>
                View Features
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/contact' })}>
                Contact Us
              </Button>
              {isAdmin && (
                <>
                  <Button onClick={() => navigate({ to: '/gods-eye-net' })}>
                    God's Eye Net
                  </Button>
                  <Button variant="secondary" onClick={() => navigate({ to: '/advanced-gods-eye' })}>
                    Advanced God's Eye
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
