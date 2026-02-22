import { useState, useEffect } from 'react';

export function useInternetIdentity() {
    const [identity, setIdentity] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Mock identity for rapid development
        setIdentity({
            getPrincipal: () => ({
                toString: () => "2vxsx-fae",
                toText: () => "2vxsx-fae"
            })
        });
        setIsInitializing(false);
    }, []);

    const login = async () => { };
    const logout = async () => { };
    const clear = async () => { };
    const isLoggingIn = false;

    return { identity, isInitializing, login, logout, clear, isLoggingIn };
}

export function InternetIdentityProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
