import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Globe, Users, Wifi } from 'lucide-react';

export default function LocationsPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <MapPin className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Locations & Accessibility</h1>
        <p className="text-xl text-muted-foreground">
          Learn from anywhere in the world with our globally accessible platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Global Platform
            </CardTitle>
            <CardDescription>
              Access educational resources from anywhere with internet connectivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              E-Tutorial is a fully online platform built on the Internet Computer blockchain, making it accessible 
              from anywhere in the world. Our decentralized infrastructure ensures reliable access regardless of your location.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">24/7 Availability</h4>
                <p className="text-sm text-muted-foreground">
                  Access resources and book appointments at any time, from any timezone.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Multi-Language Support</h4>
                <p className="text-sm text-muted-foreground">
                  Content and instructors available in multiple languages for global learners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Instructor Locations
            </CardTitle>
            <CardDescription>
              Connect with instructors from diverse geographical backgrounds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our instructor network spans multiple continents and time zones, providing learners with diverse 
              perspectives and scheduling flexibility. Instructors can specify their availability based on their local time.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Instructors from North America, Europe, Asia, and beyond</li>
              <li>Flexible scheduling across different time zones</li>
              <li>Cultural diversity in teaching approaches</li>
              <li>Local expertise in regional topics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Technical Requirements
            </CardTitle>
            <CardDescription>
              Minimal requirements for accessing the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our platform is designed to be accessible with minimal technical requirements, ensuring that learners 
              from various locations and with different device capabilities can participate.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">Internet Connection</p>
                  <p className="text-sm text-muted-foreground">Stable broadband or mobile data connection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">Modern Browser</p>
                  <p className="text-sm text-muted-foreground">Chrome, Firefox, Safari, or Edge (latest versions)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">Device</p>
                  <p className="text-sm text-muted-foreground">Desktop, laptop, tablet, or smartphone</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virtual Learning Environment</CardTitle>
            <CardDescription>
              Location-independent education for the modern learner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              By operating entirely online, we eliminate geographical barriers to quality education. Whether you're 
              in a major city or a remote area, you have equal access to our resources, instructors, and learning opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
