import { useIsCallerAdmin } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import LoadingScreen from '../components/LoadingScreen';
import SpecificationManager from '../components/SpecificationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SitemapAdminPanel from '../components/SitemapAdminPanel';
import { FileText, Map } from 'lucide-react';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (adminLoading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage specifications and sitemap configuration</p>
      </div>

      <Tabs defaultValue="specifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specifications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Specifications
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Sitemap Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specifications">
          <SpecificationManager />
        </TabsContent>

        <TabsContent value="sitemap">
          <SitemapAdminPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
