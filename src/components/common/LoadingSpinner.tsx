import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  message = 'Loading salon data...',
  size = 'md',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[220px]">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-[#EAE3DB] dark:border-[#382E36] border-t-[#80405A] dark:border-t-[#E2A5BA] animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300 animate-pulse" />
        </div>
      </div>
      {message && (
        <p className="text-sm font-medium text-[#675961] dark:text-[#C8B8C0] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
