import { useState } from 'react';
import { useInitializeDefaultModules, useDeleteModuleConfig, useDeleteBlueprint, useDeleteFixture } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
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

export default function AdminQuickEditTab() {
  const { mutate: initializeModules, isPending: isInitializing } = useInitializeDefaultModules();
  const { mutate: deleteModule } = useDeleteModuleConfig();
  const { mutate: deleteBlueprint } = useDeleteBlueprint();
  const { mutate: deleteFixture } = useDeleteFixture();

  const handleInitializeModules = () => {
    initializeModules(undefined, {
      onSuccess: () => {
        toast.success('Default modules initialized successfully');
      },
      onError: (error) => {
        toast.error(`Failed to initialize modules: ${error.message}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Edit Controls</CardTitle>
          <CardDescription>
            Admin-level controls with inline quick-edit modal popups and autosave functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="space-y-1">
                <h4 className="font-semibold">Initialize Default Modules</h4>
                <p className="text-sm text-muted-foreground">
                  Set up default modules and menu items for the system
                </p>
              </div>
              <Button onClick={handleInitializeModules} disabled={isInitializing}>
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Initialize
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card border-destructive/20">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Danger Zone
                </h4>
                <p className="text-sm text-muted-foreground">
                  Administrative actions that require confirmation
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> All changes made through quick-edit controls are immediately saved to the backend.
                Use the main /main route for detailed form editing with real-time sync indicators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>
            Quick access to common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm">Navigate to full control center</span>
              <Button variant="outline" size="sm" asChild>
                <a href="/main">Go to /main</a>
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm">View system dashboard</span>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin">Go to /admin</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
