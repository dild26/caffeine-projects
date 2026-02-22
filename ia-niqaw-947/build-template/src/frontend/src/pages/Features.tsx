import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Package, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Users,
      title: 'CRM & Contact Management',
      description: 'Organize contacts with tags, search functionality, and CSV import for bulk onboarding.',
    },
    {
      icon: FileText,
      title: 'Billing & Invoicing',
      description: 'Generate invoices, track payments, and integrate with Stripe for seamless transactions.',
    },
    {
      icon: Package,
      title: 'Product Catalog',
      description: 'Manage your product inventory with search, filtering, and WhatsApp catalog sharing.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reports',
      description: 'Gain insights into your business performance with comprehensive analytics and reporting.',
    },
    {
      icon: Shield,
      title: 'Role-Based Access Control',
      description: 'Secure multi-tenant architecture with admin, sales, billing, and viewer roles.',
    },
    {
      icon: Zap,
      title: 'Feature Toggles',
      description: 'Modular functionality with admin-controlled feature toggles for flexible deployment.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive business management tools built on the Internet Computer
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
