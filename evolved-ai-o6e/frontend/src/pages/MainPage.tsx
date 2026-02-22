import { useState } from 'react';
import { useGetAllModuleConfigs, useIsCallerAdmin } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import AccessControlTab from '../components/AccessControlTab';
import UserProfilesTab from '../components/UserProfilesTab';
import ModulesTab from '../components/ModulesTab';
import BlueprintsTab from '../components/BlueprintsTab';
import FixturesTab from '../components/FixturesTab';
import MenuItemsTab from '../components/MenuItemsTab';

export default function MainPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: modules, isLoading: modulesLoading } = useGetAllModuleConfigs();
  const [activeTab, setActiveTab] = useState('access-control');

  if (isAdminLoading || modulesLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading secure admin control center...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: You do not have admin permissions to access this secure control center. 
            Only authenticated admin users via Internet Identity can modify configurations.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Secure Main-Form Admin Page</h1>
        <p className="text-muted-foreground text-lg">
          Real-time reactive forms with 3-second debounced auto-save and multi-admin collaboration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="user-profiles">User Profiles</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
        </TabsList>

        <TabsContent value="access-control" className="space-y-6">
          <AccessControlTab />
        </TabsContent>

        <TabsContent value="user-profiles" className="space-y-6">
          <UserProfilesTab />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <ModulesTab />
        </TabsContent>

        <TabsContent value="blueprints" className="space-y-6">
          <BlueprintsTab />
        </TabsContent>

        <TabsContent value="fixtures" className="space-y-6">
          <FixturesTab />
        </TabsContent>

        <TabsContent value="menu-items" className="space-y-6">
          <MenuItemsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
