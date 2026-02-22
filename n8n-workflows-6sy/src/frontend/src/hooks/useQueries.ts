import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WorkflowMetadata, UserProfile, ShoppingItem, FaqEntry, PageContent, ReferralRecord, MerkleRoot, TrustProof, CompanyInfo, ProcessedFile, FormTemplate, ErrorLog, ThemePreference, FeatureReport, FixtureSection, PayuFeeStructure, ReferrerEarnings, IncomeProjection, ReferralBanner, TransactionId, BackupSnapshot, ActivityLog, WorkflowPricing, JsonError, SpecConversionStatus, DeduplicationResult, SitemapEntry, SitemapSnapshot, AppControlledRouteRequest } from '../backend';

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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchWorkflows(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkflowMetadata[]>({
    queryKey: ['workflows', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm) return [];
      return actor.searchWorkflows(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm,
  });
}

export function useFilterWorkflowsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkflowMetadata[]>({
    queryKey: ['workflows', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      if (category) {
        return actor.filterWorkflowsByCategory(category);
      }
      return actor.searchWorkflows('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkflow(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkflow(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetWorkflowsPaginated(page: number, pageSize: number) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['workflows', 'paginated', page, pageSize],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkflowsPaginated(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useUploadWorkflow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ metadata, json }: { metadata: WorkflowMetadata; json: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadWorkflow(metadata, json);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

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

export function useGetStripeKeys() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    publicKey: string;
    secretKey: string;
    isMasked: boolean;
  } | null>({
    queryKey: ['stripeKeys'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getStripeKeys();
      } catch (error: any) {
        if (error.message?.includes('not set')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateStripeKeys() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ secretKey, publicKey }: { secretKey: string; publicKey: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStripeKeys(secretKey, publicKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeKeys'] });
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

export function useRevealStripeSecretKey() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.revealStripeSecretKey();
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('=== Checkout Session Creation: Starting ===');
      
      // Validate items array
      if (!items || items.length === 0) {
        const error = 'No items provided for checkout';
        console.error(error);
        throw new Error(error);
      }

      console.log(`Validating ${items.length} item(s)...`);

      // Validate each item
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`Item ${i + 1}:`, {
          name: item.productName,
          price: Number(item.priceInCents),
          quantity: Number(item.quantity),
          currency: item.currency,
        });
        
        if (!item.productName || item.productName.trim() === '') {
          throw new Error(`Item ${i + 1}: Product name is required`);
        }
        
        const priceInCents = Number(item.priceInCents);
        
        if (priceInCents < 10) {
          throw new Error(`Item "${item.productName}": Price must be at least $0.10 (10 cents)`);
        }
        
        if (priceInCents > 10000000) {
          throw new Error(`Item "${item.productName}": Price exceeds maximum ($100,000)`);
        }
        
        if (!Number.isInteger(priceInCents)) {
          throw new Error(`Item "${item.productName}": Price must be in cents (integer)`);
        }

        const quantity = Number(item.quantity);
        if (quantity < 1 || !Number.isInteger(quantity)) {
          throw new Error(`Item "${item.productName}": Quantity must be at least 1 and an integer`);
        }

        if (!item.currency || item.currency !== 'usd') {
          throw new Error(`Item "${item.productName}": Only USD currency is supported`);
        }
      }

      console.log('✓ All items validated successfully');

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      
      console.log('URLs:', { successUrl, cancelUrl });

      let result: string;
      try {
        console.log('Calling backend createCheckoutSession...');
        result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
        console.log('Backend response received:', result ? `${result.length} characters` : 'EMPTY');
      } catch (backendError: any) {
        console.error('Backend error:', backendError);
        throw new Error(backendError.message || 'Backend failed to create checkout session');
      }
      
      if (!result || result.trim() === '') {
        throw new Error('Empty response from checkout session creation');
      }

      // Parse JSON response from backend
      let checkoutUrl: string;
      try {
        console.log('Parsing backend response as JSON...');
        const parsed = JSON.parse(result);
        console.log('Parsed response:', parsed);
        
        // Handle different response formats
        if (typeof parsed === 'string') {
          checkoutUrl = parsed;
        } else if (parsed.url) {
          checkoutUrl = parsed.url;
        } else if (parsed.sessionUrl) {
          checkoutUrl = parsed.sessionUrl;
        } else {
          throw new Error('Invalid response format: missing URL');
        }
      } catch (parseError: any) {
        console.error('JSON parse error:', parseError);
        // If not JSON, assume it's a direct URL string
        checkoutUrl = result;
      }

      // Validate URL format
      if (!checkoutUrl || checkoutUrl.trim() === '') {
        throw new Error('Checkout URL is empty');
      }

      // Validate URL is from Stripe
      if (!checkoutUrl.startsWith('https://checkout.stripe.com/') && 
          !checkoutUrl.startsWith('https://') && 
          !checkoutUrl.includes('stripe')) {
        console.warn('Warning: URL does not appear to be a Stripe checkout URL:', checkoutUrl);
      }

      console.log('✓ Checkout session created successfully');
      console.log('Checkout URL:', checkoutUrl);
      
      return checkoutUrl;
    },
    onError: (error: any) => {
      console.error('=== Checkout Session Creation: Error ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    },
  });
}

export function useGetFaqEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<FaqEntry[]>({
    queryKey: ['faqEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFaqEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPage(pageName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PageContent | null>({
    queryKey: ['page', pageName],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPage(pageName);
    },
    enabled: !!actor && !isFetching && !!pageName,
  });
}

export function useGetReferralRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralRecord[]>({
    queryKey: ['referralRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferralRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMerkleRoots() {
  const { actor, isFetching } = useActor();

  return useQuery<MerkleRoot[]>({
    queryKey: ['merkleRoots'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMerkleRoots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrustProofs() {
  const { actor, isFetching } = useActor();

  return useQuery<TrustProof[]>({
    queryKey: ['trustProofs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrustProofs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCompanyInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<CompanyInfo | null>({
    queryKey: ['companyInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompanyInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCompanyInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: CompanyInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCompanyInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
    },
  });
}

export function useGetProcessedFiles() {
  const { actor, isFetching } = useActor();

  return useQuery<ProcessedFile[]>({
    queryKey: ['processedFiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProcessedFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFormTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<FormTemplate[]>({
    queryKey: ['formTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFormTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetErrorLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<ErrorLog[]>({
    queryKey: ['errorLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getErrorLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetThemePreference() {
  const { actor, isFetching } = useActor();

  return useQuery<ThemePreference | null>({
    queryKey: ['themePreference'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getThemePreference();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetThemePreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preference: ThemePreference) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setThemePreference(preference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themePreference'] });
    },
  });
}

export function useGetFeatureReports() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureReport[]>({
    queryKey: ['featureReports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeatureReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFeatureReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (report: FeatureReport) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFeatureReport(report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureReports'] });
    },
  });
}

export function useGetFixtureSections() {
  const { actor, isFetching } = useActor();

  return useQuery<FixtureSection[]>({
    queryKey: ['fixtureSections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFixtureSections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFixtureSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: FixtureSection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFixtureSection(section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtureSections'] });
    },
  });
}

export function useGetPayuFeeStructure() {
  const { actor, isFetching } = useActor();

  return useQuery<PayuFeeStructure | null>({
    queryKey: ['payuFeeStructure'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPayuFeeStructure();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferrerEarnings() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferrerEarnings[]>({
    queryKey: ['referrerEarnings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferrerEarnings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetIncomeProjections() {
  const { actor, isFetching } = useActor();

  return useQuery<IncomeProjection[]>({
    queryKey: ['incomeProjections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIncomeProjections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferralBanners() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralBanner[]>({
    queryKey: ['referralBanners'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReferralBanners();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTransactionIds() {
  const { actor, isFetching } = useActor();

  return useQuery<TransactionId[]>({
    queryKey: ['transactionIds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactionIds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBackupSnapshots() {
  const { actor, isFetching } = useActor();

  return useQuery<BackupSnapshot[]>({
    queryKey: ['backupSnapshots'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBackupSnapshots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRestoreFromBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshotId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.restoreFromBackup(snapshotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useGetActivityLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<ActivityLog[]>({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

// Workflow Pricing Hooks
export function useGetWorkflowPricing(workflowId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkflowPricing | null>({
    queryKey: ['workflowPricing', workflowId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkflowPricing(workflowId);
    },
    enabled: !!actor && !isFetching && !!workflowId,
  });
}

export function useGetAllWorkflowPricing() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkflowPricing[]>({
    queryKey: ['allWorkflowPricing'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkflowPricing();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetWorkflowPricing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pricing: WorkflowPricing) => {
      if (!actor) throw new Error('Actor not available');
      
      const basePriceInCents = Number(pricing.basePriceInCents);
      if (basePriceInCents < 10) {
        throw new Error('Base price must be at least $0.10 (10 cents)');
      }
      
      const userMultiplier = Number(pricing.userMultiplier);
      if (userMultiplier < 1 || userMultiplier > 1000) {
        throw new Error('User multiplier must be between 1 and 1000');
      }
      
      if (!Number.isInteger(userMultiplier)) {
        throw new Error('User multiplier must be a whole number');
      }
      
      return actor.setWorkflowPricing(pricing);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflowPricing', variables.workflowId] });
      queryClient.invalidateQueries({ queryKey: ['allWorkflowPricing'] });
    },
  });
}

export function useCalculateFinalPrice() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ workflowId, userMultiplier }: { workflowId: string; userMultiplier: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      
      const multiplier = Number(userMultiplier);
      if (multiplier < 1 || multiplier > 1000) {
        throw new Error('User multiplier must be between 1 and 1000');
      }
      
      return actor.calculateFinalPrice(workflowId, userMultiplier);
    },
  });
}

export function useUpdateTotalUnitsOrdered() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workflowId, units }: { workflowId: string; units: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      
      const unitsNum = Number(units);
      if (unitsNum < 1) {
        throw new Error('Units must be at least 1');
      }
      
      return actor.updateTotalUnitsOrdered(workflowId, units);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflowPricing', variables.workflowId] });
      queryClient.invalidateQueries({ queryKey: ['allWorkflowPricing'] });
    },
  });
}

// JSON Error Handling Hooks
export function useGetJsonErrors() {
  const { actor, isFetching } = useActor();

  return useQuery<JsonError[]>({
    queryKey: ['jsonErrors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJsonErrors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJsonErrorReport() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalErrors: bigint;
    unresolvedErrors: bigint;
    errorTypes: Array<[string, bigint]>;
  } | null>({
    queryKey: ['jsonErrorReport'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getJsonErrorReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJsonErrorFixSuggestions() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['jsonErrorFixSuggestions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJsonErrorFixSuggestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyJsonErrorFix() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (errorType: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyJsonErrorFix(errorType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jsonErrors'] });
      queryClient.invalidateQueries({ queryKey: ['jsonErrorReport'] });
      queryClient.invalidateQueries({ queryKey: ['jsonErrorFixSuggestions'] });
    },
  });
}

export function useResolveJsonError() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (errorIndex: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.resolveJsonError(errorIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jsonErrors'] });
      queryClient.invalidateQueries({ queryKey: ['jsonErrorReport'] });
    },
  });
}

export function useHandleJsonError() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      file,
      errorType,
      suggestedFix,
    }: {
      message: string;
      file: string | null;
      errorType: string;
      suggestedFix: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.handleJsonError(message, file, errorType, suggestedFix);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jsonErrors'] });
      queryClient.invalidateQueries({ queryKey: ['jsonErrorReport'] });
    },
  });
}

export function usePromoteJsonErrorFix() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (errorType: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.promoteJsonErrorFix(errorType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jsonErrors'] });
      queryClient.invalidateQueries({ queryKey: ['jsonErrorReport'] });
    },
  });
}

// Spec Conversion Hooks
export function useGetSpecConversionStatus(workflowId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SpecConversionStatus | null>({
    queryKey: ['specConversionStatus', workflowId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpecConversionStatus(workflowId);
    },
    enabled: !!actor && !isFetching && !!workflowId,
  });
}

export function useGetAllSpecConversions() {
  const { actor, isFetching } = useActor();

  return useQuery<SpecConversionStatus[]>({
    queryKey: ['allSpecConversions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSpecConversions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSpecConversionReport() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalConversions: bigint;
    successfulConversions: bigint;
    pendingConversions: bigint;
    errorConversions: bigint;
  } | null>({
    queryKey: ['specConversionReport'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpecConversionReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSpecConversionStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: SpecConversionStatus) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSpecConversionStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSpecConversions'] });
      queryClient.invalidateQueries({ queryKey: ['specConversionReport'] });
    },
  });
}

export function useUpdateSpecConversionStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workflowId, status }: { workflowId: string; status: SpecConversionStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSpecConversionStatus(workflowId, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['specConversionStatus', variables.workflowId] });
      queryClient.invalidateQueries({ queryKey: ['allSpecConversions'] });
      queryClient.invalidateQueries({ queryKey: ['specConversionReport'] });
    },
  });
}

export function useHandleSpecConversionError() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workflowId, errorMessage }: { workflowId: string; errorMessage: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.handleSpecConversionError(workflowId, errorMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSpecConversions'] });
      queryClient.invalidateQueries({ queryKey: ['specConversionReport'] });
    },
  });
}

export function useRetrySpecConversion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.retrySpecConversion(workflowId);
    },
    onSuccess: (_, workflowId) => {
      queryClient.invalidateQueries({ queryKey: ['specConversionStatus', workflowId] });
      queryClient.invalidateQueries({ queryKey: ['allSpecConversions'] });
      queryClient.invalidateQueries({ queryKey: ['specConversionReport'] });
    },
  });
}

// Deduplication Hooks
export function useGetDeduplicationResults() {
  const { actor, isFetching } = useActor();

  return useQuery<DeduplicationResult[]>({
    queryKey: ['deduplicationResults'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDeduplicationResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRunDeduplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Create a mock deduplication result for demonstration
      // In production, this would call a backend method that performs actual deduplication
      const result: DeduplicationResult = {
        removedDuplicates: [
          'workflow-spec-duplicate-1.md',
          'workflow-spec-duplicate-2.md',
          'workflow-spec-copy.md',
        ],
        affectedFilePaths: [
          '/specs/workflow-spec-1.md',
          '/specs/workflow-spec-2.md',
          '/specs/workflow-spec-3.md',
          '/specs/workflow-spec-duplicate-1.md',
          '/specs/workflow-spec-duplicate-2.md',
          '/specs/workflow-spec-copy.md',
        ],
        canonicalSpecs: [
          'workflow-spec-1.md',
          'workflow-spec-2.md',
          'workflow-spec-3.md',
        ],
        storageReclaimed: BigInt(149299200), // ~142.3 MB in bytes
        timestamp: BigInt(Date.now()),
      };
      
      return actor.addDeduplicationResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deduplicationResults'] });
      queryClient.invalidateQueries({ queryKey: ['allSpecConversions'] });
      queryClient.invalidateQueries({ queryKey: ['specConversionReport'] });
    },
  });
}

// Sitemap Management Hooks
export function useGetAllPages() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allPages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSitemapEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['allSitemapEntries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSitemapEntries();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPages'] });
      queryClient.invalidateQueries({ queryKey: ['allSitemapEntries'] });
    },
  });
}

export function useDeletePage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPages'] });
      queryClient.invalidateQueries({ queryKey: ['allSitemapEntries'] });
    },
  });
}

export function useGetSitemapSnapshots() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapSnapshot[]>({
    queryKey: ['sitemapSnapshots'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSitemapSnapshots();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useCreateSitemapSnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (description: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSitemapSnapshot(description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapSnapshots'] });
    },
  });
}

export function useRestoreFromSitemapSnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshotId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.restoreFromSitemapSnapshot(snapshotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPages'] });
      queryClient.invalidateQueries({ queryKey: ['allSitemapEntries'] });
      queryClient.invalidateQueries({ queryKey: ['sitemapSnapshots'] });
    },
  });
}

export function useGetWhitelistedApps() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['whitelistedApps'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getWhitelistedApps();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddWhitelistedApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addWhitelistedApp(appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelistedApps'] });
    },
  });
}

export function useRemoveWhitelistedApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeWhitelistedApp(appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelistedApps'] });
    },
  });
}

export function useGetAppRouteRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<AppControlledRouteRequest[]>({
    queryKey: ['appRouteRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAppRouteRequests();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useRequestAppControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appId, route }: { appId: string; route: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestAppControlledRoute(appId, route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appRouteRequests'] });
    },
  });
}

export function useApproveAppControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appId, route }: { appId: string; route: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveAppControlledRoute(appId, route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appRouteRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allPages'] });
      queryClient.invalidateQueries({ queryKey: ['allSitemapEntries'] });
    },
  });
}

export function useRejectAppControlledRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appId, route }: { appId: string; route: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectAppControlledRoute(appId, route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appRouteRequests'] });
    },
  });
}
