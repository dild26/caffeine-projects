import { useIsCallerAdmin, useCreateBackup, useRestoreBackup, useGetManifestLog } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import ManifestHealthPanel from '../components/ManifestHealthPanel';

export default function BackupPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: manifestLog = [] } = useGetManifestLog();
  const createBackup = useCreateBackup();
  const restoreBackup = useRestoreBackup();
  const [showRestoreWarning, setShowRestoreWarning] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);

  if (adminLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleCreateBackup = async () => {
    try {
      const backup = await createBackup.mutateAsync();
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Backup created and downloaded successfully');
    } catch (error) {
      console.error('Backup creation failed:', error);
      toast.error('Failed to create backup');
    }
  };

  const handleRestoreBackup = async () => {
    if (!backupFile) {
      toast.error('Please select a backup file');
      return;
    }

    try {
      const fileContent = await backupFile.text();
      const backup = JSON.parse(fileContent);
      await restoreBackup.mutateAsync(backup);
      toast.success('Backup restored successfully');
      setShowRestoreWarning(false);
      setBackupFile(null);
    } catch (error) {
      console.error('Backup restoration failed:', error);
      toast.error('Failed to restore backup');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">
          Create backups and restore system data with comprehensive audit logging
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Backup</CardTitle>
            <CardDescription>
              Download a complete backup of all system data including specifications, files, and manifest logs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={handleCreateBackup}
              disabled={createBackup.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              {createBackup.isPending ? 'Creating Backup...' : 'Create Backup'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Backup includes: specifications, sitemap, theme, files, and complete manifest log
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore Backup</CardTitle>
            <CardDescription>
              Restore system data from a previous backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Backup File</label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <Button 
              className="w-full" 
              variant="destructive"
              onClick={() => setShowRestoreWarning(true)}
              disabled={!backupFile || restoreBackup.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {restoreBackup.isPending ? 'Restoring...' : 'Restore Backup'}
            </Button>
            {showRestoreWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Restoring a backup will overwrite all current data. This action cannot be undone.
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="destructive" onClick={handleRestoreBackup}>
                      Confirm Restore
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowRestoreWarning(false)}>
                      Cancel
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <ManifestHealthPanel />

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>
            Complete history of all system operations and manifest entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {manifestLog.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No audit log entries yet
                </div>
              ) : (
                manifestLog.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="shrink-0 mt-1">
                      {entry.action.includes('ERROR') || entry.action.includes('FAILED') ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : entry.action.includes('WARNING') ? (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{entry.action}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground break-words">{entry.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

