import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { SearchFilters as FilterType } from '@/services/searchService';

interface SearchFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = ['home-care', 'doctors', 'equipment', 'labs', 'pharmacies'];
  const availabilities = ['available', 'limited'];

  const handleUpdate = (key: keyof FilterType, value: any) => {
    onChange({ ...filters, [key]: value === filters[key] ? undefined : value });
  };

  const activeCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Filters</h2>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-6">
              {/* Category */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleUpdate('category', cat)}
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${
                        filters.category === cat ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-700">Verified Providers Only</h3>
                <button 
                  onClick={() => handleUpdate('verifiedOnly', true)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filters.verifiedOnly ? 'bg-primary-600' : 'bg-neutral-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.verifiedOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Rating */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleUpdate('minRating', rating)}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.minRating === rating ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {rating}+ Stars
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">Maximum Price (₹)</h3>
                <div className="flex gap-2">
                  {[500, 1000, 2000].map(price => (
                    <button
                      key={price}
                      onClick={() => handleUpdate('maxPrice', price)}
                      className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                        filters.maxPrice === price ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      Up to {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 flex gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { onChange({}); setIsOpen(false); }}
                className="flex-1 rounded-xl py-3.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
