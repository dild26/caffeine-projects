import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

type LoginStatus = 'initializing' | 'idle' | 'logging-in' | 'logged-in';

interface InternetIdentityContextValue {
    identity: Identity | null;
    login: () => Promise<void>;
    clear: () => Promise<void>;
    isLoggingIn: boolean;
    loginStatus: LoginStatus;
}

const InternetIdentityContext = createContext<InternetIdentityContextValue>({
    identity: null,
    login: async () => { },
    clear: async () => { },
    isLoggingIn: false,
    loginStatus: 'initializing',
});

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [loginStatus, setLoginStatus] = useState<LoginStatus>('initializing');

    useEffect(() => {
        AuthClient.create().then(async (client) => {
            setAuthClient(client);
            if (await client.isAuthenticated()) {
                const id = client.getIdentity();
                if (id.getPrincipal().toText() !== '2vxsx-fae') {
                    setIdentity(id);
                    setLoginStatus('logged-in');
                } else {
                    setLoginStatus('idle');
                }
            } else {
                setLoginStatus('idle');
            }
        });
    }, []);

    const login = useCallback(async () => {
        if (!authClient) return;
        setLoginStatus('logging-in');
        const iiUrl = (import.meta as any).env?.II_URL || 'https://identity.internetcomputer.org/';
        await authClient.login({
            identityProvider: iiUrl,
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1_000_000_000),
            onSuccess: () => {
                const id = authClient.getIdentity();
                setIdentity(id);
                setLoginStatus('logged-in');
            },
            onError: (error) => {
                console.error('Login failed:', error);
                setLoginStatus('idle');
            },
        });
    }, [authClient]);

    const clear = useCallback(async () => {
        if (!authClient) return;
        await authClient.logout();
        setIdentity(null);
        setLoginStatus('idle');
    }, [authClient]);

    const isLoggingIn = loginStatus === 'logging-in';

    return (
        <InternetIdentityContext.Provider value={{ identity, login, clear, isLoggingIn, loginStatus }}>
            {children}
        </InternetIdentityContext.Provider>
    );
}

export function useInternetIdentity() {
    return useContext(InternetIdentityContext);
}
