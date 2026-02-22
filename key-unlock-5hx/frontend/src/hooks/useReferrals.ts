import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateReferralNonce, getReferralData, saveReferralData } from '../lib/referralSystem';

export interface ReferralData {
  nonce: string;
  referrerId: string;
  referrals: string[];
  totalReferrals: number;
  createdAt: number;
}

export function useGenerateReferralNonce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const nonce = generateReferralNonce(userId);
      const data: ReferralData = {
        nonce,
        referrerId: userId,
        referrals: [],
        totalReferrals: 0,
        createdAt: Date.now(),
      };
      saveReferralData(userId, data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralData'] });
    },
  });
}

export function useGetReferralData(userId: string) {
  return useQuery<ReferralData | null>({
    queryKey: ['referralData', userId],
    queryFn: () => getReferralData(userId),
    enabled: !!userId,
  });
}

export function useTrackReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ referrerId, newUserId }: { referrerId: string; newUserId: string }) => {
      const data = getReferralData(referrerId);
      if (!data) throw new Error('Referrer not found');

      data.referrals.push(newUserId);
      data.totalReferrals += 1;
      saveReferralData(referrerId, data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralData'] });
    },
  });
}
