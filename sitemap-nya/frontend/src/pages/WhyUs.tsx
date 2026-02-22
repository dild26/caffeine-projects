import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Globe, Users } from 'lucide-react';

export default function WhyUs() {
  const reasons = [
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Built on the Internet Computer blockchain with multi-tenant isolation and role-based access control.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant transactions and real-time updates powered by blockchain technology.',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access your business data from anywhere, anytime, with 24/7 availability.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based permissions enable seamless collaboration across your organization.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Why Choose Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The advantages that set SECOINFI apart from traditional solutions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reasons.map((reason, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <reason.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-2xl font-semibold mb-4">Our Commitment</h3>
          <p className="text-muted-foreground mb-4">
            We are committed to providing the most secure, efficient, and user-friendly business management 
            platform available. By leveraging the Internet Computer blockchain, we ensure your data remains 
            private, secure, and always accessible.
          </p>
          <p className="text-muted-foreground">
            Our platform is designed to grow with your business, offering scalable solutions that adapt to 
            your changing needs. With comprehensive features, intuitive design, and enterprise-grade security, 
            SECOINFI is the smart choice for modern businesses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
