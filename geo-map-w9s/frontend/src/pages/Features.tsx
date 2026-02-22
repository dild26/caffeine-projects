import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Grid3x3, MapPin, Hexagon, FileText, Zap } from 'lucide-react';
import PayuPlans from '../components/PayuPlans';

export default function Features() {
  const features = [
    {
      icon: Globe,
      title: '3D Globe View',
      description: 'Interactive 3D globe with ECEF projection and 1:1 scale image overlay for accurate geospatial visualization',
    },
    {
      icon: Grid3x3,
      title: 'Advanced Grid Systems',
      description: 'Toggle between axis-aligned and geodesic (S2) grid overlays with customizable resolution',
    },
    {
      icon: MapPin,
      title: 'Precision Pin Placement',
      description: 'Place pins with exact latitude, longitude, and altitude coordinates',
    },
    {
      icon: Hexagon,
      title: 'Polygon Creation',
      description: 'Create complex polygons with automatic triangulation and grid cell mapping',
    },
    {
      icon: FileText,
      title: 'Operation Logging',
      description: 'Append-only manifest log with Ed25519 signatures for all operations',
    },
    {
      icon: Zap,
      title: 'Telescope Zoom',
      description: 'Advanced zoom controls from 10x to 1,000,000x magnification',
    },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful geospatial tools for mapping, analysis, and visualization
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Pay As You Use (PAYU)</h2>
            <p className="text-muted-foreground">
              Flexible pricing options for pins and nodes
            </p>
          </div>
          <PayuPlans />
        </div>
      </div>
    </main>
  );
}
