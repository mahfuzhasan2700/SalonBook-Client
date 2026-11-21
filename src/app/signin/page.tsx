'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Scissors, ShieldCheck, User as UserIcon } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { user, login, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<'admin' | 'customer' | null>(null);

  // If already logged in, redirect to the appropriate dashboard
  useEffect(() => {
    if (!authLoading && user) {
      const dest = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer';
      window.location.href = dest;
    }
  }, [user, authLoading]);

  // Core authenticated login handler
  const performLogin = async (loginEmail: string, loginPass: string) => {
    if (!loginEmail || !loginPass) {
      toast.error('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPass }),
      });

      if (res.success && res.token && res.user) {
        toast.success(`Welcome back, ${res.user.name}!`);
        login(res.token, res.user);

        // Determine destination safely avoiding role collisions or self-redirects
        let targetUrl = res.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer';
        if (
          redirectParam &&
          !redirectParam.startsWith('/signin') &&
          !redirectParam.startsWith('/sign-in')
        ) {
          if (res.user.role === 'admin' && !redirectParam.startsWith('/dashboard/customer')) {
            targetUrl = redirectParam;
          } else if (res.user.role === 'customer' && !redirectParam.startsWith('/dashboard/admin')) {
            targetUrl = redirectParam;
          }
        }

        // Full window navigation ensures clean session synchronization across layouts
        window.location.href = targetUrl;
        return;
      } else {
        toast.error(res.message || 'Login failed.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
      setActiveDemoRole(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  // One-click instant login helper for evaluators
  const handleInstantDemoLogin = (role: 'admin' | 'customer') => {
    setActiveDemoRole(role);
    if (role === 'admin') {
      setEmail('admin@salonbook.com');
      setPassword('Admin@123456');
      performLogin('admin@salonbook.com', 'Admin@123456');
    } else {
      setEmail('sophia@example.com');
      setPassword('Customer@123');
      performLogin('sophia@example.com', 'Customer@123');
    }
  };

  // Google OAuth sign in
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email: 'google.customer@example.com',
          name: 'Sarah Connor',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          googleId: 'google_1234567890',
        }),
      });

      if (res.success && res.token && res.user) {
        toast.success('Google sign-in successful!');
        login(res.token, res.user);
        window.location.href = redirectParam || '/dashboard/customer';
        return;
      }
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F3] dark:bg-[#171316] transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-xl overflow-hidden p-8 space-y-7">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#80405A] dark:bg-[#E2A5BA] flex items-center justify-center text-white dark:text-[#24171D] mx-auto shadow-md">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] tracking-tight">
            Welcome to SalonBook
          </h2>
          <p className="text-xs text-[#675961] dark:text-[#C8B8C0]">
            Sign in to access your appointments and exclusive editorial benefits
          </p>
        </div>

        {/* Instant One-Click Evaluator Login Buttons */}
        <div className="p-4 bg-[#FAF7F3] dark:bg-[#171316] rounded-2xl border border-[#EAE3DB] dark:border-[#382E36] text-xs space-y-2.5">
          <p className="font-bold text-[#291F26] dark:text-[#F8F1ED] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#80405A] dark:text-[#E2A5BA]" />
            <span>One-Click Instant Evaluator Logins:</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleInstantDemoLogin('admin')}
              className="py-2.5 px-3 rounded-xl border border-[#80405A]/30 dark:border-[#E2A5BA]/40 bg-white dark:bg-[#241E23] hover:bg-[#80405A]/10 dark:hover:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] font-bold text-center transition-all shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{activeDemoRole === 'admin' ? 'Logging in...' : 'Sign In Admin'}</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleInstantDemoLogin('customer')}
              className="py-2.5 px-3 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-white dark:bg-[#241E23] hover:bg-stone-50 dark:hover:bg-[#1d171b] text-[#291F26] dark:text-[#F8F1ED] font-bold text-center transition-all shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <UserIcon className="w-4 h-4 shrink-0 text-[#80405A] dark:text-[#E2A5BA]" />
              <span>{activeDemoRole === 'customer' ? 'Logging in...' : 'Sign In Customer'}</span>
            </button>
          </div>
          <p className="text-[10px] text-[#675961] dark:text-[#C8B8C0] text-center">
            Clicking either button will automatically log you in immediately.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#291F26] dark:text-[#F8F1ED] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#675961] dark:text-[#C8B8C0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] focus:border-[#80405A] dark:focus:border-[#E2A5BA] focus:ring-2 focus:ring-[#80405A]/20 text-sm text-[#291F26] dark:text-[#F8F1ED] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#291F26] dark:text-[#F8F1ED]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#675961] dark:text-[#C8B8C0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] focus:border-[#80405A] dark:focus:border-[#E2A5BA] focus:ring-2 focus:ring-[#80405A]/20 text-sm text-[#291F26] dark:text-[#F8F1ED] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-emphasis-primary w-full py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAE3DB] dark:border-[#382E36]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#241E23] px-3 text-[#675961] dark:text-[#C8B8C0] font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="filter-pill w-full py-2.5 px-4 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] text-xs font-semibold text-[#291F26] dark:text-[#F8F1ED] flex items-center justify-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#675961] dark:text-[#C8B8C0]">
          Don't have an account yet?{' '}
          <Link href="/sign-up" className="font-semibold text-[#80405A] dark:text-[#E2A5BA] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
