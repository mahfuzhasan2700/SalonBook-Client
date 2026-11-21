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
      color: 'text-blue-700 bg-blue-50 border-blue-100',
      link: '/dashboard/admin/users',
    },
    {
      label: 'Active Services',
      value: stats.totalActiveServices,
      icon: Scissors,
      color: 'text-purple-700 bg-purple-50 border-purple-100',
      link: '/dashboard/admin/services',
    },
    {
      label: 'Total Requests',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-primary-700 bg-rose-50 border-rose-100',
      link: '/dashboard/admin/appointments',
    },
    {
      label: 'Pending Approval',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-100',
      link: '/dashboard/admin/appointments',
    },
    {
      label: 'Confirmed Bookings',
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      link: '/dashboard/admin/appointments',
    },
    {
      label: 'Successful Payments',
      value: stats.successfulPayments,
      icon: CreditCard,
      color: 'text-teal-700 bg-teal-50 border-teal-100',
      link: '/dashboard/admin/transactions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
            Salon Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Administrator Overview
          </h1>
          <p className="text-sm text-gray-500">
            Real-time analytics across bookings, registered clientele, and Stripe transactions.
          </p>
        </div>

        {/* Total Revenue Highlight Banner */}
        <div className="bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Total Revenue
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-900">
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
              className="p-6 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-2xl ${stat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-serif font-bold text-gray-900">{stat.value}</p>
                <span className="text-xs text-primary-700 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
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
          className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-primary-300 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-primary-700 flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Manage Salon Services</h3>
          <p className="text-xs text-gray-500">
            Add new treatments, edit pricing, upload high-res images, and activate or deactivate offerings.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/appointments"
          className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-primary-300 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Review Appointment Requests</h3>
          <p className="text-xs text-gray-500">
            Confirm pending customer bookings or cancel conflicting slots to maintain smooth salon operations.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-primary-300 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Transactions & Ledger</h3>
          <p className="text-xs text-gray-500">
            Audit Stripe checkout sessions, customer payment confirmations, and automated webhook logs.
          </p>
        </Link>
      </div>
    </div>
  );
}
