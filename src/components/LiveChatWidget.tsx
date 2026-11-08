import React, { useState, useRef, useEffect } from 'react';
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
} from '@remixicon/react';
import { getStoredPassports } from '../data/petPassportData';
import type { PetPassport } from '../types/petPassport';

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
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: (serviceName?: string, doctorName?: string) => void;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  initialVaccineContext?: VaccineConsultData | null;
  onClearInitialVaccineContext?: () => void;
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
  onRequireAuth,
  initialVaccineContext,
  onClearInitialVaccineContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState('พญ. สุภัทรา (สัตวแพทย์เวร) กำลังพิมพ์ตอบกลับ...');
  const [showVaccinePicker, setShowVaccinePicker] = useState(false);
  const [passports, setPassports] = useState<PetPassport[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      clearAllTimeouts();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resetChat = () => {
    clearAllTimeouts();
    setMessages([]);
    setInputValue('');
    setSelectedImage(null);
    setShowVaccinePicker(false);
    setIsTyping(false);
  };

  // Sync pet passports on open
  useEffect(() => {
    if (isOpen) {
      setPassports(getStoredPassports());
    }
  }, [isOpen]);

  // Handle incoming vaccine context from Pet Health Passport Modal
  useEffect(() => {
    if (isOpen && initialVaccineContext) {
      handleSendVaccineConsultation(initialVaccineContext);
      onClearInitialVaccineContext?.();
    }
  }, [isOpen, initialVaccineContext]);

  const analyzeTriage = (query: string) => {
    const lower = query.toLowerCase();

    // 🔴 Critical Red Alert Keywords
    if (
      lower.includes('ไม่หายใจ') ||
      lower.includes('หยุดหายใจ') ||
      lower.includes('ช็อก') ||
      lower.includes('ฉี่ไม่ออก') ||
      lower.includes('ปัสสาวะไม่ออก') ||
      lower.includes('กระเพาะบิด') ||
      lower.includes('ชัก') ||
      lower.includes('รถชน') ||
      lower.includes('ตกตึก') ||
      lower.includes('เลือดไหลไม่หยุด') ||
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
        doctorReply:
          'หมอสุภัทรา (เวรฉุกเฉิน 24 ชม.) ได้รับข้อมูลแล้วค่ะ! อาการนี้น้องมีความเสี่ยงวิกฤตสูงมาก หมอเตรียมทีมกู้ชีพและอุปกรณ์รองรับไว้ให้ทันที แนะนำให้รีบพาน้องเข้ามาโรงพยาบาลด่วน หรือกดโทรตรงเข้าห้องฉุกเฉินได้เลยนะคะ',
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
        recommendedService: 'บริการตรวจวินิจฉัยและรักษาอายุรกรรม',
        doctorReply:
          'สวัสดีค่ะคุณเจ้าของ หมอสุภัทรานะคะ จากอาการที่แจ้ง หมอแนะนำให้งดน้ำและอาหารก่อนตามที่ระบบประเมินเลยนะคะ เดี๋ยวหมอจะเปิดคิวห้องตรวจด่วนรอรับน้องไว้ให้เลยค่ะ คุณเจ้าของสะดวกพาน้องเข้ามาตรวจที่สาขาไหนคะ?',
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
      recommendedService: 'ศูนย์ตรวจสุขภาพและเวชศาสตร์ป้องกัน',
      doctorReply:
        'สวัสดีค่ะคุณเจ้าของ หมอสุภัทรานะคะ ยินดีให้คำปรึกษาและดูแลน้องค่ะ สามารถกดนัดหมายเวลาที่สะดวกด้านล่าง หรือสอบถามข้อมูลเพิ่มเติมได้เลยนะคะ',
    };
  };

  const handleSendVaccineConsultation = (vacData: VaccineConsultData) => {
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
        senderName: vacData.veterinarian || 'พญ. สุภัทรา (สัตวแพทย์เวร)',
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
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    const imageToSend = selectedImage;
    if (!text && !imageToSend) return;

    // Intercept if unauthenticated: prompt sign-in before allowing message dispatch
    if (!isLoggedIn) {
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
    setTypingLabel('ระบบ AI กำลังประเมินภาพและอาการ...');

    const triage = analyzeTriage(text);

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
      setTypingLabel('พญ. สุภัทรา (สัตวแพทย์เวร) กำลังพิมพ์ตอบกลับ...');

      // 3. Add Doctor Real Response Message (after another 1.8s)
      const t2 = window.setTimeout(() => {
        setIsTyping(false);
        const doctorMsg: ChatMessage = {
          id: `doc-${Date.now()}`,
          sender: 'doctor',
          senderName: 'พญ. สุภัทรา (สัตวแพทย์เวรประจำการ)',
          text: triage.doctorReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, doctorMsg]);
      }, 1800);

      timeoutsRef.current.push(t2);
    }, 1200);

    timeoutsRef.current.push(t1);
  };

  if (!isOpen) return null;

  return (
    <motion.div
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
              src="/images/vets/vet_female_cat.jpg"
              alt="พญ. สุภัทรา สัตวแพทย์เวร"
              className="size-8 rounded-full object-cover ring-1.5 ring-emerald-500/40 shadow-2xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background-primary-default" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[12px] font-semibold text-text-primary whitespace-nowrap">
                ศูนย์เวชศาสตร์ฉุกเฉิน
              </span>
              <Badge color="primary" className="text-[9px] py-0 px-1 shrink-0 whitespace-nowrap">
                24 ชม.
              </Badge>
            </div>
            <span className="text-[10px] text-text-secondary flex items-center gap-1 truncate">
              {isTyping ? (
                <span className="text-accent-600 dark:text-accent-400 font-medium animate-pulse truncate">
                  {typingLabel}
                </span>
              ) : (
                <>
                  <RiShieldCrossLine className="size-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate">ทีมสัตวแพทย์เวรประจำการ</span>
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
            className="rounded-full px-2 py-1 text-[11px]"
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
                  ปรึกษาอาการสัตว์เลี้ยง 24 ชม.
                </h2>
                <p className="text-[11px] text-text-secondary max-w-[260px] leading-relaxed">
                  ระบบ AI ช่วยบันทึกอาการเบื้องต้น เพื่อส่งต่อให้ทีมสัตวแพทย์เวรตอบกลับจริงทันที
                </p>
              </div>

              <div className="flex flex-col items-center gap-1.5 pt-1 w-full max-w-[290px]">
                {/* Pet Vaccine Quick Chips using exact vaccine name (Only when logged in) */}
                {isLoggedIn &&
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
                      className="w-full flex items-center justify-between rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] shadow-2xs transition-all hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-medium cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <RiMedicineBottleLine className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{vac.name}</span>
                      </div>
                      {vac.dueDate && (
                        <span className="text-[9.5px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-semibold shrink-0 ms-2">
                          {vac.dueDate}
                        </span>
                      )}
                    </button>
                  ))
                )}

                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSendMessage(suggestion)}
                    className={cx(
                      'w-full rounded-full border px-3 py-1.5 text-[11px] shadow-2xs transition-all text-center cursor-pointer',
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
                <span className="text-[10px] text-text-tertiary bg-background-secondary-default/80 px-2 py-0.5 rounded-full">
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
                      <div className="bg-button-primary text-white px-3 py-2 rounded-2xl rounded-tr-xs shadow-xs text-caption-1-regular leading-relaxed text-[12px] space-y-1.5">
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
                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-white">
                              <RiMedicineBottleLine className="size-3.5 shrink-0 text-amber-300" />
                              <span>{msg.vaccineData.vaccineName}</span>
                            </div>
                            <div className="text-[10px] text-white/80 space-y-0.5 pt-0.5">
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
                            src="/images/vets/vet_female_cat.jpg"
                            alt="พญ. สุภัทรา"
                            className="size-4 rounded-full object-cover ring-1 ring-emerald-500/40"
                          />
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {msg.senderName}
                          </span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/25 text-text-primary px-3 py-2 rounded-2xl rounded-tl-xs text-caption-1-regular leading-relaxed text-[12px] space-y-2">
                          <div className="whitespace-pre-line">{msg.text}</div>
                          {msg.isVaccineCard && (
                            <div className="pt-1 border-t border-emerald-500/20 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenBooking?.('ตรวจสุขภาพทั่วไปและฉีดวัคซีน', msg.senderName);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-button-primary text-white text-[11px] font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                              >
                                <RiCalendarCheckLine className="size-3.5" />
                                <span>จองคิวฉีดวัคซีนนี้ล่วงหน้า</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Automated AI Triage Holding Message & Triage Card */
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center gap-1 ps-1 text-[10px] text-text-tertiary">
                          <RiSparklingLine className="size-3 text-accent-500" />
                          <span>{msg.senderName}</span>
                        </div>
                        <div className="bg-background-secondary-default border border-border-button-default text-text-primary px-3 py-2 rounded-2xl rounded-tl-xs text-caption-1-regular leading-relaxed text-[12px]">
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
                            className="bg-background-primary-default border border-border-button-default rounded-2xl p-2.5 shadow-md space-y-2 mt-1"
                          >
                            {/* Urgency Badge Header */}
                            <div className="flex items-center justify-between gap-2 border-b border-separator-border pb-1.5">
                              <div className="flex items-center gap-1.5 shrink-0">
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
                                <span className="text-[11px] font-semibold text-text-primary">
                                  {msg.triageData.alertTitle}
                                </span>
                              </div>
                              <span
                                className={cx(
                                  'inline-flex items-center shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium border',
                                  msg.triageData.alertLevel === 'red'
                                    ? 'bg-status-rose-background border-status-rose-border text-status-rose-text'
                                    : msg.triageData.alertLevel === 'yellow'
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                )}
                              >
                                {msg.triageData.alertBadge}
                              </span>
                            </div>

                            {/* Suspected Diagnoses */}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-text-tertiary">
                                ข้อสันนิษฐานอาการ:
                              </span>
                              <ul className="text-[11px] text-text-secondary space-y-0.5 ps-0.5">
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
                              <span className="text-[11px] text-text-primary font-medium flex items-center gap-1">
                                <RiCheckLine className="size-3 text-emerald-500" />
                                คำแนะนำปฐมพยาบาลเบื้องต้น:
                              </span>
                              <p className="text-[10.5px] text-text-secondary leading-snug">
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
                                className="w-full justify-center text-[11px] py-1 font-bold"
                              >
                                จองคิวตรวจสัตวแพทย์ด่วน
                              </Button>
                              <ButtonLink
                                href="tel:028889999"
                                variant="secondary"
                                size="xs"
                                leadingIcon={RiPhoneLine}
                                className="w-full justify-center text-[11px] py-1 text-status-rose-text font-bold"
                              >
                                สายด่วนฉุกเฉิน 24 ชม.
                              </ButtonLink>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                    <span className="text-[9px] text-text-tertiary mt-0.5 px-1">{msg.timestamp}</span>
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
                    <span className="text-[11px] text-text-secondary">{typingLabel}</span>
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
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-primary">
                <RiMedicineBottleLine className="size-3.5 text-emerald-500 shrink-0" />
                <span>เลือกวัคซีนที่ต้องการปรึกษา</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVaccinePicker(false)}
                className="text-text-tertiary hover:text-text-primary text-[10px] cursor-pointer px-1 py-0.5"
              >
                ปิด
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-0.5">
              {passports.flatMap((pet) =>
                pet.vaccines.map((vac) => ({ pet, vac }))
              ).length === 0 ? (
                <p className="text-[11px] text-text-tertiary text-center py-2">
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
                        <div className="text-[11.5px] font-semibold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                          {vac.name}
                        </div>
                        <div className="text-[10px] text-text-tertiary flex items-center gap-2 flex-wrap">
                          <span>{pet.name}</span>
                          {vac.dueDate && (
                            <span className="font-medium text-text-secondary">
                              นัด: {vac.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
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
              <p className="text-[11px] font-semibold text-text-primary truncate">
                แนบรูปถ่ายอาการสัตว์เลี้ยงแล้ว
              </p>
              <p className="text-[10px] text-text-tertiary truncate">
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
            placeholder={selectedImage ? "พิมพ์คำอธิบายภาพรอยโรคหรืออาการ..." : "พิมพ์สอบถามอาการสัตว์เลี้ยง..."}
            className="h-full min-w-0 flex-1 bg-transparent text-[11.5px] text-text-primary placeholder:text-text-tertiary outline-none"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() && !selectedImage}
            className={cx(
              'flex size-7 shrink-0 items-center justify-center rounded-full text-white transition-opacity cursor-pointer',
              inputValue.trim().length > 0 || selectedImage
                ? 'bg-button-primary opacity-100 hover:opacity-90'
                : 'bg-neutral-300 dark:bg-neutral-700 opacity-50 cursor-not-allowed'
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
