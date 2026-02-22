import { useIsCallerAdmin, useGetAnalyticsData } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, TrendingUp, DollarSign } from 'lucide-react';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import LoadingScreen from '../components/LoadingScreen';

export default function AnalyticsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: analytics, isLoading: analyticsLoading } = useGetAnalyticsData();

  if (adminLoading || analyticsLoading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const stats = [
    {
      label: 'Total Users',
      value: analytics?.totalUsers.toString() || '0',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Files',
      value: analytics?.totalFiles.toString() || '0',
      icon: FileText,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Total Contracts',
      value: analytics?.totalContracts.toString() || '0',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Active Users',
      value: analytics?.activeUsers.toString() || '0',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
    {
      label: 'Revenue',
      value: `$${analytics?.revenue.toString() || '0'}`,
      icon: DollarSign,
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time analytics and usage statistics</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
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
          <CardTitle>Usage Trends</CardTitle>
          <CardDescription>System activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart visualization coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
