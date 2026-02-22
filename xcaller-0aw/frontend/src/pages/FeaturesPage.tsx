import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Info } from 'lucide-react';
import DomainGenerator from '../components/DomainGenerator';
import DomainList from '../components/DomainList';
import ImportExport from '../components/ImportExport';
import { useIsAdmin } from '../hooks/useQueries';

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('domains');
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Domain Management
        </h1>
        <p className="text-lg text-muted-foreground">
          Organize, vote, and manage your domain collection with ease
        </p>
      </div>

      <Alert className="border-primary/50 bg-primary/5">
        <Info className="h-5 w-5 text-primary" />
        <AlertDescription className="text-base">
          Browse and vote on domains publicly. Login to access advanced features like domain generation and import/export.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="domains" className="font-medium">
            Domains
          </TabsTrigger>
          <TabsTrigger value="generate" className="font-medium flex items-center gap-2">
            Generate
            {!isAdminLoading && !isAdmin && <Lock className="h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="import-export" className="font-medium flex items-center gap-2">
            Import/Export
            {!isAdminLoading && !isAdmin && <Lock className="h-3 w-3" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Domains</CardTitle>
              <CardDescription>
                View and vote on domains. Domains are automatically sorted by popularity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Domain Generator
                {!isAdminLoading && !isAdmin && <Lock className="h-5 w-5 text-muted-foreground" />}
              </CardTitle>
              <CardDescription>
                Automatically generate domain URLs with customizable settings and scheduling options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Import & Export
                {!isAdminLoading && !isAdmin && <Lock className="h-5 w-5 text-muted-foreground" />}
              </CardTitle>
              <CardDescription>
                Upload domain lists from various formats or export your collection for backup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImportExport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
