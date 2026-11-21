'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerStats, Appointment } from '../../../types';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerStats>({
    totalAppointments: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          apiFetch('/admin/customer-stats').catch(() => ({ stats: null })),
          apiFetch('/appointments/my').catch(() => ({ appointments: [] })),
        ]);

        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        } else if (appointmentsRes.appointments) {
          // Compute directly if endpoint is in fallback mode
          const apps: Appointment[] = appointmentsRes.appointments;
          setStats({
            totalAppointments: apps.length,
            pending: apps.filter((a) => a.status === 'pending').length,
            confirmed: apps.filter((a) => a.status === 'confirmed').length,
            cancelled: apps.filter((a) => a.status === 'cancelled').length,
          });
        }

        if (appointmentsRes.appointments) {
          setRecentAppointments(appointmentsRes.appointments.slice(0, 3));
        }
      } catch (e) {
        // Handle gracefully
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading your salon dashboard..." />;
  }

  const statCards = [
    {
      label: 'Total Requests',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-primary-700 bg-rose-50 border-rose-100',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-100',
    },
    {
      label: 'Confirmed Bookings',
      value: stats.confirmed,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-gray-700 bg-gray-50 border-gray-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Hello, {user?.name} ✨
          </h1>
          <p className="text-sm text-gray-500">
            Track your appointment statuses, confirm bookings, and manage payments.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Book New Service</span>
        </Link>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl border bg-white shadow-sm flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-serif font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments Preview */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-900">Recent Appointments</h3>
            <p className="text-xs text-gray-500">Your latest booking requests and schedules</p>
          </div>
          <Link
            href="/dashboard/customer/appointments"
            className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            <p>You haven't requested any salon appointments yet.</p>
            <Link
              href="/services"
              className="inline-block mt-3 text-xs font-semibold text-primary-700 underline"
            >
              Browse our service menu to schedule your first session
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentAppointments.map((app) => (
              <div key={app._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={app.serviceId?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80'}
                    alt={app.serviceId?.serviceName || 'Service'}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-rose-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {app.serviceId?.serviceName || 'Salon Service'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      📅 {app.appointmentDate} • ⏰ {app.timeSlot}
                    </p>
                    <p className="text-xs font-semibold text-primary-700 mt-0.5">
                      ${app.servicePrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : app.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {app.status}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-primary-700'
                    }`}
                  >
                    {app.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
