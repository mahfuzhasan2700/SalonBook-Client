import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full salon-gradient flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Salon<span className="text-rose-400">Book</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Experience the pinnacle of luxury hair styling, rejuvenating skincare, couture makeup, and relaxing spa therapies. Crafted for your ultimate elegance.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-rose-400 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-rose-400 transition-colors">
                  Create an Account
                </Link>
              </li>
              <li>
                <Link href="/services?category=Haircut+%26+Styling" className="hover:text-rose-400 transition-colors">
                  Haircut & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial+%26+Skincare" className="hover:text-rose-400 transition-colors">
                  Facial & Skincare
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Salon Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>452 Fifth Avenue, Luxury Plaza, Suite 800, New York, NY 10018</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>+1 (800) 555-SALON</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>concierge@salonbook.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Opening Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Opening Hours
            </h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-center space-x-2 text-rose-400 pb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-white">Daily Studio Schedule</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900">
                <span>Monday – Friday:</span>
                <span className="text-white font-medium">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-900">
                <span>Saturday:</span>
                <span className="text-white font-medium">9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday:</span>
                <span className="text-amber-400 font-medium">10:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} SalonBook Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Hygiene Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
