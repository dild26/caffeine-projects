import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  {
    title: 'Save Time',
    description: 'Pre-built workflows mean you can deploy automation in minutes instead of hours or days.',
  },
  {
    title: 'Reduce Errors',
    description: 'Tested and validated workflows minimize the risk of bugs and errors in your automation.',
  },
  {
    title: 'Best Practices',
    description: 'Learn from expert-crafted workflows that follow industry best practices and patterns.',
  },
  {
    title: 'Easy Customization',
    description: 'All workflows are fully customizable to match your specific business requirements.',
  },
  {
    title: 'Regular Updates',
    description: 'Get access to new workflows and updates as they become available.',
  },
  {
    title: 'Community Support',
    description: 'Join a community of automation enthusiasts and get help when you need it.',
  },
];

export default function Pros() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Why Choose Our Workflows?</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the advantages of using professionally crafted workflow templates
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CheckCircle2 className="h-12 w-12 mb-4 text-green-600" />
              <CardTitle>{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
