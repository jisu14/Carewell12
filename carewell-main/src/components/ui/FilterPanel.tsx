import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  name: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  groups: FilterGroup[];
  onApply?: (selected: Record<string, string>) => void;
}

export function FilterPanel({ groups, onApply }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleApply = () => {
    onApply?.(selected);
    setOpen(false);
  };

  const handleReset = () => {
    setSelected({});
    onApply?.({});
    setOpen(false);
  };

  const activeCount = Object.values(selected).filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-200"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Filters">
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.name}>
              <p className="mb-2 text-sm font-semibold text-neutral-700">{group.name}</p>
              <div className="flex flex-wrap gap-2">
                {group.options.map((opt) => {
                  const isSelected = selected[group.name] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelected((prev) => ({ ...prev, [group.name]: isSelected ? '' : opt.value }))}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${isSelected ? 'border-primary-500 bg-primary-50 font-medium text-primary-700' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Apply Filters
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
