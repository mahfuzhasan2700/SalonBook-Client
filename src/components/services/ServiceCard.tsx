import React from 'react';
import Link from 'next/link';
import { Service } from '../../types';
import { Clock, ArrowRight, Tag } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const handleCardClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('salonbook_last_viewed_service', service._id);
    }
  };

  return (
    <div className="group bg-white dark:bg-[#241E23] rounded-3xl overflow-hidden border border-[#EAE3DB] dark:border-[#382E36] shadow-sm hover:shadow-xl hover:border-[#80405A]/40 dark:hover:border-[#E2A5BA]/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container with Consistent Aspect Ratio */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-[#171316]">
          <img
            src={service.image}
            alt={service.serviceName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-[#241E23]/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#80405A] dark:text-[#E2A5BA] shadow-sm flex items-center space-x-1.5">
            <Tag className="w-3 h-3" />
            <span>{service.category}</span>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3.5 right-3.5 bg-[#171316]/90 backdrop-blur-md text-[#F8F1ED] px-3 py-1 rounded-xl text-sm font-bold shadow-md">
            ${service.price}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-2.5">
          <div className="flex items-center space-x-2 text-xs text-[#675961] dark:text-[#C8B8C0]">
            <Clock className="w-3.5 h-3.5 text-[#80405A] dark:text-[#E2A5BA]" />
            <span>{service.duration} mins treatment</span>
          </div>

          <h3 className="text-xl font-serif font-bold text-[#291F26] dark:text-[#F8F1ED] group-hover:text-[#80405A] dark:group-hover:text-[#E2A5BA] transition-colors line-clamp-1">
            {service.serviceName}
          </h3>

          <p className="text-xs text-[#675961] dark:text-[#C8B8C0] line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        <Link
          href={`/services/${service._id}`}
          onClick={handleCardClick}
          className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl text-xs font-semibold text-[#80405A] bg-[#80405A]/10 hover:bg-[#80405A] hover:text-white dark:text-[#E2A5BA] dark:bg-[#E2A5BA]/15 dark:hover:bg-[#E2A5BA] dark:hover:text-[#24171D] transition-all duration-180 group-hover:shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-180" />
        </Link>
      </div>
    </div>
  );
}
