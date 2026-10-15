import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type AuthSession, type SignUpData } from '@/services/authService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSession(authService.getSession());
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const newSession = await authService.signInWithPassword(email, password);
      setSession(newSession);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpData) => {
    setLoading(true);
    try {
      const newSession = await authService.signUp(data);
      setSession(newSession);
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    setLoading(true);
    try {
      const newSession = await authService.verifyPhoneOtp(phone, otp);
      setSession(newSession);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      const newSession = await authService.signInAsDemo();
      setSession(newSession);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session && session.expiresAt > Date.now(),
        loading,
        login,
        signup,
        loginWithOtp,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
