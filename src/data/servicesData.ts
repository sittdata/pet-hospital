import { HospitalService } from '../types';

export const servicesData: HospitalService[] = [
  {
    id: 'emergency-24h',
    title: 'ศูนย์ฉุกเฉินและกู้ชีพวิกฤต 24 ชั่วโมง',
    enTitle: '24/7 Emergency & ICU Center',
    iconName: 'Ambulance',
    badge: 'พร้อมรับเคสตลอด 24 ชม.',
    summary: 'ทีมสัตวแพทย์และพยาบาลประจำการตลอดคืน พร้อมห้องผ่าตัดฉุกเฉิน ธนาคารเลือดสัตว์เลี้ยง และตู้ให้ออกซิเจน ICU ความดันบวก',
    features: [
      'โทรตรงแจ้งเคสด่วนก่อนถึงโรงพยาบาลเพื่อเตรียมทีมกู้ชีพ',
      'เครื่องติดตามสัญญาณชีพ Multiparameter Monitor ตลอด 24 ชั่วโมง',
      'บริการรถพยาบาลสัตว์เลี้ยง (Pet Ambulance) พร้อมอุปกรณ์กู้ชีพเคลื่อนที่',
      'ตรวจแล็บด่วน ทราบผลเลือดและก๊าซในเลือดได้ภายใน 15 นาที'
    ],
    isEmergency: true,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'surgery-theater',
    title: 'ศูนย์ศัลยกรรมและห้องผ่าตัดปลอดเชื้อ',
    enTitle: 'Advanced Surgical Theater',
    iconName: 'Activity',
    badge: 'Positive Pressure OR',
    summary: 'ห้องผ่าตัดมาตรฐานความดันบวกป้องกันการติดเชื้อ พร้อมเครื่องดมยาสลบระบบอัตโนมัติ และการผ่าตัดส่องกล้องแผลเล็ก (Laparoscopy)',
    features: [
      'ศัลยกรรมกระดูกและข้อ (TPLO, ดามกระดูก, ผ่าตัดสะบ้า)',
      'ศัลยกรรมเนื้อเยื่ออ่อนและอวัยวะภายในช่องท้อง',
      'ผ่าตัดทำหมันแผลเล็กไหมละลายซ่อนใต้ผิวหนัง',
      'ระบบควบคุมความอบอุ่นของร่างกายระหว่างและหลังผ่าตัด ป้องกันภาวะช็อก'
    ],
    isEmergency: false,
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'diagnostic-imaging',
    title: 'ศูนย์วินิจฉัยภาพทางการแพทย์ดิจิทัล',
    enTitle: 'Diagnostic Imaging Center',
    iconName: 'ScanLine',
    summary: 'เครื่องเอ็กซเรย์ดิจิทัล (DR) คมชัดสูง ปริมาณรังสีต่ำ และเครื่องอัลตราซาวด์ Doppler สีความละเอียดสูงสำหรับหัวใจและช่องท้อง',
    features: [
      'เอ็กซเรย์ดิจิทัลตรวจโครงสร้างกระดูก ช่องอก และช่องท้อง',
      'อัลตราซาวด์หัวใจ (Echocardiogram) ประเมินกล้ามเนื้อและลิ้นหัวใจ',
      'อัลตราซาวด์ช่องท้องละเอียด ประเมินตับ ไต ม้าม และกระเพาะปัสสาวะ',
      'เก็บไฟล์ภาพเอกซเรย์ระบบ Cloud ส่งต่อให้เจ้าของผ่าน LINE ได้ทันที'
    ],
    isEmergency: false,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cat-friendly',
    title: 'คลินิกแมวเฉพาะทาง Cat Friendly Clinic',
    enTitle: 'Certified Feline Clinic',
    iconName: 'HeartHandshake',
    badge: 'ISFM Gold Standard',
    summary: 'ออกแบบทุกตารางนิ้วเพื่อแมวโดยเฉพาะ แยกโซนตรวจและหอผู้ป่วยไร้เสียงรบกวน ลดความกลัวและความเครียดของน้องแมว',
    features: [
      'ห้องตรวจและพื้นที่รอตรวจเฉพาะแมว (Cat-Only Waiting Lounge)',
      'การใช้ Feliway Diffuser พ่นฟีโรโมนผ่อนคลายตลอดทั้งอาคาร',
      'โปรแกรมดูแลสุขภาพแมวสูงวัยและการคัดกรองโรคไตระยะเริ่มต้น',
      'ทีมสัตวแพทย์และเจ้าหน้าที่จับบังคับแมวด้วยความนุ่มนวลสูงสุด'
    ],
    isEmergency: false,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'exotic-center',
    title: 'ศูนย์สัตว์พิเศษและสัตว์เลื้อยคลาน',
    enTitle: 'Exotic & Avian Care Center',
    iconName: 'Feather',
    summary: 'ดูแลและรักษากระต่าย แกสบี้ ชินชิลล่า นก และสัตว์เลื้อยคลาน โดยสัตวแพทย์ที่ได้รับวุฒิบัตรและฝึกอบรมด้านสัตว์พิเศษโดยเฉพาะ',
    features: [
      'เครื่องมือดมยาสลบระบบ Isoflurane สำหรับสัตว์ขนาดเล็กโดยเฉพาะ',
      'เครื่องกรอฟันกระต่ายระบบละอองน้ำ ป้องกันความร้อนทำลายรากฟัน',
      'ตู้บ่มอภิบาลสัตว์พิเศษปรับอุณหภูมิและความชื้นแม่นยำ',
      'ตรวจโรคติดเชื้อและพยาธิวิทยาทางเดินอาหารสัตว์ปีก'
    ],
    isEmergency: false,
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'wellness-vaccine',
    title: 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
    enTitle: 'Preventive Care & Vaccination',
    iconName: 'ShieldCheck',
    summary: 'โปรแกรมวัคซีนตามช่วงวัย ตรวจสุขภาพประจำปี ป้องกันเห็บ หมัด พยาธิหนอนหัวใจ และตรวจสุขภาพก่อนเดินทางต่างประเทศ',
    features: [
      'สมุดวัคซีนดิจิทัลพร้อมระบบแจ้งเตือนวันนัดหมายผ่าน LINE',
      'ตรวจสุขภาพชุดใหญ่ตามช่วงวัย (ลูกสัตว์, สัตว์โต, สัตว์สูงวัย)',
      'ตรวจเลือด ตรวจค่าการทำงานของตับ ไต น้ำตาล เม็ดเลือดสมบูรณ์',
      'บริการใบรับรองแพทย์ตรวจสุขภาพเพื่อขึ้นเครื่องบินและออกนอกประเทศ'
    ],
    isEmergency: false,
    imageUrl: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=600&auto=format&fit=crop&q=80'
  }
];
