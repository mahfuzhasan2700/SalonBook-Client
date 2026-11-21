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
  Star,
  Clock,
  Award,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Haircut & Styling',
    description: 'Precision cuts, executive trims & bouncy signature blowouts.',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hair Coloring',
    description: 'Balayage, multidimensional highlights, gloss & root touch-ups.',
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

// Fallback services in case API is initially connecting
const FALLBACK_FEATURED_SERVICES: Service[] = [
  {
    _id: '1',
    serviceName: 'Precision Haircut & Blowout',
    category: 'Haircut & Styling',
    description: 'Expert consultation followed by a tailored wash, precision layered cut, and a signature blowout.',
    price: 65,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    _id: '2',
    serviceName: 'Sun-Kissed Balayage & Gloss',
    category: 'Hair Coloring',
    description: 'Hand-painted multidimensional highlights paired with an organic toning gloss for brilliant radiance.',
    price: 180,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    _id: '3',
    serviceName: 'Brazilian Keratin Smoothing Therapy',
    category: 'Hair Treatment',
    description: 'Transform frizzy, unmanageable curls into sleek, mirror-shine tresses that resist humidity.',
    price: 210,
    duration: 110,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    _id: '4',
    serviceName: 'Hydra-Luminous Diamond Facial',
    category: 'Facial & Skincare',
    description: 'Non-invasive dermabrasion infused with hyaluronic acid, peptides, and antioxidant serum.',
    price: 135,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    _id: '5',
    serviceName: 'Bridal Couture Glamour Makeup',
    category: 'Makeup',
    description: 'Flawless 16-hour long-wear HD airbrush foundation, dramatic mink lash application and contouring.',
    price: 160,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
  {
    _id: '6',
    serviceName: 'Swedish Deep Tissue Aromatherapy',
    category: 'Spa & Massage',
    description: 'Therapeutic full-body massage utilizing warmed organic eucalyptus oils to relieve tension.',
    price: 120,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    status: 'active',
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>(FALLBACK_FEATURED_SERVICES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiFetch('/services?limit=6');
        if (res.success && res.services && res.services.length > 0) {
          setFeaturedServices(res.services);
        }
      } catch (e) {
        // Fallback already preloaded
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=85')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-rose-950/40" />
        </div>

        {/* Banner Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center sm:text-left flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-300/30 backdrop-blur-md px-4 py-1.5 rounded-full text-rose-200 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Premier Salon & Spa Experience</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Elevate Your Beauty, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200">
                Crafted With Perfection.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-light">
              Discover master hairstylists, bespoke balayage, skin-rejuvenating facials, and luxury spa treatments. Reserve your personalized appointment in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-white salon-gradient hover:opacity-95 shadow-xl shadow-rose-950/40 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
              >
                <span>Explore Salon Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-center"
              >
                Join SalonBook
              </Link>
            </div>

            {/* Quick stats trust badge */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15 text-white">
              <div>
                <p className="text-2xl font-serif font-bold text-rose-300">100%</p>
                <p className="text-xs text-gray-300">Verified Stylists</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-rose-300">12k+</p>
                <p className="text-xs text-gray-300">Happy Clients</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-rose-300">4.9 ★</p>
                <p className="text-xs text-gray-300">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED SALON SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-primary-700 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Perfection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Featured Salon Services
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              Our most sought-after salon rituals, performed by industry-certified artists using premium organic formulations.
            </p>
          </div>

          <Link
            href="/services"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Curating featured services..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.slice(0, 6).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 3. DYNAMIC SECTION 2: SALON SERVICE CATEGORIES */}
      <section className="bg-rose-50/50 py-20 border-y border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-700">
              Personalized Treatments
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mt-2">
              Explore By Category
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              Select your desired category to explore curated treatments tailored to your unique hair texture, skin tone, and relaxation goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="w-8 h-8 rounded-full bg-primary-700/80 backdrop-blur-md flex items-center justify-center mb-1.5 shadow-sm">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-lg leading-snug">{cat.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="mt-3 text-xs font-semibold text-primary-700 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Browse category</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXTRA SECTION: WHY CHOOSE SALONBOOK & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-700">
            The SalonBook Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mt-2">
            Why Our Clients Trust Us
          </h2>
          <p className="text-sm text-gray-600 mt-3">
            We hold ourselves to hospital-grade sanitation, world-class stylists, and seamless digital booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-primary-700 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50/50">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
              Award-Winning Stylists
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every artist on our roster has at least 5 years of certified salon experience and continuous training in global trendsetting techniques.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-primary-700 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50/50">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
              Organic & Cruelty-Free
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We exclusively use ammonia-free dyes, sulfate-free shampoos, and dermatologist-tested organic skincare for ultimate wellness.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-primary-700 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50/50">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
              Guaranteed Zero-Wait Booking
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our intelligent time-slot algorithm ensures your chair is ready the instant you arrive. No lines, no delays, pure relaxation.
            </p>
          </div>
        </div>

        {/* Client Testimonial Cards */}
        <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center space-x-1 text-amber-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl font-serif italic text-rose-100 leading-relaxed">
              "SalonBook completely changed how I plan my salon visits. The balayage session was pure artistry, the ambiance was serene, and being able to book and pay effortlessly online made it a 10/10 experience!"
            </blockquote>
            <div>
              <p className="text-base font-bold text-white">Charlotte Montgomery</p>
              <p className="text-xs text-rose-300 uppercase tracking-widest mt-0.5">
                Verified SalonBook Client • Manhattan, NY
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
