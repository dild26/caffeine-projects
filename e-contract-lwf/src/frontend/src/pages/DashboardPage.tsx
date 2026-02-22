import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, BarChart3, Settings, Users, TrendingUp } from 'lucide-react';
import AccessDeniedScreen from '../components/AccessDeniedScreen';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  const quickActions = [
    {
      title: 'Contracts',
      description: 'View and manage contracts',
      icon: FileText,
      path: '/contracts',
      color: 'text-blue-500',
    },
    {
      title: 'Upload Files',
      description: 'Upload new documents',
      icon: Upload,
      path: '/upload',
      color: 'text-green-500',
    },
    {
      title: 'Analytics',
      description: 'View system analytics',
      icon: BarChart3,
      path: '/analytics',
      color: 'text-purple-500',
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      path: '/settings',
      color: 'text-orange-500',
    },
  ];

  const stats = [
    { label: 'Total Contracts', value: '0', icon: FileText, trend: '+0%' },
    { label: 'Active Users', value: '0', icon: Users, trend: '+0%' },
    { label: 'Files Uploaded', value: '0', icon: Upload, trend: '+0%' },
    { label: 'Revenue', value: '$0', icon: TrendingUp, trend: '+0%' },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your E-Contracts Management System dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.path}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => navigate({ to: action.path })}
            >
              <CardHeader>
                <action.icon className={`h-8 w-8 mb-2 ${action.color}`} />
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate({ to: '/contracts' })}
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
