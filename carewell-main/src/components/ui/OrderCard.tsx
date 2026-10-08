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
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/40 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">{order.title}</h4>
          <p className="mt-1 truncate text-xs text-neutral-500">{order.details}</p>
        </div>
        <ChevronRight size={17} className="shrink-0 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <span className="text-neutral-400 font-medium">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <PriceDisplay price={order.amount} size="sm" />
      </div>
    </Link>
  );
}
