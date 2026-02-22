import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FixturesTab() {
  const { data: isAdmin = false } = useIsCallerAdmin();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Fixtures</CardTitle>
              <CardDescription>
                Organize unique templates into trackable pages with Merkle root verification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Fixture management features are currently being developed. This will allow you to organize templates
              into trackable pages with Merkle root verification for data integrity and audit traceability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {!isAdmin && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Admin Access Required</AlertTitle>
          <AlertDescription>
            Fixture management is only available to administrators.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
