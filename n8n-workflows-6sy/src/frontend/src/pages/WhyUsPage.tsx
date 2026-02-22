import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Users, Award, Globe, Lock } from 'lucide-react';

export default function WhyUsPage() {
  const reasons = [
    {
      icon: Shield,
      title: 'Built on Internet Computer',
      description: 'Our platform leverages blockchain technology for unmatched security, transparency, and reliability.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for performance with CDN-style caching and pre-rendered content for instant loading.',
    },
    {
      icon: Users,
      title: 'Vibrant Community',
      description: 'Join a growing community of workflow creators and automation enthusiasts sharing knowledge and best practices.',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Every workflow undergoes rigorous testing and review to ensure it meets our high standards.',
    },
    {
      icon: Globe,
      title: 'Decentralized & Trustless',
      description: 'No single point of failure. Your workflows and data are distributed across the Internet Computer network.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'We respect your privacy. Your data is encrypted and you maintain full control over your workflows.',
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
              The most advanced workflow marketplace on the blockchain
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{reason.title}</CardTitle>
                    <CardDescription className="text-base">{reason.description}</CardDescription>
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
            <h2 className="text-3xl font-bold tracking-tight">Our Competitive Edge</h2>
            <p className="text-lg text-muted-foreground">
              Unlike traditional SaaS platforms, we offer true decentralization, transparent pricing, and community-driven development. Your workflows are yours forever, with no vendor lock-in.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
              <div className="p-6 rounded-lg bg-card border-2 border-primary">
                <h3 className="text-xl font-semibold mb-3">Traditional Platforms</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Centralized control</li>
                  <li>• Vendor lock-in</li>
                  <li>• Hidden fees</li>
                  <li>• Limited transparency</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-card border-2 border-accent">
                <h3 className="text-xl font-semibold mb-3">Our Platform</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Decentralized architecture</li>
                  <li>• Full ownership</li>
                  <li>• Transparent pricing</li>
                  <li>• Open ecosystem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
