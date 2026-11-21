import React from 'react';
import Link from 'next/link';
import { SALON_CONFIG } from '../../config/salon';
import { Scissors, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#171316] text-[#C8B8C0] pt-16 pb-12 border-t border-[#382E36] transition-colors duration-180">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E2A5BA] text-[#24171D] flex items-center justify-center shadow-md">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-[#F8F1ED] tracking-tight">
                Salon<span className="text-[#E2A5BA]">Book</span>
              </span>
            </Link>
            <p className="text-sm text-[#C8B8C0] leading-relaxed">
              {SALON_CONFIG.shortDescription}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={SALON_CONFIG.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#241E23] flex items-center justify-center text-[#C8B8C0] hover:text-[#E2A5BA] hover:bg-[#2e262c] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SALON_CONFIG.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#241E23] flex items-center justify-center text-[#C8B8C0] hover:text-[#E2A5BA] hover:bg-[#2e262c] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SALON_CONFIG.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#241E23] flex items-center justify-center text-[#C8B8C0] hover:text-[#E2A5BA] hover:bg-[#2e262c] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F8F1ED] mb-4 font-sans">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#E2A5BA] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#E2A5BA] transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#E2A5BA] transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#E2A5BA] transition-colors">
                  Sign Up & Register
                </Link>
              </li>
              <li>
                <Link href="/services?category=Haircut+%26+Styling" className="hover:text-[#E2A5BA] transition-colors">
                  Haircut & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial+%26+Skincare" className="hover:text-[#E2A5BA] transition-colors">
                  Facial & Skincare
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F8F1ED] mb-4 font-sans">
              Salon Studio
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#E2A5BA] shrink-0 mt-0.5" />
                <span>{SALON_CONFIG.address.full}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#E2A5BA] shrink-0" />
                <span>{SALON_CONFIG.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#E2A5BA] shrink-0" />
                <span>{SALON_CONFIG.email}</span>
              </li>
              <li className="text-xs text-[#C8B8C0]/80 pt-1">
                Local Time: <strong>{SALON_CONFIG.timeZone}</strong>
              </li>
            </ul>
          </div>

          {/* Col 4: Opening Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F8F1ED] mb-4 font-sans">
              Studio Hours
            </h4>
            <div className="space-y-2.5 text-sm text-[#C8B8C0]">
              <div className="flex items-center space-x-2 text-[#E2A5BA] pb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-[#F8F1ED]">Weekly Schedule</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#241E23]">
                <span>Weekdays:</span>
                <span className="text-[#F8F1ED] font-medium">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#241E23]">
                <span>Saturday:</span>
                <span className="text-[#F8F1ED] font-medium">9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday:</span>
                <span className="text-[#E2A5BA] font-medium">10:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#241E23] flex flex-col sm:flex-row items-center justify-between text-xs text-[#C8B8C0]/70 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} {SALON_CONFIG.name}. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-[#F8F1ED] cursor-pointer">Hygiene & Safety Standards</span>
            <span className="hover:text-[#F8F1ED] cursor-pointer">Cancellation Policy</span>
            <span className="hover:text-[#F8F1ED] cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
