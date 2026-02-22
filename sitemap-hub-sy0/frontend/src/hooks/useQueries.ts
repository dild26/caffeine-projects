import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  UserProfile,
  SitemapEntry,
  Referral,
  PaymentRecord,
  StripeConfiguration,
  ShoppingItem,
  UserRole,
  ControlledRoute,
} from '../backend';
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

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
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
    retry: false,
  });
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

// Sitemap Queries
export function useSearchSitemaps(searchTerm: string, limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemaps', 'search', searchTerm, limit],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm) return [];
      return actor.searchSitemaps(searchTerm, BigInt(limit));
    },
    enabled: !!actor && !isFetching && !!searchTerm,
  });
}

export function useGetAllTlds() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['tlds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTlds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSitemapCountByTld(tld: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['tldCount', tld],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getSitemapCountByTld(tld);
    },
    enabled: !!actor && !isFetching && !!tld,
  });
}

export function useAddSitemap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: SitemapEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSitemap(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemaps'] });
      queryClient.invalidateQueries({ queryKey: ['tlds'] });
    },
  });
}

// Manual Pages Queries
export function useGetManualPages() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['manualPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getManualPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManualPage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualPages'] });
    },
  });
}

// Controlled Routes Queries
export function useGetControlledRoutes() {
  const { actor, isFetching } = useActor();

  return useQuery<ControlledRoute[]>({
    queryKey: ['controlledRoutes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getControlledRoutes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ route, appId }: { route: string; appId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addControlledRoute(route, appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controlledRoutes'] });
    },
  });
}

// Referral Queries
export function useGetReferralsByReferrer(referrer: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Referral[]>({
    queryKey: ['referrals', referrer?.toString()],
    queryFn: async () => {
      if (!actor || !referrer) return [];
      return actor.getReferralsByReferrer(referrer);
    },
    enabled: !!actor && !isFetching && !!referrer,
  });
}

export function useAddReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referral: Referral) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReferral(referral);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
}

// Payment Queries
export function useGetPaymentRecord(sessionId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentRecord | null>({
    queryKey: ['payment', sessionId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPaymentRecord(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useAddPaymentRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: PaymentRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPaymentRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
    },
  });
}

// Stripe Configuration
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

// Checkout Session
export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      return JSON.parse(result) as { id: string; url: string };
    },
  });
}
