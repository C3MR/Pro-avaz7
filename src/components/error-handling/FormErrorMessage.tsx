import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorMessageProps {
  message?: string | string[];
  className?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message, className }) => {
  if (!message || (Array.isArray(message) && message.length === 0)) {
    return null;
  }
  
  const messages = Array.isArray(message) ? message : [message];
  
  return (
    <div className={cn(
      "flex items-center p-3 my-2 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm",
      className
    )}>
      <AlertCircle className="h-5 w-5 ml-2 shrink-0" />
      {messages.length === 1 ? (
        <p>{messages[0]}</p>
      ) : (
        <ul className="list-disc list-inside space-y-1 mr-2">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormErrorMessage;