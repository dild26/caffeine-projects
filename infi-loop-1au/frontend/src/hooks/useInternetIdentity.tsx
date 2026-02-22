import { createContext, useContext, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';

interface InternetIdentityContextType {
    identity: any;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    isLoggingIn: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType>({
    identity: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    isLoggingIn: false
});

export const InternetIdentityProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [identity, setIdentity] = useState<any>({
        getPrincipal: () => Principal.fromText('2vxsx-fae')
    });

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <InternetIdentityContext.Provider value={{ identity, isAuthenticated, login, logout, isLoggingIn: false }}>
            {children}
        </InternetIdentityContext.Provider>
    );
};

export const useInternetIdentity = () => useContext(InternetIdentityContext);
