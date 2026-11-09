export type VaccineStatus = 'completed' | 'upcoming' | 'overdue' | 'scheduled';

export interface VaccineRecord {
  id: string;
  name: string;
  dateAdministered?: string;
  dueDate?: string;
  status: VaccineStatus;
  veterinarian?: string;
  lotNumber?: string;
  notes?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentBranch?: string;
  appointmentRefCode?: string;
}

export interface TreatmentRecord {
  id: string;
  date: string;
  diagnosis: string;
  veterinarian: string;
  clinicDepartment: string;
  treatment: string;
  notes?: string;
}

export type PassportPetType = 'cat' | 'dog' | 'exotic' | 'bird' | 'aquatic' | 'small';

export interface PetPassport {
  id: string;
  name: string;
  petType: PassportPetType;
  breed: string;
  gender: 'male' | 'female';
  age: string;
  weight: string;
  microchipNo: string;
  ownerName: string;
  avatarUrl?: string;
  vaccines: VaccineRecord[];
  treatments: TreatmentRecord[];
}
