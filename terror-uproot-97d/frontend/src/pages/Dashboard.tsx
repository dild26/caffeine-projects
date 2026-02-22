import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import IncidentsTab from '../components/tabs/IncidentsTab';
import DataSourcesTab from '../components/tabs/DataSourcesTab';
import ReportsTab from '../components/tabs/ReportsTab';
import AnalyticsTab from '../components/tabs/AnalyticsTab';
import ConfigTab from '../components/tabs/ConfigTab';
import { LayoutDashboard, Database, FileText, BarChart3, Settings } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('incidents');

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <div className="relative h-48 overflow-hidden rounded-lg border border-border bg-card">
          <img 
            src="/assets/generated/command-center-hero.dim_1200x600.png" 
            alt="Command Center" 
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Crisis Management Dashboard</h2>
              <p className="mt-2 text-muted-foreground">
                Real-time security research and emergency response coordination
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="incidents" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Incidents</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data Sources</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-4">
          <IncidentsTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <DataSourcesTab />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsTab />
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <ConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
