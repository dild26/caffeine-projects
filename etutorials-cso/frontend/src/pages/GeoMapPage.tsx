import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Globe, Navigation } from 'lucide-react';

export default function GeoMapPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Globe className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Geographic Map</h1>
        <p className="text-xl text-muted-foreground">
          Global reach and accessibility of the E-Tutorial platform across regions.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Accessibility</CardTitle>
            <CardDescription>Available worldwide on the Internet Computer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The E-Tutorial platform is deployed on the Internet Computer blockchain, making it accessible 
              from anywhere in the world with an internet connection. Our decentralized infrastructure ensures 
              high availability and low latency across all regions.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Americas</CardTitle>
              <CardDescription>North and South America</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full platform access with optimized content delivery for users across the Americas region.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Europe & Africa</CardTitle>
              <CardDescription>EMEA region</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive coverage across Europe, Middle East, and Africa with multi-language support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Asia-Pacific</CardTitle>
              <CardDescription>APAC region</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Serving learners and instructors across Asia-Pacific with localized content delivery.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Location Features</CardTitle>
                <CardDescription>Geographic capabilities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Decentralized Hosting</p>
                  <p className="text-sm text-muted-foreground">
                    Hosted on Internet Computer nodes distributed globally
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Low Latency Access</p>
                  <p className="text-sm text-muted-foreground">
                    Fast content delivery regardless of user location
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">24/7 Availability</p>
                  <p className="text-sm text-muted-foreground">
                    Always accessible with no geographic restrictions
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Multi-Currency Support</p>
                  <p className="text-sm text-muted-foreground">
                    Fees displayed in both INR and USD for global users
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
