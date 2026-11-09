import { PetPassport, TreatmentRecord, PassportPetType } from '../types/petPassport';
import { AppointmentFormData } from '../types';

export const INITIAL_PET_PASSPORTS: PetPassport[] = [
  {
    id: 'pet-1',
    name: 'น้องโมจิ (Moji)',
    petType: 'cat',
    breed: 'บริติช ช็อตแฮร์ (British Shorthair)',
    gender: 'female',
    age: '2 ปี 3 เดือน',
    weight: '4.2 kg',
    microchipNo: '900182001928371',
    ownerName: 'คุณศิษฐิวัชร์',
    avatarUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&auto=format&fit=crop&q=80',
    vaccines: [
      {
        id: 'vac-1',
        name: 'วัคซีนรวมไข้หัด-หวัดแมว (FVRCP Core Vaccine)',
        dueDate: '2026-11-28',
        status: 'upcoming',
        veterinarian: 'สพ.ญ. ดร. นลิน พิพิธกุล',
        notes: 'เข็มกระตุ้นประจำปี (Annual Booster) เพื่อคงระดับภูมิคุ้มกันต่อเนื่อง',
      },
    ],
    treatments: [
      {
        id: 'treat-v1',
        date: '2025-11-15',
        diagnosis: 'ฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า (Rabies Vaccine)',
        veterinarian: 'น.สพ. ปิยะวัฒน์ เจริญสุข',
        clinicDepartment: 'ศูนย์อายุรกรรมและคลินิกแมวปลอดความเครียด',
        treatment: 'ฉีดเข้าใต้ผิวหนัง 1 โดส ไม่พบอาการแพ้หลังดูอาการ 15 นาที',
        notes: 'ได้รับวัคซีนเรียบร้อย สุขภาพแข็งแรงดี นัดกระตุ้นอีกครั้งปีถัดไป',
      },
      {
        id: 'treat-1',
        date: '2026-01-20',
        diagnosis: 'ตรวจเช็กสุขภาพประจำปีและตรวจค่าไต/ตับ (Annual Health Checkup)',
        veterinarian: 'สพ.ญ. ดร. นลิน พิพิธกุล',
        clinicDepartment: 'ศูนย์อายุรกรรมและคลินิกแมวปลอดความเครียด',
        treatment: 'เจาะเลือดตรวจ CBC & Blood Chemistry, วัดความดันโลหิต',
        notes: 'ผลเลือดปกติทั้งหมด ค่าไต Creatinine 1.2 mg/dL อยู่ในเกณฑ์ดี ดื่มน้ำเพียงพอ',
      },
      {
        id: 'treat-2',
        date: '2025-06-12',
        diagnosis: 'ขูดหินปูนและขัดฟันด้วยคลื่นอัลตราโซนิก (Ultrasonic Dental Scaling)',
        veterinarian: 'น.สพ. ปิยะวัฒน์ เจริญสุข',
        clinicDepartment: 'ศูนย์ทันตกรรมสัตว์เลี้ยง',
        treatment: 'วางยาสลบดมยา Isoflurane, ขูดหินปูน เคลือบฟลูออไรด์',
        notes: 'เหงือกอักเสบระดับ 1 ดีขึ้น ให้เจลทาฟันบำรุงเหงือก',
      },
    ],
  },
];

const LOCAL_STORAGE_KEY_BASE = 'vetpaws_pet_passports';

export function getScopedStorageKey(userEmail?: string): string {
  if (!userEmail || !userEmail.trim()) {
    return `${LOCAL_STORAGE_KEY_BASE}_guest`;
  }
  const sanitized = userEmail.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `${LOCAL_STORAGE_KEY_BASE}_user_${sanitized}`;
}

export function isDemoOrGuestUser(userEmail?: string): boolean {
  if (!userEmail || !userEmail.trim()) return true;
  const email = userEmail.trim().toLowerCase();
  return (
    email === 'demo@vetpaws.com' ||
    email === 'demo' ||
    email.startsWith('demo@') ||
    email.startsWith('demo.') ||
    email.startsWith('demo_')
  );
}

export function getStoredPassports(userEmail?: string): PetPassport[] {
  const isDemo = isDemoOrGuestUser(userEmail);
  if (typeof window === 'undefined') return isDemo ? INITIAL_PET_PASSPORTS : [];
  try {
    const key = getScopedStorageKey(userEmail);

    // Clean up obsolete legacy key if present so it never leaks mock data
    if (!isDemo && userEmail) {
      const sanitized = userEmail.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      const legacyV4Key = `vetpaws_pet_passports_v4_user_${sanitized}`;
      if (localStorage.getItem(legacyV4Key)) {
        localStorage.removeItem(legacyV4Key);
      }
    }

    const raw = localStorage.getItem(key);

    if (!raw) {
      // Real logged-in users start with an empty passport ledger
      if (!isDemo) {
        return [];
      }

      if (!userEmail) {
        const legacy =
          localStorage.getItem('vetpaws_pet_passports_v4') ||
          localStorage.getItem('vetpaws_pet_passports_v3');
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            localStorage.setItem(key, legacy);
            return parsedLegacy;
          }
        }
      }

      const initialData = INITIAL_PET_PASSPORTS.map((pet) => ({
        ...pet,
        ownerName: 'คุณศิษฐิวัชร์',
      }));
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (!isDemo) {
        // Strict guard: Purge any mock/sample pets (e.g. 'pet-1' / '900182001928371' / 'น้องโมจิ')
        // that were erroneously injected into this user's account in older builds
        const realPets = parsed.filter(
          (pet) =>
            pet.id !== 'pet-1' &&
            pet.microchipNo !== '900182001928371' &&
            !pet.name?.includes('โมจิ')
        );
        if (realPets.length !== parsed.length) {
          localStorage.setItem(key, JSON.stringify(realPets));
        }
        return realPets;
      }
      return parsed.length > 0 ? parsed : INITIAL_PET_PASSPORTS;
    }
    return isDemo ? INITIAL_PET_PASSPORTS : [];
  } catch (err) {
    console.error('Failed to parse pet passports from localStorage', err);
    return isDemo ? INITIAL_PET_PASSPORTS : [];
  }
}

export function saveStoredPassports(passports: PetPassport[], userEmail?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getScopedStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(passports));
  } catch (err) {
    console.error('Failed to save pet passports to localStorage', err);
  }
}

export function resetStoredPassports(userEmail?: string): PetPassport[] {
  const isDemo = isDemoOrGuestUser(userEmail);
  if (typeof window === 'undefined') return isDemo ? INITIAL_PET_PASSPORTS : [];
  try {
    const key = getScopedStorageKey(userEmail);
    if (!isDemo) {
      localStorage.setItem(key, JSON.stringify([]));
      return [];
    }
    const initialData = INITIAL_PET_PASSPORTS.map((pet) => ({
      ...pet,
      ownerName: 'คุณศิษฐิวัชร์',
    }));
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  } catch (err) {
    console.error('Failed to reset pet passports in localStorage', err);
    return isDemo ? INITIAL_PET_PASSPORTS : [];
  }
}

const DEFAULT_PET_AVATARS: Record<string, string> = {
  cat: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&auto=format&fit=crop&q=80',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=80',
  exotic: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&auto=format&fit=crop&q=80',
  small: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&auto=format&fit=crop&q=80',
  bird: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
  aquatic: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=300&auto=format&fit=crop&q=80',
};

export function createPassportFromAppointment(
  appointment: AppointmentFormData,
  userEmail: string
): PetPassport {
  const existing = getStoredPassports(userEmail);
  const microchipNo = `9001-PENDING-${Date.now().toString().slice(-6)}`;
  const mappedPetType = (appointment.petType as PassportPetType) || 'cat';

  const timeSlotLabel =
    appointment.preferredTimeSlot === 'morning'
      ? 'ช่วงเช้า (09:00 - 12:00 น.)'
      : appointment.preferredTimeSlot === 'afternoon'
        ? 'ช่วงบ่าย (13:00 - 17:00 น.)'
        : 'ช่วงเย็น (17:00 - 20:00 น.)';

  const initialTreatment: TreatmentRecord = {
    id: `treat-${Date.now()}`,
    date: appointment.preferredDate || new Date().toISOString().split('T')[0],
    diagnosis: 'ลงทะเบียนผู้ป่วยใหม่ (New Patient Registration)',
    veterinarian: 'รอยืนยันสัตวแพทย์เจ้าของไข้',
    clinicDepartment: appointment.serviceCategory || 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
    treatment: appointment.symptomsDescription?.trim()
      ? `บันทึกอาการเบื้องต้น: ${appointment.symptomsDescription.trim()}`
      : 'ลงทะเบียนผู้ป่วยใหม่และตรวจคัดกรองเบื้องต้น',
    notes: `นัดหมายตรวจล่วงหน้า (${timeSlotLabel})${appointment.symptomPhotos && appointment.symptomPhotos.length > 0 ? ` [แนบรูปอาการ ${appointment.symptomPhotos.length} รูป]` : ''}`,
  };

  const newPassport: PetPassport = {
    id: `pet-${Date.now()}`,
    name: appointment.petName.trim(),
    petType: mappedPetType,
    breed: appointment.petBreed?.trim() || 'ไม่ระบุสายพันธุ์',
    gender: 'female',
    age: appointment.petAge?.trim() || 'ไม่ระบุ',
    weight: 'รอชั่งน้ำหนักที่คลินิก',
    microchipNo,
    ownerName: appointment.ownerName?.trim() || (userEmail ? `คุณ${userEmail.split('@')[0]}` : 'เจ้าของสัตว์เลี้ยง'),
    avatarUrl: DEFAULT_PET_AVATARS[mappedPetType] || DEFAULT_PET_AVATARS.cat,
    vaccines: [],
    treatments: [initialTreatment],
  };

  const updated = [newPassport, ...existing];
  saveStoredPassports(updated, userEmail);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vetpaws:passports_updated'));
  }

  return newPassport;
}
