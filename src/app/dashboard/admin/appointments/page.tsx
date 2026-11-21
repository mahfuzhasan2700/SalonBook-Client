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
          <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
            Booking Requests
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Manage Appointments
          </h1>
          <p className="text-sm text-gray-500">
            Review customer scheduling requests, approve time slots, and manage cancellations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-rose-100 shadow-sm text-xs self-start sm:self-auto">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-rose-50'
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
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-xs font-bold uppercase tracking-wider text-gray-600">
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
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {appointments.map((app) => {
                  const isPending = app.status === 'pending';
                  const isConfirmed = app.status === 'confirmed';

                  return (
                    <tr key={app._id} className="hover:bg-rose-50/30 transition-colors">
                      {/* Customer */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={app.customerId?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt="Customer"
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-rose-100"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {app.customerId?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-gray-500">{app.customerId?.email}</p>
                            {app.customerId?.phone && (
                              <p className="text-[11px] text-gray-400">{app.customerId?.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 text-sm">
                          {app.serviceId?.serviceName || 'Service'}
                        </p>
                        <span className="text-xs text-primary-700 font-medium">
                          {app.serviceId?.category}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{app.appointmentDate}</p>
                        <p className="text-xs text-gray-500">{app.timeSlot}</p>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-gray-900">${app.servicePrice}</td>

                      {/* Status Badge */}
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

                      {/* Payment Badge */}
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

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedAppointment(app)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary-700 hover:bg-rose-50"
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
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  Request Information
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
                <span className="text-gray-400">Customer Name:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.customerId?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Customer Email:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.customerId?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Customer Phone:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.customerId?.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Scheduled Date:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.appointmentDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Time Slot:</span>
                <span className="font-semibold text-gray-900">{selectedAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Price:</span>
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
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Requested On:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {selectedAppointment.message && (
                <div className="pt-2">
                  <span className="text-gray-400 block mb-1">Customer Note:</span>
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
