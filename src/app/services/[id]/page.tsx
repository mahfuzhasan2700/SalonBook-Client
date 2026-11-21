'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Service } from '../../../types';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import ServiceCard from '../../../components/services/ServiceCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import { toast } from 'sonner';
import {
  Clock,
  Tag,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Star,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  Award,
  Heart,
} from 'lucide-react';

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
];

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading, isAdmin } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Booking Form State
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inclusions' | 'policy'>('overview');

  // Enforce Authentication on Service Details Page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/services/${id}`);
    }
  }, [user, authLoading, router, id]);

  // Fetch Service Details & Related Services
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await apiFetch(`/services/${id}`);
        if (res.success && res.service) {
          setService(res.service);

          // Fetch related services in the same category
          try {
            const relatedRes = await apiFetch(
              `/services?category=${encodeURIComponent(res.service.category)}&limit=4`
            );
            if (relatedRes.success && relatedRes.services) {
              setRelatedServices(
                relatedRes.services.filter((s: Service) => s._id !== res.service._id).slice(0, 3)
              );
            }
          } catch (e) {
            // Ignore related fetch failure
          }
        } else {
          setIsError(true);
          setErrorMessage(res.message || 'Service not found.');
        }
      } catch (err: any) {
        setIsError(true);
        setErrorMessage(err.message || 'Failed to retrieve salon service details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id]);

  // Today's date string in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Submit Appointment Booking Request
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push(`/signin?redirect=/services/${id}`);
      return;
    }

    if (isAdmin) {
      toast.error('Administrators cannot submit customer appointment requests.');
      return;
    }

    if (!service || service.status === 'inactive') {
      toast.error('This salon service is currently unavailable for booking.');
      return;
    }

    if (!appointmentDate) {
      toast.error('Please select your preferred appointment date.');
      return;
    }

    if (!timeSlot) {
      toast.error('Please choose an available time slot.');
      return;
    }

    setIsSubmittingBooking(true);

    try {
      const res = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          appointmentDate,
          timeSlot,
          message,
        }),
      });

      if (res.success) {
        toast.success('Appointment request submitted successfully!');
        router.push('/dashboard/customer/appointments');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit appointment request.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (authLoading || isLoading) {
    return <LoadingSpinner message="Curating service details & available schedules..." size="lg" />;
  }

  if (isError || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Service Not Found"
          description={
            errorMessage ||
            "We couldn't locate the requested salon service. The service ID may be invalid or the treatment was removed."
          }
          actionText="Explore Active Salon Menu"
          actionHref="/services"
          icon={<AlertCircle className="w-8 h-8 text-rose-600" />}
        />
      </div>
    );
  }

  const isInactive = service.status === 'inactive';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. BREADCRUMBS NAVIGATION */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-gray-500">
        <Link href="/" className="hover:text-primary-700 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/services" className="hover:text-primary-700 transition-colors">
          Browse Services
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link
          href={`/services?category=${encodeURIComponent(service.category)}`}
          className="hover:text-primary-700 transition-colors"
        >
          {service.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{service.serviceName}</span>
      </nav>

      {/* 2. MAIN SHOWCASE & BOOKING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border border-rose-100 bg-rose-50 group">
            <img
              src={service.image}
              alt={service.serviceName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Inactive Overlay Badge */}
            {isInactive && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-600 text-white font-bold text-sm uppercase px-5 py-2.5 rounded-full shadow-xl flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Currently Inactive / Unavailable for Booking</span>
                </span>
              </div>
            )}

            {/* Category Pill */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary-800 shadow-md flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-600" />
              <span>{service.category}</span>
            </div>

            {/* Price Badge on Image */}
            <div className="absolute bottom-4 left-4 bg-gray-950/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2">
              <span className="text-xs text-rose-200 font-medium">Session Fee:</span>
              <span className="text-xl font-bold text-white">${service.price}</span>
            </div>
          </div>

          {/* Title & Metadata Strip */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center space-x-2 bg-rose-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Premier Salon Ritual</span>
              </div>

              {/* Review indicator */}
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-gray-900 ml-1">4.9</span>
                <span className="text-gray-400">(140+ Client Reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-snug">
              {service.serviceName}
            </h1>

            {/* Duration and Category info bar */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 pt-1">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-primary-600" />
                <span>
                  Estimated Duration: <strong>{service.duration} Minutes</strong>
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-primary-600" />
                <span>Master Stylist Handled</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 flex space-x-8 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-700 text-primary-700 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Treatment Overview
            </button>
            <button
              onClick={() => setActiveTab('inclusions')}
              className={`pb-3 transition-colors ${
                activeTab === 'inclusions'
                  ? 'border-b-2 border-primary-700 text-primary-700 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              What's Included
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`pb-3 transition-colors ${
                activeTab === 'policy'
                  ? 'border-b-2 border-primary-700 text-primary-700 font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Cancellation & Standards
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-sm text-gray-600 leading-relaxed">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="text-base text-gray-800 font-serif leading-relaxed">
                  {service.description}
                </p>
                <p>
                  Every session begins with an individualized hair and skin assessment. Our master artists tailor color tones, hair textures, and facial serums to harmonize with your natural features and personal style.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hospital-grade sterilization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cruelty-free organic products</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Complimentary consultation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Refreshments & espresso bar</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inclusions' && (
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong>Comprehensive Stylist Consultation:</strong> Discussion of desired look, lifestyle, and hair texture suitability.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong>Luxury Wash & Prep:</strong> Aromatherapeutic scalp massage with sulfate-free organic shampoo and deep-conditioner.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong>Precision Execution:</strong> Expert application using diamond tools, professional shears, and European toners.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong>Signature Finishing:</strong> High-shine blowout, thermal heat protection, and bespoke home styling tips.
                  </span>
                </li>
              </ul>
            )}

            {activeTab === 'policy' && (
              <div className="space-y-3">
                <p>
                  <strong>Zero-Risk Booking:</strong> You can submit appointment requests without paying upfront. Your request remains <em>Pending</em> until reviewed and accepted by our salon manager.
                </p>
                <p>
                  <strong>Flexible Cancellation:</strong> You can cancel any <em>Pending</em> appointment directly from your customer dashboard with a single click.
                </p>
                <p>
                  <strong>Secure Stripe Checkout:</strong> Once confirmed by administration, you can pay conveniently via credit card or Google Pay through Stripe.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Appointment Booking Form */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden">
            {/* Booking Card Header */}
            <div className="p-6 salon-gradient text-white">
              <span className="text-[11px] uppercase font-bold tracking-widest text-rose-200">
                Direct Reservation
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-1">
                Schedule Your Appointment
              </h3>
              <div className="flex items-center justify-between text-xs text-rose-100 mt-2 pt-2 border-t border-rose-800/40">
                <span>Fee: ${service.price}</span>
                <span>Duration: {service.duration} mins</span>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
              {/* Date Input */}
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <span>1. Select Appointment Date *</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  disabled={isInactive || isAdmin}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-sm text-gray-800 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Predefined Time Slots */}
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>2. Select Time Window *</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={isInactive || isAdmin}
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 px-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50 text-primary-800 shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:border-rose-200 hover:bg-rose-50/50 disabled:opacity-50 disabled:hover:bg-transparent'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Note */}
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  <span>3. Special Requests or Notes (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isInactive || isAdmin}
                  placeholder="Hair length, sensitivity, preferences..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 text-xs text-gray-800 outline-none resize-none disabled:bg-gray-100"
                />
              </div>

              {/* Booking Summary Box */}
              <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Treatment Fee:</span>
                  <span className="font-bold text-gray-900">${service.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Upfront Deposit:</span>
                  <span className="font-semibold text-emerald-700">$0 (Pay upon confirmation)</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold border-t border-rose-200/60 pt-1.5">
                  <span>Total Due:</span>
                  <span className="text-primary-800 text-sm">${service.price}</span>
                </div>
              </div>

              {/* Role Guards & Action Buttons */}
              <div>
                {isAdmin ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <p className="font-bold">Admin Account Notice:</p>
                    <p>
                      Administrators cannot submit customer booking requests. Please use a customer account to test scheduling.
                    </p>
                  </div>
                ) : isInactive ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-gray-400 bg-gray-100 cursor-not-allowed text-center uppercase tracking-wider"
                  >
                    Service Inactive for Booking
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white salon-gradient hover:opacity-95 shadow-md shadow-rose-900/15 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isSubmittingBooking ? 'Submitting Request...' : 'Confirm Appointment Request'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted & secure booking verification</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3. RELATED SERVICES SECTION */}
      {relatedServices.length > 0 && (
        <section className="pt-10 border-t border-rose-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-700">
                More in {service.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                You May Also Enjoy
              </h2>
            </div>
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center space-x-1 mt-2 sm:mt-0"
            >
              <span>Explore all {service.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <ServiceCard key={rel._id} service={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
