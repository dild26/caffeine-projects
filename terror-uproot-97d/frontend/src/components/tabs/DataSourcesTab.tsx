import { useState } from 'react';
import { useGetDataSources, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import AddDataSourceDialog from '../dialogs/AddDataSourceDialog';
import DataSourceDetailsDialog from '../dialogs/DataSourceDetailsDialog';
import { DataSource } from '../../backend';
import { Skeleton } from '../ui/skeleton';

export default function DataSourcesTab() {
  const { data: dataSources, isLoading } = useGetDataSources();
  const { data: isAdmin } = useIsCallerAdmin();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

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
          <h3 className="text-2xl font-bold tracking-tight">Data Sources</h3>
          <p className="text-muted-foreground">
            Manage and verify public safety data sources
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Data Source
          </Button>
        )}
      </div>

      {!dataSources || dataSources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No data sources configured</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dataSources.map((source) => (
            <Card 
              key={source.id}
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => setSelectedSource(source)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  {source.verified ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <CardDescription>{source.sourceType}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={source.verified ? 'default' : 'secondary'}>
                    {source.verified ? 'Verified' : 'Pending'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(Number(source.lastUpdated) / 1000000).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddDialog && (
        <AddDataSourceDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
      )}

      {selectedSource && (
        <DataSourceDetailsDialog
          dataSource={selectedSource}
          open={!!selectedSource}
          onOpenChange={(open) => !open && setSelectedSource(null)}
        />
      )}
    </div>
  );
}

