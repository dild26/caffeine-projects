import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { useGetSitemaps } from '../hooks/useQueries';

export default function AnalyticsPage() {
  const { data: sitemaps } = useGetSitemaps();

  const totalSitemaps = sitemaps?.length || 0;
  const totalUrls = sitemaps?.reduce((sum, s) => sum + Number(s.urlCount), 0) || 0;

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into sitemap usage and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Total Sitemaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalSitemaps}</p>
              <p className="text-sm text-muted-foreground">Across all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Total URLs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUrls.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Indexed URLs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cpc">CPC Analytics</TabsTrigger>
            <TabsTrigger value="domains">Domain Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Key metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <img 
                    src="/assets/generated/analytics-dashboard.dim_800x400.png" 
                    alt="Analytics Dashboard" 
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cpc">
            <Card>
              <CardHeader>
                <CardTitle>Cost Per Click Analytics</CardTitle>
                <CardDescription>
                  Track and analyze click costs across sitemaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Average CPC</p>
                      <p className="text-sm text-muted-foreground">Across all sitemaps</p>
                    </div>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Total Clicks</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Domain Statistics</CardTitle>
                <CardDescription>
                  Breakdown by top-level domains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sitemaps && sitemaps.length > 0 ? (
                    sitemaps.slice(0, 5).map((sitemap) => (
                      <div key={sitemap.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{sitemap.domain}</p>
                          <p className="text-sm text-muted-foreground">.{sitemap.tld}</p>
                        </div>
                        <p className="text-lg font-bold">{Number(sitemap.urlCount)} URLs</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No domain data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
