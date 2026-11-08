import { DoctorProfile } from '../types';

export const doctorsData: DoctorProfile[] = [
  {
    id: 'dr-natthapong',
    name: 'น.สพ. ดร. ณัฐพงศ์ ศิริธรรมกุล',
    title: 'ผู้อำนวยการฝ่ายการแพทย์ และหัวหน้าศูนย์ศัลยกรรมกระดูกและข้อ',
    degrees: [
      'สัตวแพทยศาสตรบัณฑิต (เกียรตินิยมอันดับ 1) จุฬาลงกรณ์มหาวิทยาลัย',
      'ปริญญาเอก ด้านศัลยศาสตร์สัตวแพทย์ มหาวิทยาลัยคิตาซาโตะ ประเทศญี่ปุ่น',
      'ประกาศนียบัตรขั้นสูงด้านการผ่าตัด TPLO จาก AO VET Association'
    ],
    specialty: 'ศัลยกรรมกระดูก ข้อต่อ และระบบประสาทสัตว์เลี้ยง (Orthopedic & Neuro)',
    category: 'surgery',
    experienceYears: 16,
    availableDays: ['จันทร์', 'อังคาร', 'พฤหัสบดี', 'เสาร์'],
    bio: 'มีความเชี่ยวชาญระดับสูงในการผ่าตัดแก้ไขกระดูกหักซับซ้อน สะบ้าเคลื่อน และผ่าตัดหมอนรองกระดูกสันหลังทับเส้นประสาท ด้วยประสบการณ์การผ่าตัดกว่า 2,000 เคส',
    avatarUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dr-pimporn',
    name: 'สพ.ญ. พิมพ์พร เกษตรศิริ',
    title: 'หัวหน้าคลินิกเวชศาสตร์แมว (Cat Friendly Clinic Director)',
    degrees: [
      'สัตวแพทยศาสตรบัณฑิต มหาวิทยาลัยเกษตรศาสตร์',
      'วุฒิบัตรสมาชิกสมาคมแพทย์โรคแมวนานาชาติ (ISFM - International Society of Feline Medicine)',
      'Certificate in Feline Internal Medicine (Sydney Uni)'
    ],
    specialty: 'อายุรกรรมโรคแมว โรคไตเรื้อรัง และระบบทางเดินปัสสาวะ (Feline Medicine)',
    category: 'cat',
    experienceYears: 12,
    availableDays: ['พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    bio: 'มุ่งเน้นการตรวจรักษาแมวด้วยเทคนิค Gentle Touch & Low Stress Handling ให้ความสำคัญกับการวินิจฉัยโรคไตและทางเดินปัสสาวะในระยะแรกเริ่ม',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813626-d62f026a19f2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dr-varun',
    name: 'น.สพ. วรุณ วัฒนานุกูล',
    title: 'ผู้เชี่ยวชาญด้านเวชศาสตร์สัตว์พิเศษและสัตว์เลื้อยคลาน (Exotic Pets Specialist)',
    degrees: [
      'สัตวแพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล',
      'Master of Veterinary Science (Avian & Exotic Pet Health), Murdoch University, Australia',
      'สมาชิกชมรมสัตวแพทย์สัตว์ป่าและสัตว์เลี้ยงชนิดพิเศษ (TEPV)'
    ],
    specialty: 'ศัลยกรรมและอายุรกรรมสัตว์พิเศษ กระต่าย นก และสัตว์เลื้อยคลาน',
    category: 'exotic',
    experienceYears: 10,
    availableDays: ['อังคาร', 'พุธ', 'ศุกร์', 'อาทิตย์'],
    bio: 'ชำนาญการรักษาโรคระบบทางเดินอาหารในกระต่าย (GI Stasis) งานทันตกรรมสัตว์ฟันแทะ และการผ่าตัดจุลศัลยกรรมในสัตว์เลี้ยงขนาดเล็กมาก',
    avatarUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dr-sarisa',
    name: 'สพ.ญ. สาริศา บุญยเกียรติ',
    title: 'หัวหน้าศูนย์โรคหัวใจและหลอดเลือดสัตว์เลี้ยง (Cardiologist)',
    degrees: [
      'สัตวแพทยศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย',
      'วุฒิบัตรแสดงความรู้ความชำนาญในการประกอบวิชาชีพการสัตวแพทย์ สาขาอายุรศาสตร์โรคหัวใจ'
    ],
    specialty: 'ตรวจคลื่นสะท้อนความถี่สูงหัวใจ (Echocardiography) และการจัดการภาวะหัวใจล้มเหลว',
    category: 'cardio',
    experienceYears: 9,
    availableDays: ['จันทร์', 'พุธ', 'เสาร์', 'อาทิตย์'],
    bio: 'มีความชำนาญเฉพาะทางในการตรวจคัดกรองโรคลิ้นหัวใจเสื่อมในสุนัขสูงวัยและโรคกล้ามเนื้อหัวใจหนาตัวในแมว พร้อมการปรับสูตรยาเฉพาะรายบุคคล',
    avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'dr-anucha',
    name: 'น.สพ. อนุชา เลิศรุ่งโรจน์',
    title: 'หัวหน้าหน่วยฉุกเฉินและอภิบาลผู้ป่วยหนัก 24 ชั่วโมง (ER & Critical Care)',
    degrees: [
      'สัตวแพทยศาสตรบัณฑิต มหาวิทยาลัยเชียงใหม่',
      'Advanced Veterinary Trauma & Life Support (AVTLS) Certified'
    ],
    specialty: 'เวชศาสตร์ฉุกเฉิน กู้ชีพผู้ป่วยวิกฤต และศัลยกรรมอุบัติเหตุเฉียบพลัน',
    category: 'all',
    experienceYears: 11,
    availableDays: ['ทุกวัน (เข้าเวรประจำศูนย์ฉุกเฉิน 24 ชม.)'],
    bio: 'พร้อมประจำการเพื่อรับมือกับเคสฉุกเฉินขั้นวิกฤต เช่น สัตว์เลี้ยงโดนรถชน ภาวะกระเพาะบิดหมุน (GDV) ได้รับสารพิษ และภาวะหยุดหายใจตลอด 24 ชั่วโมง',
    avatarUrl: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=400'
  }
];
