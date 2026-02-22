import { useState, useEffect } from 'react';
import { useGetSitemap, useGetFeatureStatuses, useOpenTab, useCloseTab, useGetOpenTabs, useGetAllSchemaValidations, useGetAllYamlSchemas, useGetAllFeatureVerifications, useAddFeatureVerification, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronDown, FolderOpen, Folder, FileText, CheckCircle2, Clock, AlertCircle, XCircle, X, Lock, FileCheck, Database, Bot, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { SitemapNode, FeatureStatus, FeatureState, NodeTypeType, TabType, FeatureVerification } from '../backend';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const FEATURE_STATE_CONFIG = {
    [FeatureState.pending]: {
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    [FeatureState.inProgress]: {
        label: 'In Progress',
        icon: Clock,
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    [FeatureState.completed]: {
        label: 'Completed',
        icon: CheckCircle2,
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    [FeatureState.failed]: {
        label: 'Failed',
        icon: XCircle,
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
};

interface TreeNodeProps {
    node: SitemapNode;
    level: number;
    onNodeClick: (node: SitemapNode) => void;
    expandedNodes: Set<string>;
    onToggleExpand: (nodeId: string) => void;
}

function TreeNode({ node, level, onNodeClick, expandedNodes, onToggleExpand }: TreeNodeProps) {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    const getNodeIcon = () => {
        if (node.type === NodeTypeType.secure) {
            return <Lock className="h-4 w-4" />;
        }
        if (hasChildren) {
            return isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />;
        }
        return <FileText className="h-4 w-4" />;
    };

    const getNodeTypeColor = () => {
        switch (node.type) {
            case NodeTypeType.project:
                return 'text-blue-500';
            case NodeTypeType.task:
                return 'text-green-500';
            case NodeTypeType.moduleMapping:
                return 'text-purple-500';
            case NodeTypeType.apiSpec:
                return 'text-orange-500';
            case NodeTypeType.feature:
                return 'text-pink-500';
            case NodeTypeType.secure:
                return 'text-red-500';
            case NodeTypeType.nodeType:
                return 'text-cyan-500';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <div>
            <div
                className={cn(
                    'flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors',
                    node.isActive && 'bg-primary/10'
                )}
                style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
            >
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(node.id);
                        }}
                        className="p-0.5 hover:bg-muted rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-5" />}
                <div
                    className={cn('flex items-center gap-2 flex-1', getNodeTypeColor())}
                    onClick={() => onNodeClick(node)}
                >
                    {getNodeIcon()}
                    <span className="text-sm font-medium">{node.name}</span>
                    <Badge variant="outline" className="text-xs">
                        {node.type}
                    </Badge>
                    {node.type === NodeTypeType.secure && (
                        <Badge variant="destructive" className="text-xs">
                            Restricted
                        </Badge>
                    )}
                </div>
            </div>
            {isExpanded && hasChildren && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onNodeClick={onNodeClick}
                            expandedNodes={expandedNodes}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function nodeTypeToTabType(nodeType: NodeTypeType): TabType | null {
    switch (nodeType) {
        case NodeTypeType.project:
            return TabType.project;
        case NodeTypeType.task:
            return TabType.task;
        case NodeTypeType.moduleMapping:
            return TabType.moduleMapping;
        case NodeTypeType.apiSpec:
            return TabType.apiSpec;
        case NodeTypeType.feature:
            return TabType.feature;
        case NodeTypeType.secure:
            return null;
        case NodeTypeType.nodeType:
            return null;
        default:
            return null;
    }
}

export function FeaturesPage() {
    const { data: sitemap, isLoading: sitemapLoading } = useGetSitemap();
    const { data: featureStatuses, isLoading: statusesLoading } = useGetFeatureStatuses();
    const { data: openTabs } = useGetOpenTabs();
    const { data: schemaValidations } = useGetAllSchemaValidations();
    const { data: yamlSchemas } = useGetAllYamlSchemas();
    const { data: featureVerifications, isLoading: verificationsLoading } = useGetAllFeatureVerifications();
    const { data: isAdmin } = useIsCallerAdmin();
    const openTab = useOpenTab();
    const closeTab = useCloseTab();
    const addFeatureVerification = useAddFeatureVerification();
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
    const [newFeatureName, setNewFeatureName] = useState('');
    const [newFixtureTopic, setNewFixtureTopic] = useState('');
    const [newFoF, setNewFoF] = useState('');

    const organizedSitemap = sitemap ? organizeSitemapHierarchy(sitemap) : [];

    useEffect(() => {
        if (sitemap && expandedNodes.size === 0) {
            const rootIds = sitemap.slice(0, 3).map((node) => node.id);
            setExpandedNodes(new Set(rootIds));
        }
    }, [sitemap]);

    const handleToggleExpand = (nodeId: string) => {
        setExpandedNodes((prev) => {
            const next = new Set(prev);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    };

    const handleNodeClick = (node: SitemapNode) => {
        try {
            const now = Date.now();
            if (now - lastNotificationTime < 1000) {
                return;
            }
            setLastNotificationTime(now);

            const tabType = nodeTypeToTabType(node.type);
            
            if (!tabType) {
                toast.info(`${node.name} - This item cannot be opened as a tab`, {
                    duration: 2000,
                });
                return;
            }

            const existingTab = openTabs?.find((tab) => tab.resourceId === node.id);
            
            if (existingTab) {
                toast.info(`Tab already open: ${node.name}`, {
                    duration: 2000,
                });
                return;
            }

            openTab.mutate(
                {
                    id: `tab-${node.id}`,
                    name: node.name,
                    type: tabType,
                    resourceId: node.id,
                    is3D: false,
                },
                {
                    onSuccess: () => {
                        toast.success(`Opened: ${node.name}`, {
                            duration: 2000,
                        });
                    },
                    onError: (error: any) => {
                        toast.error(`Failed to open: ${error.message || 'Unknown error'}`, {
                            duration: 3000,
                        });
                    },
                }
            );
        } catch (error: any) {
            console.error('Error opening tab:', error);
            toast.error('An unexpected error occurred', {
                duration: 3000,
            });
        }
    };

    const handleCloseTab = (resourceId: string, tabName: string) => {
        try {
            closeTab.mutate(resourceId, {
                onSuccess: () => {
                    toast.info(`Closed: ${tabName}`, {
                        duration: 2000,
                    });
                },
                onError: (error: any) => {
                    toast.error(`Failed to close tab: ${error.message || 'Unknown error'}`, {
                        duration: 3000,
                    });
                },
            });
        } catch (error: any) {
            console.error('Error closing tab:', error);
            toast.error('An unexpected error occurred', {
                duration: 3000,
            });
        }
    };

    const handleAdminApproval = (verification: FeatureVerification, approved: boolean) => {
        if (!isAdmin) {
            toast.error('Only admins can approve features');
            return;
        }

        addFeatureVerification.mutate(
            {
                id: verification.id,
                name: verification.name,
                aiVerified: verification.aiVerified,
                adminApproved: approved,
                status: approved ? 'approved' : 'rejected',
                fixtureTopic: verification.fixtureTopic,
                fof: verification.fof,
            },
            {
                onSuccess: () => {
                    toast.success(`Feature ${approved ? 'approved' : 'rejected'}`);
                },
                onError: (error: any) => {
                    toast.error(`Failed to update: ${error.message || 'Unknown error'}`);
                },
            }
        );
    };

    const handleAddFeature = () => {
        if (!isAdmin) {
            toast.error('Only admins can add features');
            return;
        }

        if (!newFeatureName.trim() || !newFixtureTopic.trim() || !newFoF.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        addFeatureVerification.mutate(
            {
                id: `feature-${Date.now()}`,
                name: newFeatureName.trim(),
                aiVerified: false,
                adminApproved: false,
                status: 'pending',
                fixtureTopic: newFixtureTopic.trim(),
                fof: newFoF.trim(),
            },
            {
                onSuccess: () => {
                    toast.success('Feature added successfully');
                    setNewFeatureName('');
                    setNewFixtureTopic('');
                    setNewFoF('');
                },
                onError: (error: any) => {
                    toast.error(`Failed to add feature: ${error.message || 'Unknown error'}`);
                },
            }
        );
    };

    if (sitemapLoading || statusesLoading || verificationsLoading) {
        return (
            <div className="container py-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    const validationCount = schemaValidations?.filter(v => v.isValid).length || 0;
    const totalValidations = schemaValidations?.length || 0;
    const latestYamlSchema = yamlSchemas && yamlSchemas.length > 0 ? yamlSchemas[yamlSchemas.length - 1] : null;

    return (
        <div className="container py-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Features & Sitemap</h2>
                <p className="text-muted-foreground">
                    Hierarchical navigation with real-time feature status and dual-column verification
                </p>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Schema Validation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileCheck className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{validationCount}/{totalValidations}</p>
                                    <p className="text-xs text-muted-foreground">Valid Schemas</p>
                                </div>
                            </div>
                            <Badge variant={validationCount === totalValidations && totalValidations > 0 ? "default" : "outline"}>
                                {validationCount === totalValidations && totalValidations > 0 ? "All Valid" : "Pending"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">YAML Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Database className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{yamlSchemas?.length || 0}</p>
                                    <p className="text-xs text-muted-foreground">Normalized</p>
                                </div>
                            </div>
                            <Badge variant={latestYamlSchema?.isNormalized ? "default" : "outline"}>
                                {latestYamlSchema?.isNormalized ? "Clean" : "Pending"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Feature Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{featureStatuses?.filter(f => f.status === FeatureState.completed).length || 0}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Application Sitemap</CardTitle>
                        <CardDescription>
                            Navigate through projects, tasks, modules, and features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            {organizedSitemap.length > 0 ? (
                                <div className="space-y-1">
                                    {organizedSitemap.map((node) => (
                                        <TreeNode
                                            key={node.id}
                                            node={node}
                                            level={0}
                                            onNodeClick={handleNodeClick}
                                            expandedNodes={expandedNodes}
                                            onToggleExpand={handleToggleExpand}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-40 text-muted-foreground">
                                    No items in sitemap yet
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Status</CardTitle>
                            <CardDescription>
                                Real-time status of application features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[280px] pr-4">
                                {featureStatuses && featureStatuses.length > 0 ? (
                                    <div className="space-y-3">
                                        {featureStatuses.map((feature) => {
                                            const config = FEATURE_STATE_CONFIG[feature.status];
                                            const Icon = config.icon;
                                            return (
                                                <div
                                                    key={feature.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn('p-2 rounded-md', config.color)}>
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{feature.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Updated: {new Date(Number(feature.lastUpdated) / 1000000).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge className={config.color}>
                                                        {config.label}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                                        No feature statuses available
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Open Tabs</CardTitle>
                            <CardDescription>
                                Currently active tabs with resource tracking
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[260px] pr-4">
                                {openTabs && openTabs.length > 0 ? (
                                    <div className="space-y-2">
                                        {openTabs.map((tab) => (
                                            <div
                                                key={tab.resourceId}
                                                className={cn(
                                                    'flex items-center justify-between p-3 rounded-lg border group',
                                                    tab.isActive && 'bg-primary/5 border-primary/20'
                                                )}
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{tab.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {tab.type} • {tab.is3D ? '3D' : '2D'} • Last: {new Date(Number(tab.lastAccessed) / 1000000).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleCloseTab(tab.resourceId, tab.name)}
                                                                aria-label={`Close ${tab.name} tab`}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Close tab</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                                        No open tabs
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Feature Verification</CardTitle>
                    <CardDescription>
                        Dual-column verification with AI auto-check and Admin approval
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isAdmin && (
                        <div className="mb-4 p-4 border rounded-lg space-y-3">
                            <h4 className="font-semibold text-sm">Add New Feature</h4>
                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="space-y-1">
                                    <Label htmlFor="feature-name">Feature Name</Label>
                                    <Input
                                        id="feature-name"
                                        value={newFeatureName}
                                        onChange={(e) => setNewFeatureName(e.target.value)}
                                        placeholder="Enter feature name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fixture-topic">Fixture Topic (Unique)</Label>
                                    <Input
                                        id="fixture-topic"
                                        value={newFixtureTopic}
                                        onChange={(e) => setNewFixtureTopic(e.target.value)}
                                        placeholder="Enter unique topic"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fof">Field of Focus (FoF)</Label>
                                    <Input
                                        id="fof"
                                        value={newFoF}
                                        onChange={(e) => setNewFoF(e.target.value)}
                                        placeholder="Enter FoF"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleAddFeature} disabled={addFeatureVerification.isPending}>
                                Add Feature
                            </Button>
                        </div>
                    )}
                    <ScrollArea className="h-[400px] pr-4">
                        {featureVerifications && featureVerifications.length > 0 ? (
                            <div className="space-y-3">
                                {featureVerifications.map((verification) => (
                                    <div key={verification.id} className="p-4 rounded-lg border bg-card">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-medium">{verification.name}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        Topic: {verification.fixtureTopic}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        FoF: {verification.fof}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                verification.status === 'approved' ? "default" :
                                                verification.status === 'rejected' ? "destructive" :
                                                "outline"
                                            }>
                                                {verification.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                                <Bot className="h-4 w-4 text-blue-500" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium">AI Auto-Verification</p>
                                                    <Checkbox
                                                        checked={verification.aiVerified}
                                                        disabled
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                                                <UserCheck className="h-4 w-4 text-green-500" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium">Admin Approval</p>
                                                    {isAdmin ? (
                                                        <div className="flex gap-2 mt-1">
                                                            <Button
                                                                size="sm"
                                                                variant={verification.adminApproved ? "default" : "outline"}
                                                                onClick={() => handleAdminApproval(verification, true)}
                                                                disabled={addFeatureVerification.isPending}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={!verification.adminApproved && verification.status === 'rejected' ? "destructive" : "outline"}
                                                                onClick={() => handleAdminApproval(verification, false)}
                                                                disabled={addFeatureVerification.isPending}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Checkbox
                                                            checked={verification.adminApproved}
                                                            disabled
                                                            className="mt-1"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Updated: {new Date(Number(verification.timestamp) / 1000000).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <CheckCircle2 className="h-12 w-12 mb-2 opacity-50" />
                                <p>No feature verifications yet</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

function organizeSitemapHierarchy(nodes: SitemapNode[]): SitemapNode[] {
    const projectMap = new Map<string, SitemapNode>();
    const tasksByProject = new Map<string, SitemapNode[]>();
    const otherNodes: SitemapNode[] = [];

    nodes.forEach((node) => {
        if (node.type === NodeTypeType.project) {
            projectMap.set(node.id, { ...node, children: [] });
        } else if (node.type === NodeTypeType.task) {
            const tasks = tasksByProject.get(node.id) || [];
            tasks.push(node);
            tasksByProject.set(node.id, tasks);
        } else {
            otherNodes.push(node);
        }
    });

    const result: SitemapNode[] = [];

    projectMap.forEach((project) => {
        const projectTasks = tasksByProject.get(project.id) || [];
        result.push({
            ...project,
            children: projectTasks,
        });
    });

    result.push(...otherNodes);

    return result;
}
