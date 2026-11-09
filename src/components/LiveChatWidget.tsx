import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cx } from '@/utils/cx';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badge';
import {
  RiSparklingLine,
  RiHeartPulseLine,
  RiStethoscopeLine,
  RiShieldCrossLine,
  RiCalendarCheckLine,
  RiPhoneLine,
  RiArrowUpLine,
  RiAttachment2,
  RiAlertLine,
  RiCheckLine,
  RiUserHeartLine,
  RiRefreshLine,
  RiCloseLine,
  RiMedicineBottleLine,
  RiArrowRightLine,
} from '@remixicon/react';
import { getStoredPassports } from '../data/petPassportData';
import type { PetPassport } from '../types/petPassport';
import type { DepartmentConsultData } from '../data/departmentConsultData';

export interface VaccineConsultData {
  petName: string;
  breed: string;
  vaccineName: string;
  dueDate?: string;
  veterinarian?: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'doctor';
  senderName?: string;
  doctorAvatar?: string;
  timestamp: string;
  text: string;
  imageUrl?: string;
  isTriageCard?: boolean;
  triageData?: {
    alertTitle: string;
    alertBadge: string;
    alertLevel: 'red' | 'yellow' | 'green';
    suspectedConditions: string[];
    firstAidInstructions: string[];
    recommendedService: string;
  };
  isVaccineCard?: boolean;
  vaccineData?: VaccineConsultData;
  quickSymptoms?: string[];
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: (serviceName?: string, doctorName?: string) => void;
  isLoggedIn?: boolean;
  currentUser?: { name: string; email: string } | null;
  onRequireAuth?: () => void;
  initialVaccineContext?: VaccineConsultData | null;
  onClearInitialVaccineContext?: () => void;
  initialDepartmentContext?: DepartmentConsultData | null;
  onClearInitialDepartmentContext?: () => void;
}

const SUGGESTIONS = [
  'สุนัขอาเจียนฟองขาว ซึม ไม่กินข้าว',
  'แมวมีไข้ จาม หายใจมีเสียงวี้ด',
  'ลูกสุนัขเผลอกลืนสิ่งแปลกปลอม',
  'สัตว์เลี้ยงหน้าบวมฉับพลันจากแมลงกัด',
];

const EASE_SPRING = [0.16, 1, 0.3, 1] as const;

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  isLoggedIn = false,
  currentUser,
  onRequireAuth,
  initialVaccineContext,
  onClearInitialVaccineContext,
  initialDepartmentContext,
  onClearInitialDepartmentContext,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<DepartmentConsultData | null>(
    () => initialDepartmentContext ?? null
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialDepartmentContext) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return [
        {
          id: `doctor-dept-${Date.now()}`,
          sender: 'doctor',
          senderName: initialDepartmentContext.doctorName
            ? `${initialDepartmentContext.doctorName} (${initialDepartmentContext.doctorTitle})`
            : `${initialDepartmentContext.departmentTitle} (สัตวแพทย์เฉพาะทาง)`,
          doctorAvatar: initialDepartmentContext.doctorAvatar,
          timestamp: timeStr,
          text: initialDepartmentContext.greetingPrompt,
          quickSymptoms: initialDepartmentContext.quickSymptoms,
        },
      ];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState('สพ.ญ. ลลิตา (สัตวแพทย์เวร) กำลังพิมพ์ตอบกลับ...');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [showVaccinePicker, setShowVaccinePicker] = useState(false);
  const [passports, setPassports] = useState<PetPassport[]>(() => getStoredPassports(currentUser?.email));
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const widgetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        e.target.value = '';
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        alert('ขนาดไฟล์รูปภาพต้องไม่เกิน 3MB');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let focusTimer: number | undefined;
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      focusTimer = window.setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      clearAllTimeouts();
      previousActiveElement.current?.focus();
    }
    return () => {
      if (focusTimer) window.clearTimeout(focusTimer);
      clearAllTimeouts();
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && widgetRef.current) {
        const focusables = Array.from(
          widgetRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!widgetRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const resetChat = () => {
    clearAllTimeouts();
    setMessages([]);
    setInputValue('');
    setSelectedImage(null);
    setShowVaccinePicker(false);
    setIsTyping(false);
    setActiveDepartment(null);
  };

  // Handle incoming department consultation context from Services
  useEffect(() => {
    if (isOpen && initialDepartmentContext) {
      const dept = initialDepartmentContext;
      const timer = setTimeout(() => {
        setActiveDepartment(dept);
        clearAllTimeouts();
        setShowVaccinePicker(false);
        setSelectedImage(null);
        setInputValue('');

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const deptDoctorMsg: ChatMessage = {
          id: `doctor-dept-${Date.now()}`,
          sender: 'doctor',
          senderName: dept.doctorName ? `${dept.doctorName} (${dept.doctorTitle})` : `${dept.departmentTitle} (สัตวแพทย์เฉพาะทาง)`,
          doctorAvatar: dept.doctorAvatar,
          timestamp: timeStr,
          text: dept.greetingPrompt,
          quickSymptoms: dept.quickSymptoms,
        };

        setMessages([deptDoctorMsg]);
        setIsTyping(false);
        onClearInitialDepartmentContext?.();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialDepartmentContext, onClearInitialDepartmentContext]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setActiveDepartment(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sync pet passports on open and when updated
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setPassports(getStoredPassports(currentUser?.email));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentUser?.email]);

  useEffect(() => {
    const handleUpdate = () => {
      setPassports(getStoredPassports(currentUser?.email));
    };
    window.addEventListener('vetpaws:passports_updated', handleUpdate);
    return () => {
      window.removeEventListener('vetpaws:passports_updated', handleUpdate);
    };
  }, [currentUser?.email]);

  const analyzeTriage = (query: string, currentDept?: DepartmentConsultData | null) => {
    const lower = query.toLowerCase();
    const attendingDocName = currentDept?.doctorName || 'สพ.ญ. ลลิตา บุญประเสริฐ';
    const isFemaleDoc = !currentDept || currentDept.doctorName.startsWith('สพ.ญ.');
    const politeParticle = isFemaleDoc ? 'ค่ะ' : 'ครับ';

    // 🔴 Critical Red Alert Keywords
    if (
      lower.includes('ไม่หายใจ') ||
      lower.includes('หยุดหายใจ') ||
      lower.includes('ช็อก') ||
      lower.includes('ช็อค') ||
      lower.includes('ฉี่ไม่ออก') ||
      lower.includes('ปัสสาวะไม่ออก') ||
      lower.includes('กระเพาะบิด') ||
      lower.includes('ชัก') ||
      lower.includes('รถชน') ||
      lower.includes('ตกตึก') ||
      lower.includes('เลือดไหลไม่หยุด') ||
      lower.includes('เลือดออกไม่หยุด') ||
      lower.includes('หมดสติ') ||
      lower.includes('ลิ้นม่วง') ||
      lower.includes('ซีดขาว')
    ) {
      return {
        level: 'red' as const,
        alertTitle: 'ผลประเมินวิกฤต',
        alertBadge: 'วิกฤตฉุกเฉิน (Red Alert 🚨)',
        suspectedConditions: [
          'ภาวะทางเดินปัสสาวะอุดตันเฉียบพลัน / กระเพาะบิดหมุน (GDV)',
          'ภาวะช็อกหรือระบบหายใจและไหลเวียนโลหิตล้มเหลว',
        ],
        firstAidInstructions: [
          'ห้ามป้อนอาหาร น้ำ หรือยาลดไข้คนเด็ดขาด',
          'จัดท่านอนราบ ตะแคงข้าง ยกศีรษะเสมอลำตัว ป้องกันการสำลัก',
          'นำส่งโรงพยาบาลทันที แพทย์เวรเตรียมเปิดห้องช่วยชีวิต 24 ชม.',
        ],
        recommendedService: 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง',
        doctorReply: currentDept
          ? `${attendingDocName} ได้รับข้อมูลแล้ว${politeParticle}! อาการนี้น้องมีความเสี่ยงวิกฤตสูงมาก หมอและทีมกู้ชีพ ICU 24 ชม. เตรียมอุปกรณ์รองรับไว้ให้ทันที แนะนำให้รีบพาน้องเข้ามาโรงพยาบาลด่วน หรือกดโทรตรงเข้าห้องฉุกเฉินได้เลยนะคะ`
          : 'หมอลลิตา (เวรฉุกเฉิน 24 ชม.) ได้รับข้อมูลแล้วค่ะ! อาการนี้น้องมีความเสี่ยงวิกฤตสูงมาก หมอเตรียมทีมกู้ชีพและอุปกรณ์รองรับไว้ให้ทันที แนะนำให้รีบพาน้องเข้ามาโรงพยาบาลด่วน หรือกดโทรตรงเข้าห้องฉุกเฉินได้เลยนะคะ',
      };
    }

    // 🐱 Cat Friendly Clinic (ISFM Certified)
    if (
      lower.includes('แมว') ||
      lower.includes('feline') ||
      lower.includes('isfm') ||
      lower.includes('โรคไต') ||
      lower.includes('เบ่งฉี่') ||
      lower.includes('อ้าปากหายใจ') ||
      lower.includes('ฉี่กะปริบกะปรอย') ||
      (currentDept?.departmentId === 'cat-friendly' &&
        !lower.includes('กระดูก') &&
        !lower.includes('ผ่าตัด'))
    ) {
      const isUrgentFeline = lower.includes('อ้าปากหายใจ') || lower.includes('เบ่งฉี่') || lower.includes('ฉี่กะปริบกะปรอย');
      return {
        level: isUrgentFeline ? ('yellow' as const) : ('green' as const),
        alertTitle: 'ผลประเมินอายุรศาสตร์โรคแมวเฉพาะทาง (ISFM)',
        alertBadge: isUrgentFeline ? 'เฝ้าระวังทางเดินปัสสาวะ/ทางเดินหายใจ (Feline Alert)' : 'ตรวจเฉพาะทางคลินิกแมว (Cat Friendly Clinic)',
        suspectedConditions: [
          'ภาวะทางเดินปัสสาวะส่วนล่างอุดตันในแมว (FLUTD / FIC)',
          'การคัดกรองโรคไตวายเรื้อรัง (CKD) / ภาวะหลอดลมอักเสบในแมว (Feline Asthma)',
        ],
        firstAidInstructions: [
          'แยกน้องแมวไว้ในห้องเงียบ ปราศจากเสียงสุนัขหรือสิ่งรบกวน ลดความเครียดอย่างเข้มงวด',
          'สังเกตกระบะทราย มีก้อนฉี่หรือไม่ เบ่งเจ็บหรือไม่ หากเบ่งไม่ออกเกิน 12 ชม. ต้องพบแพทย์ทันที',
          'คลินิกแมวแยกโซนปลอดสุนัข พร้อมห้องตรวจเฉพาะทางและห้องพักฟื้นมาตรฐาน ISFM Gold Standard',
        ],
        recommendedService: 'คลินิกแมวเฉพาะทาง Cat Friendly Clinic (ISFM)',
        doctorReply:
          'สวัสดีค่ะ หมอมัลลิกา (คลินิกแมวเฉพาะทาง ISFM) ได้รับข้อมูลแล้วค่ะ สำหรับน้องแมวที่มีอาการดังกล่าว หมอเตรียมห้องตรวจโซนเฉพาะแมว (Cat-Only Zone) ที่ปลอดเสียงรบกวนและพ่นฟีโรโมน Feliway ไว้รอรับน้องแล้วนะคะ คุณเจ้าของสามารถกดนัดหมายเวลาที่สะดวกนำน้องเข้ามาตรวจได้เลยค่ะ',
      };
    }

    // 🦴 Orthopedics / Surgery Symptoms
    if (
      lower.includes('กะเผลก') ||
      lower.includes('ยกขา') ||
      lower.includes('ไม่ลงน้ำหนัก') ||
      lower.includes('สะบ้า') ||
      lower.includes('ข้อสะโพก') ||
      lower.includes('กระดูก') ||
      lower.includes('ผ่าตัด') ||
      lower.includes('ทำหมัน') ||
      lower.includes('ส่องกล้อง') ||
      (currentDept?.departmentId === 'surgery-theater' &&
        !lower.includes('อาเจียน') &&
        !lower.includes('ท้องเสีย'))
    ) {
      return {
        level: 'yellow' as const,
        alertTitle: 'ผลประเมินระบบโครงสร้างและศัลยกรรม',
        alertBadge: 'ตรวจเฉพาะทาง (Orthopedic & Surgery)',
        suspectedConditions: [
          'ภาวะเอ็นไขว้หน้าเข่าขาด (CCLR) / สะบ้าเคลื่อน (Patellar Luxation)',
          'ภาวะกระดูกแตกร้าว ข้อสะโพกเสื่อม หรือกล้ามเนื้ออักเสบเฉียบพลัน',
        ],
        firstAidInstructions: [
          'จำกัดบริเวณน้องในกรงหรือพื้นที่ราบ ห้ามวิ่งกระโดดหรือขึ้นลงบันได',
          'ประคบเย็นบริเวณข้อต่อที่บวม 10-15 นาที หลีกเลี่ยงการดัดหรือดึงขา',
          'สัตวแพทย์เฉพาะทางศัลยกรรมเตรียมห้องตรวจและเครื่องมือเอ็กซเรย์รองรับ',
        ],
        recommendedService: 'ศูนย์ศัลยกรรมและกระดูก (ห้องผ่าตัดปลอดเชื้อ)',
        doctorReply:
          'สวัสดีครับ หมอณัฐพล (ศัลยกรรมและกระดูก) ได้รับข้อมูลแล้วครับ สำหรับอาการเดินผิดปกติหรือลงน้ำหนักไม่ได้ แนะนำจำกัดบริเวณน้องก่อนนะครับ เดี๋ยวหมอเปิดคิวนัดตรวจร่างกายและเตรียมคิวเอ็กซเรย์ดิจิทัลไว้ให้ทันทีครับ คุณเจ้าของสะดวกพาน้องเข้ามาตรวจวันนี้เลยไหมครับ?',
      };
    }

    // 🐰 Exotic Pets Symptoms
    if (
      lower.includes('กระต่าย') ||
      lower.includes('แกสบี้') ||
      lower.includes('ชินชิลล่า') ||
      lower.includes('สัตว์เลื้อยคลาน') ||
      lower.includes('นก') ||
      lower.includes('สัตว์ปีก') ||
      lower.includes('ไม่กินหญ้า') ||
      lower.includes('อึเม็ดเล็ก') ||
      lower.includes('gi stasis') ||
      lower.includes('ฟันยาว') ||
      (currentDept?.departmentId === 'exotic-center')
    ) {
      return {
        level: 'yellow' as const,
        alertTitle: 'ผลประเมินสัตว์พิเศษและสัตว์ฟันแทะ',
        alertBadge: 'เฝ้าระวังทางเดินอาหาร (GI Stasis Risk)',
        suspectedConditions: [
          'ภาวะทางเดินอาหารหยุดบีบตัวในสัตว์กินพืช (GI Stasis)',
          'ภาวะฟันยาวผิดปกติ (Dental Malocclusion) หรือแก๊สสะสมในกระเพาะ',
        ],
        firstAidInstructions: [
          'ห้ามให้สัตว์กินพืชงดอาหารหรือน้ำเด็ดขาด เสี่ยงตับวายเฉียบพลัน',
          'รักษาความอบอุ่นของร่างกาย ป้อนอาหารฟื้นฟูหากน้องยังกลืนได้',
          'นำส่งศูนย์สัตว์พิเศษด่วน เพื่อให้สารน้ำและยากระตุ้นการบีบตัวของทางเดินอาหาร',
        ],
        recommendedService: 'ศูนย์สัตว์พิเศษและสัตว์เลื้อยคลาน (Exotic Pets)',
        doctorReply:
          'สวัสดีครับ หมอธีรภัทร (ศูนย์สัตว์พิเศษ) ได้รับข้อมูลแล้วครับ สำหรับกระต่ายหรือสัตว์ฟันแทะที่ไม่กินหญ้าหรืออึเล็กลง ถือเป็นภาวะเร่งด่วนมากครับ หมอเตรียมตู้บ่มอภิบาลและยาปรับสมดุลรอรับน้องไว้แล้ว แนะนำรีบพาน้องเข้ามาตรวจนะครับ',
      };
    }

    // 🩺 Diagnostic Imaging / Ultrasound
    if (
      lower.includes('อัลตราซาวด์') ||
      lower.includes('เอ็กซเรย์') ||
      lower.includes('echo') ||
      lower.includes('doppler') ||
      lower.includes('รังสี') ||
      (currentDept?.departmentId === 'diagnostic-imaging')
    ) {
      return {
        level: 'green' as const,
        alertTitle: 'ผลประเมินการตรวจวินิจฉัยภาพทางการแพทย์',
        alertBadge: 'บริการวินิจฉัยภาพดิจิทัล (Digital Imaging)',
        suspectedConditions: [
          'การตรวจคลื่นเสียงสะท้อนหัวใจ (Echo) หรืออัลตราซาวด์ช่องท้องละเอียด',
          'การตรวจประเมินโครงสร้างกระดูกและช่องอกด้วยระบบเอ็กซเรย์ดิจิทัล (DR)',
        ],
        firstAidInstructions: [
          'กรณีอัลตราซาวด์ช่องท้อง: งดอาหาร 6-8 ชม. ก่อนตรวจ (จิบน้ำได้)',
          'กรณีตรวจเอ็กซเรย์ทั่วไป: สามารถเข้ารับการตรวจได้ทันทีโดยไม่ต้องงดอาหาร',
          'ภาพดิจิทัลจัดเก็บบนระบบ Cloud พร้อมรายงานผลตรวจภายใน 30 นาที',
        ],
        recommendedService: 'ศูนย์วินิจฉัยภาพทางการแพทย์ดิจิทัล',
        doctorReply:
          'สวัสดีครับ ทีมสัตวแพทย์ศูนย์วินิจฉัยภาพได้รับข้อมูลแล้วครับ สำหรับการตรวจอัลตราซาวด์หรือเอ็กซเรย์ดิจิทัล สามารถนัดหมายเวลาที่สะดวกได้เลยนะครับ หากเป็นการตรวจช่องท้องอย่าลืมงดอาหารน้องก่อนตรวจ 6-8 ชม. นะครับ',
      };
    }

    // 🛡️ Wellness & Preventive Care
    if (
      lower.includes('วัคซีน') ||
      lower.includes('ตรวจสุขภาพ') ||
      lower.includes('เห็บ') ||
      lower.includes('หมัด') ||
      lower.includes('พยาธิ') ||
      lower.includes('ใบรับรอง') ||
      lower.includes('ขึ้นเครื่อง') ||
      (currentDept?.departmentId === 'wellness-vaccine')
    ) {
      return {
        level: 'green' as const,
        alertTitle: 'ผลประเมินสุขภาพและเวชศาสตร์ป้องกัน',
        alertBadge: 'โปรแกรมสุขภาพเชิงป้องกัน (Wellness Care)',
        suspectedConditions: [
          'โปรแกรมวัคซีนตามช่วงวัยและการตรวจสุขภาพเชิงป้องกันประจำปี',
          'การป้องกันปรสิตภายนอกและภายใน (เห็บ หมัด พยาธิหนอนหัวใจ)',
        ],
        firstAidInstructions: [
          'ก่อนพามาฉีดวัคซีน น้องต้องแข็งแรงดี ไม่มีไข้ ไม่ซึม และไม่อาเจียน',
          'งดอาบน้ำสัตว์เลี้ยงก่อนและหลังฉีดวัคซีนอย่างน้อย 48 ชั่วโมง',
          'สามารถนำสมุดประวัติเดิมมาเพื่อบันทึกข้อมูลเข้าสู่ระบบดิจิทัล',
        ],
        recommendedService: 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
        doctorReply:
          'สวัสดีค่ะ สพ.ญ. วรินทร์ธร ยินดีให้คำแนะนำค่ะ สำหรับโปรแกรมวัคซีนและตรวจสุขภาพ สามารถจองวันเวลาที่สะดวกเข้ามาได้เลยนะคะ น้องจะได้รับการตรวจร่างกายเบื้องต้นก่อนรับวัคซีนทุกครั้งค่ะ',
      };
    }

    // 🟡 Urgent Yellow Alert Monitor Keywords
    if (
      lower.includes('อาเจียน') ||
      lower.includes('อ้วก') ||
      lower.includes('ฟองขาว') ||
      lower.includes('ท้องเสีย') ||
      lower.includes('ถ่ายเหลว') ||
      lower.includes('ซึม') ||
      lower.includes('ไม่กิน') ||
      lower.includes('เบื่ออาหาร') ||
      lower.includes('มีไข้') ||
      lower.includes('ตัวร้อน') ||
      lower.includes('ไอ') ||
      lower.includes('คัน') ||
      lower.includes('ตาแฉะ') ||
      lower.includes('ท้องอืด') ||
      lower.includes('ไม่อึ') ||
      lower.includes('แปลกปลอม')
    ) {
      return {
        level: 'yellow' as const,
        alertTitle: 'ผลประเมินด่วน',
        alertBadge: 'เฝ้าระวัง (Yellow Alert)',
        suspectedConditions: [
          'กระเพาะอาหารอักเสบเฉียบพลัน (Gastritis)',
          'สงสัยการกลืนสิ่งแปลกปลอม (Foreign Body)',
        ],
        firstAidInstructions: [
          'งดอาหารและน้ำ 2 ชม. ป้องกันอาการสำลัก',
          'ตรวจดูเยื่อเมือกเหงือก ต้องไม่ซีดหรือขาว',
          'แพทย์เวรเตรียมเปิดคิวตรวจด่วนให้ทันที',
        ],
        recommendedService: currentDept ? currentDept.departmentTitle : 'ศูนย์อายุรกรรมและโรคแมวเฉพาะทาง',
        doctorReply: currentDept
          ? `สวัสดี${politeParticle}คุณเจ้าของ ${attendingDocName}${politeParticle} จากอาการที่แจ้ง หมอแนะนำให้งดน้ำและอาหารก่อนตามที่ระบบประเมินเลยนะ${politeParticle} เดี๋ยวหมอจะเปิดคิวห้องตรวจด่วนรอรับน้องไว้ให้เลย${politeParticle} คุณเจ้าของสะดวกพาน้องเข้ามาตรวจที่สาขาไหนดี${politeParticle}?`
          : 'สวัสดีค่ะคุณเจ้าของ หมอลลิตานะคะ จากอาการที่แจ้ง หมอแนะนำให้งดน้ำและอาหารก่อนตามที่ระบบประเมินเลยนะคะ เดี๋ยวหมอจะเปิดคิวห้องตรวจด่วนรอรับน้องไว้ให้เลยค่ะ คุณเจ้าของสะดวกพาน้องเข้ามาตรวจที่สาขาไหนคะ?',
      };
    }

    // 🟢 General Wellness
    return {
      level: 'green' as const,
      alertTitle: 'ผลประเมินสุขภาพทั่วไป',
      alertBadge: 'สุขภาพทั่วไป (Green Status)',
      suspectedConditions: [
        'การตรวจสุขภาพประจำปี / การรับวัคซีนป้องกันโรคตามช่วงวัย',
        'ปรึกษาแนวทางการบริบาลและเวชศาสตร์ป้องกันสัตว์เลี้ยง',
      ],
      firstAidInstructions: [
        'สังเกตพฤติกรรมการกิน การขับถ่าย และความร่าเริงตามปกติ',
        'สามารถนัดหมายเวลาที่สะดวกเข้ามาตรวจสุขภาพหรือฉีดวัคซีนได้เลยค่ะ',
      ],
      recommendedService: currentDept ? currentDept.departmentTitle : 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
      doctorReply: currentDept
        ? `สวัสดี${politeParticle}คุณเจ้าของ ${attendingDocName}${politeParticle} ยินดีให้คำปรึกษาและดูแลน้อง${politeParticle} สามารถกดนัดหมายเวลาที่สะดวกด้านล่าง หรือสอบถามข้อมูลเพิ่มเติมได้เลยนะ${politeParticle}`
        : 'สวัสดีค่ะคุณเจ้าของ หมอลลิตานะคะ ยินดีให้คำปรึกษาและดูแลน้องค่ะ สามารถกดนัดหมายเวลาที่สะดวกด้านล่าง หรือสอบถามข้อมูลเพิ่มเติมได้เลยนะคะ',
    };
  };

  const handleSendVaccineConsultation = useCallback((vacData: VaccineConsultData) => {
    if (!isLoggedIn) {
      onRequireAuth?.();
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-vac-${Date.now()}`,
      sender: 'user',
      text: vacData.vaccineName,
      timestamp: timeStr,
      isVaccineCard: true,
      vaccineData: vacData,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTypingLabel('สัตวแพทย์เวรกำลังตรวจสอบประวัติวัคซีน...');
    setShowVaccinePicker(false);

    const t = window.setTimeout(() => {
      const doctorMsg: ChatMessage = {
        id: `doctor-vac-${Date.now()}`,
        sender: 'doctor',
        senderName: vacData.veterinarian || 'สพ.ญ. ลลิตา บุญประเสริฐ (สัตวแพทย์เวรประจำการ)',
        doctorAvatar: '/images/vets/vet_official_female_1.jpg',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `สวัสดีค่ะคุณเจ้าของ หมอตรวจเช็กประวัติวัคซีนของ ${vacData.petName} ให้แล้วนะคะ สำหรับรายการ "${vacData.vaccineName}" ที่มีกำหนดนัด ${vacData.dueDate ? new Date(vacData.dueDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'เร็วๆ นี้'}:

• การเตรียมตัวก่อนฉีด: สังเกตน้องต้องไม่มีไข้ ไม่ซึม กินอาหารและขับถ่ายปกติ และไม่อยู่ระหว่างรับประทานยาปฏิชีวนะ
• ข้อควรระวัง: งดอาบน้ำ 48 ชม. ทั้งก่อนและหลังฉีดวัคซีน เพื่อป้องกันภาวะภูมิคุ้มกันตกชั่วคราว
• คำแนะนำ: หากสะดวกวันนัด สามารถกดปุ่มจองคิวตรวจล่วงหน้าเพื่อเตรียมวัคซีนและลดเวลาการรอน้องเครียดได้เลยนะคะ`,
        isVaccineCard: true,
        vaccineData: vacData,
      };
      setMessages((prev) => [...prev, doctorMsg]);
      setIsTyping(false);
    }, 1300);

    timeoutsRef.current.push(t);
  }, [isLoggedIn, onRequireAuth]);

  // Handle incoming vaccine context from Pet Health Passport Modal
  useEffect(() => {
    if (isOpen && initialVaccineContext) {
      const timer = setTimeout(() => {
        handleSendVaccineConsultation(initialVaccineContext);
        onClearInitialVaccineContext?.();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialVaccineContext, handleSendVaccineConsultation, onClearInitialVaccineContext]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    const imageToSend = selectedImage;
    if (!text && !imageToSend) return;

    // Intercept if unauthenticated: prompt sign-in before allowing message dispatch
    if (!isLoggedIn) {
      if (text) {
        setPendingMessage(text);
        setInputValue(text);
      }
      onRequireAuth?.();
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message with optional image
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || 'ส่งรูปถ่ายอาการสัตว์เลี้ยง',
      imageUrl: imageToSend || undefined,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setSelectedImage(null);
    setIsTyping(true);
    setTypingLabel(
      activeDepartment
        ? `${activeDepartment.doctorName} กำลังพิมพ์ตอบกลับ...`
        : 'ระบบ AI กำลังประเมินภาพและอาการ...'
    );

    const triage = analyzeTriage(text, activeDepartment);

    // 2. Add AI Triage Holding Message + Triage Recommendation Card (after 1.2s)
    const t1 = window.setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        senderName: 'ระบบ AI คัดกรองอัตโนมัติ',
        text: 'สวัสดีครับคุณเจ้าของ ขณะนี้ระบบ AI ได้รับข้อมูลแล้ว เนื่องจากขณะนี้มีผู้ติดต่อจำนวนมาก ระบบขอประเมินอาการเบื้องต้นให้ระหว่างรอทีมสัตวแพทย์เข้ามาตอบข้อความสักครู่นะครับ',
        timestamp: timeStr,
        isTriageCard: true,
        triageData: {
          alertTitle: triage.alertTitle,
          alertBadge: triage.alertBadge,
          alertLevel: triage.level,
          suspectedConditions: triage.suspectedConditions,
          firstAidInstructions: triage.firstAidInstructions,
          recommendedService: triage.recommendedService,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
      setTypingLabel(
        activeDepartment
          ? `${activeDepartment.doctorName} กำลังพิมพ์ตอบกลับ...`
          : 'สพ.ญ. ลลิตา (สัตวแพทย์เวร) กำลังพิมพ์ตอบกลับ...'
      );

      // 3. Add Doctor Real Response Message (after another 1.8s)
      const t2 = window.setTimeout(() => {
        setIsTyping(false);
        const doctorMsg: ChatMessage = {
          id: `doc-${Date.now()}`,
          sender: 'doctor',
          senderName: activeDepartment
            ? `${activeDepartment.doctorName} (${activeDepartment.doctorTitle})`
            : 'สพ.ญ. ลลิตา บุญประเสริฐ (สัตวแพทย์เวรประจำการ)',
          doctorAvatar: activeDepartment?.doctorAvatar || '/images/vets/vet_female_cat.jpg',
          text: triage.doctorReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, doctorMsg]);
      }, 1800);

      timeoutsRef.current.push(t2);
    }, 1200);

    timeoutsRef.current.push(t1);
  };

  const handleSendMessageRef = useRef(handleSendMessage);
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  // Auto-send pending symptom message once user logs in
  useEffect(() => {
    if (isLoggedIn && pendingMessage) {
      const msg = pendingMessage;
      const timer = setTimeout(() => {
        setPendingMessage(null);
        handleSendMessageRef.current(msg);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, pendingMessage]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={widgetRef}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.96 }}
      transition={{ duration: 0.35, ease: EASE_SPRING }}
      role="dialog"
      aria-label="ห้องสนทนาและประเมินอาการสัตว์เลี้ยงตลอด 24 ชม."
      className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-20 sm:right-6 w-auto sm:w-[410px] h-[580px] sm:h-[620px] max-h-[88vh] bg-background-primary-default border border-border-button-default rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden ring-1 ring-border-button-default"
    >
      {/* =====================================================================
          Chat Navigation Header (Identical to Phone Mockup Header)
          ===================================================================== */}
      <div className="px-3.5 py-2.5 border-b border-border-button-default bg-background-primary-default/95 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img
              src={activeDepartment?.doctorAvatar || "/images/vets/vet_female_cat.jpg"}
              alt={activeDepartment?.doctorName || "สพ.ญ. ลลิตา บุญประเสริฐ สัตวแพทย์เวร"}
              className="size-8 rounded-full object-cover ring-1.5 ring-emerald-500/40 shadow-2xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background-primary-default" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-caption-1-semibold text-text-primary whitespace-nowrap truncate max-w-[150px] sm:max-w-[200px]" title={activeDepartment?.departmentTitle || "ศูนย์เวชศาสตร์ฉุกเฉิน"}>
                {activeDepartment ? activeDepartment.departmentTitle : "ศูนย์เวชศาสตร์ฉุกเฉิน"}
              </span>
              <Badge color="primary" className="text-caption-2-medium py-0 px-1 shrink-0 whitespace-nowrap">
                {activeDepartment ? "เฉพาะทาง" : "24 ชม."}
              </Badge>
            </div>
            <span className="text-caption-2-regular text-text-secondary flex items-center gap-1 truncate">
              {isTyping ? (
                <span className="text-accent-600 dark:text-accent-400 font-medium animate-pulse truncate">
                  {typingLabel}
                </span>
              ) : (
                <>
                  <RiShieldCrossLine className="size-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate">
                    {activeDepartment ? activeDepartment.doctorTitle : "ทีมสัตวแพทย์เวรประจำการ"}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={resetChat}
            title="ล้างแชทและเริ่มใหม่"
            className="flex size-7 items-center justify-center rounded-full text-foreground-icon-secondary hover:text-foreground-icon-primary hover:bg-background-secondary-default transition-colors cursor-pointer"
          >
            <RiRefreshLine className="size-3.5" />
          </button>
          <ButtonLink
            href="tel:028889999"
            variant="danger"
            size="xs"
            leadingIcon={RiPhoneLine}
            className="rounded-full px-2 py-1 text-caption-2-medium"
            title="โทรหาสัตวแพทย์ฉุกเฉิน 24 ชม."
          >
            โทรด่วน
          </ButtonLink>
          <button
            type="button"
            onClick={onClose}
            title="ปิดหน้าต่างแชท"
            className="flex size-7 items-center justify-center rounded-full text-text-tertiary hover:text-text-primary hover:bg-background-secondary-default transition-colors cursor-pointer ms-0.5"
          >
            <RiCloseLine className="size-4.5" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          Chat Messages Feed (Spring Animated Feed matching Phone Mockup)
          ===================================================================== */}
      <div
        ref={chatScrollRef}
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2.5 text-caption-1-regular scroll-smooth flex flex-col bg-background-full"
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            /* Empty State / Recommendation Pills */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE_SPRING }}
              className="my-auto flex flex-col items-center gap-3 text-center px-2 py-4"
            >
              <div className="flex flex-col gap-1 items-center">
                <div className="size-9 rounded-2xl bg-accent-500/10 text-accent-600 flex items-center justify-center mb-0.5">
                  <RiUserHeartLine className="size-4.5" />
                </div>
                <h2 className="text-title-3-semibold text-text-primary tracking-tight">
                  {activeDepartment ? activeDepartment.departmentTitle : 'ปรึกษาอาการสัตว์เลี้ยง 24 ชม.'}
                </h2>
                <p className="text-caption-2-regular text-text-secondary max-w-[260px]">
                  {activeDepartment ? activeDepartment.greetingPrompt : 'ระบบ AI ช่วยบันทึกอาการเบื้องต้น เพื่อส่งต่อให้ทีมสัตวแพทย์เวรตอบกลับจริงทันที'}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1.5 pt-1 w-full max-w-[290px]">
                {/* Pet Vaccine Quick Chips using exact vaccine name (Only when logged in and no department selected) */}
                {isLoggedIn && !activeDepartment &&
                  passports.flatMap((pet) =>
                    pet.vaccines.map((vac) => (
                    <button
                      key={`${pet.id}-${vac.id}`}
                      type="button"
                      onClick={() =>
                        handleSendVaccineConsultation({
                          petName: pet.name,
                          breed: pet.breed,
                          vaccineName: vac.name,
                          dueDate: vac.dueDate,
                          veterinarian: vac.veterinarian,
                          status: vac.status,
                        })
                      }
                      className="w-full flex items-center justify-between rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-caption-2-medium shadow-2xs transition-all hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <RiMedicineBottleLine className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{vac.name}</span>
                      </div>
                      {vac.dueDate && (
                        <span className="text-caption-2-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0 ms-2">
                          {vac.dueDate}
                        </span>
                      )}
                    </button>
                  ))
                )}

                {(activeDepartment?.quickSymptoms || SUGGESTIONS).map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSendMessage(suggestion)}
                    className={cx(
                      'w-full rounded-full border px-3 py-1.5 text-caption-2-regular shadow-2xs transition-all text-center cursor-pointer',
                      index === 0
                        ? 'bg-accent-500/10 border-accent-500/30 text-accent-700 dark:text-accent-300 font-medium hover:bg-accent-500/20'
                        : 'bg-background-primary-default border-border-button-default text-text-secondary hover:text-text-primary hover:border-accent-300'
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div key="messages-list" className="space-y-2.5">
              <div className="text-center my-1">
                <span className="text-caption-2-regular text-text-tertiary bg-background-secondary-default/80 px-2 py-0.5 rounded-full">
                  วันนี้ • มีสัตวแพทย์เวรประจำการ 24 ชม.
                </span>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.94, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.35, ease: EASE_SPRING }}
                    className={cx(
                      'flex flex-col max-w-[92%]',
                      msg.sender === 'user' ? 'ms-auto items-end' : 'me-auto items-start'
                    )}
                  >
                    {msg.sender === 'user' ? (
                      /* User Message Bubble */
                      <div className="bg-button-primary text-white px-3 py-2 rounded-2xl rounded-tr-xs shadow-xs text-caption-1-regular space-y-1.5">
                        {msg.imageUrl && (
                          <div className="rounded-xl overflow-hidden border border-white/25 max-h-48 shadow-2xs">
                            <img
                              src={msg.imageUrl}
                              alt="รูปถ่ายอาการสัตว์เลี้ยง"
                              className="w-full max-h-48 object-cover"
                            />
                          </div>
                        )}
                        {msg.isVaccineCard && msg.vaccineData && (
                          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-start space-y-1 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-caption-1-bold text-white">
                              <RiMedicineBottleLine className="size-3.5 shrink-0 text-amber-300" />
                              <span>{msg.vaccineData.vaccineName}</span>
                            </div>
                            <div className="text-caption-2-regular text-white/80 space-y-0.5 pt-0.5">
                              <div>• สัตว์เลี้ยง: {msg.vaccineData.petName} ({msg.vaccineData.breed})</div>
                              {msg.vaccineData.dueDate && (
                                <div>• กำหนดฉีด: {msg.vaccineData.dueDate}</div>
                              )}
                              {msg.vaccineData.veterinarian && (
                                <div>• สัตวแพทย์ประจำตัว: {msg.vaccineData.veterinarian}</div>
                              )}
                            </div>
                          </div>
                        )}
                        {msg.text && <div>{msg.text}</div>}
                      </div>
                    ) : msg.sender === 'doctor' ? (
                      /* Doctor Real Response Bubble */
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 ps-0.5">
                          <img
                            src={msg.doctorAvatar || activeDepartment?.doctorAvatar || "/images/vets/vet_female_cat.jpg"}
                            alt={msg.senderName || "สัตวแพทย์เวร"}
                            className="size-4 rounded-full object-cover ring-1 ring-emerald-500/40"
                          />
                          <span className="text-caption-2-semibold text-emerald-600 dark:text-emerald-400">
                            {msg.senderName}
                          </span>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white shadow-xs px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-caption-1-regular space-y-2">
                          <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                          {msg.isVaccineCard && (
                            <div className="pt-1.5 border-t border-white/20 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenBooking?.('ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน', msg.senderName);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-caption-2-medium hover:bg-emerald-50 transition-colors cursor-pointer shadow-xs font-semibold"
                              >
                                <RiCalendarCheckLine className="size-3.5 text-emerald-600" />
                                <span>จองคิวฉีดวัคซีนนี้ล่วงหน้า</span>
                              </button>
                            </div>
                          )}
                          {msg.quickSymptoms && msg.quickSymptoms.length > 0 && (
                            <div className="pt-2 space-y-1.5 border-t border-white/20">
                              <div className="text-caption-2-medium text-white/90 flex items-center gap-1 font-medium">
                                <RiSparklingLine className="size-3 text-emerald-200" />
                                <span>เลือกอาการที่พบบ่อย (แตะเพื่อส่งปรึกษาทันที):</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {msg.quickSymptoms.map((symptom, sIdx) => (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => handleSendMessage(symptom)}
                                    className="w-full text-start px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-caption-2-medium text-white transition-all cursor-pointer flex items-center justify-between gap-1.5 shadow-2xs group"
                                  >
                                    <span className="truncate">{symptom}</span>
                                    <RiArrowRightLine className="size-3 text-emerald-200 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Automated AI Triage Holding Message & Triage Card */
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center gap-1 ps-1 text-caption-2-regular text-text-tertiary">
                          <RiSparklingLine className="size-3 text-accent-500" />
                          <span>{msg.senderName}</span>
                        </div>
                        <div className="bg-background-secondary-default border border-border-button-default text-text-primary px-3 py-2 rounded-2xl rounded-tl-xs text-caption-1-regular">
                          {msg.text}
                        </div>

                        {/* =======================================================
                            Triage Recommendation Card (Identical to Phone Mockup)
                            ======================================================= */}
                        {msg.isTriageCard && msg.triageData && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2, ease: EASE_SPRING }}
                            className="bg-background-primary-default border border-border-button-default rounded-2xl p-2.5 shadow-md space-y-2 mt-1 overflow-hidden max-w-full"
                          >
                            {/* Urgency Badge Header */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-separator-border pb-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <RiAlertLine
                                  className={cx(
                                    'size-3.5 shrink-0',
                                    msg.triageData.alertLevel === 'red'
                                      ? 'text-status-rose-text'
                                      : msg.triageData.alertLevel === 'yellow'
                                      ? 'text-amber-500'
                                      : 'text-emerald-500'
                                  )}
                                />
                                <span className="text-caption-2-semibold text-text-primary leading-tight">
                                  {msg.triageData.alertTitle}
                                </span>
                              </div>
                              <span
                                className={cx(
                                  'inline-flex items-center rounded-full px-2 py-0.5 text-caption-2-medium border max-w-full',
                                  msg.triageData.alertLevel === 'red'
                                    ? 'bg-status-rose-background border-status-rose-border text-status-rose-text'
                                    : msg.triageData.alertLevel === 'yellow'
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                )}
                              >
                                <span className="truncate">{msg.triageData.alertBadge}</span>
                              </span>
                            </div>

                            {/* Suspected Diagnoses */}
                            <div className="space-y-0.5">
                              <span className="text-caption-2-regular text-text-tertiary">
                                ข้อสันนิษฐานอาการ:
                              </span>
                              <ul className="text-caption-2-regular text-text-secondary space-y-0.5 ps-0.5">
                                {msg.triageData.suspectedConditions.map((cond, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    {i === 0 ? (
                                      <RiHeartPulseLine className="size-3 text-accent-500 shrink-0 mt-0.5" />
                                    ) : (
                                      <RiStethoscopeLine className="size-3 text-accent-500 shrink-0 mt-0.5" />
                                    )}
                                    <span>{cond}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Care Instructions */}
                            <div className="bg-background-secondary-default rounded-xl p-2 border border-separator-border space-y-0.5">
                              <span className="text-caption-2-medium text-text-primary flex items-center gap-1">
                                <RiCheckLine className="size-3 text-emerald-500" />
                                คำแนะนำปฐมพยาบาลเบื้องต้น:
                              </span>
                              <p className="text-caption-2-regular text-text-secondary leading-snug">
                                {msg.triageData.firstAidInstructions.map((ins, i) => (
                                  <React.Fragment key={i}>
                                    • {ins}
                                    {i < msg.triageData!.firstAidInstructions.length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </p>
                            </div>

                            {/* Action Buttons inside Triage Card */}
                            <div className="pt-0.5 flex flex-col gap-1">
                              <Button
                                variant="primary"
                                size="xs"
                                leadingIcon={RiCalendarCheckLine}
                                onClick={() => {
                                  onOpenBooking?.(msg.triageData?.recommendedService);
                                  onClose();
                                }}
                                className="w-full justify-center text-caption-2-medium py-1"
                              >
                                จองคิวตรวจสัตวแพทย์ด่วน
                              </Button>
                              <ButtonLink
                                href="tel:028889999"
                                variant="secondary"
                                size="xs"
                                leadingIcon={RiPhoneLine}
                                className="w-full justify-center text-caption-2-medium py-1 text-status-rose-text"
                              >
                                สายด่วนฉุกเฉิน 24 ชม.
                              </ButtonLink>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                    <span className="text-caption-2-regular text-text-tertiary mt-0.5 px-1">{msg.timestamp}</span>
                  </motion.div>
                ))}

                {/* Typing Indicator Bubble with Staggered Bouncing Dots */}
                {isTyping && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.92 }}
                    transition={{ duration: 0.25, ease: EASE_SPRING }}
                    className="me-auto flex items-center gap-1.5 bg-background-secondary-default border border-border-button-default px-3 py-1.5 rounded-2xl rounded-tl-xs shadow-xs"
                  >
                    <span className="text-caption-2-regular text-text-secondary">{typingLabel}</span>
                    <div className="flex items-center gap-1 ps-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="size-1.5 rounded-full bg-accent-500"
                          animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================================
          Chat Composer (Identical to Phone Mockup with Working Image Attachment)
          ===================================================================== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-background-primary-default border-t border-border-button-default shrink-0"
      >
        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Pet Vaccine Schedule Selector Drawer */}
        {showVaccinePicker && (
          <div className="mb-2 p-2.5 rounded-2xl bg-background-secondary-default border border-border-button-default animate-fade-in space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border-button-default">
              <div className="flex items-center gap-1.5 text-caption-2-semibold text-text-primary">
                <RiMedicineBottleLine className="size-3.5 text-emerald-500 shrink-0" />
                <span>เลือกวัคซีนที่ต้องการปรึกษา</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVaccinePicker(false)}
                className="text-text-tertiary hover:text-text-primary text-caption-2-regular cursor-pointer px-1 py-0.5"
              >
                ปิด
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-0.5">
              {passports.flatMap((pet) =>
                pet.vaccines.map((vac) => ({ pet, vac }))
              ).length === 0 ? (
                <p className="text-caption-2-regular text-text-tertiary text-center py-2">
                  ไม่พบรายการวัคซีนในสมุดสุขภาพสัตว์เลี้ยง
                </p>
              ) : (
                passports.flatMap((pet) =>
                  pet.vaccines.map((vac) => (
                    <button
                      key={`${pet.id}-${vac.id}`}
                      type="button"
                      onClick={() =>
                        handleSendVaccineConsultation({
                          petName: pet.name,
                          breed: pet.breed,
                          vaccineName: vac.name,
                          dueDate: vac.dueDate,
                          veterinarian: vac.veterinarian,
                          status: vac.status,
                        })
                      }
                      className="w-full text-start p-2 rounded-xl bg-background-primary-default border border-border-button-default hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors cursor-pointer group flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-caption-1-semibold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                          {vac.name}
                        </div>
                        <div className="text-caption-2-regular text-text-tertiary flex items-center gap-2 flex-wrap">
                          <span>{pet.name}</span>
                          {vac.dueDate && (
                            <span className="font-medium text-text-secondary">
                              นัด: {vac.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-caption-2-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        ปรึกษา
                      </span>
                    </button>
                  ))
                )
              )}
            </div>
          </div>
        )}

        {/* Selected Image Thumbnail Preview with Remove Button */}
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 p-1.5 rounded-2xl bg-background-secondary-default border border-border-button-default animate-fade-in">
            <div className="relative size-11 rounded-xl overflow-hidden shrink-0 border border-border-button-default">
              <img
                src={selectedImage}
                alt="รูปถ่ายอาการสัตว์เลี้ยง"
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-0.5 right-0.5 size-4 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-black cursor-pointer transition-colors"
                title="ลบรูปภาพ"
              >
                <RiCloseLine className="size-3" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-caption-2-semibold text-text-primary truncate">
                แนบรูปถ่ายอาการสัตว์เลี้ยงแล้ว
              </p>
              <p className="text-caption-2-regular text-text-tertiary truncate">
                กดส่งเพื่อให้สัตวแพทย์เวรช่วยดูรอยโรค
              </p>
            </div>
          </div>
        )}

        <div className="flex h-[40px] w-full items-center gap-1.5 rounded-full p-1 bg-background-secondary-default border border-border-button-default">
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setShowVaccinePicker((prev) => !prev)}
              title="เลือกวัคซีนในสมุดสุขภาพสัตว์เลี้ยง"
              className={cx(
                "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                showVaccinePicker
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "text-foreground-icon-secondary hover:text-foreground-icon-primary hover:bg-background-tertiary-default"
              )}
            >
              <RiMedicineBottleLine className="size-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn) {
                onRequireAuth?.();
                return;
              }
              fileInputRef.current?.click();
            }}
            title="แนบรูปถ่ายอาการสัตว์เลี้ยง (แผล, ผื่น, อาเจียน)"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-foreground-icon-secondary hover:text-foreground-icon-primary hover:bg-background-tertiary-default transition-colors cursor-pointer"
          >
            <RiAttachment2 className="size-3.5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedImage
                ? "พิมพ์คำอธิบายภาพรอยโรคหรืออาการ..."
                : activeDepartment
                ? `พิมพ์สอบถามอาการ${activeDepartment.departmentTitle}...`
                : "พิมพ์สอบถามอาการสัตว์เลี้ยง..."
            }
            className="h-full min-w-0 flex-1 bg-transparent text-caption-1-regular text-text-primary placeholder:text-text-tertiary outline-none"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() && !selectedImage}
            className={cx(
              'flex size-7 shrink-0 items-center justify-center rounded-full text-white transition-opacity cursor-pointer',
              inputValue.trim().length > 0 || selectedImage
                ? 'bg-button-primary opacity-100 hover:opacity-90'
                : 'bg-background-tertiary-default text-text-tertiary opacity-50 cursor-not-allowed'
            )}
            title="ส่งข้อความ"
            aria-label="ส่งข้อความ"
          >
            <RiArrowUpLine className="size-3.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
