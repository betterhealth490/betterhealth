import React from 'react';
import { cn } from '~/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';