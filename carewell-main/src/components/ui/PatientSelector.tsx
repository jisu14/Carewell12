import { ChevronDown, Check, UserCheck, Heart } from 'lucide-react';
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
        className="group flex items-center gap-2.5 rounded-2xl bg-white/90 hover:bg-white px-3.5 py-2 transition-all border border-neutral-200/80 shadow-2xs hover:border-emerald-500/40 hover:shadow-xs active:scale-98"
        aria-label="Switch active family profile"
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white text-[11px] font-extrabold shadow-2xs">
          {selected?.name.charAt(0) ?? 'P'}
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 leading-none">
            {label}
          </span>
          <span className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
            {selected?.name ?? 'Select patient'}
          </span>
        </div>
        <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200/60 transition-colors">
          <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180 text-emerald-700' : ''}`} />
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-2xl border border-neutral-200/90 bg-white/95 backdrop-blur-xl p-2 shadow-xl shadow-neutral-900/10 animate-scale-in">
            <div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 mb-1">
              <span>Family Profiles</span>
              <span className="text-emerald-700 font-semibold">{patients.length} Registered</span>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
              {patients.map((p) => {
                const isCurrent = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelect(p.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-950 font-bold border border-emerald-200/60 shadow-2xs'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-xl text-[11px] font-extrabold ${
                        isCurrent 
                          ? 'bg-gradient-to-tr from-emerald-700 to-teal-600 text-white shadow-2xs' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {p.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-neutral-900 text-xs">{p.name}</p>
                        <p className="text-[10px] text-neutral-600 capitalize">
                          {p.relationship} • {p.age} yrs • {p.bloodGroup || 'Blood Group N/A'}
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

