import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import { SubscriptionStatus } from '../backend';

export default function SubscriptionPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutateAsync: createCheckout, isPending } = useCreateCheckoutSession();

  const isAuthenticated = !!identity;
  const currentPlan = userProfile?.subscriptionStatus || SubscriptionStatus.none;

  const plans = [
    {
      name: 'Basic',
      price: 9,
      status: SubscriptionStatus.basic,
      features: ['50 search results', 'Basic TLD filtering', 'Email support', 'Standard analytics'],
    },
    {
      name: 'Pro',
      price: 45,
      status: SubscriptionStatus.pro,
      popular: true,
      features: ['200 search results', 'Advanced TLD filtering', 'Priority support', 'Advanced analytics', 'API access'],
    },
    {
      name: 'Enterprise',
      price: 99,
      status: SubscriptionStatus.enterprise,
      features: [
        '1000 search results',
        'Full TLD filtering',
        '24/7 dedicated support',
        'Custom analytics',
        'Full API access',
        'White-label options',
      ],
    },
  ];

  const handleSubscribe = async (planName: string, price: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      navigate({ to: '/' });
      return;
    }

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckout({
        items: [
          {
            productName: `${planName} Subscription`,
            productDescription: `Monthly subscription to ${planName} plan`,
            priceInCents: BigInt(price * 100),
            currency: 'USD',
            quantity: BigInt(1),
          },
        ],
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-failure`,
      });
      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
    }
  };

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your sitemap search needs. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={currentPlan === plan.status ? 'outline' : 'default'}
                disabled={currentPlan === plan.status || isPending}
                onClick={() => handleSubscribe(plan.name, plan.price)}
              >
                {currentPlan === plan.status ? 'Current Plan' : isPending ? 'Processing...' : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Pay As You Use</CardTitle>
          <CardDescription>Flexible option for occasional users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Not ready for a subscription? Use our pay-as-you-go option to access 25 search results per session.
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">$2 per search session</p>
              <p className="text-sm text-muted-foreground">25 results included</p>
            </div>
            <Button variant="outline" disabled={!isAuthenticated}>
              {isAuthenticated ? 'Start Session' : 'Login Required'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
