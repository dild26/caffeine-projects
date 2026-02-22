import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow, Package, Users, Headphones } from 'lucide-react';

export default function WhatWeDo() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">What We Do</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We provide comprehensive workflow automation solutions for businesses of all sizes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <Workflow className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Workflow Templates</CardTitle>
            <CardDescription>
              Curated collection of production-ready n8n workflow templates for common business processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• CRM integrations</li>
              <li>• Marketing automation</li>
              <li>• Data synchronization</li>
              <li>• Notification systems</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Package className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Custom Solutions</CardTitle>
            <CardDescription>
              Tailored workflow solutions designed specifically for your business needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Custom workflow development</li>
              <li>• Integration consulting</li>
              <li>• Process optimization</li>
              <li>• Technical support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Community</CardTitle>
            <CardDescription>
              Active community of automation enthusiasts sharing knowledge and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Discussion forums</li>
              <li>• Tutorial videos</li>
              <li>• Best practice guides</li>
              <li>• Regular webinars</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Headphones className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Support</CardTitle>
            <CardDescription>
              Dedicated support team ready to help you succeed with your automation projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Email support</li>
              <li>• Documentation</li>
              <li>• Video tutorials</li>
              <li>• Priority support for subscribers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
