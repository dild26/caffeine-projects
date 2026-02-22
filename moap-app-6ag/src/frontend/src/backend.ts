/**
 * Backend type stubs for moap-app-6ag (MoAP App).
 */

export interface App {
    id: string;
    name: string;
    description: string;
    url: string;
    rank: bigint;
    features: string[];
    archived: boolean;
    category?: string;
    tags?: string[];
    createdAt?: bigint;
}

export interface Comparison {
    appId: string;
    featureId: string;
    supported: boolean;
    notes?: string;
}

export interface Feature {
    id: string;
    name: string;
    description: string;
    category?: string;
}

export interface CompareMatrix {
    comparisons: Comparison[];
}

export interface Ranking {
    appId: string;
    rank: bigint;
    score: bigint;
}

export interface Leaderboards {
    rankings: Ranking[];
}

export interface OverviewCard {
    id: string;
    title: string;
    summary: string;
    rank: bigint;
    icon?: string;
}

export interface OverviewCards {
    cards: OverviewCard[];
}

export interface SitemapSection {
    title: string;
    links: { label: string; url: string }[];
}

export interface Sitemap {
    sections: SitemapSection[];
}

export interface VersionEntry {
    version: string;
    date: bigint;
    changes: string[];
}

export interface Versions {
    versionHistory: VersionEntry[];
}

export interface MigrationEntry {
    id: string;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: bigint;
}

export interface Migrations {
    migrationHistory: MigrationEntry[];
}

export interface UpdatePayload {
    appId: string;
    updates: Partial<App>;
}
