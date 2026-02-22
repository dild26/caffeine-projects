import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Model,
  ModelScore,
  RoutingCondition,
} from '../backend';

export interface UserProfile {
  name: string;
}
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      // Mock profile for demo
      return { name: 'Admin User' };
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
  });
}

// Model Queries
export function useModels() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getModels();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useTopModels(limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Model[]>({
    queryKey: ['topModels', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopModels(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEvaluateModel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.evaluateModel(modelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Evaluation cycle triggered');
    },
    onError: (error: Error) => {
      toast.error(`Evaluation failed: ${error.message}`);
    },
  });
}

// Routing Queries
export function useRoutingSuggestion() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (condition: RoutingCondition) => {
      if (!actor) throw new Error('Actor not available');
      return actor.suggestRoute(condition);
    },
  });
}

// Benchmark Queries
export function useHistoricalBenchmarks(modelId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['benchmarks', modelId?.toString()],
    queryFn: async () => {
      if (!actor || !modelId) return [];
      return actor.getHistoricalBenchmarks(modelId);
    },
    enabled: !!actor && !isFetching && !!modelId,
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      // For demo parity, we'll assume any logged in user can view admin
      return true;
    },
    enabled: !!actor && !isFetching,
  });
}
