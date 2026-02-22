import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Map, Home, Users, BookOpen, Calendar, Settings, Info, FileText, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetAllNavigationItemsSorted, useValidateNavigationAndThemes, useGetSitemapItems } from '../hooks/useQueries';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';

export default function SitemapPage() {
  const { data: navigationItems, isLoading, error } = useGetAllNavigationItemsSorted();
  const { data: sitemapItems } = useGetSitemapItems();
  const { data: isValid } = useValidateNavigationAndThemes();

  const sitemapSections = [
    {
      title: 'Main Platform',
      icon: Home,
      pages: [
        { to: '/', label: 'Home', description: 'Platform homepage and overview' },
        { to: '/dashboard', label: 'Dashboard', description: 'Personal learning dashboard' },
        { to: '/explore', label: 'Explore', description: 'Discover resources and instructors' },
      ],
    },
    {
      title: 'Learning Resources',
      icon: BookOpen,
      pages: [
        { to: '/resources', label: 'Resources', description: 'Browse educational materials' },
        { to: '/instructors', label: 'Instructors', description: 'Find and connect with instructors' },
        { to: '/appointments', label: 'Appointments', description: 'Manage your bookings' },
      ],
    },
    {
      title: 'Information',
      icon: Info,
      pages: [
        { to: '/about', label: 'About', description: 'Learn about our platform' },
        { to: '/features', label: 'Features', description: 'Platform capabilities' },
        { to: '/faq', label: 'FAQ', description: 'Frequently asked questions' },
        { to: '/blogs', label: 'Blog', description: 'News and updates' },
        { to: '/contact', label: 'Contact', description: 'Get in touch' },
        { to: '/join-us', label: 'Join Us', description: 'Become part of our community' },
        { to: '/values', label: 'Values', description: 'Our core principles' },
      ],
    },
    {
      title: 'Documentation',
      icon: FileText,
      pages: [
        { to: '/info', label: 'Info', description: 'Platform information' },
        { to: '/keywords', label: 'Keywords', description: 'Hashtag system guide' },
        { to: '/locations', label: 'Locations', description: 'Global accessibility' },
        { to: '/maps', label: 'Maps', description: 'Platform structure' },
        { to: '/geo-map', label: 'Geo Map', description: 'Geographic locations' },
        { to: '/navigation', label: 'Navigation', description: 'Navigation guide' },
        { to: '/sitemap', label: 'Sitemap', description: 'This page' },
      ],
    },
    {
      title: 'Technical',
      icon: Settings,
      pages: [
        { to: '/design', label: 'Design', description: 'Design system and guidelines' },
        { to: '/permissions', label: 'Permissions', description: 'Access control system' },
        { to: '/queries', label: 'Queries', description: 'Search capabilities' },
        { to: '/responsive-design', label: 'Responsive Design', description: 'Multi-device support' },
        { to: '/timestamp', label: 'Timestamp', description: 'Time tracking' },
        { to: '/ui-ux', label: 'UI/UX', description: 'Design principles' },
        { to: '/what-why-when-where-who', label: '5W Framework', description: 'What, Why, When, Where, Who' },
        { to: '/admin', label: 'Admin', description: 'Administration panel' },
      ],
    },
  ];

  const totalPages = sitemapSections.reduce((sum, section) => sum + section.pages.length, 0);

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Map className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Sitemap</h1>
        <p className="text-xl text-muted-foreground">
          Complete overview of all pages and sections on the E-Tutorial platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Structure</CardTitle>
            <CardDescription>
              Organized navigation of all {totalPages} available pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This sitemap provides a comprehensive overview of the E-Tutorial platform's structure. Use it to 
              quickly navigate to any page or understand how the platform is organized.
            </p>
          </CardContent>
        </Card>

        {isValid === false && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Navigation validation failed. Some items may be missing. Please contact support.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load navigation items from backend. Showing default sitemap structure.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {navigationItems && navigationItems.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Backend Navigation Items</CardTitle>
                      <CardDescription>
                        Synchronized from backend database
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {navigationItems.length} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.url}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">
                              {item.navLabel}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.url}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {sitemapSections.map((section) => {
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
                        <CardDescription>
                          {section.pages.length} page{section.pages.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.pages.map((page) => (
                        <Link
                          key={page.to}
                          to={page.to}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
                          <div className="flex-1">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">{page.label}</p>
                            <p className="text-sm text-muted-foreground">{page.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Most frequently accessed pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Link to="/dashboard" className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <h4 className="font-semibold mb-1">Dashboard</h4>
                <p className="text-sm text-muted-foreground">Your personal learning hub</p>
              </Link>
              <Link to="/explore" className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <h4 className="font-semibold mb-1">Explore</h4>
                <p className="text-sm text-muted-foreground">Discover new content</p>
              </Link>
              <Link to="/resources" className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <h4 className="font-semibold mb-1">Resources</h4>
                <p className="text-sm text-muted-foreground">Browse materials</p>
              </Link>
              <Link to="/contact" className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <h4 className="font-semibold mb-1">Contact</h4>
                <p className="text-sm text-muted-foreground">Get in touch</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
