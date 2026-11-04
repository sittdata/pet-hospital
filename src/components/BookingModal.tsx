import React, { useState, useEffect } from 'react';
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
} from '@remixicon/react';
import { PetType, AppointmentFormData } from '../types';
import { CatIcon, DogIcon, RabbitIcon, SmallPetIcon } from './icons/PetIcons';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { SocialButton } from '@/components/base/social-button/social-button';
import { StatusDot } from '@/components/base/badges/status-dot';
import { Chip } from '@/components/base/badges/chip';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPetType?: PetType;
  initialService?: string;
  initialDoctor?: string;
}

const EMERGENCY_KEYWORDS = [
  'ฉุกเฉิน', 'วิกฤต', 'หายใจหอบ', 'อ้าปากหายใจ', 'ลิ้นม่วง', 'ชัก', 'เกร็ง', 'หมดสติ',
  'กระเพาะบิด', 'gdv', 'ขย้อน', 'ฉี่ไม่ออก', 'ปัสสาวะไม่ออก', 'flutd', 'สารพิษ',
  'ช็อกโกแลต', 'พารา', 'เลือดไหล', 'รถชน', 'ตกตึก', 'ซีด', 'ช็อก'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPetType = 'cat',
  initialService = '',
  initialDoctor = '',
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRefCode, setBookingRefCode] = useState<string>('');
  const [dismissedEmergencyWarning, setDismissedEmergencyWarning] = useState<boolean>(false);

  const [formData, setFormData] = useState<AppointmentFormData>({
    petType: initialPetType,
    petName: '',
    petBreed: '',
    petAge: '',
    serviceCategory: initialService || 'ตรวจสุขภาพทั่วไปและฉีดวัคซีน',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTimeSlot: 'morning',
    isEmergencyCase: false,
    symptomsDescription: '',
    ownerName: '',
    ownerPhone: '',
    ownerLineId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPetType) setFormData((prev) => ({ ...prev, petType: initialPetType }));
    if (initialService) setFormData((prev) => ({ ...prev, serviceCategory: initialService }));
    if (initialDoctor) setFormData((prev) => ({ ...prev, symptomsDescription: `ระบุแพทย์: ${initialDoctor}` }));
    setDismissedEmergencyWarning(false);
  }, [initialPetType, initialService, initialDoctor, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time Emergency Keyword Detection
  const combinedText = `${formData.serviceCategory} ${formData.symptomsDescription}`.toLowerCase();
  const detectedEmergency = EMERGENCY_KEYWORDS.some((kw) => combinedText.includes(kw));
  const showEmergencyIntercept = (detectedEmergency || formData.isEmergencyCase) && !dismissedEmergencyWarning;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const refCode = `ARAK-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRefCode(refCode);

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('arak_appointments') || '[]');
        existing.push({ ...formData, refCode, createdAt: new Date().toISOString() });
        localStorage.setItem('arak_appointments', JSON.stringify(existing));
      } catch (err) {
        console.error('Storage error', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setDismissedEmergencyWarning(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
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
              <h3 className="font-bold text-title-3-semibold text-text-primary leading-none">นัดหมายตรวจล่วงหน้า</h3>
              <p className="text-caption-1-medium text-text-tertiary mt-0.5">แม็กเหนือวินเหนือพิกโก้ สัตวแพทย์</p>
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
                onClick={() => setDismissedEmergencyWarning(true)}
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
                  </div>

                  <p className="text-caption-1-medium text-text-tertiary max-w-sm mx-auto leading-relaxed">
                    เจ้าหน้าที่แผนกเวชระเบียนจะติดต่อกลับผ่านเบอร์โทรศัพท์เพื่อยืนยันคิวตรวจและแพทย์ประจำการภายใน 15-30 นาที
                  </p>

                  <Button
                    variant="primary"
                    size="medium"
                    onClick={handleResetAndClose}
                    className="w-full justify-center"
                  >
                    เรียบร้อย
                  </Button>
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
                        <div className="grid grid-cols-4 gap-2">
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
                        <label className="block text-caption-1-semibold text-text-primary mb-1">
                          ชื่อสัตว์เลี้ยง <span className="text-status-rose-text">*</span>
                        </label>
                        <input
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-caption-1-semibold text-text-primary mb-1">สายพันธุ์ (ถ้ามี)</label>
                          <input
                            type="text"
                            placeholder="เช่น บริติชช็อตแฮร์, โกลเด้น"
                            value={formData.petBreed}
                            onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-caption-1-semibold text-text-primary mb-1">อายุโดยประมาณ</label>
                          <input
                            type="text"
                            placeholder="เช่น 2 ปี 4 เดือน"
                            value={formData.petAge}
                            onChange={(e) => setFormData({ ...formData, petAge: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-caption-1-semibold text-text-primary mb-1">อาการเบื้องต้นที่สังเกตพบ</label>
                        <textarea
                          rows={2}
                          placeholder="เช่น ซึม ไม่กินข้าว อาเจียน 2 ครั้ง หรือนัดตรวจสุขภาพประจำปี"
                          value={formData.symptomsDescription}
                          onChange={(e) => setFormData({ ...formData, symptomsDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Service & Schedule */}
                  {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-caption-1-semibold text-text-primary mb-1">แผนก / บริการที่ต้องการ</label>
                        <select
                          value={formData.serviceCategory}
                          onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                        >
                          <option value="ตรวจสุขภาพทั่วไปและฉีดวัคซีน">ตรวจสุขภาพทั่วไปและฉีดวัคซีน</option>
                          <option value="คลินิกแมวปลอดความเครียด (ISFM)">คลินิกแมวปลอดความเครียด (ISFM)</option>
                          <option value="ศูนย์ศัลยกรรมและผ่าตัดกระดูก/ข้อ">ศูนย์ศัลยกรรมและผ่าตัดกระดูก/ข้อ</option>
                          <option value="ศูนย์สัตว์พิเศษ Exotic Pets">ศูนย์สัตว์พิเศษ Exotic Pets</option>
                          <option value="ตรวจหัวใจและเอคโค่ (Echo)">ตรวจหัวใจและเอคโค่ (Echo)</option>
                          <option value="ศูนย์รังสีวินิจฉัย CT Scan / Ultrasound">ศูนย์รังสีวินิจฉัย CT Scan / Ultrasound</option>
                          <option value="ศูนย์ฟื้นฟูและกายภาพบำบัดธาราบำบัด">ศูนย์ฟื้นฟูและกายภาพบำบัดธาราบำบัด</option>
                          <option value="ศูนย์ฉุกเฉินและกู้ชีพ 24 ชม.">ศูนย์ฉุกเฉินและกู้ชีพ 24 ชม. (เคสเร่งด่วน)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-caption-1-semibold text-text-primary mb-1">
                          วันที่สะดวกเข้ารับบริการ <span className="text-status-rose-text">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.preferredDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring ${
                            errors.preferredDate ? 'border-status-rose-text bg-status-rose-background/20' : 'border-border-button-default'
                          }`}
                        />
                        {errors.preferredDate && <p className="text-caption-2-medium text-status-rose-text mt-1">{errors.preferredDate}</p>}
                      </div>

                      <div>
                        <label className="block text-caption-1-semibold text-text-tertiary uppercase tracking-wider mb-2">
                          ช่วงเวลาที่ต้องการ
                        </label>
                        <div className="grid grid-cols-3 gap-2">
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
                      {/* Quick Auto-Fill with BoardUI Social Buttons */}
                      <div className="p-3 rounded-2xl bg-background-secondary-default border border-border-button-default space-y-2">
                        <span className="block text-caption-2-medium text-text-tertiary">
                          กรอกข้อมูลอัตโนมัติด้วยบัญชีโซเชียล:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <SocialButton
                            brand="google"
                            appearance="white"
                            size="small"
                            fullWidth
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                ownerName: prev.ownerName || 'กิตติศักดิ์ วงศ์วิริยะ',
                                ownerPhone: prev.ownerPhone || '0891234567',
                              }));
                            }}
                          >
                            ดึงข้อมูลด้วย Google
                          </SocialButton>
                          <SocialButton
                            brand="apple"
                            appearance="black"
                            size="small"
                            fullWidth
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                ownerName: prev.ownerName || 'กิตติศักดิ์ วงศ์วิริยะ',
                                ownerPhone: prev.ownerPhone || '0891234567',
                              }));
                            }}
                          >
                            ดึงข้อมูลด้วย Apple
                          </SocialButton>
                        </div>
                      </div>

                      <div>
                        <label className="block text-caption-1-semibold text-text-primary mb-1">
                          ชื่อ-นามสกุล เจ้าของสัตว์เลี้ยง <span className="text-status-rose-text">*</span>
                        </label>
                        <input
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
                        <label className="block text-caption-1-semibold text-text-primary mb-1">
                          เบอร์โทรศัพท์ที่ติดต่อได้สะดวก <span className="text-status-rose-text">*</span>
                        </label>
                        <input
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
                        <label className="block text-caption-1-semibold text-text-primary mb-1">LINE ID (ถ้ามี)</label>
                        <input
                          type="text"
                          placeholder="เช่น @somchai"
                          value={formData.ownerLineId}
                          onChange={(e) => setFormData({ ...formData, ownerLineId: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border-button-default text-body-medium text-text-primary bg-background-primary-default focus:outline-none focus:ring-2 focus:ring-border-focus-ring"
                        />
                      </div>

                      {/* Summary preview */}
                      <div className="p-3.5 bg-background-secondary-default rounded-2xl border border-border-button-default text-caption-1-medium text-text-secondary space-y-1">
                        <div className="font-bold text-text-primary flex items-center gap-1.5">
                          <RiHeartPulseFill className="size-4 text-accent-500" />
                          <span>สรุปข้อมูลการนัดหมาย:</span>
                        </div>
                        <div>น้อง {formData.petName || '—'} ({formData.petType}) เข้ารับบริการ {formData.serviceCategory}</div>
                        <div className="text-text-tertiary">วันที่ {formData.preferredDate} ({formData.preferredTimeSlot})</div>
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
                        type="button"
                        variant="primary"
                        size="medium"
                        trailingIcon={RiArrowRightLine}
                        onClick={handleNext}
                      >
                        ถัดไป
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        size="medium"
                        disabled={isSubmitting}
                        leadingIcon={RiCheckLine}
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
    </div>
  );
};
