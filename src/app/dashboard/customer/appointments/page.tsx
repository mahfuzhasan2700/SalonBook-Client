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
        <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
          Booking History
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
          My Appointments
        </h1>
        <p className="text-sm text-gray-500">
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
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Appointment Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {appointments.map((app) => {
                  const isPending = app.status === 'pending';
                  const isConfirmed = app.status === 'confirmed';
                  const isUnpaid = app.paymentStatus === 'unpaid';

                  return (
                    <tr key={app._id} className="hover:bg-rose-50/30 transition-colors">
                      {/* Service column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={app.serviceId?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
                            alt={app.serviceId?.serviceName || 'Service'}
                            className="w-12 h-12 rounded-xl object-cover border border-rose-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {app.serviceId?.serviceName || 'Salon Service'}
                            </p>
                            <span className="text-xs text-primary-700 font-medium">
                              {app.serviceId?.category || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Slot */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{app.appointmentDate}</p>
                        <p className="text-xs text-gray-500">{app.timeSlot}</p>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900">${app.servicePrice}</span>
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
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
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-primary-700 border border-rose-200'
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
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary-700 hover:bg-rose-50 transition-colors"
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
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
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
          <div className="lg:hidden divide-y divide-gray-100 p-4 space-y-4">
            {appointments.map((app) => {
              const isPending = app.status === 'pending';
              const isConfirmed = app.status === 'confirmed';
              const isUnpaid = app.paymentStatus === 'unpaid';

              return (
                <div key={app._id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={app.serviceId?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
                      alt={app.serviceId?.serviceName || 'Service'}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-rose-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {app.serviceId?.serviceName || 'Salon Service'}
                      </h4>
                      <p className="text-xs text-primary-700 font-medium">
                        {app.serviceId?.category}
                      </p>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">
                        ${app.servicePrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 bg-rose-50/50 p-2.5 rounded-xl">
                    <span>📅 {app.appointmentDate}</span>
                    <span>⏰ {app.timeSlot}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-gray-100 text-gray-700">
                        {app.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-rose-50 text-primary-700">
                        {app.paymentStatus}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {isConfirmed && isUnpaid && (
                        <button
                          onClick={() => handlePayNow(app._id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600"
                        >
                          Pay Now
                        </button>
                      )}
                      {isPending && (
                        <button
                          onClick={() => handleCancel(app._id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 border border-red-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  Appointment Details
                </span>
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  {selectedAppointment.serviceId?.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Category:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.serviceId?.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Scheduled Date:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.appointmentDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Time Window:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Service Fee:</span>
                <span className="font-semibold text-gray-900">${selectedAppointment.servicePrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Booking Status:</span>
                <span className="font-bold uppercase text-primary-700">{selectedAppointment.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Payment Status:</span>
                <span className="font-bold uppercase text-emerald-600">{selectedAppointment.paymentStatus}</span>
              </div>
              {selectedAppointment.message && (
                <div className="pt-2">
                  <span className="text-gray-400 block mb-1">Your Special Note:</span>
                  <p className="bg-rose-50/60 p-2.5 rounded-xl text-gray-700 italic">
                    "{selectedAppointment.message}"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
