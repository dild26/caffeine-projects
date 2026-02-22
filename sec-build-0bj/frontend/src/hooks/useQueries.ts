import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Block, Connection } from '../types';
import type { Workspace, WorkspaceData, BlockConfig, UserProfile, UserSubscription, PaymentTransaction, ShoppingItem, SubscriptionPlan, AdminPage, ControlledRoute, AutoRoute, PageMetadata } from '../backend';

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
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useWorkspaceQueries() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaces();
    },
    enabled: !!actor && !isFetching,
  });

  const saveWorkspaceMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      blocks,
      connections,
      version
    }: {
      id: string;
      name: string;
      description: string;
      blocks: Block[];
      connections: Connection[];
      version?: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');

      const blockConfigs: BlockConfig[] = blocks.map(block => ({
        id: block.id,
        blockType: block.type,
        position: {
          x: BigInt(Math.round(block.position.x)),
          y: BigInt(Math.round(block.position.y))
        },
        config: JSON.stringify(block.config)
      }));

      const workspaceData: WorkspaceData = {
        blocks: blockConfigs,
        connections: connections
      };

      await actor.saveWorkspace(id, name, description, workspaceData, version || BigInt(1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    }
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteWorkspace(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    }
  });

  return {
    workspaces: workspacesQuery.data,
    isLoadingWorkspaces: workspacesQuery.isLoading,
    saveWorkspace: saveWorkspaceMutation,
    deleteWorkspace: deleteWorkspaceMutation
  };
}

// Stripe Payment Queries
export function useGetCallerSubscription() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserSubscription | null>({
    queryKey: ['callerSubscription'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerSubscription();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetCallerPaymentHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PaymentTransaction[]>({
    queryKey: ['callerPaymentHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerPaymentHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[], successUrl: string, cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      return JSON.parse(result) as { id: string; url: string };
    }
  });
}

export function useTrackExecution() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.trackExecution(workspaceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerSubscription'] });
    }
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Sitemap Management Queries
export function useGetAdminPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminPage[]>({
    queryKey: ['adminPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminPages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetControlledRoutes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ControlledRoute[]>({
    queryKey: ['controlledRoutes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getControlledRoutes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllRoutes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    autoRoutes: AutoRoute[];
    adminPriorityPages: AdminPage[];
    controlledRoutes: ControlledRoute[];
    pageMetadata: PageMetadata[];
  }>({
    queryKey: ['allRoutes'],
    queryFn: async () => {
      if (!actor) return {
        autoRoutes: [],
        adminPriorityPages: [],
        controlledRoutes: [],
        pageMetadata: []
      };
      return actor.getAllRoutes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddAdminPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addAdminPage(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPages'] });
      queryClient.invalidateQueries({ queryKey: ['allRoutes'] });
    }
  });
}

export function useAddPageMetadata() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, hash, adminSignature }: { page: string; hash: string; adminSignature: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addPageMetadata(page, hash, adminSignature);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRoutes'] });
    }
  });
}

export function useResolveRoute() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (route: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.resolveRoute(route);
    }
  });
}
