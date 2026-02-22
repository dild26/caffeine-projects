import { useState } from 'react';
import { useGetIncidents, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, MapPin, Clock, AlertTriangle } from 'lucide-react';
import AddIncidentDialog from '../dialogs/AddIncidentDialog';
import IncidentDetailsDialog from '../dialogs/IncidentDetailsDialog';
import { Incident } from '../../backend';
import { Skeleton } from '../ui/skeleton';

export default function IncidentsTab() {
  const { data: incidents, isLoading } = useGetIncidents();
  const { data: isAdmin } = useIsCallerAdmin();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const getSeverityColor = (severity: bigint) => {
    const sev = Number(severity);
    if (sev >= 8) return 'destructive';
    if (sev >= 5) return 'default';
    return 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'destructive';
      case 'monitoring':
        return 'default';
      case 'resolved':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Active Incidents</h3>
          <p className="text-muted-foreground">
            Monitor and manage security incidents in real-time
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Incident
          </Button>
        )}
      </div>

      {!incidents || incidents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No incidents reported</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <Card 
              key={incident.id} 
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => setSelectedIncident(incident)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{incident.incidentType}</CardTitle>
                  <Badge variant={getSeverityColor(incident.severity)}>
                    Severity {Number(incident.severity)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {incident.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {incident.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(Number(incident.timestamp) / 1000000).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddDialog && (
        <AddIncidentDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
      )}

      {selectedIncident && (
        <IncidentDetailsDialog
          incident={selectedIncident}
          open={!!selectedIncident}
          onOpenChange={(open) => !open && setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

