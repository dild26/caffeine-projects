import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Search, Zap, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    n8n Workflows
                  </span>
                  <br />
                  <span className="text-foreground">Marketplace</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Discover, purchase, and deploy powerful automation workflows. Save time and boost productivity with pre-built n8n templates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/catalog' })} className="text-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Catalog
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/catalog' })}>
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/referral-banner-template.dim_800x200.png"
                alt="n8n Workflows Hero"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get access to professionally crafted workflows that solve real business problems.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Deployment</h3>
              <p className="text-muted-foreground">
                Download and deploy workflows instantly. No setup required, just import and run.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-full bg-accent/10">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                All workflows are reviewed and tested. Built on the Internet Computer for maximum security.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Flexible Pricing</h3>
              <p className="text-muted-foreground">
                Choose between pay-per-run or subscription models. Only pay for what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAYU Fee Structure Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pay As You Use (PAYU) Fee Structure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing based on your usage tier
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Top 10</CardTitle>
                <CardDescription>For light users</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-5xl font-bold text-primary">$1</div>
                <p className="text-sm text-muted-foreground">per workflow execution</p>
                <Badge variant="outline" className="text-xs">Up to 10 executions</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent hover:border-accent/70 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10 w-fit">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Top 100</CardTitle>
                <CardDescription>For regular users</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-5xl font-bold text-accent">$10</div>
                <p className="text-sm text-muted-foreground">per workflow execution</p>
                <Badge variant="outline" className="text-xs">Up to 100 executions</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Top 1000</CardTitle>
                <CardDescription>For power users</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-5xl font-bold text-primary">$100</div>
                <p className="text-sm text-muted-foreground">per workflow execution</p>
                <Badge variant="outline" className="text-xs">Up to 1000 executions</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <img
              src="/assets/generated/payu-fee-structure.dim_600x400.png"
              alt="PAYU Fee Structure"
              className="mx-auto rounded-lg shadow-lg max-w-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Automate?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are saving time with our workflow templates.
            </p>
            <Button size="lg" onClick={() => navigate({ to: '/catalog' })}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
