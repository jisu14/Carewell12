import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriceDisplay } from './PriceDisplay';
import type { Order } from '@/types';

const typeIcons: Record<string, string> = {
  'home-care': 'Home',
  doctor: 'Stethoscope',
  medicine: 'Pill',
  lab: 'FlaskConical',
  equipment: 'Wrench',
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block rounded-2xl border border-neutral-100 bg-white p-4 shadow-card transition-all hover:border-primary-200 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-neutral-800">{order.title}</h4>
          <p className="mt-0.5 truncate text-xs text-neutral-400">{order.details}</p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-neutral-300" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-neutral-50 pt-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <span className="text-xs text-neutral-400">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <PriceDisplay price={order.amount} size="sm" />
      </div>
    </Link>
  );
}
