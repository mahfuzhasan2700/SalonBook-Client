'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminStats } from '../../../types';
import { apiFetch } from '../../../lib/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalCustomers: 0,
    totalActiveServices: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    successfulPayments: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/admin/stats');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (e) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Calculating salon metrics..." />;
  }

  const statCards = [
    {
      label: 'Registered Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50',
      link: '/dashboard/admin/users',
    },
    {
      label: 'Active Services',
      value: stats.totalActiveServices,
      icon: Scissors,
      color: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/50',
      link: '/dashboard/admin/services',
    },
    {
      label: 'Total Requests',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-[#80405A] dark:text-[#E2A5BA] bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 border border-[#80405A]/20 dark:border-[#E2A5BA]/30',
      link: '/dashboard/admin/appointments',
    },
    {
      label: 'Pending Approval',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50',
      link: '/dashboard/admin/appointments',
    },
    {
      label: 'Confirmed Bookings',
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50',
      link: '/dashboard/admin/appointments',
    },
    {
      label: 'Successful Payments',
      value: stats.successfulPayments,
      icon: CreditCard,
      color: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/50',
      link: '/dashboard/admin/transactions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
            Salon Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            Administrator Overview
          </h1>
          <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
            Real-time analytics across bookings, registered clientele, and Stripe transactions.
          </p>
        </div>

        {/* Total Revenue Highlight Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-5 py-3 rounded-2xl flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Total Revenue
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-900 dark:text-emerald-100">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.link}
              className="p-6 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] bg-white dark:bg-[#241E23] shadow-sm hover:shadow-md hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-2xl ${stat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">{stat.value}</p>
                <span className="text-xs text-[#80405A] dark:text-[#E2A5BA] font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link
          href="/dashboard/admin/services"
          className="p-6 rounded-3xl bg-white dark:bg-[#241E23] border border-[#EAE3DB] dark:border-[#382E36] shadow-sm hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-base">Manage Salon Services</h3>
          <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">
            Add new treatments, edit pricing, upload high-res images, and activate or deactivate offerings.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/appointments"
          className="p-6 rounded-3xl bg-white dark:bg-[#241E23] border border-[#EAE3DB] dark:border-[#382E36] shadow-sm hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-base">Review Appointment Requests</h3>
          <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">
            Confirm pending customer bookings or cancel conflicting slots to maintain smooth salon operations.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-6 rounded-3xl bg-white dark:bg-[#241E23] border border-[#EAE3DB] dark:border-[#382E36] shadow-sm hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#291F26] dark:text-[#F8F1ED] text-base">Transactions & Ledger</h3>
          <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">
            Audit Stripe checkout sessions, customer payment confirmations, and automated webhook logs.
          </p>
        </Link>
      </div>
    </div>
  );
}
