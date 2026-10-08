import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { Rating } from './Rating';
import { VerificationBadge } from './VerificationBadge';
import { AvailabilityBadge } from './AvailabilityBadge';
import { PriceDisplay } from './PriceDisplay';
import type { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Link
      to={`/home-care/provider/${provider.id}`}
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/40 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 border border-rose-200/60 font-bold transition-transform group-hover:scale-105">
          <Heart size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
              {provider.name}
            </h3>
            <VerificationBadge status={provider.verification} />
          </div>
          <p className="text-xs text-neutral-600 mt-0.5 capitalize font-medium">
            {provider.providerType}
          </p>
          <div className="mt-1.5">
            <Rating rating={provider.rating} reviewCount={provider.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-3.5 mb-3.5 flex flex-wrap gap-1.5">
        {provider.services.slice(0, 3).map((service) => (
          <span key={service} className="rounded-lg border border-neutral-200/70 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
            {service}
          </span>
        ))}
        {provider.services.length > 3 && (
          <span className="rounded-lg border border-neutral-200/70 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
            +{provider.services.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3.5 text-xs">
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-1">
            <MapPin size={12} className="text-neutral-400" /> Service Area
          </p>
          <p className="font-semibold text-neutral-900 truncate" title={provider.location}>{provider.location}</p>
        </div>
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100 flex flex-col justify-center">
          <AvailabilityBadge status={provider.availability} />
        </div>
        <div className="col-span-2 pt-1 flex items-center justify-between">
          <PriceDisplay price={provider.startingPrice} label="Starting price" size="sm" period="day" />
          <span className="text-xs font-semibold text-primary-700 group-hover:translate-x-0.5 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
