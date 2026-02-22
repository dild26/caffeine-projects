import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow, ShoppingCart, Rocket, HeadphonesIcon } from 'lucide-react';

export default function WhatWeDoPage() {
  const services = [
    {
      icon: Workflow,
      title: 'Workflow Marketplace',
      description: 'Browse and purchase pre-built n8n workflows from expert creators. Find solutions for common business processes and automation needs.',
    },
    {
      icon: ShoppingCart,
      title: 'Flexible Pricing',
      description: 'Choose between subscription-based access or pay-per-run models. Get exactly what you need without overpaying.',
    },
    {
      icon: Rocket,
      title: 'Instant Deployment',
      description: 'Download workflows and deploy them immediately to your n8n instance. No waiting, no complex setup required.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Community Support',
      description: 'Access our community forums, documentation, and support resources to get the most out of your workflows.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                What We Do
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your complete solution for workflow automation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Our Platform</h2>
            <p className="text-lg text-muted-foreground">
              We provide a comprehensive marketplace where workflow creators can share their expertise and businesses can find ready-made automation solutions. Our platform is built on the Internet Computer, ensuring security, reliability, and decentralization.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-center">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Browse the Catalog</h3>
                  <p className="text-muted-foreground">
                    Explore our extensive collection of workflows organized by category, use case, and pricing model.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Preview & Purchase</h3>
                  <p className="text-muted-foreground">
                    View workflow details, preview the JSON structure, and purchase using our secure Stripe integration.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Deploy & Automate</h3>
                  <p className="text-muted-foreground">
                    Download your workflow and import it into your n8n instance. Start automating immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
