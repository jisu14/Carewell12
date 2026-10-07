import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, X, Sparkles, Home, Stethoscope, FlaskConical, Pill, Wrench, Search, Mic } from 'lucide-react';
import { SearchFilters } from '@/components/ui';
import { recentSearches, popularSearches } from '@/data/mockData';
import { searchService, type SearchFilters as FilterType, type SearchCategoryResult } from '@/services/searchService';
import { ProviderCard, DoctorCard, EquipmentCard, LabCard, PharmacyCard } from '@/components/ui';

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [results, setResults] = useState<SearchCategoryResult[] | null>(null);

  const categorySuggestions = [
    { icon: <Home size={18} />, label: 'Home Care', path: '/home-care' },
    { icon: <Stethoscope size={18} />, label: 'Doctors', path: '/doctors' },
    { icon: <FlaskConical size={18} />, label: 'Lab Tests', path: '/labs' },
    { icon: <Pill size={18} />, label: 'Medicines', path: '/pharmacies' },
    { icon: <Wrench size={18} />, label: 'Equipment', path: '/equipment' },
  ];

  // The architecture allows this to be swapped with an async AI call later
  useEffect(() => {
    if (query.trim() !== '' || Object.keys(filters).length > 0) {
      // Synchronous mock search. Later: await searchService.search(...)
      const res = searchService.search(query, filters);
      setResults(res);
    } else {
      setResults(null);
    }
  }, [query, filters]);

  const handleClear = () => {
    setQuery('');
    setFilters({});
  };

  const renderResultItem = (category: string, item: any) => {
    switch (category) {
      case 'Home Care':
        return <ProviderCard key={item.id} provider={item} />;
      case 'Doctors':
        return <DoctorCard key={item.id} doctor={item} />;
      case 'Equipment':
        return <EquipmentCard key={item.id} item={item} />;
      case 'Labs':
        return <LabCard key={item.id} lab={item} />;
      case 'Pharmacies':
        return <PharmacyCard key={item.id} pharmacy={item} />;
      default:
        return null;
    }
  };

  const hasResults = results && results.length > 0;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-8">
      <div className="sticky top-0 z-20 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-neutral-600 transition-colors hover:bg-neutral-100">
            <ArrowLeft size={22} />
          </button>
          
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3 text-neutral-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for care, doctors, equipment..."
              className="w-full rounded-2xl bg-neutral-100 py-3 pl-10 pr-20 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-10 p-1.5 text-neutral-400 hover:text-neutral-600">
                <X size={16} />
              </button>
            )}
            <button className="absolute right-2 p-2 text-primary-500 hover:text-primary-600 transition-colors">
              <Mic size={18} />
            </button>
          </div>
          
          <SearchFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8">
        {/* Heera AI Entry - Placed above content as requested */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 transition-all hover:shadow-card cursor-pointer">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white">
            <Sparkles size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-accent-800 truncate">Ask Heera (AI Search)</p>
            <p className="text-xs text-accent-700 truncate">Try natural language search — coming soon</p>
          </div>
        </div>

        {!results ? (
          <>
            {/* Initial State: Categories, Recent, Popular */}
            <section className="mb-8">
              <h3 className="mb-3 text-sm font-bold text-neutral-800">Browse Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categorySuggestions.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => navigate(cat.path)}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 shadow-sm transition-all hover:border-primary-200 hover:text-primary-600"
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>

            {recentSearches.length > 0 && (
              <section className="mb-8">
                <h3 className="mb-3 text-sm font-bold text-neutral-800">Recent Searches</h3>
                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 ${i !== recentSearches.length - 1 ? 'border-b border-neutral-50' : ''}`}
                    >
                      <Clock size={18} className="text-neutral-400 shrink-0" />
                      <span className="flex-1 text-sm font-medium text-neutral-700">{term}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-6">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-neutral-800">
                <TrendingUp size={18} className="text-primary-500" />
                Popular right now
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-primary-600"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Search Results State */}
            {hasResults ? (
              <div className="space-y-8">
                {results.map((categoryGroup) => (
                  <section key={categoryGroup.category}>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-neutral-800">{categoryGroup.category}</h2>
                      <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                        {categoryGroup.items.length} result{categoryGroup.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryGroup.items.map(item => renderResultItem(categoryGroup.category, item))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center shadow-sm">
                <div className="mb-4 rounded-full bg-neutral-50 p-4 text-neutral-400">
                  <Search size={32} />
                </div>
                <h3 className="mb-1 text-lg font-bold text-neutral-800">No results found</h3>
                <p className="text-sm text-neutral-500 max-w-[250px]">
                  We couldn't find anything matching your search criteria.
                </p>
                <button 
                  onClick={handleClear}
                  className="mt-6 rounded-xl bg-primary-50 px-6 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                >
                  Clear search & filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
