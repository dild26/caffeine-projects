import { ReferralData } from '../hooks/useReferrals';

const REFERRAL_STORAGE_KEY = 'moap_referral_data';

/**
 * Generate a unique nonce (hash) for a subscriber/referrer
 * Based on the referral system from https://secoin-ep6.caffeine.xyz/referral
 */
export function generateReferralNonce(userId: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const data = `${userId}-${timestamp}-${randomPart}`;
  
  // Generate hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hexHash = Math.abs(hash).toString(16).padStart(16, '0');
  return `REF-${hexHash.toUpperCase()}`;
}

/**
 * Get all referral data from local storage
 */
function getAllReferralData(): Record<string, ReferralData> {
  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save all referral data to local storage
 */
function saveAllReferralData(data: Record<string, ReferralData>): void {
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save referral data:', error);
  }
}

/**
 * Get referral data for a specific user
 */
export function getReferralData(userId: string): ReferralData | null {
  const allData = getAllReferralData();
  return allData[userId] || null;
}

/**
 * Save referral data for a specific user
 */
export function saveReferralData(userId: string, data: ReferralData): void {
  const allData = getAllReferralData();
  allData[userId] = data;
  saveAllReferralData(allData);
}

/**
 * Validate a referral nonce
 */
export function validateReferralNonce(nonce: string): boolean {
  return /^REF-[0-9A-F]{16}$/.test(nonce);
}

/**
 * Find referrer by nonce
 */
export function findReferrerByNonce(nonce: string): string | null {
  const allData = getAllReferralData();
  for (const [userId, data] of Object.entries(allData)) {
    if (data.nonce === nonce) {
      return userId;
    }
  }
  return null;
}
