import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Package, Shield } from 'lucide-react';

export default function WhatWeDo() {
  const services = [
    {
      icon: Users,
      title: 'CRM Solutions',
      description: 'Comprehensive contact management with tagging, search, and CSV import capabilities for efficient customer relationship management.',
    },
    {
      icon: FileText,
      title: 'Billing & Invoicing',
      description: 'Streamlined invoice generation, payment tracking, and Stripe integration for seamless financial operations.',
    },
    {
      icon: Package,
      title: 'Product Management',
      description: 'Complete product catalog management with search functionality and WhatsApp sharing capabilities.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Multi-tenant architecture with role-based access control ensuring data privacy and security.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">What We Do</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive business management solutions for modern enterprises
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-2xl font-semibold mb-4">Our Approach</h3>
          <p className="text-muted-foreground mb-4">
            We leverage the power of the Internet Computer blockchain to deliver secure, scalable, and 
            privacy-first business management solutions. Our platform is designed with modularity in mind, 
            allowing organizations to enable only the features they need.
          </p>
          <p className="text-muted-foreground">
            With role-based access control, multi-tenant architecture, and comprehensive feature toggles, 
            SECOINFI adapts to your business requirements while maintaining the highest standards of 
            security and performance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
