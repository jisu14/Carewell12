interface AvailabilityBadgeProps {
  status: 'available' | 'limited' | 'unavailable';
  label?: string;
}

const config = {
  available: { color: 'bg-success-50 text-success-700', dot: 'bg-success-500', text: 'Available' },
  limited: { color: 'bg-warning-50 text-warning-700', dot: 'bg-warning-500', text: 'Limited slots' },
  unavailable: { color: 'bg-neutral-100 text-neutral-500', dot: 'bg-neutral-400', text: 'Unavailable' },
};

export function AvailabilityBadge({ status, label }: AvailabilityBadgeProps) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {label ?? c.text}
    </span>
  );
}
