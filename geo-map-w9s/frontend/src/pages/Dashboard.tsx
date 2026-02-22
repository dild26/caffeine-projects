import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetUserPins, useGetUserPolygons } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Hexagon, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: pins } = useGetUserPins();
  const { data: polygons } = useGetUserPolygons();

  const predictableIncomeData = [
    { month: 'Month 1', income: '$300', cumulative: '$300' },
    { month: 'Month 2', income: '$600', cumulative: '$900' },
    { month: 'Month 3', income: '$900', cumulative: '$1,800' },
    { month: 'Month 4', income: '$1,200', cumulative: '$3,000' },
    { month: 'Month 5', income: '$1,500', cumulative: '$4,500' },
    { month: 'Month 6', income: '$1,800', cumulative: '$6,300' },
    { month: 'Month 7', income: '$2,100', cumulative: '$8,400' },
    { month: 'Month 8', income: '$2,400', cumulative: '$10,800' },
    { month: 'Month 9', income: '$2,700', cumulative: '$13,500' },
    { month: 'Month 10', income: '$3,000', cumulative: '$16,500' },
    { month: 'Month 11', income: '$3,300', cumulative: '$19,800' },
    { month: 'Month 12', income: '$3,600', cumulative: '$23,400' },
  ];

  if (!identity) {
    return (
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Please log in to view your dashboard</h2>
          <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {userProfile?.name || 'User'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pins</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pins?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Placed on the map</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Polygons</CardTitle>
              <Hexagon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{polygons?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Created geometries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Logged activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Free</div>
              <p className="text-xs text-muted-foreground">
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate({ to: '/subscription' })}>
                  Upgrade now
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Predictable Income Projection (12x in 12 Months)
            </CardTitle>
            <CardDescription>
              Potential earnings through referrals and subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Monthly Income</TableHead>
                    <TableHead className="text-right">Cumulative Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictableIncomeData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell>{row.income}</TableCell>
                      <TableCell className="text-right font-semibold">{row.cumulative}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total (12 Months)</TableCell>
                    <TableCell className="font-bold">-</TableCell>
                    <TableCell className="text-right font-bold text-primary text-lg">$23,400</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate({ to: '/referral' })}>
                Learn More About Referral Program
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest geospatial operations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/' })}>
                <MapPin className="h-4 w-4 mr-2" />
                Place New Pin
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/analytics' })}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/reports' })}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
