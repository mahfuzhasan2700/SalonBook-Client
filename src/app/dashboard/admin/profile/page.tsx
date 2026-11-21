'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch, uploadImageToImgBB } from '../../../../lib/api';
import { toast } from 'sonner';
import { User, Mail, Phone, Upload, Shield, Save } from 'lucide-react';

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [image, setImage] = useState(user?.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const url = await uploadImageToImgBB(e.target.files[0]);
        setImage(url);
        toast.success('Admin avatar uploaded successfully!');
      } catch (err: any) {
        toast.error('Image upload failed.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await apiFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, image }),
      }).catch(() => apiFetch('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, image }),
      }));

      if (res.success && res.user) {
        toast.success('Admin profile updated!');
        updateUser(res.user);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider text-[#80405A] dark:text-[#E2A5BA]">
          Executive Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
          Administrator Profile
        </h1>
        <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
          Manage your salon manager credentials and contact information
        </p>
      </div>

      <div className="bg-white dark:bg-[#241E23] rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] p-6 sm:p-8 shadow-sm space-y-6 text-[#291F26] dark:text-[#F8F1ED]">
        {/* Profile Avatar */}
        <div className="flex items-center space-x-6 pb-6 border-b border-[#EAE3DB] dark:border-[#382E36]">
          <div className="relative">
            <img
              src={image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
              alt="Admin"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#80405A]/20 dark:ring-[#E2A5BA]/30"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#291F26] dark:text-[#F8F1ED]">{user?.name}</h4>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-[#675961] dark:text-[#C8B8C0]">{user?.email}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#80405A] dark:bg-[#E2A5BA] dark:text-[#24171D] px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#80405A]/30 dark:border-[#E2A5BA]/30 text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] hover:bg-[#80405A]/10 dark:hover:bg-[#E2A5BA]/15 transition-colors mt-3">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#291F26] dark:text-[#F8F1ED] mb-1.5">
              Admin Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#80405A] dark:text-[#E2A5BA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] text-sm text-[#291F26] dark:text-[#F8F1ED] focus:border-[#80405A] dark:focus:border-[#E2A5BA] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#291F26] dark:text-[#F8F1ED] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#675961] dark:text-[#C8B8C0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-stone-100 dark:bg-[#171316] text-sm text-[#675961] dark:text-[#C8B8C0] outline-none cursor-not-allowed opacity-75"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#291F26] dark:text-[#F8F1ED] mb-1.5">
              Salon Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#80405A] dark:text-[#E2A5BA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] text-sm text-[#291F26] dark:text-[#F8F1ED] focus:border-[#80405A] dark:focus:border-[#E2A5BA] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#291F26] dark:text-[#F8F1ED] mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] text-sm text-[#291F26] dark:text-[#F8F1ED] focus:border-[#80405A] dark:focus:border-[#E2A5BA] outline-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-emphasis-primary py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Admin Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
