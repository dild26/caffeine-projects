import { useState, useEffect } from 'react';
import { BackendActor, Topic, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useActor() {
    const [actor, setActor] = useState<BackendActor | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        // Mock Data
        const mockTopics: Topic[] = [
            {
                id: '1',
                creator: Principal.fromText('2vxsx-fae'),
                content: "Just launched my new portfolio! Check it out.",
                description: "I've been working on this for months. It uses React and Tailwind.",
                votes: BigInt(15),
                reactions: ['🔥', '👍'],
                hashtags: ['#portfolio', '#react', '#webdev'],
                createdAt: BigInt(Date.now() - 100000),
                category: 'Showcase',
            },
            {
                id: '2',
                creator: Principal.fromText('2vxsx-fae'),
                content: "How to negotiate a salary raise effectively?",
                description: "Looking for tips on how to approach my manager for a raise.",
                votes: BigInt(42),
                reactions: ['💡', '👀'],
                hashtags: ['#career', '#advice', '#salary'],
                createdAt: BigInt(Date.now() - 500000),
                category: 'Advice',
            },
            {
                id: '3',
                creator: Principal.fromText('2vxsx-fae'),
                content: "The future of AI in software engineering.",
                description: "Will AI replace us or make us stronger? Let's discuss.",
                votes: BigInt(89),
                reactions: ['🤖', '🚀'],
                hashtags: ['#ai', '#tech', '#future'],
                createdAt: BigInt(Date.now() - 1000000),
                category: 'Discussion',
            },
        ];

        const mockProfiles: UserProfile[] = [
            {
                name: 'Alice Johnson',
                skills: ['React', 'TypeScript', 'UI/UX'],
                experiences: ['Senior Dev at TechCorp'],
                qualifications: ['BS in CS'],
                specializations: ['Frontend'],
                pros: ['Quick learner', 'Team player'],
                usps: ['Pixel perfect implementation'],
                referralId: 'alice123',
                totalVotes: BigInt(150),
                referralEarnings: BigInt(500),
                isPublic: true,
                visibleTopics: [],
            },
            {
                name: 'Bob Smith',
                skills: ['Rust', 'Motoko', 'ICP'],
                experiences: ['Blockchain Engineer'],
                qualifications: ['PhD in Cryptography'],
                specializations: ['Backend', 'Smart Contracts'],
                pros: ['Deep technical knowledge'],
                usps: ['Secure code'],
                referralId: 'bob456',
                totalVotes: BigInt(320),
                referralEarnings: BigInt(1200),
                isPublic: true,
                visibleTopics: [],
            }
        ];

        // Mock actor for local development
        const mockActor: BackendActor = {
            initializeAccessControl: async () => { },
            getCallerUserRole: async () => ({ user: null }),
            assignCallerUserRole: async () => { },
            isCallerAdmin: async () => true,
            getCallerUserProfile: async () => ({
                name: 'Demo User',
                skills: ['JavaScript', 'HTML', 'CSS'],
                experiences: ['Freelancer'],
                qualifications: ['Self-taught'],
                specializations: ['Web Development'],
                pros: ['Creative', 'Diligent'],
                usps: ['Fast delivery'],
                referralId: 'demo789',
                totalVotes: BigInt(10),
                referralEarnings: BigInt(100),
                isPublic: true,
                visibleTopics: [],
                upvotesGiven: BigInt(7),
                downvotesGiven: BigInt(3),
                referralPoints: BigInt(100),
                badges: ['Early Bird'],
            }),
            getUserProfile: async () => null,
            saveCallerUserProfile: async () => { },
            createTopic: async () => BigInt(mockTopics.length + 1),
            updateTopic: async () => { },
            deleteTopic: async () => { },
            refreshTopics: async () => { },
            hideTopic: async () => { },
            getTopicById: async () => null,
            getTopicBySlug: async () => null,
            getAllTopics: async () => mockTopics,
            getPaginatedTopics: async () => ({
                topics: mockTopics,
                pagination: {
                    currentPage: BigInt(1),
                    totalPages: BigInt(1),
                    pageSize: BigInt(20),
                    totalItems: BigInt(mockTopics.length),
                    hasNext: false,
                    hasPrevious: false,
                },
            }),
            getTopicCount: async () => BigInt(mockTopics.length),
            getLeaderboard: async () => mockProfiles,
            getSitemapEntries: async () => [],
            voteTopic: async () => { },
            incrementClickCount: async () => { },
            createStaticPage: async () => { },
            getStaticPage: async () => null,
            updateStaticPage: async () => { },
            deleteStaticPage: async () => { },
            getAllStaticPages: async () => [],
            addReaction: async () => { },
            searchTopicsByHashtag: async () => [],
            searchTopicsByCategory: async () => [],
            getCallerReferrals: async () => [],
            addReferral: async () => { },
            getCallerPayments: async () => [],
            addPaymentRecord: async () => { },
            getAllBlogPosts: async () => [],
            createBlogPost: async () => { },
            isStripeConfigured: async () => true,
            setStripeConfiguration: async () => { },
            getStripeSessionStatus: async () => ({ status: 'complete' }),
            createCheckoutSession: async () => "{}",
        };
        setActor(mockActor);
        setIsFetching(false);
    }, []);

    return { actor, isFetching };
}
