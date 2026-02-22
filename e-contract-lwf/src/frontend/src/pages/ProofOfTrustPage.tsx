import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle2, Award, FileCheck, Users } from 'lucide-react';

export default function ProofOfTrustPage() {
  const trustFactors = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'All contracts are verified on the blockchain for immutable proof of authenticity.',
      badge: 'Verified',
    },
    {
      icon: Lock,
      title: 'Bank-Level Encryption',
      description: 'Your data is protected with AES-256 encryption, the same standard used by banks.',
      badge: 'Secure',
    },
    {
      icon: CheckCircle2,
      title: 'Compliance Certified',
      description: 'Fully compliant with GDPR, ESIGN Act, and eIDAS regulations.',
      badge: 'Certified',
    },
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Awarded Best E-Contract Platform 2024 by Digital Business Review.',
      badge: 'Award Winner',
    },
    {
      icon: FileCheck,
      title: 'Audit Trail',
      description: 'Complete audit trail for every contract action with timestamp verification.',
      badge: 'Transparent',
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Over 10,000 businesses worldwide trust our platform for their contracts.',
      badge: 'Popular',
    },
  ];

  const certifications = [
    'ISO 27001 Certified',
    'SOC 2 Type II Compliant',
    'GDPR Compliant',
    'ESIGN Act Compliant',
    'eIDAS Regulation Compliant',
    'PCI DSS Level 1',
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Proof of Trust</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your security and trust are our top priorities. See why thousands of businesses trust us.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {trustFactors.map((factor) => (
          <Card key={factor.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <factor.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">{factor.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{factor.title}</CardTitle>
              <CardDescription className="text-base">{factor.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Security Certifications</CardTitle>
          <CardDescription>
            We maintain the highest security standards and compliance certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-3 p-4 rounded-lg bg-muted"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Trust Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Contracts Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
