import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Incident, DataSource, Report, UserRole, YamlConfig } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

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

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Incident Queries
export function useGetIncidents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncidents();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetIncidentById(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Incident | null>({
    queryKey: ['incident', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getIncidentById(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useAddIncident() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (incident: Incident) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addIncident(incident);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useUpdateIncidentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateIncidentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useDeleteIncident() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteIncident(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

// Data Source Queries
export function useGetDataSources() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DataSource[]>({
    queryKey: ['dataSources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDataSources();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddDataSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dataSource: DataSource) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDataSource(dataSource);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
    },
  });
}

export function useVerifyDataSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyDataSource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
    },
  });
}

export function useDeleteDataSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDataSource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
    },
  });
}

// Report Queries
export function useGetReports() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetReportById(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Report | null>({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReportById(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useCreateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (report: Report) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReport(report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReport(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

// YAML Configuration Queries
export function useGetYamlConfigs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<YamlConfig[]>({
    queryKey: ['yamlConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getYamlConfigs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetLatestYamlConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<YamlConfig | null>({
    queryKey: ['latestYamlConfig'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestYamlConfig();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddYamlConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: YamlConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addYamlConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yamlConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['latestYamlConfig'] });
    },
  });
}

export function useDeleteYamlConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteYamlConfig(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yamlConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['latestYamlConfig'] });
    },
  });
}
