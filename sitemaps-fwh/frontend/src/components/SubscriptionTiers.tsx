import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Rocket, CreditCard } from 'lucide-react';
import { SubscriptionTier } from '@/backend';
import { useCreateSubscription, useIsStripeConfigured } from '@/hooks/useQueries';
import { createSubscriptionShoppingItem } from '@/hooks/useStripePayment';
import StripePaymentModal from './StripePaymentModal';
import { toast } from 'sonner';

interface SubscriptionTiersProps {
  currentTier?: SubscriptionTier | null;
}

export default function SubscriptionTiers({ currentTier }: SubscriptionTiersProps) {
  const createSubscriptionMutation = useCreateSubscription();
  const { data: isStripeConfigured = false } = useIsStripeConfigured();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'enterprise' | null>(null);

  const handleSubscribe = async (tierType: 'basic' | 'pro' | 'enterprise') => {
    if (!isStripeConfigured) {
      toast.error('Payment system is not configured. Please contact support.');
      return;
    }

    setSelectedTier(tierType);
    setPaymentModalOpen(true);
  };

  const tiers = [
    {
      name: 'Basic',
      tierType: 'basic' as const,
      tier: { __kind__: 'basic', basic: null } as SubscriptionTier,
      price: '$9',
      description: 'Perfect for getting started',
      icon: <Zap className="h-6 w-6" />,
      features: [
        '1,000 searches per month',
        'Basic sitemap data',
        'Community support',
        'Standard rate limits'
      ],
      popular: false,
    },
    {
      name: 'Pro',
      tierType: 'pro' as const,
      tier: { __kind__: 'pro', pro: null } as SubscriptionTier,
      price: '$45',
      description: 'For growing businesses',
      icon: <Crown className="h-6 w-6" />,
      features: [
        '10,000 searches per month',
        'Advanced sitemap analytics',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      tierType: 'enterprise' as const,
      tier: { __kind__: 'enterprise', enterprise: null } as SubscriptionTier,
      price: '$99',
      description: 'For large organizations',
      icon: <Rocket className="h-6 w-6" />,
      features: [
        'Unlimited searches',
        'Real-time sitemap monitoring',
        'Dedicated support',
        'Custom solutions',
        'SLA guarantee',
        'White-label options'
      ],
      popular: false,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrentTier = currentTier?.__kind__ === tier.tier.__kind__;
          
          return (
            <Card 
              key={tier.name} 
              className={`relative ${tier.popular ? 'border-primary neon-glow' : ''} ${isCurrentTier ? 'bg-primary/5' : ''}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2 text-primary">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="text-3xl font-bold text-primary">
                  {tier.price}
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier.tierType)}
                  disabled={createSubscriptionMutation.isPending || isCurrentTier || !isStripeConfigured}
                >
                  {isCurrentTier 
                    ? 'Current Plan' 
                    : createSubscriptionMutation.isPending 
                      ? 'Processing...' 
                      : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Subscribe
                        </>
                      )
                  }
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Stripe Payment Modal */}
      {selectedTier && (
        <StripePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          shoppingItem={createSubscriptionShoppingItem(selectedTier)}
          paymentType="subscription"
        />
      )}
    </>
  );
}
