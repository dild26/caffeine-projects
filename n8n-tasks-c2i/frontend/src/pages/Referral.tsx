import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2, Gift } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSetup from '../components/ProfileSetup';

export default function Referral() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access your referral program</p>
      </div>
    );
  }

  const showProfileSetup = !isLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetup open={true} />;
  }

  const referralLink = `${window.location.origin}/?ref=${userProfile?.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join n8n Workflows Store',
          text: 'Check out this amazing platform for n8n workflow templates!',
          url: referralLink,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <img
          src="/assets/generated/referral-icon-transparent.dim_64x64.png"
          alt="Referral"
          className="h-16 w-16 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">Referral Program</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your unique referral link and earn rewards when others sign up
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>Share this code with friends and colleagues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={userProfile?.referralCode || ''} readOnly className="font-mono text-lg" />
              <Button onClick={handleCopy} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link to track your referrals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono" />
              <Button onClick={handleCopy} variant="outline">
                {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Gift className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Share your unique referral link with friends and colleagues</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>When they sign up using your link, they get tracked as your referral</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>You earn rewards when your referrals subscribe to premium plans</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Track your referrals and earnings in your dashboard</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle>Referral Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold mb-1">0</div>
                <div className="opacity-90">Total Referrals</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">$0</div>
                <div className="opacity-90">Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
