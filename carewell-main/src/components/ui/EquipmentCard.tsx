import { Link } from 'react-router-dom';
import { Package, ShieldCheck } from 'lucide-react';
import { Rating } from './Rating';
import { VerificationBadge } from './VerificationBadge';
import { AvailabilityBadge } from './AvailabilityBadge';
import { PriceDisplay } from './PriceDisplay';
import type { Equipment } from '@/types';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Link
      to={`/equipment/${equipment.id}`}
      className="block rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-400 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <Package size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-800">{equipment.name}</h3>
            <VerificationBadge status={equipment.providerVerification} />
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">By {equipment.provider}</p>
          <div className="mt-1">
            <Rating rating={equipment.rating} reviewCount={equipment.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-4 mb-4 flex flex-wrap gap-2 text-xs">
        {equipment.deliveryAvailable && (
          <span className="inline-flex items-center font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            Delivery available
          </span>
        )}
        {equipment.installationIncluded && (
          <span className="inline-flex items-center gap-1 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            <ShieldCheck size={12}/> Installation included
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4 mt-4">
        <div className="flex flex-col justify-center">
          <AvailabilityBadge status={equipment.availability} />
        </div>
        <div className="text-right">
           <PriceDisplay price={equipment.pricePerDay} label="Rental" size="sm" period="day" />
        </div>
      </div>
    </Link>
  );
}
