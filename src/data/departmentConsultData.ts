export interface DepartmentConsultData {
  departmentId: string;
  departmentTitle: string;
  doctorName: string;
  doctorTitle: string;
  doctorAvatar: string;
  greetingPrompt: string;
  quickSymptoms: string[];
}

const EMERGENCY_24H: DepartmentConsultData = {
  departmentId: 'emergency-24h',
  departmentTitle: 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง',
  doctorName: 'สพ.ญ. ลลิตา บุญประเสริฐ',
  doctorTitle: 'สัตวแพทย์ประจำแผนกวิกฤต (ICU) 24 ชม.',
  doctorAvatar: '/images/vets/vet_female_cat.jpg',
  greetingPrompt:
    'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชม. พร้อมดูแลค่ะ หากสัตว์เลี้ยงมีภาวะวิกฤต เช่น ช็อก หายใจไม่ออก หมดสติ หรือเลือดออกไม่หยุด สามารถโทรด่วน 02-888-9999 หรือแตะแจ้งอาการทันทีเพื่อเปิดห้องกู้ชีพรอรับเคสค่ะ',
  quickSymptoms: [
    'หายใจหอบลึก ลิ้นม่วง หายใจมีเสียงวี้ด',
    'ปัสสาวะไม่ออก เบ่งเจ็บ ร้องปวด ท้องแข็ง',
    'มีอาการชักเกร็ง ตาค้าง หมดสติ',
    'ประสบอุบัติเหตุ ตกตึก หรือเลือดไหลไม่หยุด',
  ],
};

const SURGERY_THEATER: DepartmentConsultData = {
  departmentId: 'surgery-theater',
  departmentTitle: 'ศูนย์ศัลยกรรมและกระดูก (ห้องผ่าตัดปลอดเชื้อ)',
  doctorName: 'น.สพ. ดร. ณัฐพล วัฒนศิริ',
  doctorTitle: 'สัตวแพทย์เฉพาะทางศัลยกรรมกระดูกและข้อ (ปร.ด.)',
  doctorAvatar: '/images/vets/vet_official_male_1.jpg',
  greetingPrompt:
    'สวัสดีครับ หมอณัฐพล ประจำศูนย์ศัลยกรรมและกระดูกครับ หากน้องมีอาการเดินกะเผลก ยกขา ไม่ลงน้ำหนัก ได้รับอุบัติเหตุ หรือต้องการปรึกษาการผ่าตัดส่องกล้อง/ทำหมันแผลเล็ก สามารถเลือกอาการหรือส่งภาพ/วิดีโอการเดินให้หมอช่วยประเมินเบื้องต้นได้เลยครับ',
  quickSymptoms: [
    'เดินกะเผลก ยกขา ไม่ยอมลงน้ำหนัก',
    'สงสัยสะบ้าเคลื่อน / ข้อสะโพกเสื่อม ลุกยืนลำบาก',
    'ประสบอุบัติเหตุ มีอาการปวด บวม ร้องเวลาขยับตัว',
    'ปรึกษาผ่าตัดส่องกล้องแผลเล็ก / ผ่าตัดทำหมันไหมละลาย',
  ],
};

const DIAGNOSTIC_IMAGING: DepartmentConsultData = {
  departmentId: 'diagnostic-imaging',
  departmentTitle: 'ศูนย์วินิจฉัยภาพทางการแพทย์ดิจิทัล',
  doctorName: 'น.สพ. ปิยะวัฒน์ เจริญผล',
  doctorTitle: 'สัตวแพทย์คลินิกบำบัดวิกฤตและรังสีวินิจฉัย',
  doctorAvatar: '/images/vets/vet_male_cat.jpg',
  greetingPrompt:
    'สวัสดีครับ ทีมสัตวแพทย์ศูนย์วินิจฉัยภาพทางการแพทย์ดิจิทัล ยินดีให้คำปรึกษาครับ หากต้องการตรวจเอ็กซเรย์ดิจิทัล (DR) คมชัดสูง หรืออัลตราซาวด์ Doppler สีความละเอียดสูง (หัวใจ/ช่องท้อง) แจ้งอาการหรือสอบถามการเตรียมตัวก่อนตรวจได้เลยครับ',
  quickSymptoms: [
    'ตรวจอัลตราซาวด์หัวใจ (Echocardiogram) และระบบไหลเวียนโลหิต',
    'ตรวจอัลตราซาวด์ช่องท้องละเอียด (ตับ ไต ม้าม กระเพาะปัสสาวะ)',
    'เอ็กซเรย์ดิจิทัลกระดูก ช่องอก และช่องท้อง ทราบผลทันที',
    'ส่งไฟล์ภาพเอ็กซเรย์หรืออัลตราซาวด์เดิมให้สัตวแพทย์ช่วยอ่านผล',
  ],
};

const CAT_FRIENDLY: DepartmentConsultData = {
  departmentId: 'cat-friendly',
  departmentTitle: 'คลินิกแมวเฉพาะทาง Cat Friendly Clinic (ISFM)',
  doctorName: 'สพ.ญ. มัลลิกา ศิริทรัพย์',
  doctorTitle: 'ISFM Certified Cat Friendly Veterinarian',
  doctorAvatar: '/images/vets/vet_cat_hd.jpg',
  greetingPrompt:
    'สวัสดีค่ะ หมอมัลลิกา จากคลินิกแมวเฉพาะทาง Cat Friendly Clinic ค่ะ น้องแมวมักซ่อนอาการป่วย หากน้องมีอาการปัสสาวะผิดปกติ ซึม ไม่กินอาหาร หายใจแปลกๆ หรือต้องการตรวจคัดกรองโรคไต ปรึกษาหมอได้ทันทีนะคะ',
  quickSymptoms: [
    'แมวปัสสาวะไม่ออก เบ่งฉี่ ร้องเจ็บ หรือฉี่กะปริบกะปรอย',
    'แมวซึม เบื่ออาหาร ไม่ยอมดื่มน้ำ นอนนิ่งผิดปกติ',
    'แมวหายใจเร็ว อ้าปากหายใจ จาม หรือมีน้ำมูกเรื้อรัง',
    'ปรึกษาคัดกรองโรคไตระยะเริ่มต้น / สุขภาพแมวสูงวัย',
  ],
};

const EXOTIC_CENTER: DepartmentConsultData = {
  departmentId: 'exotic-center',
  departmentTitle: 'ศูนย์สัตว์พิเศษและสัตว์เลื้อยคลาน (Exotic Pets)',
  doctorName: 'น.สพ. ธีรภัทร ชาญวิริยะ',
  doctorTitle: 'สัตวแพทย์เฉพาะทางอายุรศาสตร์และศัลยกรรมสัตว์พิเศษ',
  doctorAvatar: '/images/vets/vet_official_male_1.jpg',
  greetingPrompt:
    'สวัสดีครับ หมอธีรภัทร ประจำศูนย์สัตว์พิเศษ (Exotic Pets) ครับ สัตว์พิเศษ เช่น กระต่าย แกสบี้ นก ชูก้าไกลเดอร์ หรือสัตว์เลื้อยคลาน หากมีอาการไม่กินอาหาร อึเล็กลง หรือเซื่องซึม ถือเป็นภาวะเร่งด่วน แจ้งชนิดสัตว์และอาการให้หมอช่วยดูแลได้เลยครับ',
  quickSymptoms: [
    'กระต่าย/แกสบี้ ไม่กินหญ้า อึเม็ดเล็กลง ท้องอืด (GI Stasis)',
    'ฟันหน้าหรือฟันกรามยาวผิดปกติ น้ำลายไหล กินอาหารลำบาก',
    'นก/สัตว์ปีก ซึม พองขน จมูกแฉะ หายใจติดขัด',
    'สัตว์เลื้อยคลาน ซึม ไม่ยอมกินอาหาร มีปัญหาการลอกคราบ',
  ],
};

const WELLNESS_VACCINE: DepartmentConsultData = {
  departmentId: 'wellness-vaccine',
  departmentTitle: 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
  doctorName: 'สพ.ญ. วรินทร์ธร สุขเกษม',
  doctorTitle: 'สัตวแพทย์ประจำศูนย์เวชศาสตร์ป้องกันและตรวจสุขภาพ',
  doctorAvatar: '/images/vets/vet_official_female_1.jpg',
  greetingPrompt:
    'สวัสดีค่ะ ทีมสัตวแพทย์ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน ยินดีให้คำแนะนำค่ะ ไม่ว่าจะเป็นโปรแกรมวัคซีนตามช่วงวัย ตรวจสุขภาพประจำปี ป้องกันปรสิตเห็บหมัดพยาธิ หรือขอใบรับรองเดินทาง สามารถสอบถามหมอได้เลยนะคะ',
  quickSymptoms: [
    'ปรึกษาโปรแกรมวัคซีนสำหรับลูกสุนัข / ลูกแมวแรกเกิดตามช่วงวัย',
    'ปรึกษาแพ็กเกจตรวจสุขภาพประจำปี ตรวจเลือด และการทำงานของตับไต',
    'โปรแกรมป้องกันเห็บ หมัด พยาธิหนอนหัวใจ และพยาธิทางเดินอาหาร',
    'ตรวจสุขภาพและออกใบรับรองแพทย์เพื่อขึ้นเครื่องบิน/เดินทางต่างประเทศ',
  ],
};

export const DEPARTMENT_CONSULT_MAP: Record<string, DepartmentConsultData> = {
  'emergency-24h': EMERGENCY_24H,
  'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง': EMERGENCY_24H,
  'surgery-theater': SURGERY_THEATER,
  'ศูนย์ศัลยกรรมและกระดูก (ห้องผ่าตัดปลอดเชื้อ)': SURGERY_THEATER,
  'diagnostic-imaging': DIAGNOSTIC_IMAGING,
  'ศูนย์วินิจฉัยภาพทางการแพทย์ดิจิทัล': DIAGNOSTIC_IMAGING,
  'cat-friendly': CAT_FRIENDLY,
  'คลินิกแมวเฉพาะทาง Cat Friendly Clinic (ISFM)': CAT_FRIENDLY,
  'exotic-center': EXOTIC_CENTER,
  'ศูนย์สัตว์พิเศษและสัตว์เลื้อยคลาน (Exotic Pets)': EXOTIC_CENTER,
  'wellness-vaccine': WELLNESS_VACCINE,
  'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน': WELLNESS_VACCINE,
};

export function getDepartmentConsultData(serviceTitleOrId: string): DepartmentConsultData {
  if (DEPARTMENT_CONSULT_MAP[serviceTitleOrId]) {
    return DEPARTMENT_CONSULT_MAP[serviceTitleOrId];
  }
  const clean = serviceTitleOrId.toLowerCase();
  if (clean.includes('ศัลยกรรม') || clean.includes('กระดูก') || clean.includes('surgery')) {
    return DEPARTMENT_CONSULT_MAP['surgery-theater'];
  }
  if (clean.includes('วินิจฉัยภาพ') || clean.includes('เอ็กซเรย์') || clean.includes('imaging')) {
    return DEPARTMENT_CONSULT_MAP['diagnostic-imaging'];
  }
  if (clean.includes('แมว') || clean.includes('feline') || clean.includes('isfm')) {
    return DEPARTMENT_CONSULT_MAP['cat-friendly'];
  }
  if (clean.includes('สัตว์พิเศษ') || clean.includes('exotic')) {
    return DEPARTMENT_CONSULT_MAP['exotic-center'];
  }
  if (
    clean.includes('วัคซีน') ||
    clean.includes('ตรวจสุขภาพ') ||
    clean.includes('wellness') ||
    clean.includes('ป้องกัน')
  ) {
    return DEPARTMENT_CONSULT_MAP['wellness-vaccine'];
  }
  if (clean.includes('ฉุกเฉิน') || clean.includes('วิกฤต') || clean.includes('emergency')) {
    return DEPARTMENT_CONSULT_MAP['emergency-24h'];
  }
  // Default fallback
  return {
    departmentId: 'general-consult',
    departmentTitle: serviceTitleOrId,
    doctorName: 'สพ.ญ. ลลิตา บุญประเสริฐ',
    doctorTitle: 'สัตวแพทย์เวรประจำการ 24 ชั่วโมง',
    doctorAvatar: '/images/vets/vet_female_cat.jpg',
    greetingPrompt: `สวัสดีค่ะ ทีมสัตวแพทย์ประจำ${serviceTitleOrId} ยินดีให้คำปรึกษาค่ะ สามารถพิมพ์หรือเลือกแจ้งอาการสัตว์เลี้ยงให้หมอช่วยประเมินเบื้องต้นได้เลยนะคะ`,
    quickSymptoms: [
      'สัตว์เลี้ยงซึม ไม่กินอาหาร หรือมีไข้',
      'สัตว์เลี้ยงอาเจียน ถ่ายเหลว หรือท้องอืด',
      'มีแผล หรือได้รับอุบัติเหตุกระทบกระแทก',
      'ปรึกษาการนัดหมายและการเตรียมตัวก่อนเข้าตรวจ',
    ],
  };
}
