import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  Transaction,
  Subscription,
  LeaderboardEntry,
  AdminSettings,
  UserApprovalInfo,
  ApprovalStatus,
  UserRole,
  Variant_inr_usd,
  Variant_payIn_payOut,
  ContactInfo,
  FeatureStatus,
  ThemeMode,
  SystemComparison,
  TermsVersion,
  UserTermsAcceptance,
  AdminNotice,
  SitemapState,
  SitemapEntry,
  UnitValue
} from '../backend';

// User Profile Queries - Require authentication
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Approval Queries - Require authentication
export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isApproved', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isApproved'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: any; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

// Transaction Queries - Public viewing, authenticated creation
export function useGetUserTransactions() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Transaction[]>({
    queryKey: ['userTransactions', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserTransactions(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      currency,
      type
    }: {
      amount: UnitValue;
      currency: Variant_inr_usd;
      type: Variant_payIn_payOut
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTransaction(amount, currency, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
    },
  });
}

// Subscription Queries - Require authentication
export function useGetSubscription() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Subscription | null>({
    queryKey: ['subscription', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getSubscription(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllSubscriptions() {
  const { actor, isFetching } = useActor();

  return useQuery<Subscription[]>({
    queryKey: ['allSubscriptions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubscriptions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ qrc, duration }: { qrc: string; duration: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscription(qrc, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['allSubscriptions'] });
    },
  });
}

// Leaderboard Queries - Public viewing
export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateLeaderboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ totalAmount, duration }: { totalAmount: UnitValue; duration: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLeaderboard(totalAmount, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

// Admin Queries - Require admin authentication
export function useGetAdminSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminSettings>({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAdminSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversionRate,
      subscriptionFee,
      rotationCycle
    }: {
      conversionRate: UnitValue;
      subscriptionFee: UnitValue;
      rotationCycle: bigint
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdminSettings(conversionRate, subscriptionFee, rotationCycle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
}

// Contact Info Queries - Public viewing, admin updates
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactInfo: ContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

// Feature Status Queries - Public viewing, admin updates
export function useGetFeatureStatus() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (featureName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeatureStatus(featureName);
    },
  });
}

export function useGetAllFeatureStatuses() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureStatus[]>({
    queryKey: ['featureStatuses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeatureStatuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateFeatureStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      featureName,
      isCompleted,
      isAdminValidated
    }: {
      featureName: string;
      isCompleted: boolean;
      isAdminValidated: boolean
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeatureStatus(featureName, isCompleted, isAdminValidated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureStatuses'] });
    },
  });
}

// Theme Queries - Public access for all users
export function useGetTheme() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ThemeMode>({
    queryKey: ['theme', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return 'vibgyor' as ThemeMode;
      return actor.getTheme();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: ThemeMode) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setTheme(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] });
    },
  });
}

// System Comparison Queries - Public viewing, admin updates
export function useGetSystemComparison() {
  const { actor, isFetching } = useActor();

  return useQuery<SystemComparison>({
    queryKey: ['systemComparison'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSystemComparison();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSystemComparison() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comparison: SystemComparison) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSystemComparison(comparison);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemComparison'] });
    },
  });
}

// Terms of Service Queries - Public viewing, authenticated acceptance, admin publishing
export function useGetCurrentTermsVersion() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsVersion | null>({
    queryKey: ['currentTermsVersion'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentTermsVersion();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTermsVersions() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsVersion[]>({
    queryKey: ['allTermsVersions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTermsVersions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasUserAcceptedTerms() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: currentTerms } = useGetCurrentTermsVersion();

  return useQuery<boolean>({
    queryKey: ['hasAcceptedTerms', identity?.getPrincipal().toString(), currentTerms?.id.toString()],
    queryFn: async () => {
      if (!actor || !identity || !currentTerms) return true;
      return actor.hasUserAcceptedTerms(identity.getPrincipal(), currentTerms.id);
    },
    enabled: !!actor && !isFetching && !!identity && !!currentTerms,
  });
}

export function useAcceptTerms() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ termsVersionId, metadata }: { termsVersionId: bigint; metadata: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptTerms(termsVersionId, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasAcceptedTerms'] });
      queryClient.invalidateQueries({ queryKey: ['allTermsVersions'] });
    },
  });
}

export function usePublishTermsVersion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (terms: TermsVersion) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishTermsVersion(terms);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentTermsVersion'] });
      queryClient.invalidateQueries({ queryKey: ['allTermsVersions'] });
    },
  });
}

// Admin Notices Queries - Public viewing, admin creation
export function useGetActiveAdminNotices() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminNotice[]>({
    queryKey: ['activeAdminNotices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAdminNotices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAdminNotices() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminNotice[]>({
    queryKey: ['allAdminNotices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdminNotices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAdminNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notice: AdminNotice) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAdminNotice(notice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeAdminNotices'] });
      queryClient.invalidateQueries({ queryKey: ['allAdminNotices'] });
    },
  });
}

// Sitemap Queries - Public viewing, admin management
export function useGetSitemapState() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapState>({
    queryKey: ['sitemapState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitemapState();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPages() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['allPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManualPage(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapState'] });
      queryClient.invalidateQueries({ queryKey: ['allPages'] });
    },
  });
}

export function useDelegateControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ routeName, delegatedApp }: { routeName: string; delegatedApp: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.delegateControlledRoute(routeName, delegatedApp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapState'] });
    },
  });
}

// User Terms Acceptance Queries (for admin audit)
export function useGetAllUserTermsAcceptances() {
  const { actor, isFetching } = useActor();

  return useQuery<UserTermsAcceptance[]>({
    queryKey: ['allUserTermsAcceptances'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
