import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Users, Award, HeartHandshake, TrendingUp, Globe, Lock } from 'lucide-react';

export default function WhyUsPage() {
  const reasons = [
    {
      icon: Shield,
      title: 'Unmatched Security',
      description: 'Built on blockchain technology with military-grade encryption to protect your contracts.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process contracts in seconds, not days. Our optimized infrastructure ensures peak performance.',
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for everyone, from beginners to power users.',
    },
    {
      icon: Award,
      title: 'Industry Leader',
      description: 'Trusted by thousands of businesses worldwide with a proven track record of excellence.',
    },
    {
      icon: HeartHandshake,
      title: '24/7 Support',
      description: 'Our dedicated support team is always available to help you succeed.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'Regular updates and new features based on user feedback and industry trends.',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access your contracts from anywhere in the world, on any device.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is yours. We never share or sell your information to third parties.',
    },
  ];

  const testimonials = [
    {
      quote: 'E-Contracts transformed how we manage our legal documents. The time savings alone have been incredible.',
      author: 'Jennifer Smith',
      role: 'Legal Director, TechCorp',
    },
    {
      quote: 'The blockchain security gives us peace of mind. We know our contracts are safe and tamper-proof.',
      author: 'Michael Brown',
      role: 'CFO, FinanceHub',
    },
    {
      quote: 'Voice commands and AI assistance make contract management accessible to our entire team.',
      author: 'Sarah Lee',
      role: 'Operations Manager, GlobalTrade',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '1M+', label: 'Contracts Managed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">Why Choose E-Contracts</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Discover what makes E-Contracts the preferred choice for digital contract management
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
                <CardDescription className="text-base">{stat.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Reasons */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">What Sets Us Apart</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mx-auto mb-4 inline-flex rounded-lg bg-primary/10 p-4 text-primary">
                    <reason.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                  <CardDescription>{reason.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">What Our Users Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <CardDescription className="text-base italic">"{testimonial.quote}"</CardDescription>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-12">
          <h2 className="mb-8 text-center text-4xl font-bold">The E-Contracts Advantage</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Other Platforms</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Centralized storage risks</li>
                  <li>• Limited accessibility</li>
                  <li>• Complex interfaces</li>
                  <li>• High costs</li>
                  <li>• Slow processing</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-primary">E-Contracts</h3>
                <ul className="space-y-2 font-medium">
                  <li>✓ Blockchain security</li>
                  <li>✓ Global accessibility</li>
                  <li>✓ Intuitive design</li>
                  <li>✓ Affordable pricing</li>
                  <li>✓ Instant processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
