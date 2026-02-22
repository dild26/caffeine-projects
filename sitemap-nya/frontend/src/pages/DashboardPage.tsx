import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerSubscription } from '@/hooks/useQueries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserProfileSetup from '@/components/UserProfileSetup';
import SubscriptionManager from '@/components/SubscriptionManager';
import SitemapBrowser from '@/components/SitemapBrowser';
import AccessDeniedScreen from '@/components/AccessDeniedScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Globe, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: subscription, isLoading: subscriptionLoading } = useGetCallerSubscription();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <UserProfileSetup />
        </main>
        <Footer />
      </div>
    );
  }

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'advanced': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'premium': return 'bg-gold-500/10 text-gold-500 border-gold-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {userProfile?.name}! Manage your sitemap subscriptions and explore data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-2">
                  <Badge className={getTierColor(subscription.tier)}>
                    {subscription.tier.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Status: {subscription.active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active subscription</p>
              )}
            </CardContent>
          </Card>

          {/* Subscription Period */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Started: {formatDate(subscription.startTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {formatDate(subscription.endTime)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subscription period</p>
              )}
            </CardContent>
          </Card>

          {/* Access Level */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Access Level</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {subscription.tier === 'basic' && 'Up to 100 domains'}
                    {subscription.tier === 'advanced' && 'Up to 1,000 domains'}
                    {subscription.tier === 'premium' && 'Unlimited domains'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.tier === 'basic' && 'Basic filtering'}
                    {subscription.tier === 'advanced' && 'Advanced filtering'}
                    {subscription.tier === 'premium' && 'Premium features'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No access</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <SubscriptionManager />
          </div>
          <div className="xl:col-span-2">
            <SitemapBrowser />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
