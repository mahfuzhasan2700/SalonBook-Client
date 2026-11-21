'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#FAF7F3] dark:bg-[#171316] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto ring-8 ring-amber-50 dark:ring-amber-950/30">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
            Payment Not Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            Checkout Cancelled
          </h1>
          <p className="text-xs text-[#675961] dark:text-[#C8B8C0] mt-2">
            No charges were made to your payment method. Your appointment remains reserved as confirmed, and you can pay whenever you are ready.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard/customer/appointments"
            className="btn-emphasis-primary w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] shadow-md flex items-center justify-center space-x-2"
          >
            <span>Back to My Appointments</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore Other Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
