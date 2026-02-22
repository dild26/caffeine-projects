import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllContracts, useCreateBackup, useRestoreFromBackup, useGetAllTemplateFiles } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Loader2, CheckCircle, AlertCircle, Archive } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';
import StatsOverview from '../components/StatsOverview';
import ContractsList from '../components/ContractsList';
import ContractEditor from '../components/ContractEditor';
import VoiceAssistant from '../components/VoiceAssistant';

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { data: contracts = [] } = useGetAllContracts();
  const { data: templateFiles = [] } = useGetAllTemplateFiles();
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const createBackup = useCreateBackup();
  const restoreFromBackup = useRestoreFromBackup();

  useEffect(() => {
    if (!isLoading && (!identity || !isAdmin)) {
      navigate({ to: '/access-denied' });
    }
  }, [identity, isAdmin, isLoading, navigate]);

  const handleCreateBackup = async () => {
    try {
      const backupId = await createBackup.mutateAsync();
      
      // Create a downloadable backup file
      const backupData = {
        backupId,
        timestamp: new Date().toISOString(),
        contracts,
        templateFiles,
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Backup created and downloaded successfully!');
      setBackupDialogOpen(false);
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to create backup');
    }
  };

  const handleRestoreBackup = async (file: File) => {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      if (!backupData.backupId) {
        throw new Error('Invalid backup file format');
      }
      
      await restoreFromBackup.mutateAsync(backupData.backupId);
      toast.success('Backup restored successfully!');
      setRestoreDialogOpen(false);
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Failed to restore backup');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return null;
  }

  const handleCreateNew = () => {
    setSelectedContractId(null);
    setIsCreatingNew(true);
  };

  const handleSelectContract = (id: string) => {
    setSelectedContractId(id);
    setIsCreatingNew(false);
  };

  const handleCloseEditor = () => {
    setSelectedContractId(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCreateNew={handleCreateNew} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Manage your digital contracts efficiently</p>
          </div>
          
          {/* Backup & Restore Buttons */}
          <div className="flex gap-2">
            <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  1-Click Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Backup</DialogTitle>
                  <DialogDescription>
                    Create a complete backup of all uploaded files and data. The backup will be saved as a .zip archive.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <Archive className="h-4 w-4" />
                    <AlertDescription>
                      This will create a backup of all contracts, templates, and uploaded files. The backup file will be downloaded to your device.
                    </AlertDescription>
                  </Alert>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setBackupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBackup} disabled={createBackup.isPending} className="gap-2">
                      {createBackup.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Create Backup
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  1-Click Restore
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Restore from Backup</DialogTitle>
                  <DialogDescription>
                    Restore all data from a previous backup .zip file. This ensures resilience to data loss after updates, upgrades, or migrations.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Warning: This will restore data from the backup file. Make sure you have the correct backup file before proceeding.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <input
                      type="file"
                      accept=".json,.zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleRestoreBackup(file);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <StatsOverview contracts={contracts} />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ContractsList onSelectContract={handleSelectContract} onCreateNew={handleCreateNew} />
          <ContractEditor
            contractId={selectedContractId}
            isCreating={isCreatingNew}
            onClose={handleCloseEditor}
          />
        </div>
      </main>

      <VoiceAssistant />
    </div>
  );
}
