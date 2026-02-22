import { useState } from 'react';
import { useGetYamlConfigs, useGetLatestYamlConfig, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, FileCode, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AddYamlConfigDialog from '../dialogs/AddYamlConfigDialog';
import YamlConfigDetailsDialog from '../dialogs/YamlConfigDetailsDialog';
import type { YamlConfig } from '../../backend';

export default function ConfigTab() {
  const { data: configs, isLoading: configsLoading } = useGetYamlConfigs();
  const { data: latestConfig, isLoading: latestLoading } = useGetLatestYamlConfig();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<YamlConfig | null>(null);

  if (configsLoading || latestLoading || adminLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const sortedConfigs = [...(configs || [])].sort((a, b) => Number(b.version) - Number(a.version));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">YAML Configuration Management</h3>
          <p className="text-muted-foreground">
            Manage application configuration through YAML specifications
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Configuration
          </Button>
        )}
      </div>

      {latestConfig && (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Active Configuration:</strong> Version {latestConfig.version.toString()}
                <span className="ml-2 text-xs text-muted-foreground">
                  Updated {new Date(Number(latestConfig.timestamp) / 1000000).toLocaleString()}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedConfig(latestConfig)}
              >
                View Details
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!latestConfig && configs && configs.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No YAML configurations found. {isAdmin && 'Add your first configuration to get started.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedConfigs.map((config) => {
          const isLatest = latestConfig && config.version === latestConfig.version;
          const timestamp = new Date(Number(config.timestamp) / 1000000);
          const preview = config.content.split('\n').slice(0, 5).join('\n');

          return (
            <Card
              key={config.version.toString()}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isLatest ? 'border-primary ring-1 ring-primary/20' : ''
              }`}
              onClick={() => setSelectedConfig(config)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Version {config.version.toString()}</CardTitle>
                  </div>
                  {isLatest && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {timestamp.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3">
                  <pre className="overflow-hidden text-ellipsis text-xs text-muted-foreground">
                    {preview}
                    {config.content.split('\n').length > 5 && '\n...'}
                  </pre>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {config.content.split('\n').length} lines
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Synchronization</CardTitle>
          <CardDescription>
            YAML configurations are automatically synchronized across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Synchronized Components</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Dashboard configuration and metadata</li>
                <li>• Analytics visualization settings</li>
                <li>• Data source definitions</li>
                <li>• Module and compliance settings</li>
                <li>• Network policies and AI specifications</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Real-time parsing and integration</li>
                <li>• Automatic de-duplication</li>
                <li>• Version history tracking</li>
                <li>• Live UI component updates</li>
                <li>• Configuration validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAddDialog && (
        <AddYamlConfigDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      )}

      {selectedConfig && (
        <YamlConfigDetailsDialog
          config={selectedConfig}
          open={!!selectedConfig}
          onOpenChange={(open) => !open && setSelectedConfig(null)}
          isAdmin={isAdmin || false}
        />
      )}
    </div>
  );
}
