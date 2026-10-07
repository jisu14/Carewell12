import { useState, useMemo } from 'react';
import { AppHeader } from '@/components/layout';
import { ProviderCard, EmptyState, SearchBar } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Home, SlidersHorizontal, Check, X } from 'lucide-react';
import type { Provider } from '@/types';

export function HomeCarePage() {
  const allProviders = dataService.providers.getAll();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    minRating: 0,
    maxPrice: 0,
    availability: '',
  });

  const categories = [
    'Nursing', 'Caregiver', 'Elder Care', 'Palliative Care', 'Physiotherapy',
    'Post-operative Care', 'Dementia Care', 'Wound Care', 'Rehabilitation', 'Attendant Services'
  ];

  const filteredProviders = useMemo(() => {
    let result = allProviders;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.services.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter(p => 
        p.services.some(s => s.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (filters.verifiedOnly) {
      result = result.filter(p => p.verification === 'verified');
    }
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }
    if (filters.maxPrice > 0) {
      result = result.filter(p => p.startingPrice <= filters.maxPrice);
    }
    if (filters.availability) {
      result = result.filter(p => p.availability === filters.availability);
    }

    return result;
  }, [allProviders, query, selectedCategory, filters]);

  const activeFilterCount = (filters.verifiedOnly ? 1 : 0) + (filters.minRating > 0 ? 1 : 0) + (filters.maxPrice > 0 ? 1 : 0) + (filters.availability ? 1 : 0);

  return (
    <div className="pb-24 lg:pb-8 bg-neutral-50 min-h-screen">
      <AppHeader title="Home Care Providers" showBack />
      
      {/* Categories header */}
      <div className="sticky top-14 z-20 bg-white shadow-sm border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-3 lg:px-8">
          <SearchBar value={query} onChange={setQuery} placeholder="Search providers or services..." />
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === null ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-500">
            {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
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

        {filteredProviders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        ) : (
          <EmptyState icon={<Home size={28} />} title="No providers found" description="Try adjusting your filters or search term" />
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Filter Providers</h2>
              <button onClick={() => setShowFilters(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-700">Verified Only</h3>
                <button 
                  onClick={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filters.verifiedOnly ? 'bg-primary-600' : 'bg-neutral-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.verifiedOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[0, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters(f => ({ ...f, minRating: rating }))}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.minRating === rating ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Maximum Price (₹)</h3>
                <div className="flex flex-wrap gap-2">
                  {[0, 400, 600, 1000].map(price => (
                    <button
                      key={price}
                      onClick={() => setFilters(f => ({ ...f, maxPrice: price }))}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.maxPrice === price ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {price === 0 ? 'Any' : `Up to ${price}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Availability</h3>
                <div className="flex gap-2">
                  {[
                    { label: 'Any', value: '' },
                    { label: 'Available', value: 'available' },
                    { label: 'Limited', value: 'limited' }
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters(f => ({ ...f, availability: opt.value }))}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.availability === opt.value ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 flex gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setFilters({ verifiedOnly: false, minRating: 0, maxPrice: 0, availability: '' })}
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
