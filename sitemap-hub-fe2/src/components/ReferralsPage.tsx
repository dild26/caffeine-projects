import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Users, Gift, Share, Trophy, Copy, DollarSign, TrendingUp, Link, Wallet,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Clock, CreditCard,
  Bell, Shield, Zap, Target, Award, Activity, RefreshCw, ExternalLink
} from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import {
  useGetReferralLinks, useGetCommissions, useGetReferralHierarchy, useGetCommissionHistory,
  useGetPayoutAccount, useInitiateWithdrawal, useGetWithdrawalHistory, useGetReferralAnalytics,
  useGetCommissionAnalytics
} from '@/hooks/useQueries';
import { toast } from 'sonner';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'admin';

interface ReferralsPageProps {
  onNavigate: (page: Page) => void;
}

export default function ReferralsPage({ onNavigate }: ReferralsPageProps) {
  const { identity } = useInternetIdentity();
  const { data: referrals = [], isLoading: referralsLoading } = useGetReferralLinks();
  const { data: commissions = [], isLoading: commissionsLoading } = useGetCommissions();
  const { data: referralHierarchy } = useGetReferralHierarchy();
  const { data: commissionHistory = [] } = useGetCommissionHistory();
  const { data: payoutAccount } = useGetPayoutAccount();
  const { data: withdrawalHistory = [] } = useGetWithdrawalHistory();
  const { data: referralAnalytics } = useGetReferralAnalytics();
  const { data: commissionAnalytics } = useGetCommissionAnalytics();
  const initiateWithdrawal = useInitiateWithdrawal();

  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isAuthenticated = !!identity;

  const referralCode = isAuthenticated ? identity?.getPrincipal().toString().slice(0, 8).toUpperCase() : 'LOGIN_REQUIRED';
  const referralLink = `https://sitemap-hub-fe2.caffeine.xyz/ref/${referralCode}`;

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast.success(`${item} copied to clipboard!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount) * 100; // Convert to cents

    if (!amount || amount < 2500) {
      toast.error('Minimum withdrawal amount is $25.00');
      return;
    }

    if (amount > 100000) {
      toast.error('Maximum withdrawal amount is $1000.00');
      return;
    }

    try {
      const result = await initiateWithdrawal.mutateAsync({
        amount,
        securityToken: `st_${Math.random().toString(36).substr(2, 16)}`
      });

      toast.success(
        <div>
          <p>Withdrawal request initiated successfully!</p>
          <p className="text-sm text-muted-foreground">
            Token: {result.withdrawalToken} • Est. {result.estimatedProcessingTime}
          </p>
        </div>
      );

      setWithdrawalAmount('');
      setShowWithdrawalForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to initiate withdrawal');
    }
  };

  const totalCommissions = commissions.reduce((total, commission) => total + Number(commission.amount), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((total, commission) => total + Number(commission.amount), 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((total, commission) => total + Number(commission.amount), 0);

  const getReferralTier = (referralCount: number) => {
    if (referralCount >= 50) return { name: 'Platinum', color: 'text-purple-500', reward: '$15', progress: 100, icon: Award };
    if (referralCount >= 25) return { name: 'Gold', color: 'text-yellow-500', reward: '$10', progress: (referralCount / 50) * 100, icon: Trophy };
    if (referralCount >= 10) return { name: 'Silver', color: 'text-accent', reward: '$7', progress: (referralCount / 25) * 100, icon: Target };
    return { name: 'Bronze', color: 'text-primary', reward: '$5', progress: (referralCount / 10) * 100, icon: Gift };
  };

  const currentTier = getReferralTier(referrals.length);
  const nextTierThreshold = referrals.length < 10 ? 10 : referrals.length < 25 ? 25 : referrals.length < 50 ? 50 : null;

  // Real-time notifications for commission threshold warnings and payout notifications
  const notifications = [
    ...(payoutAccount && pendingCommissions >= payoutAccount.minimumPayout ? [{
      id: 'payout_ready',
      type: 'success' as const,
      title: 'Withdrawal Ready',
      message: `You have ${formatCurrency(pendingCommissions)} available for withdrawal`,
      action: () => setShowWithdrawalForm(true)
    }] : []),
    ...(payoutAccount && payoutAccount.withdrawalLimitReached ? [{
      id: 'limit_reached',
      type: 'warning' as const,
      title: 'Withdrawal Limit Reached',
      message: 'Monthly withdrawal limit reached. Resets next month.',
      action: null
    }] : []),
    ...(pendingCommissions > 0 && pendingCommissions < (payoutAccount?.minimumPayout || 2500) ? [{
      id: 'threshold_warning',
      type: 'info' as const,
      title: 'Commission Threshold',
      message: `${formatCurrency((payoutAccount?.minimumPayout || 2500) - pendingCommissions)} more needed for withdrawal`,
      action: null
    }] : []),
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Advanced Multi-Level Referral Program
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dynamic commission calculation, token-based payouts, and real-time performance tracking across unlimited referral levels.
        </p>
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-accent" />
                <span>Real-time Notifications</span>
              </div>
              <Badge variant="secondary">{notifications.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Alert key={notification.id} className={`border-${notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : 'blue'}-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {notification.action && (
                      <Button size="sm" onClick={notification.action}>
                        Action
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isAuthenticated ? (
        <Card className="cyber-gradient border-primary/20 max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Please log in to access your referral link and track your rewards.
            </p>
            <Button className="neon-glow">
              Login to Get Started
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hierarchy">Network</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Enhanced Referral Stats with Real-time Updates */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="cyber-gradient border-primary/20">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Multi-Level Network</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">{referrals.length}</div>
                  <p className="text-sm text-muted-foreground">Total referrals</p>
                  {referralHierarchy && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {referralHierarchy.levels} levels deep
                      </p>
                      <p className="text-xs text-green-500">
                        +{referralHierarchy.realTimeMetrics?.networkGrowthRate.toFixed(1)}% growth
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => onNavigate('referrals')}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    View Network
                  </Button>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-accent/20">
                <CardHeader className="text-center">
                  <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle>Dynamic Earnings</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-accent">{formatCurrency(totalCommissions)}</div>
                  <p className="text-sm text-muted-foreground">Total commissions</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Paid: {formatCurrency(paidCommissions)}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-green-500">
                      +{commissionAnalytics?.commissionTrends?.monthly.growth.toFixed(1)}%
                    </span> this month
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-green-500/20">
                <CardHeader className="text-center">
                  <Wallet className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <CardTitle>Token Balance</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-500">{formatCurrency(pendingCommissions)}</div>
                  <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                  {payoutAccount && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-center">
                        {pendingCommissions >= payoutAccount.minimumPayout ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">Ready</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-xs text-yellow-500">
                              {formatCurrency(payoutAccount.minimumPayout - pendingCommissions)} needed
                            </span>
                          </>
                        )}
                      </div>
                      {payoutAccount.twoFactorEnabled && (
                        <div className="flex items-center justify-center">
                          <Shield className="h-3 w-3 text-blue-500 mr-1" />
                          <span className="text-xs text-blue-500">2FA Secured</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-purple-500/20">
                <CardHeader className="text-center">
                  <currentTier.icon className={`h-8 w-8 ${currentTier.color} mx-auto mb-2`} />
                  <CardTitle>Achievement Tier</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.name}</div>
                  <p className="text-sm text-muted-foreground">{currentTier.reward} per referral</p>
                  {nextTierThreshold && (
                    <div className="mt-2">
                      <Progress value={currentTier.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {nextTierThreshold - referrals.length} more to next tier
                      </p>
                    </div>
                  )}
                  <Badge variant="outline" className="mt-2">
                    Level {Math.min(Math.floor(referrals.length / 10) + 1, 5)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Withdrawal Form with Token Security */}
            {showWithdrawalForm && payoutAccount && (
              <Card className="cyber-gradient border-accent/20 max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    <span>Token-Based Withdrawal</span>
                    <Shield className="h-4 w-4 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Account:</span>
                      <code className="font-mono">{payoutAccount.accountId.slice(0, 12)}...</code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Token Address:</span>
                      <code className="font-mono">{payoutAccount.tokenAddress.slice(0, 8)}...</code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Security Level:</span>
                      <Badge variant="outline">{payoutAccount.securityLevel}</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Withdrawal Amount (USD)</label>
                    <Input
                      type="number"
                      placeholder="25.00"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min="25"
                      max="1000"
                      step="0.01"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Min: {formatCurrency(payoutAccount.minimumPayout)}</span>
                      <span>Max: {formatCurrency(payoutAccount.maximumPayout)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Available: {formatCurrency(pendingCommissions)} •
                      Daily Limit: {formatCurrency(payoutAccount.dailyLimit)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleWithdrawal}
                      disabled={initiateWithdrawal.isPending}
                      className="flex-1"
                    >
                      {initiateWithdrawal.isPending ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Confirm Withdrawal
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowWithdrawalForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Withdrawals are secured with token-based authentication and processed within 2-5 business days.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dynamic Multi-Level Commission Structure */}
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Dynamic Multi-Level Commission Structure</span>
                  <Badge variant="outline">Real-time Rates</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { level: 1, rate: 5, color: 'border-green-500 bg-green-500/10', textColor: 'text-green-500', count: referrals.filter(r => Number(r.level) === 1).length },
                    { level: 2, rate: 3, color: 'border-blue-500 bg-blue-500/10', textColor: 'text-blue-500', count: referrals.filter(r => Number(r.level) === 2).length },
                    { level: 3, rate: 2, color: 'border-purple-500 bg-purple-500/10', textColor: 'text-purple-500', count: referrals.filter(r => Number(r.level) === 3).length },
                    { level: 4, rate: 1, color: 'border-orange-500 bg-orange-500/10', textColor: 'text-orange-500', count: referrals.filter(r => Number(r.level) === 4).length },
                    { level: 5, rate: 0.5, color: 'border-red-500 bg-red-500/10', textColor: 'text-red-500', count: referrals.filter(r => Number(r.level) >= 5).length },
                  ].map(({ level, rate, color, textColor, count }) => (
                    <div key={level} className={`text-center p-4 border rounded-lg ${color} relative`}>
                      <div className={`text-lg font-bold ${textColor}`}>Level {level}</div>
                      <div className="text-sm text-muted-foreground">Commission Rate</div>
                      <div className={`text-lg font-semibold ${textColor}`}>{rate}%</div>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <span className="font-medium">{count}</span>
                        <div className="text-xs text-muted-foreground">referrals</div>
                      </div>
                      {count > 0 && (
                        <div className="absolute -top-1 -right-1">
                          <div className={`w-3 h-3 ${textColor.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Earn commissions from unlimited referral levels with dynamic rate adjustments based on performance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hierarchy">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Real-time Referral Network</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {referralsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading referral hierarchy...</p>
                  </div>
                ) : referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Referral Network Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your multi-level referral network by sharing your link!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Real-time Network Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{referralHierarchy?.levels || 1}</div>
                        <div className="text-sm text-muted-foreground">Network Depth</div>
                      </div>
                      <div className="text-center p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{referrals.length}</div>
                        <div className="text-sm text-muted-foreground">Total Network</div>
                      </div>
                      <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">
                          {referralHierarchy?.realTimeMetrics?.activeReferrers || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Referrers</div>
                      </div>
                      <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">
                          {referralHierarchy?.realTimeMetrics?.networkGrowthRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                      </div>
                    </div>

                    {/* Level Performance Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>Performance by Level</span>
                      </h4>
                      {[1, 2, 3, 4, 5].map(level => {
                        const levelReferrals = referrals.filter(r => Number(r.level) === level);
                        const commissionRate = level === 1 ? 5 : level === 2 ? 3 : level === 3 ? 2 : level === 4 ? 1 : 0.5;
                        const conversionRate = referralHierarchy?.realTimeMetrics?.conversionsByLevel?.[level]?.rate || 0;

                        return (
                          <div key={level} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold">L{level}</span>
                              </div>
                              <div>
                                <p className="font-medium">Level {level}</p>
                                <p className="text-sm text-muted-foreground">
                                  {commissionRate}% commission • {conversionRate.toFixed(1)}% conversion
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{levelReferrals.length}</p>
                              <p className="text-xs text-muted-foreground">referrals</p>
                              {levelReferrals.length > 0 && (
                                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recent Network Activity */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Recent Network Activity</h4>
                      {referrals.slice(0, 5).map((referral, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">Level {Number(referral.level)} Referral</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(referral.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {referral.referred.toString().slice(0, 8)}...
                            </Badge>
                            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Commission Summary */}
              <Card className="cyber-gradient border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span>Dynamic Commission Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-xl font-bold text-green-500">{formatCurrency(totalCommissions)}</p>
                      <p className="text-xs text-green-500">
                        +{commissionAnalytics?.commissionTrends?.monthly.growth.toFixed(1)}% this month
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-xl font-bold text-yellow-500">{formatCurrency(pendingCommissions)}</p>
                      <p className="text-xs text-yellow-500">
                        {((pendingCommissions / Math.max(totalCommissions, 1)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Real-time Commission Rates</h4>
                    {[
                      { level: 1, rate: 5, color: 'text-green-500', earnings: Math.floor(totalCommissions * 0.6) },
                      { level: 2, rate: 3, color: 'text-blue-500', earnings: Math.floor(totalCommissions * 0.25) },
                      { level: 3, rate: 2, color: 'text-purple-500', earnings: Math.floor(totalCommissions * 0.1) },
                      { level: 4, rate: 1, color: 'text-orange-500', earnings: Math.floor(totalCommissions * 0.04) },
                      { level: 5, rate: 0.5, color: 'text-red-500', earnings: Math.floor(totalCommissions * 0.01) },
                    ].map(({ level, rate, color, earnings }) => (
                      <div key={level} className="flex items-center justify-between text-sm">
                        <span>Level {level}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${color}`}>{rate}%</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-medium">{formatCurrency(earnings)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Payout Efficiency</span>
                      <span className="font-bold text-accent">
                        {commissionAnalytics?.payoutEfficiency.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of commissions successfully processed
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Commission History */}
              <Card className="cyber-gradient border-primary/20">
                <CardHeader>
                  <CardTitle>Detailed Commission History</CardTitle>
                </CardHeader>
                <CardContent>
                  {commissionsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading commission history...</p>
                    </div>
                  ) : commissionHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Commissions Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Commissions will appear here when your referrals make purchases.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {commissionHistory.map((commission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{formatCurrency(Number(commission.amount))}</p>
                              {commission.payoutEligible && (
                                <Badge variant="outline" className="text-xs">Eligible</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Level {commission.referralLevel} • {(commission.commissionRate * 100).toFixed(1)}% rate
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(commission.createdAt)} • Base: {formatCurrency(commission.baseAmount)}
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                              TX: {commission.transactionId}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                              {commission.status}
                            </Badge>
                            {commission.status === 'paid' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payouts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Token-Based Payout Account */}
              <Card className="cyber-gradient border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <span>Token-Based Payout Account</span>
                    <Shield className="h-4 w-4 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payoutAccount && (
                    <>
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Account ID</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(payoutAccount.accountId, 'Account ID')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <code className="text-xs font-mono block">{payoutAccount.accountId}</code>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Token Address</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(payoutAccount.tokenAddress, 'Token Address')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        <code className="text-xs font-mono block">{payoutAccount.tokenAddress}</code>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Available Balance</p>
                          <p className="text-xl font-bold text-green-500">{formatCurrency(payoutAccount.balance)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                          <p className="text-xl font-bold">{formatCurrency(payoutAccount.totalWithdrawn)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Minimum Withdrawal</span>
                          <span className="font-medium">{formatCurrency(payoutAccount.minimumPayout)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Maximum Withdrawal</span>
                          <span className="font-medium">{formatCurrency(payoutAccount.maximumPayout)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Daily Limit</span>
                          <span className="font-medium">{formatCurrency(payoutAccount.dailyLimit)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Monthly Limit</span>
                          <span className="font-medium">{formatCurrency(payoutAccount.monthlyLimit)}</span>
                        </div>
                      </div>

                      {payoutAccount.withdrawalLimitReached && (
                        <Alert className="border-yellow-500">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Monthly withdrawal limit reached. Limits reset at the beginning of each month.
                          </AlertDescription>
                        </Alert>
                      )}

                      {pendingCommissions >= payoutAccount.minimumPayout && !payoutAccount.withdrawalLimitReached && (
                        <Button
                          onClick={() => setShowWithdrawalForm(true)}
                          className="w-full"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Initiate Withdrawal
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Withdrawal History */}
              <Card className="cyber-gradient border-accent/20">
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  {withdrawalHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Withdrawals Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Your withdrawal history will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {withdrawalHistory.map((withdrawal, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                              {withdrawal.transactionHash && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(withdrawal.transactionHash!, 'Transaction Hash')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Initiated: {formatDate(withdrawal.initiatedAt)}
                            </p>
                            {withdrawal.completedAt && (
                              <p className="text-xs text-muted-foreground">
                                Completed: {formatDate(withdrawal.completedAt)} • {withdrawal.processingTime}
                              </p>
                            )}
                            {withdrawal.estimatedCompletion && (
                              <p className="text-xs text-muted-foreground">
                                Est. completion: {formatDate(withdrawal.estimatedCompletion)}
                              </p>
                            )}
                            {withdrawal.failureReason && (
                              <p className="text-xs text-red-500">
                                Failed: {withdrawal.failureReason}
                              </p>
                            )}
                            <p className="text-xs font-mono text-muted-foreground">
                              Token: {withdrawal.withdrawalToken}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                withdrawal.status === 'completed' ? 'default' :
                                  withdrawal.status === 'processing' ? 'secondary' :
                                    withdrawal.status === 'failed' ? 'destructive' :
                                      'outline'
                              }
                            >
                              {withdrawal.status}
                            </Badge>
                            {withdrawal.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : withdrawal.status === 'processing' ? (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            ) : withdrawal.status === 'failed' ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links">
            {/* Referral Link Management */}
            <Card className="cyber-gradient border-accent/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="h-5 w-5 text-accent" />
                  <span>Your Multi-Level Referral Link</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    {copiedItem === 'Referral link' ? 'Copied!' : ''}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Referral Code:</span>
                  <code className="p-1 bg-muted rounded text-sm font-mono font-bold">
                    {referralCode}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(referralCode, 'Referral code')}
                  >
                    <Copy className="h-4 w-4" />
                    {copiedItem === 'Referral code' ? 'Copied!' : ''}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Level Reward Tiers */}
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle>Multi-Level Commission Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { level: 1, rate: 5, color: 'border-green-500 bg-green-500/10', textColor: 'text-green-500' },
                    { level: 2, rate: 3, color: 'border-blue-500 bg-blue-500/10', textColor: 'text-blue-500' },
                    { level: 3, rate: 2, color: 'border-purple-500 bg-purple-500/10', textColor: 'text-purple-500' },
                    { level: 4, rate: 1, color: 'border-orange-500 bg-orange-500/10', textColor: 'text-orange-500' },
                    { level: 5, rate: 0.5, color: 'border-red-500 bg-red-500/10', textColor: 'text-red-500' },
                  ].map(({ level, rate, color, textColor }) => (
                    <div key={level} className={`text-center p-4 border rounded-lg ${color}`}>
                      <div className={`text-lg font-bold ${textColor}`}>Level {level}</div>
                      <div className="text-sm text-muted-foreground">Commission Rate</div>
                      <div className={`text-lg font-semibold ${textColor}`}>{rate}%</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Earn commissions from all levels in your referral network with decreasing percentages for deeper levels.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cyber-gradient border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {referralAnalytics?.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {referralAnalytics?.averageReferralsPerUser.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg. Referrals/User</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Level Performance</h4>
                    {referralAnalytics?.topPerformingLevels.map((level, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>Level {level.level}</span>
                        <div className="flex items-center space-x-2">
                          <span>{level.count} referrals</span>
                          <span className="text-green-500 font-medium">{level.conversionRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span>Revenue Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {referralAnalytics?.monthlyGrowth.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Monthly Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {referralAnalytics?.retentionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Retention Rate</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Commission Distribution</h4>
                    {commissionAnalytics && Object.entries(commissionAnalytics.commissionsByLevel).map(([level, amount]) => (
                      <div key={level} className="flex items-center justify-between text-sm">
                        <span>{level.replace('level', 'Level ')}</span>
                        <div className="flex items-center space-x-2">
                          <span>{formatCurrency(amount)}</span>
                          <span className="text-muted-foreground">
                            ({((amount / commissionAnalytics.totalCommissions) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            {/* Real-time Performance Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cyber-gradient border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Network Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {referralHierarchy?.realTimeMetrics?.networkGrowthRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Network Growth Rate</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Referrers</span>
                      <span className="font-medium">
                        {referralHierarchy?.realTimeMetrics?.activeReferrers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network Size</span>
                      <span className="font-medium">
                        {referralHierarchy?.realTimeMetrics?.totalNetworkSize || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Max Depth</span>
                      <span className="font-medium">{referralHierarchy?.levels || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span>Conversion Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">
                      {referralAnalytics?.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Conversion</div>
                  </div>

                  <div className="space-y-2">
                    {referralHierarchy?.realTimeMetrics?.conversionsByLevel &&
                      Object.entries(referralHierarchy.realTimeMetrics.conversionsByLevel).slice(0, 3).map(([level, data]) => (
                        <div key={level} className="flex justify-between text-sm">
                          <span>Level {level}</span>
                          <span className="font-medium">{(data as { rate: number }).rate.toFixed(1)}%</span>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="cyber-gradient border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span>Revenue Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {commissionAnalytics?.payoutEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Payout Efficiency</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Revenue</span>
                      <span className="font-medium">
                        {formatCurrency(commissionAnalytics?.monthlyCommissions || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending Payouts</span>
                      <span className="font-medium">
                        {formatCurrency(commissionAnalytics?.pendingPayouts || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Commission</span>
                      <span className="font-medium">
                        {formatCurrency(commissionAnalytics?.averageCommission || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
