import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Upload, Search, Calendar, TrendingUp, Shield, Zap, Hash, DollarSign, FileText, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
}

export default function FeaturesPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const features: Feature[] = [
    {
      id: 'menu-visibility',
      icon: Search,
      title: 'Public Menu Visibility',
      description: 'All menu links and sitemap pages are publicly accessible without requiring login.',
      details: ['No authentication required', 'Full navigation access', 'Public sitemap', 'Guest browsing enabled'],
    },
    {
      id: 'sitemap-pages',
      icon: FileText,
      title: 'Auto-Generated Sitemap Pages',
      description: 'All sitemap-related pages are automatically generated and populated with relevant content.',
      details: ['Dynamic content generation', 'Comprehensive page coverage', 'SEO-friendly structure', 'Automatic updates'],
    },
    {
      id: 'public-accessibility',
      icon: CheckCircle2,
      title: 'Public Accessibility',
      description: 'Most platform features are accessible to the public, with authentication only for admin functions.',
      details: ['Browse resources freely', 'View instructors', 'Access information pages', 'Admin-only restrictions'],
    },
    {
      id: 'theme-system',
      icon: Zap,
      title: 'Multi-Theme System',
      description: 'Three fully implemented themes (VIBGYOR, Dark, Light) with real-time switching and persistent preferences.',
      details: ['VIBGYOR theme', 'Dark mode', 'Light mode', 'Persistent preferences'],
    },
    {
      id: 'csv-management',
      icon: Upload,
      title: 'CSV Data Management',
      description: 'Upload and parse CSV files for resources, instructors, learners, and appointments. Support for JSON and MD formats.',
      details: ['Bulk data import', 'Automatic parsing', 'Multiple format support', 'Data validation'],
    },
    {
      id: 'fee-conversion',
      icon: DollarSign,
      title: 'Automatic Fee Conversion',
      description: 'Fees automatically converted from Rs to USD using the formula: Rs / 90 = USD.',
      details: ['Real-time conversion', 'Dual currency display', 'Transparent pricing', 'No manual calculation'],
    },
    {
      id: 'hashtag-search',
      icon: Hash,
      title: 'Hashtag Search',
      description: 'Powerful search functionality with hashtag support to find resources and instructors quickly.',
      details: ['Tag-based filtering', 'Multi-tag search', 'Instant results', 'Smart matching'],
    },
    {
      id: 'appointment-booking',
      icon: Calendar,
      title: 'Smart Appointment Booking',
      description: 'Book appointments with instructors using optimized scheduling with Merkle root nonce mechanism.',
      details: ['Time slot selection', 'Instructor availability', 'Booking optimization', 'Status tracking'],
    },
    {
      id: 'progress-tracking',
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor learner progress by topic, pace, language, and difficulty level with detailed analytics.',
      details: ['Topic-wise tracking', 'Pace monitoring', 'Language preferences', 'Difficulty levels'],
    },
    {
      id: 'admin-verification',
      icon: Shield,
      title: 'Admin Verification',
      description: 'Resource approval workflow with admin verification to ensure quality educational content.',
      details: ['Approval workflow', 'Quality control', 'Admin dashboard', 'Verification badges'],
    },
    {
      id: 'external-sync',
      icon: RefreshCw,
      title: 'External Content Sync',
      description: 'Daily/session-based synchronization with external content sources and change detection.',
      details: ['Automatic sync', 'Change detection', 'Local caching', 'Sync status indicators'],
    },
    {
      id: 'navigation-functionality',
      icon: Search,
      title: 'Advanced Navigation',
      description: 'Searchable navigation menu with keyword filtering across all menu items and complete A-to-Z index.',
      details: ['Keyword search', 'A-to-Z index', 'Category grouping', 'Real-time filtering'],
    },
  ];

  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Platform Features</h1>
        <p className="text-xl text-muted-foreground">
          Discover the powerful features that make E-Tutorial the ultimate educational resource management platform.
        </p>
      </div>

      {!isAuthenticated && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are viewing features as a guest. <Link to="/" className="underline font-medium">Login</Link> to access admin validation controls.
          </AlertDescription>
        </Alert>
      )}

      {isAuthenticated && !isAdmin && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin validation checkboxes are only available to administrators.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => {
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIdx) => (
                    <li key={detailIdx} className="flex items-center text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`ai-${feature.id}`}
                      checked={false}
                      disabled
                      className="cursor-not-allowed"
                    />
                    <Label
                      htmlFor={`ai-${feature.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      AI Validation (Coming Soon)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`admin-${feature.id}`}
                      checked={false}
                      disabled
                    />
                    <Label
                      htmlFor={`admin-${feature.id}`}
                      className="text-sm font-medium leading-none cursor-not-allowed opacity-70"
                    >
                      Admin Validation (Coming Soon)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
