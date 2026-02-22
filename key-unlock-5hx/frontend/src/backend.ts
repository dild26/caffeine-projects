
export enum SubscriptionStatus {
    active = "active",
    inactive = "inactive",
    trial = "trial",
    expired = "expired",
}

export enum UserRole {
    admin = "admin",
    user = "user",
}

export interface UserProfile {
    id: string;
    username: string;
    role: UserRole;
    subscription: SubscriptionStatus;
}

export interface Page {
    name: string;
    url: string;
    category: string;
    topApp?: string;
    topAppUrl?: string;
}

export interface SecoinfiAppEntry {
    id: bigint;
    appName: string;
    subdomain: string;
    canonicalUrl: string;
    categoryTags: string;
    status: string;
}

export interface ShareSelectedResult {
    overview: any[];
    compare: any[];
    sites: any[];
    apps: any[];
    message: string;
}

export interface FileCheckResult {
    fileName: string;
    isPresent: boolean;
}

export interface FileCheckStatus {
    expectedFiles: FileCheckResult[];
    isComplete: boolean;
}

export interface FileUpload {
    fileName: string;
    fileSize: bigint;
    fileType: string;
    hashEdges: string;
    uploadedAt?: bigint;
    status?: string;
}

export interface AuthMetric {
    metricName: string;
    value: number;
    timestamp?: bigint;
}

export interface RouteStatus {
    routeName: string;
    status: string;
    lastChecked?: bigint;
}

export interface NavItem {
    title: string;
    path: string;
    adminOnly?: boolean;
    children?: NavItem[];
}


export interface ContactInfo {
    ceoName: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapLink: string;
    googleMapLink: string;
    paymentMethods: {
        paypal: string;
        upi: string;
        eth: string;
    };
    socialLinks: {
        facebook: string;
        linkedin: string;
        telegram: string;
        discord: string;
        blogspot: string;
        instagram: string;
        twitter: string;
        youtube: string;
    };
}

export interface Theme {
    name: string;
    colors: any;
}

export interface Feature {
    name: string;
    enabled: boolean;
}

export interface Pro {
    id: string;
    name: string;
}

export interface TestInput {
    id: string;
    value: string;
}

export interface IntegrationDoc {
    id: string;
    title: string;
}

export interface Actor {
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserRole: () => Promise<string>;
    getAllSecoinfiAppsEntries: () => Promise<SecoinfiAppEntry[]>;
    addSecoinfiAppEntry: (appName: string, subdomain: string, canonicalUrl: string, categoryTags: string, status: string) => Promise<bigint>;
    updateSecoinfiAppEntry: (id: bigint, appName: string, canonicalUrl: string) => Promise<boolean>;
    deleteSecoinfiAppEntry: (id: bigint) => Promise<boolean>;
    bulkDeleteSecoinfiAppEntries: (ids: bigint[]) => Promise<void>;
    getAllSecoinfiApps: () => Promise<Page[]>;
    getOverviewPages: () => Promise<Page[]>;
    shareSelectedPages: (selectedIds: bigint[]) => Promise<ShareSelectedResult>;
}
