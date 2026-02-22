import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Database, BarChart3, Lock, Workflow } from 'lucide-react';

export default function WhatWeDoPage() {
  const services = [
    {
      icon: FileText,
      title: 'Contract Management',
      description: 'Complete lifecycle management from creation to execution and archival.',
      features: ['Digital signatures', 'Version control', 'Status tracking', 'Automated workflows'],
    },
    {
      icon: Upload,
      title: 'File Processing',
      description: 'Advanced file upload and processing with support for multiple formats.',
      features: ['Bulk uploads', 'SHA-256 hashing', 'Automatic pairing', 'Deduplication'],
    },
    {
      icon: Database,
      title: 'Template Engine',
      description: 'Dynamic template system for creating standardized contracts quickly.',
      features: ['JSON schema parsing', 'Custom fields', 'Markdown support', 'Preview generation'],
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting for data-driven decisions.',
      features: ['Real-time metrics', 'Usage statistics', 'Performance tracking', 'Export capabilities'],
    },
    {
      icon: Lock,
      title: 'Blockchain Integration',
      description: 'Secure verification and proof of authenticity using blockchain technology.',
      features: ['Ethereum signatures', 'ZK proofs', 'Smart contracts', 'Immutable records'],
    },
    {
      icon: Workflow,
      title: 'Payment Processing',
      description: 'Integrated payment solutions for contract-based transactions.',
      features: ['Stripe integration', 'Multiple currencies', 'Secure checkout', 'Receipt generation'],
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">What We Do</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive e-contract management solutions powered by cutting-edge technology
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
