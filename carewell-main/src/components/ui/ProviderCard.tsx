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
      className="block rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-400 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <Heart size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-800">{provider.name}</h3>
            <VerificationBadge status={provider.verification} />
          </div>
          <p className="text-sm text-neutral-600 mt-0.5 capitalize">
            {provider.providerType}
          </p>
          <div className="mt-1">
            <Rating rating={provider.rating} reviewCount={provider.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-4 mb-4 flex flex-wrap gap-1.5">
        {provider.services.slice(0, 3).map((service) => (
          <span key={service} className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
            {service}
          </span>
        ))}
        {provider.services.length > 3 && (
          <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            +{provider.services.length - 3} more
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
        <div>
          <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1.5"><MapPin size={14}/> Service Area</p>
          <p className="text-sm font-semibold text-neutral-800 truncate" title={provider.location}>{provider.location}</p>
        </div>
        <div className="flex flex-col items-start justify-center">
          <AvailabilityBadge status={provider.availability} />
        </div>
        <div className="col-span-2">
           <PriceDisplay price={provider.startingPrice} label="Starting price" size="sm" period="day" />
        </div>
      </div>
    </Link>
  );
}
