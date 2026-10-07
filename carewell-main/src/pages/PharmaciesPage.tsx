import { AppHeader } from '@/components/layout';
import { PharmacyCard, FilterPanel, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Pill, FileText, ShoppingCart, CreditCard } from 'lucide-react';

export function PharmaciesPage() {
  const pharmacies = dataService.pharmacies.getAll();

  const filterGroups = [
    {
      name: 'Delivery',
      options: [
        { label: 'Home delivery', value: 'delivery' },
        { label: 'Open now', value: 'open' },
      ],
    },
    {
      name: 'Distance',
      options: [
        { label: 'Within 1 km', value: '1' },
        { label: 'Within 3 km', value: '3' },
        { label: 'Within 5 km', value: '5' },
      ],
    },
    {
      name: 'Rating',
      options: [
        { label: '4.5+', value: '4.5' },
        { label: '4.0+', value: '4.0' },
      ],
    },
  ];

  const steps = [
    { icon: <FileText size={20} />, label: 'Prescription' },
    { icon: <ShoppingCart size={20} />, label: 'Medicine Cart' },
    { icon: <Pill size={20} />, label: 'Pharmacy' },
    { icon: <CreditCard size={20} />, label: 'Checkout' },
  ];

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Pharmacy" showBack />
      <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
        {/* Order flow placeholder */}
        <div className="mb-5 rounded-2xl border border-dashed border-neutral-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-neutral-700">How it works</p>
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  {step.icon}
                </div>
                <span className="text-[10px] font-medium text-neutral-500">{step.label}</span>
                {i < steps.length - 1 && <div className="hidden">→</div>}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-neutral-300">Medicine ordering will be available soon</p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">{pharmacies.length} pharmacies near you</p>
          <FilterPanel groups={filterGroups} />
        </div>
        {pharmacies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((p) => <PharmacyCard key={p.id} pharmacy={p} />)}
          </div>
        ) : (
          <EmptyState icon={<Pill size={28} />} title="No pharmacies found" description="Try adjusting your filters" />
        )}
      </div>
    </div>
  );
}
