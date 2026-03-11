'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

// ============================================================================
// Input — Shared form input with label and error display
// ============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            block w-full rounded-lg border px-3 py-2 text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:cursor-not-allowed disabled:bg-gray-100
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-600">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
