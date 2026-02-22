import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { 
  useGetCallerUserProfile, useGetCallerSubscription, useGetPayAsYouUsePurchases, 
  useGetReferralLinks, useGetCommissions, useGetPayoutAccount, useGetUserAnalytics
} from '@/hooks/useQueries';
import { 
  User, CreditCard, Activity, ArrowLeft, Search, ShoppingCart, Share, DollarSign, 
  Copy, Wallet, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Clock, 
  Target, Zap, Eye, Calendar, Globe
} from 'lucide-react';
import EnhancedSearchInterface from '@/components/EnhancedSearchInterface';
import SubscriptionTiers from '@/components/SubscriptionTiers';
import PayAsYouUsePurchase from '@/components/PayAsYouUsePurchase';
import { SubscriptionTier } from '@/backend';
import { toast } from 'sonner';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'admin';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: subscription, isLoading: subscriptionLoading } = useGetCallerSubscription();
  const { data: purchases = [] } = useGetPayAsYouUsePurchases();
  const { data: referrals = [] } = useGetReferralLinks();
  const { data: commissions = [] } = useGetCommissions();
  const { data: payoutAccount } = useGetPayoutAccount();
  const { data: userAnalytics } = useGetUserAnalytics();

  const isAuthenticated = !!identity;

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${item} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (timestamp: bigint | number) => {
    const date = typeof timestamp === 'bigint' 
      ? new Date(Number(timestamp) / 1000000)
      : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to access your dashboard.
          </p>
          <Button onClick={() => onNavigate('home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return 'No active subscription';
    
    if (subscription.tier.__kind__ === 'payAsYouUse') {
      return `Pay As You Use - ${subscription.status}`;
    }
    
    return `${subscription.tier.__kind__} - ${subscription.status}`;
  };

  const isPayAsYouUse = subscription?.tier.__kind__ === 'payAsYouUse';
  const totalQuota = purchases.reduce((total, purchase) => total + Number(purchase.remainingQuota), 0);

  // Extract the tier safely with proper typing
  const currentTier: SubscriptionTier | null = subscription ? subscription.tier : null;

  // Enhanced referral and commission calculations
  const referralCode = identity?.getPrincipal().toString().slice(0, 8).toUpperCase() || '';
  const referralLink = `https://sitemapai.com/ref/${referralCode}`;
  const totalCommissions = commissions.reduce((total, commission) => total + Number(commission.amount), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((total, commission) => total + Number(commission.amount), 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((total, commission) => total + Number(commission.amount), 0);

  // Multi-level referral analytics
  const referralsByLevel = {
    level1: referrals.filter(r => Number(r.level) === 1).length,
    level2: referrals.filter(r => Number(r.level) === 2).length,
    level3: referrals.filter(r => Number(r.level) === 3).length,
    level4: referrals.filter(r => Number(r.level) === 4).length,
    level5: referrals.filter(r => Number(r.level) >= 5).length,
  };

  const maxLevel = Math.max(...referrals.map(r => Number(r.level)), 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Enhanced Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive insights into your activity, subscriptions, referrals, and earnings with real-time analytics.
        </p>
      </div>

      {/* Enhanced User Analytics Overview */}
      {userAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader className="text-center">
              <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{userAnalytics.userActivity.loginCount}</div>
              <p className="text-sm text-muted-foreground">Total logins</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  {userAnalytics.userActivity.searchCount} searches
                </p>
                <p className="text-xs text-green-500">
                  Avg session: {formatDuration(userAnalytics.userActivity.sessionDuration)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-gradient border-accent/20">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 text-accent mx-auto mb-2" />
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-accent">{userAnalytics.usageStatistics.totalSearches}</div>
              <p className="text-sm text-muted-foreground">Total searches</p>
              <div className="mt-2">
                <Progress 
                  value={(userAnalytics.usageStatistics.successfulSearches / userAnalytics.usageStatistics.totalSearches) * 100} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {((userAnalytics.usageStatistics.successfulSearches / userAnalytics.usageStatistics.totalSearches) * 100).toFixed(1)}% success rate
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-gradient border-green-500/20">
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle>Engagement Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {userAnalytics.engagementMetrics.satisfactionScore.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Out of 5.0</p>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                <div>Search: {userAnalytics.engagementMetrics.featureUsage.search.toFixed(0)}%</div>
                <div>Referrals: {userAnalytics.engagementMetrics.featureUsage.referrals.toFixed(0)}%</div>
                <div>Analytics: {userAnalytics.engagementMetrics.featureUsage.analytics.toFixed(0)}%</div>
                <div>Exports: {userAnalytics.engagementMetrics.featureUsage.exports.toFixed(0)}%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-gradient border-blue-500/20">
            <CardHeader className="text-center">
              <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <CardTitle>Network Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {userAnalytics.referralPerformance.conversionRate.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Conversion rate</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  {userAnalytics.referralPerformance.totalReferrals} total referrals
                </p>
                <p className="text-xs text-blue-500">
                  {userAnalytics.referralPerformance.networkDepth} levels deep
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile & Subscription Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProfile && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{formatDate(userProfile.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Referral Code</p>
                  <div className="flex items-center space-x-2">
                    <code className="p-1 bg-muted rounded text-sm font-mono font-bold">
                      {referralCode}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(referralCode, 'Referral code')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {userAnalytics && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Active</p>
                    <p className="font-medium">{formatDate(userAnalytics.userActivity.lastActive)}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Subscription Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <div className="flex items-center space-x-2">
                <Badge variant={subscription ? "default" : "secondary"}>
                  {getSubscriptionStatus()}
                </Badge>
              </div>
            </div>
            {userAnalytics && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Usage This Month</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={userAnalytics.subscriptionMetrics.usagePercentage} className="flex-1 h-2" />
                    <span className="text-sm font-medium">
                      {userAnalytics.subscriptionMetrics.usagePercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                {userAnalytics.subscriptionMetrics.renewalDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Next Renewal</p>
                    <p className="font-medium">{formatDate(userAnalytics.subscriptionMetrics.renewalDate)}</p>
                  </div>
                )}
              </>
            )}
            {isPayAsYouUse && (
              <div>
                <p className="text-sm text-muted-foreground">Remaining Quota</p>
                <p className="font-medium text-primary">{totalQuota} searches</p>
              </div>
            )}
            {subscription && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(subscription.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(subscription.updatedAt)}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Referral & Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cyber-gradient border-primary/20">
          <CardHeader className="text-center">
            <Share className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle>Multi-Level Network</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary">{referrals.length}</div>
            <p className="text-sm text-muted-foreground">Total referrals</p>
            <p className="text-xs text-muted-foreground mt-1">
              {maxLevel} levels deep
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => onNavigate('referrals')}
            >
              View Hierarchy
            </Button>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-accent/20">
          <CardHeader className="text-center">
            <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle>Total Earned</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-accent">{formatCurrency(totalCommissions)}</div>
            <p className="text-sm text-muted-foreground">In commissions</p>
            <div className="flex justify-center space-x-1 mt-2">
              <Badge variant="outline" className="text-xs">
                Paid: {formatCurrency(paidCommissions)}
              </Badge>
            </div>
            {userAnalytics && (
              <div className="mt-2 text-xs">
                <span className="text-green-500">
                  Avg: {formatCurrency(userAnalytics.commissionEarnings.averageCommission)}
                </span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => onNavigate('referrals')}
            >
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-green-500/20">
          <CardHeader className="text-center">
            <Wallet className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <CardTitle>Available Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-500">{formatCurrency(pendingCommissions)}</div>
            <p className="text-sm text-muted-foreground">Ready for withdrawal</p>
            {payoutAccount && pendingCommissions >= payoutAccount.minimumPayout ? (
              <div className="flex items-center justify-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Withdrawal ready</span>
              </div>
            ) : (
              <div className="flex items-center justify-center mt-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-500">Min: $25.00</span>
              </div>
            )}
            {userAnalytics && (
              <div className="mt-2 text-xs text-muted-foreground">
                Monthly: {formatCurrency(userAnalytics.commissionEarnings.monthlyEarnings)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-blue-500/20">
          <CardHeader className="text-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-500">
              {userAnalytics?.referralPerformance.conversionRate.toFixed(1) || '0.0'}%
            </div>
            <p className="text-sm text-muted-foreground">Conversion rate</p>
            <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
              <div>L1: {referralsByLevel.level1}</div>
              <div>L2: {referralsByLevel.level2}</div>
              <div>L3: {referralsByLevel.level3}</div>
              <div>L4+: {referralsByLevel.level4 + referralsByLevel.level5}</div>
            </div>
            {userAnalytics && (
              <div className="mt-2 text-xs text-blue-500">
                {userAnalytics.referralPerformance.activeReferrals} active
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Usage Analytics */}
      {userAnalytics && (
        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              <span>Detailed Usage Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Search Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Searches</span>
                    <span className="font-medium">{userAnalytics.usageStatistics.totalSearches}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Successful</span>
                    <span className="font-medium text-green-500">
                      {userAnalytics.usageStatistics.successfulSearches}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Results</span>
                    <span className="font-medium">{userAnalytics.usageStatistics.averageResultsPerSearch}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Feature Usage</h4>
                <div className="space-y-2">
                  {Object.entries(userAnalytics.engagementMetrics.featureUsage).map(([feature, usage]) => (
                    <div key={feature} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{feature}</span>
                        <span className="font-medium">{usage.toFixed(0)}%</span>
                      </div>
                      <Progress value={usage} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Top Search Terms</h4>
                <div className="space-y-2">
                  {userAnalytics.usageStatistics.favoriteSearchTerms.slice(0, 5).map((term, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="truncate">{term}</span>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Account Status */}
      {payoutAccount && (
        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-accent" />
              <span>Token-Based Payout Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Account ID:</span>
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {payoutAccount.accountId.slice(0, 12)}...
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(payoutAccount.accountId, 'Account ID')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Withdrawal Limits</p>
                <p className="font-medium">
                  {formatCurrency(payoutAccount.minimumPayout)} - {formatCurrency(payoutAccount.maximumPayout)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                <p className="font-medium">{formatCurrency(payoutAccount.totalWithdrawn)}</p>
              </div>
            </div>
            
            {payoutAccount.withdrawalLimitReached && (
              <Alert className="border-yellow-500 mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Monthly withdrawal limit reached. Limits reset at the beginning of each month.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Referral Link Quick Access */}
      <Card className="cyber-gradient border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share className="h-5 w-5 text-accent" />
            <span>Your Multi-Level Referral Link</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
              {referralLink}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(referralLink, 'Referral link')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('referrals')}
            >
              Manage
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Earn commissions from unlimited referral levels: 5% (L1), 3% (L2), 2% (L3), 1% (L4), 0.5% (L5+)
          </p>
        </CardContent>
      </Card>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="purchase" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Purchase</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Unified Search</span>
              </CardTitle>
              <CardDescription>
                {subscription 
                  ? `Access unified search features with your ${subscription.tier.__kind__} subscription.`
                  : 'Subscribe to unlock unified search capabilities with higher limits.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedSearchInterface showQuotaWarning={isPayAsYouUse} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userAnalytics && (
              <>
                <Card className="cyber-gradient border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <span>Activity Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {userAnalytics.userActivity.loginCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Logins</div>
                      </div>
                      <div className="text-center p-3 bg-accent/10 border border-accent/20 rounded-lg">
                        <div className="text-2xl font-bold text-accent">
                          {userAnalytics.userActivity.searchCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Searches</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Session Duration</span>
                        <span className="font-medium">
                          {formatDuration(userAnalytics.userActivity.sessionDuration)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Active</span>
                        <span className="font-medium">
                          {formatDate(userAnalytics.userActivity.lastActive)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyber-gradient border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-accent" />
                      <span>Engagement Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">
                        {userAnalytics.engagementMetrics.satisfactionScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Satisfaction Score</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Feature Usage</h4>
                      {Object.entries(userAnalytics.engagementMetrics.featureUsage).map(([feature, usage]) => (
                        <div key={feature} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{feature}</span>
                            <span className="font-medium">{usage.toFixed(0)}%</span>
                          </div>
                          <Progress value={usage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="purchase">
          {isPayAsYouUse ? (
            <PayAsYouUsePurchase />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pay As You Use Required</h3>
                <p className="text-muted-foreground mb-4">
                  You need a Pay As You Use subscription to purchase domain batches.
                </p>
                <Button onClick={() => onNavigate('subscription')}>
                  View Subscription Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subscription">
          {!subscription ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Choose a Subscription Plan</h2>
              <SubscriptionTiers currentTier={currentTier} />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Plan Type:</span>
                    <Badge>{subscription.tier.__kind__}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span>{formatDate(subscription.createdAt)}</span>
                  </div>
                  {isPayAsYouUse && (
                    <div className="flex items-center justify-between">
                      <span>Remaining Quota:</span>
                      <span className="font-medium text-primary">{totalQuota} searches</span>
                    </div>
                  )}
                  {userAnalytics && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Usage This Month:</span>
                        <span className="font-medium">
                          {userAnalytics.subscriptionMetrics.usagePercentage.toFixed(1)}%
                        </span>
                      </div>
                      {userAnalytics.subscriptionMetrics.renewalDate && (
                        <div className="flex items-center justify-between">
                          <span>Next Renewal:</span>
                          <span className="font-medium">
                            {formatDate(userAnalytics.subscriptionMetrics.renewalDate)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
