
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorFallback } from "@/components/error-handling";
import { AlertTriangle, RefreshCcw, Maximize2 } from "lucide-react";
import Link from "next/link";
import { errorLogger } from '@/lib/error-handling/error-logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    errorLogger.error(error, {
      tags: ['app_error', 'unhandled'],
      extras: { digest: error.digest }
    });
  }, [error]);

  return (
    <ErrorFallback 
      error={error}
      resetErrorBoundary={reset}
      message="عذرًا، حدث خطأ غير متوقع في التطبيق"
      showHomeButton={true}
      showRefreshButton={true}
      additionalActions={
        <Button asChild variant="outline" className="flex-1">
          <Link href="/contact-us">
            <MessageSquare className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
            اتصل بالدعم
          </Link>
        </Button>
      }
    />
  );
}

