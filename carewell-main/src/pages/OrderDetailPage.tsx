import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { StatusBadge, PriceDisplay, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Calendar, Clock, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrderDetailPage() {
  const { id } = useParams();
  const order = id ? dataService.orders.getById(id) : undefined;

  if (!order) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Order" showBack />
        <EmptyState title="Order not found" description="This order may have been removed" actionLabel="Back to Orders" actionTo="/orders" />
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title={`Order #${order.id.toUpperCase()}`} showBack />
      <div className="mx-auto max-w-3xl px-4 py-5 lg:px-8">
        {/* Status */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Order Status</p>
              <div className="mt-1.5"><StatusBadge status={order.status} /></div>
            </div>
            <PriceDisplay price={order.amount} size="lg" />
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Order Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <FileText size={18} className="text-neutral-400" />
              <span className="text-neutral-500">Type:</span>
              <span className="font-medium text-neutral-700 capitalize">{order.type.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={18} className="text-neutral-400" />
              <span className="text-neutral-500">Date:</span>
              <span className="font-medium text-neutral-700">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Clock size={18} className="mt-0.5 text-neutral-400" />
              <span className="text-neutral-500">Details:</span>
              <span className="font-medium text-neutral-700">{order.details}</span>
            </div>
          </div>
        </div>

        {/* Timeline placeholder */}
        <div className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Order Timeline</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-success-500" />
              <span className="text-sm text-neutral-600">Order placed — {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
            {order.status !== 'cancelled' && (
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-secondary-500" />
                <span className="text-sm text-neutral-600">Confirmed</span>
              </div>
            )}
            {(order.status === 'in-progress' || order.status === 'delivered' || order.status === 'completed') && (
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-warning-500" />
                <span className="text-sm text-neutral-600">In progress</span>
              </div>
            )}
            {(order.status === 'delivered' || order.status === 'completed') && (
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-success-500" />
                <span className="text-sm text-neutral-600 capitalize">{order.status}</span>
              </div>
            )}
            {order.status === 'cancelled' && (
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-error-500" />
                <span className="text-sm text-neutral-600">Cancelled</span>
              </div>
            )}
          </div>
        </div>

        {/* Related links */}
        <div className="mt-5">
          <Link
            to="/orders"
            className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-card transition-all hover:border-primary-200"
          >
            <span className="text-sm font-medium text-neutral-600">Back to all orders</span>
            <ChevronRight size={18} className="text-neutral-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
