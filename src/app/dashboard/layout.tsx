'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  CreditCard,
  User,
  Scissors,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout, isAdmin, isCustomer } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/signin?redirect=${pathname}`);
        return;
      }

      // Role isolation: prevent cross-dashboard URL tampering
      if (isAdmin && pathname.startsWith('/dashboard/customer')) {
        router.push('/dashboard/admin');
      } else if (isCustomer && pathname.startsWith('/dashboard/admin')) {
        router.push('/dashboard/customer');
      }
    }
  }, [user, isLoading, pathname, isAdmin, isCustomer, router]);

  if (isLoading || !user) {
    return <LoadingSpinner message="Authenticating dashboard..." size="lg" />;
  }

  // Handle blocked user
  if (user.isBlocked) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">Account Suspended</h2>
        <p className="text-sm text-gray-600">
          Your account has been suspended by the salon administration. You cannot access dashboard features.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const customerNavItems = [
    { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { name: 'My Appointments', href: '/dashboard/customer/appointments', icon: Calendar },
    { name: 'My Profile', href: '/dashboard/customer/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Manage Services', href: '/dashboard/admin/services', icon: Scissors },
    { name: 'Manage Appointments', href: '/dashboard/admin/appointments', icon: Calendar },
    { name: 'Manage Customers', href: '/dashboard/admin/users', icon: Users },
    { name: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
    { name: 'My Profile', href: '/dashboard/admin/profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  const isActive = (path: string) => {
    if (path === '/dashboard/customer' || path === '/dashboard/admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-rose-100 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-serif font-bold text-gray-900">Dashboard</span>
          <span className="text-[10px] font-bold uppercase text-primary-700 bg-rose-50 px-2 py-0.5 rounded">
            {user.role}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-rose-50"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-rose-100 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto shrink-0 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* User Profile Mini Card */}
          <div className="flex items-center space-x-3 pb-6 border-b border-rose-100">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-600/30"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-gray-900 truncate">{user.name}</h4>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                {user.role} Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-700 text-white font-semibold shadow-md shadow-rose-900/15'
                      : 'text-gray-700 hover:bg-rose-50/80 hover:text-primary-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-rose-100 space-y-2">
          <Link
            href="/services"
            className="flex items-center space-x-2 text-xs font-semibold text-primary-700 hover:underline px-2 py-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Salon Menu</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
