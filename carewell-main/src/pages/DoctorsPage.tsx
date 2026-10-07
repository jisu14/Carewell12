import { useState, useMemo } from 'react';
import { AppHeader } from '@/components/layout';
import { DoctorCard, EmptyState, SearchBar } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Stethoscope, SlidersHorizontal, X } from 'lucide-react';
import type { Doctor } from '@/types';

export function DoctorsPage() {
  const allDoctors = dataService.doctors.getAll();
  const [query, setQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    minExperience: 0,
    maxFee: 0,
    language: '',
    specialty: '',
  });

  const systems = ['Allopathy', 'Ayurveda', 'Homeopathy'];

  const filteredDoctors = useMemo(() => {
    let result = allDoctors;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialty.toLowerCase().includes(q) ||
        d.languages.some(l => l.toLowerCase().includes(q))
      );
    }

    if (selectedSystem) {
      result = result.filter(d => d.systemOfMedicine.toLowerCase() === selectedSystem.toLowerCase());
    }

    if (filters.gender) {
      result = result.filter(d => d.gender === filters.gender);
    }
    if (filters.minExperience > 0) {
      result = result.filter(d => d.experience >= filters.minExperience);
    }
    if (filters.maxFee > 0) {
      result = result.filter(d => d.consultationFee <= filters.maxFee);
    }
    if (filters.language) {
      result = result.filter(d => d.languages.some(l => l.toLowerCase() === filters.language.toLowerCase()));
    }
    if (filters.specialty) {
      result = result.filter(d => d.specialty.toLowerCase() === filters.specialty.toLowerCase());
    }

    return result;
  }, [allDoctors, query, selectedSystem, filters]);

  const activeFilterCount = (filters.gender ? 1 : 0) + (filters.minExperience > 0 ? 1 : 0) + (filters.maxFee > 0 ? 1 : 0) + (filters.language ? 1 : 0) + (filters.specialty ? 1 : 0);

  return (
    <div className="pb-24 lg:pb-8 bg-neutral-50 min-h-screen">
      <AppHeader title="Find Doctors" showBack />
      
      {/* Systems of Medicine header */}
      <div className="sticky top-14 z-20 bg-white shadow-sm border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-3 lg:px-8">
          <SearchBar value={query} onChange={setQuery} placeholder="Search doctors, specialties, languages..." />
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedSystem(null)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedSystem === null ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Systems
            </button>
            {systems.map(sys => (
              <button
                key={sys}
                onClick={() => setSelectedSystem(sys)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedSystem === sys ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-500">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </p>
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        ) : (
          <EmptyState icon={<Stethoscope size={28} />} title="No doctors found" description="Try adjusting your filters or search term" />
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Filter Doctors</h2>
              <button onClick={() => setShowFilters(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-6">
              
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Specialty</h3>
                <div className="flex flex-wrap gap-2">
                  {['General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'].map(spec => (
                    <button
                      key={spec}
                      onClick={() => setFilters(f => ({ ...f, specialty: f.specialty === spec ? '' : spec }))}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        filters.specialty === spec ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Gender Preference</h3>
                <div className="flex gap-2">
                  {[
                    { label: 'Any', value: '' },
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' }
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters(f => ({ ...f, gender: opt.value }))}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.gender === opt.value ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Minimum Experience</h3>
                <div className="flex gap-2">
                  {[0, 5, 10, 15].map(exp => (
                    <button
                      key={exp}
                      onClick={() => setFilters(f => ({ ...f, minExperience: exp }))}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.minExperience === exp ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {exp === 0 ? 'Any' : `${exp}+ yrs`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Maximum Consultation Fee</h3>
                <div className="flex flex-wrap gap-2">
                  {[0, 400, 700, 1500].map(fee => (
                    <button
                      key={fee}
                      onClick={() => setFilters(f => ({ ...f, maxFee: fee }))}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.maxFee === fee ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {fee === 0 ? 'Any' : `Up to ₹${fee}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Hindi', 'Malayalam', 'Tamil'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setFilters(f => ({ ...f, language: f.language === lang ? '' : lang }))}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        filters.language === lang ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 flex gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setFilters({ gender: '', minExperience: 0, maxFee: 0, language: '', specialty: '' })}
                className="flex-1 rounded-xl py-3.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
