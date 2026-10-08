import { ChevronDown, Check, User } from 'lucide-react';
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
        className="group flex items-center gap-2 rounded-xl bg-neutral-100/80 hover:bg-neutral-100 px-3 py-1.5 transition-colors border border-neutral-200/60"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold">
          {selected?.name.charAt(0) ?? 'P'}
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-600">
          <span className="text-neutral-400 font-normal hidden sm:inline">{label}:</span>
          <span className="font-semibold text-neutral-900">{selected?.name ?? 'Select patient'}</span>
        </div>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-2xl border border-neutral-200/80 bg-white p-1.5 shadow-xl animate-scale-in">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
              Select Family Member
            </div>
            {patients.map((p) => {
              const isCurrent = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs transition-colors ${
                    isCurrent ? 'bg-primary-50 text-primary-900 font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-neutral-900">{p.name}</p>
                      <p className="text-[10px] text-neutral-400 capitalize">{p.relationship} • {p.age} yrs</p>
                    </div>
                  </div>
                  {isCurrent && <Check size={14} className="text-primary-700" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
