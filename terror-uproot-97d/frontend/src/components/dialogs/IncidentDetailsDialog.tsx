import { useState } from 'react';
import { useUpdateIncidentStatus, useDeleteIncident, useIsCallerAdmin } from '../../hooks/useQueries';
import { Incident } from '../../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { MapPin, Clock, AlertTriangle, Trash2 } from 'lucide-react';
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

interface IncidentDetailsDialogProps {
  incident: Incident;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function IncidentDetailsDialog({ incident, open, onOpenChange }: IncidentDetailsDialogProps) {
  const { data: isAdmin } = useIsCallerAdmin();
  const updateStatus = useUpdateIncidentStatus();
  const deleteIncident = useDeleteIncident();
  const [newStatus, setNewStatus] = useState(incident.status);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getSeverityColor = (severity: bigint) => {
    const sev = Number(severity);
    if (sev >= 8) return 'destructive';
    if (sev >= 5) return 'default';
    return 'secondary';
  };

  const handleUpdateStatus = async () => {
    if (newStatus === incident.status) {
      toast.info('Status unchanged');
      return;
    }

    try {
      await updateStatus.mutateAsync({ id: incident.id, status: newStatus });
      toast.success('Incident status updated');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIncident.mutateAsync(incident.id);
      toast.success('Incident deleted');
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete incident');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-xl">{incident.incidentType}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {incident.location}
                </DialogDescription>
              </div>
              <Badge variant={getSeverityColor(incident.severity)}>
                Severity {Number(incident.severity)}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{incident.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <Badge variant="outline">{incident.status}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Reported</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(Number(incident.timestamp) / 1000000).toLocaleString()}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="status-update">Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status-update">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
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
            {isAdmin && (
              <Button onClick={handleUpdateStatus} disabled={updateStatus.isPending}>
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Incident</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this incident? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteIncident.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

