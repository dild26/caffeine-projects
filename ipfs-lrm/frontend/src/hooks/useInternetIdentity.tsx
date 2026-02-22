
import React, { createContext, useContext, useState, useEffect } from "react";

interface IdentityContextType {
    identity: any;
    loginStatus: string;
    isInitializing: boolean;
    login: () => void;
    logout: () => void;
    clear: () => void;
}

const IdentityContext = createContext<IdentityContextType>({
    identity: null,
    loginStatus: 'idle',
    isInitializing: true,
    login: () => { },
    logout: () => { },
    clear: () => { },
});

export const useInternetIdentity = () => useContext(IdentityContext);

export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [identity, setIdentity] = useState<any>(null);
    const [loginStatus, setLoginStatus] = useState('idle');
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Simple mock initialization
        setTimeout(() => setIsInitializing(false), 500);
    }, []);

    const login = () => {
        setLoginStatus('authenticating');
        setTimeout(() => {
            setIdentity({
                id: "mock-id",
                getPrincipal: () => ({
                    toString: () => "mock-principal-abc-123"
                })
            });
            setLoginStatus('authenticated');
        }, 1000);
    };

    const logout = () => {
        setIdentity(null);
        setLoginStatus('idle');
    };

    const clear = logout;

    return (
        <IdentityContext.Provider value={{ identity, loginStatus, isInitializing, login, logout, clear }}>
            {children}
        </IdentityContext.Provider>
    );
};
