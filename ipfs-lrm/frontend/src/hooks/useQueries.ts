import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

export function useGetPythonFiles() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['python-files'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPythonFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferralTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['referral-transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferralTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSpecFileStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['spec-file-status'],
    queryFn: async () => {
      if (!actor) return 'spec.md';
      return actor.getSpecFileStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCheckAndConvertSpecFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkAndConvertSpecFile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spec-file-status'] });
    },
  });
}

export function useDeduplicateSpecFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deduplicateSpecFile(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spec-file-status'] });
    },
  });
}

export function useFetchIPFSContent(url: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['ipfs-content', url],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.fetchIPFSContent(url);
    },
    enabled: !!actor && !isFetching && !!url,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCheckIPFSHealth() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['ipfs-health'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkIPFSHealth();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStorePythonFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { fileName: string; content: string }>({
    mutationFn: async ({ fileName, content }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.storePythonFile(fileName, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['python-files'] });
    },
  });
}

export function useStoreReferralTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { transactionId: string; details: string }>({
    mutationFn: async ({ transactionId, details }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.storeReferralTransaction(transactionId, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-transactions'] });
    },
  });
}

// ===== User Profile Queries =====

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

  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
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
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// ===== Sitemap Pages Queries =====

export function useGetPages() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: async (newPage: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addPage(newPage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}
