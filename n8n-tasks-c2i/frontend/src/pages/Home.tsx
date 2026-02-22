import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="relative mb-8">
          <img
            src="/assets/generated/hero-automation-banner.dim_1200x600.png"
            alt="Automation Banner"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Premium n8n Workflow Templates
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Accelerate your automation journey with professionally crafted n8n workflows. Save time, reduce errors, and
          scale your business faster.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate({ to: '/subscribers' })}>
            Browse Workflows <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate({ to: '/about' })}>
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Workflows?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Zap className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Production Ready</CardTitle>
              <CardDescription>
                All workflows are tested and optimized for real-world use cases. Deploy with confidence.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Built with security best practices and error handling. Your data stays safe.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Constantly Updated</CardTitle>
              <CardDescription>
                Regular updates with new workflows and improvements based on community feedback.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-lg p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Automate?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of users who trust our workflows</p>
        <Button size="lg" variant="secondary" onClick={() => navigate({ to: '/subscribers' })}>
          Get Started Now
        </Button>
      </section>
    </div>
  );
}
