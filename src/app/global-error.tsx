'use client';
 
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { errorLogger } from '@/lib/error-handling/error-logger';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    errorLogger.error(error, {
      tags: ['global_error'],
      extras: { digest: error.digest },
    });
  }, [error]);
 
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card shadow-lg rounded-lg border border-destructive/20 overflow-hidden">
            <div className="bg-destructive/10 p-6 flex justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-destructive mb-4 text-center">
                خطأ حرج في التطبيق
              </h1>
              <p className="text-muted-foreground mb-6 text-center">
                عذرًا، حدث خطأ غير متوقع أثناء تحميل التطبيق. يرجى تحديث الصفحة أو العودة لاحقًا.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <RefreshCw className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                  إعادة تحميل التطبيق
                </Button>
                <Button asChild variant="outline">
                  <a href="/">
                    <Home className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                    العودة للرئيسية
                  </a>
                </Button>
              </div>
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-8 p-4 bg-destructive/5 rounded border border-destructive/20">
                  <p className="text-sm font-semibold text-destructive mb-2">تفاصيل الخطأ (وضع التطوير):</p>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-destructive/80">
                    {error.message}
                    {error.digest && <p>Digest: {error.digest}</p>}
                    {error.stack && <p className="mt-2">{error.stack}</p>}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}