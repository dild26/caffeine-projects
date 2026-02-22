import { Principal } from '@dfinity/principal';

export type UserProfile = {
    name: string;
    skills: string[];
    experiences: string[];
    qualifications: string[];
    specializations: string[];
    pros: string[];
    usps: string[];
    referralId: string;
    totalVotes: bigint;
    referralEarnings: bigint;
    isPublic: boolean;
    visibleTopics: string[];
    upvotesGiven?: bigint;
    downvotesGiven?: bigint;
    referralPoints?: bigint;
    badges?: string[];
};

export type Topic = {
    id: string;
    creator: Principal;
    content: string;
    description: string;
    votes: bigint;
    reactions: string[];
    hashtags: string[];
    createdAt: bigint;
    category: string;
};

export type Referral = {
    referrer: Principal;
    referred: Principal;
    earnings: bigint;
    timestamp: bigint;
};

export type PaymentRecord = {
    user: Principal;
    amount: bigint;
    method: string;
    timestamp: bigint;
    status: string;
};

export type BlogPost = {
    id: string;
    author: Principal;
    title: string;
    content: string;
    createdAt: bigint;
};

export type ShoppingItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export type StripeConfiguration = {
    apiKey: string;
};

export type BackendActor = {
    initializeAccessControl: () => Promise<void>;
    getCallerUserRole: () => Promise<{ user: null | any }>;
    assignCallerUserRole: (user: Principal, role: any) => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserProfile: () => Promise<UserProfile | null>;
    getUserProfile: (user: Principal) => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    createTopic: (content: string, description: string, category: string) => Promise<bigint>;
    updateTopic: () => Promise<void>;
    deleteTopic: () => Promise<void>;
    refreshTopics: () => Promise<void>;
    hideTopic: () => Promise<void>;
    getTopicById: (id: string) => Promise<Topic | null>;
    getTopicBySlug: (slug: string) => Promise<Topic | null>;
    getAllTopics?: () => Promise<Topic[]>;
    getPaginatedTopics: (page: bigint, pageSize: bigint) => Promise<{ topics: Topic[], pagination: any }>;
    getTopicCount: () => Promise<bigint>;
    getLeaderboard: () => Promise<UserProfile[]>; // Changed from { topTopics: [], topVoters: [] } to match newer usage
    getSitemapEntries: () => Promise<any[]>;
    voteTopic: (topicId: string, upvote: boolean) => Promise<void>;
    incrementClickCount: () => Promise<void>;
    createStaticPage: () => Promise<void>;
    getStaticPage: () => Promise<null>;
    updateStaticPage: () => Promise<void>;
    deleteStaticPage: () => Promise<void>;
    getAllStaticPages: () => Promise<any[]>;
    addReaction: (topicId: string, reaction: string) => Promise<void>;
    searchTopicsByHashtag: (hashtag: string) => Promise<Topic[]>;
    searchTopicsByCategory: (category: string) => Promise<Topic[]>;
    getCallerReferrals: () => Promise<Referral[]>;
    addReferral: (referred: Principal) => Promise<void>;
    getCallerPayments: () => Promise<PaymentRecord[]>;
    addPaymentRecord: (amount: bigint, method: string, status: string) => Promise<void>;
    getAllBlogPosts: () => Promise<BlogPost[]>;
    createBlogPost: (title: string, content: string) => Promise<void>;
    isStripeConfigured: () => Promise<boolean>;
    setStripeConfiguration: (config: StripeConfiguration) => Promise<void>;
    getStripeSessionStatus: (sessionId: string) => Promise<{ status: string }>;
    createCheckoutSession: (items: ShoppingItem[], successUrl: string, cancelUrl: string) => Promise<string>;
};

export type VoteAction = {
    // ...
};
