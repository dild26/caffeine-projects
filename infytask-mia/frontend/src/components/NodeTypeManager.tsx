import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useGetAllNodeTypes, useCreateNodeType, useUpdateNodeType, useDeleteNodeType, useSearchNodesByColor } from '@/hooks/useQueries';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PREDEFINED_NODE_TYPES = [
    { name: 'notes/text', description: 'Text notes and documentation' },
    { name: 'hypertext/links', description: 'Links and references' },
    { name: 'webpage/app', description: 'Web pages and applications' },
    { name: 'New Tab/section', description: 'New tabs or sections' },
    { name: 'form/fields', description: 'Forms and input fields' },
    { name: 'instruction/cmd', description: 'Instructions and commands' },
    { name: 'task/status', description: 'Task status tracking' },
    { name: 'node/depth', description: 'Node hierarchy depth' },
];

function generateHexColor(index: number, total: number): string {
    const hue = (index / Math.max(total - 1, 1)) * 360;
    const saturation = 70 + (index % 3) * 10;
    const lightness = 50 + (index % 2) * 10;
    
    const h = hue / 60;
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const x = c * (1 - Math.abs(h % 2 - 1));
    const m = lightness / 100 - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h < 1) { r = c; g = x; b = 0; }
    else if (h < 2) { r = x; g = c; b = 0; }
    else if (h < 3) { r = 0; g = c; b = x; }
    else if (h < 4) { r = 0; g = x; b = c; }
    else if (h < 5) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}FF`;
}

export function NodeTypeManager() {
    const { data: nodeTypes = [], isLoading } = useGetAllNodeTypes();
    const createNodeType = useCreateNodeType();
    const updateNodeType = useUpdateNodeType();
    const deleteNodeType = useDeleteNodeType();
    const searchByColor = useSearchNodesByColor();

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingNodeType, setEditingNodeType] = useState<any>(null);
    const [deletingNodeTypeId, setDeletingNodeTypeId] = useState<string>('');
    const [searchColor, setSearchColor] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '',
    });

    const handleInitializePredefined = async () => {
        const total = PREDEFINED_NODE_TYPES.length;
        for (let i = 0; i < PREDEFINED_NODE_TYPES.length; i++) {
            const nodeType = PREDEFINED_NODE_TYPES[i];
            const color = generateHexColor(i, total);
            const id = `node_${Date.now()}_${i}`;
            
            try {
                await createNodeType.mutateAsync({
                    id,
                    name: nodeType.name,
                    color,
                    description: nodeType.description,
                });
            } catch (error: any) {
                console.error(`Failed to create ${nodeType.name}:`, error);
            }
        }
        toast.success('Predefined node types initialized');
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast.error('Node type name is required');
            return;
        }

        const id = `node_${Date.now()}`;
        const color = formData.color || generateHexColor(nodeTypes.length, nodeTypes.length + 1);

        try {
            await createNodeType.mutateAsync({
                id,
                name: formData.name.trim(),
                color,
                description: formData.description.trim(),
            });
            toast.success('Node type created successfully');
            setShowCreateDialog(false);
            setFormData({ name: '', description: '', color: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create node type');
        }
    };

    const handleEdit = async () => {
        if (!editingNodeType || !formData.name.trim()) {
            toast.error('Node type name is required');
            return;
        }

        try {
            await updateNodeType.mutateAsync({
                id: editingNodeType.id,
                name: formData.name.trim(),
                color: formData.color || editingNodeType.color,
                description: formData.description.trim(),
            });
            toast.success('Node type updated successfully');
            setShowEditDialog(false);
            setEditingNodeType(null);
            setFormData({ name: '', description: '', color: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to update node type');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteNodeType.mutateAsync(deletingNodeTypeId);
            toast.success('Node type deleted successfully');
            setShowDeleteDialog(false);
            setDeletingNodeTypeId('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete node type');
        }
    };

    const handleSearch = async () => {
        if (!searchColor.trim()) {
            toast.error('Please enter a color to search');
            return;
        }

        try {
            const results = await searchByColor.mutateAsync(searchColor.trim());
            setSearchResults(results);
            toast.success(`Found ${results.length} node(s) with color ${searchColor}`);
        } catch (error: any) {
            toast.error(error.message || 'Search failed');
        }
    };

    const openEditDialog = (nodeType: any) => {
        setEditingNodeType(nodeType);
        setFormData({
            name: nodeType.name,
            description: nodeType.description,
            color: nodeType.color,
        });
        setShowEditDialog(true);
    };

    const openDeleteDialog = (id: string) => {
        setDeletingNodeTypeId(id);
        setShowDeleteDialog(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading node types...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Node Type Management</CardTitle>
                            <CardDescription>
                                Manage schema-driven node types with unique hex color identifiers
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {nodeTypes.length === 0 && (
                                <Button onClick={handleInitializePredefined} disabled={createNodeType.isPending}>
                                    Initialize Predefined Types
                                </Button>
                            )}
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Node Type
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex gap-2">
                        <Input
                            placeholder="Search by hex color (e.g., #FF00AAFF)"
                            value={searchColor}
                            onChange={(e) => setSearchColor(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={searchByColor.isPending}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="mb-4 p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">Search Results ({searchResults.length})</h3>
                            <div className="grid gap-2">
                                {searchResults.map((result) => (
                                    <div key={result.id} className="flex items-center gap-2 p-2 bg-background rounded">
                                        <div
                                            className="w-6 h-6 rounded"
                                            style={{ backgroundColor: result.color }}
                                        />
                                        <span className="font-medium">{result.name}</span>
                                        <Badge variant="outline">{result.color}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {nodeTypes.map((nodeType) => (
                            <Card key={nodeType.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            <div
                                                className="w-6 h-6 rounded flex-shrink-0"
                                                style={{ backgroundColor: nodeType.color }}
                                            />
                                            <CardTitle className="text-base">{nodeType.name}</CardTitle>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openEditDialog(nodeType)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openDeleteDialog(nodeType.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {nodeType.description}
                                    </p>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {nodeType.color}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Node Type</DialogTitle>
                        <DialogDescription>
                            Add a new node type with a unique hex color identifier
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                placeholder="e.g., notes/text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-description">Description</Label>
                            <Textarea
                                id="create-description"
                                placeholder="Describe this node type"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-color">Hex Color (optional)</Label>
                            <Input
                                id="create-color"
                                placeholder="#FF00AAFF (auto-generated if empty)"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            />
                            {formData.color && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded border"
                                        style={{ backgroundColor: formData.color }}
                                    />
                                    <span className="text-sm text-muted-foreground">Preview</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={createNodeType.isPending}>
                            {createNodeType.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Node Type</DialogTitle>
                        <DialogDescription>
                            Update the node type details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-color">Hex Color</Label>
                            <Input
                                id="edit-color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            />
                            {formData.color && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded border"
                                        style={{ backgroundColor: formData.color }}
                                    />
                                    <span className="text-sm text-muted-foreground">Preview</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={updateNodeType.isPending}>
                            {updateNodeType.isPending ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Node Type?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the node type.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
