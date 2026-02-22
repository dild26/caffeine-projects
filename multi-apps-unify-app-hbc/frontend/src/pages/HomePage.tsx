import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { FileText, Zap, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Specification Management',
      description: 'Manage YAML and Markdown specification files with ease',
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Automatic synchronization between YAML and Markdown formats',
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Role-based authentication and admin controls',
    },
  ];

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Multi-Apps-Unify Platform
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            A powerful specification management platform with two-way synchronization between YAML and Markdown files
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate({ to: '/blog' })}>
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/apps' })}>
              Explore Apps
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Ready to Get Started?</h2>
        <p className="mb-6 text-muted-foreground">
          Access the admin dashboard to manage your specifications
        </p>
        <Button size="lg" onClick={() => navigate({ to: '/admin' })}>
          Go to Dashboard
        </Button>
      </section>
    </div>
  );
}
