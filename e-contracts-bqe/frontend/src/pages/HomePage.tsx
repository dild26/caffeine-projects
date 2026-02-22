import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mic, Volume2, Shield, Zap, Globe, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const features = [
    {
      icon: FileText,
      title: 'Smart Contracts',
      description: 'Create, manage, and execute digital contracts with ease and security.',
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Navigate and control with natural voice interactions powered by AI.',
    },
    {
      icon: Volume2,
      title: 'AI Assistance',
      description: 'Get natural language responses with text-to-speech capabilities.',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Decentralized storage ensures your contracts are secure and immutable.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process contracts in seconds with our optimized infrastructure.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your contracts from anywhere, anytime, on any device.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl delay-1000" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
              The Future of Digital Contracts
            </h1>
            <p className="mb-8 text-xl text-foreground/80 md:text-2xl">
              Revolutionize your contract management with blockchain technology, AI assistance, and voice control.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="group gap-2 px-8 py-6 text-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="group gap-2 px-8 py-6 text-lg"
                >
                  {isLoggingIn ? 'Connecting...' : 'Get Started'}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/about-us' })}
                className="px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-sm">
              <img 
                src="/assets/generated/dashboard-hero.dim_1200x400.png" 
                alt="E-Contracts Platform Dashboard" 
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Powerful Features</h2>
            <p className="text-xl text-foreground/70">
              Everything you need to manage contracts efficiently
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-card-foreground/70">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="mb-8 text-xl text-foreground/70">
              Join thousands of users managing their contracts with E-Contracts
            </p>
            {!isAuthenticated && (
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="px-8 py-6 text-lg"
              >
                {isLoggingIn ? 'Connecting...' : 'Start Free Today'}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

