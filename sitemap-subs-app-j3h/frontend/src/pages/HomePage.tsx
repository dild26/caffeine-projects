import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, BarChart3, Users, Shield, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container py-12">
      <section className="text-center mb-16">
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <img 
            src="/assets/generated/search-hero.dim_1200x600.png" 
            alt="Search Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Advanced Sitemap Management Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Search, subscribe, and manage website sitemaps with powerful analytics, referral programs, and tiered access levels.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/search">
              <Search className="mr-2 h-5 w-5" />
              Start Searching
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/subscription">
              View Plans
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Search className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ultra-Fast Search</CardTitle>
              <CardDescription>
                High-performance unified search across all sitemaps with advanced filtering
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comprehensive Analytics</CardTitle>
              <CardDescription>
                Real-time analytics dashboard with CPC tracking and data export
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>
                Multi-level referral system with token-based payout management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure Access</CardTitle>
              <CardDescription>
                Internet Identity authentication with role-based access control
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Auto Backup</CardTitle>
              <CardDescription>
                Robust auto-backup and restore with permanent storage
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Domain Filtering</CardTitle>
              <CardDescription>
                Advanced domain filtering with TLD validation and URL counting
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Subscription Tiers</h2>
            <p className="text-muted-foreground mb-6">
              Choose the plan that fits your needs. From free access to enterprise-grade features.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Free tier with basic search access</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Premium features with advanced analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Enterprise solutions with custom integrations</span>
              </li>
            </ul>
            <Button asChild>
              <Link to="/subscription">View All Plans</Link>
            </Button>
          </div>
          <div>
            <img 
              src="/assets/generated/subscription-tiers.dim_600x400.png" 
              alt="Subscription Tiers" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="text-center bg-muted/50 rounded-lg p-12">
        <img 
          src="/assets/generated/security-shield-transparent.dim_128x128.png" 
          alt="Security" 
          className="h-20 w-20 mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Built on the Internet Computer with Internet Identity authentication, ensuring your data is secure and decentralized.
        </p>
        <Button asChild variant="outline">
          <Link to="/features">View Feature Checklist</Link>
        </Button>
      </section>
    </div>
  );
}
