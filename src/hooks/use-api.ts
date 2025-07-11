import { useState, useCallback } from 'react';
import { useOfflineDetector } from './use-offline-detector';
import { fetchWithErrorHandling, FetchOptions } from '@/lib/api/fetch-wrapper';
import { AppError, NetworkError } from '@/lib/error-handling/errors';
import { errorLogger } from '@/lib/error-handling/error-logger';

interface ApiHookState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ApiHookOptions<T> extends Omit<FetchOptions, 'body'> {
  /**
   * When true, the request will be made immediately when the hook is called
   */
  immediate?: boolean;
  
  /**
   * Callback to execute when request is successful
   */
  onSuccess?: (data: T) => void;
  
  /**
   * Callback to execute when request fails
   */
  onError?: (error: AppError) => void;
  
  /**
   * Initial data to use before request completes
   */
  initialData?: T | null;
  
  /**
   * When true, request will not be made when offline
   * (throws error instead when execute() is called)
   */
  requiresNetwork?: boolean;
}

/**
 * A hook for making API requests with full error handling
 */
export function useApi<T = any, B = any>(
  url: string,
  options: ApiHookOptions<T> = {}
) {
  const {
    immediate = false,
    onSuccess,
    onError,
    initialData = null,
    requiresNetwork = true,
    ...fetchOptions
  } = options;
  
  const { isOffline } = useOfflineDetector();
  
  const [state, setState] = useState<ApiHookState<T>>({
    data: initialData,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false
  });
  
  const execute = useCallback(async (body?: B, overrideOptions?: Partial<FetchOptions>): Promise<T | null> => {
    // Check for offline status if network is required
    if (requiresNetwork && isOffline) {
      const error = new NetworkError(
        'لا يمكن تنفيذ هذا الطلب بدون اتصال بالإنترنت. يرجى التحقق من اتصالك وحاول مرة أخرى.',
        undefined,
        { url }
      );
      
      setState(prev => ({
        ...prev,
        error,
        isError: true,
        isLoading: false,
        isSuccess: false
      }));
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
    
    // Start loading
    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null
    }));
    
    // Prepare request options
    const requestOptions: FetchOptions = {
      ...fetchOptions,
      ...overrideOptions
    };
    
    // Add body if provided
    if (body) {
      requestOptions.body = typeof body === 'string' 
        ? body
        : JSON.stringify(body);
        
      // Set content type if not already set and body is an object
      if (!requestOptions.headers?.['Content-Type'] && typeof body !== 'string') {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Content-Type': 'application/json'
        };
      }
    }
    
    try {
      // Execute request
      const result = await fetchWithErrorHandling<T>(url, requestOptions);
      
      // Update state with success
      setState({
        data: result,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false
      });
      
      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      // Convert to AppError if needed
      const appError = error instanceof AppError 
        ? error 
        : new AppError(`خطأ أثناء تنفيذ الطلب: ${error instanceof Error ? error.message : String(error)}`, undefined, undefined, { url }, error);
      
      // Log the error
      errorLogger.error(appError, {
        extras: { url, options: requestOptions }
      });
      
      // Update state with error
      setState({
        data: initialData,
        error: appError,
        isLoading: false,
        isSuccess: false,
        isError: true
      });
      
      // Call onError callback
      if (onError) {
        onError(appError);
      }
      
      throw appError;
    }
  }, [url, fetchOptions, initialData, onSuccess, onError, isOffline, requiresNetwork]);
  
  // Execute immediately if requested
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Reset function to clear error and data
  const reset = useCallback(() => {
    setState({
      data: initialData,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false
    });
  }, [initialData]);
  
  return {
    ...state,
    execute,
    reset
  };
}