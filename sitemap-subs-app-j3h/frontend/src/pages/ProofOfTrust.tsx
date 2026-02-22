import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Users, CheckCircle } from 'lucide-react';

export default function ProofOfTrust() {
  const testimonials = [
    {
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      text: 'SECOINFI has transformed how we manage our customer relationships. The platform is intuitive and secure.',
    },
    {
      name: 'Sarah Johnson',
      company: 'Global Enterprises',
      text: 'The billing features and Stripe integration have streamlined our invoicing process significantly.',
    },
    {
      name: 'Michael Chen',
      company: 'Innovation Labs',
      text: 'Outstanding platform with excellent security. The role-based access control is exactly what we needed.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Proof of Trust</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trusted by businesses worldwide for secure, reliable operations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">100%</h3>
            <p className="text-muted-foreground">Blockchain Secured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">1000+</h3>
            <p className="text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">99.9%</h3>
            <p className="text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">24/7</h3>
            <p className="text-muted-foreground">Support</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">What Our Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-2xl font-semibold mb-4">Certifications & Compliance</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Security Standards</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Internet Computer Blockchain</li>
                <li>• End-to-end encryption</li>
                <li>• Multi-tenant isolation</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Protection</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• GDPR compliant</li>
                <li>• Role-based access control</li>
                <li>• Secure data storage</li>
                <li>• Privacy-first architecture</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
