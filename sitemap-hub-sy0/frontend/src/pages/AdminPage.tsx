import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import SitemapUpload from '../components/admin/SitemapUpload';
import StripeConfig from '../components/admin/StripeConfig';
import BackupRestore from '../components/admin/BackupRestore';
import UserManagement from '../components/admin/UserManagement';
import ManualPageManagement from '../components/admin/ManualPageManagement';
import { Settings, Upload, CreditCard, Database, Users, FileText } from 'lucide-react';

export default function AdminPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate({ to: '/' });
    return null;
  }

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage platform settings and data</p>
        </div>
      </div>

      <Tabs defaultValue="sitemaps" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sitemaps" className="gap-2">
            <Upload className="h-4 w-4" />
            Sitemaps
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-2">
            <FileText className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="stripe" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sitemaps">
          <SitemapUpload />
        </TabsContent>

        <TabsContent value="pages">
          <ManualPageManagement />
        </TabsContent>

        <TabsContent value="stripe">
          <StripeConfig />
        </TabsContent>

        <TabsContent value="backup">
          <BackupRestore />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
