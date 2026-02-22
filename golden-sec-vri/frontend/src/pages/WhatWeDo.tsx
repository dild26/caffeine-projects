import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Building2, TrendingUp, Users, Shield, BarChart } from 'lucide-react';

export default function WhatWeDo() {
  const services = [
    {
      icon: Building2,
      title: 'Property Curation',
      description:
        'We carefully select and curate premium properties with high investment potential, ensuring quality and value for our investors.',
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description:
        'Our team provides comprehensive market analysis and insights to help investors make informed decisions.',
    },
    {
      icon: Users,
      title: 'Fractional Ownership Platform',
      description:
        'We provide a secure platform for fractional property ownership, making real estate investment accessible to all.',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description:
        'All transactions are secured by blockchain technology, ensuring transparency and immutability.',
    },
    {
      icon: BarChart,
      title: 'Portfolio Management',
      description:
        'Track and manage your property investments with our intuitive dashboard and real-time updates.',
    },
  ];

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">What We Do</h1>
          <p className="text-muted-foreground">Our services and offerings</p>
        </div>
      </div>

      <div className="mb-8">
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-lg">
              SECoin provides a comprehensive platform for fractional property investment, combining traditional
              real estate expertise with blockchain technology to create a secure, transparent, and accessible
              investment ecosystem.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => (
          <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>Our Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </span>
                <div>
                  <strong>Property Selection:</strong> We identify and evaluate premium properties with strong
                  investment potential.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </span>
                <div>
                  <strong>Due Diligence:</strong> Comprehensive legal and financial analysis of each property.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </span>
                <div>
                  <strong>Tokenization:</strong> Properties are tokenized on the blockchain for fractional ownership.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </span>
                <div>
                  <strong>Investment:</strong> Investors can purchase fractional ownership through our platform.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  5
                </span>
                <div>
                  <strong>Management:</strong> Ongoing property management and investor updates.
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
