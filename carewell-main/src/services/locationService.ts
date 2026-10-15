export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface UserLocation {
  city: string;
  district?: string;
  state?: string;
  country?: string;
  displayName: string;
  coordinates: LocationCoordinates;
  isGps: boolean;
  updatedAt: string;
}

export const POPULAR_LOCATIONS: { name: string; state: string; coords: LocationCoordinates }[] = [
  { name: 'Palakkad', state: 'Kerala', coords: { latitude: 10.7867, longitude: 76.6548 } },
  { name: 'Kochi', state: 'Kerala', coords: { latitude: 9.9312, longitude: 76.2673 } },
  { name: 'Thiruvananthapuram', state: 'Kerala', coords: { latitude: 8.5241, longitude: 76.9366 } },
  { name: 'Kozhikode', state: 'Kerala', coords: { latitude: 11.2588, longitude: 75.7804 } },
  { name: 'Thrissur', state: 'Kerala', coords: { latitude: 10.5276, longitude: 76.2144 } },
  { name: 'Coimbatore', state: 'Tamil Nadu', coords: { latitude: 11.0168, longitude: 76.9558 } },
  { name: 'Bengaluru', state: 'Karnataka', coords: { latitude: 12.9716, longitude: 77.5946 } },
  { name: 'Chennai', state: 'Tamil Nadu', coords: { latitude: 13.0827, longitude: 80.2707 } },
  { name: 'Mumbai', state: 'Maharashtra', coords: { latitude: 19.0760, longitude: 72.8777 } },
];

const STORAGE_KEY = 'carewell_user_location';
const DEFAULT_LOCATION: UserLocation = {
  city: 'Palakkad',
  state: 'Kerala',
  country: 'India',
  displayName: 'Palakkad, Kerala',
  coordinates: { latitude: 10.7867, longitude: 76.6548 },
  isGps: false,
  updatedAt: new Date().toISOString(),
};

type LocationListener = (location: UserLocation) => void;

class LocationService {
  private currentLocation: UserLocation;
  private listeners: Set<LocationListener> = new Set();

  constructor() {
    this.currentLocation = this.loadFromStorage();
  }

  private loadFromStorage(): UserLocation {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_LOCATION;
  }

  private saveToStorage(loc: UserLocation) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      // ignore
    }
  }

  public getLocation(): UserLocation {
    return this.currentLocation;
  }

  public setLocation(loc: Partial<UserLocation> & { displayName: string; coordinates: LocationCoordinates }): UserLocation {
    const updated: UserLocation = {
      city: loc.city || loc.displayName.split(',')[0].trim(),
      district: loc.district,
      state: loc.state,
      country: loc.country || 'India',
      displayName: loc.displayName,
      coordinates: loc.coordinates,
      isGps: loc.isGps ?? false,
      updatedAt: new Date().toISOString(),
    };

    this.currentLocation = updated;
    this.saveToStorage(updated);
    this.notifyListeners();
    return updated;
  }

  public subscribe(listener: LocationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentLocation);
      } catch (err) {
        console.error('Error notifying location listener:', err);
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carewell:location_changed', { detail: this.currentLocation }));
    }
  }

  /**
   * Request actual browser GPS coordinates and perform reverse geocoding via OpenStreetMap.
   */
  public async requestGpsLocation(): Promise<UserLocation> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
    });

    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          address.county ||
          'Current Location';
        const state = address.state || '';
        const displayName = state ? `${city}, ${state}` : city;

        return this.setLocation({
          city,
          district: address.state_district || address.county,
          state,
          country: address.country || 'India',
          displayName,
          coordinates: { latitude, longitude },
          isGps: true,
        });
      }
    } catch {
      // fallback
    }

    return this.setLocation({
      city: 'Detected GPS Location',
      displayName: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
      coordinates: { latitude, longitude },
      isGps: true,
    });
  }

  /**
   * Forward geocode search via OpenStreetMap Nominatim.
   */
  public async searchPlaces(query: string): Promise<{ name: string; state: string; coords: LocationCoordinates }[]> {
    if (!query || query.trim().length < 2) return [];

    const q = query.trim().toLowerCase();

    const localMatches = POPULAR_LOCATIONS.filter(
      (l) => l.name.toLowerCase().includes(q) || l.state.toLowerCase().includes(q)
    );

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        const apiPlaces = results.map((item: any) => ({
          name: item.name || item.display_name.split(',')[0],
          state: item.address?.state || item.address?.country || '',
          coords: {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          },
        }));

        const seen = new Set<string>();
        const combined = [...localMatches, ...apiPlaces].filter((item) => {
          const key = `${item.name}-${item.state}`.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        return combined;
      }
    } catch {
      // fallback
    }

    return localMatches;
  }

  /**
   * Calculate distance using Haversine formula (km)
   */
  public calculateDistanceTo(target: LocationCoordinates): number {
    const from = this.currentLocation.coordinates;
    const to = target;

    const R = 6371; // Earth radius in km
    const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
    const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.latitude * Math.PI) / 180) *
        Math.cos((to.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    return Math.round(dist * 10) / 10;
  }
}

export const locationService = new LocationService();
