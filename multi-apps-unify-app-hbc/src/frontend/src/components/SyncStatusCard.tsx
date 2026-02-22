import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { CheckCircle2, Clock } from 'lucide-react';
import type { SyncLog } from '../backend';

interface SyncStatusCardProps {
  syncStatus?: {
    status: string;
    history: Array<SyncLog>;
    lastSyncTime: bigint;
  };
  isLoading: boolean;
}

export default function SyncStatusCard({ syncStatus, isLoading }: SyncStatusCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Synchronization Status</CardTitle>
          <CardDescription>Current sync state</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: bigint) => {
    if (timestamp === BigInt(0)) return 'Never';
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const isSuccess = syncStatus?.status === 'Success';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synchronization Status</CardTitle>
        <CardDescription>Current sync state and history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-medium">Status:</span>
          </div>
          <Badge variant={isSuccess ? 'default' : 'secondary'}>
            {syncStatus?.status || 'Unknown'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Last Sync:</span>
          <span className="text-sm text-muted-foreground">
            {syncStatus ? formatTimestamp(syncStatus.lastSyncTime) : 'Never'}
          </span>
        </div>
        {syncStatus && syncStatus.history.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-sm font-medium">Recent History</p>
            <div className="space-y-2">
              {syncStatus.history.slice(-3).reverse().map((log, index) => (
                <div key={index} className="flex items-start justify-between text-xs">
                  <span className="text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                  <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="text-xs">
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
