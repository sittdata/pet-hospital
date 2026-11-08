import { PetPassport } from '../types/petPassport';

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

const LOCAL_STORAGE_KEY = 'vetpaws_pet_passports_v4';

export function getStoredPassports(): PetPassport[] {
  if (typeof window === 'undefined') return INITIAL_PET_PASSPORTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PET_PASSPORTS));
      return INITIAL_PET_PASSPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PET_PASSPORTS;
  } catch (err) {
    console.error('Failed to parse pet passports from localStorage', err);
    return INITIAL_PET_PASSPORTS;
  }
}

export function saveStoredPassports(passports: PetPassport[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(passports));
  } catch (err) {
    console.error('Failed to save pet passports to localStorage', err);
  }
}

export function resetStoredPassports(): PetPassport[] {
  if (typeof window === 'undefined') return INITIAL_PET_PASSPORTS;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PET_PASSPORTS));
    return INITIAL_PET_PASSPORTS;
  } catch (err) {
    console.error('Failed to reset pet passports in localStorage', err);
    return INITIAL_PET_PASSPORTS;
  }
}
