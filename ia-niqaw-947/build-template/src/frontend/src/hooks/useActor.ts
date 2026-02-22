import { useState, useEffect, useMemo } from 'react';
import { HttpAgent, Actor, ActorSubclass } from '@dfinity/agent';
import { useInternetIdentity } from './useInternetIdentity';

// Stub IDL factory — in production this comes from dfx generate
const idlFactory = ({ IDL }: any) => {
    return IDL.Service({});
};

const canisterId = (import.meta as any).env?.CANISTER_ID_BACKEND || 'aaaaa-aa';

export function useActor() {
    const { identity } = useInternetIdentity();
    const [isFetching, setIsFetching] = useState(true);
    const [actor, setActor] = useState<ActorSubclass<any> | null>(null);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            try {
                const agent = await HttpAgent.create({
                    identity: identity ?? undefined,
                    host: (import.meta as any).env?.DFX_NETWORK === 'local'
                        ? 'http://127.0.0.1:4943'
                        : 'https://icp-api.io',
                });

                // Only fetch root key in local dev
                if ((import.meta as any).env?.DFX_NETWORK === 'local') {
                    await agent.fetchRootKey().catch(console.warn);
                }

                const createdActor = Actor.createActor(idlFactory, {
                    agent,
                    canisterId,
                });

                setActor(createdActor);
            } catch (error) {
                console.warn('Actor creation failed (expected without canister):', error);
                setActor(null);
            } finally {
                setIsFetching(false);
            }
        };

        init();
    }, [identity]);

    return { actor, isFetching };
}
