import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Basic',
      price: '$9',
      priceINR: '₹900',
      tier: 'basic' as const,
      description: 'Perfect for small projects and individual developers',
      features: [
        'Up to 100 domains',
        'Basic filtering options',
        'CSV/JSON export',
        'Email support',
        '1 month access'
      ],
      popular: false
    },
    {
      name: 'Advanced',
      price: '$45',
      priceINR: '₹4500',
      tier: 'advanced' as const,
      description: 'Ideal for growing businesses and agencies',
      features: [
        'Up to 1,000 domains',
        'Advanced filtering & search',
        'Multiple export formats',
        'Priority support',
        'Analytics dashboard',
        '3 months access'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '$99',
      priceINR: '₹9900',
      tier: 'premium' as const,
      description: 'For enterprises and large-scale operations',
      features: [
        'Unlimited domains',
        'Premium quality filters',
        'Real-time updates',
        'API access',
        'Custom integrations',
        'Dedicated support',
        '6 months access'
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing options to match your needs. All plans include our core features with different access levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-border/50 bg-card/50 backdrop-blur-sm relative ${
                plan.popular ? 'ring-2 ring-primary/50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-primary">{plan.price}</div>
                  <div className="text-lg text-muted-foreground">{plan.priceINR}</div>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
