import { useManualSync, useCleanDuplicates } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';

export default function AdminControls() {
  const manualSync = useManualSync();
  const cleanDuplicates = useCleanDuplicates();

  const handleSync = () => {
    manualSync.mutate();
  };

  const handleCleanDuplicates = () => {
    cleanDuplicates.mutate();
  };

  const isAnyOperationPending = manualSync.isPending || cleanDuplicates.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synchronization Controls</CardTitle>
        <CardDescription>Manually trigger synchronization and cleanup operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleSync}
          disabled={isAnyOperationPending}
          className="w-full"
          size="lg"
        >
          <RefreshCw className={`mr-2 h-5 w-5 ${manualSync.isPending ? 'animate-spin' : ''}`} />
          {manualSync.isPending ? 'Synchronizing...' : 'Manual Sync'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Click to manually synchronize spec.yaml to spec.md. Automatic sync occurs on every spec.yaml update.
        </p>

        <div className="pt-2">
          <Button
            onClick={handleCleanDuplicates}
            disabled={isAnyOperationPending}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Trash2 className={`mr-2 h-5 w-5 ${cleanDuplicates.isPending ? 'animate-spin' : ''}`} />
            {cleanDuplicates.isPending ? 'Cleaning...' : 'Clean Duplicates'}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Remove duplicate entries from spec.md and regenerate with unique Secoinfi-Apps and sections only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
