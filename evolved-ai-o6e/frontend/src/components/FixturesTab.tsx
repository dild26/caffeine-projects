import { useState, useEffect, useCallback } from 'react';
import {
  useGetAllFixtures,
  useAddFixture,
  useUpdateFixture,
  useDeleteFixture,
  useImportCsvFixture,
} from '../hooks/useQueries';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import type { Fixture } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Database, Upload, Edit, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

type SyncStatus = 'idle' | 'pending' | 'syncing' | 'saved' | 'failed';

export default function FixturesTab() {
  const { data: fixtures = [], isLoading } = useGetAllFixtures();
  const { mutate: addFixture, isPending: isAdding } = useAddFixture();
  const { mutate: updateFixture, isPending: isUpdating } = useUpdateFixture();
  const { mutate: deleteFixture, isPending: isDeleting } = useDeleteFixture();
  const { mutate: importCsv, isPending: isImporting } = useImportCsvFixture();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFixture, setNewFixture] = useState({ id: '', name: '', data: '' });
  const [csvData, setCsvData] = useState({ id: '', name: '', data: '' });
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [originalFixture, setOriginalFixture] = useState<Fixture | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  useEffect(() => {
    if (isUpdating) {
      setSyncStatus('syncing');
    }
  }, [isUpdating]);

  const handleSave = useCallback((fixture: Fixture) => {
    updateFixture(fixture, {
      onSuccess: () => {
        setSyncStatus('saved');
        setOriginalFixture(fixture);
        setTimeout(() => setSyncStatus('idle'), 2000);
      },
      onError: (error) => {
        setSyncStatus('failed');
        toast.error(`Failed to update fixture: ${error.message}`);
        setTimeout(() => setSyncStatus('idle'), 3000);
      },
    });
  }, [updateFixture]);

  useDebouncedSave(editingFixture, (value) => {
    if (value && originalFixture && JSON.stringify(value) !== JSON.stringify(originalFixture)) {
      setSyncStatus('pending');
      handleSave(value);
    }
  }, 3000);

  const handleAdd = () => {
    if (!newFixture.id || !newFixture.name || !newFixture.data) {
      toast.error('Please fill in all fields');
      return;
    }

    addFixture(newFixture, {
      onSuccess: () => {
        toast.success('Fixture added successfully');
        setNewFixture({ id: '', name: '', data: '' });
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to add fixture: ${error.message}`);
      },
    });
  };

  const handleImport = () => {
    if (!csvData.id || !csvData.name || !csvData.data) {
      toast.error('Please fill in all fields');
      return;
    }

    importCsv(csvData, {
      onSuccess: () => {
        toast.success('CSV fixture imported successfully');
        setCsvData({ id: '', name: '', data: '' });
        setIsImportDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to import CSV: ${error.message}`);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete fixture "${name}"?`)) return;

    deleteFixture(id, {
      onSuccess: () => {
        toast.success('Fixture deleted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to delete fixture: ${error.message}`);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvData({ ...csvData, data: content });
    };
    reader.readAsText(file);
  };

  const openEditDialog = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setOriginalFixture(fixture);
    setIsEditDialogOpen(true);
    setSyncStatus('idle');
  };

  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'syncing':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'saved':
        return <Badge variant="default"><Check className="h-3 w-3 mr-1" />Saved</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fixture Management</CardTitle>
              <CardDescription>
                Manage CSV/JSON fixture data with 3-second debounced auto-save
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import CSV Fixture</DialogTitle>
                    <DialogDescription>
                      Import a CSV file containing fixture data (indexes 10-200)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="csv-id">Fixture ID</Label>
                      <Input
                        id="csv-id"
                        value={csvData.id}
                        onChange={(e) => setCsvData({ ...csvData, id: e.target.value })}
                        placeholder="e.g., fixture-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="csv-name">Fixture Name</Label>
                      <Input
                        id="csv-name"
                        value={csvData.name}
                        onChange={(e) => setCsvData({ ...csvData, name: e.target.value })}
                        placeholder="e.g., Module Hierarchy Data"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="csv-file">Upload CSV File</Label>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="csv-data">CSV Data</Label>
                      <Textarea
                        id="csv-data"
                        value={csvData.data}
                        onChange={(e) => setCsvData({ ...csvData, data: e.target.value })}
                        placeholder="Or paste CSV content here..."
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={isImporting}>
                      {isImporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        'Import'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fixture
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Fixture</DialogTitle>
                    <DialogDescription>Create a new fixture with data</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fixture-id">Fixture ID</Label>
                      <Input
                        id="fixture-id"
                        value={newFixture.id}
                        onChange={(e) => setNewFixture({ ...newFixture, id: e.target.value })}
                        placeholder="e.g., fx-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fixture-name">Fixture Name</Label>
                      <Input
                        id="fixture-name"
                        value={newFixture.name}
                        onChange={(e) => setNewFixture({ ...newFixture, name: e.target.value })}
                        placeholder="e.g., Test Data Set"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fixture-data">Data (CSV/JSON)</Label>
                      <Textarea
                        id="fixture-data"
                        value={newFixture.data}
                        onChange={(e) => setNewFixture({ ...newFixture, data: e.target.value })}
                        placeholder="Enter fixture data..."
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={isAdding}>
                      {isAdding ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Fixture'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fixtures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No fixtures yet. Import a CSV or add your first fixture to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {fixtures.map((fixture) => (
                <Card key={fixture.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{fixture.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="font-mono text-xs">
                            {fixture.id}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(fixture)}
                          size="icon"
                          variant="ghost"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(fixture.id, fixture.name)}
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Data Preview</Label>
                      <div className="rounded-md bg-muted p-3 max-h-32 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap break-words font-mono">
                          {fixture.data.slice(0, 200)}
                          {fixture.data.length > 200 && '...'}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {fixture.data.length} characters
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Edit Fixture</DialogTitle>
                <DialogDescription>Update fixture data with preview</DialogDescription>
              </div>
              {getSyncBadge()}
            </div>
          </DialogHeader>
          {editingFixture && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fixture-id">Fixture ID</Label>
                <Input
                  id="edit-fixture-id"
                  value={editingFixture.id}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fixture-name">Fixture Name</Label>
                <Input
                  id="edit-fixture-name"
                  value={editingFixture.name}
                  onChange={(e) => {
                    setEditingFixture({ ...editingFixture, name: e.target.value });
                    setSyncStatus('pending');
                  }}
                  placeholder="Fixture name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fixture-data">Data (CSV/JSON)</Label>
                <Textarea
                  id="edit-fixture-data"
                  value={editingFixture.data}
                  onChange={(e) => {
                    setEditingFixture({ ...editingFixture, data: e.target.value });
                    setSyncStatus('pending');
                  }}
                  placeholder="Enter fixture data..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {editingFixture.data.length} characters
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Auto-Save:</strong> Changes are automatically saved 3 seconds after you stop typing.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingFixture(null);
                setOriginalFixture(null);
                setSyncStatus('idle');
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
