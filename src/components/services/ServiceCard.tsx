import React from 'react';
import Link from 'next/link';
import { Service } from '../../types';
import { Clock, ArrowRight, Tag } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-rose-100/80 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-rose-50">
        <img
          src={service.image}
          alt={service.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary-800 shadow-sm flex items-center space-x-1">
          <Tag className="w-3 h-3 text-primary-600" />
          <span>{service.category}</span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-gray-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-md">
          ${service.price}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>{service.duration} mins session</span>
          </div>

          <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1 mb-2">
            {service.serviceName}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {service.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-rose-50">
          <Link
            href={`/services/${service._id}`}
            className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-primary-700 bg-rose-50 hover:bg-primary-700 hover:text-white transition-all duration-200 group-hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
