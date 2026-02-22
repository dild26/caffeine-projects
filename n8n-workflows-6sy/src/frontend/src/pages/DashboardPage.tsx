import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Download, TrendingUp, DollarSign } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useGetReferrerEarnings, useGetIncomeProjections } from '../hooks/useQueries';

function DashboardPageContent() {
  const { data: earnings } = useGetReferrerEarnings();
  const { data: projections } = useGetIncomeProjections();

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Analytics and statistics overview
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-xs text-muted-foreground">Year over year</p>
            </CardContent>
          </Card>
        </div>

        {/* Referrer Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Referrer Earnings Structure</CardTitle>
            <CardDescription>
              Earnings based on referral tier performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Top 10</p>
                <p className="text-3xl font-bold text-primary">$0.10</p>
                <p className="text-xs text-muted-foreground">per referral</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Top 100</p>
                <p className="text-3xl font-bold text-accent">$1.00</p>
                <p className="text-xs text-muted-foreground">per referral</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Top 1000</p>
                <p className="text-3xl font-bold text-primary">$10.00</p>
                <p className="text-xs text-muted-foreground">per referral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 12-Month Income Projection */}
        <Card>
          <CardHeader>
            <CardTitle>12-Month Income Projection</CardTitle>
            <CardDescription>
              Predictable income growth based on current referral performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img
                src="/assets/generated/income-projection-table.dim_700x400.png"
                alt="12-Month Income Projection"
                className="w-full rounded-lg"
              />
              <p className="text-sm text-muted-foreground text-center">
                Real-time updates as new referral data is entered
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}
