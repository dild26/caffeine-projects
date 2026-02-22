export class ExternalBlob {
    filename: string;
    contentType: string;
    data: Uint8Array;
    private uploadProgressCallback?: (percentage: number) => void;

    constructor(filename: string, contentType: string, data: Uint8Array) {
        this.filename = filename;
        this.contentType = contentType;
        this.data = data;
    }

    static fromBytes(bytes: Uint8Array): ExternalBlob {
        return new ExternalBlob('', 'application/octet-stream', bytes);
    }

    getDirectURL(): string {
        if (this.data.length === 0) return '';
        const blob = new Blob([this.data.buffer as ArrayBuffer], { type: this.contentType });
        return URL.createObjectURL(blob);
    }

    withUploadProgress(callback: (percentage: number) => void): ExternalBlob {
        this.uploadProgressCallback = callback;
        return this;
    }
}


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
