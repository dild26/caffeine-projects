import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
    useGetLinksForNode, 
    useGetBacklinksForNode, 
    useCreateNodeLink, 
    useDeleteNodeLink,
    useGetAllTasks,
    useGetAllNodeTypes
} from '@/hooks/useQueries';
import { LinkType } from '@/backend';
import { Link2, Link2Off, ArrowRight, ArrowLeft, Trash2, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface NodeLinkManagerProps {
    nodeId: string;
    nodeName: string;
    isAdmin: boolean;
}

const LINK_TYPE_OPTIONS = [
    { value: LinkType.direct, label: 'Direct', description: 'Direct connection' },
    { value: LinkType.dependency, label: 'Dependency', description: 'Depends on' },
    { value: LinkType.reference, label: 'Reference', description: 'References' },
    { value: LinkType.hierarchical, label: 'Hierarchical', description: 'Parent-child' },
    { value: LinkType.related, label: 'Related', description: 'Related to' },
    { value: LinkType.custom, label: 'Custom', description: 'Custom relationship' },
];

export function NodeLinkManager({ nodeId, nodeName, isAdmin }: NodeLinkManagerProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [targetNodeId, setTargetNodeId] = useState('');
    const [linkType, setLinkType] = useState<LinkType>(LinkType.direct);
    const [linkStrength, setLinkStrength] = useState('50');
    const [relationshipDepth, setRelationshipDepth] = useState('1');
    const [metadata, setMetadata] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    const { data: links = [] } = useGetLinksForNode(nodeId);
    const { data: backlinks = [] } = useGetBacklinksForNode(nodeId);
    const { data: allTasks = [] } = useGetAllTasks();
    const { data: nodeTypes = [] } = useGetAllNodeTypes();

    const createLink = useCreateNodeLink();
    const deleteLink = useDeleteNodeLink();

    const outgoingLinks = links.filter(l => !l.isBacklink);
    const incomingLinks = backlinks;

    const handleCreateLink = () => {
        if (!targetNodeId) {
            toast.error('Please select a target node');
            return;
        }

        createLink.mutate(
            {
                sourceNodeId: nodeId,
                targetNodeId,
                linkType,
                relationshipDepth: BigInt(relationshipDepth),
                linkStrength: BigInt(linkStrength),
                metadata,
            },
            {
                onSuccess: () => {
                    toast.success('Link created successfully');
                    setShowCreateDialog(false);
                    setTargetNodeId('');
                    setMetadata('');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to create link');
                },
            }
        );
    };

    const handleDeleteLink = (linkId: string) => {
        deleteLink.mutate(linkId, {
            onSuccess: () => {
                toast.success('Link deleted successfully');
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to delete link');
            },
        });
    };

    const getNodeName = (id: string) => {
        const task = allTasks.find(t => t.id === id);
        if (task) return task.name;
        const nodeType = nodeTypes.find(nt => nt.id === id);
        if (nodeType) return nodeType.name;
        return id;
    };

    const getNodeColor = (id: string) => {
        const task = allTasks.find(t => t.id === id);
        if (task) return task.color;
        const nodeType = nodeTypes.find(nt => nt.id === id);
        if (nodeType) return nodeType.color;
        return '#94a3b8';
    };

    const filteredOutgoingLinks = outgoingLinks.filter(link => {
        const matchesSearch = getNodeName(link.targetNodeId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || link.linkType === filterType;
        return matchesSearch && matchesFilter;
    });

    const filteredIncomingLinks = incomingLinks.filter(link => {
        const matchesSearch = getNodeName(link.sourceNodeId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || link.linkType === filterType;
        return matchesSearch && matchesFilter;
    });

    const isOrphaned = links.length === 0 && backlinks.length === 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="h-5 w-5" />
                            Node Links
                        </CardTitle>
                        <CardDescription>
                            Manage connections for {nodeName}
                        </CardDescription>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => setShowCreateDialog(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Link
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isOrphaned && (
                    <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning rounded-lg">
                        <Link2Off className="h-4 w-4 text-warning" />
                        <span className="text-sm text-warning">This node has no connections</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search links..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {LINK_TYPE_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="outgoing" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="outgoing">
                            Outgoing ({filteredOutgoingLinks.length})
                        </TabsTrigger>
                        <TabsTrigger value="incoming">
                            Incoming ({filteredIncomingLinks.length})
                        </TabsTrigger>
                        <TabsTrigger value="stats">
                            Statistics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="outgoing" className="space-y-2">
                        <ScrollArea className="h-[300px]">
                            {filteredOutgoingLinks.length === 0 ? (
                                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                    No outgoing links
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredOutgoingLinks.map((link) => (
                                        <div
                                            key={link.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: getNodeColor(link.targetNodeId) }}
                                                />
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{getNodeName(link.targetNodeId)}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {link.linkType}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            Strength: {link.linkStrength.toString()}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Depth: {link.relationshipDepth.toString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteLink(link.id)}
                                                    disabled={deleteLink.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="incoming" className="space-y-2">
                        <ScrollArea className="h-[300px]">
                            {filteredIncomingLinks.length === 0 ? (
                                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                    No incoming links (backlinks)
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredIncomingLinks.map((link) => (
                                        <div
                                            key={link.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: getNodeColor(link.sourceNodeId) }}
                                                />
                                                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{getNodeName(link.sourceNodeId)}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {link.linkType}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            Strength: {link.linkStrength.toString()}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Depth: {link.relationshipDepth.toString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Total Links</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{links.length}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Backlinks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{backlinks.length}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Active Links</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {links.filter(l => l.isActive).length}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Avg Strength</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {links.length > 0
                                            ? Math.round(
                                                  links.reduce((sum, l) => sum + Number(l.linkStrength), 0) /
                                                      links.length
                                              )
                                            : 0}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Link Types Distribution</h4>
                            <div className="space-y-2">
                                {LINK_TYPE_OPTIONS.map(opt => {
                                    const count = links.filter(l => l.linkType === opt.value).length;
                                    return (
                                        <div key={opt.value} className="flex items-center justify-between">
                                            <span className="text-sm">{opt.label}</span>
                                            <Badge variant="secondary">{count}</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Link</DialogTitle>
                        <DialogDescription>
                            Create a connection from {nodeName} to another node
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="target-node">Target Node</Label>
                            <Select value={targetNodeId} onValueChange={setTargetNodeId}>
                                <SelectTrigger id="target-node">
                                    <SelectValue placeholder="Select target node" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allTasks
                                        .filter(t => t.id !== nodeId)
                                        .map((task) => (
                                            <SelectItem key={task.id} value={task.id}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: task.color }}
                                                    />
                                                    <span>{task.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link-type">Link Type</Label>
                            <Select value={linkType} onValueChange={(v) => setLinkType(v as LinkType)}>
                                <SelectTrigger id="link-type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LINK_TYPE_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <div>
                                                <p className="font-medium">{opt.label}</p>
                                                <p className="text-xs text-muted-foreground">{opt.description}</p>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="link-strength">Link Strength (0-100)</Label>
                                <Input
                                    id="link-strength"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={linkStrength}
                                    onChange={(e) => setLinkStrength(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="relationship-depth">Relationship Depth</Label>
                                <Input
                                    id="relationship-depth"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={relationshipDepth}
                                    onChange={(e) => setRelationshipDepth(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metadata">Metadata (optional)</Label>
                            <Input
                                id="metadata"
                                placeholder="Additional information about this link"
                                value={metadata}
                                onChange={(e) => setMetadata(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateLink} disabled={createLink.isPending || !targetNodeId}>
                            {createLink.isPending ? 'Creating...' : 'Create Link'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

