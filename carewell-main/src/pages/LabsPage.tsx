import { AppHeader } from '@/components/layout';
import { LabCard, FilterPanel, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { FlaskConical } from 'lucide-react';

export function LabsPage() {
  const labs = dataService.laboratories.getAll();

  const filterGroups = [
    {
      name: 'Test Category',
      options: [
        { label: 'Blood tests', value: 'blood' },
        { label: 'Urine tests', value: 'urine' },
        { label: 'Imaging', value: 'imaging' },
        { label: 'ECG', value: 'ecg' },
        { label: 'Health packages', value: 'packages' },
      ],
    },
    {
      name: 'Distance',
      options: [
        { label: 'Within 2 km', value: '2' },
        { label: 'Within 5 km', value: '5' },
        { label: 'Within 10 km', value: '10' },
      ],
    },
    {
      name: 'Home Collection',
      options: [
        { label: 'Yes', value: 'yes' },
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

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Diagnostic Labs" showBack />
      <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-neutral-400">{labs.length} labs near you</p>
          <FilterPanel groups={filterGroups} />
        </div>
        {labs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((l) => <LabCard key={l.id} lab={l} />)}
          </div>
        ) : (
          <EmptyState icon={<FlaskConical size={28} />} title="No labs found" description="Try adjusting your filters" />
        )}
      </div>
    </div>
  );
}
