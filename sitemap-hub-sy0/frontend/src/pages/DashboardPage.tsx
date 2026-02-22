import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile, useGetReferralsByReferrer } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link, useNavigate } from '@tanstack/react-router';
import { CreditCard, Users, TrendingUp, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SubscriptionStatus } from '../backend';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal();
  const { data: referrals = [] } = useGetReferralsByReferrer(principal);
  const [copied, setCopied] = useState(false);

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const subscriptionStatus = userProfile.subscriptionStatus;
  const totalCommission = referrals.reduce((sum, ref) => sum + Number(ref.commission), 0);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userProfile.referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getSubscriptionBadge = () => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      [SubscriptionStatus.basic]: 'default',
      [SubscriptionStatus.pro]: 'default',
      [SubscriptionStatus.enterprise]: 'default',
      [SubscriptionStatus.payAsYouUse]: 'secondary',
      [SubscriptionStatus.none]: 'outline',
    };
    
    const labels: Record<string, string> = {
      [SubscriptionStatus.basic]: 'Basic',
      [SubscriptionStatus.pro]: 'Pro',
      [SubscriptionStatus.enterprise]: 'Enterprise',
      [SubscriptionStatus.payAsYouUse]: 'Pay As You Use',
      [SubscriptionStatus.none]: 'Free',
    };
    
    return (
      <Badge variant={variants[subscriptionStatus] || 'outline'} className="text-sm">
        {labels[subscriptionStatus] || 'Free'}
      </Badge>
    );
  };

  const getSubscriptionLabel = () => {
    const labels: Record<string, string> = {
      [SubscriptionStatus.basic]: 'Basic',
      [SubscriptionStatus.pro]: 'Pro',
      [SubscriptionStatus.enterprise]: 'Enterprise',
      [SubscriptionStatus.payAsYouUse]: 'Pay As You Use',
      [SubscriptionStatus.none]: 'None',
    };
    return labels[subscriptionStatus] || 'None';
  };

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userProfile.name}!</p>
        </div>
        {getSubscriptionBadge()}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getSubscriptionLabel()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current plan</p>
            <Link to="/subscription">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Manage Subscription
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total referrals</p>
            <Link to="/referral">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalCommission / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total commission</p>
            <Link to="/referral">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Manage Payouts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base">{userProfile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-base">{userProfile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-base">{new Date(Number(userProfile.createdAt) / 1000000).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Referral Code</label>
              <div className="flex items-center gap-2">
                <code className="text-base font-mono bg-muted px-2 py-1 rounded">{userProfile.referralCode}</code>
                <Button variant="ghost" size="sm" onClick={copyReferralCode}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
