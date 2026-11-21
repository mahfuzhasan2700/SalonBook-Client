'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, uploadImageToImgBB } from '../../lib/api';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, User as UserIcon, Phone, Upload, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Password validation rules
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setUploadingImage(true);
      try {
        const uploadedUrl = await uploadImageToImgBB(file);
        setImageUrl(uploadedUrl);
        toast.success('Profile photo uploaded successfully!');
      } catch (err: any) {
        toast.error('Could not upload photo. Using default avatar.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all requirements.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          image: imageUrl || undefined,
        }),
      });

      if (res.success && res.token && res.user) {
        toast.success('Registration successful! Welcome to SalonBook.');
        login(res.token, res.user);
        router.push('/dashboard/customer');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email: 'google.client@example.com',
          name: 'Jessica Taylor',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          googleId: 'google_reg_987654321',
        }),
      });

      if (res.success && res.token && res.user) {
        toast.success('Google registration successful!');
        login(res.token, res.user);
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Google registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full salon-gradient flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500">
            Join SalonBook to schedule luxury treatments with top stylists
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Charlotte Hayes"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-sm text-gray-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="charlotte@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-sm text-gray-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-sm text-gray-800 outline-none transition-all"
              />
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Profile Photo (Upload File / Image URL)
            </label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer py-2 px-3 border border-dashed border-rose-300 rounded-xl hover:bg-rose-50 text-xs font-semibold text-primary-700 flex items-center space-x-1.5 transition-colors">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-400">or URL:</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-600 text-xs text-gray-800 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-sm text-gray-800 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Validation Checklist */}
            <div className="mt-2 grid grid-cols-3 gap-1 text-[11px]">
              <span className={hasMinLength ? 'text-emerald-600 font-semibold' : 'text-gray-400'}>
                ✓ 6+ Characters
              </span>
              <span className={hasUppercase ? 'text-emerald-600 font-semibold' : 'text-gray-400'}>
                ✓ 1 Uppercase
              </span>
              <span className={hasLowercase ? 'text-emerald-600 font-semibold' : 'text-gray-400'}>
                ✓ 1 Lowercase
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isPasswordValid}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Register as Customer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-medium">Or</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center space-x-2 transition-colors"
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
          <span>Sign up with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-primary-700 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
