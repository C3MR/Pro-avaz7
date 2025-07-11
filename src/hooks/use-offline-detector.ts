import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineDetectorOptions {
  /**
   * Whether to show toast notifications when connection status changes
   */
  showToasts?: boolean;
  
  /**
   * Callback for when the app goes offline
   */
  onOffline?: () => void;
  
  /**
   * Callback for when the app comes back online
   */
  onOnline?: () => void;
}

/**
 * Hook that detects when the application is offline
 */
export function useOfflineDetector(options: OfflineDetectorOptions = {}) {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const { toast } = useToast();
  
  const { 
    showToasts = true,
    onOffline,
    onOnline
  } = options;

  useEffect(() => {
    // Set initial state based on navigator.onLine
    setIsOffline(!navigator.onLine);

    // Define event handlers
    const handleOffline = () => {
      setIsOffline(true);
      if (showToasts) {
        toast({
          title: "انقطع الاتصال بالإنترنت",
          description: "تم تفعيل وضع عدم الاتصال. بعض الميزات قد لا تعمل بشكل كامل.",
          variant: "destructive"
        });
      }
      if (onOffline) onOffline();
    };

    const handleOnline = () => {
      setIsOffline(false);
      if (showToasts) {
        toast({
          title: "تم استعادة الاتصال",
          description: "تم استعادة الاتصال بالإنترنت بنجاح."
        });
      }
      if (onOnline) onOnline();
    };

    // Add event listeners
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Clean up event listeners
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [toast, showToasts, onOffline, onOnline]);

  return { isOffline };
}