'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { CheckCircle2, Calendar, CreditCard, ArrowRight, Sparkles } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [appointment, setAppointment] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiFetch(`/payments/verify-session/${sessionId}`);
        if (res.success) {
          setAppointment(res.appointment);
          setSessionData(res.session);
        }
      } catch (err) {
        // Fallback visual
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  if (isLoading) {
    return <LoadingSpinner message="Verifying Stripe payment confirmation..." size="lg" />;
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#FAF7F3] dark:bg-[#171316] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
            Payment Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            Appointment Confirmed!
          </h1>
          <p className="text-xs text-[#675961] dark:text-[#C8B8C0] mt-2">
            Your appointment has been securely paid and locked into our salon calendar.
          </p>
        </div>

        {appointment && (
          <div className="bg-[#FAF7F3] dark:bg-[#171316] p-4 rounded-2xl border border-[#EAE3DB] dark:border-[#382E36] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#675961] dark:text-[#C8B8C0]">Service:</span>
              <span className="font-bold text-[#291F26] dark:text-[#F8F1ED]">{appointment.serviceId?.serviceName || appointment.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#675961] dark:text-[#C8B8C0]">Scheduled Date:</span>
              <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{appointment.appointmentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#675961] dark:text-[#C8B8C0]">Time Slot:</span>
              <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{appointment.timeSlot}</span>
            </div>
            <div className="flex justify-between border-t border-[#EAE3DB] dark:border-[#382E36] pt-1">
              <span className="text-[#675961] dark:text-[#C8B8C0]">Amount Paid:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">${appointment.servicePrice}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard/customer/appointments"
            className="btn-emphasis-primary w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] shadow-md flex items-center justify-center space-x-2"
          >
            <span>View My Appointments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="block text-xs font-semibold text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED]"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading payment confirmation..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
