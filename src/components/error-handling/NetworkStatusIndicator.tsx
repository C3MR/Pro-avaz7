import React from 'react';
import { useOfflineDetector } from '@/hooks/use-offline-detector';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkStatusIndicatorProps {
  showText?: boolean;
  className?: string;
}

const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  showText = true,
  className
}) => {
  const { isOffline } = useOfflineDetector({ showToasts: false });
  
  // Handle the case where we're in SSR
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 transition-all",
        isOffline 
          ? "bg-destructive/10 text-destructive" 
          : "bg-green-500/10 text-green-600 dark:text-green-400",
        className
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-3 w-3" />
          {showText && <span>غير متصل</span>}
        </>
      ) : (
        <>
          <Wifi className="h-3 w-3" />
          {showText && <span>متصل</span>}
        </>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;