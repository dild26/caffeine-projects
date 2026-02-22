import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import URLGeneratorTab from '../components/URLGeneratorTab';
import DomainsTab from '../components/DomainsTab';
import GridGeneratorTab from '../components/GridGeneratorTab';
import LeaderboardTab from '../components/LeaderboardTab';
import FixturesTab from '../components/FixturesTab';
import AnalyticsTab from '../components/AnalyticsTab';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Manage domains, generate URLs, and track analytics
        </p>
      </div>

      <Card>
        <Tabs defaultValue="url-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="url-generator">URL Generator</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="grid">Grid Generator</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="url-generator" className="p-6">
            <URLGeneratorTab />
          </TabsContent>

          <TabsContent value="domains" className="p-6">
            <DomainsTab />
          </TabsContent>

          <TabsContent value="grid" className="p-6">
            <GridGeneratorTab />
          </TabsContent>

          <TabsContent value="leaderboard" className="p-6">
            <LeaderboardTab />
          </TabsContent>

          <TabsContent value="fixtures" className="p-6">
            <FixturesTab />
          </TabsContent>

          <TabsContent value="analytics" className="p-6">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
