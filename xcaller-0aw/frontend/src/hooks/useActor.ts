import { useState, useEffect } from 'react';
import { _SERVICE, Domain, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

const MOCK_DOMAINS: Domain[] = [
    {
        url: 'https://google.com',
        name: 'Google',
        description: 'Search Engine',
        category: 'Tech',
        upvotes: BigInt(100),
        downvotes: BigInt(2),
        score: BigInt(98),
        clickCount: BigInt(500),
        createdAt: BigInt(Date.now())
    },
    {
        url: 'https://github.com',
        name: 'GitHub',
        description: 'Code Hosting',
        category: 'Development',
        upvotes: BigInt(250),
        downvotes: BigInt(5),
        score: BigInt(245),
        clickCount: BigInt(1200),
        createdAt: BigInt(Date.now())
    }
];

export function useActor() {
    const [actor, setActor] = useState<_SERVICE | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const mockActor: _SERVICE = {
            getCallerUserProfile: async () => ({
                name: 'Mock User',
                email: 'mock@example.com',
                role: 'admin',
                createdAt: BigInt(Date.now())
            }),
            saveCallerUserProfile: async (profile) => {
                console.log('Saved profile:', profile);
            },
            isCallerAdmin: async () => true,
            getDomains: async () => MOCK_DOMAINS,
            addDomain: async (url) => {
                console.log('Added domain:', url);
            },
            upvoteDomain: async (url) => {
                console.log('Upvoted domain:', url);
            },
            downvoteDomain: async (url) => {
                console.log('Downvoted domain:', url);
            },
            incrementClickCount: async (url) => {
                console.log('Incremented click count:', url);
            },
            deleteDomain: async (url) => {
                console.log('Deleted domain:', url);
            },
            generateDomains: async (urls) => {
                console.log('Generated domains:', urls);
            }
        };
        setActor(mockActor);
        setIsFetching(false);
    }, []);

    return { actor, isFetching };
}
