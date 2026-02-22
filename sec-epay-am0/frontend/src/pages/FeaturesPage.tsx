import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useGetAllFeatureStatuses, useUpdateFeatureStatus, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { CheckCircle2, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

const FEATURES = [
  { name: 'User Registration & Authentication', category: 'Core' },
  { name: 'QRC Payment System', category: 'Payments' },
  { name: 'Transaction Engine', category: 'Core' },
  { name: 'Multi-level Transaction Processing', category: 'Core' },
  { name: 'Subscription Management', category: 'Features' },
  { name: 'Leaderboard System', category: 'Features' },
  { name: 'Calculation Tools', category: 'Tools' },
  { name: 'Admin Dashboard', category: 'Admin' },
  { name: 'User Approval System', category: 'Admin' },
  { name: 'Contact Page', category: 'Pages' },
  { name: 'Features Status Page', category: 'Pages' },
  { name: 'Main Form Configuration', category: 'Admin' },
  { name: 'Currency Conversion', category: 'Payments' },
  { name: 'Merkle Root Generation', category: 'Security' },
  { name: 'Transaction Audit Trail', category: 'Security' },
];

export default function FeaturesPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: featureStatuses = [], isLoading } = useGetAllFeatureStatuses();
  const updateFeature = useUpdateFeatureStatus();

  const handleCompletionToggle = async (featureName: string, currentValue: boolean) => {
    if (!isAdmin) {
      toast.error('Only admins can update feature status');
      return;
    }

    try {
      const existingFeature = featureStatuses.find(f => f.featureName === featureName);
      await updateFeature.mutateAsync({
        featureName,
        isCompleted: !currentValue,
        isAdminValidated: existingFeature?.isAdminValidated || false,
      });
      toast.success(`Feature "${featureName}" marked as ${!currentValue ? 'completed' : 'incomplete'}`);
    } catch (error) {
      toast.error('Failed to update feature status');
      console.error(error);
    }
  };

  const handleValidationToggle = async (featureName: string, currentValue: boolean) => {
    if (!isAdmin) {
      toast.error('Only admins can validate features');
      return;
    }

    try {
      const existingFeature = featureStatuses.find(f => f.featureName === featureName);
      await updateFeature.mutateAsync({
        featureName,
        isCompleted: existingFeature?.isCompleted || false,
        isAdminValidated: !currentValue,
      });
      toast.success(`Feature "${featureName}" ${!currentValue ? 'validated' : 'validation removed'}`);
    } catch (error) {
      toast.error('Failed to update validation status');
      console.error(error);
    }
  };

  const getFeatureStatus = (featureName: string) => {
    return featureStatuses.find(f => f.featureName === featureName);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const categories = Array.from(new Set(FEATURES.map(f => f.category)));

  const completedCount = FEATURES.filter(f => getFeatureStatus(f.name)?.isCompleted).length;
  const validatedCount = FEATURES.filter(f => getFeatureStatus(f.name)?.isAdminValidated).length;
  const progressPercentage = Math.round((completedCount / FEATURES.length) * 100);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Features Status</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Track the development progress of Secoinfi ePay features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{FEATURES.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{completedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">{progressPercentage}% complete</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Admin Validated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-1">{validatedCount}</div>
              </CardContent>
            </Card>
          </div>

          {!identity && (
            <Card className="mb-6 border-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Login as an admin to update feature statuses
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {categories.map(category => {
            const categoryFeatures = FEATURES.filter(f => f.category === category);
            const categoryCompleted = categoryFeatures.filter(f => getFeatureStatus(f.name)?.isCompleted).length;

            return (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category}</CardTitle>
                      <CardDescription>
                        {categoryCompleted} of {categoryFeatures.length} completed
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {Math.round((categoryCompleted / categoryFeatures.length) * 100)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryFeatures.map(feature => {
                      const status = getFeatureStatus(feature.name);
                      const isCompleted = status?.isCompleted || false;
                      const isValidated = status?.isAdminValidated || false;

                      return (
                        <div key={feature.name} className="flex items-start space-x-4 p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`complete-${feature.name}`}
                                checked={isCompleted}
                                onCheckedChange={() => handleCompletionToggle(feature.name, isCompleted)}
                                disabled={!isAdmin || updateFeature.isPending}
                              />
                              <label
                                htmlFor={`complete-${feature.name}`}
                                className={`text-sm font-medium cursor-pointer ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {feature.name}
                              </label>
                            </div>
                            {isCompleted && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </div>

                          <div className="flex items-center space-x-3">
                            {isAdmin && (
                              <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <Checkbox
                                  id={`validate-${feature.name}`}
                                  checked={isValidated}
                                  onCheckedChange={() => handleValidationToggle(feature.name, isValidated)}
                                  disabled={updateFeature.isPending}
                                />
                                <label
                                  htmlFor={`validate-${feature.name}`}
                                  className="text-xs text-muted-foreground cursor-pointer"
                                >
                                  Admin
                                </label>
                              </div>
                            )}
                            {status && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimestamp(status.lastUpdated)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
