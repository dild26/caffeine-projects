import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Filter, BarChart3, Clock, Database, Sparkles } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Database,
      title: 'Massive Dataset',
      description: 'Access sitemap data from millions of domains with billions of indexed links'
    },
    {
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Filter by domain authority, content type, update frequency, and quality metrics'
    },
    {
      icon: Download,
      title: 'Multiple Export Formats',
      description: 'Export your data in CSV, JSON, or XML formats for seamless integration'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get the latest sitemap data with automatic updates and change notifications'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your usage, monitor trends, and optimize your data consumption'
    },
    {
      icon: Sparkles,
      title: 'Quality Backlinks',
      description: 'Identify high-quality backlink opportunities with our advanced scoring system'
    }
  ];

  return (
    <section className="py-20 px-4 bg-card/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to harness the power of sitemap data for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
