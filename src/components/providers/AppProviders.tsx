'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ---
// Global Providers
// Wraps the application with TanStack React Query's cache provider.
// Zustand stores are module-level singletons and do not need a provider.
// ---

export function AppProviders({ children }: { children: ReactNode }) {
  // Create a stable QueryClient per browser tab to avoid shared cache in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,       // Data is fresh for 60 s
            refetchOnWindowFocus: false, // POS terminals remain on-screen
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
