import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Zap, Shield, TrendingUp, Clock, DollarSign } from 'lucide-react';

export default function ProsPage() {
  const benefits = [
    {
      icon: Zap,
      title: 'Instant Deployment',
      description: 'Download and deploy workflows in seconds. No complex setup or configuration required.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Built on the Internet Computer blockchain for maximum security and reliability.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: 'All workflows are tested and optimized for real-world business scenarios.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate repetitive tasks and focus on what matters most to your business.',
    },
    {
      icon: DollarSign,
      title: 'Cost Effective',
      description: 'Flexible pricing models that scale with your needs. Pay only for what you use.',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Assured',
      description: 'Every workflow is reviewed by our team to ensure it meets our quality standards.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-b-4 border-accent">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Why Choose Us
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the advantages of using our workflow marketplace
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Trusted by Businesses Worldwide</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of companies that have automated their workflows and saved countless hours of manual work.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Workflows</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">5000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
