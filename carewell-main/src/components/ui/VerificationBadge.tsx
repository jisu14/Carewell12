import { BadgeCheck, Clock } from 'lucide-react';

interface VerificationBadgeProps {
  status: 'verified' | 'pending';
  size?: 'sm' | 'md';
}

export function VerificationBadge({ status, size = 'sm' }: VerificationBadgeProps) {
  if (status === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium text-primary-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <BadgeCheck size={size === 'sm' ? 14 : 16} className="text-primary-500" />
        Verified
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 font-medium text-neutral-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <Clock size={size === 'sm' ? 14 : 16} />
      Pending
    </span>
  );
}
