import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Check, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { locationService, POPULAR_LOCATIONS, type UserLocation } from '@/services/locationService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (loc: UserLocation) => void;
}

export function LocationModal({ isOpen, onClose, onSelect }: LocationModalProps) {
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(locationService.getLocation());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; state: string; coords: { latitude: number; longitude: number } }[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentLocation(locationService.getLocation());
      setErrorMsg(null);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = locationService.subscribe((loc) => {
      setCurrentLocation(loc);
    });
    return unsub;
  }, []);

  // Handle GPS detection
  const handleDetectGps = async () => {
    setIsDetecting(true);
    setErrorMsg(null);

    try {
      const loc = await locationService.requestGpsLocation();
      setCurrentLocation(loc);
      if (onSelect) onSelect(loc);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.warn('GPS error:', err);
      if (err.code === 1) {
        setErrorMsg('Location permission was denied. Please allow location access in your browser settings or select a city below.');
      } else if (err.code === 2) {
        setErrorMsg('GPS position unavailable. Please pick a city from the list below.');
      } else if (err.code === 3) {
        setErrorMsg('GPS request timed out. Please select your city manually.');
      } else {
        setErrorMsg(err.message || 'Unable to retrieve location. Please choose a city below.');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  // Search input change
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    setErrorMsg(null);
    if (val.trim().length >= 2) {
      const results = await locationService.searchPlaces(val);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Select city
  const handleSelectCity = (city: { name: string; state: string; coords: { latitude: number; longitude: number } }) => {
    const updated = locationService.setLocation({
      city: city.name,
      state: city.state,
      displayName: `${city.name}, ${city.state}`,
      coordinates: city.coords,
      isGps: false,
    });
    setCurrentLocation(updated);
    if (onSelect) onSelect(updated);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-950 tracking-tight font-display">
                Select Your Healthcare Location
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Calculates real distances to doctors, labs & home nurses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Location Card */}
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white p-4 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Active Medical Zone
              </span>
            </div>
            {currentLocation.isGps && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200/60">
                <Navigation size={9} /> GPS Verified
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base font-extrabold text-neutral-950 mt-1">
            {currentLocation.displayName}
          </p>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            Coordinates: {currentLocation.coordinates.latitude.toFixed(4)}°N, {currentLocation.coordinates.longitude.toFixed(4)}°E
          </p>
        </div>

        {/* GPS Button */}
        <div className="mt-4">
          <button
            onClick={handleDetectGps}
            disabled={isDetecting}
            className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-850 active:bg-neutral-900 text-white py-3 px-4 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-99 disabled:opacity-60"
          >
            {isDetecting ? (
              <>
                <Loader2 size={16} className="animate-spin text-emerald-400" />
                <span>Acquiring GPS Satellite Pinpoint...</span>
              </>
            ) : (
              <>
                <Navigation size={16} className="text-emerald-400 group-hover:rotate-45 transition-transform" />
                <span>Use My Exact GPS Location</span>
              </>
            )}
          </button>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200/80">
            <AlertCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="mt-4">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search any town, hospital area, or city..."
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Search Autocomplete Results */}
        {searchResults.length > 0 ? (
          <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto no-scrollbar rounded-2xl border border-neutral-100 bg-neutral-50/50 p-2">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Matching Places
            </span>
            {searchResults.map((city) => (
              <button
                key={`${city.name}-${city.state}`}
                onClick={() => handleSelectCity(city)}
                className="flex w-full items-center justify-between rounded-xl p-2.5 text-xs text-left font-medium text-neutral-800 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-700" />
                  <span className="font-bold text-neutral-950">{city.name}</span>
                  <span className="text-[11px] text-neutral-400">{city.state}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700">Select →</span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Popular Cities in Kerala & South India */}
        <div className="mt-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Popular Kerala & Healthcare Hubs
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = currentLocation.city.toLowerCase() === loc.name.toLowerCase();
              return (
                <button
                  key={loc.name}
                  onClick={() => handleSelectCity(loc)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-700 border border-neutral-200/60'
                  }`}
                >
                  <MapPin size={12} className={isSelected ? 'text-emerald-100' : 'text-neutral-500'} />
                  <span>{loc.name}</span>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Real-time GPS calculation enabled</span>
          <button
            onClick={onClose}
            className="font-bold text-neutral-700 hover:text-neutral-950"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
