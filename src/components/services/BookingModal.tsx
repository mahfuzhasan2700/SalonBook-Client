'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '../../types';
import { apiFetch } from '../../lib/api';
import { toast } from 'sonner';
import { Calendar, Clock, MessageSquare, X, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

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

export default function BookingModal({ service, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Format today's date in YYYY-MM-DD for min date
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointmentDate) {
      toast.error('Please choose your preferred appointment date.');
      return;
    }

    if (!timeSlot) {
      toast.error('Please choose an available time slot.');
      return;
    }

    setIsSubmitting(true);

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
        onClose();
        router.push('/dashboard/customer/appointments');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit appointment request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241E23] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EAE3DB] dark:border-[#382E36] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-[#80405A] dark:bg-[#2B2027] text-white flex justify-between items-start border-b border-[#EAE3DB]/20">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#E2A5BA]">
              Schedule Appointment
            </span>
            <h3 className="text-xl font-serif font-bold text-white mt-1">
              {service.serviceName}
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              ${service.price} • {service.duration} mins session
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Appointment Date */}
          <div>
            <label className="flex items-center space-x-2 text-xs font-bold text-[#291F26] dark:text-[#F8F1ED] uppercase tracking-wider mb-2 font-sans">
              <Calendar className="w-4 h-4 text-[#80405A] dark:text-[#E2A5BA]" />
              <span>Select Date *</span>
            </label>
            <input
              type="date"
              min={today}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] focus:border-[#80405A] dark:focus:border-[#E2A5BA] focus:ring-2 focus:ring-[#80405A]/20 text-sm text-[#291F26] dark:text-[#F8F1ED] outline-none transition-all"
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="flex items-center space-x-2 text-xs font-bold text-[#291F26] dark:text-[#F8F1ED] uppercase tracking-wider mb-2 font-sans">
              <Clock className="w-4 h-4 text-[#80405A] dark:text-[#E2A5BA]" />
              <span>Choose Available Time Slot *</span>
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {AVAILABLE_TIME_SLOTS.map((slot) => {
                const isSelected = timeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                      isSelected
                        ? 'border-[#80405A] bg-[#80405A] text-white dark:border-[#E2A5BA] dark:bg-[#E2A5BA] dark:text-[#24171D] shadow-sm'
                        : 'border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] text-[#675961] dark:text-[#C8B8C0] hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes / Message */}
          <div>
            <label className="flex items-center space-x-2 text-xs font-bold text-[#291F26] dark:text-[#F8F1ED] uppercase tracking-wider mb-2 font-sans">
              <MessageSquare className="w-4 h-4 text-[#80405A] dark:text-[#E2A5BA]" />
              <span>Special Requests or Notes (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any styling preferences, hair length, allergies or skin sensitivities..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#382E36] bg-[#FAF7F3] dark:bg-[#171316] focus:border-[#80405A] dark:focus:border-[#E2A5BA] focus:ring-2 focus:ring-[#80405A]/20 text-sm text-[#291F26] dark:text-[#F8F1ED] outline-none transition-all resize-none"
            />
          </div>

          {/* Security & Policy note */}
          <div className="flex items-start space-x-2.5 bg-[#FAF7F3] dark:bg-[#171316] p-3.5 rounded-2xl border border-[#EAE3DB] dark:border-[#382E36] text-xs text-[#675961] dark:text-[#C8B8C0]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your request will be submitted as <strong>Pending</strong>. Once reviewed and confirmed by our salon manager, you can complete payment safely via Stripe.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-[#675961] dark:text-[#C8B8C0] hover:bg-stone-100 dark:hover:bg-[#171316] border border-[#EAE3DB] dark:border-[#382E36] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-emphasis-primary flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#80405A] hover:bg-[#6c364c] dark:bg-[#E2A5BA] dark:text-[#24171D] dark:hover:bg-[#d893aa] shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Request Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
