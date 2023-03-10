import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import React from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  AuthSession,
  AuthUser,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '../../lib/supabase';
import { useRouter, useSegments, usePathname, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_STORAGE_KEY } from '../../config/constants';

export interface IAuthState {
  accessToken: string;
  authenticated: boolean;
}

export interface AuthContextType {
  session: AuthSession | null | undefined;
  getAuthSupabaseClient: () => Promise<SupabaseClient<any, 'public', any>>;
}

interface Props {
  children?: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: Props) {
  const supabase = useSupabaseClient();
  const segments = useSegments();
  const router = useRouter();
  const path = usePathname();

  const [session, setSession] = useState<AuthSession | null | undefined>(null);

  //console.log(path);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListner } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        //console.log(`${_event}:event raised`);
        if (_event == 'TOKEN_REFRESHED') {
          //Handle Accordinngly
        }
      }
    );

    return () => {
      authListner.subscription;
    };
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session?.user &&
      !inAuthGroup
    ) {
      AsyncStorage.getItem(SUPABASE_STORAGE_KEY).then((authStorage) => {
        if (authStorage) {
          //if we have a storage dont flash to sign in
        } else {
          router.replace('/sign-in');
        }
      });
    } else if (session?.user && inAuthGroup) {
      // Redirect away from the sign-in page.

      router.replace('/');
    }
  }, [session, segments]);

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
