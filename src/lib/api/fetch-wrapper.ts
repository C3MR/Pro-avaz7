import { 
  AppError, 
  ApiError, 
  NetworkError, 
  ErrorCode,
  mapHttpStatusToError 
} from '@/lib/error-handling/errors';

// Define request options type extending the standard fetch options
export interface FetchOptions extends RequestInit {
  // Custom options for our fetch wrapper
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Default options
const defaultOptions: FetchOptions = {
  timeout: 30000, // 30 seconds
  retries: 1,
  retryDelay: 1000 // 1 second
};

/**
 * Enhanced fetch function with error handling, retries, and timeouts
 */
export async function fetchWithErrorHandling<T>(
  url: string, 
  options: FetchOptions = {}
): Promise<T> {
  // Merge default options with provided options
  const finalOptions: FetchOptions = { 
    ...defaultOptions,
    ...options
  };
  
  const { timeout, retries, retryDelay, ...fetchOptions } = finalOptions;
  
  // Initialize retry counter
  let retriesLeft = retries || 0;
  
  // Keep trying until we succeed or run out of retries
  while (true) {
    try {
      // Create abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = timeout 
        ? setTimeout(() => controller.abort(), timeout) 
        : null;
      
      // Add signal to options if not already present
      const enhancedOptions = {
        ...fetchOptions,
        signal: fetchOptions.signal || controller.signal
      };
      
      // Attempt fetch
      let response: Response;
      
      try {
        response = await fetch(url, enhancedOptions);
        // Clear timeout if request completes
        if (timeoutId) clearTimeout(timeoutId);
      } catch (error) {
        // Clear timeout if request fails
        if (timeoutId) clearTimeout(timeoutId);
        
        // Handle fetch errors (network errors, aborts)
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new NetworkError('تم إلغاء الطلب بسبب تجاوز المهلة المحددة', undefined, { url, timeout });
        }
        
        // Any other fetch error is a network error
        throw new NetworkError(
          'حدث خطأ في الاتصال بالشبكة',
          undefined,
          { url },
          error
        );
      }
      
      // Handle HTTP error status codes
      if (!response.ok) {
        let errorData;
        try {
          // Try to parse error response as JSON
          errorData = await response.json();
        } catch (e) {
          // If parsing fails, use text instead
          try {
            errorData = await response.text();
          } catch (_) {
            // If that also fails, use status text
            errorData = response.statusText;
          }
        }
        
        // Map HTTP status to appropriate error
        throw mapHttpStatusToError(
          response.status,
          typeof errorData === 'object' && errorData?.message 
            ? errorData.message 
            : `خطأ في الطلب: ${response.statusText}`,
          { url, errorData },
          errorData
        );
      }
      
      // Check for empty response
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as T;
      }
      
      // Parse response based on content type
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        return await response.json() as T;
      } else if (contentType?.includes('text/')) {
        return await response.text() as unknown as T;
      } else {
        // Return raw response for blob/arraybuffer etc.
        return response as unknown as T;
      }
    } catch (error) {
      // If we have retries left and it's a retryable error, wait and retry
      if (
        retriesLeft > 0 && 
        (error instanceof NetworkError || 
         (error instanceof ApiError && error.status && error.status >= 500))
      ) {
        retriesLeft--;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue; // Try again
      }
      
      // Otherwise, throw the error
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          'حدث خطأ غير متوقع أثناء الاتصال بالخادم',
          ErrorCode.UNKNOWN_ERROR,
          undefined,
          { url },
          error
        );
      }
    }
  }
}