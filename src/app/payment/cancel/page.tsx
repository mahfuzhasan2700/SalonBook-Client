'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
            Payment Not Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Checkout Cancelled
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            No charges were made to your payment method. Your appointment remains reserved as confirmed, and you can pay whenever you are ready.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 flex items-center justify-center space-x-2"
          >
            <span>Back to My Appointments</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
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
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
