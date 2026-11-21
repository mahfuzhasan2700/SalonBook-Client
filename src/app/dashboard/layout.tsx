'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ThemeToggle from '../../components/common/ThemeToggle';
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
        // Verify localStorage token before redirecting to prevent race conditions on login
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('salonbook_token') : null;
        if (!storedToken) {
          router.push(`/sign-in?redirect=${pathname}`);
          return;
        }
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
      <div className="min-h-screen bg-[#FAF7F3] dark:bg-[#171316] flex items-center justify-center p-4">
        <div className="max-w-xl mx-auto p-8 bg-white dark:bg-[#241E23] rounded-3xl border border-red-200 dark:border-red-900/50 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">Account Suspended</h2>
          <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
            Your account has been suspended by the salon administration. You cannot access dashboard features.
          </p>
          <button
            onClick={logout}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
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
    <div className="min-h-screen bg-[#FAF7F3] dark:bg-[#171316] text-[#291F26] dark:text-[#F8F1ED] flex flex-col md:flex-row transition-colors duration-180">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-[#241E23] border-b border-[#EAE3DB] dark:border-[#382E36] p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-serif font-bold text-[#291F26] dark:text-[#F8F1ED]">Dashboard</span>
          <span className="text-[10px] font-bold uppercase text-[#80405A] dark:text-[#E2A5BA] bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 px-2 py-0.5 rounded">
            {user.role}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle showLabel={false} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-[#675961] dark:text-[#C8B8C0] hover:bg-stone-100 dark:hover:bg-[#171316]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#241E23] border-r border-[#EAE3DB] dark:border-[#382E36] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto shrink-0 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* User Profile Mini Card */}
          <div className="flex items-center space-x-3 pb-6 border-b border-[#EAE3DB] dark:border-[#382E36]">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#80405A]/30 dark:ring-[#E2A5BA]/40"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-[#291F26] dark:text-[#F8F1ED] truncate">{user.name}</h4>
              <p className="text-xs text-[#675961] dark:text-[#C8B8C0] truncate">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#80405A] dark:text-[#E2A5BA] bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 px-2 py-0.5 rounded-full">
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
                      ? 'bg-[#80405A] text-white dark:bg-[#E2A5BA] dark:text-[#24171D] font-semibold shadow-md shadow-rose-900/15'
                      : 'text-[#675961] dark:text-[#C8B8C0] hover:bg-[#FAF7F3] dark:hover:bg-[#171316] hover:text-[#291F26] dark:hover:text-[#F8F1ED]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white dark:text-[#24171D]' : 'text-[#80405A] dark:text-[#E2A5BA]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-[#EAE3DB] dark:border-[#382E36] space-y-3">
          {/* Dashboard Theme Toggle */}
          <div className="px-2">
            <ThemeToggle showLabel={true} className="w-full justify-center" />
          </div>

          <Link
            href="/services"
            className="flex items-center space-x-2 text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] hover:underline px-2 py-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Salon Menu</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
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
