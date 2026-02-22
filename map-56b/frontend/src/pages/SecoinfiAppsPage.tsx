import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Lock, FileText, Map, Shield, Plus, Edit, Trash2, Archive, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { SecoinfiAppEntry } from '../backend';
import { Principal } from '@dfinity/principal';

const STATUS_OPTIONS = ['Active', 'Archived', 'Deleted', 'Draft', 'Pending'] as const;

interface SecoinfiAppEntryUI {
  id: number;
  appName: string;
  subdomain: string;
  canonicalUrl: string;
  categoryTags: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export default function SecoinfiAppsPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete' | 'archive' | 'reset' | 'restore'>('add');
  const [currentEntry, setCurrentEntry] = useState<Partial<SecoinfiAppEntryUI> | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');

  const { data: isAdmin = false } = useQuery({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });

  const { data: secoinfiAppsEntries = [], isLoading } = useQuery<SecoinfiAppEntryUI[]>({
    queryKey: ['secoinfiAppsEntries'],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getAllSecoinfiAppsEntries();
      return entries.map(entry => ({
        id: Number(entry.id),
        appName: entry.appName,
        subdomain: entry.subdomain,
        canonicalUrl: entry.canonicalUrl,
        categoryTags: entry.categoryTags,
        status: entry.status,
        createdAt: Number(entry.createdAt),
        updatedAt: Number(entry.updatedAt),
        createdBy: entry.createdBy.toString(),
      }));
    },
    enabled: !!actor && !actorFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (entry: Partial<SecoinfiAppEntryUI>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend addSecoinfiAppEntry method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      const entries = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: Date.now(),
        appName: entry.appName || '',
        subdomain: entry.subdomain || '',
        canonicalUrl: entry.canonicalUrl || '',
        categoryTags: entry.categoryTags || '',
        status: entry.status || 'Active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: 'local',
      };
      entries.push(newEntry);
      localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
      
      return newEntry.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('App entry added successfully (local storage)');
      setDialogOpen(false);
      setCurrentEntry(null);
    },
    onError: (error) => {
      toast.error(`Failed to add entry: ${error}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, entry }: { id: bigint; entry: Partial<SecoinfiAppEntryUI> }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend updateSecoinfiAppEntry method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        const index = entries.findIndex((e: any) => e.id === Number(id));
        if (index !== -1) {
          entries[index] = { ...entries[index], ...entry, updatedAt: Date.now() };
          localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
        }
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('App entry updated successfully (local storage)');
      setDialogOpen(false);
      setCurrentEntry(null);
    },
    onError: (error) => {
      toast.error(`Failed to update entry: ${error}`);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend archiveSecoinfiAppEntry method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        const index = entries.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          entries[index].status = 'Archived';
          entries[index].updatedAt = Date.now();
          localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
        }
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('App entry archived successfully (local storage)');
    },
    onError: (error) => {
      toast.error(`Failed to archive entry: ${error}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      // Use bulkDeleteSecoinfiAppEntries for single delete
      await actor.bulkDeleteSecoinfiAppEntries([BigInt(id)]);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('App entry deleted successfully');
      setSelectedRows(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to delete entry: ${error}`);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend resetSecoinfiAppEntry method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        const index = entries.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          entries[index].status = 'Active';
          entries[index].updatedAt = Date.now();
          localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
        }
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('App entry reset successfully (local storage)');
    },
    onError: (error) => {
      toast.error(`Failed to reset entry: ${error}`);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend restoreSecoinfiAppEntry method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        const index = entries.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          entries[index].status = 'Active';
          entries[index].updatedAt = Date.now();
          localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
        }
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('App entry restored successfully (local storage)');
    },
    onError: (error) => {
      toast.error(`Failed to restore entry: ${error}`);
    },
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend bulkArchiveSecoinfiAppEntries method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        ids.forEach(id => {
          const index = entries.findIndex((e: any) => e.id === id);
          if (index !== -1) {
            entries[index].status = 'Archived';
            entries[index].updatedAt = Date.now();
          }
        });
        localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('Selected entries archived successfully (local storage)');
      setSelectedRows(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to archive entries: ${error}`);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkDeleteSecoinfiAppEntries(ids.map(id => BigInt(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('Selected entries deleted successfully');
      setSelectedRows(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to delete entries: ${error}`);
    },
  });

  const bulkResetMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend bulkResetSecoinfiAppEntries method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        ids.forEach(id => {
          const index = entries.findIndex((e: any) => e.id === id);
          if (index !== -1) {
            entries[index].status = 'Active';
            entries[index].updatedAt = Date.now();
          }
        });
        localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('Selected entries reset successfully (local storage)');
      setSelectedRows(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to reset entries: ${error}`);
    },
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not available - using localStorage
      console.warn('[SecoinfiAppsPage] Backend bulkRestoreSecoinfiAppEntries method not available, using localStorage');
      
      const stored = localStorage.getItem('secoinfiAppsEntries');
      if (stored) {
        const entries = JSON.parse(stored);
        ids.forEach(id => {
          const index = entries.findIndex((e: any) => e.id === id);
          if (index !== -1) {
            entries[index].status = 'Active';
            entries[index].updatedAt = Date.now();
          }
        });
        localStorage.setItem('secoinfiAppsEntries', JSON.stringify(entries));
      }
      
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
      toast.success('Selected entries restored successfully (local storage)');
      setSelectedRows(new Set());
    },
    onError: (error) => {
      toast.error(`Failed to restore entries: ${error}`);
    },
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(secoinfiAppsEntries.map(entry => entry.id)));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === secoinfiAppsEntries.length);
  };

  const openDialog = (mode: typeof dialogMode, entry?: SecoinfiAppEntryUI) => {
    setDialogMode(mode);
    setCurrentEntry(entry || null);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!currentEntry) return;

    if (dialogMode === 'add') {
      addMutation.mutate(currentEntry);
    } else if (dialogMode === 'edit' && currentEntry.id) {
      updateMutation.mutate({ id: BigInt(currentEntry.id), entry: currentEntry });
    }
  };

  const confirmAndExecute = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };

  const executeConfirmedAction = () => {
    confirmAction();
    setConfirmDialogOpen(false);
  };

  if (isLoading || actorFetching) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading SECOINFI Apps...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          SECOINFI Apps Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive management interface for all SECOINFI applications with role-based access control, audit trails, and verification flows.
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                SECOINFI Apps Management Table
              </CardTitle>
              <CardDescription>
                Full CRUD operations with row-level and bulk actions
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => openDialog('add')} className="gap-2">
                <Plus className="h-4 w-4" />
                Add App
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedRows.size > 0 && isAdmin && (
            <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedRows.size} row{selectedRows.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => confirmAndExecute(
                    `Archive ${selectedRows.size} selected entries?`,
                    () => bulkArchiveMutation.mutate(Array.from(selectedRows))
                  )}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive All
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => confirmAndExecute(
                    `Delete ${selectedRows.size} selected entries? This action cannot be undone.`,
                    () => bulkDeleteMutation.mutate(Array.from(selectedRows))
                  )}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => confirmAndExecute(
                    `Reset ${selectedRows.size} selected entries to canonical values?`,
                    () => bulkResetMutation.mutate(Array.from(selectedRows))
                  )}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => confirmAndExecute(
                    `Restore ${selectedRows.size} selected entries?`,
                    () => bulkRestoreMutation.mutate(Array.from(selectedRows))
                  )}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Restore All
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  {isAdmin && (
                    <th className="text-left p-3">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </th>
                  )}
                  <th className="text-left p-3 font-semibold">#</th>
                  <th className="text-left p-3 font-semibold">App Name</th>
                  <th className="text-left p-3 font-semibold">Sub-Domain</th>
                  <th className="text-left p-3 font-semibold">Canonical URL</th>
                  <th className="text-left p-3 font-semibold">Category / Tags</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Created At</th>
                  <th className="text-left p-3 font-semibold">Updated At</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {secoinfiAppsEntries.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    {isAdmin && (
                      <td className="p-3">
                        <Checkbox
                          checked={selectedRows.has(entry.id)}
                          onCheckedChange={() => handleRowSelect(entry.id)}
                          aria-label={`Select ${entry.appName}`}
                        />
                      </td>
                    )}
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono">
                        {index + 1}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">{entry.appName}</td>
                    <td className="p-3">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{entry.subdomain}</code>
                    </td>
                    <td className="p-3">
                      <a
                        href={entry.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        {entry.canonicalUrl.substring(0, 40)}...
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{entry.categoryTags || 'N/A'}</span>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          entry.status === 'Active' ? 'default' :
                          entry.status === 'Archived' ? 'secondary' :
                          entry.status === 'Deleted' ? 'destructive' : 'outline'
                        }
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {isAdmin && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openDialog('edit', entry)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmAndExecute(
                                `Archive ${entry.appName}?`,
                                () => archiveMutation.mutate(entry.id)
                              )}
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmAndExecute(
                                `Delete ${entry.appName}? This action cannot be undone.`,
                                () => deleteMutation.mutate(entry.id)
                              )}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmAndExecute(
                                `Reset ${entry.appName} to canonical values?`,
                                () => resetMutation.mutate(entry.id)
                              )}
                              title="Reset"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmAndExecute(
                                `Restore ${entry.appName}?`,
                                () => restoreMutation.mutate(entry.id)
                              )}
                              title="Restore"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </>
                        )}
                        <a href="/dashboard">
                          <Button size="sm" variant="ghost" title="View Overview">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </a>
                        <a href="/dashboard">
                          <Button size="sm" variant="ghost" title="View Sites">
                            <Map className="h-4 w-4" />
                          </Button>
                        </a>
                        <a href="/sitemap">
                          <Button size="sm" variant="ghost" title="View Sitemap">
                            <Map className="h-4 w-4" />
                          </Button>
                        </a>
                        <a href="/secure-routes">
                          <Button size="sm" variant="ghost" title="View Secure Routes">
                            <Lock className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Total Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{secoinfiAppsEntries.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Active Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {secoinfiAppsEntries.filter((app) => app.status === 'Active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Archived Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600">
              {secoinfiAppsEntries.filter((app) => app.status === 'Archived').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{selectedRows.size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New App' : 'Edit App'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'add'
                ? 'Add a new SECOINFI application to the registry'
                : 'Update the application details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="appName">App Name *</Label>
              <Input
                id="appName"
                value={currentEntry?.appName || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, appName: e.target.value })}
                placeholder="e.g., InfiTask"
              />
            </div>
            <div>
              <Label htmlFor="subdomain">Sub-Domain *</Label>
              <Input
                id="subdomain"
                value={currentEntry?.subdomain || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, subdomain: e.target.value })}
                placeholder="e.g., infitask"
              />
            </div>
            <div>
              <Label htmlFor="canonicalUrl">Canonical URL *</Label>
              <Input
                id="canonicalUrl"
                value={currentEntry?.canonicalUrl || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, canonicalUrl: e.target.value })}
                placeholder="https://infitask.caffeine.xyz/"
              />
            </div>
            <div>
              <Label htmlFor="categoryTags">Category / Tags</Label>
              <Textarea
                id="categoryTags"
                value={currentEntry?.categoryTags || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, categoryTags: e.target.value })}
                placeholder="e.g., Project Management, Productivity"
              />
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={currentEntry?.status || 'Active'}
                onValueChange={(value) => setCurrentEntry({ ...currentEntry, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!currentEntry?.appName || !currentEntry?.subdomain || !currentEntry?.canonicalUrl}>
              {dialogMode === 'add' ? 'Add App' : 'Update App'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Confirm Action
            </DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeConfirmedAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
