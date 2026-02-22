import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, SyncLog, RouteConfig, SecoinfiApp } from '../backend';
import { toast } from 'sonner';

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
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSpecFile(filename: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['specFile', filename],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSpecFile(filename);
    },
    enabled: !!actor && !actorFetching && !!filename,
  });
}

export function useUpdateSpecYaml() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSpecYaml(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFile'] });
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
      queryClient.invalidateQueries({ queryKey: ['secoinfiApps'] });
      toast.success('spec.yaml updated and synced successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update spec.yaml: ${error.message}`);
    },
  });
}

export function useManualSync() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.manualSync();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFile'] });
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
      queryClient.invalidateQueries({ queryKey: ['secoinfiApps'] });
      toast.success('Manual synchronization completed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Synchronization failed: ${error.message}`);
    },
  });
}

export function useCleanDuplicates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.cleanDuplicates();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specFile'] });
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
      queryClient.invalidateQueries({ queryKey: ['secoinfiApps'] });
      toast.success('Duplicates cleaned and markdown regenerated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to clean duplicates: ${error.message}`);
    },
  });
}

export function useGetSyncStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    status: string;
    history: Array<SyncLog>;
    lastSyncTime: bigint;
  }>({
    queryKey: ['syncStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSyncStatus();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}

export function useGetAllRouteConfigs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RouteConfig[]>({
    queryKey: ['routeConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRouteConfigs();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000,
  });
}

export function useGetRouteConfig(path: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RouteConfig | null>({
    queryKey: ['routeConfig', path],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRouteConfig(path);
    },
    enabled: !!actor && !actorFetching && !!path,
  });
}

export function useSetRouteConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path, requiresAuth, role }: { path: string; requiresAuth: boolean; role: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setRouteConfig(path, requiresAuth, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeConfigs'] });
      toast.success('Route configuration updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update route configuration: ${error.message}`);
    },
  });
}

export function useGetAllSecoinfiApps() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SecoinfiApp[]>({
    queryKey: ['secoinfiApps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSecoinfiApps();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

export function useSearchSecoinfiApps(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SecoinfiApp[]>({
    queryKey: ['secoinfiApps', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm.trim()) return [];
      return actor.searchSecoinfiApps(searchTerm);
    },
    enabled: !!actor && !actorFetching && !!searchTerm.trim(),
  });
}
