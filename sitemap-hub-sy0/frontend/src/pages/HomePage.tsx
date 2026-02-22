import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Shield, Zap, Users, TrendingUp, Database } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container px-4 py-12 space-y-16">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Discover the Web's Hidden Structure
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Access millions of sitemaps with advanced search, tiered subscriptions, and enterprise-grade features.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/search">
            <Button size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              Start Searching
            </Button>
          </Link>
          <Link to="/subscription">
            <Button size="lg" variant="outline">
              View Plans
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Advanced Search</CardTitle>
            <CardDescription>Full URL path indexing with TLD filtering and real-time counts</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src="/assets/generated/search-sitemap-transparent.dim_48x48.png"
              alt="Search"
              className="w-full h-32 object-contain"
            />
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <CardTitle>Secure & Reliable</CardTitle>
            <CardDescription>Enterprise-grade data persistence with automatic backups</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src="/assets/generated/payment-security-transparent.dim_100x100.png"
              alt="Security"
              className="w-full h-32 object-contain"
            />
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-chart-1" />
            </div>
            <CardTitle>Flexible Pricing</CardTitle>
            <CardDescription>Choose from Basic, Pro, Enterprise, or Pay As You Use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Basic</span>
                <span className="font-semibold">$9/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pro</span>
                <span className="font-semibold">$45/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enterprise</span>
                <span className="font-semibold">$99/mo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Choose SitemapHub?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on the Internet Computer with cutting-edge technology for maximum performance and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Comprehensive Database</h3>
                <p className="text-sm text-muted-foreground">
                  Access millions of sitemap entries with full metadata and categorization
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Referral Program</h3>
                <p className="text-sm text-muted-foreground">
                  Earn commissions with our multi-level referral system and real-time analytics
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track your usage, referrals, and earnings with detailed insights
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border">
            <img
              src="/assets/generated/analytics-dashboard.dim_400x300.png"
              alt="Analytics Dashboard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="text-center space-y-6 py-12 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join thousands of users who trust SitemapHub for their sitemap search needs.
        </p>
        <Link to="/search">
          <Button size="lg" className="gap-2">
            <Search className="h-5 w-5" />
            Start Exploring Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
