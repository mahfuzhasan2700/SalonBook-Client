'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('salonbook_token');
      const storedUser = localStorage.getItem('salonbook_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            // ignore JSON error
          }
        }

        // Verify token with backend
        try {
          const res = await apiFetch('/auth/me');
          if (res.success && res.user) {
            if (res.user.isBlocked) {
              toast.error('Your account has been suspended by salon administration.');
              logout();
            } else {
              setUser(res.user);
              localStorage.setItem('salonbook_user', JSON.stringify(res.user));
            }
          }
        } catch (error: any) {
          // Only log out if the server explicitly rejects the token (401 / expired / invalid)
          // Do NOT log out on simple network errors, offline server, or client-side evaluation
          const msg = (error?.message || '').toLowerCase();
          if (
            msg.includes('401') ||
            msg.includes('invalid or expired') ||
            msg.includes('access denied') ||
            msg.includes('user no longer exists')
          ) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('salonbook_token', newToken);
    localStorage.setItem('salonbook_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('salonbook_token');
    localStorage.removeItem('salonbook_user');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('salonbook_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        isAdmin,
        isCustomer,
      }}
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
