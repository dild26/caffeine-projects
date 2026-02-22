import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Local type definition for BroadcastPage (not yet in backend interface)
export interface BroadcastPage {
  id: bigint;
  name: string;
  url: string;
  content: string;
  broadcastStatus: string;
  targetApps: string[];
  lastUpdated: bigint;
  createdBy: string;
}

export function useGetAllBroadcastPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BroadcastPage[]>({
    queryKey: ['broadcastPages'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented
      console.warn('Backend getAllBroadcastPages method not yet implemented');
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBroadcastPage(pageId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BroadcastPage | null>({
    queryKey: ['broadcastPage', pageId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not yet implemented
      console.warn('Backend getBroadcastPage method not yet implemented');
      return null;
    },
    enabled: !!actor && !actorFetching && pageId > 0n,
  });
}

export function useCreateBroadcastPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<BroadcastPage, 'id' | 'lastUpdated' | 'createdBy'>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend createBroadcastPage method not yet implemented');
      return BigInt(Date.now());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcastPages'] });
    },
  });
}

export function useUpdateBroadcastPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BroadcastPage) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend updateBroadcastPage method not yet implemented');
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['broadcastPages'] });
      queryClient.invalidateQueries({ queryKey: ['broadcastPage', variables.id.toString()] });
    },
  });
}

export function useDeleteBroadcastPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend deleteBroadcastPage method not yet implemented');
      return pageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcastPages'] });
    },
  });
}

export function useBroadcastToApps() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { pageId: bigint; targetApps: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      console.warn('Backend broadcast method not yet implemented');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcastPages'] });
    },
  });
}
