import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RefreshCcw, Database, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useEvaluateModel } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminTab() {
  const evaluateMutation = useEvaluateModel();

  const handleGlobalRefresh = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Refreshing evaluation cache...',
      success: 'Global cache refresh complete',
      error: 'Failed to refresh cache'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Cache Management
            </CardTitle>
            <CardDescription>Manually trigger refreshes or version snapshotting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-bold">Standard Refresh</div>
                <div className="text-xs text-muted-foreground">Trigger weekly update cycle now.</div>
              </div>
              <Button onClick={handleGlobalRefresh} size="sm" variant="outline" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-bold">Hard Snapshot</div>
                <div className="text-xs text-muted-foreground">Store current scores as v2.5.1-Stable</div>
              </div>
              <Button size="sm" variant="outline">Snapshot</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Evaluation Control
            </CardTitle>
            <CardDescription>Control the arbiter and scoring agents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-l-4 border-l-amber-500">
              <div className="pr-4">
                <div className="text-sm font-bold">Global Re-evaluation</div>
                <div className="text-xs text-muted-foreground">Recalculate scores for all models across dimensions.</div>
              </div>
              <Button onClick={() => evaluateMutation.mutate(1n)} disabled={evaluateMutation.isPending} size="sm" className="bg-amber-600 hover:bg-amber-700">
                {evaluateMutation.isPending ? 'Running...' : 'Trigger Cycle'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-bold">Webhook Integrity</div>
                <div className="text-xs text-muted-foreground">Verify push-event signatures.</div>
              </div>
              <Button size="sm" variant="outline">Verify</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Overrides
          </CardTitle>
          <CardDescription>High-risk operations that affect public leaderboards.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="destructive" size="sm">Purge All Snapshots</Button>
          <Button variant="outline" size="sm">Reset arbiter weights</Button>
        </CardContent>
      </Card>
    </div>
  );
}
