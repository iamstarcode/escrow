import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import React from 'react';

import * as SecureStore from 'expo-secure-store';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  AuthSession,
  AuthUser,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '../lib/supabase';

export interface IAuthState {
  accessToken: string;
  authenticated: boolean;
}

export interface AuthContextType {
  //authState: IAuthState;
  //setAuthState: (authState: IAuthState) => void;
  //getAccessToken: () => void;
  //logout: () => void;
  session: AuthSession | null | undefined;
  getAuthSupabaseClient: () => Promise<SupabaseClient<any, 'public', any>>;
}

/* const initialData: AuthContextType = {
  authState: {
    accessToken: '',
    authenticated: false,
  },
  setAuthState: () => '',
  getAccessToken: () => '',
  logout: () => '',
  session: null,
}; */

interface Props {
  children?: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: Props) {
  const supabase = useSupabaseClient();

  const [session, setSession] = useState<AuthSession | null | undefined>(null);
  //const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListner } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log(`event raised${_event}`);
        setSession(session);
      }
    );

    return () => {
      authListner.subscription;
    };
  }, []);

  const getAuthSupabaseClient = async () => {
    const session = await supabase.auth.getSession();
    const accessToken = session?.data.session?.access_token;
    console.log('s', accessToken);
    const authSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    return authSupabase;
  };
  return (
    <AuthContext.Provider value={{ session, getAuthSupabaseClient }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a MyUserContextProvider.`);
  }
  return context;
};
