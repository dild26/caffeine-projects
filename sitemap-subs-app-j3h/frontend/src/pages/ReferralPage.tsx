import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetCallerUserProfile, useGetReferrals } from '../hooks/useQueries';
import { Copy, Users, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: referrals } = useGetReferrals();

  const userReferrals = referrals?.filter(r => 
    r.referrer.toString() === userProfile?.referralCode
  ) || [];

  const totalCommission = userReferrals.reduce((sum, r) => sum + Number(r.commission), 0);

  const handleCopyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${userProfile?.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn rewards by inviting others to join SitemapHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userReferrals.length}</p>
              <p className="text-sm text-muted-foreground">Total referrals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalCommission.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">20%</p>
              <p className="text-sm text-muted-foreground">Commission rate</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link to earn 20% commission on all subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={`${window.location.origin}?ref=${userProfile?.referralCode}`}
                readOnly
                className="font-mono"
              />
              <Button onClick={handleCopyReferralLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Share Your Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy your unique referral link and share it with friends, colleagues, or on social media.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">They Subscribe</h3>
                  <p className="text-sm text-muted-foreground">
                    When someone signs up using your link and subscribes to a paid plan, you earn commission.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive 20% commission on their subscription payments, paid out monthly via tokens.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <img 
            src="/assets/generated/referral-network.dim_800x500.png" 
            alt="Referral Network" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
