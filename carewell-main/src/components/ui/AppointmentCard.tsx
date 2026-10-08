import { Calendar, Clock, User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { CareItem } from '@/types';

interface AppointmentCardProps {
  item: CareItem;
}

export function AppointmentCard({ item }: AppointmentCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-bold text-neutral-900">{item.title}</h4>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
            <User size={13} className="text-neutral-400" />
            <span className="font-medium text-neutral-700">{item.patientName}</span>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3.5 flex items-center gap-3 border-t border-neutral-100 pt-3 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-neutral-700">
          <Clock size={13} className="text-primary-700" />
          <span>{item.time}</span>
        </div>
        <span className="text-neutral-300">•</span>
        <span className="text-neutral-500 truncate">{item.details}</span>
      </div>
    </div>
  );
}
