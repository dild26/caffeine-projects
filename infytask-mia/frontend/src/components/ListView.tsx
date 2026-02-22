import { useState } from 'react';
import type { Project, Task } from '../backend';
import { TaskState } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Circle, Clock, XCircle, Hourglass, Trash2, Archive, Edit2, Check, X, Link2 } from 'lucide-react';
import { useUpdateTaskState, useArchiveTask, useUpdateTask, useUpdateProject, useGetLinksForNode } from '@/hooks/useQueries';
import { toast } from 'sonner';
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
import { NodeLinkManager } from './NodeLinkManager';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ListViewProps {
    project: Project;
    tasks: Task[];
    isAdmin: boolean;
}

const TASK_STATUS_COLORS: Record<string, string> = {
    [TaskState.new_]: '#9B59B6',
    [TaskState.pending]: '#3498DB',
    [TaskState.inProgress]: '#2ECC71',
    [TaskState.completed]: '#F4D03F',
    [TaskState.blocked]: '#E74C3C',
    [TaskState.finished]: '#FF8C00',
    [TaskState.archive]: '#95A5A6',
};

const TASK_STATES = [
    TaskState.new_,
    TaskState.pending,
    TaskState.inProgress,
    TaskState.completed,
    TaskState.blocked,
    TaskState.finished,
    TaskState.archive,
];

function getTaskIcon(state: Task['state']) {
    switch (state) {
        case TaskState.completed:
        case TaskState.finished:
            return <CheckCircle2 className="h-5 w-5" />;
        case TaskState.inProgress:
            return <Clock className="h-5 w-5" />;
        case TaskState.blocked:
            return <XCircle className="h-5 w-5" />;
        case TaskState.archive:
            return <Archive className="h-5 w-5" />;
        default:
            return <Circle className="h-5 w-5" />;
    }
}

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

function calculateTaskProgress(state: TaskState): number {
    switch (state) {
        case TaskState.new_:
            return 0;
        case TaskState.pending:
            return 15;
        case TaskState.inProgress:
            return 50;
        case TaskState.blocked:
            return 25;
        case TaskState.completed:
            return 90;
        case TaskState.finished:
            return 100;
        case TaskState.archive:
            return 100;
        default:
            return 0;
    }
}

export function ListView({ project, tasks, isAdmin }: ListViewProps) {
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingProject, setEditingProject] = useState(false);
    const [editTaskData, setEditTaskData] = useState<{ name: string; description: string; state: TaskState } | null>(null);
    const [editProjectData, setEditProjectData] = useState<{ name: string; description: string } | null>(null);
    const [selectedTaskForLinks, setSelectedTaskForLinks] = useState<Task | null>(null);
    
    const updateTaskState = useUpdateTaskState();
    const archiveTask = useArchiveTask();
    const updateTask = useUpdateTask();
    const updateProject = useUpdateProject();

    if (tasks.length === 0) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-muted-foreground">No tasks yet. Create some tasks to get started!</p>
            </div>
        );
    }

    const tasksByState = {
        new: tasks.filter((t) => t.state === TaskState.new_),
        pending: tasks.filter((t) => t.state === TaskState.pending),
        inProgress: tasks.filter((t) => t.state === TaskState.inProgress),
        completed: tasks.filter((t) => t.state === TaskState.completed),
        blocked: tasks.filter((t) => t.state === TaskState.blocked),
        finished: tasks.filter((t) => t.state === TaskState.finished),
        archive: tasks.filter((t) => t.state === TaskState.archive),
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTasks(new Set(tasks.map((t) => t.id)));
        } else {
            setSelectedTasks(new Set());
        }
    };

    const handleSelectTask = (taskId: string, checked: boolean) => {
        const newSelected = new Set(selectedTasks);
        if (checked) {
            newSelected.add(taskId);
        } else {
            newSelected.delete(taskId);
        }
        setSelectedTasks(newSelected);
    };

    const handleStatusChange = (taskId: string, newState: TaskState) => {
        updateTaskState.mutate(
            { taskId, newState },
            {
                onSuccess: () => {
                    toast.success('Task status updated successfully');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update task status');
                },
            }
        );
    };

    const handleDeleteSelected = () => {
        const taskIdsToDelete = Array.from(selectedTasks);
        
        const archivePromises = taskIdsToDelete.map((taskId) => 
            archiveTask.mutateAsync(taskId)
        );

        Promise.all(archivePromises)
            .then(() => {
                toast.success(`${taskIdsToDelete.length} task(s) archived successfully`);
                setSelectedTasks(new Set());
                setShowDeleteDialog(false);
            })
            .catch((error: any) => {
                toast.error(error.message || 'Failed to archive tasks');
            });
    };

    const startEditingTask = (task: Task) => {
        setEditingTaskId(task.id);
        setEditTaskData({
            name: task.name,
            description: task.description,
            state: task.state,
        });
    };

    const cancelEditingTask = () => {
        setEditingTaskId(null);
        setEditTaskData(null);
    };

    const saveTaskEdit = (taskId: string) => {
        if (!editTaskData) return;
        
        updateTask.mutate(
            {
                id: taskId,
                name: editTaskData.name,
                description: editTaskData.description,
                state: editTaskData.state,
            },
            {
                onSuccess: () => {
                    toast.success('Task updated successfully');
                    setEditingTaskId(null);
                    setEditTaskData(null);
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update task');
                },
            }
        );
    };

    const startEditingProject = () => {
        setEditingProject(true);
        setEditProjectData({
            name: project.name,
            description: project.description,
        });
    };

    const cancelEditingProject = () => {
        setEditingProject(false);
        setEditProjectData(null);
    };

    const saveProjectEdit = () => {
        if (!editProjectData) return;
        
        updateProject.mutate(
            {
                id: project.id,
                name: editProjectData.name,
                description: editProjectData.description,
            },
            {
                onSuccess: () => {
                    toast.success('Project updated successfully');
                    setEditingProject(false);
                    setEditProjectData(null);
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update project');
                },
            }
        );
    };

    const allSelected = tasks.length > 0 && selectedTasks.size === tasks.length;
    const someSelected = selectedTasks.size > 0 && selectedTasks.size < tasks.length;

    return (
        <div className="space-y-6">
            {isAdmin && (
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                {editingProject ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={editProjectData?.name || ''}
                                            onChange={(e) =>
                                                setEditProjectData((prev) => ({
                                                    ...prev!,
                                                    name: e.target.value,
                                                }))
                                            }
                                            placeholder="Project name"
                                            className="text-lg font-semibold"
                                        />
                                        <Textarea
                                            value={editProjectData?.description || ''}
                                            onChange={(e) =>
                                                setEditProjectData((prev) => ({
                                                    ...prev!,
                                                    description: e.target.value,
                                                }))
                                            }
                                            placeholder="Project description"
                                            rows={2}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={saveProjectEdit}
                                                disabled={updateProject.isPending}
                                            >
                                                <Check className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEditingProject}
                                                disabled={updateProject.isPending}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <CardTitle>{project.name}</CardTitle>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={startEditingProject}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardDescription>{project.description}</CardDescription>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Object.entries(tasksByState).map(([stateKey, stateTasks]) => {
                    const stateEnum = stateKey === 'new' ? TaskState.new_ : 
                                     stateKey === 'inProgress' ? TaskState.inProgress :
                                     TaskState[stateKey as keyof typeof TaskState];
                    const color = TASK_STATUS_COLORS[stateEnum];
                    
                    return (
                        <Card key={stateKey}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                    <CardTitle className="text-sm font-medium capitalize">
                                        {getStateLabel(stateEnum)}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stateTasks.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">{color}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Task List</CardTitle>
                            <CardDescription>
                                {selectedTasks.size > 0 ? `${selectedTasks.size} task(s) selected` : 'Manage your tasks'}
                            </CardDescription>
                        </div>
                        {isAdmin && selectedTasks.size > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={archiveTask.isPending}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={handleSelectAll}
                                            aria-label="Select all"
                                            ref={(el) => {
                                                if (el) {
                                                    (el as any).indeterminate = someSelected;
                                                }
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Links</TableHead>
                                    <TableHead>Hash</TableHead>
                                    {isAdmin && <TableHead className="w-32">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => {
                                    const statusColor = TASK_STATUS_COLORS[task.state];
                                    const progressValue = calculateTaskProgress(task.state);
                                    const isEditing = editingTaskId === task.id;

                                    return (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedTasks.has(task.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectTask(task.id, checked as boolean)
                                                    }
                                                    aria-label={`Select ${task.name}`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <Input
                                                            value={editTaskData?.name || ''}
                                                            onChange={(e) =>
                                                                setEditTaskData((prev) => ({
                                                                    ...prev!,
                                                                    name: e.target.value,
                                                                }))
                                                            }
                                                            placeholder="Task name"
                                                            className="font-medium"
                                                        />
                                                        <Textarea
                                                            value={editTaskData?.description || ''}
                                                            onChange={(e) =>
                                                                setEditTaskData((prev) => ({
                                                                    ...prev!,
                                                                    description: e.target.value,
                                                                }))
                                                            }
                                                            placeholder="Task description"
                                                            rows={2}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start gap-3">
                                                        <div style={{ color: statusColor }}>
                                                            {getTaskIcon(task.state)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{task.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {task.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isAdmin ? (
                                                    <Select
                                                        value={isEditing ? editTaskData?.state : task.state}
                                                        onValueChange={(value) => {
                                                            if (isEditing) {
                                                                setEditTaskData((prev) => ({
                                                                    ...prev!,
                                                                    state: value as TaskState,
                                                                }));
                                                            } else {
                                                                handleStatusChange(task.id, value as TaskState);
                                                            }
                                                        }}
                                                        disabled={updateTaskState.isPending}
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TASK_STATES.map((state) => (
                                                                <SelectItem key={state} value={state}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-2 h-2 rounded-full"
                                                                            style={{
                                                                                backgroundColor: TASK_STATUS_COLORS[state],
                                                                            }}
                                                                        />
                                                                        <span className="capitalize">
                                                                            {getStateLabel(state)}
                                                                        </span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Badge
                                                        style={{
                                                            backgroundColor: statusColor,
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {getStateLabel(task.state)}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <Hourglass 
                                                            className="h-4 w-4" 
                                                            style={{ 
                                                                color: statusColor,
                                                                opacity: 0.3 + (progressValue / 100) * 0.7
                                                            }} 
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">{progressValue}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedTaskForLinks(task)}
                                                >
                                                    <Link2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground font-mono">
                                                    {task.hash}
                                                </span>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    {isEditing ? (
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => saveTaskEdit(task.id)}
                                                                disabled={updateTask.isPending}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={cancelEditingTask}
                                                                disabled={updateTask.isPending}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => startEditingTask(task)}
                                                            title="Edit Task"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive and Delete Tasks?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will first archive {selectedTasks.size} task(s) to prevent data loss, then prepare them for deletion. 
                            This action helps maintain data integrity.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Archive & Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!selectedTaskForLinks} onOpenChange={(open) => !open && setSelectedTaskForLinks(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Node Links - {selectedTaskForLinks?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedTaskForLinks && (
                        <NodeLinkManager
                            nodeId={selectedTaskForLinks.id}
                            nodeName={selectedTaskForLinks.name}
                            isAdmin={isAdmin}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
