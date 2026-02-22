import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from '@tanstack/react-router';
import { FileText, Home, Info, MessageSquare, Star, BarChart3, Mail, HelpCircle, Award, FileCheck } from 'lucide-react';

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Dashboard', path: '/', description: 'Main application dashboard with file management' },
        { name: 'About', path: '/about', description: 'Learn about Gateway Edge platform' },
        { name: 'Features', path: '/features', description: 'Explore platform capabilities and features' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with SECOINFI' },
      ],
    },
    {
      title: 'Information',
      icon: Info,
      links: [
        { name: 'FAQ', path: '/faq', description: 'Frequently asked questions' },
        { name: 'Compare', path: '/compare', description: 'Compare cloud storage providers' },
        { name: 'Pros', path: '/pros', description: 'Advantages of ICP Cloud Storage (Public)' },
        { name: 'Terms', path: '/terms', description: 'Terms and conditions (Public)' },
        { name: 'Sitemap', path: '/sitemap', description: 'Site navigation overview' },
      ],
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Sitemap
          </h1>
          <p className="text-lg text-muted-foreground">
            Navigate through all available pages and sections
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="group block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {link.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Need help navigating?</p>
              <p className="text-sm text-muted-foreground">
                Visit our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link> or{' '}
                <Link to="/contact" className="text-primary hover:underline">contact us</Link> for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
