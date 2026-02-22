import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Code, Zap } from 'lucide-react';

export default function WhatWeDoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">What We Do</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive authentication solutions for the decentralized web
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>Enterprise-grade security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide robust authentication infrastructure built on blockchain technology, ensuring your identity is protected by cryptographic security.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Identity Management</CardTitle>
              <CardDescription>Complete control for users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our platform enables users to manage their digital identities across multiple services while maintaining full ownership and control.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Code className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Developer Tools</CardTitle>
              <CardDescription>Easy integration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We offer comprehensive APIs and SDKs that make it simple for developers to integrate secure authentication into their applications.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Performance</CardTitle>
              <CardDescription>Lightning-fast authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our optimized infrastructure ensures quick authentication without sacrificing security, providing seamless user experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
