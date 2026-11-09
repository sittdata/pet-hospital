import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RiCloseLine,
  RiCheckLine,
  RiCalendarEventLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiAlertFill,
  RiHeartPulseFill,
  RiPhoneFill,
  RiCompass3Line,
  RiAlarmWarningFill,
  RiCameraLine,
  RiImageAddLine,
  RiLoader4Line,
} from '@remixicon/react';
import { cx } from '@/utils/cx';
import { PetType, AppointmentFormData } from '../types';
import { CatIcon, DogIcon, RabbitIcon, SmallPetIcon } from './icons/PetIcons';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { StatusDot } from '@/components/base/badges/status-dot';
import { Chip } from '@/components/base/badges/chip';
import { DatePicker } from '@/components/base/date-picker/date-picker';
import { Select, SelectItem } from '@/components/base/select/select';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import { getStoredPassports, saveStoredPassports, createPassportFromAppointment } from '../data/petPassportData';
import { TreatmentRecord } from '../types/petPassport';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPetType?: PetType;
  initialService?: string;
  initialDoctor?: string;
  initialSymptoms?: string;
  currentUser?: { name: string; email: string } | null;
  onRequireAuth?: () => void;
  onLoginSuccess?: (user: { name: string; email: string }) => void;
  onViewPassport?: () => void;
}

const EMERGENCY_KEYWORDS = [
  'ฉุกเฉิน', 'วิกฤต', 'หายใจหอบ', 'อ้าปากหายใจ', 'ลิ้นม่วง', 'ชัก', 'เกร็ง', 'หมดสติ',
  'กระเพาะบิด', 'gdv', 'ขย้อน', 'ฉี่ไม่ออก', 'ปัสสาวะไม่ออก', 'flutd', 'สารพิษ',
  'ช็อกโกแลต', 'พารา', 'เลือดไหล', 'รถชน', 'ตกตึก', 'ซีด', 'ช็อก'
];

const STANDARD_SERVICES = [
  'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
  'คลินิกแมวเฉพาะทาง Cat Friendly Clinic (ISFM)',
  'ศูนย์อายุรกรรมและโรคแมวเฉพาะทาง',
  'ศูนย์ศัลยกรรมและกระดูก (ห้องผ่าตัดปลอดเชื้อ)',
  'ศูนย์หัวใจและหลอดเลือด',
  'ศูนย์โรคตาและจักษุกรรมสัตว์เลี้ยง',
  'ศูนย์สัตว์พิเศษและสัตว์เลื้อยคลาน (Exotic Pets)',
  'ศูนย์วินิจฉัยภาพทางการแพทย์ดิจิทัล',
  'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง',
];

const getTomorrowLocalDateString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function getInitialPhone(currentUser?: { name: string; email: string } | null): string {
  if (typeof window === 'undefined') return '';
  try {
    const saved = localStorage.getItem('vetpaws_user_phone');
    if (saved && saved.trim()) return saved.trim();

    const raw = localStorage.getItem('vetpaws_appointments');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (currentUser?.email) {
          for (let i = parsed.length - 1; i >= 0; i--) {
            const item = parsed[i];
            if (
              item &&
              item.userEmail === currentUser.email &&
              item.rawPhone &&
              typeof item.rawPhone === 'string' &&
              item.rawPhone.trim()
            ) {
              return item.rawPhone.trim();
            }
          }
        }
        for (let i = parsed.length - 1; i >= 0; i--) {
          const item = parsed[i];
          if (item && item.rawPhone && typeof item.rawPhone === 'string' && item.rawPhone.trim()) {
            return item.rawPhone.trim();
          }
        }
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

function formatPetAge(yearsStr: string, monthsStr: string): string {
  const y = parseInt(yearsStr, 10);
  const m = parseInt(monthsStr, 10);
  const hasY = !isNaN(y) && y > 0;
  const hasM = !isNaN(m) && m > 0;

  if (hasY && hasM) return `${y} ปี ${m} เดือน`;
  if (hasY) return `${y} ปี`;
  if (hasM) return `${m} เดือน`;
  if ((!isNaN(y) && y === 0 && !isNaN(m) && m === 0) || (isNaN(y) && !isNaN(m) && m === 0)) {
    return 'ไม่ถึง 1 เดือน';
  }
  return '';
}

function parseInitialAge(ageStr?: string): { years: string; months: string } {
  if (!ageStr) return { years: '', months: '' };
  if (ageStr === 'ไม่ถึง 1 เดือน') return { years: '0', months: '0' };
  const yMatch = ageStr.match(/(\d+)\s*ปี/);
  const mMatch = ageStr.match(/(\d+)\s*เดือน/);
  return {
    years: yMatch ? yMatch[1] : '',
    months: mMatch ? mMatch[1] : '',
  };
}

const MAX_SYMPTOM_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic'];

function isSupportedImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
}

function compressImageToDataUrl(file: File, maxDim = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string' || !result.startsWith('data:image/')) {
        if (isHeic) {
          reject(new Error(`เบราว์เซอร์ไม่รองรับการประมวลผลไฟล์ HEIC ("${file.name}") กรุณาแปลงเป็น JPG, PNG หรือ WebP`));
        } else {
          reject(new Error(`ไฟล์ "${file.name}" ไม่ใช่ไฟล์รูปภาพที่ถูกต้อง`));
        }
        return;
      }

      const img = new Image();
      img.onerror = () => {
        if (isHeic) {
          reject(new Error(`เบราว์เซอร์ไม่รองรับการประมวลผลไฟล์ HEIC ("${file.name}") กรุณาแปลงเป็น JPG, PNG หรือ WebP`));
        } else {
          reject(new Error(`ไฟล์รูปภาพ "${file.name}" เสียหายหรือไม่สามารถเปิดได้`));
        }
      };

      img.onload = () => {
        try {
          let { width, height } = img;
          if (width <= 0 || height <= 0) {
            reject(new Error(`ไฟล์รูปภาพ "${file.name}" มีขนาดไม่ถูกต้อง`));
            return;
          }

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            if (result.length < 300 * 1024) {
              resolve(result);
            } else {
              reject(new Error('ไม่สามารถประมวลผลภาพบนเบราว์เซอร์นี้ได้'));
            }
            return;
          }

          // Pre-fill white background to prevent transparent PNGs turning pitch black on JPEG conversion
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          try {
            const webp = canvas.toDataURL('image/webp', quality);
            if (webp && webp.startsWith('data:image/webp')) {
              resolve(webp);
              return;
            }
          } catch {
            // fallback to JPEG
          }

          try {
            const jpeg = canvas.toDataURL('image/jpeg', quality);
            if (jpeg && jpeg.startsWith('data:image/jpeg')) {
              resolve(jpeg);
              return;
            }
          } catch {
            // fallback
          }

          if (result.length < 300 * 1024) {
            resolve(result);
          } else {
            reject(new Error('ขนาดไฟล์หลังประมวลผลยังคงใหญ่เกินไป'));
          }
        } catch {
          reject(new Error(`เกิดข้อผิดพลาดในการปรับขนาดภาพ "${file.name}"`));
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPetType = 'cat',
  initialService = '',
  initialDoctor = '',
  initialSymptoms = '',
  currentUser = null,
  onRequireAuth,
  onViewPassport,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRefCode, setBookingRefCode] = useState<string>('');
  const [dismissedEmergencyKey, setDismissedEmergencyKey] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<AppointmentFormData>(() => {
    let defaultSymptoms = '';
    if (initialSymptoms) {
      defaultSymptoms = initialDoctor
        ? `${initialSymptoms} | ระบุแพทย์: ${initialDoctor}`
        : initialSymptoms;
    } else if (initialDoctor) {
      defaultSymptoms = `ระบุแพทย์: ${initialDoctor}`;
    }

    return {
      petType: initialPetType,
      petName: '',
      petBreed: '',
      petAge: '',
      serviceCategory: initialService || 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
      preferredDate: getTomorrowLocalDateString(),
      preferredTimeSlot: 'morning',
      isEmergencyCase: false,
      symptomsDescription: defaultSymptoms,
      symptomPhotos: [],
      ownerName: currentUser?.name || '',
      ownerPhone: getInitialPhone(currentUser),
      ownerLineId: '',
    };
  });

  const [ageYears, setAgeYears] = useState<string>(() => parseInitialAge(formData.petAge).years);
  const [ageMonths, setAgeMonths] = useState<string>(() => parseInitialAge(formData.petAge).months);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState<boolean>(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const previewPhotoUrlRef = useRef<string | null>(null);
  useEffect(() => {
    previewPhotoUrlRef.current = previewPhotoUrl;
  }, [previewPhotoUrl]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      symptomPhotos: (prev.symptomPhotos || []).filter((_, idx) => idx !== indexToRemove),
    }));
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPhotoError(null);
    const currentPhotos = formData.symptomPhotos || [];
    const availableSlots = MAX_SYMPTOM_PHOTOS - currentPhotos.length;

    if (availableSlots <= 0) {
      setPhotoError('สามารถแนบรูปถ่ายได้สูงสุด 3 รูปเท่านั้น');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const fileList = Array.from(files);
    const filesToProcess = fileList.slice(0, availableSlots);

    for (const f of filesToProcess) {
      if (!isSupportedImageFile(f)) {
        setPhotoError(`ไฟล์ "${f.name}" ไม่ใช่ไฟล์รูปภาพที่รองรับ (รองรับ JPG, PNG, WebP, HEIC)`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (f.size > MAX_PHOTO_BYTES) {
        setPhotoError(`ไฟล์ "${f.name}" มีขนาดเกิน 5MB (ขนาดสูงสุดไม่เกิน 5MB ต่อรูป)`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    if (fileList.length > availableSlots) {
      setPhotoError(`สามารถแนบเพิ่มได้อีก ${availableSlots} รูปเท่านั้น ระบบเลือกเฉพาะ ${availableSlots} รูปแรก`);
    }

    setIsProcessingPhotos(true);
    try {
      const compressedList = await Promise.all(
        filesToProcess.map((file) => compressImageToDataUrl(file))
      );
      setFormData((prev) => ({
        ...prev,
        symptomPhotos: [...(prev.symptomPhotos || []), ...compressedList].slice(0, MAX_SYMPTOM_PHOTOS),
      }));
      if (fileList.length <= availableSlots) {
        setPhotoError(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ';
      setPhotoError(msg);
    } finally {
      setIsProcessingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const [prevUser, setPrevUser] = useState(currentUser);
  if (currentUser !== prevUser) {
    setPrevUser(currentUser);
    if (currentUser) {
      const phone = getInitialPhone(currentUser);
      setFormData((prev) => ({
        ...prev,
        ownerName: currentUser.name || prev.ownerName,
        ownerPhone: prev.ownerPhone.trim() ? prev.ownerPhone : phone,
      }));
      setErrors((prev) => {
        if (!prev.ownerName && !prev.ownerPhone) return prev;
        const next = { ...prev };
        if (currentUser.name) delete next.ownerName;
        if (phone) delete next.ownerPhone;
        return next;
      });
    }
  }

  const handleAgeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.', ' '].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val === '') {
      setAgeYears('');
      setFormData((prev) => ({ ...prev, petAge: formatPetAge('', ageMonths) }));
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setAgeYears('');
      setFormData((prev) => ({ ...prev, petAge: formatPetAge('', ageMonths) }));
      return;
    }
    const clamped = Math.min(Math.max(num, 0), 35);
    const clampedStr = String(clamped);
    setAgeYears(clampedStr);
    setFormData((prev) => ({ ...prev, petAge: formatPetAge(clampedStr, ageMonths) }));
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val === '') {
      setAgeMonths('');
      setFormData((prev) => ({ ...prev, petAge: formatPetAge(ageYears, '') }));
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setAgeMonths('');
      setFormData((prev) => ({ ...prev, petAge: formatPetAge(ageYears, '') }));
      return;
    }
    const clamped = Math.min(Math.max(num, 0), 11);
    const clampedStr = String(clamped);
    setAgeMonths(clampedStr);
    setFormData((prev) => ({ ...prev, petAge: formatPetAge(ageYears, clampedStr) }));
  };

    const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const handleResetAndClose = useCallback(() => {
    setIsSuccess(false);
    setDismissedEmergencyKey(null);
    setStep(1);
    setPhotoError(null);
    setPreviewPhotoUrl(null);
    onCloseRef.current();
  }, []);

  const handleViewPassport = useCallback(() => {
    handleResetAndClose();
    if (onViewPassport) {
      onViewPassport();
    }
  }, [handleResetAndClose, onViewPassport]);

  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap, initial focus, body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus first interactive element inside modal
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
        if (previewPhotoUrlRef.current) {
          setPreviewPhotoUrl(null);
          return;
        }
      }

      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs.length > 0 && dialogs[dialogs.length - 1] !== modalRef.current) {
        return;
      }

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
            firstElement.focus();
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

  // Real-time Emergency Keyword Detection
  const combinedText = `${formData.serviceCategory} ${formData.symptomsDescription}`.toLowerCase();
  const matchedKeywords = EMERGENCY_KEYWORDS.filter((kw) => combinedText.includes(kw)).sort().join(',');
  const currentEmergencyKey = [formData.isEmergencyCase ? 'manual-emergency' : '', matchedKeywords].filter(Boolean).join(':');
  const hasEmergency = Boolean(currentEmergencyKey);
  const showEmergencyIntercept = hasEmergency && dismissedEmergencyKey !== currentEmergencyKey;

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.petName.trim()) errs.petName = 'กรุณาระบุชื่อสัตว์เลี้ยง';
    } else if (currentStep === 2) {
      if (!formData.preferredDate) errs.preferredDate = 'กรุณาเลือกวันที่ต้องการนัดหมาย';
    } else if (currentStep === 3) {
      if (!formData.ownerName.trim()) errs.ownerName = 'กรุณาระบุชื่อผู้ติดต่อ';
      if (!formData.ownerPhone.trim()) {
        errs.ownerPhone = 'กรุณาระบุเบอร์โทรศัพท์';
      } else if (!/^[0-9]{9,10}$/.test(formData.ownerPhone.replace(/[-\s]/g, ''))) {
        errs.ownerPhone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };
  const executeSubmission = (activeUser?: { name: string; email: string } | null) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const refCode = `VETPAWS-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRefCode(refCode);

      try {
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

        const user = activeUser || currentUser;

        const sanitizedAppointment = {
          refCode,
          petType: formData.petType,
          petName: formData.petName,
          petBreed: formData.petBreed,
          petAge: formData.petAge,
          serviceCategory: formData.serviceCategory,
          preferredDate: formData.preferredDate,
          preferredTimeSlot: formData.preferredTimeSlot,
          isEmergencyCase: formData.isEmergencyCase,
          symptomsDescription: formData.symptomsDescription,
          symptomPhotos: formData.symptomPhotos && formData.symptomPhotos.length > 0 ? formData.symptomPhotos : undefined,
          ownerName: maskName(formData.ownerName),
          ownerPhone: maskPhone(formData.ownerPhone),
          rawPhone: formData.ownerPhone.trim(),
          userEmail: user?.email || undefined,
          ownerLineId: formData.ownerLineId ? '***' : '',
          createdAt: new Date().toISOString(),
        };

        existing.push(sanitizedAppointment);
        try {
          localStorage.setItem('vetpaws_appointments', JSON.stringify(existing));
        } catch {
          // If storage quota exceeded, prune older appointments to preserve storage headroom
          try {
            const pruned = existing.slice(-20);
            localStorage.setItem('vetpaws_appointments', JSON.stringify(pruned));
          } catch {
            const lightweight = existing.slice(-10).map((item, idx, arr) =>
              idx === arr.length - 1 ? item : { ...item, symptomPhotos: undefined }
            );
            localStorage.setItem('vetpaws_appointments', JSON.stringify(lightweight));
          }
        }
        localStorage.setItem('vetpaws_user_phone', formData.ownerPhone.trim());

        if (user?.email) {
          const userPassports = getStoredPassports(user.email);
          const petExists = userPassports.some(
            (p) => p.name.trim().toLowerCase() === formData.petName.trim().toLowerCase()
          );
          if (!petExists) {
            createPassportFromAppointment(formData, user.email);
          } else {
            const timeSlotLabel =
              formData.preferredTimeSlot === 'morning'
                ? 'ช่วงเช้า (09:00 - 12:00 น.)'
                : formData.preferredTimeSlot === 'afternoon'
                  ? 'ช่วงบ่าย (13:00 - 17:00 น.)'
                  : 'ช่วงเย็น (17:00 - 20:00 น.)';

            const photoNoteSuffix =
              formData.symptomPhotos && formData.symptomPhotos.length > 0
                ? ` [แนบรูปอาการ ${formData.symptomPhotos.length} รูป]`
                : '';

            const subsequentTreatment: TreatmentRecord = {
              id: `treat-${Date.now()}`,
              date: formData.preferredDate || new Date().toISOString().split('T')[0],
              diagnosis: 'นัดหมายตรวจติดตามอาการ / เข้ารับบริการโรงพยาบาล',
              veterinarian: 'รอยืนยันสัตวแพทย์เจ้าของไข้',
              clinicDepartment: formData.serviceCategory || 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน',
              treatment: formData.symptomsDescription?.trim()
                ? `บันทึกอาการ: ${formData.symptomsDescription.trim()}`
                : 'นัดหมายรับการตรวจรักษา',
              notes: `นัดหมายตรวจล่วงหน้า (${timeSlotLabel})${photoNoteSuffix}`,
            };

            const updatedPassports = userPassports.map((pet) => {
              if (pet.name.trim().toLowerCase() === formData.petName.trim().toLowerCase()) {
                return {
                  ...pet,
                  treatments: [subsequentTreatment, ...(pet.treatments || [])],
                };
              }
              return pet;
            });
            saveStoredPassports(updatedPassports, user.email);
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('vetpaws:passports_updated'));
          }
        }
      } catch (err) {
        console.error('Storage error', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // หากยังไม่เข้าสู่ระบบ ให้เด้งไปหน้าล็อกอินก่อนยืนยันนัดหมายตามข้อกำหนด
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }

    if (!validateStep(3)) return;

    executeSubmission(currentUser);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleResetAndClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="bg-background-primary-default text-text-primary rounded-3xl w-full max-w-xl shadow-2xl border border-border-button-default overflow-hidden animate-boardui-modal relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-border-button-default flex items-center justify-between bg-background-secondary-default">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
              <RiCalendarEventLine className="size-4.5" />
            </div>
            <div>
              <h3 id="booking-modal-title" className="font-bold text-title-3-semibold text-text-primary leading-none">นัดหมายตรวจล่วงหน้า</h3>
              <p className="text-caption-1-medium text-text-tertiary mt-0.5">VetPaws Hospital</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="small"
            iconOnly
            leadingIcon={RiCloseLine}
            onClick={handleResetAndClose}
            aria-label="ปิดหน้าต่าง"
          />
        </div>

        {/* CRITICAL EMERGENCY INTERCEPT SCREEN */}
        {showEmergencyIntercept ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-status-rose-background text-status-rose-text animate-fade-in">
            <div className="text-center space-y-3">
              <div className="size-16 rounded-full bg-status-rose-text text-white flex items-center justify-center mx-auto shadow-lg shadow-status-rose-text/30 animate-pulse">
                <RiAlarmWarningFill className="size-9" />
              </div>
              <div>
                <Chip color="rose" variant="bold" className="mb-2">
                  <StatusDot color="yellow" className="mr-1 inline" />
                  🚨 ตรวจพบสัญญาณอันตรายระดับวิกฤต (Critical Emergency)
                </Chip>
                <h4 className="text-title-1-semibold text-text-primary font-bold">
                  อาการนี้อาจเป็นอันตรายถึงชีวิต กรุณาอย่านัดหมายล่วงหน้า!
                </h4>
              </div>
              <p className="text-body-medium text-text-primary leading-relaxed max-w-md mx-auto">
                อาการ <strong className="underline underline-offset-2 text-status-rose-text font-bold">"{formData.serviceCategory}"</strong> หรืออาการที่ระบุ 
                เป็นภาวะเร่งด่วนที่ต้องได้รับการรักษาทันที เช่น กระเพาะบิด ชัก ทางเดินปัสสาวะอุดตัน หรือได้รับสารพิษ 
                การรอรอบนัดหมายอาจทำให้น้องเสียชีวิตได้
              </p>
            </div>

            {/* Direct Action Hub */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <ButtonLink
                variant="danger"
                size="medium"
                leadingIcon={RiPhoneFill}
                href="tel:028889999"
                className="w-full justify-center"
              >
                โทรแจ้งศูนย์กู้ชีพ ER ทันที: 02-888-9999
              </ButtonLink>

              <ButtonLink
                variant="secondary"
                size="medium"
                leadingIcon={RiCompass3Line}
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full justify-center"
              >
                นำทางด่วนไปห้องฉุกเฉิน (เปิดตลอด 24 ชม.)
              </ButtonLink>
            </div>

            {/* Bypass Option for Follow-ups */}
            <div className="pt-4 border-t border-status-rose-text/20 text-center">
              <p className="text-caption-1-medium text-text-secondary mb-2">
                หากสัตว์เลี้ยงพ้นขีดอันตรายแล้ว และต้องการนัดหมายตรวจติดตามอาการทั่วไป:
              </p>
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => setDismissedEmergencyKey(currentEmergencyKey)}
              >
                ดำเนินการกรอกแบบฟอร์มนัดหมายต่อ →
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Indicator (when not success) */}
            {!isSuccess && (
              <div className="px-6 pt-4 pb-2 bg-background-primary-default">
                <div className="flex items-center justify-between text-caption-1-semibold text-text-tertiary mb-2">
                  <span className={step >= 1 ? 'text-accent-500 font-bold' : ''}>1. ข้อมูลสัตว์เลี้ยง</span>
                  <span className={step >= 2 ? 'text-accent-500 font-bold' : ''}>2. วันและบริการ</span>
                  <span className={step >= 3 ? 'text-accent-500 font-bold' : ''}>3. ข้อมูลผู้ติดต่อ</span>
                </div>
                <div className="w-full bg-background-secondary-default h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-accent-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Body Form */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {isSuccess ? (
                /* Success Confirmation Screen */
                <div className="py-6 text-center space-y-4 animate-fade-in">
                  <div className="size-16 rounded-full bg-status-lime-background text-status-lime-text flex items-center justify-center mx-auto border border-border-button-default">
                    <RiCheckLine className="size-9" />
                  </div>
                  <div>
                    <h4 className="text-title-2-medium text-text-primary">บันทึกคำขอนัดหมายเรียบร้อยแล้ว</h4>
                    <p className="text-body-medium text-text-secondary mt-1">
                      รหัสอ้างอิง: <strong className="text-accent-500 text-title-3-semibold font-mono">{bookingRefCode}</strong>
                    </p>
                  </div>

                  <div className="bg-background-secondary-default rounded-2xl p-4 text-left border border-border-button-default text-caption-1-medium space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">สัตว์เลี้ยง:</span>
                      <span className="font-semibold text-text-primary">{formData.petName} ({formData.petType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">บริการ:</span>
                      <span className="font-semibold text-text-primary">{formData.serviceCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">วันนัดหมาย:</span>
                      <span className="font-semibold text-text-primary">{formData.preferredDate} ({formData.preferredTimeSlot})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">ผู้ติดต่อ:</span>
                      <span className="font-semibold text-text-primary">{formData.ownerName} ({formData.ownerPhone})</span>
                    </div>
                    {formData.symptomsDescription && (
                      <div className="pt-2 border-t border-border-button-default/60 text-caption-2-medium">
                        <span className="text-text-tertiary">อาการเบื้องต้น: </span>
                        <span className="text-text-secondary">{formData.symptomsDescription}</span>
                      </div>
                    )}
                    {formData.symptomPhotos && formData.symptomPhotos.length > 0 && (
                      <div className="pt-2 border-t border-border-button-default/60">
                        <div className="text-caption-2-medium text-text-tertiary mb-2 flex items-center gap-1.5">
                          <RiCameraLine className="size-3.5 text-accent-500" />
                          <span>รูปถ่ายอาการที่แนบ ({formData.symptomPhotos.length} รูป):</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap" data-testid="success-symptom-photos">
                          {formData.symptomPhotos.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`รูปถ่ายอาการ ${idx + 1}`}
                              className="size-14 rounded-xl object-cover border border-border-button-default shadow-2xs cursor-pointer hover:opacity-85 transition-opacity"
                              onClick={() => setPreviewPhotoUrl(photo)}
                              title="คลิกเพื่อดูรูปขยาย"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-caption-1-medium text-text-tertiary max-w-sm mx-auto leading-relaxed">
                    เจ้าหน้าที่แผนกเวชระเบียนจะติดต่อกลับผ่านเบอร์โทรศัพท์เพื่อยืนยันคิวตรวจและแพทย์ประจำการภายใน 15-30 นาที
                  </p>

                  <div className="space-y-2 max-w-sm mx-auto w-full pt-1">
                    {currentUser && (
                      <Button
                        variant="primary"
                        size="medium"
                        onClick={handleViewPassport}
                        className="w-full justify-center"
                      >
                        ดูสมุดสุขภาพดิจิทัล →
                      </Button>
                    )}
                    <Button
                      variant={currentUser ? 'secondary' : 'primary'}
                    size="medium"
                    onClick={handleResetAndClose}
                    className="w-full justify-center"
                  >
                    เรียบร้อย
                  </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* STEP 1: Pet Information */}
                  {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-caption-1-semibold text-text-tertiary uppercase tracking-wider mb-2">
                          ประเภทสัตว์เลี้ยง
                        </label>
                        <div role="group" aria-label="เลือกประเภทสัตว์เลี้ยง" className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'cat' as const, label: 'แมว', Icon: CatIcon },
                            { id: 'dog' as const, label: 'สุนัข', Icon: DogIcon },
                            { id: 'exotic' as const, label: 'สัตว์พิเศษ', Icon: RabbitIcon },
                            { id: 'small' as const, label: 'สัตว์เล็ก', Icon: SmallPetIcon },
                          ].map((item) => (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => setFormData({ ...formData, petType: item.id })}
                              className={`button-press-motion p-2.5 rounded-2xl text-caption-1-semibold border flex flex-col items-center gap-1.5 cursor-pointer ${
                                formData.petType === item.id
                                  ? 'bg-accent-50 border-accent-500 text-accent-700 shadow-xs'
                                  : 'bg-background-secondary-default border-border-button-default text-text-secondary hover:bg-background-secondary-hover'
                              }`}
                            >
                              <item.Icon className="size-5" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="booking-pet-name" className="block text-caption-1-semibold text-text-primary mb-1">
                          ชื่อสัตว์เลี้ยง <span className="text-status-rose-text">*</span>
                        </label>
                        <input
                          id="booking-pet-name"
                          type="text"
                          placeholder="เช่น ข้าวเหนียว, ชาโคล"
                          value={formData.petName}
                          onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring transition-colors ${
                            errors.petName ? 'border-status-rose-text bg-status-rose-background/20' : 'border-border-button-default'
                          }`}
                        />
                        {errors.petName && <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.petName}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="booking-pet-breed" className="block text-caption-1-semibold text-text-primary mb-1">สายพันธุ์ (ถ้ามี)</label>
                          <input
                            id="booking-pet-breed"
                            type="text"
                            placeholder="เช่น บริติชช็อตแฮร์, โกลเด้น"
                            value={formData.petBreed}
                            onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-caption-1-semibold text-text-primary mb-1">อายุโดยประมาณ</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="relative">
                                <input
                                  id="booking-pet-age-years"
                                  type="number"
                                  min="0"
                                  max="35"
                                  placeholder="0"
                                  value={ageYears}
                                  onKeyDown={handleAgeKeyDown}
                                  onChange={handleYearsChange}
                                  aria-label="อายุ (ปี)"
                                  className="w-full px-3 py-2.5 pe-9 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                                />
                                <span className="absolute inset-y-0 end-2.5 flex items-center text-caption-1-medium text-text-tertiary pointer-events-none select-none">
                                  ปี
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="relative">
                                <input
                                  id="booking-pet-age-months"
                                  type="number"
                                  min="0"
                                  max="11"
                                  placeholder="0"
                                  value={ageMonths}
                                  onKeyDown={handleAgeKeyDown}
                                  onChange={handleMonthsChange}
                                  aria-label="อายุ (เดือน)"
                                  className="w-full px-3 py-2.5 pe-11 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                                />
                                <span className="absolute inset-y-0 end-2.5 flex items-center text-caption-1-medium text-text-tertiary pointer-events-none select-none">
                                  เดือน
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="booking-symptoms" className="block text-caption-1-semibold text-text-primary mb-1">อาการเบื้องต้นที่สังเกตพบ</label>
                        <textarea
                          id="booking-symptoms"
                          rows={2}
                          placeholder="เช่น ซึม ไม่กินข้าว อาเจียน 2 ครั้ง หรือนัดตรวจสุขภาพประจำปี"
                          value={formData.symptomsDescription}
                          onChange={(e) => setFormData({ ...formData, symptomsDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                        />
                      </div>

                      {/* Optional Symptoms Photo Upload */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-caption-1-semibold text-text-primary">
                            แนบรูปถ่ายอาการ <span className="text-caption-2-medium text-text-tertiary font-normal">(ไม่บังคับ - สูงสุด 3 รูป)</span>
                          </label>
                          <span className="text-caption-2-medium text-text-tertiary">
                            {formData.symptomPhotos?.length || 0}/3 รูป
                          </span>
                        </div>

                        <input
                          ref={fileInputRef}
                          id="booking-symptoms-photos"
                          type="file"
                          accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.HEIC"
                          multiple
                          onChange={handlePhotoFilesSelected}
                          className="hidden"
                          aria-label="เลือกรูปถ่ายอาการ"
                          data-testid="symptom-photos-input"
                        />

                        {/* Thumbnails & Upload Button Row */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {formData.symptomPhotos && formData.symptomPhotos.map((photo, index) => (
                            <div
                              key={index}
                              data-testid="symptom-photo-thumbnail"
                              className="relative size-20 rounded-xl overflow-hidden border border-border-button-default bg-background-secondary-default shadow-2xs group shrink-0"
                            >
                              <img
                                src={photo}
                                alt={`รูปถ่ายอาการ ${index + 1}`}
                                className="size-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setPreviewPhotoUrl(photo)}
                                title="คลิกเพื่อดูรูปขยาย"
                              />
                              <button
                                type="button"
                                data-testid={`remove-symptom-photo-${index}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePhoto(index);
                                }}
                                className="absolute top-1 end-1 size-5 rounded-full bg-background-primary-default/95 text-text-secondary hover:text-status-rose-text hover:bg-background-primary-default border border-border-button-default flex items-center justify-center shadow-xs cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                                aria-label={`ลบรูปถ่ายที่ ${index + 1}`}
                              >
                                <RiCloseLine className="size-3.5" />
                              </button>
                            </div>
                          ))}

                          {(!formData.symptomPhotos || formData.symptomPhotos.length < 3) && (
                            <button
                              type="button"
                              data-testid="add-symptom-photo-button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isProcessingPhotos}
                              className={cx(
                                "flex items-center justify-center rounded-xl border-2 border-dashed border-border-button-default hover:border-accent-500 hover:bg-background-secondary-default text-text-tertiary hover:text-accent-500 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-50 disabled:pointer-events-none",
                                (!formData.symptomPhotos || formData.symptomPhotos.length === 0)
                                  ? "w-full py-3 px-4 gap-3 flex-row"
                                  : "size-20 flex-col gap-1 shrink-0"
                              )}
                              aria-label="แนบรูปถ่ายอาการ"
                            >
                              {(!formData.symptomPhotos || formData.symptomPhotos.length === 0) ? (
                                <>
                                  <div className="size-8 rounded-lg bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
                                    {isProcessingPhotos ? (
                                      <RiLoader4Line className="size-4.5 animate-spin" />
                                    ) : (
                                      <RiCameraLine className="size-4.5" />
                                    )}
                                  </div>
                                  <div className="text-start flex-1 min-w-0">
                                    <div className="text-caption-1-semibold text-text-primary">
                                      {isProcessingPhotos ? 'กำลังประมวลผลรูปภาพ...' : 'เพิ่มรูปถ่ายอาการ (เช่น แผล ผื่น จุดผิดปกติ)'}
                                    </div>
                                    <div className="text-caption-2-medium text-text-tertiary truncate">
                                      JPG, PNG, WebP หรือ HEIC (ไม่เกิน 5MB ต่อรูป)
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {isProcessingPhotos ? (
                                    <RiLoader4Line className="size-5 shrink-0 animate-spin text-accent-500" />
                                  ) : (
                                    <RiImageAddLine className="size-5 shrink-0" />
                                  )}
                                  <span className="text-caption-2-medium">
                                    {isProcessingPhotos ? 'ประมวลผล...' : 'เพิ่มรูป'}
                                  </span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {photoError && (
                          <p className="text-caption-2-medium text-status-rose-text animate-fade-in" data-testid="symptom-photo-error">
                            {photoError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Service & Schedule */}
                  {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-caption-1-semibold text-text-primary mb-1">แผนก / บริการที่ต้องการ</label>
                        <Select
                          aria-label="แผนก / บริการที่ต้องการ"
                          selectedKey={formData.serviceCategory}
                          onSelectionChange={(key) => setFormData({ ...formData, serviceCategory: String(key) })}
                          className="w-full"
                          triggerClassName="w-full justify-between rounded-xl px-3.5 py-2.5 text-body-medium bg-background-primary-default border-border-button-default shadow-xs"
                          popoverClassName="w-[var(--trigger-width)] min-w-[280px]"
                        >
                          {!STANDARD_SERVICES.includes(formData.serviceCategory) && (
                            <SelectItem id={formData.serviceCategory} textValue={formData.serviceCategory}>
                              {formData.serviceCategory}
                            </SelectItem>
                          )}
                          {STANDARD_SERVICES.map((s) => (
                            <SelectItem key={s} id={s} textValue={s}>
                              <div className="flex items-center gap-2">
                                <span className={s === 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง' ? 'size-2 rounded-full bg-status-rose-text shrink-0' : 'size-2 rounded-full bg-accent-500 shrink-0'} />
                                <span className={s === 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง' ? 'font-medium text-status-rose-text' : undefined}>
                                  {s === 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง' ? `${s} (เคสเร่งด่วน)` : s}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block text-caption-1-semibold text-text-primary mb-1.5">
                          วันที่สะดวกเข้ารับบริการ <span className="text-status-rose-text">*</span>
                        </label>
                        <DatePicker
                          aria-label="วันที่สะดวกเข้ารับบริการ"
                          value={formData.preferredDate ? parseDate(formData.preferredDate) : today(getLocalTimeZone())}
                          onChange={(newDate) => {
                            if (newDate) {
                              setFormData((prev) => ({ ...prev, preferredDate: newDate.toString() }));
                              if (errors.preferredDate) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.preferredDate;
                                  return next;
                                });
                              }
                            }
                          }}
                          minValue={today(getLocalTimeZone())}
                          className={errors.preferredDate ? 'border-status-rose-text bg-status-rose-background/20' : ''}
                        />
                        {errors.preferredDate && <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.preferredDate}</p>}
                      </div>

                      <div>
                        <label className="block text-caption-1-semibold text-text-tertiary uppercase tracking-wider mb-2">
                          ช่วงเวลาที่ต้องการ
                        </label>
                        <div role="group" aria-label="เลือกช่วงเวลาที่สะดวก" className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'morning' as const, label: 'เช้า (09:00 - 12:00)' },
                            { id: 'afternoon' as const, label: 'บ่าย (13:00 - 17:00)' },
                            { id: 'evening' as const, label: 'ค่ำ (17:00 - 20:00)' },
                          ].map((slot) => (
                            <button
                              type="button"
                              key={slot.id}
                              onClick={() => setFormData({ ...formData, preferredTimeSlot: slot.id })}
                              className={`button-press-motion p-2.5 rounded-xl text-caption-1-semibold border text-center cursor-pointer ${
                                formData.preferredTimeSlot === slot.id
                                  ? 'bg-accent-50 border-accent-500 text-accent-700 shadow-xs'
                                  : 'bg-background-secondary-default border-border-button-default text-text-secondary hover:bg-background-secondary-hover'
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Notice */}
                      <div className="p-3 bg-status-yellow-background rounded-2xl border border-border-button-default text-caption-1-medium text-status-yellow-text flex items-start gap-2">
                        <RiAlertFill className="size-4 shrink-0 mt-0.5" />
                        <span>หากสัตว์เลี้ยงมีอาการวิกฤต หายใจหอบ ชัก หรืออุบัติเหตุฉุกเฉิน สามารถนำส่งโรงพยาบาลได้ทันทีตลอด 24 ชม. โดยไม่ต้องรอนัด</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Owner Contact */}
                  {step === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Auth Status (แสดงเมื่อเข้าสู่ระบบแล้ว) */}
                      {currentUser && (
                        <div className="p-3.5 rounded-2xl bg-status-lime-background/50 border border-status-lime-text/30 flex items-center justify-between gap-3 text-caption-1-medium">
                          <div className="flex items-center gap-2.5 text-status-lime-text min-w-0">
                            <div className="size-7 rounded-full bg-status-lime-text/10 flex items-center justify-center shrink-0">
                              <RiCheckLine className="size-4" />
                            </div>
                            <div className="truncate">
                              <span className="text-text-primary font-semibold">เข้าสู่ระบบแล้วในชื่อ:</span>{' '}
                              <strong className="text-status-lime-text font-bold">{currentUser.name}</strong>{' '}
                              <span className="text-text-secondary">({currentUser.email})</span>
                            </div>
                          </div>
                          <Chip color="lime" variant="bold" className="shrink-0 text-caption-2-medium">
                            ยืนยันตัวตนแล้ว
                          </Chip>
                        </div>
                      )}

                      <div>
                        <label htmlFor="booking-owner-name" className="block text-caption-1-semibold text-text-primary mb-1">
                          ชื่อ-นามสกุล เจ้าของสัตว์เลี้ยง <span className="text-status-rose-text">*</span>
                        </label>
                        <input
                          id="booking-owner-name"
                          type="text"
                          placeholder="เช่น สมชาย ใจดี"
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring ${
                            errors.ownerName ? 'border-status-rose-text bg-status-rose-background/20' : 'border-border-button-default'
                          }`}
                        />
                        {errors.ownerName && <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.ownerName}</p>}
                      </div>

                      <div>
                        <label htmlFor="booking-owner-phone" className="block text-caption-1-semibold text-text-primary mb-1">
                          เบอร์โทรศัพท์ที่ติดต่อได้สะดวก <span className="text-status-rose-text">*</span>
                        </label>
                        <input
                          id="booking-owner-phone"
                          type="tel"
                          placeholder="เช่น 0812345678"
                          value={formData.ownerPhone}
                          onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring ${
                            errors.ownerPhone ? 'border-status-rose-text bg-status-rose-background/20' : 'border-border-button-default'
                          }`}
                        />
                        {errors.ownerPhone && <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.ownerPhone}</p>}
                      </div>

                      <div>
                        <label htmlFor="booking-owner-line" className="block text-caption-1-semibold text-text-primary mb-1">LINE ID (ถ้ามี)</label>
                        <input
                          id="booking-owner-line"
                          type="text"
                          placeholder="เช่น @somchai"
                          value={formData.ownerLineId}
                          onChange={(e) => setFormData({ ...formData, ownerLineId: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                        />
                      </div>

                      {/* Summary preview */}
                      <div className="p-3.5 bg-background-secondary-default rounded-2xl border border-border-button-default text-caption-1-medium text-text-secondary space-y-1.5">
                        <div className="font-bold text-text-primary flex items-center gap-1.5">
                          <RiHeartPulseFill className="size-4 text-accent-500" />
                          <span>สรุปข้อมูลการนัดหมาย:</span>
                        </div>
                        <div>น้อง {formData.petName || '—'} ({formData.petType}) เข้ารับบริการ {formData.serviceCategory}</div>
                        <div className="text-text-tertiary">วันที่ {formData.preferredDate} ({formData.preferredTimeSlot})</div>
                        {formData.symptomsDescription && (
                          <div className="text-text-secondary pt-1.5 border-t border-border-button-default/60">
                            <span className="text-text-tertiary">อาการที่ระบุ: </span>
                            <span>{formData.symptomsDescription}</span>
                          </div>
                        )}
                        {formData.symptomPhotos && formData.symptomPhotos.length > 0 && (
                          <div className="pt-2 border-t border-border-button-default/60">
                            <div className="text-caption-2-medium text-text-tertiary mb-1.5 flex items-center gap-1.5">
                              <RiCameraLine className="size-3.5 text-accent-500" />
                              <span>รูปถ่ายอาการที่แนบ ({formData.symptomPhotos.length} รูป):</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap" data-testid="step3-symptom-photos">
                              {formData.symptomPhotos.map((photo, idx) => (
                                <img
                                  key={idx}
                                  src={photo}
                                  alt={`รูปถ่ายอาการ ${idx + 1}`}
                                  className="size-12 rounded-lg object-cover border border-border-button-default shadow-2xs cursor-pointer hover:opacity-85 transition-opacity"
                                  onClick={() => setPreviewPhotoUrl(photo)}
                                  title="คลิกเพื่อดูรูปขยาย"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Actions */}
                  <div className="pt-4 border-t border-border-button-default flex items-center justify-between gap-3">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="medium"
                        leadingIcon={RiArrowLeftLine}
                        onClick={handlePrev}
                      >
                        ย้อนกลับ
                      </Button>
                    ) : <div />}

                    {step < 3 ? (
                      <Button
                        key="btn-next"
                        type="button"
                        variant="primary"
                        size="medium"
                        trailingIcon={RiArrowRightLine}
                        onClick={handleNext}
                        data-testid="booking-next-button"
                      >
                        ถัดไป
                      </Button>
                    ) : (
                      <Button
                        key="btn-submit"
                        type="submit"
                        variant="primary"
                        size="medium"
                        disabled={isSubmitting}
                        leadingIcon={RiCheckLine}
                        data-testid="booking-submit-button"
                      >
                        {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันคำขอนัดหมาย'}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fullsize Photo Preview Lightbox */}
      {previewPhotoUrl && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewPhotoUrl(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="รูปถ่ายอาการขนาดใหญ่"
          data-testid="photo-preview-lightbox"
        >
          <div
            className="relative max-w-2xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewPhotoUrl}
              alt="รูปถ่ายอาการขยายใหญ่"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain border border-border-button-default shadow-2xl bg-background-primary-default"
            />
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              aria-label="ปิดรูปถ่ายขยาย"
              data-testid="close-photo-preview-lightbox"
              className="absolute top-2 end-2 size-8 rounded-full bg-background-primary-default/90 text-text-primary hover:bg-background-primary-default flex items-center justify-center border border-border-button-default shadow-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
