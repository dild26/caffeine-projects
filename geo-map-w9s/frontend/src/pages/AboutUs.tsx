import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutUs() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Pioneering geospatial technology for the modern world
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              GPS Grid Maps is developed by SECOINFI, a leading technology company specializing in geospatial solutions and blockchain-based mapping systems.
            </p>
            <p>
              We believe in making advanced geospatial technology accessible to everyone, from individual researchers to large enterprises.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Technology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Built on the Internet Computer blockchain, GPS Grid Maps combines cutting-edge 3D visualization with cryptographically secure operation logging.
            </p>
            <p>
              Our platform supports both ECEF and Web Mercator projections, advanced grid systems, and precision mapping tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
