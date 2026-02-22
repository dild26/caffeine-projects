import { useState } from 'react';
import { useGetCallerSubscription, useCreateCheckoutSession, useCancelSubscription } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SubscriptionTier, ShoppingItem } from '../backend';
import { CreditCard, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionManager() {
  const { data: subscription, isLoading } = useGetCallerSubscription();
  const createCheckout = useCreateCheckoutSession();
  const cancelSubscription = useCancelSubscription();
  
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.basic);
  const [autoRenew, setAutoRenew] = useState(true);

  const tierPrices = {
    [SubscriptionTier.basic]: { usd: 900, inr: 90000, duration: 30 },
    [SubscriptionTier.advanced]: { usd: 4500, inr: 450000, duration: 90 },
    [SubscriptionTier.premium]: { usd: 9900, inr: 990000, duration: 180 }
  };

  const handleSubscribe = async (currency: 'USD' | 'INR') => {
    try {
      const price = tierPrices[selectedTier];
      const priceInCents = currency === 'USD' ? price.usd : price.inr;
      
      const items: ShoppingItem[] = [{
        productName: `SitemapHub ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Plan`,
        productDescription: `${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} subscription plan for ${price.duration} days`,
        priceInCents: BigInt(priceInCents),
        quantity: BigInt(1),
        currency: currency
      }];

      const session = await createCheckout.mutateAsync(items);
      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription.mutateAsync();
      toast.success('Subscription cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'advanced': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'premium': return 'bg-gold-500/10 text-gold-500 border-gold-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Subscription Manager</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscription && subscription.active ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Plan</span>
              <Badge className={getTierColor(subscription.tier)}>
                {subscription.tier.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started:</span>
                <span>{formatDate(subscription.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span>{formatDate(subscription.endTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auto-renew:</span>
                <span>{subscription.autoRenew ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleCancelSubscription}
              disabled={cancelSubscription.isPending}
              className="w-full"
            >
              {cancelSubscription.isPending ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tier-select">Select Plan</Label>
              <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as SubscriptionTier)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SubscriptionTier.basic}>Basic - $9/₹900</SelectItem>
                  <SelectItem value={SubscriptionTier.advanced}>Advanced - $45/₹4500</SelectItem>
                  <SelectItem value={SubscriptionTier.premium}>Premium - $99/₹9900</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-renew"
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
              />
              <Label htmlFor="auto-renew" className="text-sm">Auto-renew subscription</Label>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => handleSubscribe('USD')}
                disabled={createCheckout.isPending}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {createCheckout.isPending ? 'Processing...' : `Subscribe with USD`}
              </Button>
              <Button 
                onClick={() => handleSubscribe('INR')}
                disabled={createCheckout.isPending}
                variant="outline"
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {createCheckout.isPending ? 'Processing...' : `Subscribe with INR`}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Secure payment powered by Stripe
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
