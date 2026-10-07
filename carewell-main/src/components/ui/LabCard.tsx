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
      className="block rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-400 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <FlaskConical size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-800">{lab.name}</h3>
            <VerificationBadge status={lab.verification} />
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            {lab.homeCollection && (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <Home size={12} /> Home Collection
              </span>
            )}
          </div>
          <div className="mt-2">
            <Rating rating={lab.rating} reviewCount={lab.reviewCount} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4 mt-4">
        <div>
          <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1.5"><MapPin size={14}/> Location</p>
          <p className="text-sm font-semibold text-neutral-800 truncate" title={lab.location}>{lab.location}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1">Distance</p>
          <p className="text-sm font-semibold text-neutral-800">{lab.distance} km</p>
        </div>
        <div className="col-span-2">
           <PriceDisplay price={lab.startingPrice} label="Tests starting from" size="sm" />
        </div>
      </div>
    </Link>
  );
}
