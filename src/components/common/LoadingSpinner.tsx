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
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[220px]">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-rose-200 border-t-primary-700 animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </div>
      </div>
      {message && <p className="text-sm font-medium text-gray-500 animate-pulse">{message}</p>}
    </div>
  );
}
