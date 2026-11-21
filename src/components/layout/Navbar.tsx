'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import ThemeToggle from '../common/ThemeToggle';
import { Sparkles, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Calendar, Scissors } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resolvedServiceId, setResolvedServiceId] = useState<string | null>(null);

  // Resolve Salon Details link dynamically to last-viewed or first active service
  useEffect(() => {
    const resolveService = async () => {
      // Check last viewed service in localStorage
      if (typeof window !== 'undefined') {
        const lastViewed = localStorage.getItem('salonbook_last_viewed_service');
        if (lastViewed) {
          setResolvedServiceId(lastViewed);
          return;
        }
      }

      // Fallback: fetch first active service
      try {
        const res = await apiFetch('/services?limit=1');
        if (res.success && res.services && res.services.length > 0) {
          setResolvedServiceId(res.services[0]._id);
        }
      } catch (e) {
        // Fallback
      }
    };

    resolveService();
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const dashboardUrl = isAdmin ? '/dashboard/admin' : '/dashboard/customer';
  const salonDetailsUrl = resolvedServiceId ? `/services/${resolvedServiceId}` : '/services';

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF7F3]/95 dark:bg-[#171316]/95 backdrop-blur-md border-b border-[#EAE3DB] dark:border-[#382E36] transition-colors duration-180">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-full bg-[#80405A] dark:bg-[#E2A5BA] flex items-center justify-center text-white dark:text-[#24171D] shadow-sm group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-tight text-[#291F26] dark:text-[#F8F1ED]">
                Salon<span className="text-[#80405A] dark:text-[#E2A5BA]">Book</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#675961] dark:text-[#C8B8C0] font-medium -mt-1 font-sans">
                Editorial Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-[#80405A] dark:hover:text-[#E2A5BA] ${
                isActive('/') ? 'text-[#80405A] dark:text-[#E2A5BA] font-semibold' : 'text-[#675961] dark:text-[#C8B8C0]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-[#80405A] dark:hover:text-[#E2A5BA] ${
                isActive('/services') ? 'text-[#80405A] dark:text-[#E2A5BA] font-semibold' : 'text-[#675961] dark:text-[#C8B8C0]'
              }`}
            >
              Browse Services
            </Link>

            {/* Authenticated Links */}
            {user && (
              <>
                <Link
                  href={salonDetailsUrl}
                  className={`text-sm font-medium transition-colors hover:text-[#80405A] dark:hover:text-[#E2A5BA] ${
                    pathname.startsWith('/services/') ? 'text-[#80405A] dark:text-[#E2A5BA] font-semibold' : 'text-[#675961] dark:text-[#C8B8C0]'
                  }`}
                  title="View Salon Details"
                >
                  Salon Details
                </Link>
                <Link
                  href={dashboardUrl}
                  className={`text-sm font-medium transition-colors hover:text-[#80405A] dark:hover:text-[#E2A5BA] ${
                    pathname.startsWith('/dashboard') ? 'text-[#80405A] dark:text-[#E2A5BA] font-semibold' : 'text-[#675961] dark:text-[#C8B8C0]'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Auth Actions & Theme Switch */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Labeled Theme Toggle */}
            <ThemeToggle showLabel={true} />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#241E23] transition-colors border border-[#EAE3DB] dark:border-[#382E36]"
                >
                  <img
                    src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#80405A]/30 dark:ring-[#E2A5BA]/40"
                  />
                  <div className="text-left pr-2">
                    <p className="text-xs font-semibold text-[#291F26] dark:text-[#F8F1ED] truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#80405A] dark:text-[#E2A5BA] bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#241E23] rounded-2xl shadow-xl border border-[#EAE3DB] dark:border-[#382E36] py-2 z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#291F26] dark:text-[#F8F1ED] truncate">{user.name}</p>
                    </div>

                    <Link
                      href={dashboardUrl}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#291F26] dark:text-[#F8F1ED] hover:bg-[#FAF7F3] dark:hover:bg-[#171316] hover:text-[#80405A] dark:hover:text-[#E2A5BA] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    {isCustomer && (
                      <Link
                        href="/dashboard/customer/appointments"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-[#291F26] dark:text-[#F8F1ED] hover:bg-[#FAF7F3] dark:hover:bg-[#171316] hover:text-[#80405A] dark:hover:text-[#E2A5BA] transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>My Appointments</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-[#291F26] dark:text-[#F8F1ED] hover:text-[#80405A] dark:hover:text-[#E2A5BA] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#80405A] dark:bg-[#E2A5BA] dark:text-[#24171D] rounded-full hover:opacity-95 shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle showLabel={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#291F26] dark:text-[#F8F1ED] hover:bg-stone-100 dark:hover:bg-[#241E23] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#291F26] dark:text-[#F8F1ED] hover:bg-stone-100 dark:hover:bg-[#241E23]"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#291F26] dark:text-[#F8F1ED] hover:bg-stone-100 dark:hover:bg-[#241E23]"
          >
            Browse Services
          </Link>

          {user ? (
            <>
              <Link
                href={salonDetailsUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#291F26] dark:text-[#F8F1ED] hover:bg-stone-100 dark:hover:bg-[#241E23]"
              >
                Salon Details
              </Link>
              <Link
                href={dashboardUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#291F26] dark:text-[#F8F1ED] hover:bg-stone-100 dark:hover:bg-[#241E23]"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#291F26] dark:text-[#F8F1ED] border border-[#EAE3DB] dark:border-[#382E36] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#80405A] dark:bg-[#E2A5BA] dark:text-[#24171D] rounded-xl shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
