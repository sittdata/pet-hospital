import React, { useState, useEffect, useRef } from 'react';
import {
  RiCloseLine,
  RiCheckLine,
  RiCalendarEventLine,
  RiShieldCheckLine,
  RiAddLine,
  RiStethoscopeLine,
  RiMedicineBottleLine,
  RiFileTextLine,
  RiInformationLine,
} from '@remixicon/react';
import { PetPassport, VaccineRecord, VaccineStatus } from '../types/petPassport';
import {
  getStoredPassports,
  saveStoredPassports,
} from '../data/petPassportData';
import { Button } from '@/components/base/buttons/button';
import { Avatar } from '@/components/base/avatar/avatar';
import { StatusDot } from '@/components/base/badges/status-dot';

interface PetHealthPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (serviceName?: string, petType?: string) => void;
  initialPetId?: string;
}

export function deriveVaccineStatus(vac: VaccineRecord): VaccineStatus {
  if (vac.dateAdministered) {
    return 'completed';
  }
  if (vac.dueDate) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (vac.dueDate < todayStr) {
      return 'overdue';
    }
  }
  return 'upcoming';
}

export const PetHealthPassportModal: React.FC<PetHealthPassportModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
}) => {
  const [passports, setPassports] = useState<PetPassport[]>([]);
  const [activeTab, setActiveTab] = useState<'vaccines' | 'treatments'>('vaccines');
  const [showAddVaccine, setShowAddVaccine] = useState(false);

  // New Vaccine Form State
  const [vacName, setVacName] = useState('');
  const [vacDueDate, setVacDueDate] = useState('');
  const [vacVet, setVacVet] = useState('สพ.ญ. ดร. นลิน พิพิธกุล');
  const [vacNotes, setVacNotes] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Load passports on mount / open
  useEffect(() => {
    if (isOpen) {
      const data = getStoredPassports();
      setPassports(data);
    }
  }, [isOpen]);

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
        onClose();
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

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const activePet = passports[0];
  const petVaccines: VaccineRecord[] = activePet?.vaccines ?? [];
  const petTreatments = activePet?.treatments ?? [];

  const handleAddVaccineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePet || !vacName.trim()) return;

    const newRecord: VaccineRecord = {
      id: `vac-${Date.now()}`,
      name: vacName.trim(),
      dueDate: vacDueDate || undefined,
      status: 'upcoming',
      veterinarian: vacVet.trim(),
      notes: vacNotes.trim() || undefined,
    };

    const updatedPassports = passports.map((p) => {
      if (p.id === activePet.id) {
        return {
          ...p,
          vaccines: [newRecord, ...(p.vaccines || [])],
        };
      }
      return p;
    });

    setPassports(updatedPassports);
    saveStoredPassports(updatedPassports);
    setVacName('');
    setVacDueDate('');
    setVacNotes('');
    setShowAddVaccine(false);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pet-passport-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-background-primary-default border border-border-button-default rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border-button-default bg-background-secondary-default/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-accent-500/15 text-accent-700 dark:text-accent-300 flex items-center justify-center">
              <RiShieldCheckLine className="size-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="pet-passport-title"
                  className="text-title-3-semibold text-text-primary tracking-tight"
                >
                  สมุดวัคซีนและประวัติสุขภาพสัตว์เลี้ยงดิจิทัล
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background-secondary-default text-text-secondary text-caption-2-medium border border-border-button-default">
                  <StatusDot color="green" />
                  <span>สมุดสุขภาพทางการ</span>
                </span>
              </div>
              <p className="text-caption-1-regular text-text-secondary">
                VetPaws Digital Health Record & Preventive Tracker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-background-secondary-default transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่างสมุดสุขภาพ"
          >
            <RiCloseLine className="size-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {/* Pet Bio Summary Card (Clean, Single Pet Focus) */}
          {activePet && (
            <div className="p-5 rounded-3xl bg-background-secondary-default/50 border border-border-button-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {activePet.avatarUrl ? (
                  <img
                    src={activePet.avatarUrl}
                    alt={activePet.name}
                    className="size-16 rounded-2xl object-cover border border-border-button-default shadow-xs"
                  />
                ) : (
                  <Avatar initials={activePet.name.slice(0, 2)} size="lg" />
                )}
                <div>
                  <h3 className="text-title-3-semibold text-text-primary">{activePet.name}</h3>
                  <p className="text-body-medium text-text-secondary">
                    {activePet.breed} • เพศเมีย
                  </p>
                  <p className="text-caption-2-regular text-text-tertiary">
                    ไมโครชิป: {activePet.microchipNo} • เจ้าของ: {activePet.ownerName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <div className="px-3.5 py-2 rounded-2xl bg-background-primary-default border border-border-button-default text-center">
                  <div className="text-caption-2-regular text-text-tertiary">อายุ</div>
                  <div className="text-body-2-semibold text-text-primary">{activePet.age}</div>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-background-primary-default border border-border-button-default text-center">
                  <div className="text-caption-2-regular text-text-tertiary">น้ำหนัก</div>
                  <div className="text-body-2-semibold text-text-primary">{activePet.weight}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center justify-between border-b border-border-button-default pb-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('vaccines')}
                className={`pb-2 text-body-medium font-medium transition-colors relative flex items-center gap-2 cursor-pointer ${
                  activeTab === 'vaccines'
                    ? 'text-accent-600 dark:text-accent-400 font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <RiMedicineBottleLine className="size-4" />
                <span>ตารางนัดวัคซีน & การป้องกัน ({petVaccines.length})</span>
                {activeTab === 'vaccines' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('treatments')}
                className={`pb-2 text-body-medium font-medium transition-colors relative flex items-center gap-2 cursor-pointer ${
                  activeTab === 'treatments'
                    ? 'text-accent-600 dark:text-accent-400 font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <RiFileTextLine className="size-4" />
                <span>ประวัติการรักษาที่ผ่านมา ({petTreatments.length})</span>
                {activeTab === 'treatments' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 rounded-full" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'vaccines' && (
                <Button
                  variant="secondary"
                  size="small"
                  leadingIcon={RiAddLine}
                  onClick={() => setShowAddVaccine(!showAddVaccine)}
                >
                  {showAddVaccine ? 'ปิดฟอร์ม' : 'เพิ่มนัดวัคซีน'}
                </Button>
              )}
            </div>
          </div>

          {/* Form: Add New Scheduled Vaccine */}
          {showAddVaccine && activePet && (
            <form
              onSubmit={handleAddVaccineSubmit}
              className="p-5 rounded-3xl bg-background-secondary-default border border-border-button-default space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-body-2-semibold text-text-primary flex items-center gap-2">
                  <RiMedicineBottleLine className="size-4 text-accent-500" />
                  เพิ่มกำหนดนัดหมายวัคซีนล่วงหน้า ({activePet.name})
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddVaccine(false)}
                  className="text-text-tertiary hover:text-text-primary cursor-pointer"
                >
                  <RiCloseLine className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    ชื่อวัคซีน / โปรแกรมป้องกัน *
                  </label>
                  <input
                    type="text"
                    required
                    value={vacName}
                    onChange={(e) => setVacName(e.target.value)}
                    placeholder="เช่น วัคซีนรวมไข้หัดแมว, ป้องกันพิษสุนัขบ้า, ป้องกันพยาธิหนอนหัวใจ"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    กำหนดวันที่ควรเข้ารับการฉีด *
                  </label>
                  <input
                    type="date"
                    required
                    value={vacDueDate}
                    onChange={(e) => setVacDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    สัตวแพทย์ผู้รับผิดชอบ
                  </label>
                  <input
                    type="text"
                    value={vacVet}
                    onChange={(e) => setVacVet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    คำแนะนำ / การเตรียมตัวก่อนมา
                  </label>
                  <input
                    type="text"
                    value={vacNotes}
                    onChange={(e) => setVacNotes(e.target.value)}
                    placeholder="เช่น งดอาหาร 2 ชม., นำสมุดเล่มจริงมาด้วย"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => setShowAddVaccine(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" variant="primary" size="small" leadingIcon={RiCheckLine}>
                  บันทึกตารางนัด
                </Button>
              </div>
            </form>
          )}

          {/* TAB 1: Vaccination Schedule (Upcoming / Pending Doses Only) */}
          {activeTab === 'vaccines' && (
            <div className="space-y-3">
              {petVaccines.length === 0 ? (
                <div className="py-12 text-center text-text-tertiary">
                  <RiInformationLine className="size-8 mx-auto mb-2 opacity-60" />
                  <p className="text-body-medium">ไม่มีรายการวัคซีนที่ค้างหรือรอฉีดในขณะนี้</p>
                  <p className="text-caption-1-regular mt-1">
                    ดูประวัติวัคซีนที่ได้รับแล้วได้ที่แท็บ "ประวัติการรักษาที่ผ่านมา"
                  </p>
                </div>
              ) : (
                petVaccines.map((vac) => {
                  const derivedStatus = deriveVaccineStatus(vac);

                  return (
                    <div
                      key={vac.id}
                      className="p-5 rounded-3xl bg-background-secondary-default/50 border border-border-button-default hover:border-accent-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-body-2-semibold text-text-primary">{vac.name}</h4>
                          {derivedStatus === 'upcoming' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background-primary-default text-text-secondary text-caption-2-medium border border-border-button-default">
                              <StatusDot color="yellow" />
                              <span>รอเข้ารับการฉีด</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-rose-background text-status-rose-text text-caption-2-medium border border-border-button-default">
                              <span className="size-1.5 rounded-full bg-status-rose-text shrink-0" />
                              <span>เกินกำหนดนัด</span>
                            </span>
                          )}
                        </div>

                        <div className="text-caption-1-regular text-text-secondary flex items-center gap-4 flex-wrap">
                          {vac.dueDate && (
                            <span className="font-medium text-text-primary">
                              กำหนดฉีด: {vac.dueDate}
                            </span>
                          )}
                          {vac.veterinarian && (
                            <span className="text-text-tertiary">
                              สัตวแพทย์: {vac.veterinarian}
                            </span>
                          )}
                        </div>

                        {vac.notes && (
                          <p className="text-caption-1-regular text-text-secondary bg-background-primary-default p-2.5 rounded-xl border border-border-button-default">
                            {vac.notes}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        <Button
                          variant="primary"
                          size="small"
                          leadingIcon={RiCalendarEventLine}
                          onClick={() => {
                            onClose();
                            onBookAppointment('ตรวจสุขภาพทั่วไปและฉีดวัคซีน', activePet?.petType);
                          }}
                        >
                          นัดหมายฉีดวัคซีนนี้
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Medical History (Past Vaccinations & Clinic Visits) */}
          {activeTab === 'treatments' && (
            <div className="space-y-4">
              {petTreatments.length === 0 ? (
                <div className="py-12 text-center text-text-tertiary">
                  <RiInformationLine className="size-8 mx-auto mb-2 opacity-60" />
                  <p className="text-body-medium">ยังไม่มีประวัติการเข้ารับการรักษา</p>
                </div>
              ) : (
                petTreatments.map((treat) => (
                  <div
                    key={treat.id}
                    className="p-5 rounded-3xl bg-background-secondary-default/50 border border-border-button-default space-y-2.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400">
                          <RiStethoscopeLine className="size-4" />
                        </span>
                        <h4 className="text-body-2-semibold text-text-primary">
                          {treat.diagnosis}
                        </h4>
                      </div>
                      <span className="text-caption-2-medium text-text-tertiary px-2.5 py-1 rounded-full bg-background-primary-default border border-border-button-default">
                        {treat.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption-1-regular text-text-secondary">
                      <div>
                        <span className="text-text-tertiary">แผนก: </span>
                        {treat.clinicDepartment}
                      </div>
                      <div>
                        <span className="text-text-tertiary">สัตวแพทย์: </span>
                        {treat.veterinarian}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary">
                      <div className="text-caption-2-bold text-accent-700 dark:text-accent-300 mb-0.5">
                        การรักษา / หัตถการที่ได้รับ:
                      </div>
                      {treat.treatment}
                    </div>

                    {treat.notes && (
                      <div className="text-caption-1-regular text-text-secondary bg-background-secondary-default p-2.5 rounded-xl border border-border-button-default">
                        <span className="font-semibold text-text-primary">คำแนะนำแพทย์: </span>
                        {treat.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-border-button-default bg-background-secondary-default/50 flex items-center justify-end">
          <Button variant="secondary" size="small" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
        </div>
      </div>
    </div>
  );
};
