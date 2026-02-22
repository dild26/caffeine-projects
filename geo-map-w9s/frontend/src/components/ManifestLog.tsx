import { useGetManifestLog } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

export default function ManifestLog() {
  const { data: logs, isLoading } = useGetManifestLog();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manifest Log
          </CardTitle>
          <CardDescription>No operations logged yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'pinPlacement':
        return 'default';
      case 'gridSnap':
        return 'secondary';
      case 'arcCreation':
        return 'outline';
      case 'radiusCreation':
        return 'outline';
      case 'polygonCreation':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Manifest Log ({logs.length})
        </CardTitle>
        <CardDescription>Append-only operation log with signatures</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <Badge variant={getOperationColor(log.operationType)}>
                    {log.operationType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>SRS: {log.srs}</div>
                  <div>Resolution: {log.resolution.toString()}</div>
                  <div className="truncate">Signature: {log.signature.substring(0, 20)}...</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
