'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Service } from '../../../types';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import BookingModal from '../../../components/services/BookingModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import {
  Clock,
  Tag,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading, isAdmin } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Authentication check: redirect to /signin if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/services/${id}`);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch(`/services/${id}`);
        if (res.success && res.service) {
          setService(res.service);
        } else {
          setIsError(true);
        }
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  if (authLoading || isLoading) {
    return <LoadingSpinner message="Loading salon service details..." size="lg" />;
  }

  if (isError || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Service Not Found"
          description="We couldn't locate the requested salon service. The service may have been updated or removed by administration."
          actionText="Back to Browse Services"
          actionHref="/services"
          icon={<AlertCircle className="w-8 h-8 text-rose-600" />}
        />
      </div>
    );
  }

  const isInactive = service.status === 'inactive';

  const handleBookingClick = () => {
    if (!user) {
      router.push(`/signin?redirect=/services/${id}`);
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <Link
        href="/services"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Salon Services</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-rose-100 bg-rose-50">
            <img
              src={service.image}
              alt={service.serviceName}
              className="w-full h-full object-cover"
            />
            {isInactive && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-600 text-white font-bold text-sm uppercase px-4 py-2 rounded-full shadow-lg">
                  Currently Inactive / Unavailable
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-primary-800 shadow-md flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-600" />
              <span>{service.category}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Service Information & Booking Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Salon Service</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight leading-snug">
                {service.serviceName}
              </h1>
            </div>

            {/* Price & Duration Bar */}
            <div className="flex items-center justify-between p-4 bg-rose-50/60 rounded-2xl border border-rose-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">Service Fee</p>
                <p className="text-3xl font-serif font-bold text-primary-800">
                  ${service.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Session Duration</p>
                <div className="flex items-center space-x-1 text-sm font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>{service.duration} mins</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Service Description & Technique
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complimentary consultation with senior stylist</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Premium organic styling & care products included</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flexible cancellation on pending requests</span>
              </div>
            </div>

            {/* Booking CTA Button */}
            <div className="pt-2">
              {isAdmin ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <p className="font-bold">Admin Account Notice:</p>
                  <p>
                    Administrators cannot submit customer appointment requests. Please use a customer account to test booking.
                  </p>
                </div>
              ) : isInactive ? (
                <button
                  disabled
                  className="w-full py-4 px-6 rounded-2xl text-sm font-semibold text-gray-400 bg-gray-100 cursor-not-allowed text-center"
                >
                  Currently Inactive for Booking
                </button>
              ) : (
                <button
                  onClick={handleBookingClick}
                  className="w-full py-4 px-6 rounded-2xl text-base font-semibold text-white salon-gradient hover:opacity-95 shadow-xl shadow-rose-900/20 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment Now</span>
                </button>
              )}
            </div>

            {/* Security note */}
            <div className="flex items-center space-x-2 text-[11px] text-gray-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
              <span>Zero cancellation fees for pending appointment requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {service && (
        <BookingModal
          service={service}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
