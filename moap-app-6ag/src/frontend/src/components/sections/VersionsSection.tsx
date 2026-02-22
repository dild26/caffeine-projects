import { useGetVersions, useGetMigrations } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Database, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function VersionsSection() {
  const { data: versions, isLoading: isLoadingVersions } = useGetVersions();
  const { data: migrations, isLoading: isLoadingMigrations } = useGetMigrations();

  const isLoading = isLoadingVersions || isLoadingMigrations;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <strong>Versions:</strong> This section tracks version history, schema migrations, and incremental updates linked to spec evolution. 
            Version data is loaded from the versions and migrations sections in spec.yaml.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const versionHistory = versions?.versionHistory || [];
  const migrationHistory = migrations?.migrationHistory || [];

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-foreground/80">
          <strong>Versions:</strong> This section tracks version history, schema migrations, and incremental updates linked to spec evolution. 
          Version data is loaded from the versions and migrations sections in spec.yaml.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Version & Migration History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="versions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="versions">
                <Clock className="h-4 w-4 mr-2" />
                Version History
              </TabsTrigger>
              <TabsTrigger value="migrations">
                <Database className="h-4 w-4 mr-2" />
                Migrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="versions" className="mt-6">
              {versionHistory.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No version history available. Version tracking can be enabled in the spec.yaml or spec.json configuration file 
                    under the "versions" section to track changes over time.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {versionHistory.map((version) => (
                    <div key={Number(version.version)} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-lg">
                            v{Number(version.version)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(version.timestamp)}
                          </span>
                        </div>
                        <Badge>{version.changes?.length || 0} changes</Badge>
                      </div>

                      {version.changes && version.changes.length > 0 && (
                        <div className="space-y-2">
                          {version.changes.map((change, idx) => (
                            <div key={idx} className="bg-muted/50 rounded p-3 text-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {change.changeType}
                                </Badge>
                                <span className="font-medium">{change.field}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Before:</span>
                                  <div className="mt-1 font-mono bg-background p-2 rounded">
                                    {change.oldValue || '(empty)'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">After:</span>
                                  <div className="mt-1 font-mono bg-background p-2 rounded">
                                    {change.newValue || '(empty)'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="migrations" className="mt-6">
              {migrationHistory.length === 0 ? (
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    No migration history available. Migration tracking can be enabled in the spec.yaml or spec.json configuration file 
                    under the "migrations" section to track schema changes and data migrations.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {migrationHistory.map((migration) => (
                    <div key={migration.migrationId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{migration.migrationId}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(migration.timestamp)}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {migration.affectedFields?.length || 0} fields
                        </Badge>
                      </div>

                      <p className="text-sm mb-3">{migration.description}</p>

                      {migration.affectedFields && migration.affectedFields.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {migration.affectedFields.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
