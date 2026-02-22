import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Zap, Database, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            About Gateway Edge
          </h1>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade cloud storage built on the Internet Computer
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Gateway Edge is a multi-tenant cloud storage platform that leverages the power of the Internet Computer 
              to provide secure, scalable, and decentralized file storage solutions. Our platform combines enterprise-grade 
              features with blockchain technology to deliver unparalleled security and reliability.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with security at its core, featuring end-to-end encryption, tenant isolation, 
                and role-based access control to protect your data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-500" />
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimized for performance with intelligent chunk sharding and cross-canister replication 
                for rapid file access and retrieval.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Scalable Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatically scales to meet your storage needs with support for autoscaling triggers 
                and distributed storage architecture.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-500" />
                Decentralized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Powered by the Internet Computer blockchain, ensuring your data is distributed, 
                resilient, and free from single points of failure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
