import { Link } from 'react-router-dom';
import { MapPin, FlaskConical, Home } from 'lucide-react';
import { Rating } from './Rating';
import { VerificationBadge } from './VerificationBadge';
import { PriceDisplay } from './PriceDisplay';
import type { Laboratory } from '@/types';

interface LabCardProps {
  lab: Laboratory;
}

export function LabCard({ lab }: LabCardProps) {
  return (
    <Link
      to={`/labs/${lab.id}`}
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/40 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 font-bold transition-transform group-hover:scale-105">
          <FlaskConical size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
              {lab.name}
            </h3>
            <VerificationBadge status={lab.verification} />
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            {lab.homeCollection && (
              <span className="inline-flex items-center gap-1 font-semibold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200/50">
                <Home size={12} className="text-primary-700" /> Home Sample Pickup
              </span>
            )}
          </div>
          <div className="mt-2">
            <Rating rating={lab.rating} reviewCount={lab.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3.5 text-xs">
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-1">
            <MapPin size={12} className="text-neutral-400" /> Location
          </p>
          <p className="font-semibold text-neutral-900 truncate" title={lab.location}>{lab.location}</p>
        </div>
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5">Distance</p>
          <p className="font-semibold text-neutral-900">{lab.distance} km away</p>
        </div>
        <div className="col-span-2 pt-1 flex items-center justify-between">
          <PriceDisplay price={lab.startingPrice} label="Tests starting from" size="sm" />
          <span className="text-xs font-semibold text-primary-700 group-hover:translate-x-0.5 transition-transform">
            View Tests →
          </span>
        </div>
      </div>
    </Link>
  );
}
