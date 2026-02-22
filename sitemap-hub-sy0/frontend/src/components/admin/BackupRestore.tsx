import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BackupRestore() {
  const handleBackup = () => {
    toast.info('Backup functionality coming soon');
  };

  const handleRestore = () => {
    toast.info('Restore functionality coming soon');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backup & Restore
        </CardTitle>
        <CardDescription>Manage platform data backups</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Create Backup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Export all platform data including sitemaps, users, and configurations
            </p>
            <Button onClick={handleBackup} className="gap-2">
              <Download className="h-4 w-4" />
              Create Backup
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Restore from Backup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Restore platform data from a previous backup file
            </p>
            <Button onClick={handleRestore} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Restore Backup
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Automatic Backups</p>
            <p className="text-xs text-muted-foreground">
              The platform automatically backs up data using stable variables. All critical data persists across
              canister upgrades.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
