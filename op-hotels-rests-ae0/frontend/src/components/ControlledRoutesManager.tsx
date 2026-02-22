import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllControlledRoutes, useAddControlledRoute, useRemoveControlledRoute } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, AlertCircle, Route, Loader2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALLOWED_ROUTES = ['/broadcast', '/remote', '/live'];
const SECOINFI_APPS = [
  'map-56b.caffeine.xyz',
  'etutorial-lgc.caffeine.xyz',
  'networth-htm.caffeine.xyz',
];

export default function ControlledRoutesManager() {
  const { data: controlledRoutes, isLoading } = useGetAllControlledRoutes();
  const addRouteMutation = useAddControlledRoute();
  const removeRouteMutation = useRemoveControlledRoute();
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [appController, setAppController] = useState<string>('');

  const availableRoutes = ALLOWED_ROUTES.filter(
    (route) => !controlledRoutes?.some((cr) => cr.path === route)
  );

  const handleAddRoute = async () => {
    if (!selectedPath || !appController) {
      toast.error('Please select both a route and an app controller');
      return;
    }

    try {
      toast.loading('Adding controlled route...', { id: 'add-route' });
      await addRouteMutation.mutateAsync({ path: selectedPath, appController });
      toast.success(`Route "${selectedPath}" configured successfully!`, { id: 'add-route' });
      setSelectedPath('');
      setAppController('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to add route';
      toast.error(errorMsg, { id: 'add-route' });
      console.error('Add route error:', error);
    }
  };

  const handleRemoveRoute = async (path: string) => {
    try {
      toast.loading(`Removing route "${path}"...`, { id: 'remove-route' });
      await removeRouteMutation.mutateAsync(path);
      toast.success(`Route "${path}" removed successfully!`, { id: 'remove-route' });
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to remove route';
      toast.error(errorMsg, { id: 'remove-route' });
      console.error('Remove route error:', error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-40" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Controlled Routes Configuration
        </CardTitle>
        <CardDescription>
          Map special routes (/broadcast, /remote, /live) to Secoinfi app controllers. Admin-only configuration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="route-path">Route Path</Label>
              <Select value={selectedPath} onValueChange={setSelectedPath}>
                <SelectTrigger id="route-path">
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoutes.length > 0 ? (
                    availableRoutes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      All routes configured
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-controller">App Controller</Label>
              <Select value={appController} onValueChange={setAppController}>
                <SelectTrigger id="app-controller">
                  <SelectValue placeholder="Select an app" />
                </SelectTrigger>
                <SelectContent>
                  {SECOINFI_APPS.map((app) => (
                    <SelectItem key={app} value={app}>
                      {app}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAddRoute}
            disabled={!selectedPath || !appController || addRouteMutation.isPending || availableRoutes.length === 0}
            className="w-full"
          >
            {addRouteMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Controlled Route
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Only the three special routes (/broadcast, /remote, /live) can be configured. Each route can only be assigned to one app controller.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Configured Routes</h3>
            <Badge variant="secondary">{controlledRoutes?.length || 0} routes</Badge>
          </div>

          {controlledRoutes && controlledRoutes.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {controlledRoutes.map((route) => (
                <Card key={route.path}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Route className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm font-semibold">{route.path}</span>
                          <Badge variant="outline" className="text-xs">
                            {route.appController}
                          </Badge>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={removeRouteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Controlled Route</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove the route "{route.path}"? This will unmap it from "{route.appController}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveRoute(route.path)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Created: {formatTimestamp(route.createdAt)}</p>
                        <p>Updated: {formatTimestamp(route.updatedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <Route className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No controlled routes configured. Add your first route above.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
