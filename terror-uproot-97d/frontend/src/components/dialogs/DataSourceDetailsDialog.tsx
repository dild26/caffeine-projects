import { useState } from 'react';
import { useVerifyDataSource, useDeleteDataSource, useIsCallerAdmin } from '../../hooks/useQueries';
import { DataSource } from '../../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface DataSourceDetailsDialogProps {
  dataSource: DataSource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DataSourceDetailsDialog({ dataSource, open, onOpenChange }: DataSourceDetailsDialogProps) {
  const { data: isAdmin } = useIsCallerAdmin();
  const verifySource = useVerifyDataSource();
  const deleteSource = useDeleteDataSource();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleVerify = async () => {
    try {
      await verifySource.mutateAsync(dataSource.id);
      toast.success('Data source verified');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify source');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSource.mutateAsync(dataSource.id);
      toast.success('Data source deleted');
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete source');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-xl">{dataSource.name}</DialogTitle>
                <DialogDescription className="mt-1">
                  {dataSource.sourceType}
                </DialogDescription>
              </div>
              {dataSource.verified ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <XCircle className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Verification Status</h4>
                <Badge variant={dataSource.verified ? 'default' : 'secondary'}>
                  {dataSource.verified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Last Updated</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(Number(dataSource.lastUpdated) / 1000000).toLocaleString()}
                </div>
              </div>
            </div>

            {!dataSource.verified && isAdmin && (
              <div className="rounded-lg border border-warning bg-warning/10 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Verification Required</p>
                    <p className="text-muted-foreground mt-1">
                      This data source requires admin verification before it can be used in reports and analytics.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isAdmin && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 sm:mr-auto"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {isAdmin && !dataSource.verified && (
              <Button onClick={handleVerify} disabled={verifySource.isPending} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                {verifySource.isPending ? 'Verifying...' : 'Verify Source'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Data Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this data source? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteSource.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

