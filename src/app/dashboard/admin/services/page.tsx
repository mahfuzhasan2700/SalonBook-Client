'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '../../../../types';
import { apiFetch, uploadImageToImgBB } from '../../../../lib/api';
import { FALLBACK_SERVICES } from '../../../../data/fallbackServices';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import EmptyState from '../../../../components/common/EmptyState';
import { toast } from 'sonner';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  Tag,
  Clock,
  X,
  Search,
} from 'lucide-react';

const CATEGORIES = [
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form states
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch('/services/admin/all');
      if (res.success && res.services && res.services.length > 0) {
        setServices(res.services);
      } else {
        setServices(FALLBACK_SERVICES);
      }
    } catch (err: any) {
      setServices(FALLBACK_SERVICES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setSelectedService(null);
    setServiceName('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setPrice('');
    setDuration('');
    setImage('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');
    setStatus('active');
    setModalMode('create');
  };

  const openEditModal = (s: Service) => {
    setSelectedService(s);
    setServiceName(s.serviceName);
    setCategory(s.category);
    setDescription(s.description);
    setPrice(s.price);
    setDuration(s.duration);
    setImage(s.image);
    setStatus(s.status);
    setModalMode('edit');
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const url = await uploadImageToImgBB(e.target.files[0]);
        setImage(url);
        toast.success('Service image uploaded successfully!');
      } catch (err: any) {
        toast.error('Image upload failed.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !category || !description || !price || !duration || !image) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (Number(price) <= 0 || Number(duration) <= 0) {
      toast.error('Price and duration must be positive numbers.');
      return;
    }

    setIsSaving(true);

    try {
      if (modalMode === 'create') {
        const res = await apiFetch('/services', {
          method: 'POST',
          body: JSON.stringify({
            serviceName,
            category,
            description,
            price: Number(price),
            duration: Number(duration),
            image,
            status,
          }),
        });

        if (res.success) {
          toast.success('Salon service added successfully!');
          setModalMode(null);
          fetchServices();
        }
      } else if (modalMode === 'edit' && selectedService) {
        const res = await apiFetch(`/services/${selectedService._id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            serviceName,
            category,
            description,
            price: Number(price),
            duration: Number(duration),
            image,
            status,
          }),
        });

        if (res.success) {
          toast.success('Salon service updated successfully!');
          setModalMode(null);
          fetchServices();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (s: Service) => {
    const nextStatus = s.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await apiFetch(`/services/${s._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.success) {
        toast.success(`Service marked as ${nextStatus}.`);
        fetchServices();
      }
    } catch (err: any) {
      toast.error('Failed to update service status.');
    }
  };

  // Delete service
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this salon service?');
    if (!confirmDelete) return;

    try {
      const res = await apiFetch(`/services/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.success('Service deleted.');
        fetchServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    }
  };

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(filterSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Manage Salon Services
          </h1>
          <p className="text-sm text-gray-500">
            Add new treatments, edit pricing and duration, and toggle public visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          placeholder="Filter services by name or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-xs text-gray-800 outline-none bg-white"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading catalog..." />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description="Create your first salon service or adjust your search filter."
          actionText="Add New Service"
          onActionClick={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredServices.map((s) => (
                  <tr key={s._id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={s.image}
                          alt={s.serviceName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-rose-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{s.serviceName}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-primary-800">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">${s.price}</td>
                    <td className="py-4 px-6 text-xs text-gray-600">{s.duration} mins</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                          s.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {s.status === 'active' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{s.status}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-primary-700 hover:bg-rose-50 transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                {modalMode === 'create' ? 'Add New Salon Service' : 'Update Salon Service'}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  placeholder="e.g. Balayage & Gloss Treatment"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    placeholder="95"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    placeholder="60"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Service Image Upload (Required: Image Upload, Not URL) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Service Image (File Upload) *
                </label>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer py-2.5 px-4 rounded-xl border border-dashed border-rose-300 hover:bg-rose-50 text-xs font-semibold text-primary-700 flex items-center space-x-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading to ImgBB...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-rose-100"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Detailed explanation of the technique, products used, and expected results..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Service Visibility Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 text-sm text-gray-800 outline-none bg-white"
                >
                  <option value="active">Active (Visible & Bookable)</option>
                  <option value="inactive">Inactive (Hidden from Menu)</option>
                </select>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex-1 py-2.5 rounded-xl salon-gradient text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-rose-900/15 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create Service' : 'Update Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
