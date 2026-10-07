import { Calendar, Clock, User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { CareItem } from '@/types';

interface AppointmentCardProps {
  item: CareItem;
}

export function AppointmentCard({ item }: AppointmentCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-neutral-800">{item.title}</h4>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-400">
            <User size={13} />
            <span>{item.patientName}</span>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-neutral-50 pt-3">
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <Clock size={13} className="text-primary-500" />
          <span>{item.time}</span>
        </div>
        <span className="text-xs text-neutral-300">•</span>
        <span className="text-xs text-neutral-400">{item.details}</span>
      </div>
    </div>
  );
}
