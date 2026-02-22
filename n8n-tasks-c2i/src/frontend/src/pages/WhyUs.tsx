import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Shield, Zap, Users } from 'lucide-react';

export default function WhyUs() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Why Choose Us?</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're committed to providing the best workflow automation experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border-2">
          <CardHeader>
            <Award className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Quality Guaranteed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Every workflow is thoroughly tested and validated before being added to our catalog. We ensure that all
              templates work flawlessly and follow best practices.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <Shield className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Secure & Reliable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built on the Internet Computer blockchain, our platform ensures your data is secure and your workflows
              are always available when you need them.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <Zap className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Fast & Efficient</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get started in minutes with our ready-to-use templates. No need to build workflows from scratch - just
              download, customize, and deploy.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <Users className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Community Driven</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Join a growing community of automation enthusiasts. Share your workflows, learn from others, and
              contribute to the ecosystem.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-lg p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
        <p className="text-xl mb-6 opacity-90">
          Join the growing community of businesses automating their workflows with our platform
        </p>
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-4xl font-bold mb-2">1000+</div>
            <div className="opacity-90">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="opacity-90">Workflows</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <div className="opacity-90">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
