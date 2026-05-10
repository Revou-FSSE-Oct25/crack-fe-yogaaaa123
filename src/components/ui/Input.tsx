'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

// ---
// Input — Komponen input teks standar.
// Bisa narima label otomatis dan kalau ada error dari react-hook-form otomatis jadi merah dan nampilin pesan.
// ---

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError; // Error object bawaan react-hook-form
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

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
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`
              block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              disabled:cursor-not-allowed disabled:bg-gray-100
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              )}
            </button>
          )}
        </div>
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
