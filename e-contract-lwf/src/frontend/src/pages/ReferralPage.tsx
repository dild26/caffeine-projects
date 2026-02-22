import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, Users, DollarSign, Share2, Copy, Check, Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { useHasEnhancedTemplateAccess } from '../hooks/useQueries';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const { data: hasEnhancedAccess = false } = useHasEnhancedTemplateAccess();
  const navigate = useNavigate();
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
      description: 'Get $10 credit for every friend who signs up using your referral link.',
    },
    {
      icon: Users,
      title: 'Help Friends',
      description: 'Your friends get $5 credit when they sign up through your link.',
    },
    {
      icon: DollarSign,
      title: 'Unlimited Earnings',
      description: 'No limit on how many friends you can refer or how much you can earn.',
    },
  ];

  const subscriberBenefits = [
    'Fill and submit interactive e-contract forms',
    'Download custom templates as .json files',
    'Save contracts as PDF documents',
    'Print and email contracts directly',
    'Share and forward files with ease',
    'Earn royalties on GBV (Gross Business Value)',
    'Participate in the referral program',
    'Access to premium template features',
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Referral Program</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share the benefits of e-contracts with your friends and earn rewards
        </p>
      </div>

      {!hasEnhancedAccess && (
        <Alert className="mb-8 border-primary bg-primary/5">
          <Crown className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-base mb-1">Subscribe to unlock the full referral program!</p>
                <p className="text-sm text-muted-foreground">
                  Get access to interactive forms, template downloads, and earn royalties on GBV through referrals.
                </p>
              </div>
              <Button 
                className="ml-4 shrink-0"
                onClick={() => navigate({ to: '/dashboard' })}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {hasEnhancedAccess && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Your Referral Link</CardTitle>
              <CardDescription>Share this link with your friends to start earning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="font-mono text-sm" />
                <Button onClick={handleCopy} variant="outline" className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share on Social
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Subscriber Benefits
            </CardTitle>
            <CardDescription>
              Subscribe to unlock these exclusive features and participate in the referral program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {subscriberBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {hasEnhancedAccess && (
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Stats</CardTitle>
              <CardDescription>Track your referral performance and GBV royalties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-3xl font-bold text-primary mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Total Referrals</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-3xl font-bold text-primary mb-1">$0</div>
                  <div className="text-sm text-muted-foreground">Total Earned</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-3xl font-bold text-primary mb-1">$0</div>
                  <div className="text-sm text-muted-foreground">GBV Royalties</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <Badge className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center">1</Badge>
                <div>
                  <div className="font-medium">Subscribe to unlock referral features</div>
                  <div className="text-sm text-muted-foreground">
                    Get access to interactive forms, downloads, and the full referral program
                  </div>
                </div>
              </li>
              <li className="flex gap-4">
                <Badge className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center">2</Badge>
                <div>
                  <div className="font-medium">Share your unique referral link</div>
                  <div className="text-sm text-muted-foreground">
                    Copy and share your link with friends via email, social media, or messaging apps
                  </div>
                </div>
              </li>
              <li className="flex gap-4">
                <Badge className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center">3</Badge>
                <div>
                  <div className="font-medium">Your friend signs up and subscribes</div>
                  <div className="text-sm text-muted-foreground">
                    When they create an account and subscribe using your link, they get $5 credit
                  </div>
                </div>
              </li>
              <li className="flex gap-4">
                <Badge className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center">4</Badge>
                <div>
                  <div className="font-medium">Earn rewards and GBV royalties</div>
                  <div className="text-sm text-muted-foreground">
                    You receive $10 credit plus ongoing royalties on their Gross Business Value
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
