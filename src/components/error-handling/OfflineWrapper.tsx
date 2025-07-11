import React from 'react';
import { useOfflineDetector } from '@/hooks/use-offline-detector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';

interface OfflineWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresNetwork?: boolean;
}

/**
 * A component that wraps content that requires network access
 * and displays a fallback UI when offline
 */
const OfflineWrapper: React.FC<OfflineWrapperProps> = ({
  children,
  fallback,
  requiresNetwork = true
}) => {
  const { isOffline } = useOfflineDetector({ showToasts: false });
  
  // If we don't require network or we're online, render normally
  if (!requiresNetwork || !isOffline) {
    return <>{children}</>;
  }
  
  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default offline fallback
  return (
    <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
      <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
        <div className="flex items-center gap-2">
          <WifiOff className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-lg font-bold text-amber-700 dark:text-amber-400">
            أنت غير متصل بالإنترنت
          </CardTitle>
        </div>
        <CardDescription className="text-amber-600/90 dark:text-amber-400/90">
          يتطلب هذا المحتوى اتصالاً بالإنترنت للعمل بشكل صحيح
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 text-sm text-muted-foreground">
        <p className="mb-4">
          يبدو أنك غير متصل بالإنترنت حاليًا. يرجى التحقق من اتصالك وإعادة المحاولة.
        </p>
        <p className="text-xs">
          لا يزال بإمكانك استعراض الأجزاء الأخرى من التطبيق التي لا تتطلب اتصالاً بالإنترنت.
        </p>
      </CardContent>
    </Card>
  );
};

export default OfflineWrapper;