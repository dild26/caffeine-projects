import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllBlueprints, useGetAllFixtures } from '../hooks/useQueries';
import type { ModuleConfig } from '../backend';
import { Settings, FileCode, Database, CheckCircle2, XCircle } from 'lucide-react';

interface OverviewTabProps {
  modules: ModuleConfig[];
}

export default function OverviewTab({ modules }: OverviewTabProps) {
  const { data: blueprints = [] } = useGetAllBlueprints();
  const { data: fixtures = [] } = useGetAllFixtures();

  const enabledModules = modules.filter((m) => m.enabled);
  const disabledModules = modules.filter((m) => !m.enabled);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{modules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {enabledModules.length} enabled, {disabledModules.length} disabled
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blueprints</CardTitle>
            <FileCode className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blueprints.length}</div>
            <p className="text-xs text-muted-foreground mt-1">YAML/Markdown pipelines</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fixtures</CardTitle>
            <Database className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fixtures.length}</div>
            <p className="text-xs text-muted-foreground mt-1">CSV data imports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Status</CardTitle>
          <CardDescription>Current state of all system modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {module.enabled ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-semibold">{module.name}</h4>
                    <p className="text-sm text-muted-foreground">ID: {module.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={module.enabled ? 'default' : 'secondary'}>
                    {module.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {module.settings.length} settings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
