export enum Column {
    toDo = "To Do",
    inProgress = "In Progress",
    done = "Done"
}

export interface Task {
    id: bigint;
    title: string;
    description: string;
    column: Column;
    owner: string;
    createdAt: bigint;
}

export enum SchemaType {
    userProfile = "userProfile",
    task = "task"
}

export enum ChangeType {
    fieldAdded = "fieldAdded",
    fieldRemoved = "fieldRemoved",
    typeChanged = "typeChanged",
    validationRuleChanged = "validationRuleChanged"
}

export interface UserProfile {
    name: string;
}

export interface SchemaChangeLog {
    timestamp: bigint;
    description: string;
    changeType: ChangeType;
    schemaType: SchemaType;
}

export interface BackendActor {
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    getUserTasks: () => Promise<Task[]>;
    createTask: (title: string, description: string, column: Column) => Promise<bigint>;
    updateTaskColumn: (taskId: bigint, newColumn: Column) => Promise<void>;
    deleteTask: (taskId: bigint) => Promise<void>;
    getSchemaChangeLogs: () => Promise<SchemaChangeLog[]>;
    isCallerAdmin: () => Promise<boolean>;
    convertMarkdownToYaml: (markdown: string) => Promise<string>;
}

export const mockBackend: BackendActor = {
    getCallerUserProfile: async () => {
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : null;
    },
    saveCallerUserProfile: async (profile) => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    },
    getUserTasks: async () => {
        const tasks = localStorage.getItem('userTasks');
        return tasks ? JSON.parse(tasks, (key, value) => typeof value === 'string' && /^\d+n$/.test(value) ? BigInt(value.slice(0, -1)) : value) : [];
    },
    createTask: async (title, description, column) => {
        const tasks = await mockBackend.getUserTasks();
        const newId = BigInt(Date.now());
        const newTask: Task = {
            id: newId,
            title,
            description,
            column,
            owner: "current_user",
            createdAt: BigInt(Date.now())
        };
        tasks.push(newTask);
        localStorage.setItem('userTasks', JSON.stringify(tasks, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value));
        return newId;
    },
    updateTaskColumn: async (taskId, newColumn) => {
        const tasks = await mockBackend.getUserTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].column = newColumn;
            localStorage.setItem('userTasks', JSON.stringify(tasks, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value));
        }
    },
    deleteTask: async (taskId) => {
        const tasks = await mockBackend.getUserTasks();
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('userTasks', JSON.stringify(filteredTasks, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value));
    },
    getSchemaChangeLogs: async () => {
        return [
            {
                timestamp: BigInt(Date.now()),
                description: "Initial schema setup",
                changeType: ChangeType.fieldAdded,
                schemaType: SchemaType.task
            }
        ];
    },
    isCallerAdmin: async () => true,
    convertMarkdownToYaml: async (markdown) => "yaml: content"
};
