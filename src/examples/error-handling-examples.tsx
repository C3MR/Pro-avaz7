import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ErrorBoundary, ErrorFallback, FormErrorMessage, OfflineWrapper } from '@/components/error-handling';
import { useApi } from '@/hooks/use-api';
import { useOfflineDetector } from '@/hooks/use-offline-detector';
import { AppError, ApiError, ValidationError, NetworkError } from '@/lib/error-handling/errors';
import { errorLogger } from '@/lib/error-handling/error-logger';
import { offlineStorage } from '@/lib/offline-storage';

/**
 * Example of a component that demonstrates different error handling techniques
 */
export const ErrorHandlingExamples = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">أمثلة على التعامل مع الأخطاء</h1>
      
      {/* Error Boundary Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Error Boundary Example</h2>
        <ErrorBoundary>
          <ComponentThatMightError />
        </ErrorBoundary>
      </section>
      
      {/* API Error Handling Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">API Error Handling Example</h2>
        <ApiErrorExample />
      </section>
      
      {/* Form Validation Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Form Validation Example</h2>
        <FormValidationExample />
      </section>
      
      {/* Offline Support Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Offline Support Example</h2>
        <OfflineSupportExample />
      </section>
    </div>
  );
};

/**
 * Example component that might throw an error
 */
const ComponentThatMightError = () => {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error("This is a simulated error!");
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Boundary Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">اضغط على الزر لمحاكاة حدوث خطأ سيتم التقاطه بواسطة Error Boundary</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setShouldError(true)}>Trigger Error</Button>
      </CardFooter>
    </Card>
  );
};

/**
 * Example of handling API errors
 */
const ApiErrorExample = () => {
  // Define different types of errors to simulate
  const errors = {
    network: new NetworkError("خطأ في الاتصال بالشبكة"),
    unauthorized: ApiError.unauthorized("غير مصرح لك بالوصول إلى هذا المورد"),
    notFound: ApiError.notFound("لم يتم العثور على المورد المطلوب"),
    server: ApiError.serverError("خطأ في الخادم"),
    validation: new ValidationError("بيانات غير صالحة", { 
      name: ["الاسم مطلوب"], 
      email: ["البريد الإلكتروني غير صالح"] 
    })
  };
  
  const [currentError, setCurrentError] = useState<AppError | null>(null);
  
  // Simulate API call
  const simulateApiCall = (errorType: keyof typeof errors | null) => {
    setCurrentError(null);
    
    // Simulate loading
    setTimeout(() => {
      if (errorType) {
        // Log the error
        errorLogger.error(errors[errorType]);
        
        // Set the error
        setCurrentError(errors[errorType]);
      } else {
        // Success - no error
        setCurrentError(null);
      }
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Error Handling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => simulateApiCall(null)} variant="outline">Success</Button>
            <Button onClick={() => simulateApiCall('network')} variant="outline">Network Error</Button>
            <Button onClick={() => simulateApiCall('unauthorized')} variant="outline">Unauthorized</Button>
            <Button onClick={() => simulateApiCall('notFound')} variant="outline">Not Found</Button>
            <Button onClick={() => simulateApiCall('server')} variant="outline">Server Error</Button>
            <Button onClick={() => simulateApiCall('validation')} variant="outline">Validation Error</Button>
          </div>
          
          {currentError && (
            <ErrorFallback 
              error={currentError} 
              resetErrorBoundary={() => setCurrentError(null)} 
              showHomeButton={false}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Example of form validation error handling
 */
const FormValidationExample = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};
    
    // Validate name
    if (!formData.name) {
      newErrors.name = ['الاسم مطلوب'];
    } else if (formData.name.length < 2) {
      newErrors.name = ['الاسم يجب أن يكون على الأقل حرفين'];
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = ['البريد الإلكتروني مطلوب'];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ['البريد الإلكتروني غير صالح'];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, submit
      alert('Form is valid! Submitting...');
    } else {
      // Form has errors
      const error = new ValidationError(
        'يوجد أخطاء في النموذج، يرجى تصحيحها',
        errors
      );
      errorLogger.error(error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Validation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">الاسم</label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <FormErrorMessage message={errors.name} />}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <FormErrorMessage message={errors.email} />}
          </div>
          
          <div className="pt-2">
            <Button type="submit">تقديم النموذج</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * Example of handling offline state
 */
const OfflineSupportExample = () => {
  const { isOffline } = useOfflineDetector();
  const [localData, setLocalData] = useState<string>('');
  
  // Load data from localStorage when component mounts
  React.useEffect(() => {
    const saved = offlineStorage.get<string>('offline-example-data');
    if (saved) {
      setLocalData(saved);
    }
  }, []);
  
  // Save data to localStorage
  const saveLocally = () => {
    if (localData) {
      offlineStorage.save('offline-example-data', localData, 60); // TTL: 60 minutes
      alert('تم حفظ البيانات محليًا!');
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>حالة الاتصال</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">الحالة الحالية: <span className={isOffline ? "text-destructive font-bold" : "text-green-600 font-bold"}>{isOffline ? 'غير متصل' : 'متصل'}</span></p>
          <p className="text-sm text-muted-foreground">يمكنك تجربة ذلك بتعطيل الاتصال بالإنترنت من خلال أدوات المطور (DevTools) أو من إعدادات الشبكة.</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>عنصر يعمل بدون اتصال</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">هذا المحتوى متاح دائمًا حتى في حالة عدم وجود اتصال بالإنترنت.</p>
            <div className="space-y-2">
              <Input
                placeholder="أدخل بيانات للتخزين المحلي"
                value={localData}
                onChange={e => setLocalData(e.target.value)}
              />
              <Button onClick={saveLocally}>حفظ محليًا</Button>
            </div>
          </CardContent>
        </Card>
        
        <OfflineWrapper>
          <Card>
            <CardHeader>
              <CardTitle>عنصر يتطلب اتصال إنترنت</CardTitle>
            </CardHeader>
            <CardContent>
              <p>هذا المحتوى يتطلب اتصالًا بالإنترنت للعمل بشكل صحيح.</p>
              <p className="text-sm text-muted-foreground mt-2">إذا كنت ترى هذا، فأنت متصل بالإنترنت!</p>
            </CardContent>
          </Card>
        </OfflineWrapper>
      </div>
    </div>
  );
};