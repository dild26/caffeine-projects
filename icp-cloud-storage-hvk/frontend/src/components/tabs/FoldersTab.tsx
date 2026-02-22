import { useState, useCallback, useRef, useMemo } from 'react';
import { useListFolders, useDeleteFolder, useCreateFolder, useGetCallerUserProfile, useCreateSharingLink, useListSharingLinks, useUpdateFolder, useIsCallerAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Folder, Trash2, Search, AlertCircle, Plus, ArrowUpDown, Share2, Link as LinkIcon, Code, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { formatBytes } from '../../lib/utils';
import { Role } from '../../backend';
import type { FolderMetadata, SharingLink } from '../../types';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

type SortField = 'name' | 'size' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export default function FoldersTab() {
  const { data: folders = [], isLoading } = useListFolders();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: sharingLinks = [] } = useListSharingLinks();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();
  const deleteFolder = useDeleteFolder();
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const createSharingLink = useCreateSharingLink();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderMetadata | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('/');
  const [folderPrice, setFolderPrice] = useState('');

  const canCreateFolders = userProfile && userProfile.tenantId;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredFolders = useMemo(() => {
    let filtered = folders.filter(folder =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'size') {
        aVal = Number(a.size);
        bVal = Number(b.size);
      } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aVal = Number(a[sortField]);
        bVal = Number(b[sortField]);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [folders, searchQuery, sortField, sortDirection]);

  const handleDelete = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;

    try {
      await deleteFolder.mutateAsync(folderId);
      toast.success('Folder deleted successfully');
    } catch (error) {
      toast.error('Failed to delete folder');
      console.error(error);
    }
  };

  const handleCreate = async () => {
    if (!userProfile || !identity || !userProfile.tenantId) {
      toast.error('Cannot create folder: missing tenant');
      return;
    }

    if (!newFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    try {
      const folder: FolderMetadata = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: userProfile.tenantId,
        name: newFolderName,
        size: BigInt(0),
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        owner: identity.getPrincipal(),
        permissions: [Role.user],
        path: newFolderPath,
        status: 'active',
        operationHistory: [],
        customMetadata: [],
      };

      await createFolder.mutateAsync(folder);
      toast.success('Folder created successfully');
      setCreateDialogOpen(false);
      setNewFolderName('');
      setNewFolderPath('/');
    } catch (error) {
      toast.error('Failed to create folder');
      console.error(error);
    }
  };

  const handleShare = async (folder: FolderMetadata) => {
    if (!identity) {
      toast.error('You must be logged in to share folders');
      return;
    }

    try {
      const linkId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareUrl = `${window.location.origin}/shared/${linkId}`;
      const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

      const link: SharingLink = {
        id: linkId,
        targetId: folder.id,
        targetType: 'folder',
        owner: identity.getPrincipal(),
        permissions: [Role.user],
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        status: 'active',
        embedCode,
        customMetadata: [],
      };

      await createSharingLink.mutateAsync(link);
      setSelectedFolder(folder);
      setShareDialogOpen(true);
      toast.success('Sharing link created successfully');
    } catch (error) {
      toast.error('Failed to create sharing link');
      console.error(error);
    }
  };

  const handleSettings = (folder: FolderMetadata) => {
    setSelectedFolder(folder);
    setFolderPrice(folder.price ? (Number(folder.price) / 100).toFixed(2) : '');
    setSettingsDialogOpen(true);
  };

  const handleSaveSettings = async () => {
    if (!selectedFolder) return;

    try {
      const priceInCents = folderPrice ? Math.round(parseFloat(folderPrice) * 100) : undefined;
      
      const updatedFolder: FolderMetadata = {
        ...selectedFolder,
        price: priceInCents ? BigInt(priceInCents) : undefined,
        updatedAt: BigInt(Date.now() * 1000000),
      };

      await updateFolder.mutateAsync(updatedFolder);
      toast.success('Folder settings updated successfully');
      setSettingsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update folder settings');
      console.error(error);
    }
  };

  const getFolderLink = (folderId: string): SharingLink | undefined => {
    return sharingLinks.find(link => link.targetId === folderId && link.targetType === 'folder');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const canAccessFolder = (folder: FolderMetadata): boolean => {
    if (isAdmin) return true;
    if (!identity) return false;
    return folder.owner.toString() === identity.getPrincipal().toString();
  };

  const needsPayment = (folder: FolderMetadata): boolean => {
    if (isAdmin) return false;
    if (!identity) return false;
    if (folder.owner.toString() === identity.getPrincipal().toString()) return false;
    return !!folder.price && Number(folder.price) > 0;
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Folders</h2>
          <p className="text-muted-foreground">Organize your files with folders</p>
        </div>
        {canCreateFolders && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        )}
      </div>

      {!canCreateFolders && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not currently assigned to a tenant. Folder creation is disabled. Please contact an administrator to assign you to a tenant.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Folder Browser</CardTitle>
          <CardDescription>Browse and manage your folders with sorting and filtering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : sortedAndFilteredFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Folder className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No folders found</p>
              <p className="text-sm text-muted-foreground">
                {canCreateFolders ? 'Create your first folder to get started' : 'You need a tenant assignment to create folders'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <SortButton field="name" label="Name" />
                    </TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>
                      <SortButton field="size" label="Size" />
                    </TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <SortButton field="createdAt" label="Created" />
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredFolders.map((folder) => {
                    const link = getFolderLink(folder.id);
                    const requiresPayment = needsPayment(folder);
                    
                    return (
                      <TableRow key={folder.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            <span className="truncate max-w-[200px]">{folder.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{folder.path}</TableCell>
                        <TableCell>{formatBytes(Number(folder.size))}</TableCell>
                        <TableCell>
                          {folder.price ? (
                            <Badge variant="secondary">
                              ${(Number(folder.price) / 100).toFixed(2)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Free</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={folder.status === 'active' ? 'default' : 'secondary'}>
                            {folder.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(Number(folder.createdAt) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {}}
                              title="Download folder"
                              disabled={requiresPayment}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {link ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedFolder(folder);
                                  setShareDialogOpen(true);
                                }}
                                title="View sharing link"
                              >
                                <LinkIcon className="h-4 w-4 text-primary" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShare(folder)}
                                title="Share folder"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            )}
                            {canAccessFolder(folder) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSettings(folder)}
                                title="Folder settings"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                            {canAccessFolder(folder) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(folder.id)}
                                disabled={deleteFolder.isPending}
                                title="Delete folder"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your files
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                placeholder="My Folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="folderPath">Path</Label>
              <Input
                id="folderPath"
                placeholder="/"
                value={newFolderPath}
                onChange={(e) => setNewFolderPath(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Folder</DialogTitle>
            <DialogDescription>
              Share this folder with others using a permalink or embed code
            </DialogDescription>
          </DialogHeader>
          {selectedFolder && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Folder Details</h4>
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedFolder.name}</p>
                  <p className="text-sm"><span className="font-medium">Path:</span> {selectedFolder.path}</p>
                  <p className="text-sm"><span className="font-medium">Size:</span> {formatBytes(Number(selectedFolder.size))}</p>
                  {selectedFolder.price && (
                    <p className="text-sm"><span className="font-medium">Price:</span> ${(Number(selectedFolder.price) / 100).toFixed(2)}</p>
                  )}
                </div>
              </div>

              {(() => {
                const link = getFolderLink(selectedFolder.id);
                if (!link) return null;

                const permalink = `${window.location.origin}/shared/${link.id}`;

                return (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Permalink</h4>
                      <div className="flex gap-2">
                        <Input value={permalink} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(permalink, 'Permalink')}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Embed Code</h4>
                      <div className="flex gap-2">
                        <Input value={link.embedCode} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(link.embedCode, 'Embed code')}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Folder Settings</DialogTitle>
            <DialogDescription>
              Configure permissions and monetization for this folder
            </DialogDescription>
          </DialogHeader>
          {selectedFolder && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="monetization">Monetization</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Folder Information</h4>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedFolder.name}</span>
                      <span className="text-muted-foreground">Path:</span>
                      <span className="font-medium">{selectedFolder.path}</span>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{formatBytes(Number(selectedFolder.size))}</span>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="secondary">{selectedFolder.status}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monetization" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Set Folder Price</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="price">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={folderPrice}
                        onChange={(e) => setFolderPrice(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Set to 0 or leave empty for free access
                      </p>
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Note:</strong> Admin users are exempt from all payment requirements. 
                        Folder owners always have free access to their own folders.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
