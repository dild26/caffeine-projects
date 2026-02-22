import type { Principal } from '@dfinity/principal';

export type UserProfile = {
    name: string;
    email: string;
    role: string;
    createdAt: bigint;
};

export type Domain = {
    url: string;
    name: string;
    description: string;
    category: string;
    upvotes: bigint;
    downvotes: bigint;
    score: bigint;
    clickCount: bigint;
    createdAt: bigint;
};

export interface _SERVICE {
    getCallerUserProfile(): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    getDomains(): Promise<Domain[]>;
    addDomain(url: string): Promise<void>;
    upvoteDomain(url: string): Promise<void>;
    downvoteDomain(url: string): Promise<void>;
    incrementClickCount(url: string): Promise<void>;
    deleteDomain(url: string): Promise<void>;
    generateDomains(urls: string[]): Promise<void>;
}
