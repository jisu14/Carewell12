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
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/40 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 border border-primary-200/60 font-bold transition-transform group-hover:scale-105">
          <Stethoscope size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
              {doctor.name}
            </h3>
            <VerificationBadge status={doctor.verification} />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-700">{doctor.specialty}</span>
            <span className="text-neutral-300">•</span>
            <span className="capitalize text-neutral-500">{doctor.systemOfMedicine}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Rating rating={doctor.rating} reviewCount={doctor.reviewCount} />
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {doctor.experienceYears}y exp
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3.5 text-xs">
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-1">
            <Clock size={12} className="text-neutral-400" /> Next Available
          </p>
          <p className="font-semibold text-neutral-900 truncate">{doctor.nextSlot}</p>
        </div>
        <div className="rounded-xl bg-neutral-50/80 p-2 border border-neutral-100">
          <p className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-1">
            <MapPin size={12} className="text-neutral-400" /> Location
          </p>
          <p className="font-semibold text-neutral-900 truncate" title={doctor.location}>{doctor.location}</p>
        </div>
        <div className="col-span-2 pt-1 flex items-center justify-between">
          <PriceDisplay price={doctor.consultationFee} label="Consultation fee" size="sm" />
          <span className="text-xs font-semibold text-primary-700 group-hover:translate-x-0.5 transition-transform">
            Book Visit →
          </span>
        </div>
      </div>
    </Link>
  );
}
