'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { errorLogger } from '@/lib/error-handling/error-logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    errorLogger.error(error, {
      extras: {
        componentStack: errorInfo.componentStack,
        errorInfo
      }
    });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <Card className="w-full max-w-md mx-auto my-8 shadow-xl border-destructive/20">
          <CardHeader className="bg-destructive/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle className="text-lg font-bold text-destructive">حدث خطأ غير متوقع</CardTitle>
            </div>
            <CardDescription className="text-destructive/80">
              نعتذر، حدث خطأ أثناء تحميل هذا المكوّن
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <p className="text-muted-foreground mb-4">
              يمكنك محاولة إعادة تحميل المكوّن أو العودة إلى الصفحة الرئيسية.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="p-3 bg-destructive/5 border border-destructive/20 rounded text-xs font-mono overflow-x-auto text-destructive">
                <p className="font-semibold mb-1">خطأ: {this.state.error.message}</p>
                <p className="whitespace-pre-wrap">{this.state.error.stack}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between gap-2 p-4 pt-0">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={this.handleReset}
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="ml-2 h-4 w-4" />
                الرئيسية
              </Link>
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;