import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useGetFeatureReports } from '../hooks/useQueries';

function FeatureValidationPageContent() {
  const { data: features } = useGetFeatureReports();

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Feature Validation</h1>
            <p className="text-lg text-muted-foreground">
              Admin interface for feature validation and leaderboard management
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feature Leaderboard</CardTitle>
            <CardDescription>
              Binary auto/manual validation system with admin promotion capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {features && features.length > 0 ? (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{feature.featureName}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      {feature.implemented ? (
                        <span className="text-xs text-green-600">Implemented</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No features to validate</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function FeatureValidationPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <FeatureValidationPageContent />
    </ProtectedRoute>
  );
}
