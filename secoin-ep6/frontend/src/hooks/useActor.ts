import { useMemo } from 'react';
import type {
    BackendActor,
    Property,
    BlogPost,
    Feature,
    Task,
    UserProfile,
    FAQ,
    SocialMediaPlatform,
    Sitemap,
    SitemapEntry,
    Fixtures,
    ReferralProgram,
    MenuItem,
    UnitValue,
    ExternalBlob
} from '../backend';

// Mock data storage for Property Investment Platform
let mockProperties: Property[] = [
    {
        id: 'prop-1',
        name: 'Hilltop Estate',
        location: 'Mumbai, India',
        price: { value: 5000000000n, unit: 'paise', scale: 2n, editableBy: ['Admin'] }, // 5 Crore INR
        fractionalOwnership: [{ owner: 'Dil', percentage: 10n }],
        floors: [{ floorNumber: 1n, area: 2000n, price: 5000000n }],
        schemaVersion: 1n,
        latitude: { value: 190760n, unit: 'degree', scale: 4n, editableBy: ['Admin'] },
        longitude: { value: 728777n, unit: 'degree', scale: 4n, editableBy: ['Admin'] },
        nodes: [],
        nodeCount: 0n,
        nodePricing: { value: 0n, unit: 'paise', scale: 2n, editableBy: ['Admin'] },
        area: { value: 500000n, unit: 'cm2', scale: 4n, editableBy: ['Admin'] },
        elevation: { value: 10000n, unit: 'cm', scale: 2n, editableBy: ['Admin'] },
        pricePerUnit: { value: 10000n, unit: 'paise', scale: 2n, editableBy: ['Admin'] },
        gallery: []
    }
];

let mockBlogPosts: BlogPost[] = [];
let mockFeatures: Feature[] = [];
let mockFAQs: FAQ[] = [];
let mockSocialMediaPlatforms: SocialMediaPlatform[] = [];
let mockMenuItems: MenuItem[] = [];
let mockUserProfile: UserProfile | null = { name: 'Genesis Admin' };

export function useActor() {
    const actor = useMemo<BackendActor>(() => ({
        initializeAccessControl: async () => { console.log('Mock: initializeAccessControl'); },
        getCallerUserRole: async () => ({ admin: null }), // Mock role
        isCallerAdmin: async () => true,
        getAdminStatus: async () => ({
            isAdmin: true,
            isGenesisAdmin: true,
            currentPrincipal: 'mock-principal',
            genesisAdminPrincipal: 'mock-principal'
        }),

        getProperties: async () => [...mockProperties],
        getProperty: async (id: string) => mockProperties.find(p => p.id === id) || null,
        uploadProperty: async (property: Property) => { mockProperties.push(property); },
        updatePropertyPrice: async (id: string, newPrice: UnitValue) => {
            const prop = mockProperties.find(p => p.id === id);
            if (prop) prop.price = newPrice;
        },
        addNodeToProperty: async (propertyId, latitude, longitude, altitude) => {
            console.log('Mock: addNodeToProperty', propertyId);
        },
        removeNodeFromProperty: async (propertyId, nodeId) => {
            console.log('Mock: removeNodeFromProperty', propertyId, nodeId);
        },
        getPropertyNodes: async () => [],
        getPropertyNodeCount: async () => 0n,
        getPropertyNodePricing: async () => ({ value: 0n, unit: 'paise', scale: 2n, editableBy: [] }),

        getPublishedBlogPosts: async () => [...mockBlogPosts.filter(p => p.published)],
        getBlogPost: async (id: string) => mockBlogPosts.find(p => p.id === id) || null,
        getAllBlogPosts: async () => [...mockBlogPosts],
        createBlogPost: async (title, content) => {
            const id = 'blog-' + Date.now();
            mockBlogPosts.push({ id, title, content, published: false, createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()) });
            return id;
        },
        updateBlogPost: async (id, title, content) => { /* mock */ },
        setBlogPostPublished: async (id, published) => { /* mock */ },

        getFeatures: async () => [...mockFeatures],
        getFeaturesByCategory: async (cat) => mockFeatures.filter(f => f.category === cat),
        addFeature: async (name, tasks, category, priority, fixture) => {
            const id = 'feat-' + Date.now();
            return id;
        },
        updateTaskCompletion: async () => { /* mock */ },
        updateFeatureVerification: async () => { /* mock */ },

        getFAQs: async () => [...mockFAQs],
        createFAQ: async (q, a, o) => 'faq-' + Date.now(),
        updateFAQ: async () => { /* mock */ },
        deleteFAQ: async () => { /* mock */ },
        searchFAQs: async () => [],
        checkFAQIntegrity: async () => true,

        getSocialMediaPlatforms: async () => [...mockSocialMediaPlatforms],
        getActiveSocialMediaPlatforms: async () => mockSocialMediaPlatforms.filter(p => p.active),
        createSocialMediaPlatform: async () => 'soc-' + Date.now(),
        updateSocialMediaPlatform: async () => { /* mock */ },
        deleteSocialMediaPlatform: async () => { /* mock */ },
        initializeDefaultSocialMediaPlatforms: async () => { /* mock */ },

        getMenuItems: async () => [...mockMenuItems],
        createMenuItem: async () => 'menu-' + Date.now(),
        updateMenuItem: async () => { /* mock */ },
        deleteMenuItem: async () => { /* mock */ },
        analyzeMenuStructure: async () => ({}),
        getCorrectedMenuStructure: async () => ({}),
        ensureCriticalMenuItems: async () => { /* mock */ },

        getSitemap: async () => null,
        createOrUpdateSitemap: async () => { /* mock */ },
        getRawSitemapXml: async () => '',
        getRobotsTxt: async () => '',
        checkSitemapIntegrity: async () => true,

        getPropertyGallery: async () => [],
        addImageToPropertyGallery: async () => { /* mock */ },
        removeImageFromPropertyGallery: async () => { /* mock */ },

        getFixtures: async () => null,
        getAllFixtures: async () => [],
        createOrUpdateFixtures: async () => { /* mock */ },

        getReferralProgram: async () => null,
        getAllReferralPrograms: async () => [],
        createOrUpdateReferralProgram: async () => { /* mock */ },

        getCallerUserProfile: async () => mockUserProfile,
        saveCallerUserProfile: async (profile) => { mockUserProfile = profile; },

        getSystemStats: async () => ({
            totalProperties: BigInt(mockProperties.length),
            totalBlogPosts: BigInt(mockBlogPosts.length),
            totalFeatures: BigInt(mockFeatures.length),
            totalUsers: 1n
        }),

        runDataIntegrityTests: async () => true,
    }), []);

    return { actor, isFetching: false };
}
