import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Contact, Invoice, Product, UserProfile, FeatureToggle, PaymentProviderConfig, SystemConfig, Tenant, StripeConfiguration, ShoppingItem, SitemapData } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

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
      await actor.saveCallerUserProfile(profile);
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

export function useGetContacts() {
  const { actor, isFetching } = useActor();

  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchContacts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchContacts(searchTerm);
    },
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addContact(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateContact(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteContact(contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useGetInvoices() {
  const { actor, isFetching } = useActor();

  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchInvoices() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchInvoices(searchTerm);
    },
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createInvoice(invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInvoice(invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchProducts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchProducts(searchTerm);
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
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

export function useGetFeatureToggles() {
  const { actor, isFetching } = useActor();

  return useQuery<FeatureToggle[]>({
    queryKey: ['featureToggles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeatureToggles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetFeatureToggle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toggle: FeatureToggle) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setFeatureToggle(toggle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureToggles'] });
    },
  });
}

export function useGetPaymentProviderConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentProviderConfig[]>({
    queryKey: ['paymentConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentProviderConfigs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPaymentProviderConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: PaymentProviderConfig) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addPaymentProviderConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentConfigs'] });
    },
  });
}

export function useGetSystemConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<SystemConfig[]>({
    queryKey: ['systemConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSystemConfigs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetSystemConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: SystemConfig) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setSystemConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemConfigs'] });
    },
  });
}

export function useGetTenants() {
  const { actor, isFetching } = useActor();

  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTenants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTenant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenant: Tenant) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addTenant(tenant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useImportContactsFromCSV() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (csvData: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.importContactsFromCSV(csvData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useGetSitemapData() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapData>({
    queryKey: ['sitemapData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitemapData();
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
      await actor.addManualPage(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemapData'] });
    },
  });
}
