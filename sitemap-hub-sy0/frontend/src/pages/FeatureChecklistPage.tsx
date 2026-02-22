import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';

export default function FeatureChecklistPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate({ to: '/' });
    return null;
  }

  const features = [
    {
      category: 'Authentication & User Management',
      items: [
        { name: 'Internet Identity Integration', status: 'complete' },
        { name: 'Role-based Access Control (Admin/User)', status: 'complete' },
        { name: 'User Profile Management', status: 'complete' },
        { name: 'Profile Setup Modal', status: 'complete' },
      ],
    },
    {
      category: 'Subscription System',
      items: [
        { name: 'Three Tier Plans (Basic/Pro/Enterprise)', status: 'complete' },
        { name: 'Pay As You Use Option', status: 'complete' },
        { name: 'Stripe Payment Integration', status: 'complete' },
        { name: 'Payment Success/Failure Pages', status: 'complete' },
      ],
    },
    {
      category: 'Search Functionality',
      items: [
        { name: 'Dual Search Fields with Debouncing', status: 'complete' },
        { name: 'TLD Filtering with Real-time Counts', status: 'complete' },
        { name: 'Tiered Result Limits', status: 'complete' },
        { name: 'Enhanced Pagination', status: 'complete' },
      ],
    },
    {
      category: 'Admin Panel',
      items: [
        { name: 'Sitemap Upload (JSON/XML)', status: 'complete' },
        { name: 'Stripe Configuration', status: 'complete' },
        { name: 'Backup & Restore', status: 'complete' },
        { name: 'User Management', status: 'complete' },
      ],
    },
    {
      category: 'Referral System',
      items: [
        { name: 'Multi-level Referral Program', status: 'complete' },
        { name: 'Commission Tracking', status: 'complete' },
        { name: 'Real-time Analytics', status: 'complete' },
        { name: 'Export (CSV/JSON)', status: 'complete' },
      ],
    },
    {
      category: 'Link Preview',
      items: [
        { name: 'Secure Link Preview Modal', status: 'complete' },
        { name: 'Internet Archive Fallback', status: 'complete' },
        { name: 'Progressive Loading', status: 'complete' },
      ],
    },
    {
      category: 'UI/UX',
      items: [
        { name: 'Responsive Design', status: 'complete' },
        { name: 'Fixed Top/Bottom Navigation', status: 'complete' },
        { name: 'Collapsible Sidebar', status: 'complete' },
        { name: 'Theme Switching (Light/Dark)', status: 'complete' },
        { name: 'WCAG 2.1 AA Accessibility', status: 'complete' },
      ],
    },
    {
      category: 'Public Pages',
      items: [
        { name: "God's Eye Summary Page", status: 'complete' },
        { name: 'About Page', status: 'complete' },
        { name: 'Contact Page', status: 'complete' },
        { name: 'Feature Checklist Page', status: 'complete' },
      ],
    },
  ];

  const totalFeatures = features.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedFeatures = features.reduce(
    (sum, cat) => sum + cat.items.filter((item) => item.status === 'complete').length,
    0
  );
  const completionPercentage = Math.round((completedFeatures / totalFeatures) * 100);

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Checklist</h1>
          <p className="text-muted-foreground">Implementation tracking for all platform features</p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          {completionPercentage}% Complete
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {completedFeatures} of {totalFeatures} features implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {features.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-xl">{category.category}</CardTitle>
              <CardDescription>
                {category.items.filter((item) => item.status === 'complete').length} / {category.items.length}{' '}
                complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center gap-3">
                    {item.status === 'complete' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={item.status === 'complete' ? 'text-foreground' : 'text-muted-foreground'}>
                      {item.name}
                    </span>
                    {item.status === 'complete' && (
                      <Badge variant="secondary" className="ml-auto">
                        Done
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
