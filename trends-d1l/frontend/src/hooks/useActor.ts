import { useState, useEffect } from 'react';
import { BackendActor, VoteAction } from '../backend';

export function useActor() {
    const [actor, setActor] = useState<BackendActor | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        // Mock actor for local development
        const mockActor: BackendActor = {
            initializeAccessControl: async () => { },
            getCallerUserRole: async () => ({ user: null }),
            assignCallerUserRole: async () => { },
            isCallerAdmin: async () => true,
            getCallerUserProfile: async () => ({
                name: 'Mock User',
                totalVotes: BigInt(10),
                upvotesGiven: BigInt(7),
                downvotesGiven: BigInt(3),
                referralPoints: BigInt(100),
                badges: ['Early Bird'],
            }),
            getUserProfile: async () => null,
            saveCallerUserProfile: async () => { },
            createTopic: async () => BigInt(1),
            updateTopic: async () => { },
            deleteTopic: async () => { },
            refreshTopics: async () => { },
            hideTopic: async () => { },
            getTopicById: async () => null,
            getTopicBySlug: async () => null,
            getPaginatedTopics: async () => ({
                topics: [],
                pagination: {
                    currentPage: BigInt(1),
                    totalPages: BigInt(1),
                    pageSize: BigInt(20),
                    totalItems: BigInt(0),
                    hasNext: false,
                    hasPrevious: false,
                },
            }),
            getTopicCount: async () => BigInt(0),
            getLeaderboard: async () => ({
                topTopics: [],
                topVoters: [],
            }),
            getSitemapEntries: async () => [],
            voteTopic: async () => { },
            incrementClickCount: async () => { },
            createStaticPage: async () => { },
            getStaticPage: async () => null,
            updateStaticPage: async () => { },
            deleteStaticPage: async () => { },
            getAllStaticPages: async () => [],
        };
        setActor(mockActor);
        setIsFetching(false);
    }, []);

    return { actor, isFetching };
}
