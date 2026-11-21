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
  CheckCircle,
  XCircle,
  Filter,
  Info,
  User,
  MessageSquare,
  X,
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const url = statusFilter === 'all' ? '/appointments/admin/all' : `/appointments/admin/all?status=${statusFilter}`;
      const res = await apiFetch(url);
      if (res.success && res.appointments) {
        setAppointments(res.appointments);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  // Update status (Confirm or Cancel)
  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    const actionText = newStatus === 'confirmed' ? 'confirm' : 'cancel';
    const confirmAction = window.confirm(`Are you sure you want to ${actionText} this appointment request?`);
    if (!confirmAction) return;

    try {
      const res = await apiFetch(`/appointments/admin/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        toast.success(`Appointment successfully marked as ${newStatus}.`);
        fetchAppointments();
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${actionText} appointment.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
            Booking Requests
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            Manage Appointments
          </h1>
          <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
            Review customer scheduling requests, approve time slots, and manage cancellations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-[#241E23] p-1.5 rounded-2xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm text-xs self-start sm:self-auto">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`filter-pill px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-[#80405A] text-white dark:bg-[#E2A5BA] dark:text-[#24171D] shadow-sm'
                  : 'text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED] hover:bg-[#FAF7F3] dark:hover:bg-[#171316]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Retrieving appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description={`There are currently no ${statusFilter === 'all' ? '' : statusFilter} appointments in the system.`}
        />
      ) : (
        <div className="bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F3] dark:bg-[#1d171b] border-b border-[#EAE3DB] dark:border-[#382E36] text-xs font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DB] dark:divide-[#382E36] text-[#291F26] dark:text-[#F8F1ED]">
                {appointments.map((app) => {
                  const isPending = app.status === 'pending';
                  const isConfirmed = app.status === 'confirmed';

                  return (
                    <tr key={app._id} className="hover:bg-[#FAF7F3]/60 dark:hover:bg-[#1d171b]/60 transition-colors">
                      {/* Customer */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={app.customerId?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt="Customer"
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[#80405A]/20 dark:ring-[#E2A5BA]/30"
                          />
                          <div>
                            <p className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-sm">
                              {app.customerId?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">{app.customerId?.email}</p>
                            {app.customerId?.phone && (
                              <p className="text-[11px] text-[#675961]/80 dark:text-[#C8B8C0]/80">{app.customerId?.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-sm">
                          {app.serviceId?.serviceName || app.serviceName || 'Service'}
                        </p>
                        <span className="text-xs text-[#80405A] dark:text-[#E2A5BA] font-semibold">
                          {app.serviceId?.category || app.serviceCategory || 'Salon Ritual'}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{app.appointmentDate}</p>
                        <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">{app.timeSlot}</p>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-[#291F26] dark:text-[#F8F1ED]">${app.servicePrice}</td>

                      {/* Status Badge */}
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

                      {/* Payment Badge */}
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

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedAppointment(app)}
                          className="p-1.5 rounded-lg text-[#675961] dark:text-[#C8B8C0] hover:text-[#80405A] dark:hover:text-[#E2A5BA] hover:bg-stone-100 dark:hover:bg-[#171316] transition-colors"
                          title="View Details"
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        {/* Rule: Only pending appointments can be confirmed */}
                        {isPending && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'confirmed')}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {/* Admin can cancel pending or confirmed */}
                        {(isPending || isConfirmed) && (
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'cancelled')}
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
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#241E23] rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#EAE3DB] dark:border-[#382E36] shadow-2xl text-[#291F26] dark:text-[#F8F1ED]">
            <div className="flex justify-between items-start border-b border-[#EAE3DB] dark:border-[#382E36] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
                  Request Information
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
                <span className="text-[#675961] dark:text-[#C8B8C0]">Customer Name:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.customerId?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Customer Email:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.customerId?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Customer Phone:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.customerId?.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Scheduled Date:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.appointmentDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Time Slot:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">{selectedAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Price:</span>
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
              <div className="flex justify-between py-1 border-b border-[#EAE3DB]/40 dark:border-[#382E36]/40">
                <span className="text-[#675961] dark:text-[#C8B8C0]">Requested On:</span>
                <span className="font-semibold text-[#291F26] dark:text-[#F8F1ED]">
                  {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {selectedAppointment.message && (
                <div className="pt-2">
                  <span className="text-[#675961] dark:text-[#C8B8C0] block mb-1">Customer Note:</span>
                  <p className="bg-[#FAF7F3] dark:bg-[#171316] p-2.5 rounded-xl text-[#291F26] dark:text-[#F8F1ED] italic border border-[#EAE3DB] dark:border-[#382E36]">
                    "{selectedAppointment.message}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
