import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ShoppingItem, StripeSessionStatus } from '@/backend';
import { toast } from 'sonner';

// Check if Stripe is configured
export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Create Stripe checkout session
export function useCreateCheckoutSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      items, 
      successUrl, 
      cancelUrl 
    }: { 
      items: ShoppingItem[]; 
      successUrl: string; 
      cancelUrl: string; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Create checkout session via backend
      const sessionJson = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      
      // Parse the JSON response
      const session = JSON.parse(sessionJson) as { id: string; url: string };
      
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['payAsYouUsePurchases'] });
    },
    onError: (error) => {
      console.error('Checkout session creation error:', error);
      toast.error('Failed to create checkout session. Please try again.');
    },
  });
}

// Get Stripe session status
export function useGetStripeSessionStatus() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStripeSessionStatus(sessionId);
    },
  });
}

// Helper function to create shopping items for subscriptions
export function createSubscriptionShoppingItem(tier: 'basic' | 'pro' | 'enterprise'): ShoppingItem {
  const subscriptionPrices = {
    basic: { price: 900, name: 'Basic Plan' },
    pro: { price: 4500, name: 'Pro Plan' },
    enterprise: { price: 9900, name: 'Enterprise Plan' },
  };

  const { price, name } = subscriptionPrices[tier];

  return {
    productName: name,
    productDescription: `Monthly subscription to ${name}`,
    priceInCents: BigInt(price),
    quantity: BigInt(1),
    currency: 'USD',
  };
}

// Helper function to create shopping items for Pay As You Use batches
export function createPayAsYouUseShoppingItem(batchSize: number): ShoppingItem {
  const batchPrices: Record<number, { price: number; label: string }> = {
    10: { price: 1, label: 'Top 10' },
    100: { price: 10, label: 'Top 100' },
    1000: { price: 100, label: 'Top 1,000' },
    10000: { price: 1000, label: 'Top 10,000' },
    100000: { price: 10000, label: 'Top 100,000' },
    1000000: { price: 100000, label: 'Top 1,000,000' },
  };

  const batch = batchPrices[batchSize];
  if (!batch) {
    throw new Error(`Invalid batch size: ${batchSize}`);
  }

  return {
    productName: `${batch.label} Domain Batch`,
    productDescription: `One-time/lifetime access to ${batch.label} highest quality domains with instant access, full sitemap data, quality scores, and backlink info`,
    priceInCents: BigInt(batch.price),
    quantity: BigInt(1),
    currency: 'USD',
  };
}

// Payment history tracking (frontend-only for now)
export interface PaymentRecord {
  id: string;
  type: 'subscription' | 'payAsYouUse';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  sessionId?: string;
  productName: string;
  productDescription: string;
}

export function useGetPaymentHistory() {
  return useQuery<PaymentRecord[]>({
    queryKey: ['paymentHistory'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('paymentHistory');
        if (stored) {
          return JSON.parse(stored);
        }
        return [];
      } catch (error) {
        console.error('Error loading payment history:', error);
        return [];
      }
    },
    retry: false,
  });
}

export function useAddPaymentRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: Omit<PaymentRecord, 'id' | 'createdAt'>) => {
      const newRecord: PaymentRecord = {
        ...record,
        id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };

      const stored = localStorage.getItem('paymentHistory');
      const existing: PaymentRecord[] = stored ? JSON.parse(stored) : [];
      const updated = [newRecord, ...existing];
      localStorage.setItem('paymentHistory', JSON.stringify(updated));

      return newRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      sessionId, 
      status 
    }: { 
      sessionId: string; 
      status: 'completed' | 'failed'; 
    }) => {
      const stored = localStorage.getItem('paymentHistory');
      const existing: PaymentRecord[] = stored ? JSON.parse(stored) : [];
      
      const updated = existing.map(record => 
        record.sessionId === sessionId 
          ? { ...record, status }
          : record
      );
      
      localStorage.setItem('paymentHistory', JSON.stringify(updated));
      return { sessionId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
  });
}
