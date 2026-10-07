export type ID = string;

export type ServiceCategory =
  | 'nursing'
  | 'caregiver'
  | 'elder-care'
  | 'palliative-care'
  | 'physiotherapy'
  | 'post-operative'
  | 'rehabilitation'
  | 'dementia-care'
  | 'wound-care';

export type SystemOfMedicine = 'allopathy' | 'ayurveda' | 'homeopathy' | 'unani';

export type OrderStatus =
  | 'upcoming'
  | 'confirmed'
  | 'in-progress'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export type OrderType =
  | 'home-care'
  | 'doctor'
  | 'medicine'
  | 'lab'
  | 'equipment';

export interface User {
  id: ID;
  name: string;
  phone: string;
  email: string;
  location: string;
  avatar?: string;
}

export interface Patient {
  id: ID;
  name: string;
  relationship: 'self' | 'father' | 'mother' | 'spouse' | 'child' | 'other';
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  conditions?: string[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface Review {
  id: ID;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Provider {
  id: ID;
  name: string;
  type: 'home-care';
  verification: 'verified' | 'pending';
  rating: number;
  reviewCount: number;
  distance: number;
  location: string;
  services: string[];
  startingPrice: number;
  availability: AvailabilityStatus;
  providerType: 'agency' | 'individual';
  about: string;
  qualifications: string[];
  serviceArea: string;
  reviews: Review[];
  image?: string;
}

export interface Doctor {
  id: ID;
  name: string;
  specialty: string;
  systemOfMedicine: SystemOfMedicine;
  experience: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  gender: 'male' | 'female';
  languages: string[];
  verification: 'verified' | 'pending';
  nextSlot: string;
  location: string;
  about: string;
  qualifications: string[];
  reviews: Review[];
  photo?: string;
}

export interface LabTest {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  preparation?: string;
  homeCollection?: boolean;
}

export interface Laboratory {
  id: ID;
  name: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  verification: 'verified' | 'pending';
  homeCollection: boolean;
  tests: LabTest[];
  startingPrice: number;
  about: string;
  timings: string;
  reviews: Review[];
}

export interface Pharmacy {
  id: ID;
  name: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  delivery: boolean;
  deliveryTime: string;
  isOpen: boolean;
  about: string;
  timings: string;
}

export interface Equipment {
  id: ID;
  name: string;
  category: string;
  rentalPriceDay: number;
  rentalPriceWeek: number;
  rentalPriceMonth: number;
  deposit: number;
  provider: string;
  availability: AvailabilityStatus;
  condition: 'new' | 'excellent' | 'good';
  delivery: boolean;
  about: string;
  image?: string;
}

export interface Booking {
  id: ID;
  type: OrderType;
  providerName: string;
  patientName: string;
  date: string;
  time: string;
  status: OrderStatus;
  amount: number;
}

export interface Order {
  id: ID;
  type: OrderType;
  title: string;
  status: OrderStatus;
  amount: number;
  date: string;
  details: string;
}

export interface Notification {
  id: ID;
  category: 'appointments' | 'orders' | 'medicines' | 'care' | 'lab-reports' | 'payments' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface HealthRecord {
  id: ID;
  type: 'prescription' | 'lab-report' | 'consultation' | 'document' | 'medication' | 'diagnosis' | 'vaccination' | 'other';
  title: string;
  date: string;
  doctor?: string;
  patientName: string;
  details: string;
  medicines?: PrescribedMedicine[];
  followUp?: string;
  attachments?: string[];
  status?: 'pending' | 'completed' | 'processing';
}

export interface CareItem {
  id: ID;
  type: 'visit' | 'medicine' | 'appointment' | 'lab';
  title: string;
  time: string;
  patientName: string;
  status: OrderStatus;
  details: string;
}

export interface ActiveService {
  id: ID;
  type: 'home-care' | 'physiotherapy' | 'equipment';
  title: string;
  patientName: string;
  startDate: string;
  status: OrderStatus;
  details: string;
}

export interface Address {
  id: ID;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: ID;
  type: 'card' | 'upi' | 'cash';
  label: string;
  details: string;
  isDefault: boolean;
}
