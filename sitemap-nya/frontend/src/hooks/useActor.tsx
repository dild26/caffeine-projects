import { useState, useEffect } from 'react';
import { UserProfile, Contact, Invoice, Product, SystemConfig, BusinessRole, UserRole, SubscriptionTier } from '../backend';
import { Principal } from "@dfinity/principal";

const MOCK_PROFILE: UserProfile = {
    principal: Principal.fromText("2vxsx-fae"),
    role: UserRole.admin,
    businessRole: BusinessRole.owner,
    name: "Demo User",
    email: "demo@caffeine.xyz",
    subscriptionTier: SubscriptionTier.pro,
    createdAt: BigInt(Date.now())
};

const MOCK_CONTACTS: Contact[] = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', company: 'Tech Corp' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', company: 'Design Co' }
];

const MOCK_INVOICES: Invoice[] = [
    { id: 'inv_001', amount: BigInt(10000), status: 'paid', dueDate: BigInt(Date.now()), customerId: '1' },
    { id: 'inv_002', amount: BigInt(5000), status: 'pending', dueDate: BigInt(Date.now() + 86400000), customerId: '2' }
];

const MOCK_PRODUCTS: Product[] = [
    { id: 'prod_1', name: 'Premium Plan', price: BigInt(2900), description: 'Monthly subscription', category: 'SaaS' },
    { id: 'prod_2', name: 'Consulting', price: BigInt(15000), description: 'Hourly rate', category: 'Services' }
];

export const useActor = () => {
    const [actor, setActor] = useState<any>(null);

    useEffect(() => {
        const mockActor = {
            getCallerUserProfile: async () => MOCK_PROFILE,
            saveCallerUserProfile: async (profile: UserProfile) => console.log('Saved profile', profile),

            getContacts: async () => MOCK_CONTACTS,
            getInvoices: async () => MOCK_INVOICES,
            getProducts: async () => MOCK_PRODUCTS,

            getSystemConfig: async () => ({ maintenanceMode: false, version: '1.0.0' }),

            registerFileReference: async (path: string, hash: string) => console.log('Registered file', path),
            getFileReference: async (path: string) => ({
                path,
                hash: 'mock-hash',
                url: `http://localhost:3018/mock/${path}`,
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
