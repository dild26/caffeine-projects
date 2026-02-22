import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetAllProjects, useGetAllTasks, useCreateProject, useCreateTask, useIsCallerAdmin, useGetDemoData, useArchiveProject, useRestoreProject, useOpenTab, useCloseTab, useGetOpenTabs, useGetActiveProjectCount } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, List, Box, Lightbulb, Search, Archive, Copy, Download, Trash2, X, RotateCcw, FolderOpen } from 'lucide-react';
import { SpiralVisualization } from './SpiralVisualization';
import { ListView } from './ListView';
import { CreateProjectDialog } from './CreateProjectDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { TaskState, ProjectStatus, TabType } from '../backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// VIBGYOR color mapping for tasks
const TASK_STATUS_COLORS: Record<string, string> = {
    [TaskState.new_]: '#9B59B6',
    [TaskState.pending]: '#3498DB',
    [TaskState.inProgress]: '#2ECC71',
    [TaskState.completed]: '#F4D03F',
    [TaskState.blocked]: '#E74C3C',
    [TaskState.finished]: '#FF8C00',
    [TaskState.archive]: '#95A5A6',
};

// VIBGYOR color mapping for projects
const PROJECT_STATUS_COLORS: Record<string, string> = {
    [ProjectStatus.active]: '#2ECC71',
    [ProjectStatus.pending]: '#3498DB',
    [ProjectStatus.inProgress]: '#F4D03F',
    [ProjectStatus.completed]: '#FF8C00',
    [ProjectStatus.blocked]: '#E74C3C',
    [ProjectStatus.archived]: '#95A5A6',
};

function getStateLabel(state: TaskState): string {
    switch (state) {
        case TaskState.new_:
            return 'new';
        case TaskState.inProgress:
            return 'in progress';
        default:
            return state;
    }
}

// Track 3D scene cleanup callbacks
const sceneCleanupCallbacks = new Map<string, () => void>();

export function registerSceneCleanup(resourceId: string, cleanup: () => void) {
    sceneCleanupCallbacks.set(resourceId, cleanup);
}

export function unregisterSceneCleanup(resourceId: string) {
    sceneCleanupCallbacks.delete(resourceId);
}

export function ProjectView() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'3d' | 'list'>('3d');
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [showManagement, setShowManagement] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [managementSearchTerm, setManagementSearchTerm] = useState('');
    const [isClosingTab, setIsClosingTab] = useState(false);

    // Track last LRU cleanup to prevent repeated notifications
    const lastLRUCleanupRef = useRef<string | null>(null);
    const tabOperationInProgressRef = useRef(false);

    const { identity } = useInternetIdentity();
    const { data: projects, isLoading: projectsLoading } = useGetAllProjects();
    const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();
    const { data: isAdmin } = useIsCallerAdmin();
    const { data: demoData } = useGetDemoData();
    const { data: openTabs } = useGetOpenTabs();
    const { data: activeProjectCount } = useGetActiveProjectCount();
    const createProject = useCreateProject();
    const createTask = useCreateTask();
    const archiveProject = useArchiveProject();
    const restoreProject = useRestoreProject();
    const openTab = useOpenTab();
    const closeTab = useCloseTab();

    const isAuthenticated = !!identity;
    const isAdminOrSubscriber = isAdmin;

    // Separate active and archived projects
    const activeProjects = projects?.filter((p) => !p.archived) || [];
    const archivedProjects = projects?.filter((p) => p.archived) || [];

    // Calculate max tabs based on active project count (max 2)
    const maxProjectTabs = Math.min(Number(activeProjectCount || 0), 2);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'w' && selectedProjectId && !isClosingTab) {
                e.preventDefault();
                handleCloseTab(selectedProjectId);
            }
            
            if (e.ctrlKey && e.key === 'Tab' && activeProjects.length > 0) {
                e.preventDefault();
                const currentIndex = activeProjects.findIndex((p) => p.id === selectedProjectId);
                const nextIndex = (currentIndex + 1) % activeProjects.length;
                handleTabChange(activeProjects[nextIndex].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedProjectId, activeProjects, isClosingTab]);

    // LRU cleanup for 3D tabs (limit to 3) - with debouncing
    useEffect(() => {
        if (!openTabs || tabOperationInProgressRef.current) return;

        const threeDTabs = openTabs.filter((tab) => tab.is3D);
        if (threeDTabs.length > 3) {
            const sortedTabs = [...threeDTabs].sort(
                (a, b) => Number(a.lastAccessed) - Number(b.lastAccessed)
            );
            
            const tabToClose = sortedTabs[0];
            
            // Only show notification if it's a different tab than last time
            if (lastLRUCleanupRef.current !== tabToClose.resourceId) {
                lastLRUCleanupRef.current = tabToClose.resourceId;
                toast.warning(`Closing oldest 3D tab to manage memory: ${tabToClose.name}`, {
                    duration: 3000,
                });
                handleCloseTab(tabToClose.resourceId, true);
            }
        }
    }, [openTabs?.length]); // Only trigger on tab count change

    // Handle tab change with reuse logic and dynamic limit enforcement
    const handleTabChange = useCallback((projectId: string) => {
        if (tabOperationInProgressRef.current) return;

        const project = activeProjects.find((p) => p.id === projectId);
        if (!project) {
            toast.error('Cannot open archived projects as tabs');
            return;
        }

        const existingTab = openTabs?.find((tab) => tab.resourceId === projectId);
        
        if (existingTab) {
            setSelectedProjectId(projectId);
        } else {
            tabOperationInProgressRef.current = true;

            // Check if we've reached the max tab limit
            const currentProjectTabs = openTabs?.filter((tab) => tab.type === TabType.project) || [];
            if (currentProjectTabs.length >= maxProjectTabs) {
                // Close the least recently accessed tab
                const sortedTabs = [...currentProjectTabs].sort(
                    (a, b) => Number(a.lastAccessed) - Number(b.lastAccessed)
                );
                const oldestTab = sortedTabs[0];
                
                // Close old tab first, then open new one
                closeTab.mutate(oldestTab.resourceId, {
                    onSettled: () => {
                        // Now open the new tab
                        const is3D = viewMode === '3d';
                        openTab.mutate(
                            {
                                id: `tab-${projectId}`,
                                name: project.name,
                                type: TabType.project,
                                resourceId: projectId,
                                is3D,
                            },
                            {
                                onSuccess: () => {
                                    setSelectedProjectId(projectId);
                                    tabOperationInProgressRef.current = false;
                                },
                                onError: (error: any) => {
                                    console.error('Failed to open tab:', error);
                                    toast.error('Failed to open tab');
                                    tabOperationInProgressRef.current = false;
                                },
                            }
                        );
                    },
                });
            } else {
                const is3D = viewMode === '3d';
                openTab.mutate(
                    {
                        id: `tab-${projectId}`,
                        name: project.name,
                        type: TabType.project,
                        resourceId: projectId,
                        is3D,
                    },
                    {
                        onSuccess: () => {
                            setSelectedProjectId(projectId);
                            tabOperationInProgressRef.current = false;
                        },
                        onError: (error: any) => {
                            console.error('Failed to open tab:', error);
                            toast.error('Failed to open tab');
                            tabOperationInProgressRef.current = false;
                        },
                    }
                );
            }
        }
    }, [activeProjects, openTabs, viewMode, openTab, closeTab, maxProjectTabs]);

    // Handle tab close with cleanup
    const handleCloseTab = useCallback((resourceId: string, skipConfirm = false) => {
        if (tabOperationInProgressRef.current || isClosingTab) return;

        setIsClosingTab(true);
        tabOperationInProgressRef.current = true;

        const cleanup = sceneCleanupCallbacks.get(resourceId);
        if (cleanup) {
            cleanup();
            sceneCleanupCallbacks.delete(resourceId);
        }

        closeTab.mutate(resourceId, {
            onSuccess: () => {
                // Update selected project if needed
                if (selectedProjectId === resourceId) {
                    const remainingTabs = openTabs?.filter((t) => t.resourceId !== resourceId) || [];
                    const projectTabs = remainingTabs.filter((t) => t.type === TabType.project);
                    
                    if (projectTabs.length > 0) {
                        // Switch to most recently accessed tab
                        const sortedTabs = [...projectTabs].sort(
                            (a, b) => Number(b.lastAccessed) - Number(a.lastAccessed)
                        );
                        setSelectedProjectId(sortedTabs[0].resourceId);
                    } else if (activeProjects.length > 0) {
                        // Open first active project if no tabs remain
                        setSelectedProjectId(activeProjects[0].id);
                    } else {
                        setSelectedProjectId(null);
                    }
                }
                
                if (!skipConfirm) {
                    toast.info('Tab closed');
                }
                
                setIsClosingTab(false);
                tabOperationInProgressRef.current = false;
            },
            onError: (error: any) => {
                console.error('Failed to close tab:', error);
                toast.error('Failed to close tab');
                setIsClosingTab(false);
                tabOperationInProgressRef.current = false;
            },
        });
    }, [selectedProjectId, activeProjects, closeTab, openTabs, isClosingTab]);

    // Initialize demo project
    useEffect(() => {
        if (projects && projects.length === 0 && !projectsLoading && isAuthenticated && isAdmin) {
            const mockProjectId = `project-${Date.now()}`;
            createProject.mutate(
                {
                    id: mockProjectId,
                    name: 'InfiTask Demo Project',
                    description: 'A demonstration project showcasing the 3D spiral visualization and task management capabilities with VIBGYOR color coding',
                },
                {
                    onSuccess: (project) => {
                        handleTabChange(project.id);
                        const taskData = [
                            { name: 'Design System Architecture', description: 'Create comprehensive design system (Category: Design)', state: TaskState.new_ },
                            { name: 'Implement Backend API', description: 'Build RESTful API endpoints (Category: Backend)', state: TaskState.pending },
                            { name: 'Create 3D Visualization', description: 'Develop interactive 3D spiral view (Category: Frontend)', state: TaskState.inProgress },
                            { name: 'Build Task Management UI', description: 'Design and implement task list interface (Category: Frontend)', state: TaskState.completed },
                            { name: 'Add Module Tracking', description: 'Implement module mapping system (Category: Backend)', state: TaskState.blocked },
                            { name: 'Integrate Merkle Root System', description: 'Add cryptographic verification (Category: Security)', state: TaskState.finished },
                            { name: 'Optimize Performance', description: 'Improve rendering and data loading (Category: Performance)', state: TaskState.completed },
                            { name: 'Write Documentation', description: 'Create user and developer guides (Category: Documentation)', state: TaskState.finished },
                            { name: 'Legacy Feature Migration', description: 'Migrate old features to new architecture (Category: Migration)', state: TaskState.archive },
                        ];

                        taskData.forEach((taskInfo, index) => {
                            setTimeout(() => {
                                createTask.mutate({
                                    id: `task-${Date.now()}-${index}`,
                                    projectId: project.id,
                                    name: taskInfo.name,
                                    description: taskInfo.description,
                                });
                            }, index * 100);
                        });
                    },
                    onError: (error: any) => {
                        console.error('Failed to create demo project:', error);
                        toast.error('Failed to create demo project');
                    },
                }
            );
        } else if (activeProjects.length > 0 && !selectedProjectId && !tabOperationInProgressRef.current) {
            // Only auto-select if no tab operation is in progress
            const firstProject = activeProjects[0];
            const existingTab = openTabs?.find((tab) => tab.resourceId === firstProject.id);
            if (existingTab) {
                setSelectedProjectId(firstProject.id);
            }
        }
    }, [projects, projectsLoading, isAuthenticated, isAdmin, activeProjects.length, selectedProjectId]);

    const selectedProject = activeProjects.find((p) => p.id === selectedProjectId);
    const projectTasks = tasks?.filter((t) => t.projectId === selectedProjectId) || [];

    const filteredTasks = isAdminOrSubscriber
        ? projectTasks
        : projectTasks.filter((t) => t.state === TaskState.finished);

    const calculateProgress = (tasks: typeof projectTasks) => {
        if (tasks.length === 0) return 0;
        const completedCount = tasks.filter(
            (t) => t.state === TaskState.completed || t.state === TaskState.finished
        ).length;
        return Math.round((completedCount / tasks.length) * 100);
    };

    const progress = calculateProgress(projectTasks);

    const handleCreateProject = (data: { name: string; description: string }) => {
        const id = `project-${Date.now()}`;
        createProject.mutate(
            { id, ...data },
            {
                onSuccess: (project) => {
                    handleTabChange(project.id);
                    setIsProjectDialogOpen(false);
                    toast.success('Project created successfully');
                },
                onError: (error: any) => {
                    console.error('Failed to create project:', error);
                    toast.error(error.message || 'Failed to create project');
                },
            }
        );
    };

    const handleCreateTask = (data: { name: string; description: string }) => {
        if (!selectedProjectId) return;
        const id = `task-${Date.now()}`;
        createTask.mutate(
            { id, projectId: selectedProjectId, ...data },
            {
                onSuccess: () => {
                    setIsTaskDialogOpen(false);
                    toast.success('Task created successfully');
                },
                onError: (error: any) => {
                    console.error('Failed to create task:', error);
                    toast.error(error.message || 'Failed to create task');
                },
            }
        );
    };

    const handleArchiveProject = (projectId: string) => {
        archiveProject.mutate(projectId, {
            onSuccess: () => {
                handleCloseTab(projectId, true);
                toast.success('Project archived successfully');
            },
            onError: (error: any) => {
                console.error('Failed to archive project:', error);
                toast.error(error.message || 'Failed to archive project');
            },
        });
    };

    const handleRestoreProject = (projectId: string) => {
        restoreProject.mutate(projectId, {
            onSuccess: () => {
                toast.success('Project restored successfully');
            },
            onError: (error: any) => {
                console.error('Failed to restore project:', error);
                toast.error(error.message || 'Failed to restore project');
            },
        });
    };

    const handleDeleteProject = () => {
        if (!projectToDelete) return;
        
        archiveProject.mutate(projectToDelete, {
            onSuccess: () => {
                handleCloseTab(projectToDelete, true);
                toast.success('Project archived and prepared for deletion');
                setDeleteConfirmOpen(false);
                setProjectToDelete(null);
            },
            onError: (error: any) => {
                console.error('Failed to archive project:', error);
                toast.error(error.message || 'Failed to archive project');
            },
        });
    };

    const handleCopyProject = (projectId: string) => {
        const project = projects?.find((p) => p.id === projectId);
        if (!project) return;

        const newId = `project-${Date.now()}`;
        createProject.mutate(
            {
                id: newId,
                name: `${project.name} (Copy)`,
                description: project.description,
            },
            {
                onSuccess: () => {
                    toast.success('Project copied successfully');
                },
                onError: (error: any) => {
                    console.error('Failed to copy project:', error);
                    toast.error(error.message || 'Failed to copy project');
                },
            }
        );
    };

    const handleBackupProject = (projectId: string) => {
        try {
            const project = projects?.find((p) => p.id === projectId);
            const projectTaskList = tasks?.filter((t) => t.projectId === projectId) || [];
            
            if (!project) return;

            const backup = {
                project,
                tasks: projectTaskList,
                timestamp: new Date().toISOString(),
            };

            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name}-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            toast.success('Project backup downloaded');
        } catch (error: any) {
            console.error('Failed to backup project:', error);
            toast.error('Failed to backup project');
        }
    };

    const handleExportAll = () => {
        const exportData = {
            projects,
            tasks,
            timestamp: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infitask-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success('All data exported successfully');
    };

    const filteredActiveProjects = activeProjects.filter((p) =>
        p.name.toLowerCase().includes(managementSearchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(managementSearchTerm.toLowerCase())
    );

    const filteredArchivedProjects = archivedProjects.filter((p) =>
        p.name.toLowerCase().includes(managementSearchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(managementSearchTerm.toLowerCase())
    );

    if (projectsLoading || tasksLoading) {
        return (
            <div className="container py-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to InfiTask</CardTitle>
                        <CardDescription>
                            Please log in to access all features. Public users can view finished tasks only.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {projects && projects.length > 0 && (
                            <div className="space-y-4">
                                {projects.map((project) => {
                                    const finishedTasks = tasks?.filter(
                                        (t) => t.projectId === project.id && t.state === TaskState.finished
                                    ) || [];
                                    
                                    if (finishedTasks.length === 0) return null;

                                    return (
                                        <Card key={project.id}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{project.name}</CardTitle>
                                                <CardDescription>{project.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Finished Tasks:</p>
                                                    {finishedTasks.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center gap-2 p-2 rounded-md border"
                                                        >
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: TASK_STATUS_COLORS[TaskState.finished] }}
                                                            />
                                                            <span className="text-sm">{task.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show Project Management section
    if (showManagement) {
        return (
            <div className="container py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
                        <p className="text-muted-foreground">
                            Manage your projects with hierarchical organization, backup, restore, and archive capabilities
                        </p>
                    </div>
                    <Button onClick={() => setShowManagement(false)} variant="outline">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search projects..."
                            value={managementSearchTerm}
                            onChange={(e) => setManagementSearchTerm(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleExportAll} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export All
                        </Button>
                    </div>

                    <Tabs defaultValue="active">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="active">
                                Active Projects ({activeProjects.length})
                            </TabsTrigger>
                            <TabsTrigger value="archived">
                                Archived Projects ({archivedProjects.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="active" className="space-y-4">
                            {filteredActiveProjects.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No active projects found
                                </div>
                            ) : (
                                filteredActiveProjects.map((project) => {
                                    const projectTaskList = tasks?.filter((t) => t.projectId === project.id) || [];
                                    return (
                                        <Card key={project.id}>
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status] }}
                                                            />
                                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                                        </div>
                                                        <CardDescription>{project.description}</CardDescription>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleArchiveProject(project.id)}
                                                    >
                                                        <Archive className="mr-2 h-4 w-4" />
                                                        Archive
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Tasks: {projectTaskList.length}</p>
                                                    <p>Progress: {project.progress.toString()}%</p>
                                                    <p className="font-mono text-xs mt-2">Hash: {project.hash}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </TabsContent>

                        <TabsContent value="archived" className="space-y-4">
                            {filteredArchivedProjects.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No archived projects found
                                </div>
                            ) : (
                                filteredArchivedProjects.map((project) => {
                                    const projectTaskList = tasks?.filter((t) => t.projectId === project.id) || [];
                                    return (
                                        <Card key={project.id} className="opacity-75">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: PROJECT_STATUS_COLORS[ProjectStatus.archived] }}
                                                            />
                                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                                        </div>
                                                        <CardDescription>{project.description}</CardDescription>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRestoreProject(project.id)}
                                                    >
                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                        Restore
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Tasks: {projectTaskList.length}</p>
                                                    <p>Progress: {project.progress.toString()}%</p>
                                                    <p className="font-mono text-xs mt-2">Hash: {project.hash}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Visualize and manage your projects in 3D or list view with VIBGYOR color coding
                    </p>
                </div>
                {isAdmin && (
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={() => setShowSearch(!showSearch)} size="sm" variant="outline">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                        <Button onClick={() => setShowManagement(true)} size="sm" variant="outline">
                            <Archive className="mr-2 h-4 w-4" />
                            Manage
                        </Button>
                        <Button onClick={() => setIsProjectDialogOpen(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </Button>
                        <Button
                            onClick={() => setIsTaskDialogOpen(true)}
                            size="sm"
                            variant="outline"
                            disabled={!selectedProjectId}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </div>
                )}
            </div>

            {showSearch && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Advanced Search</CardTitle>
                        <CardDescription>Search across all projects and tasks with hierarchical navigation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="Search projects and tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-4"
                        />
                        {searchQuery && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Projects</h4>
                                    {projects?.filter((p) => 
                                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        p.description.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((project) => (
                                        <div
                                            key={project.id}
                                            className="p-2 hover:bg-muted rounded cursor-pointer"
                                            onClick={() => {
                                                if (!project.archived) {
                                                    handleTabChange(project.id);
                                                    setShowSearch(false);
                                                    setSearchQuery('');
                                                } else {
                                                    toast.info('Archived projects cannot be opened as tabs');
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status] }}
                                                />
                                                <span className="font-medium">{project.name}</span>
                                                {project.archived && (
                                                    <span className="text-xs text-muted-foreground">(Archived)</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground ml-5">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Tasks</h4>
                                    {tasks?.filter((t) => 
                                        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        t.description.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((task) => {
                                        const taskProject = projects?.find((p) => p.id === task.projectId);
                                        return (
                                            <div
                                                key={task.id}
                                                className="p-2 hover:bg-muted rounded cursor-pointer"
                                                onClick={() => {
                                                    if (taskProject && !taskProject.archived) {
                                                        handleTabChange(task.projectId);
                                                        setShowSearch(false);
                                                        setSearchQuery('');
                                                    } else {
                                                        toast.info('Cannot open tasks from archived projects');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: TASK_STATUS_COLORS[task.state] }}
                                                    />
                                                    <span className="font-medium">{task.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        in {taskProject?.name}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground ml-5">{task.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {demoData && demoData.suggestions && demoData.suggestions.length > 0 && (
                <Alert className="mb-6">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Project & Task Suggestions by Category</AlertTitle>
                    <AlertDescription>
                        <ul className="mt-2 space-y-1">
                            {demoData.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm">• {suggestion}</li>
                            ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3">
                            Note: Tasks with "finished" and "completed" statuses are included in auto-generated spec.md for non-critical updates/upgrades/migrations.
                        </p>
                    </AlertDescription>
                </Alert>
            )}

            {activeProjects.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-muted-foreground">
                            Open project tabs: {openTabs?.filter((t) => t.type === TabType.project).length || 0} / {maxProjectTabs}
                        </p>
                    </div>
                    <Tabs value={selectedProjectId || ''} onValueChange={handleTabChange}>
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <TabsList className="flex-1 justify-start overflow-x-auto">
                                    {activeProjects.map((project) => {
                                        const isOpen = openTabs?.some((tab) => tab.resourceId === project.id);
                                        return (
                                            <div key={project.id} className="relative flex items-center group">
                                                <TabsTrigger value={project.id} className="flex-shrink-0 relative pr-8">
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                                                        style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status] }}
                                                    />
                                                    <span className="ml-2">{project.name}</span>
                                                </TabsTrigger>
                                                {isOpen && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCloseTab(project.id);
                                                                }}
                                                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                                aria-label={`Close ${project.name} tab`}
                                                                disabled={isClosingTab}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Close tab (Ctrl+W)</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        );
                                    })}
                                </TabsList>
                            </TooltipProvider>
                            {isAdmin && selectedProjectId && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleCopyProject(selectedProjectId)}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBackupProject(selectedProjectId)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Backup Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleArchiveProject(selectedProjectId)}>
                                            <Archive className="mr-2 h-4 w-4" />
                                            Archive Project
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setProjectToDelete(selectedProjectId);
                                                setDeleteConfirmOpen(true);
                                            }}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Project
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </Tabs>
                </div>
            )}

            {selectedProject ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: PROJECT_STATUS_COLORS[selectedProject.status] }}
                                    />
                                    <CardTitle>{selectedProject.name}</CardTitle>
                                </div>
                                <CardDescription>{selectedProject.description}</CardDescription>
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>Hash: {selectedProject.hash}</span>
                                        <span>Nonce: {selectedProject.nonce.toString()}</span>
                                        <span>Tasks: {projectTasks.length}</span>
                                    </div>
                                    {isAdminOrSubscriber && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">Overall Progress</span>
                                                <span className="text-muted-foreground">{progress}%</span>
                                            </div>
                                            <div className="relative">
                                                <Progress value={progress} className="h-2" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-xs font-bold text-primary-foreground mix-blend-difference">
                                                        ⏳
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(TASK_STATUS_COLORS).map(([stateKey, color]) => {
                                            const state = stateKey as TaskState;
                                            return (
                                                <div key={stateKey} className="flex items-center gap-1 text-xs">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <span className="capitalize">{getStateLabel(state)}</span>
                                                    <span className="text-muted-foreground">({color})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === '3d' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('3d')}
                                >
                                    <Box className="mr-2 h-4 w-4" />
                                    3D View
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="mr-2 h-4 w-4" />
                                    List View
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {viewMode === '3d' ? (
                            <SpiralVisualization 
                                project={selectedProject} 
                                tasks={filteredTasks} 
                                isAdmin={isAdmin || false}
                                resourceId={selectedProject.id}
                            />
                        ) : (
                            <ListView project={selectedProject} tasks={filteredTasks} isAdmin={isAdmin || false} />
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <p className="text-muted-foreground">No projects yet. Create one to get started!</p>
                            {isAdmin && (
                                <Button onClick={() => setIsProjectDialogOpen(true)} className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {isAdmin && (
                <>
                    <CreateProjectDialog
                        open={isProjectDialogOpen}
                        onOpenChange={setIsProjectDialogOpen}
                        onSubmit={handleCreateProject}
                        isLoading={createProject.isPending}
                    />

                    <CreateTaskDialog
                        open={isTaskDialogOpen}
                        onOpenChange={setIsTaskDialogOpen}
                        onSubmit={handleCreateTask}
                        isLoading={createTask.isPending}
                    />

                    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Archive and Delete Project?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will first archive the project to prevent data loss, then prepare it for deletion. 
                                    All tasks will be auto-archived. This action helps maintain data integrity.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Archive & Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </div>
    );
}
