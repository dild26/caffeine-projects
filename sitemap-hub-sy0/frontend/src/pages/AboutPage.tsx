import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About SitemapHub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The world's most comprehensive sitemap search and subscription platform, built on the Internet Computer for
          maximum security and reliability.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Democratizing access to web structure data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe that understanding the structure of the web should be accessible to everyone. SitemapHub
              provides powerful search capabilities across millions of sitemaps, enabling researchers, developers, and
              businesses to discover and analyze web architecture at scale.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <CardTitle>Our Technology</CardTitle>
            <CardDescription>Built on the Internet Computer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Leveraging the Internet Computer's blockchain technology, we provide enterprise-grade data persistence,
              automatic backups, and decentralized infrastructure. Our platform ensures your data is always available,
              secure, and tamper-proof.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-chart-1" />
            </div>
            <CardTitle>Security First</CardTitle>
            <CardDescription>Your data, protected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We implement Internet Identity for authentication, ensuring your privacy and security. All payment
              processing is handled securely through Stripe, and we never store sensitive payment information on our
              servers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-chart-2" />
            </div>
            <CardTitle>Community Driven</CardTitle>
            <CardDescription>Growing together</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our referral program rewards users who help grow the platform. With multi-level commission tracking and
              real-time analytics, we believe in sharing success with our community.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            'Advanced Search with TLD Filtering',
            'Tiered Subscription Plans',
            'Pay As You Use Option',
            'Multi-level Referral System',
            'Real-time Analytics Dashboard',
            'Secure Payment Processing',
            'Internet Identity Authentication',
            'Enterprise-grade Data Persistence',
            'Automatic Backup & Restore',
            'Link Preview with Fallbacks',
            'Responsive Modern UI',
            'WCAG 2.1 AA Accessibility',
          ].map((feature, idx) => (
            <Badge key={idx} variant="secondary" className="py-2 px-4 justify-center">
              {feature}
            </Badge>
          ))}
        </div>
      </section>

      <section className="text-center space-y-4 py-8">
        <h2 className="text-3xl font-bold">Join Thousands of Users</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          From individual researchers to enterprise teams, SitemapHub serves users worldwide with reliable, scalable
          sitemap search capabilities.
        </p>
        <div className="flex gap-8 justify-center pt-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">1M+</div>
            <div className="text-sm text-muted-foreground">Sitemaps Indexed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent">10K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-chart-1">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>
      </section>
    </div>
  );
}
