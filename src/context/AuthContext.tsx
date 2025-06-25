'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AuthData = {
  access: string;
  refresh: string;
  username: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = (data: AuthData) => {
    localStorage.setItem('auth', JSON.stringify(data));
    localStorage.setItem('token', data.access);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
