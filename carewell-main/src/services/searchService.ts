import { dataService } from './dataService';
import type { Provider, Doctor, Equipment, Laboratory, Pharmacy } from '@/types';

export interface SearchFilters {
  distance?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: string; // 'available', 'limited'
  category?: string;
  verifiedOnly?: boolean;
}

export interface SearchCategoryResult {
  category: string;
  items: any[];
}

export const searchService = {
  search: (query: string, filters?: SearchFilters): SearchCategoryResult[] => {
    const q = query.toLowerCase().trim();
    const results: SearchCategoryResult[] = [];

    // Helper to check text match
    const matches = (text: string) => text.toLowerCase().includes(q);

    // 1. Home Care
    if (!filters?.category || filters.category === 'home-care') {
      let providers = dataService.providers.getAll().filter(p => 
        !q || matches(p.name) || p.services.some(matches) || matches(p.about)
      );
      if (filters?.verifiedOnly) providers = providers.filter(p => p.verification === 'verified');
      if (filters?.minRating) providers = providers.filter(p => p.rating >= filters.minRating!);
      if (filters?.maxPrice) providers = providers.filter(p => p.startingPrice <= filters.maxPrice!);
      if (filters?.availability) providers = providers.filter(p => p.availability === filters.availability);
      
      if (providers.length > 0) {
        results.push({ category: 'Home Care', items: providers });
      }
    }

    // 2. Doctors
    if (!filters?.category || filters.category === 'doctors') {
      let doctors = dataService.doctors.getAll().filter(d => 
        !q || matches(d.name) || matches(d.specialty) || matches(d.about) || matches(d.systemOfMedicine)
      );
      if (filters?.verifiedOnly) doctors = doctors.filter(d => d.verification === 'verified');
      if (filters?.minRating) doctors = doctors.filter(d => d.rating >= filters.minRating!);
      if (filters?.maxPrice) doctors = doctors.filter(d => d.consultationFee <= filters.maxPrice!);
      
      if (doctors.length > 0) {
        results.push({ category: 'Doctors', items: doctors });
      }
    }

    // 3. Equipment
    if (!filters?.category || filters.category === 'equipment') {
      let equipment = dataService.equipment.getAll().filter(e => 
        !q || matches(e.name) || matches(e.category) || matches(e.about)
      );
      if (filters?.maxPrice) equipment = equipment.filter(e => e.rentalPriceDay <= filters.maxPrice!);
      if (filters?.availability) equipment = equipment.filter(e => e.availability === filters.availability);
      
      if (equipment.length > 0) {
        results.push({ category: 'Equipment', items: equipment });
      }
    }

    // 4. Labs
    if (!filters?.category || filters.category === 'labs') {
      let labs = dataService.laboratories.getAll().filter(l => 
        !q || matches(l.name) || matches(l.about) || l.tests.some(t => matches(t.name) || matches(t.category))
      );
      if (filters?.verifiedOnly) labs = labs.filter(l => l.verification === 'verified');
      if (filters?.minRating) labs = labs.filter(l => l.rating >= filters.minRating!);
      
      if (labs.length > 0) {
        results.push({ category: 'Labs', items: labs });
      }
    }

    // 5. Pharmacies
    if (!filters?.category || filters.category === 'pharmacies') {
      let pharmacies = dataService.pharmacies.getAll().filter(p => 
        !q || matches(p.name) || matches(p.about)
      );
      if (filters?.minRating) pharmacies = pharmacies.filter(p => p.rating >= filters.minRating!);
      if (filters?.availability === 'available') pharmacies = pharmacies.filter(p => p.isOpen);
      
      if (pharmacies.length > 0) {
        results.push({ category: 'Pharmacies', items: pharmacies });
      }
    }

    return results;
  }
};
