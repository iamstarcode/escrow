import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import React from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SessionContextProvider>
    </Provider>
  );
};

export default AppWrapper;
