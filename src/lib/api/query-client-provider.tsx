import React from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { AppError } from '@/lib/error-handling/errors';
import { errorLogger } from '@/lib/error-handling/error-logger';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default query options
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof AppError && error.status && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      onError: (error) => {
        // Log query errors
        errorLogger.error(error, {
          tags: ['query_error'],
        });
      },
    },
    mutations: {
      // Default mutation options
      retry: false, // Don't retry mutations by default
      onError: (error) => {
        // Log mutation errors
        errorLogger.error(error, {
          tags: ['mutation_error'],
        });
      },
    },
  },
});

// Provider component
export const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};

export { queryClient };