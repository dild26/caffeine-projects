import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Users, TrendingUp, Star, CheckCircle, FileText } from 'lucide-react';

export default function ProofOfTrustPage() {
  const certifications = [
    { name: 'ISO 27001', description: 'Information Security Management' },
    { name: 'SOC 2 Type II', description: 'Security & Availability' },
    { name: 'GDPR Compliant', description: 'Data Protection' },
    { name: 'HIPAA Compliant', description: 'Healthcare Data Security' },
  ];

  const testimonials = [
    {
      quote: 'E-Contracts has transformed our legal workflow. The security and ease of use are unmatched.',
      author: 'Jennifer Smith',
      role: 'Legal Director',
      company: 'TechCorp Inc.',
      rating: 5,
    },
    {
      quote: 'The blockchain security gives us complete confidence in our contract management.',
      author: 'Michael Brown',
      role: 'CFO',
      company: 'FinanceHub',
      rating: 5,
    },
    {
      quote: 'Outstanding platform with excellent customer support. Highly recommended!',
      author: 'Sarah Lee',
      role: 'Operations Manager',
      company: 'GlobalTrade Ltd.',
      rating: 5,
    },
    {
      quote: 'Voice commands and AI features make contract management incredibly efficient.',
      author: 'David Kim',
      role: 'CEO',
      company: 'StartupVentures',
      rating: 5,
    },
    {
      quote: 'We\'ve saved countless hours and significantly reduced costs since switching to E-Contracts.',
      author: 'Emily Rodriguez',
      role: 'Legal Counsel',
      company: 'Enterprise Solutions',
      rating: 5,
    },
    {
      quote: 'The best contract management platform we\'ve used. Secure, fast, and reliable.',
      author: 'Robert Taylor',
      role: 'Director of Operations',
      company: 'Manufacturing Co.',
      rating: 5,
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: FileText, value: '1M+', label: 'Contracts Managed' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
    { icon: Star, value: '4.9/5', label: 'Average Rating' },
  ];

  const partners = [
    'Fortune 500 Companies',
    'Leading Law Firms',
    'Healthcare Providers',
    'Financial Institutions',
    'Technology Startups',
    'Government Agencies',
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4 text-primary">
            <Shield className="h-12 w-12" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Proof of Trust</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Trusted by thousands of businesses worldwide for secure contract management
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-lg">
          <img 
            src="/assets/generated/proof-of-trust-hero.dim_500x300.png" 
            alt="Proof of Trust" 
            className="h-auto w-full"
          />
        </div>

        {/* Stats */}
        <div className="mb-16 grid gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mx-auto mb-2 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
                <CardDescription className="text-base">{stat.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Certifications & Compliance</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mx-auto mb-4 inline-flex rounded-lg bg-primary/10 p-4 text-primary">
                    <Award className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">What Our Users Say</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.quote}"</CardDescription>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Trusted By</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-md hover:border-primary/50">
                <CardContent className="flex h-24 items-center justify-center p-4">
                  <p className="text-sm font-medium">{partner}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-12">
          <h2 className="mb-8 text-center text-4xl font-bold">Security Features</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                'End-to-end encryption',
                'Blockchain immutability',
                'Multi-factor authentication',
                'Regular security audits',
                'GDPR & HIPAA compliance',
                'Automated backups',
                'DDoS protection',
                '24/7 security monitoring',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
