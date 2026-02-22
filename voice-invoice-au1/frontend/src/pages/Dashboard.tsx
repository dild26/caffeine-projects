import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionsTab from '../components/TransactionsTab';
import VoiceInvoiceTab from '../components/VoiceInvoiceTab';
import PoojaRitualsTab from '../components/PoojaRitualsTab';
import VerificationTab from '../components/VerificationTab';
import AdminTab from '../components/AdminTab';
import SitemapTab from '../components/SitemapTab';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Receipt, Mic, Flower2, ShieldCheck, Settings, Map } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pooja');
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Handle admin tab access
  const handleAdminTabChange = (value: string) => {
    if (value === 'admin' && !isAuthenticated) {
      // Don't switch to admin tab if not authenticated
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">VoiceInvoice Dashboard</h1>
        <p className="text-muted-foreground">Transparent temple management with blockchain verification</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleAdminTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="pooja" className="gap-2">
            <Flower2 className="h-4 w-4" />
            <span className="hidden sm:inline">Pooja Rituals</span>
          </TabsTrigger>
          <TabsTrigger value="verify" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Verify</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice Invoice</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Transactions</span>
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="gap-2">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Sitemap</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="pooja" className="space-y-4">
          <PoojaRitualsTab />
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          <VerificationTab />
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <VoiceInvoiceTab />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-4">
          <SitemapTab />
        </TabsContent>

        {isAdmin ? (
          <TabsContent value="admin" className="space-y-4">
            <AdminTab />
          </TabsContent>
        ) : (
          activeTab === 'admin' && (
            <TabsContent value="admin" className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Admin access required. Please log in with an administrator account.</span>
                  <Button onClick={login} disabled={isLoggingIn} size="sm">
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                </AlertDescription>
              </Alert>
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
