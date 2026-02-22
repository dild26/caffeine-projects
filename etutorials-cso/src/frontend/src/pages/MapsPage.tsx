import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Map, Navigation, Layers, MapPin, Globe, Compass } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function MapsPage() {
  const mapSections = [
    {
      title: 'Platform Structure',
      icon: Layers,
      description: 'Hierarchical organization of platform components',
      items: [
        'Main Platform (Home, Dashboard, Explore)',
        'Learning Resources (Resources, Instructors, Appointments)',
        'Information Pages (About, Features, FAQ, Blog, Contact)',
        'Documentation (Info, Keywords, Locations, Navigation, Sitemap)',
        'Technical Pages (Design, Permissions, Queries, UI/UX)',
      ],
    },
    {
      title: 'Navigation Flow',
      icon: Navigation,
      description: 'User journey through the platform',
      items: [
        'Entry Point: Home Page',
        'Discovery: Explore & Search',
        'Selection: Resources & Instructors',
        'Action: Booking & Appointments',
        'Management: Dashboard & Progress',
      ],
    },
    {
      title: 'Data Flow',
      icon: Compass,
      description: 'How information moves through the system',
      items: [
        'CSV Upload → Backend Storage',
        'Resource Verification → Admin Approval',
        'Hashtag Search → Filtered Results',
        'Appointment Booking → Schedule Management',
        'Progress Tracking → Analytics Dashboard',
      ],
    },
    {
      title: 'Geographic Coverage',
      icon: Globe,
      description: 'Global accessibility and regional support',
      items: [
        'Americas: North & South America',
        'EMEA: Europe, Middle East, Africa',
        'APAC: Asia Pacific Region',
        'Online Platform: Worldwide Access',
        'Multi-language Support',
      ],
    },
  ];

  const keyLocations = [
    { name: 'Home', path: '/', type: 'Main' },
    { name: 'Dashboard', path: '/dashboard', type: 'Main' },
    { name: 'Resources', path: '/resources', type: 'Learning' },
    { name: 'Instructors', path: '/instructors', type: 'Learning' },
    { name: 'Appointments', path: '/appointments', type: 'Learning' },
    { name: 'About', path: '/about', type: 'Info' },
    { name: 'Features', path: '/features', type: 'Info' },
    { name: 'Contact', path: '/contact', type: 'Info' },
    { name: 'Sitemap', path: '/sitemap', type: 'Docs' },
    { name: 'Admin', path: '/admin', type: 'Technical' },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Map className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Platform Maps</h1>
        <p className="text-xl text-muted-foreground">
          Visual representation of platform structure, navigation flow, and data organization.
        </p>
      </div>

      {/* Map Sections */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {mapSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Locations */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Key Locations</CardTitle>
              <CardDescription>
                Quick reference to important pages and their paths
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {keyLocations.map((location) => (
              <div
                key={location.path}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{location.name}</p>
                  <p className="text-xs text-muted-foreground">{location.path}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {location.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Map Placeholder */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Interactive Platform Map</CardTitle>
          <CardDescription>
            Visual representation of the complete platform structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <Map className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Interactive map visualization coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tips */}
      <Card className="max-w-4xl mx-auto bg-primary/5">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-bold text-center">Navigation Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Quick Access</h4>
              <p className="text-sm text-muted-foreground">
                Use the search menu (magnifying glass icon) to quickly find any page
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Breadcrumbs</h4>
              <p className="text-sm text-muted-foreground">
                Follow the navigation path to understand your current location
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Sitemap</h4>
              <p className="text-sm text-muted-foreground">
                Visit the sitemap page for a complete overview of all pages
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Categories</h4>
              <p className="text-sm text-muted-foreground">
                Pages are organized by category: Main, Learning, Info, Docs, Technical
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
