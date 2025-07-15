
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4" dir="rtl">
      <AlertTriangle className="w-20 h-20 text-destructive mb-8" />
      <h1 className="text-3xl md:text-4xl font-bold text-destructive mb-4 font-headline">
        عذرًا، حدث خطأ غير متوقع
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
        نأسف للإزعاج. يبدو أن هناك مشكلة فنية مؤقتة. فريقنا يعمل على إصلاحها. يمكنك محاولة تحديث الصفحة أو العودة لاحقًا.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <RefreshCcw className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> تحديث الصفحة
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            العودة إلى الرئيسية
          </Link>
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 text-xs text-muted-foreground text-left rtl:text-right bg-muted/50 p-3 rounded-md max-w-xl w-full">
            <summary className="cursor-pointer font-medium">تفاصيل الخطأ (للمطورين)</summary>
            <pre className="mt-2 whitespace-pre-wrap break-all text-xs">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
                {error.stack && `\n\nStack Trace:\n${error.stack}`}
            </pre>
        </details>
      )}
       <p className="text-xs text-muted-foreground mt-6">
        إذا استمرت المشكلة، يرجى التواصل مع فريق الدعم الفني لشركة AVAZ العقارية.
      </p>
    </div>
  );
}

