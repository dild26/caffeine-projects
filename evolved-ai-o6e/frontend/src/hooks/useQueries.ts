import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ModuleConfig, Blueprint, Fixture, UserProfile, MenuItem } from '../backend';

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

// Module Configuration Queries
export function useGetAllModuleConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<ModuleConfig[]>({
    queryKey: ['moduleConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllModuleConfigs();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds for multi-admin collaboration
  });
}

export function useGetModuleConfig(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ModuleConfig | null>({
    queryKey: ['moduleConfig', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModuleConfig(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUpdateModuleConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: ModuleConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateModuleConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['moduleConfig'] });
      queryClient.invalidateQueries({ queryKey: ['enabledModules'] });
    },
  });
}

export function useDeleteModuleConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteModuleConfig(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['enabledModules'] });
    },
  });
}

export function useGetEnabledModules() {
  const { actor, isFetching } = useActor();

  return useQuery<ModuleConfig[]>({
    queryKey: ['enabledModules'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEnabledModules();
    },
    enabled: !!actor && !isFetching,
  });
}

// Blueprint Queries
export function useGetAllBlueprints() {
  const { actor, isFetching } = useActor();

  return useQuery<Blueprint[]>({
    queryKey: ['blueprints'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlueprints();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds for multi-admin collaboration
  });
}

export function useAddBlueprint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blueprint: Blueprint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBlueprint(blueprint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
}

export function useUpdateBlueprint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blueprint: Blueprint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlueprint(blueprint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
}

export function useDeleteBlueprint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlueprint(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
}

export function useImportYamlPipeline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, instructions }: { id: string; name: string; instructions: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.importYamlPipeline(id, name, instructions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });
}

// Fixture Queries
export function useGetAllFixtures() {
  const { actor, isFetching } = useActor();

  return useQuery<Fixture[]>({
    queryKey: ['fixtures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFixtures();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds for multi-admin collaboration
  });
}

export function useAddFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fixture: Fixture) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFixture(fixture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

export function useUpdateFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fixture: Fixture) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFixture(fixture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

export function useDeleteFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFixture(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

export function useImportCsvFixture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, data }: { id: string; name: string; data: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.importCsvFixture(id, name, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

// Initialize Default Modules
export function useInitializeDefaultModules() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeDefaultModules();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['enabledModules'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

// Menu Item Queries
export function useGetAllMenuItems() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMenuItems();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds for multi-admin collaboration
  });
}

export function useSearchMenuItems(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm.trim()) return [];
      return actor.searchMenuItems(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm.trim(),
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMenuItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}
