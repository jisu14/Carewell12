import { Link } from 'react-router-dom';
import { MapPin, Clock, Truck, Pill } from 'lucide-react';
import { Rating } from './Rating';

interface PharmacyCardProps {
  pharmacy: import('@/types').Pharmacy;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  return (
    <Link
      to="/pharmacies"
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/40 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold transition-transform group-hover:scale-105">
          <Pill size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
              {pharmacy.name}
            </h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {pharmacy.isOpen ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Open Now
              </span>
            ) : (
              <span className="font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">Closed</span>
            )}
            {pharmacy.delivery && (
              <span className="inline-flex items-center gap-1 font-medium text-neutral-600 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-200/60">
                <Truck size={12} className="text-neutral-500" />
                {pharmacy.deliveryTime}
              </span>
            )}
          </div>
          <div className="mt-2">
            <Rating rating={pharmacy.rating} reviewCount={pharmacy.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3.5 text-xs">
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-1">
            <MapPin size={12} className="text-neutral-400" /> Location
          </p>
          <p className="font-semibold text-neutral-900 truncate" title={pharmacy.location}>{pharmacy.location}</p>
        </div>
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-1">
            <Clock size={12} className="text-neutral-400" /> Proximity
          </p>
          <p className="font-semibold text-neutral-900">{pharmacy.distance} km away</p>
        </div>
      </div>
    </Link>
  );
}
