import { createContext, useContext, useEffect, useState } from 'react';

interface InternetIdentityContextType {
    identity: any;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    isLoggingIn: boolean;
    loginStatus: 'idle' | 'logging-in' | 'success' | 'error';
}

const InternetIdentityContext = createContext<InternetIdentityContextType>({
    identity: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    isLoggingIn: false,
    loginStatus: 'idle',
});

export const InternetIdentityProvider = ({ children }: { children: React.ReactNode }) => {
    const [identity, setIdentity] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Mock init
        setIsAuthenticated(false);
    }, []);

    const login = async () => {
        setLoginStatus('logging-in');
        setTimeout(() => {
            setIsAuthenticated(true);
            setLoginStatus('success');
            // Mock identity
            setIdentity({ getPrincipal: () => ({ toText: () => "mock-principal-id" }) });
        }, 1000);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIdentity(null);
        setLoginStatus('idle');
    };

    return (
        <InternetIdentityContext.Provider value={{ identity, isAuthenticated, login, logout, isLoggingIn: loginStatus === 'logging-in', loginStatus }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};

export const useInternetIdentity = () => useContext(InternetIdentityContext);
