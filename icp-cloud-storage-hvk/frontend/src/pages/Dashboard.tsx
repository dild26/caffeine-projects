import { useState, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Files, LayoutDashboard, CreditCard, Settings, Database, Clock, Folder, Shield } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';

// Lazy load all tab components for code splitting
const OverviewTab = lazy(() => import('../components/tabs/OverviewTab'));
const FilesTab = lazy(() => import('../components/tabs/FilesTab'));
const FoldersTab = lazy(() => import('../components/tabs/FoldersTab'));
const BillingTab = lazy(() => import('../components/tabs/BillingTab'));
const BackupTab = lazy(() => import('../components/tabs/BackupTab'));
const AdminTab = lazy(() => import('../components/tabs/AdminTab'));
const ReplicationTab = lazy(() => import('../components/tabs/ReplicationTab'));
const IntegrityChecksTab = lazy(() => import('../components/tabs/IntegrityChecksTab'));

// Tab loading fallback
function TabLoader() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading tab...</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: isAdmin = false } = useIsCallerAdmin();

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid lg:grid-cols-8">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <Files className="h-4 w-4" />
            <span className="hidden sm:inline">Files</span>
          </TabsTrigger>
          <TabsTrigger value="folders" className="gap-2">
            <Folder className="h-4 w-4" />
            <span className="hidden sm:inline">Folders</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="integrity" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Integrity</span>
              </TabsTrigger>
              <TabsTrigger value="replication" className="gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Replication</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<TabLoader />}>
            <OverviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Suspense fallback={<TabLoader />}>
            <FilesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="folders" className="space-y-6">
          <Suspense fallback={<TabLoader />}>
            <FoldersTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Suspense fallback={<TabLoader />}>
            <BackupTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Suspense fallback={<TabLoader />}>
            <BillingTab />
          </Suspense>
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="integrity" className="space-y-6">
              <Suspense fallback={<TabLoader />}>
                <IntegrityChecksTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="replication" className="space-y-6">
              <Suspense fallback={<TabLoader />}>
                <ReplicationTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <Suspense fallback={<TabLoader />}>
                <AdminTab />
              </Suspense>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

