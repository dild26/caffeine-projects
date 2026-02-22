import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { BarChart3, LayoutDashboard, Route, Activity, Settings, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import EvaluationTab from '@/components/EvaluationTab';
import BenchmarkTab from '@/components/BenchmarkTab';
import RoutingTab from '@/components/RoutingTab';
import AdminTab from '@/components/AdminTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('eval');
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Handle protected tab access
  const handleTabChange = (value: string) => {
    if (value === 'admin' && !isAuthenticated) {
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">OpenR Models Evaluation</h1>
          <p className="text-muted-foreground">Comprehensive AI model benchmarking and automated comparison.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <Activity className="h-4 w-4" />
          <span>System Status: Optimal</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-5 h-auto p-1 bg-muted">
          <TabsTrigger value="eval" className="gap-2 py-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="benchmark" className="gap-2 py-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Benchmarks</span>
          </TabsTrigger>
          <TabsTrigger value="routing" className="gap-2 py-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Routing</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2 py-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eval" className="space-y-4">
          <EvaluationTab />
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4">
          <BenchmarkTab />
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <RoutingTab />
        </TabsContent>

        {isAuthenticated ? (
          <TabsContent value="admin" className="space-y-4">
            <AdminTab />
          </TabsContent>
        ) : (
          activeTab === 'admin' && (
            <TabsContent value="admin" className="space-y-4">
              <Alert variant="destructive" className="bg-destructive/5">
                <Lock className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Authentication required for administrative access.</span>
                  <Button onClick={login} disabled={isLoggingIn} size="sm" variant="outline">
                    {activeTab === 'admin' && isLoggingIn ? 'Connecting...' : 'Connect Identity'}
                  </Button>
                </AlertDescription>
              </Alert>
            </TabsContent>
          )
        )}
      </Tabs>

      <footer className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>&copy; 2026 OpenR Benchmarks</span>
          <span>OR-BOR-STD Compliant</span>
        </div>
        <div className="flex gap-4 italic">
          <span>Next Refresh: 14:00 UTC</span>
          <span>Last Snapshot: 2026-02-15 09:00</span>
        </div>
      </footer>
    </div>
  );
}
