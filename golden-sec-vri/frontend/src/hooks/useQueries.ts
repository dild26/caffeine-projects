import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Property,
  BlogPost,
  Feature,
  Task,
  UserProfile,
  FAQ,
  SocialMediaPlatform,
  Sitemap,
  SitemapEntry,
  Fixtures,
  ReferralProgram,
  EarningOpportunity,
  ProfitShareDetails,
  LevelStructure,
  UniqueNonceSystem,
  RunningBalanceTracking,
  ReferralMessage,
  USPContent,
  MenuItem,
  UnitValue,
} from '../backend';
import { ExternalBlob } from '../backend';

// Property queries
export function useGetProperties() {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProperty(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Property | null>({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUploadProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: Property) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadProperty(property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['systemStats'] });
    },
  });
}

export function useUpdatePropertyPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newPrice }: { id: string; newPrice: UnitValue }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePropertyPrice(id, newPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Node management queries
export function useAddNodeToProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, latitude, longitude, altitude }: { propertyId: string; latitude: UnitValue; longitude: UnitValue; altitude: UnitValue }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNodeToProperty(propertyId, latitude, longitude, altitude);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyNodes', variables.propertyId] });
    },
  });
}

export function useRemoveNodeFromProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, nodeId }: { propertyId: string; nodeId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeNodeFromProperty(propertyId, nodeId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['propertyNodes', variables.propertyId] });
    },
  });
}

export function useGetPropertyNodes(propertyId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['propertyNodes', propertyId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertyNodes(propertyId);
    },
    enabled: !!actor && !isFetching && !!propertyId,
  });
}

// Blog queries
export function useGetPublishedBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['publishedBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['allBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['systemStats'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(id, title, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
    },
  });
}

export function useSetBlogPostPublished() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setBlogPostPublished(id, published);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['allBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedBlogPosts'] });
    },
  });
}

// Feature queries
export function useGetFeatures() {
  const { actor, isFetching } = useActor();

  return useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeatures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFeature() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, tasks, category, priority, fixture }: { name: string; tasks: Task[]; category: string; priority: bigint; fixture: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFeature(name, tasks, category, priority, fixture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      queryClient.invalidateQueries({ queryKey: ['systemStats'] });
    },
  });
}

export function useUpdateFeatureVerification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ featureId, aiVerified, manuallyVerified }: { featureId: string; aiVerified: boolean; manuallyVerified: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeatureVerification(featureId, aiVerified, manuallyVerified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}

// User profile queries
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
      queryClient.invalidateQueries({ queryKey: ['systemStats'] });
    },
  });
}

// System stats query
export function useGetSystemStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['systemStats'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSystemStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin status query
export function useGetAdminStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['adminStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminStatus();
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

// Admin check query
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// FAQ queries
export function useGetFAQs() {
  const { actor, isFetching } = useActor();

  return useQuery<FAQ[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFAQs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFAQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, answer, order }: { question: string; answer: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFAQ(question, answer, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useUpdateFAQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, question, answer, order }: { id: string; question: string; answer: string; order: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFAQ(id, question, answer, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useDeleteFAQ() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFAQ(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useSearchFAQs(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<FAQ[]>({
    queryKey: ['faqs', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchFAQs(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm,
  });
}

// Client-side FAQ integrity check
export function useCheckFAQIntegrity() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['faqIntegrity'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkFAQIntegrity();
    },
    enabled: !!actor && !isFetching,
  });
}

// Client-side sitemap integrity check
export function useCheckSitemapIntegrity() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['sitemapIntegrity'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkSitemapIntegrity();
    },
    enabled: !!actor && !isFetching,
  });
}

// Run data integrity tests
export function useRunDataIntegrityTests() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.runDataIntegrityTests();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqIntegrity'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapIntegrity'] });
    },
  });
}

// Social Media Platform queries
export function useGetSocialMediaPlatforms() {
  const { actor, isFetching } = useActor();

  return useQuery<SocialMediaPlatform[]>({
    queryKey: ['socialMediaPlatforms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSocialMediaPlatforms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetActiveSocialMediaPlatforms() {
  const { actor, isFetching } = useActor();

  return useQuery<SocialMediaPlatform[]>({
    queryKey: ['activeSocialMediaPlatforms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveSocialMediaPlatforms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSocialMediaPlatform() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, displayOrder, active }: { url: string; displayOrder: bigint; active: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSocialMediaPlatform(url, displayOrder, active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaPlatforms'] });
      queryClient.invalidateQueries({ queryKey: ['activeSocialMediaPlatforms'] });
    },
  });
}

export function useUpdateSocialMediaPlatform() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, url, displayOrder, active }: { id: string; url: string; displayOrder: bigint; active: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSocialMediaPlatform(id, url, displayOrder, active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaPlatforms'] });
      queryClient.invalidateQueries({ queryKey: ['activeSocialMediaPlatforms'] });
    },
  });
}

export function useDeleteSocialMediaPlatform() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSocialMediaPlatform(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaPlatforms'] });
      queryClient.invalidateQueries({ queryKey: ['activeSocialMediaPlatforms'] });
    },
  });
}

export function useInitializeDefaultSocialMediaPlatforms() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeDefaultSocialMediaPlatforms();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaPlatforms'] });
      queryClient.invalidateQueries({ queryKey: ['activeSocialMediaPlatforms'] });
    },
  });
}

// Sitemap queries
export function useGetSitemap() {
  const { actor, isFetching } = useActor();

  return useQuery<Sitemap | null>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSitemap();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRawSitemapXml() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['rawSitemapXml'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getRawSitemapXml();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRobotsTxt() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['robotsTxt'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getRobotsTxt();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateSitemap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entries, rawXml }: { entries: SitemapEntry[]; rawXml: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateSitemap(entries, rawXml);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      queryClient.invalidateQueries({ queryKey: ['rawSitemapXml'] });
    },
  });
}

// Fixtures queries
export function useGetAllFixtures() {
  const { actor, isFetching } = useActor();

  return useQuery<Fixtures[]>({
    queryKey: ['allFixtures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFixtures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFixtures(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Fixtures | null>({
    queryKey: ['fixtures', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFixtures(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateOrUpdateFixtures() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      merkleRoot: string;
      verkleLeaves: string[];
      proofStatus: string;
      verificationResult: string;
      autoUpdateRecommendations: string[];
      discrepancyResolution: string;
      recalculationHistory: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateFixtures(
        params.id,
        params.merkleRoot,
        params.verkleLeaves,
        params.proofStatus,
        params.verificationResult,
        params.autoUpdateRecommendations,
        params.discrepancyResolution,
        params.recalculationHistory
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFixtures'] });
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

// Referral Program queries
export function useGetAllReferralPrograms() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralProgram[]>({
    queryKey: ['referralPrograms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReferralPrograms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferralProgram(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralProgram | null>({
    queryKey: ['referralProgram', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReferralProgram(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// Gallery queries
export function useGetPropertyGallery(propertyId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob[]>({
    queryKey: ['propertyGallery', propertyId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertyGallery(propertyId);
    },
    enabled: !!actor && !isFetching && !!propertyId,
  });
}

export function useAddImageToPropertyGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, image }: { propertyId: string; image: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addImageToPropertyGallery(propertyId, image);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['propertyGallery', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useRemoveImageFromPropertyGallery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, imageIndex }: { propertyId: string; imageIndex: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeImageFromPropertyGallery(propertyId, imageIndex);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['propertyGallery', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Menu Item queries
export function useGetMenuItems() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalyzeMenuStructure() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['menuAnalysis'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.analyzeMenuStructure();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCorrectedMenuStructure() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['correctedMenuStructure'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCorrectedMenuStructure();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEnsureCriticalMenuItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.ensureCriticalMenuItems();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuAnalysis'] });
      queryClient.invalidateQueries({ queryKey: ['correctedMenuStructure'] });
    },
  });
}
