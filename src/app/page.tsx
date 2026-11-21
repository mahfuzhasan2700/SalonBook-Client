'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service } from '../types';
import { apiFetch } from '../lib/api';
import ServiceCard from '../components/services/ServiceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Sparkles,
  Scissors,
  Palette,
  HeartHandshake,
  Smile,
  Gem,
  Flame,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Haircut & Styling',
    description: 'Precision cuts, executive trims & signature blowouts.',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hair Coloring',
    description: 'Balayage, multidimensional gloss & root touch-ups.',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hair Treatment',
    description: 'Keratin smoothing, deep scalp detox & intense hydration.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Facial & Skincare',
    description: 'Diamond dermabrasion, collagen lifting & organic hydration.',
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Makeup',
    description: 'Bridal couture glam, photoshoot looks & soft daytime beauty.',
    icon: Gem,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Manicure & Pedicure',
    description: 'Spa nail grooming, chip-resistant LED gel & paraffin wraps.',
    icon: HeartHandshake,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Spa & Massage',
    description: 'Swedish aromatherapy, hot stone therapy & deep tension relief.',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiFetch('/services?limit=6');
        if (res.success && res.services) {
          // Display only active services per requirement
          setFeaturedServices(res.services.filter((s: Service) => s.status === 'active').slice(0, 6));
        }
      } catch (e) {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="space-y-28 pb-24">
      {/* 1. HERO SECTION: 2/5 CONTRASTING PANEL + REAL SALON PHOTOGRAPH + SIGNATURE MOTION GRAPHIC */}
      <section className="relative overflow-hidden border-b border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 2/5ths contrasting panel */}
            <div className="lg:col-span-5 z-10 bg-white/90 dark:bg-[#241E23]/90 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-xl space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editorial Salon Experience</span>
              </div>

              {/* Exact required heading */}
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] leading-[1.15] tracking-tight">
                Make time for a little care
              </h1>

              {/* Short description */}
              <p className="text-sm sm:text-base text-[#675961] dark:text-[#C8B8C0] leading-relaxed font-sans">
                An independent editorial studio dedicated to bespoke balayage, precision haircutting, botanical skincare, and rejuvenating therapies crafted for your peace of mind.
              </p>

              {/* Exact CTA */}
              <div className="pt-2">
                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full text-sm font-semibold text-white bg-[#80405A] hover:bg-[#6a3449] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d88ea6] shadow-md transition-all duration-180 transform hover:-translate-y-0.5"
                >
                  <span>Explore Salon Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick trust cues */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE3DB] dark:border-[#382E36] text-xs">
                <div>
                  <p className="text-xl font-serif font-bold text-[#80405A] dark:text-[#E2A5BA]">12+</p>
                  <p className="text-[#675961] dark:text-[#C8B8C0]">Master Stylists</p>
                </div>
                <div>
                  <p className="text-xl font-serif font-bold text-[#80405A] dark:text-[#E2A5BA]">100%</p>
                  <p className="text-[#675961] dark:text-[#C8B8C0]">Cruelty-Free</p>
                </div>
                <div>
                  <p className="text-xl font-serif font-bold text-[#80405A] dark:text-[#E2A5BA]">Zero</p>
                  <p className="text-[#675961] dark:text-[#C8B8C0]">Wait Time</p>
                </div>
              </div>
            </div>

            {/* Right 3/5ths Hero Photograph with Signature Hair Curve Motion Graphic */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#EAE3DB] dark:border-[#382E36]">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                  alt="Salon stylist creating bespoke hairstyle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* SIGNATURE MOTION GRAPHIC: Two animated SVG curves that follow a lock of hair (~900ms stroke animation) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 800 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Hair Strand Curve 1 */}
                  <path
                    d="M 520,30 C 590,160 540,290 620,440 C 660,510 710,560 740,590"
                    stroke="#E2A5BA"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="hair-strand-curve-1 opacity-90"
                  />
                  {/* Hair Strand Curve 2 */}
                  <path
                    d="M 545,40 C 615,170 565,300 645,450 C 685,520 730,570 760,595"
                    stroke="#FAF7F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                    className="hair-strand-curve-2 opacity-80"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SALON SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#80405A] dark:text-[#E2A5BA]">
              Handcrafted Rituals
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
              Featured Salon Services
            </h2>
            <p className="text-sm text-[#675961] dark:text-[#C8B8C0] mt-2 max-w-xl">
              Explore our most requested salon treatments, meticulously delivered by senior artists using organic formulations.
            </p>
          </div>

          <Link
            href="/services"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-[#80405A] dark:text-[#E2A5BA] hover:underline"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Curating featured services..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 3. SALON SERVICE CATEGORIES SECTION */}
      <section className="bg-white/60 dark:bg-[#241E23]/60 py-20 border-y border-[#EAE3DB] dark:border-[#382E36] transition-colors duration-180">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#80405A] dark:text-[#E2A5BA]">
              Departments of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
              Salon Service Categories
            </h2>
            <p className="text-sm text-[#675961] dark:text-[#C8B8C0] mt-2">
              Browse tailored collections designed for haircutting, vibrant coloration, holistic skincare, and body wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="category-card group bg-white dark:bg-[#171316] rounded-3xl overflow-hidden border border-[#EAE3DB] dark:border-[#382E36] shadow-sm hover:shadow-xl hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden relative bg-stone-100 dark:bg-stone-900">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5 text-white flex items-center space-x-2">
                      <div className="category-icon-hover w-8 h-8 rounded-full bg-[#80405A]/85 dark:bg-[#E2A5BA]/90 text-white dark:text-[#24171D] flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-lg leading-snug">{cat.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-[#675961] dark:text-[#C8B8C0] line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="mt-3 text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore rituals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXACT REQUIRED EXTRA SECTION: HOW BOOKING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#80405A] dark:text-[#E2A5BA]">
            Transparent & Simple
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mt-1">
            How booking works
          </h2>
          <p className="text-sm text-[#675961] dark:text-[#C8B8C0] mt-2">
            Enjoy zero-risk appointment scheduling with salon confirmation before any payment is collected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Request Appointment */}
          <div className="bg-white dark:bg-[#241E23] p-8 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm relative">
            <span className="text-5xl font-serif font-bold text-[#80405A]/15 dark:text-[#E2A5BA]/15 absolute top-6 right-6">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mb-2">
              1. Request Appointment
            </h3>
            <p className="text-xs text-[#675961] dark:text-[#C8B8C0] leading-relaxed">
              Select your service, choose an available date and preferred time slot, and add any styling preferences. No upfront payment is required.
            </p>
          </div>

          {/* Step 2: Salon Confirmation */}
          <div className="bg-white dark:bg-[#241E23] p-8 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm relative">
            <span className="text-5xl font-serif font-bold text-[#80405A]/15 dark:text-[#E2A5BA]/15 absolute top-6 right-6">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mb-2">
              2. Salon Confirmation
            </h3>
            <p className="text-xs text-[#675961] dark:text-[#C8B8C0] leading-relaxed">
              Our salon manager reviews your booking and confirms your stylist's chair. You can monitor the real-time status right from your dashboard.
            </p>
          </div>

          {/* Step 3: Verified Stripe Payment */}
          <div className="bg-white dark:bg-[#241E23] p-8 rounded-3xl border border-[#EAE3DB] dark:border-[#382E36] shadow-sm relative">
            <span className="text-5xl font-serif font-bold text-[#80405A]/15 dark:text-[#E2A5BA]/15 absolute top-6 right-6">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#80405A]/10 dark:bg-[#E2A5BA]/15 text-[#80405A] dark:text-[#E2A5BA] flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] mb-2">
              3. Stripe Payment
            </h3>
            <p className="text-xs text-[#675961] dark:text-[#C8B8C0] leading-relaxed">
              Once confirmed, click <strong>Pay Now</strong> in your appointments to complete checkout safely with Stripe. A verified webhook locks in your receipt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
