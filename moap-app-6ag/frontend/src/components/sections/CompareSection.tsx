import { useGetCompareMatrix, useGetApps } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function CompareSection() {
  const { data: compareMatrix, isLoading: isLoadingMatrix } = useGetCompareMatrix();
  const { data: apps, isLoading: isLoadingApps } = useGetApps(false);

  const isLoading = isLoadingMatrix || isLoadingApps;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <strong>Compare:</strong> This section offers feature-by-feature comparison across apps for analytical insights. 
            Features are defined in the spec.yaml features section and matched against app capabilities.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const comparisons = compareMatrix?.comparisons || [];
  const appsList = apps || [];

  // Extract unique features
  const features = Array.from(new Set(comparisons.map((c) => c.featureId)));

  // If no comparisons, show info message
  if (comparisons.length === 0 || features.length === 0) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <strong>Compare:</strong> This section offers feature-by-feature comparison across apps for analytical insights. 
            Features are defined in the spec.yaml features section and matched against app capabilities.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No feature comparison data available. Features can be defined in the spec.yaml or spec.json configuration file 
                under the "features" section to enable comparison across applications.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-foreground/80">
          <strong>Compare:</strong> This section offers feature-by-feature comparison across apps for analytical insights. 
          Features are defined in the spec.yaml features section and matched against app capabilities.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Application</TableHead>
                  {features.map((feature) => (
                    <TableHead key={feature} className="text-center min-w-[120px]">
                      {feature}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {appsList.map((app) => {
                  const appComparisons = comparisons.filter((c) => c.appId === app.id);

                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      {features.map((feature) => {
                        const comparison = appComparisons.find((c) => c.featureId === feature);
                        const supported = comparison?.supported || false;

                        return (
                          <TableCell key={feature} className="text-center">
                            {supported ? (
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
