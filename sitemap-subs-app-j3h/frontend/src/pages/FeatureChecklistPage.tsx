import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

export default function FeatureChecklistPage() {
  const features = [
    { name: 'Internet Identity Authentication', status: true, category: 'Authentication' },
    { name: 'Role-Based Access Control', status: true, category: 'Authentication' },
    { name: 'User Profile Management', status: true, category: 'User Management' },
    { name: 'XML Sitemap Import', status: true, category: 'Sitemap Management' },
    { name: 'Sitemap Search', status: true, category: 'Sitemap Management' },
    { name: 'Domain Filtering', status: true, category: 'Sitemap Management' },
    { name: 'Subscription System', status: true, category: 'Subscription' },
    { name: 'Stripe Payment Integration', status: true, category: 'Subscription' },
    { name: 'Tiered Access Levels', status: true, category: 'Subscription' },
    { name: 'Referral Program', status: true, category: 'Referral' },
    { name: 'Commission Tracking', status: true, category: 'Referral' },
    { name: 'Analytics Dashboard', status: true, category: 'Analytics' },
    { name: 'CPC Analytics', status: true, category: 'Analytics' },
    { name: 'Data Export', status: false, category: 'Analytics' },
    { name: 'Auto Backup', status: false, category: 'System' },
    { name: 'Version Management', status: false, category: 'System' },
    { name: 'Link Preview', status: false, category: 'Features' },
    { name: 'Internet Archive Integration', status: false, category: 'Features' },
    { name: 'Screenshot Fallback', status: false, category: 'Features' },
  ];

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Feature Checklist</h1>
          <p className="text-muted-foreground">
            Track implementation status of all platform features
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const categoryFeatures = features.filter(f => f.category === category);
            const completedCount = categoryFeatures.filter(f => f.status).length;
            const totalCount = categoryFeatures.length;
            const percentage = Math.round((completedCount / totalCount) * 100);

            return (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category}</CardTitle>
                      <CardDescription>
                        {completedCount} of {totalCount} features completed
                      </CardDescription>
                    </div>
                    <Badge variant={percentage === 100 ? 'default' : 'secondary'}>
                      {percentage}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryFeatures.map((feature) => (
                      <div 
                        key={feature.name}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium">{feature.name}</span>
                        {feature.status ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
