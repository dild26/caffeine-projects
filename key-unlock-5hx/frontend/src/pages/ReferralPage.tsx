import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Users, TrendingUp, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReferralPage() {
  const [referralCode] = useState('SECOINFI2025');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Referral Program</h1>
          <p className="text-xl text-muted-foreground">
            Earn rewards by inviting friends to SECOINFI
          </p>
        </div>

        <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Your Referral Code</CardTitle>
            <CardDescription>Share this code with friends and family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={referralCode} 
                readOnly 
                className="font-mono text-lg"
              />
              <Button onClick={handleCopyCode} size="lg">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Gift className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get exclusive benefits for every successful referral you make.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Help Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your friends get special bonuses when they sign up with your code.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Grow Together</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build a network and unlock premium features as you refer more users.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share Your Code</h3>
                <p className="text-muted-foreground">
                  Copy your unique referral code and share it with friends via email, social media, or messaging apps.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Friends Sign Up</h3>
                <p className="text-muted-foreground">
                  When your friends create an account using your referral code, they'll receive a welcome bonus.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Once your friend completes their first transaction, you both receive rewards!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
