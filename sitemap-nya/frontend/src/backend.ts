import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

// --- Enums ---
export const BusinessRole = {
    owner: { 'owner': null },
    admin: { 'admin': null },
    member: { 'member': null }
};

export const UserRole = {
    admin: { 'admin': null },
    user: { 'user': null }
};

export const SubscriptionTier = {
    free: { 'free': null },
    pro: { 'pro': null },
    enterprise: { 'enterprise': null }
};

// --- Interfaces ---
export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
}

export interface Invoice {
    id: string;
    amount: bigint;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: bigint;
    customerId: string;
}

export interface Product {
    id: string;
    name: string;
    price: bigint;
    description: string;
    category: string;
}

export interface UserProfile {
    principal: Principal;
    role: any; // UserRole
    businessRole: any; // BusinessRole
    name: string;
    email: string;
    subscriptionTier: any; // SubscriptionTier
    createdAt: bigint;
}

export interface FeatureToggle {
    name: string;
    enabled: boolean;
}

export interface PaymentProviderConfig {
    provider: string;
    apiKey: string;
}

export interface SystemConfig {
    maintenanceMode: boolean;
    version: string;
}

export interface Tenant {
    id: string;
    name: string;
    owner: Principal;
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

export interface SitemapData {
    url: string;
    lastMod: string;
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
    // User Configuration
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;

    // Core Business Data
    getContacts: () => Promise<Contact[]>;
    getInvoices: () => Promise<Invoice[]>;
    getProducts: () => Promise<Product[]>;

    // Configuration
    getSystemConfig: () => Promise<SystemConfig>;

    // Storage
    registerFileReference: (path: string, hash: string) => Promise<void>;
    getFileReference: (path: string) => Promise<FileReference>;
    listFileReferences: () => Promise<FileReference[]>;
}

// Alias for StorageClient usage
export type backendInterface = _SERVICE;
