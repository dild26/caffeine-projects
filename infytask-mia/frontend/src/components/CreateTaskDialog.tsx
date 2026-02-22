import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllNodeTypes, useIsCallerAdmin } from '@/hooks/useQueries';
import { Badge } from '@/components/ui/badge';

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string; description: string; nodeTypeId?: string }) => void;
    isLoading: boolean;
}

export function CreateTaskDialog({ open, onOpenChange, onSubmit, isLoading }: CreateTaskDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedNodeType, setSelectedNodeType] = useState<string>('');
    
    const { data: nodeTypes = [] } = useGetAllNodeTypes();
    const { data: isAdmin } = useIsCallerAdmin();

    useEffect(() => {
        if (open && nodeTypes.length > 0 && !selectedNodeType) {
            setSelectedNodeType(nodeTypes[0].id);
        }
    }, [open, nodeTypes, selectedNodeType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({ 
                name: name.trim(), 
                description: description.trim(),
                nodeTypeId: selectedNodeType || undefined
            });
            setName('');
            setDescription('');
            setSelectedNodeType('');
        }
    };

    const selectedNodeTypeData = nodeTypes.find(nt => nt.id === selectedNodeType);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>
                            Add a new task to the current project. {isAdmin && 'Select a node type to categorize your task.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="task-name">Task Name</Label>
                            <Input
                                id="task-name"
                                placeholder="Enter task name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                                id="task-description"
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        {isAdmin && nodeTypes.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="node-type">Node Type</Label>
                                <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
                                    <SelectTrigger id="node-type">
                                        <SelectValue placeholder="Select node type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nodeTypes.map((nodeType) => (
                                            <SelectItem key={nodeType.id} value={nodeType.id}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded"
                                                        style={{ backgroundColor: nodeType.color }}
                                                    />
                                                    <span>{nodeType.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedNodeTypeData && (
                                    <div className="flex items-center gap-2 mt-2 p-3 bg-muted rounded-lg">
                                        <Badge style={{ backgroundColor: selectedNodeTypeData.color, color: '#fff' }}>
                                            {selectedNodeTypeData.color}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {selectedNodeTypeData.description}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !name.trim()}>
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
