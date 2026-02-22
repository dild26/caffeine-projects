import { useGetIncidents, useGetDataSources, useGetLatestYamlConfig } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Database, Activity, Settings } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

export default function AnalyticsTab() {
  const { data: incidents, isLoading: incidentsLoading } = useGetIncidents();
  const { data: dataSources, isLoading: sourcesLoading } = useGetDataSources();
  const { data: latestConfig, isLoading: configLoading } = useGetLatestYamlConfig();

  if (incidentsLoading || sourcesLoading || configLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalIncidents = incidents?.length || 0;
  const activeIncidents = incidents?.filter(i => i.status.toLowerCase() === 'active').length || 0;
  const verifiedSources = dataSources?.filter(s => s.verified).length || 0;
  const totalSources = dataSources?.length || 0;

  // Prepare data for charts
  const severityData = [
    { name: 'Low (1-3)', value: incidents?.filter(i => Number(i.severity) <= 3).length || 0, fill: 'oklch(var(--chart-2))' },
    { name: 'Medium (4-6)', value: incidents?.filter(i => Number(i.severity) > 3 && Number(i.severity) <= 6).length || 0, fill: 'oklch(var(--chart-4))' },
    { name: 'High (7-10)', value: incidents?.filter(i => Number(i.severity) > 6).length || 0, fill: 'oklch(var(--chart-5))' },
  ];

  const statusData = [
    { name: 'Active', value: incidents?.filter(i => i.status.toLowerCase() === 'active').length || 0 },
    { name: 'Monitoring', value: incidents?.filter(i => i.status.toLowerCase() === 'monitoring').length || 0 },
    { name: 'Resolved', value: incidents?.filter(i => i.status.toLowerCase() === 'resolved').length || 0 },
  ];

  const incidentTypeData = incidents?.reduce((acc: any[], incident) => {
    const existing = acc.find(item => item.name === incident.incidentType);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: incident.incidentType, count: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h3>
        <p className="text-muted-foreground">
          Visualize trends and patterns in security data
        </p>
      </div>

      {latestConfig && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Configuration Synchronized</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                Version {latestConfig.version.toString()}
              </Badge>
            </div>
            <CardDescription>
              Analytics dashboard is synchronized with the latest YAML configuration
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {activeIncidents} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <Activity className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSources}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedSources} verified sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSources > 0 ? Math.round((verifiedSources / totalSources) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Source verification status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
            <CardDescription>Distribution of incident severity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
            <CardDescription>Current status of all incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="name" stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'oklch(var(--popover))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="oklch(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
            <CardDescription>Breakdown of incident categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incidentTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="name" stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'oklch(var(--popover))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="count" fill="oklch(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>Interactive geospatial and trend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <img 
            src="/assets/generated/global-data-visualization.dim_800x600.png" 
            alt="Global Data Visualization" 
            className="w-full rounded-lg border border-border"
          />
        </CardContent>
      </Card>
    </div>
  );
}
