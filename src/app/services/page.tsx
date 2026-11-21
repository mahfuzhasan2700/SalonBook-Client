'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Service } from '../../types';
import { apiFetch } from '../../lib/api';
import ServiceCard from '../../components/services/ServiceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search, Filter, ArrowUpDown, Sparkles, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isLoading, setIsLoading] = useState(true);

  // Sync category state if URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        let queryParams = new URLSearchParams();
        if (searchTerm.trim()) {
          queryParams.append('search', searchTerm.trim());
        }
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (sortOption !== 'default') {
          queryParams.append('sort', sortOption);
        }

        const endpoint = `/services?${queryParams.toString()}`;
        const res = await apiFetch(endpoint);
        if (res.success && res.services) {
          setServices(res.services);
        } else {
          setServices([]);
        }
      } catch (error) {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, sortOption]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortOption('default');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || sortOption !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-rose-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Complete Salon Menu</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
          Browse Salon Services
        </h1>
        <p className="text-sm text-gray-600">
          Explore our signature hairstyles, advanced color treatments, holistic skincare, and bespoke spa services.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by name (e.g. Balayage, Facial)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-sm text-gray-800 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-gray-500 shrink-0" />
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider shrink-0">
              Sort By Price:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-600 text-xs font-semibold text-gray-800 outline-none bg-white cursor-pointer"
            >
              <option value="default">Featured / Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline ml-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <div className="flex items-center space-x-2 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary-700 text-white shadow-md shadow-rose-900/15'
                      : 'bg-rose-50/60 text-gray-700 hover:bg-rose-100 hover:text-primary-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid Display */}
      {isLoading ? (
        <LoadingSpinner message="Searching available services..." />
      ) : services.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description="We couldn't find any salon services matching your search criteria. Try a different keyword or reset filters."
          actionText="Clear All Filters"
          onActionClick={clearFilters}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
            <span>
              Showing <strong>{services.length}</strong> active salon service{services.length === 1 ? '' : 's'}
            </span>
            {selectedCategory !== 'All' && (
              <span className="font-semibold text-primary-700 bg-rose-50 px-2.5 py-1 rounded-md">
                Category: {selectedCategory}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading services page..." />}>
      <BrowseServicesContent />
    </Suspense>
  );
}
