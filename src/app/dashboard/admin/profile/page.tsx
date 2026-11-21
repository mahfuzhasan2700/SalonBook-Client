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
      const res = await apiFetch('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, image }),
      });

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
        <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
          Executive Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
          Administrator Profile
        </h1>
        <p className="text-sm text-gray-500">
          Manage your salon manager credentials and contact information
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Profile Avatar */}
        <div className="flex items-center space-x-6 pb-6 border-b border-gray-100">
          <div className="relative">
            <img
              src={image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
              alt="Admin"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-100"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{user?.name}</h4>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-gray-500">{user?.email}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-primary-800 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-primary-700 hover:bg-rose-50 transition-colors mt-3">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Admin Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Salon Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="py-3 px-6 rounded-xl text-sm font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 flex items-center space-x-2 disabled:opacity-50"
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
