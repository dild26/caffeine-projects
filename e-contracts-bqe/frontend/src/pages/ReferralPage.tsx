import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Gift, Users, DollarSign, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'ECONTRACT2025';
  const referralLink = `https://e-contracts.com/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Earn Rewards',
      description: 'Get $50 credit for every friend who signs up and subscribes.',
    },
    {
      icon: Users,
      title: 'Help Friends',
      description: 'Your friends get 20% off their first month when they use your link.',
    },
    {
      icon: DollarSign,
      title: 'Unlimited Earnings',
      description: 'No limit on how many friends you can refer or how much you can earn.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Share Your Link',
      description: 'Copy your unique referral link and share it with friends.',
    },
    {
      step: '2',
      title: 'Friend Signs Up',
      description: 'Your friend creates an account using your referral link.',
    },
    {
      step: '3',
      title: 'Both Get Rewards',
      description: 'You earn $50 credit and they get 20% off their first month.',
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4 text-primary">
            <Gift className="h-12 w-12" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Referral Program</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Share E-Contracts with friends and earn rewards together
          </p>
        </div>

        {/* Referral Illustration */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-lg">
          <img 
            src="/assets/generated/referral-illustration.dim_500x400.png" 
            alt="Referral Program" 
            className="h-auto w-full"
          />
        </div>

        {/* Referral Link */}
        <Card className="mb-16 border-primary/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Referral Link</CardTitle>
            <CardDescription>Share this link with your friends to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopy} className="gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share on Twitter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share on LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share via Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Program Benefits</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mx-auto mb-4 inline-flex rounded-lg bg-primary/10 p-4 text-primary">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item, index) => (
              <Card key={index} className="relative text-center transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                {index < howItWorks.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 bg-gradient-to-r from-primary to-accent md:block" />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mb-2 text-4xl font-bold text-primary">$50</div>
              <CardDescription>Per Successful Referral</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mb-2 text-4xl font-bold text-accent">20%</div>
              <CardDescription>Friend's First Month Discount</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mb-2 text-4xl font-bold text-primary">∞</div>
              <CardDescription>Unlimited Referrals</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Terms */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Program Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Referral rewards are credited after the referred user completes their first paid month.</p>
            <p>• The 20% discount applies only to the first month of subscription.</p>
            <p>• Referral credits can be used towards subscription fees or premium features.</p>
            <p>• Self-referrals and fraudulent activities are prohibited and may result in account suspension.</p>
            <p>• E-Contracts reserves the right to modify or terminate the referral program at any time.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
