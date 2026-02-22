import { useGetAuditLogs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

export default function AuditLogViewer() {
  const { data: logs = [], isLoading } = useGetAuditLogs();

  const sortedLogs = [...logs].sort((a, b) => Number(b.timestamp - a.timestamp));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Audit Logs</h2>
        <p className="text-muted-foreground mt-1">Complete audit trail of all system activities</p>
      </div>

      {sortedLogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <History className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No audit logs</h3>
            <p className="text-muted-foreground text-center">System activities will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
            <CardDescription>{sortedLogs.length} total events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Timestamp</TableHead>
                    <TableHead className="font-bold">Event Type</TableHead>
                    <TableHead className="font-bold">Target ID</TableHead>
                    <TableHead className="font-bold">User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.map((log) => (
                    <TableRow key={log.id.toString()}>
                      <TableCell className="font-mono text-xs">
                        {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.eventType}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.targetId}</TableCell>
                      <TableCell className="font-mono text-xs">{log.user.toString().slice(0, 16)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
