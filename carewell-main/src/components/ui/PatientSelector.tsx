import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Patient } from '@/types';

interface PatientSelectorProps {
  patients: Patient[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
}

export function PatientSelector({ patients, selectedId, onSelect, label = 'Care for' }: PatientSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = patients.find((p) => p.id === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-neutral-600"
      >
        <span className="text-neutral-400">{label}:</span>
        <span className="font-semibold text-primary-600">{selected?.name ?? 'Select'}</span>
        <ChevronDown size={16} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-1.5 shadow-float animate-scale-in">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-50 ${p.id === selectedId ? 'font-semibold text-primary-600' : 'text-neutral-700'}`}
              >
                <span className="capitalize text-xs text-neutral-400">{p.relationship}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
