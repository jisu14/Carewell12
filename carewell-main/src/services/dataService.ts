import type {
  Provider, Doctor, Laboratory, Pharmacy, Equipment, Order,
  Notification, HealthRecord, Patient, User, Address, PaymentMethod,
  CareItem, ActiveService,
} from '@/types';
import {
  providers, doctors, laboratories, pharmacies, equipment, orders,
  notifications, healthRecords, patients, currentUser, addresses,
  paymentMethods, todaysCare, activeServices, mockMedications,
} from '@/data/mockData';

export const dataService = {
  user: {
    getCurrent: (): User => currentUser,
  },

  patients: {
    getAll: (): Patient[] => patients,
    getById: (id: string): Patient | undefined => patients.find((p) => p.id === id),
  },

  providers: {
    getAll: (): Provider[] => providers,
    getById: (id: string): Provider | undefined => providers.find((p) => p.id === id),
  },

  doctors: {
    getAll: (): Doctor[] => doctors,
    getById: (id: string): Doctor | undefined => doctors.find((d) => d.id === id),
  },

  laboratories: {
    getAll: (): Laboratory[] => laboratories,
    getById: (id: string): Laboratory | undefined => laboratories.find((l) => l.id === id),
  },

  pharmacies: {
    getAll: (): Pharmacy[] => pharmacies,
    getById: (id: string): Pharmacy | undefined => pharmacies.find((p) => p.id === id),
  },

  equipment: {
    getAll: (): Equipment[] => equipment,
    getById: (id: string): Equipment | undefined => equipment.find((e) => e.id === id),
  },

  orders: {
    getAll: (): Order[] => orders,
    getById: (id: string): Order | undefined => orders.find((o) => o.id === id),
    addOrder: (order: Order) => {
      orders.unshift(order);
    },
  },

  notifications: {
    getAll: (): Notification[] => notifications,
    getUnreadCount: (): number => notifications.filter((n) => !n.read).length,
  },

  medications: {
    getAll: () => mockMedications,
    addMedication: (med: any) => {
      mockMedications.unshift(med);
    }
  },

  healthRecords: {
    getAll: (): HealthRecord[] => healthRecords,
    addRecord: (record: HealthRecord) => {
      healthRecords.unshift(record);
    },
  },

  care: {
    getTodaysCare: (): CareItem[] => todaysCare,
    getActiveServices: (): ActiveService[] => activeServices,
  },

  addresses: {
    getAll: (): Address[] => addresses,
  },

  paymentMethods: {
    getAll: (): PaymentMethod[] => paymentMethods,
  },
};
