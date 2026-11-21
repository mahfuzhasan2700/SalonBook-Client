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
      color: 'text-[#80405A] dark:text-[#E2A5BA] bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 border border-[#80405A]/20 dark:border-[#E2A5BA]/30',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50',
    },
    {
      label: 'Confirmed Bookings',
      value: stats.confirmed,
      icon: CheckCircle2,
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            Hello, {user?.name} ✨
          </h1>
          <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
            Track your appointment statuses, confirm bookings, and manage payments.
          </p>
        </div>

        <Link
          href="/services"
          className="btn-emphasis-primary inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] shadow-md transition-all"
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
              className="p-6 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] bg-white dark:bg-[#241E23] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments Preview */}
      <div className="bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">Recent Appointments</h3>
            <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">Your latest booking requests and schedules</p>
          </div>
          <Link
            href="/dashboard/customer/appointments"
            className="text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-10 text-[#675961] dark:text-[#C8B8C0] text-sm">
            <p>You haven't requested any salon appointments yet.</p>
            <Link
              href="/services"
              className="inline-block mt-3 text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] underline"
            >
              Browse our service menu to schedule your first session
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE3DB] dark:divide-[#382E36]">
            {recentAppointments.map((app) => (
              <div key={app._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={app.serviceId?.image || app.serviceImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80'}
                    alt={app.serviceId?.serviceName || app.serviceName || 'Service'}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#EAE3DB] dark:border-[#382E36]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#291F26] dark:text-[#F8F1ED]">
                      {app.serviceId?.serviceName || app.serviceName || 'Salon Service'}
                    </h4>
                    <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">
                      📅 {app.appointmentDate} • ⏰ {app.timeSlot}
                    </p>
                    <p className="text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] mt-0.5">
                      ${app.servicePrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : app.status === 'pending'
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {app.status}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.paymentStatus === 'paid'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] border border-[#80405A]/20 dark:border-[#E2A5BA]/30'
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
