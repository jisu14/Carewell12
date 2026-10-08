interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
  upcoming: { color: 'bg-blue-50 text-blue-800 border-blue-200/60', dot: 'bg-blue-600', label: 'Upcoming' },
  confirmed: { color: 'bg-emerald-50 text-emerald-800 border-emerald-200/60', dot: 'bg-emerald-600', label: 'Confirmed' },
  'in-progress': { color: 'bg-amber-50 text-amber-800 border-amber-200/60', dot: 'bg-amber-600 animate-pulse', label: 'In Progress' },
  delivered: { color: 'bg-emerald-50 text-emerald-800 border-emerald-200/60', dot: 'bg-emerald-600', label: 'Delivered' },
  completed: { color: 'bg-neutral-100 text-neutral-700 border-neutral-200/70', dot: 'bg-neutral-500', label: 'Completed' },
  cancelled: { color: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500', label: 'Cancelled' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const c = statusConfig[status] ?? { color: 'bg-neutral-100 text-neutral-600 border-neutral-200', dot: 'bg-neutral-400', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
