import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppError, ErrorCode } from '@/lib/error-handling/errors';
import { errorLogger } from '@/lib/error-handling/error-logger';

interface ErrorFallbackProps {
  error: Error | AppError | unknown;
  resetErrorBoundary?: () => void;
  message?: string;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showBackButton?: boolean;
  additionalActions?: React.ReactNode;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  message,
  showHomeButton = true,
  showRefreshButton = true,
  showBackButton = false,
  additionalActions
}) => {
  const router = useRouter();
  const appError = error instanceof AppError ? error : null;
  
  // Get appropriate error message
  const errorMessage = message || (appError?.getUserMessage() || 'حدث خطأ غير متوقع');
  
  // Get error title based on error type
  const getErrorTitle = () => {
    if (!appError) return 'خطأ غير متوقع';
    
    switch (appError.code) {
      case ErrorCode.NETWORK_ERROR:
        return 'خطأ في الاتصال بالشبكة';
      case ErrorCode.API_ERROR:
        return 'خطأ في الاتصال بالخادم';
      case ErrorCode.AUTH_ERROR:
      case ErrorCode.SESSION_EXPIRED:
        return 'خطأ في المصادقة';
      case ErrorCode.VALIDATION_ERROR:
        return 'خطأ في التحقق من البيانات';
      case ErrorCode.FIREBASE_ERROR:
        return 'خطأ في خدمة Firebase';
      default:
        return 'خطأ غير متوقع';
    }
  };
  
  // Generate a better help message based on the error type
  const getHelpMessage = () => {
    if (!appError) return 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.';
    
    switch (appError.code) {
      case ErrorCode.NETWORK_ERROR:
        return 'يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى.';
      case ErrorCode.API_ERROR:
        return 'يرجى المحاولة مرة أخرى لاحقًا، أو الاتصال بالدعم الفني إذا استمرت المشكلة.';
      case ErrorCode.AUTH_ERROR:
      case ErrorCode.SESSION_EXPIRED:
        return 'يرجى تسجيل الدخول مرة أخرى للمتابعة.';
      case ErrorCode.VALIDATION_ERROR:
        return 'يرجى التحقق من المعلومات المدخلة وتصحيحها.';
      default:
        return 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.';
    }
  };
  
  // Log error to monitoring service
  React.useEffect(() => {
    errorLogger.error(error);
  }, [error]);
  
  // Handlers
  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto my-8 shadow-xl border-destructive/20">
      <CardHeader className="bg-destructive/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-lg font-bold text-destructive">{getErrorTitle()}</CardTitle>
        </div>
        <CardDescription className="text-destructive/80">
          {errorMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <p className="text-muted-foreground mb-4">
          {getHelpMessage()}
        </p>
        {process.env.NODE_ENV !== 'production' && (
          <div className="p-3 bg-destructive/5 border border-destructive/20 rounded text-xs font-mono overflow-x-auto text-destructive">
            <p className="font-semibold mb-1">Error: {error instanceof Error ? error.message : String(error)}</p>
            {error instanceof Error && error.stack && (
              <p className="whitespace-pre-wrap">{error.stack}</p>
            )}
            {appError?.context && (
              <div className="mt-2">
                <p className="font-semibold mb-1">Context:</p>
                <pre>{JSON.stringify(appError.context, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2 p-4 pt-0">
        {showRefreshButton && (
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex-1"
          >
            <RefreshCw className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
            إعادة المحاولة
          </Button>
        )}
        
        {showBackButton && (
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex-1"
          >
            <Home className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
            العودة
          </Button>
        )}
        
        {showHomeButton && (
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">
              <Home className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
              الرئيسية
            </Link>
          </Button>
        )}
        
        {additionalActions}
      </CardFooter>
    </Card>
  );
};

export default ErrorFallback;