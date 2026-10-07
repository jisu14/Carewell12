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
      className="block rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-400 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <Pill size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-800">{pharmacy.name}</h3>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            {pharmacy.isOpen ? (
              <span className="font-semibold text-emerald-700">Open now</span>
            ) : (
              <span className="font-semibold text-neutral-500">Closed</span>
            )}
            <span className="text-neutral-300">•</span>
            {pharmacy.delivery && (
              <span className="font-medium text-neutral-600">
                Delivery: {pharmacy.deliveryTime}
              </span>
            )}
          </div>
          <div className="mt-2">
            <Rating rating={pharmacy.rating} reviewCount={pharmacy.reviewCount} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4 mt-4">
        <div>
          <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1.5"><MapPin size={14}/> Location</p>
          <p className="text-sm font-semibold text-neutral-800 truncate" title={pharmacy.location}>{pharmacy.location}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1">Distance</p>
          <p className="text-sm font-semibold text-neutral-800">{pharmacy.distance} km</p>
        </div>
      </div>
    </Link>
  );
}
