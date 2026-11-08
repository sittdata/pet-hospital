export type PetType = 'cat' | 'dog' | 'exotic' | 'small';

export interface PetCategoryInfo {
  id: PetType;
  name: string;
  enName: string;
  icon: string;
  badge: string;
  headline: string;
  description: string;
  specialCareTitle: string;
  specialCarePoints: string[];
  commonConditions: string[];
}

export interface TreatmentItem {
  id: string;
  petType: PetType;
  title: string;
  category: string;
  description: string;
  symptoms: string[];
  treatmentApproach: string;
  durationEstimate: string;
  isEmergencyRelevant?: boolean;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  degrees: string[];
  specialty: string;
  category: 'all' | 'surgery' | 'cat' | 'exotic' | 'internal' | 'cardio';
  experienceYears: number;
  availableDays: string[];
  bio: string;
  avatarUrl: string;
}

export interface HospitalService {
  id: string;
  title: string;
  enTitle: string;
  iconName: string;
  badge?: string;
  summary: string;
  features: string[];
  isEmergency?: boolean;
  imageUrl?: string;
}

export interface AppointmentFormData {
  petType: PetType;
  petName: string;
  petBreed?: string;
  petAge?: string;
  serviceCategory: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  isEmergencyCase: boolean;
  symptomsDescription: string;
  ownerName: string;
  ownerPhone: string;
  ownerLineId?: string;
}
