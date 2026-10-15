import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { CategoryCard } from '@/components/ui';
import { exploreCategories } from '@/data/mockData';
import {
  Stethoscope, HeartHandshake, Users, HeartPulse, Activity, BedDouble, 
  Dumbbell, Brain, Sparkles, Video, FlaskConical, Pill, Wrench, 
  Ambulance, Syringe, Package, Apple, Search, Compass, ShieldCheck
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope size={22} />,
  HeartHandshake: <HeartHandshake size={22} />,
  Users: <Users size={22} />,
  HeartPulse: <HeartPulse size={22} />,
  Activity: <Activity size={22} />,
  BedDouble: <BedDouble size={22} />,
  Dumbbell: <Dumbbell size={22} />,
  Brain: <Brain size={22} />,
  Bandage: <Activity size={22} />,
  Video: <Video size={22} />,
  FlaskConical: <FlaskConical size={22} />,
  Pill: <Pill size={22} />,
  Wrench: <Wrench size={22} />,
  Ambulance: <Ambulance size={22} />,
  Syringe: <Syringe size={22} />,
  Package: <Package size={22} />,
  BrainCircuit: <Brain size={22} />,
  Apple: <Apple size={22} />,
};

export function ExplorePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filterList = (items: { name: string; icon: string; path: string }[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredCareAtHome = useMemo(() => filterList(exploreCategories.careAtHome), [searchQuery]);
  const filteredMedical = useMemo(() => filterList(exploreCategories.medical), [searchQuery]);
  const filteredOther = useMemo(() => filterList(exploreCategories.other), [searchQuery]);

  return (
    <div className="min-h-screen pb-28 lg:pb-16 text-neutral-900">
      <AppHeader title="Healthcare Directory" subtitle="Explore accredited medical specializations and home care" showLogo showSearch={false} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Spotlight Search Header */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)]">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200/60 shadow-2xs">
              <Compass size={12} className="text-emerald-600" />
              Complete Health Network
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight font-display">
              Find Services, Doctors & Facilities
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Browse through certified clinical consultations, certified home healthcare attendants, and doorstep diagnostics.
            </p>
          </div>

          <div className="relative z-10 mt-5">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialties, procedures (e.g. Cardiology, Physiotherapy, Nursing)..."
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/80 py-3 pl-11 pr-4 text-xs sm:text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs font-semibold text-neutral-400 hover:text-neutral-700 bg-neutral-200/60 px-2 py-0.5 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Care at Home */}
        {filteredCareAtHome.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-1.5 rounded-full bg-emerald-600" />
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-neutral-950 tracking-tight font-display">
                    Home Healthcare & Nursing
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">Compassionate, vetted in-home medical care</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                {filteredCareAtHome.length} Services
              </span>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCareAtHome.map((cat) => (
                <CategoryCard key={cat.name} name={cat.name} icon={iconMap[cat.icon] || <Activity size={22} />} path={cat.path} />
              ))}
            </div>
          </section>
        )}

        {/* Medical Consultations & Labs */}
        {filteredMedical.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-1.5 rounded-full bg-blue-600" />
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-neutral-950 tracking-tight font-display">
                    Clinical Specialists & Diagnostics
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">Accredited clinics, telemedicine, and labs</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                {filteredMedical.length} Services
              </span>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedical.map((cat) => (
                <CategoryCard key={cat.name} name={cat.name} icon={iconMap[cat.icon] || <Activity size={22} />} path={cat.path} />
              ))}
            </div>
          </section>
        )}

        {/* Ancillary Healthcare */}
        {filteredOther.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-1.5 rounded-full bg-amber-600" />
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-neutral-950 tracking-tight font-display">
                    Specialized Healthcare & Packages
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">Emergency transport, vaccines, and wellness</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                {filteredOther.length} Services
              </span>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOther.map((cat) => (
                <CategoryCard key={cat.name} name={cat.name} icon={iconMap[cat.icon] || <Activity size={22} />} path={cat.path} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

