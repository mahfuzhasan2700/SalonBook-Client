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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm my-6 transition-colors">
      <div className="w-16 h-16 rounded-full bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 flex items-center justify-center text-[#80405A] dark:text-[#E2A5BA] mb-4 ring-8 ring-[#80405A]/5 dark:ring-[#E2A5BA]/5">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mb-2">{title}</h3>
      <p className="text-sm text-[#675961] dark:text-[#C8B8C0] max-w-md mb-6">{description}</p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="btn-emphasis-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] rounded-full shadow-md transition-all"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="btn-emphasis-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] rounded-full shadow-md transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
