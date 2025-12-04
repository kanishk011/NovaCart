'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client/react';
import { store } from '@/store';
import { apolloClient } from '@/lib/apolloClient';
import AuthProvider from '@/components/AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
}
