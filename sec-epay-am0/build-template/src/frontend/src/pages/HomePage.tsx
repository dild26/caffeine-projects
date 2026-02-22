import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Shield, Zap, TrendingUp, Users, Lock, Globe } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Every transaction is secured with Merkle root validation and cryptographic hashing.',
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'QRC-based payments with real-time processing and confirmation.',
    },
    {
      icon: TrendingUp,
      title: 'Multi-Level Processing',
      description: 'Unlimited transaction depth with automatic running balance calculations.',
    },
    {
      icon: Users,
      title: 'Leaderboard System',
      description: 'Time-based rotating leaderboard with subscription management.',
    },
    {
      icon: Lock,
      title: 'Secure & Transparent',
      description: 'Complete audit trail with timestamp visibility for all transactions.',
    },
    {
      icon: Globe,
      title: 'Multi-Currency',
      description: 'Support for INR and USD with automatic conversion (1 USD = 90 INR).',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-20">
            <img src="/assets/generated/dashboard-hero.dim_800x400.png" alt="" className="w-full h-full object-cover rounded-3xl blur-sm" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
          Secoinfi ePay
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Decentralized Financial Platform with Blockchain-Inspired Security
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate({ to: '/dashboard' })} className="group">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate({ to: '/calc' })}>
            Try Calculator
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <Card className="border-border/50 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3 shrink-0 font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Register & Verify</h3>
                    <p className="text-sm text-muted-foreground">Create your account with UPI/QRC and get approved by admin.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3 shrink-0 font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Make Transactions</h3>
                    <p className="text-sm text-muted-foreground">Pay-in or pay-out using QRC scanning or manual entry.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3 shrink-0 font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Track & Verify</h3>
                    <p className="text-sm text-muted-foreground">Monitor your transactions with blockchain-level transparency.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3 shrink-0 font-semibold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Join Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">Subscribe to broadcast your QRC and climb the rankings.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-accent/5 p-8 flex items-center justify-center">
              <img src="/assets/generated/blockchain-network.dim_600x400.png" alt="Blockchain Network" className="w-full max-w-md rounded-lg shadow-lg" />
            </div>
          </div>
        </Card>
      </section>

      <section className="text-center">
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-chart-1/5">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join Secoinfi ePay today and experience the future of decentralized finance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => navigate({ to: '/dashboard' })} className="group">
              Open Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
