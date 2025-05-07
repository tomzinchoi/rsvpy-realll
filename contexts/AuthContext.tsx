'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 임시로 User와 Session 타입 정의
interface User {
  id: string;
  email?: string;
}

interface Session {
  user: User;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 임시 인증 함수들
  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    console.log('Sign in attempt:', email);
    // 실제 인증 로직은 구현되지 않음 (환경 변수 누락으로 인해 비활성화)
    return { error: null };
  };

  const signUp = async (email: string, password: string): Promise<{ error: any }> => {
    console.log('Sign up attempt:', email);
    // 실제 인증 로직은 구현되지 않음 (환경 변수 누락으로 인해 비활성화)
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
