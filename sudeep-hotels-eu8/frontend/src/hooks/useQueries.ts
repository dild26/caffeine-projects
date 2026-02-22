import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Task,
  DataObject,
  ContactData,
  IntegrityLog,
  SyncOperation,
  ClonedPage,
  SitemapEntry,
  SearchIndex,
  ThemeConfig,
  UserProfile,
  TaskEvent,
  MenuItem,
  MenuAuditLog,
  VerificationResult,
  ControlledRoute,
} from '../backend';

// User Profile Queries
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Task Queries
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

export function useGetTask(taskId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Task | null>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTask(taskId);
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

export function useGetTaskEvents(taskId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TaskEvent[]>({
    queryKey: ['taskEvents', taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTaskEvents(taskId);
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Data Object Queries
export function useGetAllDataObjects() {
  const { actor, isFetching } = useActor();

  return useQuery<DataObject[]>({
    queryKey: ['dataObjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDataObjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDataObject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dataObject: DataObject) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDataObject(dataObject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataObjects'] });
    },
  });
}

// Contact Data Queries
export function useGetAllContactData() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactData[]>({
    queryKey: ['contactData'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchExternalContactData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.fetchExternalContactData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactData'] });
    },
  });
}

// Integrity Logs Queries
// Note: Backend stores logs keyed by ID, so we query with a default key
export function useGetIntegrityLogs(logId: string = 'system') {
  const { actor, isFetching } = useActor();

  return useQuery<IntegrityLog[]>({
    queryKey: ['integrityLogs', logId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIntegrityLogs(logId);
    },
    enabled: !!actor && !isFetching,
  });
}

// Sync Operations Queries
// Note: Backend stores operations keyed by ID, so we query with a default key
export function useGetSyncOperations(operationId: string = 'system') {
  const { actor, isFetching } = useActor();

  return useQuery<SyncOperation[]>({
    queryKey: ['syncOperations', operationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSyncOperations(operationId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchExternalSyncData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.fetchExternalSyncData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syncOperations'] });
    },
  });
}

// Cloned Pages Queries (Public - no authentication required)
export function useGetAllClonedPages() {
  const { actor, isFetching } = useActor();

  return useQuery<ClonedPage[]>({
    queryKey: ['clonedPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClonedPages();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetClonedPage(pageId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ClonedPage | null>({
    queryKey: ['clonedPage', pageId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getClonedPage(pageId);
    },
    enabled: !!actor && !isFetching && !!pageId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Sitemap Cloning Mutation
export function useCloneSitemapPages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.cloneSitemapPages();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clonedPages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapEntries'] });
      queryClient.invalidateQueries({ queryKey: ['syncOperations'] });
      queryClient.invalidateQueries({ queryKey: ['themeConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

// Sitemap Queries (Public - no authentication required)
export function useGetAllSitemapEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemapEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSitemapEntries();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

// Search Index Queries (Public - no authentication required)
export function useGetAllSearchIndexes() {
  const { actor, isFetching } = useActor();

  return useQuery<SearchIndex[]>({
    queryKey: ['searchIndexes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSearchIndexes();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

// Theme Configuration Queries (Public - no authentication required)
export function useGetAllThemeConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<ThemeConfig[]>({
    queryKey: ['themeConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllThemeConfigs();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetThemeConfig(configId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ThemeConfig | null>({
    queryKey: ['themeConfig', configId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getThemeConfig(configId);
    },
    enabled: !!actor && !isFetching && !!configId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

// Menu Items Queries (Public - no authentication required)
export function useGetAllMenuItems() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMenuItems();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetMenuItem(menuItemId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem | null>({
    queryKey: ['menuItem', menuItemId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMenuItem(menuItemId);
    },
    enabled: !!actor && !isFetching && !!menuItemId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMenuItem(menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMenuItem(menuItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

// Menu Audit Logs Queries (Public - no authentication required)
export function useGetMenuAuditLogs(menuItemId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MenuAuditLog[]>({
    queryKey: ['menuAuditLogs', menuItemId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuAuditLogs(menuItemId);
    },
    enabled: !!actor && !isFetching && !!menuItemId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

// Verification Results Queries (Public - no authentication required)
export function useGetAllVerificationResults() {
  const { actor, isFetching } = useActor();

  return useQuery<VerificationResult[]>({
    queryKey: ['verificationResults'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVerificationResults();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetVerificationResult(resultId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VerificationResult | null>({
    queryKey: ['verificationResult', resultId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVerificationResult(resultId);
    },
    enabled: !!actor && !isFetching && !!resultId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

// Manual Pages Queries (Public - no authentication required)
export function useGetAllManualPages() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['manualPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllManualPages();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageSlug: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManualPage(pageSlug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualPages'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

export function useRemoveManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageSlug: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeManualPage(pageSlug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualPages'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

// Controlled Routes Queries (Public - no authentication required)
export function useGetAllControlledRoutes() {
  const { actor, isFetching } = useActor();

  return useQuery<ControlledRoute[]>({
    queryKey: ['controlledRoutes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllControlledRoutes();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetControlledRoute(path: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ControlledRoute | null>({
    queryKey: ['controlledRoute', path],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getControlledRoute(path);
    },
    enabled: !!actor && !isFetching && !!path,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path, appController }: { path: string; appController: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addControlledRoute(path, appController);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controlledRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

export function useRemoveControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeControlledRoute(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controlledRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['verificationResults'] });
    },
  });
}

// Admin Check (requires authentication)
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        // If unauthorized, return false instead of throwing
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
