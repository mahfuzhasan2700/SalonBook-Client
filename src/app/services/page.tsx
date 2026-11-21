'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Service } from '../../types';
import { apiFetch } from '../../lib/api';
import { FALLBACK_SERVICES } from '../../data/fallbackServices';
import ServiceCard from '../../components/services/ServiceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search, Filter, ArrowUpDown, Sparkles, X, DollarSign } from 'lucide-react';

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

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 99999 },
  { label: 'Under $75', min: 0, max: 75 },
  { label: '$75 to $150', min: 75, max: 150 },
  { label: 'Over $150', min: 150, max: 99999 },
];

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState<Service[]>(() =>
    FALLBACK_SERVICES.filter((s) => s.status === 'active')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0); // index
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isLoading, setIsLoading] = useState(false);

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
        if (res.success && res.services && res.services.length > 0) {
          let filtered = res.services;

          // Apply client-side price range filtering if selected
          if (selectedPriceRange !== 0) {
            const range = PRICE_RANGES[selectedPriceRange];
            filtered = filtered.filter(
              (s: Service) => s.price >= range.min && s.price <= range.max
            );
          }

          setServices(filtered);
        } else {
          // If server returned 0 or not ready, fallback gracefully to pre-seeded catalog
          let fallback = FALLBACK_SERVICES.filter((s) => s.status === 'active');
          if (searchTerm.trim()) {
            fallback = fallback.filter((s) =>
              s.serviceName.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
          }
          if (selectedCategory && selectedCategory !== 'All') {
            fallback = fallback.filter((s) => s.category === selectedCategory);
          }
          if (sortOption === 'price-asc') {
            fallback.sort((a, b) => a.price - b.price);
          } else if (sortOption === 'price-desc') {
            fallback.sort((a, b) => b.price - a.price);
          }
          if (selectedPriceRange !== 0) {
            const range = PRICE_RANGES[selectedPriceRange];
            fallback = fallback.filter((s) => s.price >= range.min && s.price <= range.max);
          }
          setServices(fallback);
        }
      } catch (error) {
        // Fallback to embedded catalog records filtered according to selections
        let fallback = FALLBACK_SERVICES.filter((s) => s.status === 'active');
        if (searchTerm.trim()) {
          fallback = fallback.filter((s) =>
            s.serviceName.toLowerCase().includes(searchTerm.trim().toLowerCase())
          );
        }
        if (selectedCategory && selectedCategory !== 'All') {
          fallback = fallback.filter((s) => s.category === selectedCategory);
        }
        if (sortOption === 'price-asc') {
          fallback.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
          fallback.sort((a, b) => b.price - a.price);
        }
        if (selectedPriceRange !== 0) {
          const range = PRICE_RANGES[selectedPriceRange];
          fallback = fallback.filter((s) => s.price >= range.min && s.price <= range.max);
        }
        setServices(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchServices();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, sortOption, selectedPriceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriceRange(0);
    setSortOption('default');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    sortOption !== 'default' ||
    selectedPriceRange !== 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-sans">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Salon Menu</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] tracking-tight">
          Browse Salon Services
        </h1>
        <p className="text-sm text-[#675961] dark:text-[#C8B8C0]">
          Explore bespoke haircuts, high-gloss balayage, botanical facials, and luxury spa therapies.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-[#241E23] p-6 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-[#675961] dark:text-[#C8B8C0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by name (e.g. Balayage, Cut, Facial)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] focus:border-[#80405A] dark:focus:border-[#E2A5BA] focus:ring-2 focus:ring-[#80405A]/20 text-sm text-[#291F26] dark:text-[#F8F1ED] outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#675961] hover:text-[#291F26] dark:hover:text-[#F8F1ED]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Range Filter Buttons & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Price Filter Chips */}
            <div className="flex items-center space-x-1 bg-[#FAF7F3] dark:bg-[#171316] p-1 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] text-xs">
              <span className="text-[10px] uppercase font-bold text-[#675961] dark:text-[#C8B8C0] px-2 flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>Price:</span>
              </span>
              {PRICE_RANGES.map((range, index) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(index)}
                  className={`filter-pill px-3 py-1.5 rounded-lg font-semibold ${
                    selectedPriceRange === index
                      ? 'bg-white dark:bg-[#241E23] text-[#80405A] dark:text-[#E2A5BA] shadow-sm border border-[#EAE3DB] dark:border-[#382E36]'
                      : 'text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#675961] dark:text-[#C8B8C0] shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] focus:border-[#80405A] dark:focus:border-[#E2A5BA] text-xs font-semibold text-[#291F26] dark:text-[#F8F1ED] outline-none bg-white dark:bg-[#171316] cursor-pointer shadow-sm"
              >
                <option value="default">Sort: Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#80405A] dark:text-[#E2A5BA] hover:underline font-semibold px-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <div className="flex items-center space-x-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#675961] dark:text-[#C8B8C0]">
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
                  className={`filter-pill px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    isSelected
                      ? 'bg-[#80405A] dark:bg-[#E2A5BA] text-white dark:text-[#24171D] shadow-md shadow-[#80405A]/25 dark:shadow-[#E2A5BA]/25'
                      : 'bg-[#FAF7F3] dark:bg-[#171316] text-[#675961] dark:text-[#C8B8C0] hover:text-[#291F26] dark:hover:text-[#F8F1ED] border border-[#EAE3DB] dark:border-[#382E36] hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40'
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
        <LoadingSpinner message="Searching available salon services..." />
      ) : services.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description="We couldn't find any salon services matching your active filters. Try searching with a different term or reset your filters."
          actionText="Clear All Filters"
          onActionClick={clearFilters}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-[#675961] dark:text-[#C8B8C0] px-1">
            <span>
              Showing <strong className="text-[#291F26] dark:text-[#F8F1ED]">{services.length}</strong> active salon service{services.length === 1 ? '' : 's'}
            </span>
            {selectedCategory !== 'All' && (
              <span className="font-semibold text-[#80405A] dark:text-[#E2A5BA] bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 px-2.5 py-1 rounded-md">
                Department: {selectedCategory}
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
    <Suspense fallback={<LoadingSpinner message="Loading services..." />}>
      <BrowseServicesContent />
    </Suspense>
  );
}
