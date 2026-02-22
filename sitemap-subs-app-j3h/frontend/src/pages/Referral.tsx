import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Users, TrendingUp } from 'lucide-react';

export default function Referral() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Referral Program</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Earn rewards by referring businesses to SECOINFI
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Share SECOINFI, Earn Rewards</CardTitle>
          <CardDescription>
            Invite your network and get rewarded for every successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Send your unique referral link to businesses that could benefit from SECOINFI
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                When they create an account and start using SECOINFI, you both benefit
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Receive credits and bonuses for every successful referral
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Your Referral Link</h3>
            <div className="flex gap-2">
              <Input value="https://secoinfi.com/ref/YOUR_CODE" readOnly />
              <Button>Copy</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with businesses to track your referrals
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Referral Benefits</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 20% commission on first year subscription</li>
              <li>• $50 credit for you and your referral</li>
              <li>• Exclusive access to premium features</li>
              <li>• Priority support for referred accounts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
