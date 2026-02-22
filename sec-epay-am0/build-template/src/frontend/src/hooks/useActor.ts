import { useMemo } from 'react';
import type { BackendActor, UserProfile, Transaction, Subscription, LeaderboardEntry, AdminSettings, ContactInfo, FeatureStatus, ThemeMode, SystemComparison, TermsVersion, AdminNotice, SitemapState, SitemapEntry } from '../backend';

const mockProfile: UserProfile = {
    name: "Genesis Admin",
    upiId: "secoin@uboi",
    mobileNumber: "+91-962-005-8644",
    accountType: { individual: null },
    registrationTime: BigInt(Date.now())
};

const mockSettings: AdminSettings = {
    conversionRate: { value: 90n, unit: 'INR/USD', scale: 0n, editableBy: ['Admin'] },
    subscriptionFee: { value: 1000n, unit: 'INR', scale: 0n, editableBy: ['Admin'] },
    rotationCycle: 3600n
};

export function useActor() {
    const actor = useMemo<BackendActor>(() => ({
        getCallerUserProfile: async () => mockProfile,
        getUserProfile: async () => mockProfile,
        saveCallerUserProfile: async () => { },
        isCallerApproved: async () => true,
        requestApproval: async () => { },
        setApproval: async () => { },
        listApprovals: async () => [],
        createTransaction: async () => 1n,
        getTransaction: async () => null,
        getUserTransactions: async () => [],
        getAllTransactions: async () => [],
        createSubscription: async () => { },
        getSubscription: async () => null,
        getAllSubscriptions: async () => [],
        updateLeaderboard: async () => { },
        getLeaderboard: async () => [],
        updateAdminSettings: async () => { },
        getAdminSettings: async () => mockSettings,
        getContactInfo: async () => ({
            ceo: "DILEEP KUMAR D, CEO of SECOINFI",
            email: "dild26@gmail.com",
            phone: "+91-962-005-8644",
            website: "www.seco.in.net",
            whatsapp: "+91-962-005-8644",
            address: "Sudha Enterprises, No. 157, V R Vihar, Varadaraj Nagar, Vidyaranyapura PO, Bangalore-560097",
            paypal: "newgoldenjewel@gmail.com",
            upiId: "secoin@uboi",
            ethId: "0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7",
            facebook: "https://facebook.com/dild26",
            linkedin: "https://www.linkedin.com/in/dild26",
            telegram: "https://t.me/dilee",
            discord: "https://discord.com/users/dild26",
            blog: "https://dildiva.blogspot.com",
            instagram: "https://instagram.com/newgoldenjewel",
            twitter: "https://twitter.com/dil_sec",
            youtube: "https://m.youtube.com/@dileepkumard4484/videos",
            mapLink: "https://maps.google.com/?q=Sudha+Enterprises,+No.+157,+V+R+Vihar,+Varadaraj+Nagar,+Vidyaranyapura+PO,+Bangalore-560097",
            googleMapsLink: "https://www.google.com/maps/dir/?api=1&destination=Sudha+Enterprises,+No.+157,+V+R+Vihar,+Varadaraj+Nagar,+Vidyaranyapura+PO,+Bangalore-560097"
        }),
        updateContactInfo: async () => { },
        getFeatureStatus: async () => null,
        getAllFeatureStatuses: async () => [],
        updateFeatureStatus: async () => { },
        getTheme: async () => 'vibgyor',
        setTheme: async () => { },
        getSystemComparison: async () => ({
            imageUrl: "/images/Sec-ePay.png",
            description: "Mock comparison",
            comparisonTable: "Table content",
            conversionRate: "1 USD = 90 INR",
            uspSection: "USP Section"
        }),
        updateSystemComparison: async () => { },
        publishTermsVersion: async () => 1n,
        acceptTerms: async () => { },
        getCurrentTermsVersion: async () => ({
            id: 1n,
            slug: "terms-v1",
            version: 1n,
            title: "Terms and Conditions",
            effectiveDate: BigInt(Date.now()),
            content: "These are the terms...",
            changelog: "Initial version",
            isPublic: true,
            criticalUpdate: false,
            createdByAdmin: null
        }),
        getTermsVersion: async () => null,
        getAllTermsVersions: async () => [],
        hasUserAcceptedTerms: async () => true,
        getUserTermsAcceptance: async () => null,
        createAdminNotice: async () => 1n,
        getAllAdminNotices: async () => [],
        getActiveAdminNotices: async () => [],
        addManualPage: async () => { },
        delegateControlledRoute: async () => { },
        getSitemapState: async () => ({
            auto: ["home", "dashboard"],
            manualPages: [],
            controlledRoutes: [],
            version: 1n,
            merkleHash: "",
            createdBy: null,
            createdAt: BigInt(Date.now()),
            lastModified: BigInt(Date.now())
        }),
        getAllPages: async () => [],
        isCallerAdmin: async () => true
    }), []);

    return { actor, isFetching: false };
}
