interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  upcoming: { color: 'bg-secondary-50 text-secondary-700', label: 'Upcoming' },
  confirmed: { color: 'bg-secondary-50 text-secondary-700', label: 'Confirmed' },
  'in-progress': { color: 'bg-warning-50 text-warning-700', label: 'In Progress' },
  delivered: { color: 'bg-success-50 text-success-700', label: 'Delivered' },
  completed: { color: 'bg-success-50 text-success-700', label: 'Completed' },
  cancelled: { color: 'bg-error-50 text-error-700', label: 'Cancelled' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const c = statusConfig[status] ?? { color: 'bg-neutral-100 text-neutral-600', label: status };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}
