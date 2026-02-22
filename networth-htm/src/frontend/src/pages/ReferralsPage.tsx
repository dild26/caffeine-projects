import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerReferrals, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Users, DollarSign, TrendingUp, Loader2, Gift } from 'lucide-react';

export default function ReferralsPage() {
  const { identity } = useInternetIdentity();
  const { data: referrals = [], isLoading: referralsLoading } = useGetCallerReferrals();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const referralId = userProfile?.referralId || '';
  const referralLink = `${window.location.origin}?ref=${referralId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Referrals</h1>
          <p className="text-lg text-muted-foreground mb-8">Please login to access your referral dashboard.</p>
        </div>
      </div>
    );
  }

  const totalEarnings = userProfile?.referralEarnings || BigInt(0);

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Gift className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Referral Program</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Invite others to join Your NetWorth and earn rewards for every successful referral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Total Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{referrals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">${Number(totalEarnings) / 100}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Avg. per Referral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${referrals.length > 0 ? (Number(totalEarnings) / 100 / referrals.length).toFixed(2) : '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button onClick={handleCopyLink} className="gap-2 whitespace-nowrap">
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Share this link with others. When they sign up using your link, you'll earn rewards!
            </p>
          </CardContent>
        </Card>

        <div className="bg-muted/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Link</h3>
              <p className="text-sm text-muted-foreground">Copy and share your unique referral link with friends and colleagues.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-muted-foreground">When someone uses your link to join, they become your referral.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Receive earnings for each successful referral and their activities.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Referrals</h2>
          {referralsLoading || profileLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-4">Loading referrals...</p>
            </div>
          ) : referrals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No referrals yet. Start sharing your link to earn rewards!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {referrals.map((referral, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Referral #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Number(referral.timestamp) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${Number(referral.earnings) / 100}</p>
                        <p className="text-sm text-muted-foreground">Earned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <img
            src="/assets/generated/referral-system.dim_600x400.png"
            alt="Referral System"
            className="rounded-lg shadow-lg mx-auto max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
