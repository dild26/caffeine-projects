import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Compass, Menu, Search, Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function NavigationPage() {
  const navigationSections = [
    {
      title: 'Main Platform',
      links: [
        { to: '/', label: 'Home', description: 'Platform overview and quick access' },
        { to: '/dashboard', label: 'Dashboard', description: 'Personal learning dashboard' },
        { to: '/explore', label: 'Explore', description: 'Discover resources and instructors' },
        { to: '/resources', label: 'Resources', description: 'Browse educational materials' },
        { to: '/instructors', label: 'Instructors', description: 'Find and connect with instructors' },
        { to: '/appointments', label: 'Appointments', description: 'Manage your bookings' },
      ],
    },
    {
      title: 'Information Pages',
      links: [
        { to: '/about', label: 'About', description: 'Learn about our platform' },
        { to: '/features', label: 'Features', description: 'Platform capabilities' },
        { to: '/faq', label: 'FAQ', description: 'Frequently asked questions' },
        { to: '/blog', label: 'Blog', description: 'News and updates' },
        { to: '/contact', label: 'Contact', description: 'Get in touch' },
        { to: '/join-us', label: 'Join Us', description: 'Become part of our community' },
      ],
    },
    {
      title: 'Resources & Documentation',
      links: [
        { to: '/info', label: 'Info', description: 'Platform information' },
        { to: '/keywords', label: 'Keywords', description: 'Hashtag system guide' },
        { to: '/locations', label: 'Locations', description: 'Global accessibility' },
        { to: '/map', label: 'Map', description: 'Platform structure' },
        { to: '/notes', label: 'Notes', description: 'Important notices' },
        { to: '/objects', label: 'Objects', description: 'Data structures' },
      ],
    },
    {
      title: 'Technical & Design',
      links: [
        { to: '/permissions', label: 'Permissions', description: 'Access control system' },
        { to: '/queries', label: 'Queries', description: 'Search capabilities' },
        { to: '/responsive-design', label: 'Responsive Design', description: 'Multi-device support' },
        { to: '/ui-ux', label: 'UI/UX', description: 'Design principles' },
        { to: '/timestamp', label: 'Timestamp', description: 'Time tracking' },
        { to: '/values', label: 'Values', description: 'Our principles' },
      ],
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Compass className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Platform Navigation</h1>
        <p className="text-xl text-muted-foreground">
          Complete guide to navigating the E-Tutorial platform and accessing all features.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5 text-primary" />
              Navigation Structure
            </CardTitle>
            <CardDescription>
              Understanding the platform's organization and menu system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The E-Tutorial platform is organized into logical sections accessible through the main navigation menu. 
              The header provides quick access to primary features, while the "More" dropdown contains additional pages.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <Home className="h-5 w-5 text-primary mb-2" />
                <h4 className="font-semibold mb-2">Logo Navigation</h4>
                <p className="text-sm text-muted-foreground">
                  Click the E-Tutorial logo in the header to return to the home page from anywhere.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <Search className="h-5 w-5 text-primary mb-2" />
                <h4 className="font-semibold mb-2">Search Features</h4>
                <p className="text-sm text-muted-foreground">
                  Use hashtag search to quickly find resources and instructors across the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {navigationSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>
                {section.links.length} pages in this section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
                    <div className="flex-1">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{link.label}</p>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Mobile Navigation</CardTitle>
            <CardDescription>
              Accessing the platform on mobile devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              On mobile devices, the navigation menu is accessible through the hamburger menu icon in the top right corner. 
              This provides a full-screen menu with all navigation options organized for easy access.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Tap the menu icon to open the navigation drawer</li>
              <li>Scroll through all available pages</li>
              <li>Tap any link to navigate to that page</li>
              <li>The menu automatically closes after selection</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
