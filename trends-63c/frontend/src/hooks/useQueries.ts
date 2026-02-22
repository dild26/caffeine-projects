import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { TopicSummary, Topic, TopicInput, PaginatedTopics, StaticPage, Leaderboard, UserProfile, VoteAction } from '../backend';

export function useGetPaginatedTopics(page: number = 1, pageSize: number = 20) {
  const { actor, isFetching } = useActor();

  return useQuery<PaginatedTopics>({
    queryKey: ['topics', 'paginated', page, pageSize],
    queryFn: async () => {
      if (!actor) {
        return {
          topics: [],
          pagination: {
            currentPage: BigInt(1),
            totalPages: BigInt(1),
            pageSize: BigInt(pageSize),
            totalItems: BigInt(0),
            hasNext: false,
            hasPrevious: false,
          },
        };
      }
      return actor.getPaginatedTopics(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTopics(limit: number = 1000) {
  const { actor, isFetching } = useActor();

  return useQuery<TopicSummary[]>({
    queryKey: ['topics', 'all', limit],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getPaginatedTopics(BigInt(1), BigInt(limit));
      return result.topics;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTopicBySlug(slug: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Topic | null>({
    queryKey: ['topic', slug],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTopicBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useGetTopicCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['topicCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTopicCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TopicInput) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createTopic(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicCount'] });
    },
  });
}

export function useRefreshTopics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.refreshTopics();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicCount'] });
    },
  });
}

export function useHideTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.hideTopic(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
}

export function useDeleteTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteTopic(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['topicCount'] });
    },
  });
}

export function useGetStaticPage(slug: string) {
  const { actor, isFetching } = useActor();

  return useQuery<StaticPage | null>({
    queryKey: ['staticPage', slug],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStaticPage(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useGetAllStaticPages() {
  const { actor, isFetching } = useActor();

  return useQuery<StaticPage[]>({
    queryKey: ['staticPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaticPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVoteTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: bigint; action: VoteAction }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.voteTopic(id, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['topic'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIncrementClickCount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.incrementClickCount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['topic'] });
    },
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<Leaderboard>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) {
        return {
          topTopics: [],
          topVoters: [],
        };
      }
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
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
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}
