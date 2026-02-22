import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AnalyticsTab() {
  const { data: isAdmin = false } = useIsCallerAdmin();

  if (!isAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Admin Access Required</AlertTitle>
        <AlertDescription>
          Analytics and provenance tracking are only available to administrators.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Data provenance and ingestion tracking</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Analytics features including provenance records and ingestion logs are currently being developed.
              These features will provide Merkle tree-based tracking for data integrity and traceability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
