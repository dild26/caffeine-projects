import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

interface InternetIdentityContextType {
    identity: any;
    login: () => void;
    clear: () => void;
    loginStatus: 'idle' | 'logging-in' | 'success';
}

const InternetIdentityContext = createContext<InternetIdentityContextType | null>(null);

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
    const [identity, setIdentity] = useState<any>(null);
    const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success'>('idle');

    const login = useCallback(async () => {
        setLoginStatus('logging-in');
        setTimeout(() => {
            setIdentity({ getPrincipal: () => ({ toText: () => 'mock-principal' }) });
            setLoginStatus('success');
        }, 1000);
    }, []);

    const clear = useCallback(async () => {
        setIdentity(null);
        setLoginStatus('idle');
    }, []);

    const value = {
        identity,
        login,
        clear,
        loginStatus,
    };

    return (
        <InternetIdentityContext.Provider value={value}>
            {children}
        </InternetIdentityContext.Provider>
    );
}

export function useInternetIdentity() {
    const context = useContext(InternetIdentityContext);
    if (!context) {
        throw new Error('useInternetIdentity must be used within an InternetIdentityProvider');
    }
    return context;
}
