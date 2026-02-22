import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateCheckoutSession, useIsStripeConfigured } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingItem } from '../backend';
import PayuPlans from '../components/PayuPlans';

export default function Subscription() {
  const navigate = useNavigate();
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const createCheckout = useCreateCheckoutSession();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 999,
      currency: 'USD',
      description: 'Perfect for individuals',
      features: [
        '100 pins per month',
        '10 polygons',
        'Basic grid resolution',
        'Email support',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 2999,
      currency: 'USD',
      description: 'For power users',
      features: [
        '1,000 pins per month',
        '100 polygons',
        'Advanced grid resolution',
        'Priority support',
        'API access',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 9999,
      currency: 'USD',
      description: 'For organizations',
      features: [
        'Unlimited pins',
        'Unlimited polygons',
        'Maximum grid precision',
        '24/7 dedicated support',
        'API access',
        'Custom integrations',
      ],
    },
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!isConfigured) {
      toast.error('Payment system is not configured. Please contact support.');
      return;
    }

    setSelectedPlan(plan.id);

    const items: ShoppingItem[] = [
      {
        productName: `GPS Grid Maps - ${plan.name} Plan`,
        productDescription: plan.description,
        priceInCents: BigInt(plan.price),
        currency: plan.currency,
        quantity: BigInt(1),
      },
    ];

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const result = await createCheckout.mutateAsync({
        items,
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-failure`,
      });

      const session = JSON.parse(result);
      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      setSelectedPlan(null);
    }
  };

  if (configLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and bulk access to nodes and pins with our subscription plans
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.popular ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${(plan.price / 100).toFixed(2)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Pay As You Use (PAYU)</h2>
            <p className="text-muted-foreground">
              Flexible pricing options for pins and nodes
            </p>
          </div>
          <PayuPlans />
        </div>

        <div className="text-center space-y-4 pt-8">
          <h2 className="text-2xl font-bold">Payment Methods Accepted</h2>
          <p className="text-muted-foreground">
            We accept Stripe, PayPal, UPI, and Demand Draft (DD)
          </p>
        </div>
      </div>
    </main>
  );
}
