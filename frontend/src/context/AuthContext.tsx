import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'USER' | 'SERVICE_PROVIDER';

interface AuthState {
    token: string | null;
    role: Role | null;
}

interface AuthContextType extends AuthState {
    login: (token: string, role: Role) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role') as Role | null,
    });

    const login = (token: string, role: Role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setAuth({ token, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth({ token: null, role: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated: !!auth.token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
