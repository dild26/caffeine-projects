import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Platform Map</h1>
        <p className="text-xl text-muted-foreground">
          Navigate through the E-Tutorial platform features and pages.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Dashboard</CardTitle>
            <CardDescription>Overview of your activity and quick actions</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Explore</CardTitle>
            <CardDescription>Search resources and instructors with hashtags</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Resources</CardTitle>
            <CardDescription>Browse educational resources by category</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Instructors</CardTitle>
            <CardDescription>View instructor profiles and availability</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Appointments</CardTitle>
            <CardDescription>Book and manage your sessions</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Admin Panel</CardTitle>
            <CardDescription>Manage platform data and approvals</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">About</CardTitle>
            <CardDescription>Learn about the platform mission</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Features</CardTitle>
            <CardDescription>Explore all platform capabilities</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">FAQ</CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Contact</CardTitle>
            <CardDescription>Get in touch with support</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Blog</CardTitle>
            <CardDescription>Read latest news and updates</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Join Us</CardTitle>
            <CardDescription>Become part of the community</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Platform Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Core Features</h4>
              <p className="text-muted-foreground">
                Dashboard, Explore, Resources, Instructors, Appointments, Admin Panel
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Information Pages</h4>
              <p className="text-muted-foreground">
                About, Features, FAQ, Contact, Blog, Join Us, Map
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User Management</h4>
              <p className="text-muted-foreground">
                Profile setup, Role-based access, Internet Identity authentication
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
