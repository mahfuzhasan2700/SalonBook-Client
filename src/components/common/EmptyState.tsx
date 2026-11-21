import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-rose-100 shadow-sm my-6">
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-primary-600 mb-4 ring-8 ring-rose-50/50">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-full salon-gradient hover:opacity-95 shadow-md shadow-rose-900/10 transition-all"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-full salon-gradient hover:opacity-95 shadow-md shadow-rose-900/10 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
