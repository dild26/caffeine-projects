import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Upload, BarChart, Lock } from 'lucide-react';
import ProfileSetup from '../components/ProfileSetup';

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Require authentication for Dashboard
  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access your dashboard</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  const showProfileSetup = !isLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetup open={true} />;
  }

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {userProfile?.name}!</h1>
        <p className="text-muted-foreground">Manage your account and workflows</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.subscriptionStatus === 'active' ? (
                <Badge className="bg-green-600">Active</Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.referralCode}</div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: '/admin' })}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Panel</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage System
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: '/features' })}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Stats
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => navigate({ to: '/subscribers' })}>
            Browse Workflows
          </Button>
          <Button className="w-full" variant="outline" onClick={() => navigate({ to: '/referral' })}>
            Share Referral Link
          </Button>
          {userProfile?.subscriptionStatus !== 'active' && (
            <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600">
              Upgrade to Premium
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
