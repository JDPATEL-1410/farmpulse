
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string, fullName?: string) => Promise<void>;
  resetPassword: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('FARMPULSE_AUTH_USER');
    const savedToken = localStorage.getItem('FARMPULSE_JWT_TOKEN');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await dbService.authenticateUser(username, password);
      if (result) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('FARMPULSE_AUTH_USER', JSON.stringify(result.user));
        localStorage.setItem('FARMPULSE_JWT_TOKEN', result.token);
      } else {
        throw new Error('Invalid credentials. Please check your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, email?: string, fullName?: string) => {
    setLoading(true);
    try {
      const result = await dbService.registerUser(username, password, email, fullName);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('FARMPULSE_AUTH_USER', JSON.stringify(result.user));
      localStorage.setItem('FARMPULSE_JWT_TOKEN', result.token);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (username: string, password: string) => {
    setLoading(true);
    try {
      await dbService.resetPassword(username, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('FARMPULSE_AUTH_USER');
    localStorage.removeItem('FARMPULSE_JWT_TOKEN');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, resetPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
