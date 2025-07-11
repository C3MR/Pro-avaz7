// Error codes for consistent error handling
export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // API errors
  API_ERROR = 'API_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Data errors
  DATA_ERROR = 'DATA_ERROR',
  
  // Firebase specific errors
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Base application error class
export class AppError extends Error {
  code: ErrorCode;
  status?: number;
  context?: Record<string, any>;
  original?: unknown;
  
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    status?: number,
    context?: Record<string, any>,
    original?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.context = context;
    this.original = original;
    
    // Ensure proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  // Helper to format error for display to users
  public getUserMessage(): string {
    return this.getLocalizedMessage() || this.message;
  }
  
  // For localized error messages - can be expanded
  private getLocalizedMessage(): string | null {
    // Implementation would use i18n system
    return null;
  }
  
  // For logging purposes
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      context: this.context,
      stack: this.stack,
      original: this.original instanceof Error 
        ? {
            name: this.original.name,
            message: this.original.message,
            stack: this.original.stack
          } 
        : this.original
    };
  }
}

// Network error handling
export class NetworkError extends AppError {
  constructor(message: string, status?: number, context?: Record<string, any>, original?: unknown) {
    super(
      message || 'حدث خطأ في الاتصال بالشبكة',
      ErrorCode.NETWORK_ERROR,
      status,
      context,
      original
    );
    this.name = 'NetworkError';
  }
}

// API error handling
export class ApiError extends AppError {
  constructor(message: string, status?: number, context?: Record<string, any>, original?: unknown) {
    super(
      message || 'حدث خطأ في الاتصال بالخادم',
      ErrorCode.API_ERROR,
      status,
      context,
      original
    );
    this.name = 'ApiError';
  }
  
  // Factory methods for common API errors
  static notFound(message?: string, context?: Record<string, any>, original?: unknown): ApiError {
    return new ApiError(
      message || 'لم يتم العثور على المورد المطلوب',
      404,
      context,
      original
    );
  }
  
  static unauthorized(message?: string, context?: Record<string, any>, original?: unknown): ApiError {
    return new ApiError(
      message || 'غير مصرح لك بالوصول',
      401,
      context,
      original
    );
  }
  
  static forbidden(message?: string, context?: Record<string, any>, original?: unknown): ApiError {
    return new ApiError(
      message || 'ليس لديك صلاحية للوصول إلى هذا المورد',
      403,
      context,
      original
    );
  }
  
  static serverError(message?: string, context?: Record<string, any>, original?: unknown): ApiError {
    return new ApiError(
      message || 'حدث خطأ في الخادم',
      500,
      context,
      original
    );
  }
}

// Authentication error handling
export class AuthError extends AppError {
  constructor(message: string, context?: Record<string, any>, original?: unknown) {
    super(
      message || 'حدث خطأ في المصادقة',
      ErrorCode.AUTH_ERROR,
      401,
      context,
      original
    );
    this.name = 'AuthError';
  }
  
  static sessionExpired(context?: Record<string, any>, original?: unknown): AuthError {
    return new AuthError(
      'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
      context,
      original
    );
  }
}

// Validation error handling
export class ValidationError extends AppError {
  fieldErrors?: Record<string, string[]>;
  
  constructor(
    message: string, 
    fieldErrors?: Record<string, string[]>,
    context?: Record<string, any>,
    original?: unknown
  ) {
    super(
      message || 'بيانات غير صالحة',
      ErrorCode.VALIDATION_ERROR,
      400,
      context,
      original
    );
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
  
  // Get all validation messages as a flat array
  public getAllMessages(): string[] {
    if (!this.fieldErrors) return [this.message];
    
    return Object.values(this.fieldErrors).flat();
  }
}

// Firebase specific error handling
export class FirebaseError extends AppError {
  constructor(message: string, firebaseError: any, context?: Record<string, any>) {
    super(
      message || 'حدث خطأ في خدمة Firebase',
      ErrorCode.FIREBASE_ERROR,
      undefined,
      context,
      firebaseError
    );
    this.name = 'FirebaseError';
  }
}

// Helper function to map HTTP status codes to error types
export function mapHttpStatusToError(status: number, message?: string, context?: Record<string, any>, original?: unknown): AppError {
  switch (status) {
    case 400:
      return new ValidationError(message || 'بيانات غير صالحة', undefined, context, original);
    case 401:
      return ApiError.unauthorized(message, context, original);
    case 403:
      return ApiError.forbidden(message, context, original);
    case 404:
      return ApiError.notFound(message, context, original);
    case 500:
    case 502:
    case 503:
    case 504:
      return ApiError.serverError(message, context, original);
    default:
      return new ApiError(message || `خطأ في الخادم (${status})`, status, context, original);
  }
}

// Helper to create errors from unknown error objects
export function createErrorFromUnknown(error: unknown, defaultMessage = 'حدث خطأ غير معروف'): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }
  
  // Standard Error object
  if (error instanceof Error) {
    return new AppError(error.message, ErrorCode.UNKNOWN_ERROR, undefined, undefined, error);
  }
  
  // Firebase Error - need to check for specific format
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return new FirebaseError(
      (error as any).message,
      error,
      { code: (error as any).code }
    );
  }
  
  // String
  if (typeof error === 'string') {
    return new AppError(error);
  }
  
  // Default fallback
  return new AppError(defaultMessage, ErrorCode.UNKNOWN_ERROR, undefined, undefined, error);
}