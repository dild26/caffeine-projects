import { useState, useCallback, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import {
    _SERVICE,
    UserProfile,
    Contact,
    Invoice,
    Product,
    Sitemap,
    ShoppingItem,
    BusinessRole,
    UserRole,
    SubscriptionStatus,
    SubscriptionTier,
    FileReference,
    SystemConfig,
    FeatureToggle,
    StripeConfiguration,
    Tenant
} from '../backend';

const MOCK_PROFILE: UserProfile = {
    principal: Principal.fromText('2vxsx-fae'),
    role: UserRole.admin,
    businessRole: BusinessRole.owner,
    name: 'Admin User',
    email: 'admin@example.com',
    subscriptionTier: SubscriptionTier.enterprise,
    subscriptionStatus: SubscriptionStatus.active,
    createdAt: BigInt(Date.now())
};

const MOCK_CONTACTS: Contact[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Acme Corp' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'Global Tech' }
];

const MOCK_INVOICES: Invoice[] = [
    { id: 'INV-001', amount: BigInt(5000), status: 'paid', dueDate: BigInt(Date.now() + 86400000), customerId: '1' },
    { id: 'INV-002', amount: BigInt(12000), status: 'pending', dueDate: BigInt(Date.now() + 172800000), customerId: '2' }
];

const MOCK_PRODUCTS: Product[] = [
    { id: 'PROD-1', name: 'Sitemap Pro', price: BigInt(2900), description: 'Professional sitemap generation', category: 'Software' },
    { id: 'PROD-2', name: 'Analytics Plus', price: BigInt(4900), description: 'Advanced analytics dashboard', category: 'Service' }
];

const MOCK_SITEMAPS: Sitemap[] = [
    { id: 'SM-1', url: 'https://example.com/sitemap.xml', lastMod: '2023-10-01', changefreq: 'daily', priority: 0.8, status: 'active', pages: 150 },
    { id: 'SM-2', url: 'https://mysite.org/sitemap.xml', lastMod: '2023-10-05', changefreq: 'weekly', priority: 0.6, status: 'pending', pages: 42 }
];

const MOCK_SHOPPING_ITEMS: ShoppingItem[] = [
    { id: 'ITEM-1', name: '100 Credits', price: BigInt(1000), quantity: BigInt(100), description: '100 API Credits' },
    { id: 'ITEM-2', name: '500 Credits', price: BigInt(4500), quantity: BigInt(500), description: '500 API Credits' }
];

const createMockActor = () => {
    return {
        getCallerUserProfile: async () => MOCK_PROFILE,
        saveCallerUserProfile: async (profile: UserProfile) => {
            console.log('Saved profile:', profile);
        },
        getContacts: async () => MOCK_CONTACTS,
        getInvoices: async () => MOCK_INVOICES,
        getProducts: async () => MOCK_PRODUCTS,
        getSitemaps: async () => MOCK_SITEMAPS,
        getShoppingItems: async () => MOCK_SHOPPING_ITEMS,

        getSystemConfig: async () => ({ maintenanceMode: false, version: '1.0.0' }),
        getFeatureToggles: async () => [
            { name: 'beta-features', enabled: true },
            { name: 'dark-mode', enabled: true }
        ],
        getStripeConfiguration: async () => ({
            publishableKey: 'pk_test_mock',
            secretKey: 'sk_test_mock'
        }),
        getTenants: async () => [
            { id: 'T-1', name: 'Default Tenant', owner: Principal.fromText('2vxsx-fae') }
        ],

        registerFileReference: async (path: string, hash: string) => {
            console.log('Registered file:', path, hash);
        },
        getFileReference: async (path: string) => ({
            path,
            hash: 'mock-hash',
            url: path.startsWith('/') ? path : `/assets/${path}`,
            contentType: 'image/png',
            size: BigInt(1024),
            uploadedAt: BigInt(Date.now())
        }),
        listFileReferences: async () => []
    } as unknown as _SERVICE;
};

export const useActor = () => {
    const [actor, setActor] = useState<_SERVICE | null>(null);

    useEffect(() => {
        setActor(createMockActor());
    }, []);

    return { actor };
};
