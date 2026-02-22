import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Project, Task, ModuleMapping, UserProfile, UserRole, TaskState, Tab, Notification, FeatureStatus, SitemapNode, TabType, NotificationType, FeatureState, SecureData, PermissionRequest, SchemaValidation, ManifestLog, YamlSchema, FeatureVerification, Fixture, FixtureStatus, ExecutionLog, AiImport, ImportType, ImportStatus, NodeType, NodeTypeType, FormTemplate, PostcardContent, NodeLink, LinkType, CompressionMetric, CompressionTargetType, DeduplicationResult } from '../backend';
import { Principal } from '../lib/principal';

export function useGetAllProjects() {
    const { actor, isFetching } = useActor();

    return useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllProjects();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetAllTasks() {
    const { actor, isFetching } = useActor();

    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllTasks();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetProject(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<Project>({
        queryKey: ['project', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getProject(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetTask(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<Task>({
        queryKey: ['task', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getTask(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useCreateProject() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; description: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createProject(data.id, data.name, data.description);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
            queryClient.invalidateQueries({ queryKey: ['activeProjectCount'] });
        },
    });
}

export function useCreateTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; projectId: string; name: string; description: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createTask(data.id, data.projectId, data.name, data.description);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useUpdateProject() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; description: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateProject(data.id, data.name, data.description);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useUpdateTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; description: string; state: TaskState }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateTask(data.id, data.name, data.description, data.state);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useDeleteProject() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.archiveProject(projectId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
            queryClient.invalidateQueries({ queryKey: ['activeProjectCount'] });
        },
    });
}

export function useArchiveProject() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.archiveProject(projectId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
            queryClient.invalidateQueries({ queryKey: ['activeProjectCount'] });
        },
    });
}

export function useRestoreProject() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.restoreProject(projectId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
            queryClient.invalidateQueries({ queryKey: ['activeProjectCount'] });
        },
    });
}

export function useArchiveTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.archiveTask(taskId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useRestoreTask() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.restoreTask(taskId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useSearchProjects() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (searchTerm: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.searchProjects(searchTerm);
        },
    });
}

export function useSearchTasks() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (searchTerm: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.searchTasks(searchTerm);
        },
    });
}

export function useGetAllModuleMappings() {
    const { actor, isFetching } = useActor();

    return useQuery<ModuleMapping[]>({
        queryKey: ['moduleMappings'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllModuleMappings();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddModuleMapping() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { moduleName: string; character: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addModuleMapping(data.moduleName, data.character);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moduleMappings'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useGetApiSpec(name: string) {
    const { actor, isFetching } = useActor();

    return useQuery<string>({
        queryKey: ['apiSpec', name],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getApiSpec(name);
        },
        enabled: !!actor && !isFetching && !!name,
    });
}

export function useAddApiSpec() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; spec: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addApiSpec(data.name, data.spec);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiSpec'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: UserProfile) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
            queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
            queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
        },
    });
}

export function useGetCallerUserRole() {
    const { actor, isFetching } = useActor();

    return useQuery<UserRole>({
        queryKey: ['currentUserRole'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserRole();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useIsCallerAdmin() {
    const { actor, isFetching } = useActor();

    return useQuery<boolean>({
        queryKey: ['isAdmin'],
        queryFn: async () => {
            if (!actor) return false;
            return actor.isCallerAdmin();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useIsCallerApproved() {
    const { actor, isFetching } = useActor();

    return useQuery<boolean>({
        queryKey: ['isApproved'],
        queryFn: async () => {
            if (!actor) return false;
            return actor.isCallerApproved();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useUpdateTaskState() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { taskId: string; newState: TaskState }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateTaskState(data.taskId, data.newState);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useDeleteTasks() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskIds: string[]) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteTasks(taskIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useGetDemoData() {
    const { actor, isFetching } = useActor();

    return useQuery<{
        projects: Project[];
        tasks: Task[];
        suggestions: string[];
    }>({
        queryKey: ['demoData'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getDemoData();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useOpenTab() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; type: TabType; resourceId: string; is3D: boolean }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.openTab(data.id, data.name, data.type, data.resourceId, data.is3D);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['openTabs'] });
        },
    });
}

export function useCloseTab() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (resourceId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.closeTab(resourceId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['openTabs'] });
        },
    });
}

export function useGetOpenTabs() {
    const { actor, isFetching } = useActor();

    return useQuery<Tab[]>({
        queryKey: ['openTabs'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getOpenTabs();
        },
        enabled: !!actor && !isFetching,
        staleTime: 10000,
        refetchInterval: false,
    });
}

export function useGetActiveProjectCount() {
    const { actor, isFetching } = useActor();

    return useQuery<bigint>({
        queryKey: ['activeProjectCount'],
        queryFn: async () => {
            if (!actor) return BigInt(0);
            return actor.getActiveProjectCount();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddNotification() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; message: string; type: NotificationType }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addNotification(data.id, data.message, data.type);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useMarkNotificationAsRead() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.markNotificationAsRead(message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useGetNotifications() {
    const { actor, isFetching } = useActor();

    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getNotifications();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 10000,
    });
}

export function useUpdateFeatureStatus() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; status: FeatureState }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateFeatureStatus(data.id, data.name, data.status);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featureStatuses'] });
        },
    });
}

export function useGetFeatureStatuses() {
    const { actor, isFetching } = useActor();

    return useQuery<FeatureStatus[]>({
        queryKey: ['featureStatuses'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getFeatureStatuses();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useGetSitemap() {
    const { actor, isFetching } = useActor();

    return useQuery<SitemapNode[]>({
        queryKey: ['sitemap'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getSitemap();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 10000,
    });
}

export function useStoreSecureData() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; data: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.storeSecureData(data.id, data.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['secureData'] });
        },
    });
}

export function useRequestPermission() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dataId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.requestPermission(dataId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissionRequests'] });
        },
    });
}

export function useApprovePermissionRequest() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.approvePermissionRequest(requestId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissionRequests'] });
            queryClient.invalidateQueries({ queryKey: ['secureData'] });
        },
    });
}

export function useRejectPermissionRequest() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.rejectPermissionRequest(requestId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissionRequests'] });
        },
    });
}

export function useGetAllSecureData() {
    const { actor, isFetching } = useActor();

    return useQuery<SecureData[]>({
        queryKey: ['secureData'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllSecureData();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useGetPermissionRequests() {
    const { actor, isFetching } = useActor();

    return useQuery<PermissionRequest[]>({
        queryKey: ['permissionRequests'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getPermissionRequests();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useValidateSchema() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; schema: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.validateSchema(data.id, data.schema);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schemaValidations'] });
        },
    });
}

export function useGetSchemaValidation(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<SchemaValidation>({
        queryKey: ['schemaValidation', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getSchemaValidation(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllSchemaValidations() {
    const { actor, isFetching } = useActor();

    return useQuery<SchemaValidation[]>({
        queryKey: ['schemaValidations'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllSchemaValidations();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useLogManifestChange() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; changes: string[]; version: bigint; validationStatus: boolean }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.logManifestChange(data.id, data.changes, data.version, data.validationStatus);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
        },
    });
}

export function useGetManifestLog(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<ManifestLog>({
        queryKey: ['manifestLog', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getManifestLog(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllManifestLogs() {
    const { actor, isFetching } = useActor();

    return useQuery<ManifestLog[]>({
        queryKey: ['manifestLogs'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllManifestLogs();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useAddYamlSchema() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; content: string; isNormalized: boolean; validationStatus: boolean }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addYamlSchema(data.id, data.content, data.isNormalized, data.validationStatus);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yamlSchemas'] });
        },
    });
}

export function useGetYamlSchema(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<YamlSchema>({
        queryKey: ['yamlSchema', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getYamlSchema(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllYamlSchemas() {
    const { actor, isFetching } = useActor();

    return useQuery<YamlSchema[]>({
        queryKey: ['yamlSchemas'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllYamlSchemas();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

// Feature Verification Hooks
export function useAddFeatureVerification() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; aiVerified: boolean; adminApproved: boolean; status: string; fixtureTopic: string; fof: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addFeatureVerification(data.id, data.name, data.aiVerified, data.adminApproved, data.status as any, data.fixtureTopic, data.fof);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featureVerifications'] });
        },
    });
}

export function useGetFeatureVerification(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<FeatureVerification>({
        queryKey: ['featureVerification', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getFeatureVerification(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllFeatureVerifications() {
    const { actor, isFetching } = useActor();

    return useQuery<FeatureVerification[]>({
        queryKey: ['featureVerifications'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllFeatureVerifications();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

// Fixture Management Hooks
export function useAddFixture() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; topic: string; fof: string; status: FixtureStatus; aiDecision: boolean; adminDecision: boolean; executionLogs: string[]; merkleProof: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addFixture(data.id, data.topic, data.fof, data.status, data.aiDecision, data.adminDecision, data.executionLogs, data.merkleProof);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fixtures'] });
        },
    });
}

export function useGetFixture(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<Fixture>({
        queryKey: ['fixture', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getFixture(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllFixtures() {
    const { actor, isFetching } = useActor();

    return useQuery<Fixture[]>({
        queryKey: ['fixtures'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllFixtures();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

// Execution Log Hooks
export function useAddExecutionLog() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; action: string; target: string; result: string; merkleRoot: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addExecutionLog(data.id, data.action, data.target, data.result, data.merkleRoot);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['executionLogs'] });
        },
    });
}

export function useGetExecutionLog(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<ExecutionLog>({
        queryKey: ['executionLog', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getExecutionLog(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllExecutionLogs() {
    const { actor, isFetching } = useActor();

    return useQuery<ExecutionLog[]>({
        queryKey: ['executionLogs'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllExecutionLogs();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

// AI Import Hooks
export function useAddAiImport() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; projectId: string; taskId: string; metadata: string; importType: ImportType; status: ImportStatus; adminApproved: boolean; executionLog: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addAiImport(data.id, data.projectId, data.taskId, data.metadata, data.importType, data.status, data.adminApproved, data.executionLog);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aiImports'] });
        },
    });
}

export function useGetAiImport(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<AiImport>({
        queryKey: ['aiImport', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getAiImport(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllAiImports() {
    const { actor, isFetching } = useActor();

    return useQuery<AiImport[]>({
        queryKey: ['aiImports'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllAiImports();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

// Sphere Node Management Hooks
export function useAddSphereNode() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; type: NodeTypeType; isActive: boolean }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addSphereNode(data.id, data.name, data.type, data.isActive);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

export function useRemoveSphereNode() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; type: NodeTypeType }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.removeSphereNode(data.id, data.type);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['sitemap'] });
        },
    });
}

// Form Template Management Hooks
export function useGetAllFormTemplates() {
    const { actor, isFetching } = useActor();

    return useQuery<FormTemplate[]>({
        queryKey: ['formTemplates'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllFormTemplates();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useGetFormTemplate(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<FormTemplate>({
        queryKey: ['formTemplate', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getFormTemplate(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useCreateFormTemplate() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; formContent: string; metadata: string; detailsOfEContracts: PostcardContent[] }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createFormTemplate(data.id, data.name, data.formContent, data.metadata, data.detailsOfEContracts);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['formTemplates'] });
        },
    });
}

export function useUpdateFormTemplate() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; formContent: string; metadata: string; detailsOfEContracts: PostcardContent[] }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateFormTemplate(data.id, data.name, data.formContent, data.metadata, data.detailsOfEContracts);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['formTemplates'] });
        },
    });
}

export function useBulkImportMdFiles() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (mdFiles: [string, string][]) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.bulkImportMdFiles(mdFiles);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['formTemplates'] });
        },
    });
}

// Node Type Management Hooks
export function useGetAllNodeTypes() {
    const { actor, isFetching } = useActor();

    return useQuery<NodeType[]>({
        queryKey: ['nodeTypes'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllNodeTypes();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetNodeType(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<NodeType>({
        queryKey: ['nodeType', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getNodeType(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useCreateNodeType() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; color: string; description: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createNodeType(data.id, data.name, data.color, data.description);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodeTypes'] });
        },
    });
}

export function useUpdateNodeType() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; name: string; color: string; description: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateNodeType(data.id, data.name, data.color, data.description);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodeTypes'] });
        },
    });
}

export function useDeleteNodeType() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteNodeType(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodeTypes'] });
        },
    });
}

export function useSearchNodesByColor() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (color: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.searchNodesByColor(color);
        },
    });
}

// Node Link Management Hooks
export function useGetAllNodeLinks() {
    const { actor, isFetching } = useActor();

    return useQuery<NodeLink[]>({
        queryKey: ['nodeLinks'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllNodeLinks();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetLinksForNode(nodeId: string) {
    const { actor, isFetching } = useActor();

    return useQuery<NodeLink[]>({
        queryKey: ['nodeLinks', nodeId],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getLinksForNode(nodeId);
        },
        enabled: !!actor && !isFetching && !!nodeId,
    });
}

export function useGetBacklinksForNode(nodeId: string) {
    const { actor, isFetching } = useActor();

    return useQuery<NodeLink[]>({
        queryKey: ['backlinks', nodeId],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getBacklinksForNode(nodeId);
        },
        enabled: !!actor && !isFetching && !!nodeId,
    });
}

export function useCreateNodeLink() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            sourceNodeId: string;
            targetNodeId: string;
            linkType: LinkType;
            relationshipDepth: bigint;
            linkStrength: bigint;
            metadata: string
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createNodeLink(
                data.sourceNodeId,
                data.targetNodeId,
                data.linkType,
                data.relationshipDepth,
                data.linkStrength,
                data.metadata
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodeLinks'] });
            queryClient.invalidateQueries({ queryKey: ['backlinks'] });
        },
    });
}

export function useUpdateNodeLink() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            linkId: string;
            linkType: LinkType;
            relationshipDepth: bigint;
            linkStrength: bigint;
            metadata: string
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateNodeLink(
                data.linkId,
                data.linkType,
                data.relationshipDepth,
                data.linkStrength,
                data.metadata
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodeLinks'] });
            queryClient.invalidateQueries({ queryKey: ['backlinks'] });
        },
    });
}

export function useDeleteNodeLink() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (linkId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteNodeLink(linkId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodeLinks'] });
            queryClient.invalidateQueries({ queryKey: ['backlinks'] });
        },
    });
}

// Compression and Deduplication Hooks
export function useGetAllCompressionMetrics() {
    const { actor, isFetching } = useActor();

    return useQuery<CompressionMetric[]>({
        queryKey: ['compressionMetrics'],
        queryFn: async () => {
            if (!actor) return [];
            // Return empty array since backend doesn't have this method yet
            return [];
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useDetectDuplicates() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; targetType: CompressionTargetType }) => {
            if (!actor) throw new Error('Actor not initialized');
            // Simulated duplicate detection
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['duplicateDetections'] });
        },
    });
}

export function useRemoveDuplicates() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (detectionId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            // Simulated duplicate removal
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['duplicateDetections'] });
        },
    });
}

export function useNormalizeSchema() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; targetType: CompressionTargetType }) => {
            if (!actor) throw new Error('Actor not initialized');
            // Simulated schema normalization
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compressionMetrics'] });
        },
    });
}

export function useCompressSpecFiles() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; targetType: CompressionTargetType; originalSize: bigint; compressedSize: bigint }) => {
            if (!actor) throw new Error('Actor not initialized');
            // Simulated compression
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compressionMetrics'] });
        },
    });
}

export function useValidatePostCompression() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { metricId: string; isValid: boolean }) => {
            if (!actor) throw new Error('Actor not initialized');
            // Simulated validation
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compressionMetrics'] });
        },
    });
}

export function useOptimizeNodeModules() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; originalSize: bigint; compressedSize: bigint; duplicatesRemoved: bigint }) => {
            if (!actor) throw new Error('Actor not initialized');
            // Simulated optimization
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compressionMetrics'] });
        },
    });
}

// Spec.md Deduplication Hooks
export function useDeduplicateSpecMd() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (specContent: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deduplicateSpecMd(specContent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deduplicationResults'] });
            queryClient.invalidateQueries({ queryKey: ['manifestLogs'] });
            queryClient.invalidateQueries({ queryKey: ['featureStatuses'] });
        },
    });
}

export function useGetDeduplicationResult(id: string) {
    const { actor, isFetching } = useActor();

    return useQuery<DeduplicationResult>({
        queryKey: ['deduplicationResult', id],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getDeduplicationResult(id);
        },
        enabled: !!actor && !isFetching && !!id,
    });
}

export function useGetAllDeduplicationResults() {
    const { actor, isFetching } = useActor();

    return useQuery<DeduplicationResult[]>({
        queryKey: ['deduplicationResults'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllDeduplicationResults();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useGetLatestDeduplicationResult() {
    const { actor, isFetching } = useActor();

    return useQuery<DeduplicationResult | null>({
        queryKey: ['latestDeduplicationResult'],
        queryFn: async () => {
            if (!actor) return null;
            return actor.getLatestDeduplicationResult();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useGetDeduplicationStatus() {
    const { actor, isFetching } = useActor();

    return useQuery<{
        totalDeduplicationRuns: bigint;
        lastRunTimestamp?: bigint;
        averageCompressionRatio: number;
        totalEntriesCleaned: bigint;
    }>({
        queryKey: ['deduplicationStatus'],
        queryFn: async () => {
            if (!actor) return {
                totalDeduplicationRuns: BigInt(0),
                averageCompressionRatio: 0,
                totalEntriesCleaned: BigInt(0),
            };
            return actor.getDeduplicationStatus();
        },
        enabled: !!actor && !isFetching,
        refetchInterval: 5000,
    });
}

export function useNormalizeSpecContent() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (specContent: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.normalizeSpecContent(specContent);
        },
    });
}

export function useRecompressSpecFile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (specContent: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.recompressSpecFile(specContent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compressionMetrics'] });
        },
    });
}

export function useRefreshSchemaAfterDedup() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (deduplicationId: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.refreshSchemaAfterDedup(deduplicationId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deduplicationResults'] });
            queryClient.invalidateQueries({ queryKey: ['yamlSchemas'] });
            queryClient.invalidateQueries({ queryKey: ['schemaValidations'] });
        },
    });
}

