import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useGetCallerUserProfile, useCreateCheckoutSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { ShoppingItem } from '../backend';

export default function SubscriptionPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const createCheckout = useCreateCheckoutSession();

  const plans = [
    {
      name: 'Free',
      price: 0,
      status: 'free',
      features: [
        'Basic sitemap search',
        'Up to 5 sitemaps',
        'Community support',
        'Basic analytics',
      ],
    },
    {
      name: 'Basic',
      price: 9.99,
      status: 'basic',
      features: [
        'Advanced search',
        'Up to 50 sitemaps',
        'Email support',
        'Advanced analytics',
        'Export data',
      ],
    },
    {
      name: 'Premium',
      price: 29.99,
      status: 'premium',
      features: [
        'Unlimited sitemaps',
        'Priority support',
        'Full analytics suite',
        'API access',
        'Custom integrations',
        'Referral rewards',
      ],
    },
    {
      name: 'Enterprise',
      price: 99.99,
      status: 'enterprise',
      features: [
        'Everything in Premium',
        'Dedicated support',
        'Custom SLA',
        'Advanced security',
        'White-label options',
        'Custom development',
      ],
    },
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      toast.info('You are already on the free plan');
      return;
    }

    try {
      const items: ShoppingItem[] = [{
        productName: `${plan.name} Subscription`,
        productDescription: `Monthly subscription to ${plan.name} plan`,
        priceInCents: BigInt(Math.round(plan.price * 100)),
        currency: 'USD',
        quantity: BigInt(1),
      }];

      const session = await createCheckout.mutateAsync(items);
      const sessionData = JSON.parse(session);
      window.location.href = sessionData.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error(error);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
          {userProfile && (
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Current Plan: {userProfile.subscriptionStatus.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = userProfile?.subscriptionStatus === plan.status;
            
            return (
              <Card key={plan.name} className={isCurrentPlan ? 'border-primary shadow-lg' : ''}>
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${plan.price}</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? 'secondary' : 'default'}
                    disabled={isCurrentPlan || createCheckout.isPending}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {isCurrentPlan ? 'Current Plan' : createCheckout.isPending ? 'Processing...' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <img 
            src="/assets/generated/subscription-tiers.dim_600x400.png" 
            alt="Subscription Benefits" 
            className="mx-auto rounded-lg shadow-lg max-w-2xl w-full"
          />
        </div>
      </div>
    </div>
  );
}
