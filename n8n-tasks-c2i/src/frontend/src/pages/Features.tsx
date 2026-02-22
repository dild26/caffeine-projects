import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Search, Upload, Download, Shield, TrendingUp } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Upload,
      title: 'Multi-File Upload',
      description: 'Upload up to 3000+ workflow files at once with support for .json, .md, and .zip formats',
      status: 'Available',
    },
    {
      icon: Shield,
      title: 'SHA-256 Deduplication',
      description: 'Automatic file deduplication prevents duplicate workflows and saves storage space',
      status: 'Available',
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Powerful search and filtering capabilities to find the perfect workflow quickly',
      status: 'Available',
    },
    {
      icon: Download,
      title: 'Instant Downloads',
      description: 'Download workflows instantly with one click, ready to import into n8n',
      status: 'Available',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track downloads, views, and usage statistics for your workflows',
      status: 'Coming Soon',
    },
    {
      icon: Zap,
      title: 'Auto-Save',
      description: 'Automatic saving during uploads ensures no data loss',
      status: 'Available',
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover all the powerful features that make our platform the best choice for n8n workflows
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <Icon className="h-12 w-12 text-primary" />
                  <Badge variant={feature.status === 'Available' ? 'default' : 'outline'}>{feature.status}</Badge>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
