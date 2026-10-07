import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { AvailabilityBadge, PriceDisplay, BookingButton, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Truck, CheckCircle2, Wrench } from 'lucide-react';

export function EquipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = id ? dataService.equipment.getById(id) : undefined;

  if (!item) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Equipment" showBack />
        <EmptyState title="Equipment not found" description="This item may no longer be available" actionLabel="Back to Equipment" actionTo="/equipment" />
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      <AppHeader title={item.name} showBack />
      <div className="mx-auto max-w-4xl px-4 py-5 lg:px-8">
        {/* Header */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
              <Wrench size={32} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-800">{item.name}</h1>
              <p className="text-sm text-neutral-400">{item.category}</p>
              <p className="mt-1 text-sm text-neutral-400">Provider: {item.provider}</p>
              <div className="mt-2">
                <AvailabilityBadge status={item.availability} />
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-2 font-semibold text-neutral-800">About</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{item.about}</p>
        </section>

        {/* Pricing */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Rental Pricing</h2>
          <div className="grid grid-cols-3 gap-4 border-b border-neutral-50 pb-4 mb-4">
            <div>
              <p className="text-sm font-medium text-neutral-700">Per Day</p>
              <PriceDisplay price={item.rentalPriceDay} size="lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Per Week</p>
              <PriceDisplay price={item.rentalPriceWeek} size="lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Per Month</p>
              <PriceDisplay price={item.rentalPriceMonth} size="lg" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700">Security Deposit</p>
            <p className="text-lg font-bold text-neutral-800">₹{item.deposit.toLocaleString('en-IN')}</p>
          </div>
        </section>

        {/* Details */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Details</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <CheckCircle2 size={16} className="text-primary-500" />
              Condition: <span className="capitalize font-medium">{item.condition}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <CheckCircle2 size={16} className="text-primary-500" />
              Category: {item.category}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Truck size={16} className={item.delivery ? "text-primary-500" : "text-neutral-300"} />
              Delivery: {item.delivery ? 'Available' : 'Pickup only'}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-100 bg-white/95 p-4 backdrop-blur-md lg:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <div>
              <PriceDisplay price={item.rentalPriceDay} label="from" size="lg" period="day" />
              <p className="text-xs text-neutral-400">Deposit: ₹{item.deposit.toLocaleString('en-IN')}</p>
            </div>
            <BookingButton label="Rent Now" size="lg" onClick={() => navigate(`/equipment/${item.id}/book`)} />
          </div>
        </div>
      </div>
    </div>
  );
}
