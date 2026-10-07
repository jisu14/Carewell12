import { Link } from 'react-router-dom';
import { MapPin, Clock, Stethoscope } from 'lucide-react';
import { Rating } from './Rating';
import { VerificationBadge } from './VerificationBadge';
import { PriceDisplay } from './PriceDisplay';
import type { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="block rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-400 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <Stethoscope size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-800">{doctor.name}</h3>
            <VerificationBadge status={doctor.verification} />
          </div>
          <p className="text-sm text-neutral-600 mt-0.5">
            {doctor.specialty} • <span className="text-neutral-500 capitalize">{doctor.systemOfMedicine}</span>
          </p>
          <div className="mt-1">
            <Rating rating={doctor.rating} reviewCount={doctor.reviewCount} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
        <div>
          <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1.5"><Clock size={14}/> Next Slot</p>
          <p className="text-sm font-semibold text-neutral-800">{doctor.nextSlot}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1 flex items-center gap-1.5"><MapPin size={14}/> Location</p>
          <p className="text-sm font-semibold text-neutral-800 truncate">{doctor.location}</p>
        </div>
        <div className="col-span-2">
           <PriceDisplay price={doctor.consultationFee} label="Consultation fee" size="sm" />
        </div>
      </div>
    </Link>
  );
}
