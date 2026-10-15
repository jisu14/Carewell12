import { Link } from 'react-router-dom';
import { Package, ShieldCheck, Truck } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import { PriceDisplay } from './PriceDisplay';
import type { Equipment } from '@/types';

interface EquipmentCardProps {
  equipment?: Equipment;
  item?: Equipment;
}

export function EquipmentCard({ equipment, item }: EquipmentCardProps) {
  const data = equipment || item;
  if (!data) return null;

  return (
    <Link
      to={`/equipment/${data.id}`}
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
          <Package size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors text-sm sm:text-base">
              {data.name}
            </h3>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 capitalize">
              {data.condition}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">Provided by {data.provider}</p>
        </div>
      </div>

      <div className="mt-4 mb-3 flex flex-wrap gap-2 text-xs">
        {data.delivery && (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
            <Truck size={12} /> Doorstep Delivery
          </span>
        )}
        <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 text-[11px]">
          <ShieldCheck size={12}/> Verified Sanitized
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3.5 mt-2 items-center">
        <div>
          <AvailabilityBadge status={data.availability} />
        </div>
        <div className="text-right">
          <PriceDisplay price={data.rentalPriceDay} label="Rental" size="sm" period="day" />
        </div>
      </div>
    </Link>
  );
}

