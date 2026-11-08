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
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    vaccines: [
      {
        id: 'vac-1',
        name: 'วัคซีนรวมไข้หัด-หวัดแมว (FVRCP Core Vaccine)',
        dateAdministered: '2025-10-15',
        dueDate: '2026-10-15',
        status: 'upcoming',
        veterinarian: 'สพ.ญ. ดร. นลิน พิพิธกุล',
        lotNumber: 'FVRCP-25B09',
        notes: 'ฉีดเข็มกระตุ้นประจำปี สภาพร่างกายแข็งแรงดี ไม่มีไข้',
      },
      {
        id: 'vac-2',
        name: 'วัคซีนป้องกันโรคพิษสุนัขบ้า (Rabies Vaccine)',
        dateAdministered: '2025-11-02',
        dueDate: '2026-11-02',
        status: 'completed',
        veterinarian: 'น.สพ. ปิยะวัฒน์ เจริญสุข',
        lotNumber: 'RAB-TH982',
        notes: 'ฉีดเข้าใต้ผิวหนัง ไม่พบอาการแพ้หลังดูอาการ 15 นาที',
      },
      {
        id: 'vac-3',
        name: 'วัคซีนลิวคีเมียในแมว (FeLV Vaccine)',
        dateAdministered: '2024-08-10',
        dueDate: '2025-08-10',
        status: 'overdue',
        veterinarian: 'สพ.ญ. ธนพร เกียรติไพบูลย์',
        lotNumber: 'FELV-841A',
        notes: 'เกินกำหนดฉีดกระตุ้น แนะนำตรวจเลือดและรับการฉีดโดยเร็ว',
      },
      {
        id: 'vac-4',
        name: 'หยอดยาป้องกันพยาธิหนอนหัวใจและเห็บหมัด (Revolution Plus)',
        dateAdministered: '2026-03-01',
        dueDate: '2026-04-01',
        status: 'upcoming',
        veterinarian: 'น.สพ. อัครเดช เมธากุล',
        lotNumber: 'REV-2026-01',
        notes: 'หยอดประจำเดือน ป้องกันไรหูและหมัด',
      },
    ],
    treatments: [
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
  {
    id: 'pet-2',
    name: 'น้องเฉาก๊วย (Chao-Kuay)',
    petType: 'dog',
    breed: 'โกลเด้น รีทรีฟเวอร์ (Golden Retriever)',
    gender: 'male',
    age: '3 ปี 8 เดือน',
    weight: '31.5 kg',
    microchipNo: '900182003819284',
    ownerName: 'คุณศิษฐิวัชร์',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    vaccines: [
      {
        id: 'vac-d1',
        name: 'วัคซีนรวม 5 โรคในสุนัข (DHPPi+L Core 5-in-1)',
        dateAdministered: '2025-09-10',
        dueDate: '2026-09-10',
        status: 'completed',
        veterinarian: 'น.สพ. ภาณุพงศ์ ศักดิ์เจริญ',
        lotNumber: 'DHPP-99401',
        notes: 'ฉีดวัคซีนรวมป้องกันไข้หัด ตับอักเสบ ลำไส้อักเสบ พาร์โว และเลปโตสไปโรซิส',
      },
      {
        id: 'vac-d2',
        name: 'วัคซีนโรคพิษสุนัขบ้าประจำปี (Rabies Booster)',
        dateAdministered: '2025-09-10',
        dueDate: '2026-09-10',
        status: 'completed',
        veterinarian: 'น.สพ. ภาณุพงศ์ ศักดิ์เจริญ',
        lotNumber: 'RAB-DG331',
        notes: 'ร่างกายสมบูรณ์ดี กล้ามเนื้อแน่น',
      },
      {
        id: 'vac-d3',
        name: 'ยากินป้องกันเห็บหมัดและพยาธิหนอนหัวใจ (NexGard Spectra)',
        dateAdministered: '2026-02-15',
        dueDate: '2026-03-15',
        status: 'overdue',
        veterinarian: 'สพ.ญ. รัตนาพร มงคลชัย',
        lotNumber: 'NXG-30KG',
        notes: 'ถึงกำหนดรับประทานเม็ดถัดไป แนะนำรับยาต่อเนื่อง',
      },
    ],
    treatments: [
      {
        id: 'treat-d1',
        date: '2025-11-28',
        diagnosis: 'ข้อสะโพกอักเสบเล็กน้อยจากการวิ่งเล่น (Mild Hip Dysplasia Screen)',
        veterinarian: 'น.สพ. ภาณุพงศ์ ศักดิ์เจริญ',
        clinicDepartment: 'ศูนย์ศัลยกรรมและผ่าตัดกระดูก/ข้อ',
        treatment: 'X-Ray ดิจิทัลกระดูกเชิงกราน, กายภาพบำบัดด้วยเลเซอร์ Class IV',
        notes: 'งดวิ่งกระโดดบนพื้นลื่น 2 สัปดาห์ เสริม Glucosamine & Chondroitin',
      },
    ],
  },
  {
    id: 'pet-3',
    name: 'น้องชิกโก้ (Chiko)',
    petType: 'bird',
    breed: 'นกแก้วซันคอนัวร์ (Sun Conure)',
    gender: 'male',
    age: '1 ปี 2 เดือน',
    weight: '125 g',
    microchipNo: 'LEG-RING-TH8829',
    ownerName: 'คุณศิษฐิวัชร์',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    vaccines: [
      {
        id: 'vac-b1',
        name: 'ตรวจสุขภาพและหยอดยาถ่ายพยาธิภายนอก/ภายใน',
        dateAdministered: '2025-12-05',
        dueDate: '2026-06-05',
        status: 'completed',
        veterinarian: 'สพ.ญ. อริศรา ธรรมรัตน์ (Exotic Specialist)',
        lotNumber: 'EXO-AV-01',
        notes: 'ขนนกสวยสมบูรณ์ จงอยปากแข็งแรง มูลปกติ',
      },
    ],
    treatments: [
      {
        id: 'treat-b1',
        date: '2025-12-05',
        diagnosis: 'ตรวจคัดกรองโรคปากและขนนก (PBFD & APV Screening)',
        veterinarian: 'สพ.ญ. อริศรา ธรรมรัตน์',
        clinicDepartment: 'ศูนย์สัตว์พิเศษ Exotic Pets 24 ชม.',
        treatment: 'เก็บตัวอย่างเลือดส่ง PCR Test',
        notes: 'ผลตรวจเป็นลบ (Negative) ทั้ง 2 โรค สุขภาพแข็งแรงดีเยี่ยม',
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'vetpaws_pet_passports_v1';

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
