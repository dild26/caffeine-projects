import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCheckoutSession, useIsStripeConfigured } from '../hooks/useQueries';
import { ShoppingItem } from '../backend';

export default function PayuPlans() {
  const { data: isConfigured } = useIsStripeConfigured();
  const createCheckout = useCreateCheckoutSession();
  const [processing, setProcessing] = useState<string | null>(null);

  const payuPlans = [
    {
      id: 'sale-10',
      type: 'Sale',
      quantity: 10,
      price: 10000,
      description: 'Purchase 10 pins/nodes permanently',
      icon: ShoppingCart,
    },
    {
      id: 'rental-100',
      type: 'Rental',
      quantity: 100,
      price: 10000,
      description: 'Rent 100 pins/nodes for 1 month',
      icon: Calendar,
    },
    {
      id: 'lease-1000',
      type: 'Lease',
      quantity: 1000,
      price: 10000,
      description: 'Lease 1000 pins/nodes for 1 year',
      icon: TrendingUp,
    },
  ];

  const handlePurchase = async (plan: typeof payuPlans[0]) => {
    if (!isConfigured) {
      toast.error('Payment system is not configured. Please contact support.');
      return;
    }

    setProcessing(plan.id);

    const items: ShoppingItem[] = [
      {
        productName: `PAYU - ${plan.type} of ${plan.quantity} Pins/Nodes`,
        productDescription: plan.description,
        priceInCents: BigInt(plan.price),
        currency: 'USD',
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
      setProcessing(null);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="sale" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sale">Sale</TabsTrigger>
          <TabsTrigger value="rental">Rental</TabsTrigger>
          <TabsTrigger value="lease">Lease</TabsTrigger>
        </TabsList>

        {payuPlans.map((plan) => (
          <TabsContent key={plan.id} value={plan.type.toLowerCase()}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <plan.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{plan.type} - {plan.quantity} Pins/Nodes</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    ${(plan.price / 100).toFixed(2)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handlePurchase(plan)}
                  disabled={processing === plan.id}
                >
                  {processing === plan.id ? 'Processing...' : `Purchase ${plan.type}`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
