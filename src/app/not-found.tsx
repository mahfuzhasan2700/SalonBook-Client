import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-primary-700 flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-4xl font-serif font-bold text-primary-900 block">404</span>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mt-2">
            Page Not Found
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            The salon page or treatment you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Salon Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
