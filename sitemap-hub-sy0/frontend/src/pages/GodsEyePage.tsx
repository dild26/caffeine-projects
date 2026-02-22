import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllTlds } from '../hooks/useQueries';
import { Eye, Globe, Database, TrendingUp, Users, Search } from 'lucide-react';

export default function GodsEyePage() {
  const { data: tlds = [] } = useGetAllTlds();

  const stats = [
    { label: 'Total TLDs', value: tlds.length, icon: Globe, color: 'text-primary' },
    { label: 'Total Sitemaps', value: '1,234,567', icon: Database, color: 'text-accent' },
    { label: 'Active Users', value: '10,234', icon: Users, color: 'text-chart-1' },
    { label: 'Searches Today', value: '45,678', icon: Search, color: 'text-chart-2' },
  ];

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Eye className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">God's Eye</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real-time platform statistics and insights at a glance
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Level Domains
          </CardTitle>
          <CardDescription>All indexed TLDs across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {tlds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No TLDs indexed yet</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tlds.map((tld, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {tld}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Growth
            </CardTitle>
            <CardDescription>Key metrics over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">New Users (30d)</span>
              <span className="font-semibold">+2,345</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">New Sitemaps (30d)</span>
              <span className="font-semibold">+156,789</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Searches (30d)</span>
              <span className="font-semibold">+1,234,567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Subscriptions</span>
              <span className="font-semibold">8,901</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Current plan breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">Free</span>
                </div>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <span className="text-sm">Basic</span>
                </div>
                <span className="font-semibold">3,456</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-1" />
                  <span className="text-sm">Pro</span>
                </div>
                <span className="font-semibold">4,567</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-2" />
                  <span className="text-sm">Enterprise</span>
                </div>
                <span className="font-semibold">644</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
          <CardDescription>System status and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-green-500">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-500">45ms</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-purple-500">100%</div>
              <p className="text-sm text-muted-foreground">Data Integrity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
