import { useState } from 'react';
import { useGetReports, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, FileText, Clock, User } from 'lucide-react';
import CreateReportDialog from '../dialogs/CreateReportDialog';
import ReportDetailsDialog from '../dialogs/ReportDetailsDialog';
import { Report } from '../../backend';
import { Skeleton } from '../ui/skeleton';

export default function ReportsTab() {
  const { data: reports, isLoading } = useGetReports();
  const { data: userProfile } = useGetCallerUserProfile();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Research Reports</h3>
          <p className="text-muted-foreground">
            Create and view analytical reports for policy planning
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Report
        </Button>
      </div>

      {!reports || reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No reports available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card 
              key={report.id}
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => setSelectedReport(report)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(Number(report.created) / 1000000).toLocaleDateString()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {report.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateDialog && (
        <CreateReportDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog} 
        />
      )}

      {selectedReport && (
        <ReportDetailsDialog
          report={selectedReport}
          open={!!selectedReport}
          onOpenChange={(open) => !open && setSelectedReport(null)}
        />
      )}
    </div>
  );
}

