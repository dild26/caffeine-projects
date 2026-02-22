import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FormSchemaManager from '../components/FormSchemaManager';
import FormRenderer from '../components/FormRenderer';
import SubmissionsViewer from '../components/SubmissionsViewer';
import AuditLogViewer from '../components/AuditLogViewer';
import PortalView from '../components/PortalView';
import CanisterStatusDashboard from '../components/CanisterStatusDashboard';
import BuildOptimizationDashboard from '../components/BuildOptimizationDashboard';
import SitemapManager from '../components/SitemapManager';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { FileText, Send, History, Settings, Store, Activity, Zap, Map, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('forms');
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity, login, loginStatus } = useInternetIdentity();
  
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Restricted tabs that require authentication
  const restrictedTabs = ['manage', 'sitemap', 'audit', 'submissions'];
  const isRestrictedTab = restrictedTabs.includes(activeTab);

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8">
          <TabsTrigger value="forms" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Fill Forms</span>
            <span className="sm:hidden">Forms</span>
          </TabsTrigger>
          <TabsTrigger value="submissions" className="gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Submissions</span>
            <span className="sm:hidden">Submit</span>
          </TabsTrigger>
          <TabsTrigger value="portal" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Portal</span>
            <span className="sm:hidden">Portal</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Canister Status</span>
            <span className="sm:hidden">Status</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Build Optimization</span>
            <span className="sm:hidden">Build</span>
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="manage" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Manage Schemas</span>
                <span className="sm:hidden">Manage</span>
              </TabsTrigger>
              <TabsTrigger value="sitemap" className="gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Sitemap</span>
                <span className="sm:hidden">Sitemap</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Audit Logs</span>
                <span className="sm:hidden">Audit</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Public Tabs - No authentication required */}
        <TabsContent value="forms" className="space-y-4">
          <FormRenderer />
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <PortalView />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Canister Health Monitor</h2>
              <p className="text-muted-foreground">
                Monitor your canister's cycle balance, memory usage, and deployment status in real-time.
              </p>
            </div>
            <CanisterStatusDashboard />
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Build Optimization Metrics</h2>
              <p className="text-muted-foreground">
                View compression statistics, bundle size optimization, and schema deduplication results.
              </p>
            </div>
            <BuildOptimizationDashboard />
          </div>
        </TabsContent>

        {/* Restricted Tabs - Authentication required */}
        <TabsContent value="submissions" className="space-y-4">
          {!isAuthenticated ? (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>You need to sign in to view your form submissions.</p>
                <Button onClick={login} disabled={isLoggingIn}>
                  {isLoggingIn ? 'Signing in...' : 'Sign In'}
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <SubmissionsViewer />
          )}
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="manage" className="space-y-4">
              {!isAuthenticated ? (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Admin Access Required</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>You need to sign in with an admin account to manage form schemas.</p>
                    <Button onClick={login} disabled={isLoggingIn}>
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <FormSchemaManager />
              )}
            </TabsContent>

            <TabsContent value="sitemap" className="space-y-4">
              {!isAuthenticated ? (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Admin Access Required</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>You need to sign in with an admin account to manage the sitemap.</p>
                    <Button onClick={login} disabled={isLoggingIn}>
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <SitemapManager />
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              {!isAuthenticated ? (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Admin Access Required</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>You need to sign in with an admin account to view audit logs.</p>
                    <Button onClick={login} disabled={isLoggingIn}>
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <AuditLogViewer />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
