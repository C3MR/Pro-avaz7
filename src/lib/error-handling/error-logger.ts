// Error logging utility

interface LogOptions {
  level: 'info' | 'warn' | 'error' | 'debug';
  tags?: string[];
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  extras?: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isProduction: boolean;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  // Main logging method
  public log(error: unknown, options: Partial<LogOptions> = {}): void {
    const opts: LogOptions = {
      level: options.level || 'error',
      tags: options.tags || [],
      user: options.user,
      extras: options.extras || {},
    };

    // Always log to console in development
    if (!this.isProduction) {
      this.logToConsole(error, opts);
    }

    // In production, log to your monitoring service
    if (this.isProduction) {
      this.logToService(error, opts);
    }
  }

  // For development
  private logToConsole(error: unknown, options: LogOptions): void {
    const { level, tags, user, extras } = options;
    
    // Create a formatted log object
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      tags,
      user,
      ...extras,
      error: error instanceof Error 
        ? { 
            name: error.name, 
            message: error.message, 
            stack: error.stack 
          } 
        : error
    };

    // Log with appropriate console method
    switch (level) {
      case 'debug':
        console.debug('[ERROR_LOGGER]', logObject);
        break;
      case 'info':
        console.info('[ERROR_LOGGER]', logObject);
        break;
      case 'warn':
        console.warn('[ERROR_LOGGER]', logObject);
        break;
      case 'error':
      default:
        console.error('[ERROR_LOGGER]', logObject);
    }
  }

  // For production - implement your preferred error monitoring service
  private logToService(error: unknown, options: LogOptions): void {
    // Implementation would depend on your monitoring service (Sentry, LogRocket, etc.)
    
    // Example for Sentry (pseudocode)
    /* 
    if (typeof window !== 'undefined' && window.Sentry) {
      const { level, tags, user, extras } = options;
      
      // Set scope info
      Sentry.configureScope(scope => {
        if (tags) scope.setTags(tags.reduce((acc, tag) => ({...acc, [tag]: true}), {}));
        if (user) scope.setUser(user);
        if (extras) Object.entries(extras).forEach(([key, value]) => scope.setExtra(key, value));
      });
      
      // Log based on type
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(String(error), level);
      }
    }
    */
    
    // For now, just log to console as a fallback
    this.logToConsole(error, options);
  }
  
  // Helper methods for different log levels
  public debug(message: string, options: Partial<LogOptions> = {}): void {
    this.log(message, { ...options, level: 'debug' });
  }
  
  public info(message: string, options: Partial<LogOptions> = {}): void {
    this.log(message, { ...options, level: 'info' });
  }
  
  public warn(error: unknown, options: Partial<LogOptions> = {}): void {
    this.log(error, { ...options, level: 'warn' });
  }
  
  public error(error: unknown, options: Partial<LogOptions> = {}): void {
    this.log(error, { ...options, level: 'error' });
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Utility function to get current user for logs
export function getCurrentUserForLogs(): LogOptions['user'] | undefined {
  // Implementation would depend on your auth system
  if (typeof window === 'undefined') return undefined;
  
  try {
    const userItem = sessionStorage.getItem('loggedInUser');
    if (userItem) {
      const user = JSON.parse(userItem);
      return {
        email: user.email,
        name: user.name
      };
    }
  } catch (e) {
    // Silently fail if we can't get the user
  }
  
  return undefined;
}