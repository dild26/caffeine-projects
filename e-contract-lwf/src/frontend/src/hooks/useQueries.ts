import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  SpecVersion, 
  SpecFormat, 
  SitemapEntry, 
  Theme,
  FileMetadata,
  FileUploadProgress,
  ManifestEntry,
  BackupData,
  AnalyticsData,
  ShoppingItem,
  StripeConfiguration,
  FilePair,
  PaginatedResult,
  Page,
  BusinessInfo,
  Subscription,
  SubscriptionStatus,
  Referral,
  TemplateInteraction,
  ManualPage,
  ControlledRoute
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

// Admin Queries
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

// Subscription Queries
export function useIsCallerSubscriber() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isSubscriber'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerSubscriber();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserSubscription(userPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Subscription | null>({
    queryKey: ['userSubscription', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!userPrincipal) throw new Error('User principal required');
      return actor.getUserSubscription(userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useAddSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscription: Subscription) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSubscription(subscription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isSubscriber'] });
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
}

export function useUpdateSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscription: Subscription) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSubscription(subscription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isSubscriber'] });
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
}

export function useHasEnhancedTemplateAccess() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasEnhancedTemplateAccess'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasEnhancedTemplateAccess();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Referral Queries
export function useAddReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referred: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReferral(referred);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReferrals'] });
    },
  });
}

export function useGetUserReferrals(userPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Referral[]>({
    queryKey: ['userReferrals', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!userPrincipal) throw new Error('User principal required');
      return actor.getUserReferrals(userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

// Template Interaction Queries
export function useAddTemplateInteraction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, action }: { templateId: string; action: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTemplateInteraction(templateId, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateInteractions'] });
    },
  });
}

export function useGetUserTemplateInteractions(userPrincipal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TemplateInteraction[]>({
    queryKey: ['templateInteractions', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!userPrincipal) throw new Error('User principal required');
      return actor.getUserTemplateInteractions(userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

// Specification Queries
export function useGetCurrentSpec() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SpecVersion | null>({
    queryKey: ['currentSpec'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentSpec();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000,
  });
}

export function useUpdateSpec() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, format }: { content: string; format: SpecFormat }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSpec(content, format);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSpec'] });
      queryClient.invalidateQueries({ queryKey: ['specHistory'] });
    },
  });
}

export function useGetSpecHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SpecVersion[]>({
    queryKey: ['specHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSpecHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRevertToVersion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.revertToVersion(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSpec'] });
      queryClient.invalidateQueries({ queryKey: ['specHistory'] });
    },
  });
}

// Sitemap Queries
export function useGetSitemap() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitemap();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchSitemap(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemap', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!searchTerm.trim()) {
        return actor.getSitemap();
      }
      return actor.searchSitemap(searchTerm);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddSitemapEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: SitemapEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSitemapEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

export function useRemoveSitemapEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeSitemapEntry(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

// Manual Pages Queries
export function useGetManualPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ManualPage[]>({
    queryKey: ['manualPages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getManualPages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPageByPath(path: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ManualPage | null>({
    queryKey: ['manualPage', path],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPageByPath(path);
    },
    enabled: !!actor && !actorFetching && !!path,
  });
}

export function useAddManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: ManualPage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManualPage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualPages'] });
      queryClient.invalidateQueries({ queryKey: ['resolvedSitemap'] });
    },
  });
}

export function useUpdateManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: ManualPage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateManualPage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualPages'] });
      queryClient.invalidateQueries({ queryKey: ['resolvedSitemap'] });
    },
  });
}

export function useRemoveManualPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeManualPage(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualPages'] });
      queryClient.invalidateQueries({ queryKey: ['resolvedSitemap'] });
    },
  });
}

// Controlled Routes Queries
export function useGetControlledRoutes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ControlledRoute[]>({
    queryKey: ['controlledRoutes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getControlledRoutes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetControlledRouteByPath(path: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ControlledRoute | null>({
    queryKey: ['controlledRoute', path],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getControlledRouteByPath(path);
    },
    enabled: !!actor && !actorFetching && !!path,
  });
}

export function useAddControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (route: ControlledRoute) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addControlledRoute(route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controlledRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['resolvedSitemap'] });
    },
  });
}

export function useUpdateControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (route: ControlledRoute) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateControlledRoute(route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controlledRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['resolvedSitemap'] });
    },
  });
}

export function useRemoveControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeControlledRoute(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controlledRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['resolvedSitemap'] });
    },
  });
}

// Resolved Sitemap Query
export function useResolveSitemap() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    auto: SitemapEntry[];
    manualPages: ManualPage[];
    controlledRoutes: ControlledRoute[];
  }>({
    queryKey: ['resolvedSitemap'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.resolveSitemap();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSystemPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ManualPage[]>({
    queryKey: ['systemPages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSystemPages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAdminControlledRoutes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ControlledRoute[]>({
    queryKey: ['adminControlledRoutes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminControlledRoutes();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Page Navigation Queries
export function useGetAllPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetNavigationLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['navigationLinks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getNavigationLinks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetQuickLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['quickLinks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getQuickLinks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBottomNavbarLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['bottomNavbarLinks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBottomNavbarLinks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useInitializeDefaultPages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeDefaultPages();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['navigationLinks'] });
      queryClient.invalidateQueries({ queryKey: ['quickLinks'] });
      queryClient.invalidateQueries({ queryKey: ['bottomNavbarLinks'] });
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
    },
  });
}

export function useValidateNavigationLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['validateNavigation'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateNavigationLinks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkFeatureAsCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (featureName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markFeatureAsCompleted(featureName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

// Business Information Queries
export function useGetBusinessInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BusinessInfo>({
    queryKey: ['businessInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBusinessInfo();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateBusinessInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: BusinessInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBusinessInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessInfo'] });
    },
  });
}

export function useValidateBusinessInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['validateBusinessInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateBusinessInfo();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Theme Queries
export function useGetCurrentTheme() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Theme>({
    queryKey: ['currentTheme'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentTheme();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useToggleTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleTheme();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentTheme'] });
    },
  });
}

// File Upload Queries
export function useAddFileMetadata() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metadata: FileMetadata) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFileMetadata(metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['filePairs'] });
    },
  });
}

export function useUpdateUploadProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: FileUploadProgress) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUploadProgress(progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadProgress'] });
    },
  });
}

// File Pairing Queries
export function useGetAllFilePairs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FilePair[]>({
    queryKey: ['filePairs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllFilePairs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPairingErrors() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['pairingErrors'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPairingErrors();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Pagination Queries
export function usePaginateFiles(page: number, pageSize: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PaginatedResult>({
    queryKey: ['files', 'paginated', page, pageSize],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.paginateFiles(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !actorFetching,
  });
}

// Hash Masking Query
export function useMaskHash(hash: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['maskHash', hash],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.maskHash(hash);
    },
    enabled: !!actor && !actorFetching && !!hash,
  });
}

// Analytics Queries
export function useGetAnalyticsData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsData();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Manifest Log Queries
export function useGetManifestLog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ManifestEntry[]>({
    queryKey: ['manifestLog'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getManifestLog();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddManifestEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, details }: { action: string; details: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addManifestEntry(action, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifestLog'] });
    },
  });
}

// Backup Queries
export function useCreateBackup() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBackup();
    },
  });
}

export function useRestoreBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backup: BackupData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.restoreBackup(backup);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// Stripe Queries
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

export function useGetStripeConfiguration() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StripeConfiguration | null>({
    queryKey: ['stripeConfiguration'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStripeConfiguration();
    },
    enabled: !!actor && !actorFetching,
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
      queryClient.invalidateQueries({ queryKey: ['stripeConfiguration'] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      return JSON.parse(result) as { id: string; url: string };
    },
  });
}
