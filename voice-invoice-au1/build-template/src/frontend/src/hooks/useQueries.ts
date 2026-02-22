import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  Transaction,
  PoojaRitual,
  TrustAccount,
  VoiceInvoiceDraft,
  MerkleProof,
  SitemapResponse,
  Page,
  PageType,
} from '../backend';
import { toast } from 'sonner';

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
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Transaction Queries
export function useGetMyTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['myTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTransactions();
    },
    enabled: !!actor && !isFetching,
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
    mutationFn: async (transaction: Transaction) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    },
  });
}

// Pooja Ritual Queries
export function useGetAllPoojaRituals() {
  const { actor, isFetching } = useActor();

  return useQuery<PoojaRitual[]>({
    queryKey: ['poojaRituals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPoojaRituals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPoojaRitual() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ritual: PoojaRitual) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPoojaRitual(ritual);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poojaRituals'] });
      toast.success('Pooja ritual added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add ritual: ${error.message}`);
    },
  });
}

// Trust Account Queries
export function useGetAllTrustAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery<TrustAccount[]>({
    queryKey: ['trustAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrustAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTrustAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: TrustAccount) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTrustAccount(account);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustAccounts'] });
      toast.success('Trust account added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add trust account: ${error.message}`);
    },
  });
}

// Voice Invoice Draft Queries
export function useGetMyVoiceInvoiceDrafts() {
  const { actor, isFetching } = useActor();

  return useQuery<VoiceInvoiceDraft[]>({
    queryKey: ['myVoiceInvoiceDrafts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyVoiceInvoiceDrafts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVoiceInvoiceDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: VoiceInvoiceDraft) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createVoiceInvoiceDraft(draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVoiceInvoiceDrafts'] });
      toast.success('Voice invoice draft created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create draft: ${error.message}`);
    },
  });
}

// Merkle Proof Queries
export function useVerifyMerkleProof() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyMerkleProof(transactionId);
    },
  });
}

export function useGetMerkleProof(transactionId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MerkleProof | null>({
    queryKey: ['merkleProof', transactionId],
    queryFn: async () => {
      if (!actor || !transactionId) return null;
      return actor.getMerkleProof(transactionId);
    },
    enabled: !!actor && !isFetching && !!transactionId,
  });
}

// Admin Queries
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

// Sitemap Queries
export function useGetSitemap() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapResponse>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitemap();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPages() {
  const { actor, isFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, pageType }: { slug: string; pageType: PageType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPage(slug, pageType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success('Page added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add page: ${error.message}`);
    },
  });
}
