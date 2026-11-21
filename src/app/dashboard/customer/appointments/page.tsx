'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '../../../../types';
import { apiFetch } from '../../../../lib/api';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import EmptyState from '../../../../components/common/EmptyState';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  CreditCard,
  XCircle,
  Tag,
  CheckCircle,
  Info,
  ExternalLink,
  X,
} from 'lucide-react';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isProcessingPaymentId, setIsProcessingPaymentId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch('/appointments/my');
      if (res.success && res.appointments) {
        setAppointments(res.appointments);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cancel Pending Appointment
  const handleCancel = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to cancel this pending appointment request?');
    if (!confirmed) return;

    try {
      const res = await apiFetch(`/appointments/${id}/cancel`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast.success('Appointment request cancelled.');
        fetchAppointments();
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not cancel appointment.');
    }
  };

  // Stripe Checkout Flow
  const handlePayNow = async (appointmentId: string) => {
    setIsProcessingPaymentId(appointmentId);
    try {
      const res = await apiFetch('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ appointmentId }),
      });

      if (res.success && res.url) {
        toast.info('Redirecting to Stripe secure checkout...');
        window.location.href = res.url;
      } else {
        toast.error('Could not initiate payment session.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Stripe payment initialization failed.');
    } finally {
      setIsProcessingPaymentId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Retrieving your appointments..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
          Booking History
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
          My Appointments
        </h1>
        <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
          Manage your salon schedules, cancel pending requests, and complete Stripe payments for confirmed bookings.
        </p>
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description="You haven't booked any salon appointments yet. Browse our signature services and schedule your first visit."
          actionText="Browse Salon Menu"
          actionHref="/services"
        />
      ) : (
        <div className="bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F3] dark:bg-[#1d171b] border-b border-[#EAE3DB] dark:border-[#382E36] text-xs font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Appointment Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DB] dark:divide-[#382E36] text-[#291F26] dark:text-[#F8F1ED]">
                {appointments.map((app) => {
                  const isPending = app.status === 'pending';
                  const isConfirmed = app.status === 'confirmed';
                  const isUnpaid = app.paymentStatus === 'unpaid';

                  return (
                    <tr key={app._id} className="hover:bg-[#FAF7F3]/60 dark:hover:bg-[#1d171b]/60 transition-colors">
                      {/* Service column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={app.serviceId?.image || app.serviceImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
                            alt={app.serviceId?.serviceName || app.serviceName || 'Service'}
                            className="w-12 h-12 rounded-xl object-cover border border-[#EAE3DB] dark:border-[#382E36] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-sm">
                              {app.serviceId?.serviceName || app.serviceName || 'Salon Service'}
                            </p>
                            <span className="text-xs text-[#80405A] dark:text-[#E2A5BA] font-semibold">
                              {app.serviceId?.category || app.serviceCategory || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Slot */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{app.appointmentDate}</p>
                        <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">{app.timeSlot}</p>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#291F26] dark:text-[#F8F1ED]">${app.servicePrice}</span>
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : app.status === 'pending'
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            app.paymentStatus === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] border border-[#80405A]/20 dark:border-[#E2A5BA]/30'
                          }`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right space-x-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedAppointment(app)}
                          className="p-1.5 rounded-lg text-[#675961] dark:text-[#C8B8C0] hover:text-[#80405A] dark:hover:text-[#E2A5BA] hover:bg-stone-100 dark:hover:bg-[#171316] transition-colors"
                          title="View Details"
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        {/* Pay Now Button (Only for Confirmed + Unpaid) */}
                        {isConfirmed && isUnpaid && (
                          <button
                            onClick={() => handlePayNow(app._id)}
                            disabled={isProcessingPaymentId === app._id}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isProcessingPaymentId === app._id ? 'Loading...' : 'Pay Now'}</span>
                          </button>
                        )}

                        {/* Cancel Button (Only for Pending) */}
                        {isPending && (
                          <button
                            onClick={() => handleCancel(app._id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="lg:hidden divide-y divide-[#EAE3DB] dark:divide-[#382E36] p-4 space-y-4">
            {appointments.map((app) => {
              const isPending = app.status === 'pending';
              const isConfirmed = app.status === 'confirmed';
              const isUnpaid = app.paymentStatus === 'unpaid';

              return (
                <div key={app._id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={app.serviceId?.image || app.serviceImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
                      alt={app.serviceId?.serviceName || app.serviceName || 'Service'}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#EAE3DB] dark:border-[#382E36]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#291F26] dark:text-[#F8F1ED]">
                        {app.serviceId?.serviceName || app.serviceName || 'Salon Service'}
                      </h4>
                      <p className="text-xs text-[#80405A] dark:text-[#E2A5BA] font-semibold">
                        {app.serviceId?.category || app.serviceCategory || 'Salon Ritual'}
                      </p>
                      <p className="text-xs font-bold text-[#291F26] dark:text-[#F8F1ED] mt-0.5">
                        ${app.servicePrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-[#675961] dark:text-[#C8B8C0] bg-[#FAF7F3] dark:bg-[#171316] p-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36]">
                    <span>📅 {app.appointmentDate}</span>
                    <span>⏰ {app.timeSlot}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {app.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA]">
                        {app.paymentStatus}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {isConfirmed && isUnpaid && (
                        <button
                          onClick={() => handlePayNow(app._id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        >
                          Pay Now
                        </button>
                      )}
                      {isPending && (
                        <button
                          onClick={() => handleCancel(app._id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#241E23] rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#EAE3DB] dark:border-[#382E36] shadow-2xl text-[#291F26] dark:text-[#F8F1ED]">
            <div className="flex justify-between items-start border-b border-[#EAE3DB] dark:border-[#382E36] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
                  Appointment Details
                </span>
                <h3 className="text-lg font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">
                  {selectedAppointment.serviceId?.serviceName || selectedAppointment.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#675961] dark:text-[#C8B8C0]">
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Category:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.serviceId?.category || selectedAppointment.serviceCategory}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Scheduled Date:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.appointmentDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Time Window:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Service Fee:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">${selectedAppointment.servicePrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Booking Status:</span>
                <span className="font-bold uppercase text-[#80405A] dark:text-[#E2A5BA]">{selectedAppointment.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Payment Status:</span>
                <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{selectedAppointment.paymentStatus}</span>
              </div>
              {selectedAppointment.message && (
                <div className="pt-2">
                  <span className="text-[#675961] dark:text-[#C8B8C0] block mb-1">Your Special Note:</span>
                  <p className="bg-[#FAF7F3] dark:bg-[#171316] p-2.5 rounded-xl text-[#291F26] dark:text-[#F8F1ED] italic border border-[#EAE3DB] dark:border-[#382E36]">
                    "{selectedAppointment.message}"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-[#291F26] dark:text-[#F8F1ED] font-semibold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
