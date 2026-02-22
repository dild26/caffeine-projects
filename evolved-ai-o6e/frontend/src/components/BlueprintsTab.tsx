import { useState, useEffect, useCallback } from 'react';
import {
  useGetAllBlueprints,
  useAddBlueprint,
  useUpdateBlueprint,
  useDeleteBlueprint,
  useImportYamlPipeline,
} from '../hooks/useQueries';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import type { Blueprint } from '../backend';
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
import { Loader2, Plus, Trash2, FileCode, Upload, Edit, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

type SyncStatus = 'idle' | 'pending' | 'syncing' | 'saved' | 'failed';

export default function BlueprintsTab() {
  const { data: blueprints = [], isLoading } = useGetAllBlueprints();
  const { mutate: addBlueprint, isPending: isAdding } = useAddBlueprint();
  const { mutate: updateBlueprint, isPending: isUpdating } = useUpdateBlueprint();
  const { mutate: deleteBlueprint, isPending: isDeleting } = useDeleteBlueprint();
  const { mutate: importYaml, isPending: isImporting } = useImportYamlPipeline();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBlueprint, setNewBlueprint] = useState({ id: '', name: '', instructions: '' });
  const [yamlData, setYamlData] = useState({ id: '', name: '', instructions: '' });
  const [editingBlueprint, setEditingBlueprint] = useState<Blueprint | null>(null);
  const [originalBlueprint, setOriginalBlueprint] = useState<Blueprint | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  useEffect(() => {
    if (isUpdating) {
      setSyncStatus('syncing');
    }
  }, [isUpdating]);

  const handleSave = useCallback((blueprint: Blueprint) => {
    updateBlueprint(blueprint, {
      onSuccess: () => {
        setSyncStatus('saved');
        setOriginalBlueprint(blueprint);
        setTimeout(() => setSyncStatus('idle'), 2000);
      },
      onError: (error) => {
        setSyncStatus('failed');
        toast.error(`Failed to update blueprint: ${error.message}`);
        setTimeout(() => setSyncStatus('idle'), 3000);
      },
    });
  }, [updateBlueprint]);

  useDebouncedSave(editingBlueprint, (value) => {
    if (value && originalBlueprint && JSON.stringify(value) !== JSON.stringify(originalBlueprint)) {
      setSyncStatus('pending');
      handleSave(value);
    }
  }, 3000);

  const handleAdd = () => {
    if (!newBlueprint.id || !newBlueprint.name || !newBlueprint.instructions) {
      toast.error('Please fill in all fields');
      return;
    }

    addBlueprint(newBlueprint, {
      onSuccess: () => {
        toast.success('Blueprint added successfully');
        setNewBlueprint({ id: '', name: '', instructions: '' });
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to add blueprint: ${error.message}`);
      },
    });
  };

  const handleImport = () => {
    if (!yamlData.id || !yamlData.name || !yamlData.instructions) {
      toast.error('Please fill in all fields');
      return;
    }

    importYaml(yamlData, {
      onSuccess: () => {
        toast.success('YAML pipeline imported successfully');
        setYamlData({ id: '', name: '', instructions: '' });
        setIsImportDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to import YAML: ${error.message}`);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete blueprint "${name}"?`)) return;

    deleteBlueprint(id, {
      onSuccess: () => {
        toast.success('Blueprint deleted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to delete blueprint: ${error.message}`);
      },
    });
  };

  const openEditDialog = (blueprint: Blueprint) => {
    setEditingBlueprint(blueprint);
    setOriginalBlueprint(blueprint);
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
              <CardTitle>Blueprint Management</CardTitle>
              <CardDescription>
                Manage YAML/Markdown pipeline blueprints with 3-second debounced auto-save
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import YAML
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import YAML Pipeline</DialogTitle>
                    <DialogDescription>
                      Import a YAML/Markdown pipeline blueprint
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="yaml-id">Blueprint ID</Label>
                      <Input
                        id="yaml-id"
                        value={yamlData.id}
                        onChange={(e) => setYamlData({ ...yamlData, id: e.target.value })}
                        placeholder="e.g., pipeline-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yaml-name">Blueprint Name</Label>
                      <Input
                        id="yaml-name"
                        value={yamlData.name}
                        onChange={(e) => setYamlData({ ...yamlData, name: e.target.value })}
                        placeholder="e.g., Authentication Pipeline"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yaml-instructions">YAML/Markdown Instructions</Label>
                      <Textarea
                        id="yaml-instructions"
                        value={yamlData.instructions}
                        onChange={(e) => setYamlData({ ...yamlData, instructions: e.target.value })}
                        placeholder="Paste your YAML or Markdown content here..."
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
                    Add Blueprint
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Blueprint</DialogTitle>
                    <DialogDescription>Create a new blueprint with instructions</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="blueprint-id">Blueprint ID</Label>
                      <Input
                        id="blueprint-id"
                        value={newBlueprint.id}
                        onChange={(e) => setNewBlueprint({ ...newBlueprint, id: e.target.value })}
                        placeholder="e.g., bp-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blueprint-name">Blueprint Name</Label>
                      <Input
                        id="blueprint-name"
                        value={newBlueprint.name}
                        onChange={(e) => setNewBlueprint({ ...newBlueprint, name: e.target.value })}
                        placeholder="e.g., User Management Blueprint"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blueprint-instructions">Instructions</Label>
                      <Textarea
                        id="blueprint-instructions"
                        value={newBlueprint.instructions}
                        onChange={(e) =>
                          setNewBlueprint({ ...newBlueprint, instructions: e.target.value })
                        }
                        placeholder="Enter blueprint instructions..."
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
                        'Add Blueprint'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {blueprints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No blueprints yet. Add your first blueprint to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {blueprints.map((blueprint) => (
                <Card key={blueprint.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{blueprint.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="font-mono text-xs">
                            {blueprint.id}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(blueprint)}
                          size="icon"
                          variant="ghost"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(blueprint.id, blueprint.name)}
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
                      <Label className="text-xs text-muted-foreground">Instructions</Label>
                      <div className="rounded-md bg-muted p-3 max-h-32 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap break-words font-mono">
                          {blueprint.instructions}
                        </pre>
                      </div>
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
                <DialogTitle>Edit Blueprint</DialogTitle>
                <DialogDescription>Update blueprint instructions with YAML syntax</DialogDescription>
              </div>
              {getSyncBadge()}
            </div>
          </DialogHeader>
          {editingBlueprint && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-blueprint-id">Blueprint ID</Label>
                <Input
                  id="edit-blueprint-id"
                  value={editingBlueprint.id}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-blueprint-name">Blueprint Name</Label>
                <Input
                  id="edit-blueprint-name"
                  value={editingBlueprint.name}
                  onChange={(e) => {
                    setEditingBlueprint({ ...editingBlueprint, name: e.target.value });
                    setSyncStatus('pending');
                  }}
                  placeholder="Blueprint name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-blueprint-instructions">Instructions (YAML/Markdown)</Label>
                <Textarea
                  id="edit-blueprint-instructions"
                  value={editingBlueprint.instructions}
                  onChange={(e) => {
                    setEditingBlueprint({ ...editingBlueprint, instructions: e.target.value });
                    setSyncStatus('pending');
                  }}
                  placeholder="Enter blueprint instructions..."
                  rows={12}
                  className="font-mono text-sm"
                />
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
                setEditingBlueprint(null);
                setOriginalBlueprint(null);
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
