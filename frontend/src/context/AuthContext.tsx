'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  shop_name?: string;
  phone?: string;
  address?: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'SHOPKEEPER';
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isShopkeeper: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await fetchApi<User>('/auth/me');
          setUser(userData);
        } catch (err) {
          console.error('Failed to restore session:', err);
          removeAuthToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetchApi<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.access_token);
    setUser(res.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saasha_user', JSON.stringify(res.user));
    }
    return res.user;
  };

  const register = async (data: any): Promise<User> => {
    const res = await fetchApi<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(res.access_token);
    setUser(res.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saasha_user', JSON.stringify(res.user));
    }
    return res.user;
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'SUPERADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const isShopkeeper = user?.role === 'SHOPKEEPER';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isSuperAdmin, isAdmin, isShopkeeper }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
