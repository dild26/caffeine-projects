import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useGetJsonErrors, useGetJsonErrorReport } from '../hooks/useQueries';

function ErrorRecoveryPageContent() {
  const { data: errors } = useGetJsonErrors();
  const { data: report } = useGetJsonErrorReport();

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Error Recovery</h1>
            <p className="text-lg text-muted-foreground">
              JSON error recovery dashboard with learning system
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Errors</CardTitle>
              <CardDescription>All recorded errors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{report ? Number(report.totalErrors) : 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unresolved</CardTitle>
              <CardDescription>Errors pending resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">
                {report ? Number(report.unresolvedErrors) : 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Types</CardTitle>
              <CardDescription>Unique error categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{report?.errorTypes.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Logs</CardTitle>
            <CardDescription>Recent JSON parsing errors with recovery suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            {errors && errors.length > 0 ? (
              <div className="space-y-4">
                {errors.slice(0, 10).map((error, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{error.errorType}</p>
                        <p className="text-sm text-muted-foreground">{error.message}</p>
                        {error.file && (
                          <p className="text-xs text-muted-foreground">File: {error.file}</p>
                        )}
                      </div>
                      {error.resolved ? (
                        <span className="text-xs text-green-600">Resolved</span>
                      ) : (
                        <span className="text-xs text-destructive">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No errors recorded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ErrorRecoveryPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <ErrorRecoveryPageContent />
    </ProtectedRoute>
  );
}
