import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Users, Award, HeartHandshake, TrendingUp } from 'lucide-react';

export default function WhyUsPage() {
  const reasons = [
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Bank-level encryption and blockchain verification ensure your contracts are always secure and tamper-proof.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process contracts in seconds, not days. Our optimized infrastructure delivers unmatched performance.',
    },
    {
      icon: Users,
      title: 'User-Friendly Interface',
      description: 'Intuitive design that requires no training. Get started immediately with our easy-to-use platform.',
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Trusted by businesses worldwide. Our platform sets the standard for e-contract management.',
    },
    {
      icon: HeartHandshake,
      title: '24/7 Support',
      description: 'Dedicated support team available around the clock to assist you with any questions or issues.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'Regular updates and new features ensure you always have access to the latest technology.',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Why Choose Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover what makes our e-contract management platform the best choice for your business
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {reasons.map((reason) => (
          <Card key={reason.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70">
                <reason.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">{reason.title}</CardTitle>
              <CardDescription className="text-base">{reason.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Join Thousands of Satisfied Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
