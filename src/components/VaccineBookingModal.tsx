import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  RiCloseLine,
  RiCheckLine,
  RiCalendarEventLine,
  RiShieldCheckLine,
  RiMedicineBottleLine,
  RiMapPin2Line,
  RiTimeLine,
  RiUserLine,
  RiPhoneLine,
  RiInformationLine,
  RiStethoscopeLine,
  RiSparklingLine,
  RiEditLine,
} from '@remixicon/react';
import { PetPassport, VaccineRecord } from '../types/petPassport';
import { Button } from '@/components/base/buttons/button';
import { Avatar } from '@/components/base/avatar/avatar';
import { StatusDot } from '@/components/base/badges/status-dot';
import { DatePicker } from '@/components/base/date-picker/date-picker';
import { Select, SelectItem } from '@/components/base/select/select';
import { parseDate, today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { cx } from '@/utils/cx';
import { CatIcon, DogIcon, RabbitIcon, SmallPetIcon } from './icons/PetIcons';

export interface VaccineBookingDetails {
  refCode: string;
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  timeSlotLabel: string;
  branch: string;
  ownerName: string;
  ownerPhone: string;
  ownerLineId?: string;
  notes?: string;
  isReschedule?: boolean;
}

export interface VaccineBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetPassport;
  vaccine: VaccineRecord;
  currentUser?: { name: string; email: string } | null;
  onSuccessBooking?: (updatedPet: PetPassport, details: VaccineBookingDetails) => void;
  onViewPassport?: () => void;
}

const HOSPITAL_BRANCHES = [
  {
    id: 'thonglor',
    name: 'สาขาทองหล่อ (สำนักงานใหญ่ / Flagship 24 ชม.)',
    badge: 'เปิดตลอด 24 ชม.',
    address: 'ซอยสุขุมวิท 55 (ทองหล่อ ซอย 11)',
  },
  {
    id: 'kaset',
    name: 'สาขาเกษตร-นวมินทร์',
    badge: '08:00 - 22:00',
    address: 'ถนนประเสริฐมนูกิจ (ตรงข้าม นวมินทร์ ซิตี้ อเวนิว)',
  },
  {
    id: 'ratchapruek',
    name: 'สาขาราชพฤกษ์',
    badge: '08:00 - 22:00',
    address: 'ถนนราชพฤกษ์ (ตรงข้าม The Walk)',
  },
  {
    id: 'rama9',
    name: 'สาขาพระราม 9',
    badge: '08:00 - 24:00',
    address: 'ใกล้ทางด่วนศรีรัช - พระราม 9',
  },
  {
    id: 'bangna',
    name: 'สาขาบางนา',
    badge: '08:00 - 22:00',
    address: 'ถนนบางนา-ตราด กม. 4',
  },
];

interface TimeSlotOption {
  id: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  timeRange: string;
  description: string;
}

const TIME_SLOTS: TimeSlotOption[] = [
  {
    id: 'morning',
    title: 'ช่วงเช้า',
    timeRange: '09:00 - 12:00',
    description: 'เหมาะสำหรับสัตว์เลี้ยงที่ต้องงดอาหารก่อนตรวจ',
  },
  {
    id: 'afternoon',
    title: 'ช่วงบ่าย',
    timeRange: '13:00 - 17:00',
    description: 'ช่วงเวลาสงบ แมวไม่เครียด',
  },
  {
    id: 'evening',
    title: 'ช่วงค่ำ',
    timeRange: '17:00 - 20:00',
    description: 'สะดวกหลังเลิกงาน มีที่จอดรถพร้อม',
  },
  {
    id: 'night',
    title: 'รอบดึก 24 ชม.',
    timeRange: '20:00 - 24:00',
    description: 'ทีมสัตวแพทย์เวรพร้อมดูแลตลอดคืน',
  },
];

const getTodayLocalDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTomorrowLocalDateString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function safeParseCalendarDate(dateStr?: string): CalendarDate {
  const minCalDate = today(getLocalTimeZone());
  if (!dateStr) return minCalDate;
  try {
    const parsed = parseDate(dateStr);
    if (parsed.compare(minCalDate) < 0) {
      return minCalDate;
    }
    return parsed;
  } catch {
    return minCalDate;
  }
}

function getInitialTimeSlot(timeStr?: string): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (!timeStr) return 'morning';
  const lower = timeStr.toLowerCase();
  if (lower.includes('afternoon') || lower.includes('บ่าย') || lower.includes('13:00')) return 'afternoon';
  if (lower.includes('evening') || lower.includes('ค่ำ') || lower.includes('17:00')) return 'evening';
  if (lower.includes('night') || lower.includes('ดึก') || lower.includes('20:00') || lower.includes('24')) return 'night';
  return 'morning';
}

function getInitialBranch(branchStr?: string): string {
  if (!branchStr) return HOSPITAL_BRANCHES[0].name;
  const found = HOSPITAL_BRANCHES.find(
    (b) => b.name === branchStr || b.id === branchStr || branchStr.includes(b.name.slice(0, 10))
  );
  return found ? found.name : HOSPITAL_BRANCHES[0].name;
}

function getInitialSpecialNotes(notesStr?: string): string {
  if (!notesStr) return '';
  const match = notesStr.match(/\(หมายเหตุเจ้าของ:\s*(.*?)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
}

function getBoosterTypeLabel(vac: VaccineRecord): string {
  const text = `${vac.name} ${vac.notes || ''}`.toLowerCase();
  if (text.includes('ประจำปี') || text.includes('annual')) {
    return 'เข็มกระตุ้นประจำปี (Annual Booster)';
  }
  if (text.includes('กระตุ้น') || text.includes('booster')) {
    return 'เข็มกระตุ้นภูมิคุ้มกัน (Booster Dose)';
  }
  if (text.includes('fvrcp') || text.includes('รวม') || text.includes('core')) {
    return 'วัคซีนหลักจำเป็น (Core Vaccine)';
  }
  return 'เข็มกระตุ้นตามรอบนัด (Scheduled Dose)';
}

function getInitialPhone(currentUser?: { name: string; email: string } | null): string {
  if (typeof window === 'undefined') return '';
  try {
    const saved = localStorage.getItem('vetpaws_user_phone');
    if (saved && saved.trim()) return saved.trim();

    const raw = localStorage.getItem('vetpaws_appointments');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const last = parsed[0];
        if (last.rawPhone) return last.rawPhone;
      }
    }
  } catch {
    // ignore
  }
  if (currentUser?.email && currentUser.email.toLowerCase().includes('demo')) {
    return '0891234567';
  }
  return '';
}

export const VaccineBookingModal: React.FC<VaccineBookingModalProps> = ({
  isOpen,
  onClose,
  pet,
  vaccine,
  currentUser,
  onSuccessBooking,
  onViewPassport,
}) => {
  const isRescheduling = vaccine.status === 'scheduled' || !!vaccine.appointmentDate;
  const todayStr = useMemo(() => getTodayLocalDateString(), []);

  // Compute clean initial date: if appointmentDate or dueDate is valid and >= today, use it, else tomorrow
  const preferredDate = vaccine.appointmentDate || vaccine.dueDate;
  const initialDateStr = preferredDate && preferredDate >= todayStr
    ? preferredDate
    : getTomorrowLocalDateString();

  const [selectedDate, setSelectedDate] = useState<string>(initialDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | 'night'>(() =>
    getInitialTimeSlot(vaccine.appointmentTime)
  );
  const [selectedBranch, setSelectedBranch] = useState<string>(() =>
    getInitialBranch(vaccine.appointmentBranch)
  );
  const [ownerName, setOwnerName] = useState<string>(
    currentUser?.name || pet.ownerName || ''
  );
  const [ownerPhone, setOwnerPhone] = useState<string>(() => getInitialPhone(currentUser));
  const [ownerLineId, setOwnerLineId] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>(() =>
    getInitialSpecialNotes(vaccine.notes)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRefCode, setBookingRefCode] = useState<string>(vaccine.appointmentRefCode || '');

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const handleResetAndClose = useCallback(() => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setErrors({});
    onCloseRef.current();
  }, []);

  // Focus trap, initial focus, body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusableElements = Array.from(
          modalRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!modalRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            lastElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isOpen, handleResetAndClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!selectedDate) {
      nextErrors.selectedDate = 'กรุณาระบุวันที่ต้องการเข้ารับการฉีดวัคซีน';
    } else if (selectedDate < todayStr) {
      nextErrors.selectedDate = 'วันที่นัดหมายต้องไม่เป็นวันในอดีต';
    }

    if (!ownerName.trim()) {
      nextErrors.ownerName = 'กรุณาระบุชื่อผู้ติดต่อ / เจ้าของ';
    }

    if (!ownerPhone.trim()) {
      nextErrors.ownerPhone = 'กรุณาระบุเบอร์โทรศัพท์สำหรับติดต่อยืนยันคิว';
    } else if (!/^[0-9]{9,10}$/.test(ownerPhone.replace(/[-\s]/g, ''))) {
      nextErrors.ownerPhone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Preserve existing refCode on rescheduling, or create a new unique one
      const refCode = (isRescheduling && vaccine.appointmentRefCode)
        ? vaccine.appointmentRefCode
        : `VAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      setBookingRefCode(refCode);

      const activeSlot = TIME_SLOTS.find((s) => s.id === selectedTimeSlot);
      const timeSlotLabel = activeSlot ? `${activeSlot.title} (${activeSlot.timeRange})` : selectedTimeSlot;

      const details: VaccineBookingDetails = {
        refCode,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        timeSlotLabel,
        branch: selectedBranch,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerLineId: ownerLineId.trim() || undefined,
        notes: specialNotes.trim() || undefined,
        isReschedule: isRescheduling,
      };

      // Clean notes to avoid repetitive accumulation of appointment strings
      const cleanOriginalNotes = (vaccine.notes || '')
        .replace(/\s*•\s*นัดหมายแล้ว:.*$/, '')
        .replace(/\s*\(หมายเหตุเจ้าของ:.*?\)$/, '')
        .trim();
      const userNotes = specialNotes.trim() ? `(หมายเหตุเจ้าของ: ${specialNotes.trim()})` : '';
      const finalNotes = [cleanOriginalNotes, userNotes].filter(Boolean).join(' ');

      // Construct updated VaccineRecord with scheduled status
      const updatedVaccine: VaccineRecord = {
        ...vaccine,
        dueDate: vaccine.dueDate || selectedDate,
        status: 'scheduled',
        appointmentDate: selectedDate,
        appointmentTime: timeSlotLabel,
        appointmentBranch: selectedBranch,
        appointmentRefCode: refCode,
        notes: finalNotes || undefined,
      };

      // Construct updated PetPassport
      const updatedPet: PetPassport = {
        ...pet,
        vaccines: (pet.vaccines || []).map((v) => (v.id === vaccine.id ? updatedVaccine : v)),
      };

      // Save to localStorage vetpaws_appointments ledger & remember user phone
      try {
        if (ownerPhone.trim()) {
          localStorage.setItem('vetpaws_user_phone', ownerPhone.trim());
        }

        const raw = localStorage.getItem('vetpaws_appointments');
        const parsed = raw ? JSON.parse(raw) : [];
        const existing = Array.isArray(parsed) ? parsed : [];

        const maskPhone = (phone: string) => {
          const digits = phone.replace(/\D/g, '');
          if (digits.length >= 9) {
            return digits.slice(0, 3) + '****' + digits.slice(-3);
          }
          return '***';
        };

        const maskName = (name: string) => {
          const parts = name.trim().split(/\s+/);
          return parts.map((p) => (p.length > 1 ? p.charAt(0) + '***' : '***')).join(' ');
        };

        const newAppointment = {
          refCode,
          bookingType: 'vaccine',
          petType: pet.petType,
          petName: pet.name,
          petBreed: pet.breed,
          vaccineName: vaccine.name,
          boosterType: getBoosterTypeLabel(vaccine),
          serviceCategory: 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
          preferredDate: selectedDate,
          preferredTimeSlot: selectedTimeSlot,
          branch: selectedBranch,
          veterinarian: vaccine.veterinarian || 'สพ.ญ. ดร. นลิน พิพิธกุล',
          ownerName: maskName(ownerName),
          ownerPhone: maskPhone(ownerPhone),
          rawPhone: ownerPhone.trim(),
          specialNotes: specialNotes.trim() || undefined,
          updatedAt: new Date().toISOString(),
          createdAt: isRescheduling ? undefined : new Date().toISOString(),
        };

        // If rescheduling, update the existing appointment entry in place
        const existingIndex = existing.findIndex((a) => a.refCode === refCode);
        let updatedLedger: typeof existing;
        if (existingIndex >= 0) {
          updatedLedger = [...existing];
          updatedLedger[existingIndex] = {
            ...existing[existingIndex],
            ...newAppointment,
            createdAt: existing[existingIndex].createdAt || newAppointment.updatedAt,
          };
        } else {
          updatedLedger = [newAppointment, ...existing];
        }

        localStorage.setItem('vetpaws_appointments', JSON.stringify(updatedLedger));
      } catch (err) {
        console.error('Failed to log appointment to localStorage', err);
      }

      // Invoke callback if provided
      if (onSuccessBooking) {
        onSuccessBooking(updatedPet, details);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  const renderPetIcon = () => {
    switch (pet.petType) {
      case 'cat':
        return <CatIcon className="size-4" />;
      case 'dog':
        return <DogIcon className="size-4" />;
      case 'exotic':
        return <RabbitIcon className="size-4" />;
      default:
        return <SmallPetIcon className="size-4" />;
    }
  };

  const selectedSlotObj = TIME_SLOTS.find((s) => s.id === selectedTimeSlot);
  const boosterTypeLabel = getBoosterTypeLabel(vaccine);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vaccine-booking-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-background-primary-default border border-border-button-default rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border-button-default bg-background-secondary-default/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-accent-500/15 text-accent-700 dark:text-accent-300 flex items-center justify-center">
              {isRescheduling ? (
                <RiEditLine className="size-6 text-accent-600 dark:text-accent-400" />
              ) : (
                <RiMedicineBottleLine className="size-6 text-accent-600 dark:text-accent-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="vaccine-booking-modal-title"
                  className="text-title-3-semibold text-text-primary tracking-tight"
                >
                  {isSuccess
                    ? isRescheduling
                      ? 'บันทึกการเปลี่ยนวันนัดสำเร็จ'
                      : 'ยืนยันนัดหมายสำเร็จ'
                    : isRescheduling
                      ? 'เปลี่ยนวันนัดหมายฉีดวัคซีน'
                      : 'นัดหมายฉีดวัคซีนสัตว์เลี้ยง'}
                </h2>
                {!isSuccess && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-lime-background text-status-lime-text text-caption-2-medium border border-border-button-default">
                    <StatusDot color="green" />
                    <span>{isRescheduling ? 'เลื่อนหรือแก้ไขวันนัด' : 'ขั้นตอนเดียว ยืนยันทันที'}</span>
                  </span>
                )}
              </div>
              <p className="text-caption-1-regular text-text-secondary">
                VetPaws Fast-Track Vaccination Appointment & Passport Sync
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-background-secondary-default transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่างนัดหมายวัคซีน"
          >
            <RiCloseLine className="size-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {isSuccess ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="py-4 text-center space-y-5 animate-fade-in">
              <div className="size-16 rounded-full bg-status-lime-background text-status-lime-text flex items-center justify-center mx-auto border border-border-button-default shadow-xs">
                <RiCheckLine className="size-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-lime-background text-status-lime-text text-caption-1-semibold mb-2 border border-border-button-default">
                  <RiShieldCheckLine className="size-4" />
                  บันทึกลงสมุดวัคซีนดิจิทัลเรียบร้อย
                </span>
                <h3 className="text-title-2-medium text-text-primary">
                  {isRescheduling ? 'อัปเดตวันนัดหมายฉีดวัคซีนสำเร็จแล้ว' : 'นัดหมายฉีดวัคซีนสำเร็จแล้ว'}
                </h3>
                <p className="text-body-medium text-text-secondary mt-1">
                  รหัสอ้างอิงนัดหมาย:{' '}
                  <strong className="text-accent-600 dark:text-accent-400 text-title-3-semibold font-mono tracking-wide">
                    {bookingRefCode}
                  </strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-background-secondary-default/70 rounded-3xl p-5 text-left border border-border-button-default space-y-3.5 max-w-lg mx-auto">
                <div className="flex items-center gap-3 pb-3 border-b border-border-button-default">
                  {pet.avatarUrl ? (
                    <img
                      src={pet.avatarUrl}
                      alt={pet.name}
                      className="size-12 rounded-2xl object-cover border border-border-button-default"
                    />
                  ) : (
                    <Avatar initials={pet.name.slice(0, 2)} size="md" />
                  )}
                  <div>
                    <div className="text-body-2-semibold text-text-primary">{pet.name}</div>
                    <div className="text-caption-1-regular text-text-secondary">
                      {pet.breed} • ไมโครชิป: {pet.microchipNo}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-caption-1-medium">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-text-tertiary shrink-0">วัคซีน:</span>
                    <span className="font-semibold text-text-primary text-right">{vaccine.name}</span>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-text-tertiary shrink-0">ประเภทโดส:</span>
                    <span className="font-semibold text-text-primary text-right">{boosterTypeLabel}</span>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-text-tertiary shrink-0">วันและเวลานัด:</span>
                    <span className="font-semibold text-text-primary text-right">
                      {selectedDate} ({selectedSlotObj ? `${selectedSlotObj.title} ${selectedSlotObj.timeRange}` : selectedTimeSlot})
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-text-tertiary shrink-0">สาขาโรงพยาบาล:</span>
                    <span className="font-semibold text-text-primary text-right">{selectedBranch}</span>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-text-tertiary shrink-0">สัตวแพทย์ผู้รับผิดชอบ:</span>
                    <span className="font-semibold text-text-primary text-right">
                      {vaccine.veterinarian || 'สพ.ญ. ดร. นลิน พิพิธกุล'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-text-tertiary shrink-0">ผู้ติดต่อ:</span>
                    <span className="font-semibold text-text-primary text-right">
                      {ownerName} ({ownerPhone})
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions Reminder */}
              <div className="p-3.5 rounded-2xl bg-background-secondary-default border border-border-button-default text-caption-1-regular text-text-secondary max-w-lg mx-auto flex items-start gap-2.5 text-left">
                <RiInformationLine className="size-5 text-accent-500 shrink-0 mt-0.5" />
                <p>
                  ระบบได้บันทึกนัดหมายลงในสมุดวัคซีนดิจิทัลของน้องแล้ว เจ้าหน้าที่จะส่ง SMS / ข้อความแจ้งเตือนล่วงหน้า 1 วันก่อนถึงกำหนดนัด
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
                {onViewPassport && (
                  <Button
                    variant="primary"
                    size="medium"
                    leadingIcon={RiShieldCheckLine}
                    onClick={() => {
                      handleResetAndClose();
                      onViewPassport();
                    }}
                    className="flex-1 justify-center"
                  >
                    ดูในสมุดวัคซีนดิจิทัล
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={handleResetAndClose}
                  className="flex-1 justify-center"
                >
                  เสร็จสิ้น
                </Button>
              </div>
            </div>
          ) : (
            /* 1-STEP QUICK CONFIRMATION FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet & Vaccine Context Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-background-secondary-default/60 border border-border-button-default space-y-4">
                {/* Pet Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {pet.avatarUrl ? (
                      <img
                        src={pet.avatarUrl}
                        alt={pet.name}
                        className="size-13 rounded-2xl object-cover border border-border-button-default shadow-xs"
                      />
                    ) : (
                      <Avatar initials={pet.name.slice(0, 2)} size="md" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-body-2-semibold sm:text-title-3-semibold text-text-primary">
                          {pet.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background-primary-default text-text-secondary text-caption-2-medium border border-border-button-default">
                          {renderPetIcon()}
                          <span>{pet.petType === 'cat' ? 'แมว' : pet.petType === 'dog' ? 'สุนัข' : 'สัตว์เลี้ยง'}</span>
                        </span>
                      </div>
                      <p className="text-caption-1-regular text-text-secondary">
                        {pet.breed} • {pet.gender === 'male' ? 'เพศผู้' : 'เพศเมีย'} • อายุ {pet.age} • น้ำหนัก {pet.weight}
                      </p>
                    </div>
                  </div>

                  <div className="text-caption-2-regular text-text-tertiary bg-background-primary-default px-3 py-1.5 rounded-xl border border-border-button-default shrink-0 self-start sm:self-auto">
                    ไมโครชิป: <strong className="font-mono text-text-secondary">{pet.microchipNo}</strong>
                  </div>
                </div>

                {/* Vaccine Details Pillbox */}
                <div className="p-3.5 rounded-2xl bg-background-primary-default border border-border-button-default space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400">
                        <RiMedicineBottleLine className="size-4" />
                      </span>
                      <h4 className="text-body-2-semibold text-text-primary">
                        {vaccine.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-caption-2-medium text-accent-700 dark:text-accent-300 bg-accent-500/15 px-2.5 py-0.5 rounded-full border border-border-button-default">
                        <RiShieldCheckLine className="size-3 text-accent-600 dark:text-accent-400" />
                        <span>{boosterTypeLabel}</span>
                      </span>

                      {vaccine.dueDate && (
                        <span className="inline-flex items-center gap-1 text-caption-2-medium text-text-secondary bg-background-secondary-default px-2.5 py-0.5 rounded-full border border-border-button-default">
                          <RiCalendarEventLine className="size-3.5" />
                          <span>กำหนดเดิมตามรอบ: {vaccine.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption-1-regular text-text-secondary">
                    {vaccine.veterinarian && (
                      <span className="inline-flex items-center gap-1.5 text-text-tertiary">
                        <RiStethoscopeLine className="size-3.5 text-accent-500" />
                        <span>สัตวแพทย์ที่แนะนำ: <strong className="text-text-primary font-medium">{vaccine.veterinarian}</strong></span>
                      </span>
                    )}
                    {vaccine.notes && (
                      <span className="inline-flex items-center gap-1.5 text-text-tertiary">
                        <RiSparklingLine className="size-3.5 text-status-yellow-text" />
                        <span>{vaccine.notes}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields: Date & Time */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Date Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-caption-1-semibold text-text-primary">
                      1. วันที่ต้องการฉีดวัคซีน <span className="text-status-rose-text">*</span>
                    </label>
                    <DatePicker
                      aria-label="วันที่ต้องการฉีดวัคซีน"
                      value={safeParseCalendarDate(selectedDate)}
                      onChange={(newDate) => {
                        if (newDate) {
                          setSelectedDate(newDate.toString());
                          if (errors.selectedDate) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.selectedDate;
                              return next;
                            });
                          }
                        }
                      }}
                      minValue={today(getLocalTimeZone())}
                      className={cx(
                        'w-full',
                        errors.selectedDate && 'border-status-rose-text bg-status-rose-background/20'
                      )}
                    />
                    {errors.selectedDate ? (
                      <p className="text-caption-2-medium text-status-rose-text">{errors.selectedDate}</p>
                    ) : (
                      <p className="text-caption-2-regular text-text-tertiary">
                        {isRescheduling
                          ? 'สามารถเลือกวันนัดใหม่ตามที่สะดวกได้เลย'
                          : 'ระบบเลือกวันตามรอบภูมิคุ้มกันของน้องไว้ให้แล้ว (ปรับเปลี่ยนได้ตามสะดวก)'}
                      </p>
                    )}
                  </div>

                  {/* Field 2: Hospital Branch */}
                  <div className="space-y-1.5">
                    <label className="block text-caption-1-semibold text-text-primary">
                      2. สาขาโรงพยาบาลที่สะดวก <span className="text-status-rose-text">*</span>
                    </label>
                    <Select
                      aria-label="สาขาโรงพยาบาลที่สะดวก"
                      selectedKey={selectedBranch}
                      onSelectionChange={(key) => setSelectedBranch(String(key))}
                      className="w-full"
                      triggerClassName="w-full justify-between rounded-xl px-3.5 py-2.5 text-body-medium bg-background-primary-default border-border-button-default shadow-xs"
                      popoverClassName="w-[var(--trigger-width)] min-w-[280px]"
                    >
                      {HOSPITAL_BRANCHES.map((b) => (
                        <SelectItem key={b.name} id={b.name} textValue={b.name}>
                          <div className="flex items-center gap-2">
                            <RiMapPin2Line className="size-4 text-accent-500 shrink-0" />
                            <span className="truncate">{b.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <p className="text-caption-2-regular text-text-tertiary">
                      {HOSPITAL_BRANCHES.find((b) => b.name === selectedBranch)?.address || 'โรงพยาบาลสัตว์ VetPaws'}
                    </p>
                  </div>
                </div>

                {/* Field 3: Time Slot Grid */}
                <div className="space-y-2">
                  <label className="block text-caption-1-semibold text-text-primary">
                    3. เลือกช่วงเวลาที่สะดวก
                  </label>
                  <div
                    role="group"
                    aria-label="เลือกช่วงเวลาฉีดวัคซีน"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                  >
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.id)}
                          className={cx(
                            'p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative',
                            isSelected
                              ? 'bg-accent-50 border-accent-500 text-accent-700 shadow-xs dark:bg-accent-950/40 dark:text-accent-300 dark:border-accent-500'
                              : 'bg-background-secondary-default/50 border-border-button-default text-text-secondary hover:bg-background-secondary-hover'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-caption-1-semibold font-semibold text-text-primary">
                              {slot.title}
                            </span>
                            {isSelected && (
                              <span className="size-4 rounded-full bg-accent-500 text-background-primary-default flex items-center justify-center shrink-0">
                                <RiCheckLine className="size-3" />
                              </span>
                            )}
                          </div>
                          <div className="text-caption-2-medium text-text-secondary flex items-center gap-1 font-mono">
                            <RiTimeLine className="size-3 shrink-0" />
                            <span>{slot.timeRange}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 4: Owner Contact Information */}
                <div className="p-4 sm:p-5 rounded-3xl bg-background-secondary-default/40 border border-border-button-default space-y-3">
                  <div className="flex items-center gap-2">
                    <RiUserLine className="size-4 text-accent-500" />
                    <h4 className="text-body-2-semibold text-text-primary">
                      4. ข้อมูลติดต่อเจ้าของสัตว์เลี้ยง
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="vaccine-owner-name" className="block text-caption-2-medium text-text-secondary mb-1">
                        ชื่อ-นามสกุล ผู้ติดต่อ <span className="text-status-rose-text">*</span>
                      </label>
                      <input
                        id="vaccine-owner-name"
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="เช่น คุณศิษฐิวัชร์ วงศ์วิริยะ"
                        className={cx(
                          'w-full px-3 py-2 rounded-xl bg-background-primary-default border text-body-medium text-text-primary focus:outline-hidden focus:border-border-focus-ring',
                          errors.ownerName ? 'border-status-rose-text bg-status-rose-background/20' : 'border-border-button-default'
                        )}
                      />
                      {errors.ownerName && (
                        <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.ownerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vaccine-owner-phone" className="block text-caption-2-medium text-text-secondary mb-1">
                        เบอร์โทรศัพท์สำหรับยืนยันนัด <span className="text-status-rose-text">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="vaccine-owner-phone"
                          type="tel"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="เช่น 0891234567"
                          className={cx(
                            'w-full px-3 py-2 rounded-xl bg-background-primary-default border text-body-medium text-text-primary focus:outline-hidden focus:border-border-focus-ring pl-8',
                            errors.ownerPhone ? 'border-status-rose-text bg-status-rose-background/20' : 'border-border-button-default'
                          )}
                        />
                        <RiPhoneLine className="size-4 text-text-tertiary absolute left-2.5 top-2.5 pointer-events-none" />
                      </div>
                      {errors.ownerPhone && (
                        <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.ownerPhone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vaccine-owner-line" className="block text-caption-2-medium text-text-secondary mb-1">
                        LINE ID (เพื่อรับการแจ้งเตือนเตือนนัดหมาย)
                      </label>
                      <input
                        id="vaccine-owner-line"
                        type="text"
                        value={ownerLineId}
                        onChange={(e) => setOwnerLineId(e.target.value)}
                        placeholder="เช่น @vetpaws-line"
                        className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-medium text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                      />
                    </div>

                    <div>
                      <label htmlFor="vaccine-special-notes" className="block text-caption-2-medium text-text-secondary mb-1">
                        หมายเหตุ / ข้อความถึงสัตวแพทย์
                      </label>
                      <input
                        id="vaccine-special-notes"
                        type="text"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="เช่น น้องตื่นเต้นง่าย, ขอตรวจสุขภาพฟันร่วมด้วย"
                        className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-medium text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                      />
                    </div>
                  </div>
                </div>

                {/* Pre-vaccination Tip Checklist */}
                <div className="p-3.5 rounded-2xl bg-status-yellow-background border border-border-button-default text-caption-1-regular text-status-yellow-text flex items-start gap-2.5">
                  <RiInformationLine className="size-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>ข้อแนะนำก่อนพามาฉีดวัคซีน:</strong> สัตว์เลี้ยงควรมีสุขภาพแข็งแรง อุณหภูมิปกติ ไม่อยู่ระหว่างมีไข้ และงดอาบน้ำอย่างน้อย 48 ชั่วโมงก่อนและหลังการฉีดวัคซีน
                  </span>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-button-default">
                <Button
                  type="button"
                  variant="ghost"
                  size="medium"
                  onClick={handleResetAndClose}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  leadingIcon={RiCheckLine}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isRescheduling
                      ? 'กำลังบันทึกการเปลี่ยนแปลง...'
                      : 'กำลังบันทึกนัดหมาย...'
                    : isRescheduling
                      ? 'บันทึกการเปลี่ยนวันนัดหมาย'
                      : 'ยืนยันการนัดหมายฉีดวัคซีน'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
