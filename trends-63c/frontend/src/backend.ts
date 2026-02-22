import type { Principal } from '@dfinity/principal';

export type Paragraph = {
    content: string;
    sources: string[];
};

export type Topic = {
    id: bigint;
    title: string;
    slug: string;
    category: string;
    score: bigint;
    createdAt: bigint;
    updatedAt: bigint;
    status: string;
    moderation: {
        approvalScore: bigint;
        confidenceScore: bigint;
    };
    paragraphs: Paragraph[];
    relatedQueries: string[];
    trendIndicator: string;
    polygonVertices: bigint;
    hashIdentifier: string;
    merkleRoot: string;
    upvotes: bigint;
    downvotes: bigint;
    totalVotes: bigint;
    rank: bigint;
    clickCount: bigint;
};

export type TopicInput = {
    title: string;
    slug: string;
    category: string;
    score: bigint;
    paragraphs: Paragraph[];
    relatedQueries: string[];
    trendIndicator: string;
    polygonVertices: bigint;
};

export type TopicSummary = {
    id: bigint;
    title: string;
    slug: string;
    category: string;
    score: bigint;
    trendIndicator: string;
    polygonVertices: bigint;
    status: string;
    upvotes: bigint;
    downvotes: bigint;
    totalVotes: bigint;
    rank: bigint;
    clickCount: bigint;
};

export type StaticPage = {
    slug: string;
    title: string;
    content: string;
    metaDescription: string;
    canonicalUrl: string;
    lastModified: bigint;
};

export type Pagination = {
    currentPage: bigint;
    totalPages: bigint;
    pageSize: bigint;
    totalItems: bigint;
    hasNext: boolean;
    hasPrevious: boolean;
};

export type PaginatedTopics = {
    topics: TopicSummary[];
    pagination: Pagination;
};

export enum VoteAction {
    upvote = 'upvote',
    downvote = 'downvote',
}

export type LeaderboardEntry = {
    topicId: bigint;
    title: string;
    score: bigint;
    rank: bigint;
    totalVotes: bigint;
    upvotes: bigint;
    downvotes: bigint;
    clickCount: bigint;
};

export type VoterStats = {
    voter: Principal;
    totalVotes: bigint;
    upvotesGiven: bigint;
    downvotesGiven: bigint;
};

export type Leaderboard = {
    topTopics: LeaderboardEntry[];
    topVoters: VoterStats[];
};

export type UserProfile = {
    name: string;
    totalVotes: bigint;
    upvotesGiven: bigint;
    downvotesGiven: bigint;
    referralPoints: bigint;
    badges: string[];
};

export interface BackendActor {
    initializeAccessControl(): Promise<void>;
    getCallerUserRole(): Promise<any>;
    assignCallerUserRole(user: Principal, role: any): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    createTopic(input: TopicInput): Promise<bigint>;
    updateTopic(id: bigint, input: TopicInput): Promise<void>;
    deleteTopic(id: bigint): Promise<void>;
    refreshTopics(): Promise<void>;
    hideTopic(id: bigint): Promise<void>;
    getTopicById(id: bigint): Promise<Topic | null>;
    getTopicBySlug(slug: string): Promise<Topic | null>;
    getPaginatedTopics(page: bigint, pageSize: bigint): Promise<PaginatedTopics>;
    getTopicCount(): Promise<bigint>;
    getLeaderboard(): Promise<Leaderboard>;
    getSitemapEntries(): Promise<[string, bigint, bigint][]>;
    voteTopic(id: bigint, action: VoteAction): Promise<void>;
    incrementClickCount(id: bigint): Promise<void>;
    createStaticPage(page: StaticPage): Promise<void>;
    getStaticPage(slug: string): Promise<StaticPage | null>;
    updateStaticPage(page: StaticPage): Promise<void>;
    deleteStaticPage(slug: string): Promise<void>;
    getAllStaticPages(): Promise<StaticPage[]>;
}
