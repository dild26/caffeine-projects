import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, Zap, CheckCircle } from 'lucide-react';

export default function WhatWeDoPage() {
  const services = [
    {
      icon: FileText,
      title: 'Contract Creation & Management',
      description: 'Create, edit, and manage digital contracts with our intuitive platform.',
      features: [
        'Template library with customizable fields',
        'Drag-and-drop contract builder',
        'Version control and history tracking',
        'Status management (draft, active, completed)',
      ],
    },
    {
      icon: Users,
      title: 'Multi-Party Collaboration',
      description: 'Enable seamless collaboration between all contract parties.',
      features: [
        'Real-time editing and commenting',
        'Role-based access control',
        'Digital signature collection',
        'Notification system for updates',
      ],
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Leverage blockchain technology for unparalleled security.',
      features: [
        'Immutable contract storage',
        'Cryptographic verification',
        'Tamper-proof audit trails',
        'Decentralized architecture',
      ],
    },
    {
      icon: Zap,
      title: 'AI-Powered Features',
      description: 'Enhance productivity with artificial intelligence.',
      features: [
        'Voice command navigation',
        'Text-to-speech for accessibility',
        'Smart contract analysis',
        'Automated workflow suggestions',
      ],
    },
  ];

  const process = [
    {
      step: '1',
      title: 'Create',
      description: 'Start with a template or create a custom contract from scratch.',
    },
    {
      step: '2',
      title: 'Collaborate',
      description: 'Invite parties to review, comment, and negotiate terms.',
    },
    {
      step: '3',
      title: 'Execute',
      description: 'Collect digital signatures and finalize the contract.',
    },
    {
      step: '4',
      title: 'Manage',
      description: 'Store, search, and manage all your contracts in one place.',
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">What We Do</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            E-Contracts provides comprehensive digital contract management solutions powered by blockchain and AI technology
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
          <img 
            src="/assets/generated/what-we-do-illustration.dim_600x400.png" 
            alt="What We Do" 
            className="h-auto w-full"
          />
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">Our Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, index) => (
              <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {process.map((item, index) => (
              <Card key={index} className="relative text-center transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                {index < process.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 bg-gradient-to-r from-primary to-accent md:block" />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-12">
          <h2 className="mb-8 text-center text-4xl font-bold">Industries We Serve</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                'Legal Services',
                'Real Estate',
                'Healthcare',
                'Finance',
                'Technology',
                'Manufacturing',
                'Retail',
                'Education',
                'Government',
              ].map((industry, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-4 text-center font-medium transition-all hover:border-primary/50 hover:shadow-md"
                >
                  {industry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
