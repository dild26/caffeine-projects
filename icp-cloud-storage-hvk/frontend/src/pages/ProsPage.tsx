import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, Shield, Zap, Lock, TrendingDown, Database, Globe, Clock, Users, Award } from 'lucide-react';

export default function ProsPage() {
  const advantages = [
    {
      icon: Shield,
      title: 'Decentralized Architecture',
      description: 'Built on the Internet Computer blockchain, ensuring no single point of failure and maximum data resilience across distributed nodes.',
    },
    {
      icon: Lock,
      title: 'Enhanced Security',
      description: 'Message-Locked Encryption (MLE) with content-hash-based key generation provides cryptographic security and automatic deduplication.',
    },
    {
      icon: TrendingDown,
      title: 'Predictable Pricing',
      description: 'Fixed cycle-based billing with no surprise egress fees or hidden charges. Know exactly what you\'ll pay every month.',
    },
    {
      icon: Database,
      title: 'Time Machine Backups',
      description: 'MacOS Time Machine-style backup system with Merkle tree verification, incremental updates, and efficient delta synchronization.',
    },
    {
      icon: Globe,
      title: 'Censorship Resistance',
      description: 'True data sovereignty with blockchain-based storage that cannot be arbitrarily removed or censored by any single entity.',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Leverages Internet Computer\'s efficient cycle model for computation and storage, providing superior cost-performance ratios.',
    },
    {
      icon: Clock,
      title: 'Version Control',
      description: 'Comprehensive backup history with Nonce-based session tracking, allowing you to restore any previous version of your data.',
    },
    {
      icon: Users,
      title: 'Multi-Tenant Support',
      description: 'Enterprise-grade tenant isolation with role-based access control, perfect for organizations managing multiple teams or clients.',
    },
    {
      icon: Award,
      title: 'Enterprise Features',
      description: 'Advanced replication, billing integration, policy management, and comprehensive audit logging for business-critical operations.',
    },
    {
      icon: Database,
      title: 'Efficient Storage',
      description: 'Content-hash-based deduplication eliminates redundant data storage, reducing costs while maintaining data integrity.',
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Advantages of ICP Cloud Storage at Caffeine.ai
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the next generation of cloud storage with blockchain-powered security, 
            predictable pricing, and enterprise-grade features built on the Internet Computer.
          </p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Why Choose Gateway Edge?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gateway Edge combines the reliability and features you expect from traditional cloud providers 
              with the revolutionary benefits of blockchain technology. Our platform delivers true data ownership, 
              transparent operations, and cost-efficiency without compromising on performance or security.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <Card key={index} className="group hover:border-primary/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg">{advantage.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Key Differentiators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Blockchain-Native Storage</p>
                  <p className="text-sm text-muted-foreground">
                    Unlike traditional cloud providers that retrofit blockchain features, Gateway Edge is built from the ground up 
                    on the Internet Computer, ensuring native integration and optimal performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Advanced Backup Technology</p>
                  <p className="text-sm text-muted-foreground">
                    Our Merkle tree-based backup system with Message-Locked Encryption provides cryptographic verification, 
                    efficient incremental updates, and automatic data deduplication that traditional providers can't match.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">True Cost Transparency</p>
                  <p className="text-sm text-muted-foreground">
                    No hidden fees, no surprise charges. Our cycle-based pricing model ensures you always know exactly what 
                    you're paying for, with no egress fees or bandwidth throttling.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Enterprise-Ready from Day One</p>
                  <p className="text-sm text-muted-foreground">
                    Multi-tenant architecture, role-based access control, comprehensive audit logging, and Stripe payment 
                    integration make Gateway Edge ready for business-critical workloads.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Experience the Future of Cloud Storage?</h3>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                Join organizations worldwide who trust Gateway Edge for secure, reliable, and cost-effective 
                blockchain-based cloud storage. Get started today and see the difference.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-6 py-3 font-medium hover:bg-background/90 transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border-2 border-primary-foreground/20 bg-transparent text-primary-foreground px-6 py-3 font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
