export interface UnitValue {
    value: bigint;
    unit: string;
    scale: bigint;
    editableBy: string[];
}

export type UnitType = 'currency' | 'time' | 'count';

export interface UserApprovalInfo {
    user: any; // Principal
    status: ApprovalStatus;
    requestedAt: bigint;
}

export type ApprovalStatus = { approved: null } | { pending: null } | { rejected: null };

export type UserRole = { admin: null } | { user: null } | { guest: null };

export type Variant_inr_usd = { inr: null } | { usd: null };

export type Variant_payIn_payOut = { payIn: null } | { payOut: null };

export interface UserProfile {
    name: string;
    upiId: string;
    mobileNumber: string;
    accountType: { individual: null } | { business: null };
    registrationTime: bigint;
}

export interface Transaction {
    id: bigint;
    user: any; // Principal
    amount: UnitValue;
    currency: Variant_inr_usd;
    type_: Variant_payIn_payOut;
    status: { ok: null } | { pending: null } | { rejected: null };
    timestamp: bigint;
    merkleRoot: string;
}

export interface Subscription {
    user: any; // Principal
    qrc: string;
    startTime: bigint;
    endTime: bigint;
    fee: UnitValue;
    status: { active: null } | { paused: null } | { expired: null };
}

export interface LeaderboardEntry {
    user: any; // Principal
    totalAmount: UnitValue;
    duration: bigint;
    rank: bigint;
    timestamp: bigint;
}

export interface AdminSettings {
    conversionRate: UnitValue;
    subscriptionFee: UnitValue;
    rotationCycle: bigint;
}

export interface ContactInfo {
    ceo: string;
    email: string;
    phone: string;
    website: string;
    whatsapp: string;
    address: string;
    paypal: string;
    upiId: string;
    ethId: string;
    facebook: string;
    linkedin: string;
    telegram: string;
    discord: string;
    blog: string;
    instagram: string;
    twitter: string;
    youtube: string;
    mapLink: string;
    googleMapsLink: string;
}

export interface FeatureStatus {
    featureName: string;
    isCompleted: boolean;
    isAdminValidated: boolean;
    lastUpdated: bigint;
}

export type ThemeMode = 'light' | 'dark' | 'vibgyor';

export interface SystemComparison {
    imageUrl: string;
    description: string;
    comparisonTable: string;
    conversionRate: string;
    uspSection: string;
}

export interface TermsVersion {
    id: bigint;
    slug: string;
    version: bigint;
    title: string;
    effectiveDate: bigint;
    content: string;
    changelog: string;
    isPublic: boolean;
    criticalUpdate: boolean;
    createdByAdmin: any; // Principal
}

export interface UserTermsAcceptance {
    userPrincipal: any; // Principal
    termsVersionId: bigint;
    acceptedAt: bigint;
    metadata: string;
}

export interface AdminNotice {
    id: bigint;
    title: string;
    body: string;
    noticeType: { info: null } | { critical: null } | { legal: null };
    effectiveDate: bigint;
    requiresAcceptance: boolean;
    linkedTermsVersionId: bigint | null;
}

export interface ControlledRoute {
    routeName: string;
    delegatedApp: string;
}

export interface SitemapEntry {
    slug: string;
    pageType: { auto: null } | { manual: null } | { controlled: null };
    createdBy: any; // Principal
    createdAt: bigint;
    lastModified: bigint;
}

export interface SitemapState {
    auto: string[];
    manualPages: SitemapEntry[];
    controlledRoutes: ControlledRoute[];
    version: bigint;
    merkleHash: string;
    createdBy: any; // Principal
    createdAt: bigint;
    lastModified: bigint;
}

export interface BackendActor {
    getCallerUserProfile: () => Promise<UserProfile | null>;
    getUserProfile: (user: any) => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    isCallerApproved: () => Promise<boolean>;
    requestApproval: () => Promise<void>;
    setApproval: (user: any, status: ApprovalStatus) => Promise<void>;
    listApprovals: () => Promise<UserApprovalInfo[]>;
    createTransaction: (amount: UnitValue, currency: Variant_inr_usd, type: Variant_payIn_payOut) => Promise<bigint>;
    getTransaction: (id: bigint) => Promise<Transaction | null>;
    getUserTransactions: (user: any) => Promise<Transaction[]>;
    getAllTransactions: () => Promise<Transaction[]>;
    createSubscription: (qrc: string, duration: bigint) => Promise<void>;
    getSubscription: (user: any) => Promise<Subscription | null>;
    getAllSubscriptions: () => Promise<Subscription[]>;
    updateLeaderboard: (totalAmount: UnitValue, duration: bigint) => Promise<void>;
    getLeaderboard: () => Promise<LeaderboardEntry[]>;
    updateAdminSettings: (conversionRate: UnitValue, subscriptionFee: UnitValue, rotationCycle: bigint) => Promise<void>;
    getAdminSettings: () => Promise<AdminSettings>;
    getContactInfo: () => Promise<ContactInfo>;
    updateContactInfo: (info: ContactInfo) => Promise<void>;
    getFeatureStatus: (name: string) => Promise<FeatureStatus | null>;
    getAllFeatureStatuses: () => Promise<FeatureStatus[]>;
    updateFeatureStatus: (name: string, completed: boolean, validated: boolean) => Promise<void>;
    getTheme: () => Promise<ThemeMode>;
    setTheme: (theme: ThemeMode) => Promise<void>;
    getSystemComparison: () => Promise<SystemComparison>;
    updateSystemComparison: (comparison: SystemComparison) => Promise<void>;
    publishTermsVersion: (terms: TermsVersion) => Promise<bigint>;
    acceptTerms: (id: bigint, metadata: string) => Promise<void>;
    getCurrentTermsVersion: () => Promise<TermsVersion | null>;
    getTermsVersion: (id: bigint) => Promise<TermsVersion | null>;
    getAllTermsVersions: () => Promise<TermsVersion[]>;
    hasUserAcceptedTerms: (user: any, id: bigint) => Promise<boolean>;
    getUserTermsAcceptance: (user: any, id: bigint) => Promise<UserTermsAcceptance | null>;
    createAdminNotice: (notice: AdminNotice) => Promise<bigint>;
    getAllAdminNotices: () => Promise<AdminNotice[]>;
    getActiveAdminNotices: () => Promise<AdminNotice[]>;
    addManualPage: (slug: string) => Promise<void>;
    delegateControlledRoute: (routeName: string, delegatedApp: string) => Promise<void>;
    getSitemapState: () => Promise<SitemapState>;
    getAllPages: () => Promise<SitemapEntry[]>;
    isCallerAdmin: () => Promise<boolean>;
}
