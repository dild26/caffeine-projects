import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

// --- Sitemap Types ---
export interface SitemapEntry {
    url: string;
    changefreq: string;
    priority: number;
    lastmod: bigint;
}

export interface SitemapStructure {
    auto: SitemapEntry[];
    manualPages: SitemapEntry[];
    controlledRoutes: SitemapEntry[];
}

export interface ControlledRoute {
    route: string;
    appId: string;
    active: boolean;
}

// --- User Types ---
export interface UserProfile {
    principal: Principal;
    role: { 'admin': null } | { 'user': null };
    name: string;
    email: string;
    subscriptionStatus: any;
    referralCode: string;
    referredBy?: string[];
    createdAt: bigint;
}

export const SubscriptionStatus = {
    none: { 'none': null },
    active: { 'active': null },
    expired: { 'expired': null }
};

export const UserRole = {
    admin: { 'admin': null },
    user: { 'user': null }
};

// --- E-commerce / Payment Types ---
export interface Referral {
    code: string;
    referrer: Principal;
    referee: Principal;
    timestamp: bigint;
}

export interface PaymentRecord {
    id: string;
    amount: bigint;
    status: string;
    timestamp: bigint;
}

export interface StripeConfiguration {
    publishableKey: string;
    secretKey: string;
}

export interface ShoppingItem {
    name: string;
    price: bigint;
    quantity: bigint;
}

// --- Storage Types ---
export interface FileReference {
    path: string;
    hash: string;
    url: string;
    contentType: string;
    size: bigint;
    uploadedAt: bigint;
}

// --- Service Interface ---
export interface _SERVICE {
    getSitemap: () => Promise<SitemapStructure>;
    register: () => Promise<UserProfile>;

    // Sitemap Management
    addSitemap: (entry: SitemapEntry) => Promise<void>;
    searchSitemaps: (term: string, limit: bigint) => Promise<SitemapEntry[]>;
    getAllTlds: () => Promise<string[]>;
    getSitemapCountByTld: (tld: string) => Promise<bigint>;

    // Manual Pages
    addManualPage: (page: string) => Promise<void>;
    getManualPages: () => Promise<string[]>;
    removeManualPage: (url: string) => Promise<void>;

    // Controlled Routes
    addControlledRoute: (route: string, appId: string) => Promise<void>;
    getControlledRoutes: () => Promise<ControlledRoute[]>;

    // User Profile
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    getCallerUserRole: () => Promise<any>; // Returns UserRole variant
    isCallerAdmin: () => Promise<boolean>;

    // Referrals
    addReferral: (referral: Referral) => Promise<void>;
    getReferralsByReferrer: (referrer: Principal) => Promise<Referral[]>;

    // Payments
    addPaymentRecord: (record: PaymentRecord) => Promise<void>;
    getPaymentRecord: (id: string) => Promise<PaymentRecord | null>;
    isStripeConfigured: () => Promise<boolean>;
    setStripeConfiguration: (config: StripeConfiguration) => Promise<void>;
    createCheckoutSession: (items: ShoppingItem[], successUrl: string, cancelUrl: string) => Promise<string>;

    // Storage
    registerFileReference: (path: string, hash: string) => Promise<void>;
    getFileReference: (path: string) => Promise<FileReference>;
    listFileReferences: () => Promise<FileReference[]>;
}

// Alias for StorageClient usage
export type backendInterface = _SERVICE;
