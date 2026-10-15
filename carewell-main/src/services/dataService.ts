import type {
  Provider, Doctor, Laboratory, Pharmacy, Equipment, Order,
  Notification, HealthRecord, Patient, User, Address, PaymentMethod,
  CareItem, ActiveService,
} from '@/types';
import {
  providers as initialProviders,
  doctors as initialDoctors,
  laboratories as initialLaboratories,
  pharmacies as initialPharmacies,
  equipment as initialEquipment,
  orders as initialOrders,
  notifications as initialNotifications,
  healthRecords as initialHealthRecords,
  patients as initialPatients,
  currentUser as initialUser,
  addresses as initialAddresses,
  paymentMethods as initialPaymentMethods,
  todaysCare as initialTodaysCare,
  activeServices as initialActiveServices,
  mockMedications as initialMedications,
} from '@/data/mockData';
import { locationService, type UserLocation } from './locationService';

// Storage Helper
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`carewell_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`carewell_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// In-Memory & LocalStorage State
let storedUser: User = getStorageItem('user', initialUser);
let storedPatients: Patient[] = getStorageItem('patients', initialPatients);
let storedOrders: Order[] = getStorageItem('orders', initialOrders);
let storedNotifications: Notification[] = getStorageItem('notifications', initialNotifications);
let storedMedications: any[] = getStorageItem('medications', initialMedications);
let storedHealthRecords: HealthRecord[] = getStorageItem('health_records', initialHealthRecords);
let storedTodaysCare: CareItem[] = getStorageItem('todays_care', initialTodaysCare);
let storedProviders: Provider[] = getStorageItem('providers', initialProviders);
let storedDoctors: Doctor[] = getStorageItem('doctors', initialDoctors);
let storedLaboratories: Laboratory[] = getStorageItem('laboratories', initialLaboratories);
let storedPharmacies: Pharmacy[] = getStorageItem('pharmacies', initialPharmacies);
let storedEquipment: Equipment[] = getStorageItem('equipment', initialEquipment);

// Listen to location changes and sync with user location
if (typeof window !== 'undefined') {
  locationService.subscribe((loc: UserLocation) => {
    storedUser = {
      ...storedUser,
      location: loc.displayName,
    };
    setStorageItem('user', storedUser);
  });
}

export const dataService = {
  user: {
    getCurrent: (): User => {
      const loc = locationService.getLocation();
      return {
        ...storedUser,
        location: loc.displayName || storedUser.location,
      };
    },
    update: (updates: Partial<User>): User => {
      storedUser = { ...storedUser, ...updates };
      setStorageItem('user', storedUser);
      return storedUser;
    },
    updateLocation: (newLocation: string): User => {
      storedUser = { ...storedUser, location: newLocation };
      setStorageItem('user', storedUser);
      return storedUser;
    },
  },

  patients: {
    getAll: (): Patient[] => storedPatients,
    getById: (id: string): Patient | undefined => storedPatients.find((p) => p.id === id),
    addPatient: (patient: Patient): Patient => {
      storedPatients = [patient, ...storedPatients];
      setStorageItem('patients', storedPatients);
      return patient;
    },
    updatePatient: (id: string, updates: Partial<Patient>): Patient | undefined => {
      const idx = storedPatients.findIndex((p) => p.id === id);
      if (idx === -1) return undefined;
      storedPatients[idx] = { ...storedPatients[idx], ...updates };
      setStorageItem('patients', storedPatients);
      return storedPatients[idx];
    },
  },

  providers: {
    getAll: (): Provider[] => storedProviders,
    getById: (id: string): Provider | undefined => storedProviders.find((p) => p.id === id),
  },

  doctors: {
    getAll: (): Doctor[] => storedDoctors,
    getById: (id: string): Doctor | undefined => storedDoctors.find((d) => d.id === id),
  },

  laboratories: {
    getAll: (): Laboratory[] => storedLaboratories,
    getById: (id: string): Laboratory | undefined => storedLaboratories.find((l) => l.id === id),
  },

  pharmacies: {
    getAll: (): Pharmacy[] => storedPharmacies,
    getById: (id: string): Pharmacy | undefined => storedPharmacies.find((p) => p.id === id),
  },

  equipment: {
    getAll: (): Equipment[] => storedEquipment,
    getById: (id: string): Equipment | undefined => storedEquipment.find((e) => e.id === id),
  },

  orders: {
    getAll: (): Order[] => storedOrders,
    getById: (id: string): Order | undefined => storedOrders.find((o) => o.id === id),
    addOrder: (order: Order): Order => {
      storedOrders = [order, ...storedOrders];
      setStorageItem('orders', storedOrders);

      // Also create a notification for the order
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: `Order Confirmed: ${order.title}`,
        message: `Your booking for ₹${order.amount} on ${order.date} has been confirmed. Coordinator assigned.`,
        date: 'Just now',
        read: false,
        type: 'order',
      };
      storedNotifications = [newNotif, ...storedNotifications];
      setStorageItem('notifications', storedNotifications);

      return order;
    },
    updateOrderStatus: (id: string, status: Order['status']): Order | undefined => {
      const order = storedOrders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        setStorageItem('orders', storedOrders);
      }
      return order;
    },
  },

  notifications: {
    getAll: (): Notification[] => storedNotifications,
    getUnreadCount: (): number => storedNotifications.filter((n) => !n.read).length,
    markAsRead: (id: string): void => {
      const notif = storedNotifications.find((n) => n.id === id);
      if (notif) {
        notif.read = true;
        setStorageItem('notifications', storedNotifications);
      }
    },
    markAllAsRead: (): void => {
      storedNotifications = storedNotifications.map((n) => ({ ...n, read: true }));
      setStorageItem('notifications', storedNotifications);
    },
  },

  medications: {
    getAll: () => storedMedications,
    addMedication: (med: any) => {
      storedMedications = [med, ...storedMedications];
      setStorageItem('medications', storedMedications);
      return med;
    },
    updateRemainingDays: (id: string, days: number) => {
      const med = storedMedications.find((m) => m.id === id);
      if (med) {
        med.remainingDays = days;
        setStorageItem('medications', storedMedications);
      }
      return med;
    },
  },

  healthRecords: {
    getAll: (): HealthRecord[] => storedHealthRecords,
    addRecord: (record: HealthRecord): HealthRecord => {
      storedHealthRecords = [record, ...storedHealthRecords];
      setStorageItem('health_records', storedHealthRecords);
      return record;
    },
  },

  care: {
    getTodaysCare: (): CareItem[] => storedTodaysCare,
    getActiveServices: (): ActiveService[] => initialActiveServices,
    addCareItem: (item: CareItem): CareItem => {
      storedTodaysCare = [item, ...storedTodaysCare];
      setStorageItem('todays_care', storedTodaysCare);
      return item;
    },
    updateCareItemStatus: (id: string, status: CareItem['status']): CareItem | undefined => {
      const item = storedTodaysCare.find((c) => c.id === id);
      if (item) {
        item.status = status;
        setStorageItem('todays_care', storedTodaysCare);
      }
      return item;
    },
  },

  addresses: {
    getAll: (): Address[] => initialAddresses,
  },

  paymentMethods: {
    getAll: (): PaymentMethod[] => initialPaymentMethods,
  },
};

