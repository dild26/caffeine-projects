import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Shield, DollarSign, Globe, Zap } from 'lucide-react';

export default function ProsOfEContractsPage() {
  const benefits = [
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Reduce contract processing time from days to minutes with automated workflows.',
      color: 'text-blue-500',
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Eliminate printing, shipping, and storage costs associated with paper contracts.',
      color: 'text-green-500',
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Blockchain-based verification ensures tamper-proof and secure document storage.',
      color: 'text-purple-500',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access and manage contracts from anywhere in the world, anytime.',
      color: 'text-orange-500',
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Real-time notifications and updates keep all parties informed instantly.',
      color: 'text-yellow-500',
    },
    {
      icon: CheckCircle2,
      title: 'Legal Compliance',
      description: 'Built-in compliance features ensure adherence to legal requirements.',
      color: 'text-red-500',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Pros of e-Contracts</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the numerous advantages of switching to digital contract management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4">
                <benefit.icon className={`h-12 w-12 ${benefit.color}`} />
              </div>
              <CardTitle className="text-xl">{benefit.title}</CardTitle>
              <CardDescription className="text-base">{benefit.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Environmental Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            By going paperless, e-contracts contribute significantly to environmental
            conservation. Every digital contract saves trees, reduces carbon emissions from
            transportation, and minimizes waste.
          </p>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Paperless</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50%</div>
              <div className="text-sm text-muted-foreground">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">90%</div>
              <div className="text-sm text-muted-foreground">Faster Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
