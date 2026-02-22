import { createContext, useContext, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';

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
    loginStatus: 'idle'
});

export const InternetIdentityProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState<any>(null);
    const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success' | 'error'>('idle');

    const login = () => {
        setLoginStatus('logging-in');
        setTimeout(() => {
            setIsAuthenticated(true);
            setIdentity({
                getPrincipal: () => Principal.fromText('2vxsx-fae')
            });
            setLoginStatus('success');
        }, 1000);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIdentity(null);
        setLoginStatus('idle');
    };

    useEffect(() => {
        // Auto-login for dev
        // login();
    }, []);

    return (
        <InternetIdentityContext.Provider value={{ identity, isAuthenticated, login, logout, isLoggingIn: loginStatus === 'logging-in', loginStatus }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};

export const useInternetIdentity = () => useContext(InternetIdentityContext);
