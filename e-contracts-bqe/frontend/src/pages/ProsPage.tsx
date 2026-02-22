import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, DollarSign, Shield, Zap, Globe, Users, FileText, TrendingUp } from 'lucide-react';

export default function ProsPage() {
  const benefits = [
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Reduce contract processing time by up to 80% with automated workflows and instant access.',
      stats: '80% faster',
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Eliminate printing, storage, and courier costs while reducing administrative overhead.',
      stats: 'Save 60% on costs',
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Blockchain-based storage ensures contracts are tamper-proof and cryptographically secure.',
      stats: '100% secure',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Access your contracts anytime, anywhere, from any device with real-time synchronization.',
      stats: '24/7 availability',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Collaborate with parties worldwide without geographical limitations or time zone barriers.',
      stats: 'Worldwide access',
    },
    {
      icon: Users,
      title: 'Better Collaboration',
      description: 'Multiple parties can review, comment, and sign contracts simultaneously.',
      stats: 'Real-time collaboration',
    },
    {
      icon: FileText,
      title: 'Organized Management',
      description: 'Keep all contracts organized with powerful search, filtering, and categorization tools.',
      stats: 'Zero paper clutter',
    },
    {
      icon: TrendingUp,
      title: 'Improved Compliance',
      description: 'Maintain complete audit trails and ensure regulatory compliance with automated tracking.',
      stats: '100% compliant',
    },
  ];

  const comparisons = [
    { feature: 'Processing Time', traditional: '2-4 weeks', eContract: '1-2 days' },
    { feature: 'Storage Cost', traditional: '$500/month', eContract: '$50/month' },
    { feature: 'Accessibility', traditional: 'Office only', eContract: 'Anywhere' },
    { feature: 'Security', traditional: 'Physical locks', eContract: 'Blockchain' },
    { feature: 'Search', traditional: 'Manual', eContract: 'Instant' },
    { feature: 'Collaboration', traditional: 'Sequential', eContract: 'Simultaneous' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">Pros of e-Contracts</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Discover the compelling advantages of digital contract management and why businesses worldwide are making the switch
          </p>
        </div>

        {/* Hero Infographic */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
          <img 
            src="/assets/generated/pros-benefits-infographic.dim_600x800.png" 
            alt="Benefits of e-Contracts" 
            className="h-auto w-full"
          />
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Key Benefits</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <div className="mb-2 text-2xl font-bold text-accent">{benefit.stats}</div>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Visual Benefits */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Digital Transformation</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-lg">
              <img 
                src="/assets/generated/digital-transformation-hero.dim_1200x400.png" 
                alt="Digital Transformation" 
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-lg">
              <img 
                src="/assets/generated/digital-handshake-hero.dim_800x400.png" 
                alt="Digital Handshake" 
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Additional Visual */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-lg">
          <img 
            src="/assets/generated/econtract-advantages.dim_600x400.png" 
            alt="E-Contract Advantages" 
            className="h-auto w-full"
          />
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Traditional vs. E-Contracts</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-left font-semibold">Traditional Contracts</th>
                      <th className="p-4 text-left font-semibold text-primary">E-Contracts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-muted-foreground">{row.traditional}</td>
                        <td className="p-4 font-semibold text-primary">{row.eContract}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-12">
          <h2 className="mb-6 text-center text-4xl font-bold">Environmental Impact</h2>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-lg text-muted-foreground">
              By switching to e-contracts, businesses can significantly reduce their environmental footprint:
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">90%</div>
                <p className="text-sm text-muted-foreground">Less paper consumption</p>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-accent">75%</div>
                <p className="text-sm text-muted-foreground">Reduced carbon emissions</p>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Digital sustainability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
