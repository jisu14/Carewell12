import { AppHeader } from '@/components/layout';
import { EquipmentCard, FilterPanel, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Wrench } from 'lucide-react';

export function EquipmentPage() {
  const items = dataService.equipment.getAll();

  const filterGroups = [
    {
      name: 'Category',
      options: [
        { label: 'Hospital beds', value: 'beds' },
        { label: 'Wheelchairs', value: 'wheelchair' },
        { label: 'Walkers', value: 'walker' },
        { label: 'Oxygen equipment', value: 'oxygen' },
        { label: 'Nebulizers', value: 'nebulizer' },
        { label: 'CPAP/BiPAP', value: 'cpap' },
        { label: 'Patient monitors', value: 'monitor' },
        { label: 'Commode chairs', value: 'commode' },
        { label: 'Suction machines', value: 'suction' },
      ],
    },
    {
      name: 'Price',
      options: [
        { label: 'Under ₹100/day', value: 'under-100' },
        { label: '₹100–500/day', value: '100-500' },
        { label: 'Above ₹500/day', value: 'above-500' },
      ],
    },
    {
      name: 'Availability',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Limited', value: 'limited' },
      ],
    },
  ];

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Medical Equipment" showBack />
      <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">{items.length} items available for rent</p>
          <FilterPanel groups={filterGroups} />
        </div>
        {items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => <EquipmentCard key={e.id} item={e} />)}
          </div>
        ) : (
          <EmptyState icon={<Wrench size={28} />} title="No equipment found" description="Try adjusting your filters" />
        )}
      </div>
    </div>
  );
}
