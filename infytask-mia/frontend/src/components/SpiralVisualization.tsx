import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Project, Task } from '../backend';
import { TaskState } from '../backend';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useUpdateTask, useGetAllNodeLinks } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { registerSceneCleanup, unregisterSceneCleanup } from './ProjectView';

interface SpiralVisualizationProps {
    project: Project;
    tasks: Task[];
    isAdmin: boolean;
    resourceId: string;
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

function TaskNode({ task, position, index, isAdmin, onEdit }: { 
    task: Task; 
    position: [number, number, number]; 
    index: number;
    isAdmin: boolean;
    onEdit: (task: Task) => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    const color = TASK_STATUS_COLORS[task.state] || '#94a3b8';
    const progressValue = calculateTaskProgress(task.state);
    
    const intensity = useMemo(() => {
        return 0.3 + (progressValue / 100) * 0.7;
    }, [progressValue]);

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => isAdmin && onEdit(task)}
                scale={hovered ? 1.2 : 1}
            >
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial 
                    color={color} 
                    metalness={0.3} 
                    roughness={0.4}
                    emissive={color}
                    emissiveIntensity={intensity * 0.5}
                />
            </mesh>
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="pointer-events-none rounded-lg border border-border bg-popover p-3 shadow-lg min-w-[200px]">
                        <p className="font-semibold text-popover-foreground">{task.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <p className="text-xs text-muted-foreground capitalize">
                                    {getStateLabel(task.state)}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Color: {color}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Progress: {progressValue}%
                            </p>
                            {isAdmin && (
                                <p className="text-xs text-primary mt-2">
                                    Click to edit
                                </p>
                            )}
                        </div>
                    </div>
                </Html>
            )}
            <Text
                position={[0, -0.5, 0]}
                fontSize={0.15}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {index + 1}
            </Text>
        </group>
    );
}

function LinkLines({ tasks, links }: { tasks: Task[]; links: any[] }) {
    const taskPositions = useMemo(() => {
        const radius = 3;
        const height = 5;
        const turns = 2;
        
        const positions: Record<string, [number, number, number]> = {};
        tasks.forEach((task, index) => {
            const t = index / Math.max(tasks.length - 1, 1);
            const angle = t * turns * Math.PI * 2;
            const x = Math.cos(angle) * radius * (1 - t * 0.3);
            const y = t * height - height / 2;
            const z = Math.sin(angle) * radius * (1 - t * 0.3);
            positions[task.id] = [x, y, z];
        });
        return positions;
    }, [tasks]);

    const linkLines = useMemo(() => {
        return links
            .filter(link => link.isActive && !link.isBacklink)
            .map(link => {
                const sourcePos = taskPositions[link.sourceNodeId];
                const targetPos = taskPositions[link.targetNodeId];
                if (!sourcePos || !targetPos) return null;
                
                const linkStrength = Number(link.linkStrength) / 100;
                const color = new THREE.Color().setHSL(0.6 - linkStrength * 0.3, 0.8, 0.5);
                
                return {
                    points: [sourcePos, targetPos],
                    color: `#${color.getHexString()}`,
                    opacity: 0.3 + linkStrength * 0.4,
                    lineWidth: 1 + linkStrength * 2,
                };
            })
            .filter(Boolean);
    }, [links, taskPositions]);

    return (
        <>
            {linkLines.map((line, index) => (
                line && (
                    <Line
                        key={index}
                        points={line.points}
                        color={line.color}
                        lineWidth={line.lineWidth}
                        opacity={line.opacity}
                        transparent
                        dashed={false}
                    />
                )
            ))}
        </>
    );
}

function SpiralScene({ tasks, isAdmin, onEdit, links }: { 
    tasks: Task[]; 
    isAdmin: boolean; 
    onEdit: (task: Task) => void;
    links: any[];
}) {
    const positions = useMemo(() => {
        const radius = 3;
        const height = 5;
        const turns = 2;
        
        return tasks.map((_, index) => {
            const t = index / Math.max(tasks.length - 1, 1);
            const angle = t * turns * Math.PI * 2;
            const x = Math.cos(angle) * radius * (1 - t * 0.3);
            const y = t * height - height / 2;
            const z = Math.sin(angle) * radius * (1 - t * 0.3);
            return [x, y, z] as [number, number, number];
        });
    }, [tasks]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {tasks.map((task, index) => (
                <TaskNode 
                    key={task.id} 
                    task={task} 
                    position={positions[index]} 
                    index={index}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                />
            ))}

            {positions.length > 1 && (
                <Line
                    points={positions}
                    color="#64748b"
                    lineWidth={1}
                    opacity={0.3}
                    transparent
                />
            )}

            <LinkLines tasks={tasks} links={links} />

            <OrbitControls enablePan enableZoom enableRotate />
        </>
    );
}

export function SpiralVisualization({ project, tasks, isAdmin, resourceId }: SpiralVisualizationProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editName, setEditName] = useState('');
    const updateTask = useUpdateTask();
    const canvasRef = useRef<HTMLDivElement>(null);
    const { data: allLinks = [] } = useGetAllNodeLinks();

    const relevantLinks = useMemo(() => {
        const taskIds = new Set(tasks.map(t => t.id));
        return allLinks.filter(link => 
            taskIds.has(link.sourceNodeId) && taskIds.has(link.targetNodeId)
        );
    }, [allLinks, tasks]);

    useEffect(() => {
        const cleanup = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current.querySelector('canvas');
                if (canvas) {
                    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                    if (gl) {
                        const loseContext = gl.getExtension('WEBGL_lose_context');
                        if (loseContext) {
                            loseContext.loseContext();
                        }
                    }
                }
            }
        };

        registerSceneCleanup(resourceId, cleanup);

        return () => {
            cleanup();
            unregisterSceneCleanup(resourceId);
        };
    }, [resourceId]);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setEditName(task.name);
    };

    const handleSave = () => {
        if (!editingTask || !editName.trim()) return;

        updateTask.mutate(
            {
                id: editingTask.id,
                name: editName.trim(),
                description: editingTask.description,
                state: editingTask.state,
            },
            {
                onSuccess: () => {
                    toast.success('Task updated successfully');
                    setEditingTask(null);
                    setEditName('');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update task');
                },
            }
        );
    };

    const handleCancel = () => {
        setEditingTask(null);
        setEditName('');
    };

    if (tasks.length === 0) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-muted-foreground">No tasks to visualize. Create some tasks to see the 3D spiral!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {editingTask && (
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Editing:</span>
                    <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Task name"
                        className="flex-1"
                    />
                    <Button size="sm" onClick={handleSave} disabled={updateTask.isPending}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} disabled={updateTask.isPending}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <div ref={canvasRef} className="h-[500px] w-full rounded-lg bg-gradient-to-br from-background to-muted/20">
                <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
                    <SpiralScene tasks={tasks} isAdmin={isAdmin} onEdit={handleEdit} links={relevantLinks} />
                </Canvas>
            </div>
            {relevantLinks.length > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                    Showing {relevantLinks.length} link{relevantLinks.length !== 1 ? 's' : ''} between tasks
                </div>
            )}
        </div>
    );
}
