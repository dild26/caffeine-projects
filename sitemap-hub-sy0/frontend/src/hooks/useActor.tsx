import { useState, useEffect } from 'react';
import { SitemapStructure, SitemapEntry, UserProfile, ControlledRoute, Referral, PaymentRecord, StripeConfiguration, ShoppingItem, SubscriptionStatus, UserRole } from '../backend';
import { Principal } from "@dfinity/principal";

const MOCK_SITEMAP: SitemapStructure = {
    auto: [],
    manualPages: [
        { url: '/about', changefreq: 'monthly', priority: 0.8, lastmod: BigInt(Date.now()) },
        { url: '/contact', changefreq: 'yearly', priority: 0.5, lastmod: BigInt(Date.now()) }
    ],
    controlledRoutes: []
};

const MOCK_PROFILE: UserProfile = {
    principal: Principal.fromText("2vxsx-fae"),
    role: { 'admin': null },
    name: "Admin User",
    email: "admin@caffeine.xyz",
    subscriptionStatus: SubscriptionStatus.active,
    referralCode: "ADMIN1",
    createdAt: BigInt(Date.now())
};

export const useActor = () => {
    const [actor, setActor] = useState<any>(null);

    useEffect(() => {
        const mockActor = {
            getSitemap: async () => MOCK_SITEMAP,
            register: async () => MOCK_PROFILE,

            // Sitemap
            addSitemap: async (entry: SitemapEntry) => console.log('Added sitemap', entry),
            searchSitemaps: async (term: string, limit: bigint) => [],
            getAllTlds: async () => ['com', 'org', 'xyz'],
            getSitemapCountByTld: async (tld: string) => BigInt(10),

            // Manual Pages
            addManualPage: async (page: string) => console.log('Added manual page', page),
            getManualPages: async () => ['/about', '/contact', '/pricing'],
            removeManualPage: async (url: string) => console.log('Removed page', url),

            // Controlled Routes
            addControlledRoute: async (route: string, appId: string) => console.log('Added route', route),
            getControlledRoutes: async () => ([
                { route: '/broadcast', appId: 'app-1', active: true },
                { route: '/live', appId: 'app-2', active: false }
            ]),

            // User Profile
            getCallerUserProfile: async () => MOCK_PROFILE,
            saveCallerUserProfile: async (profile: UserProfile) => console.log('Saved profile', profile),
            getCallerUserRole: async () => UserRole.admin,
            isCallerAdmin: async () => true,

            // Referrals
            addReferral: async (referral: Referral) => console.log('Added referral', referral),
            getReferralsByReferrer: async (referrer: Principal) => [],

            // Payments
            addPaymentRecord: async (record: PaymentRecord) => console.log('Added payment', record),
            getPaymentRecord: async (id: string) => null,
            isStripeConfigured: async () => true,
            setStripeConfiguration: async (config: StripeConfiguration) => console.log('Set stripe config', config),
            createCheckoutSession: async () => JSON.stringify({ id: 'sess_123', url: 'http://localhost:3017/payment-success' }),

            // Storage
            registerFileReference: async (path: string, hash: string) => console.log('Registered file', path),
            getFileReference: async (path: string) => ({
                path,
                hash: 'mock-hash',
                url: `http://localhost:3017/mock/${path}`,
                contentType: 'image/png',
                size: BigInt(1024),
                uploadedAt: BigInt(Date.now())
            }),
            listFileReferences: async () => []
        };
        setActor(mockActor);
    }, []);

    return { actor, isFetching: false };
};
