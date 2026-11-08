import React, { useState, useEffect, useRef } from 'react';
import {
  RiCloseLine,
  RiCheckLine,
  RiCalendarEventLine,
  RiHeartPulseFill,
  RiShieldCheckLine,
  RiAddLine,
  RiRestartLine,
  RiStethoscopeLine,
  RiMedicineBottleLine,
  RiFileTextLine,
  RiInformationLine,
  RiSparklingFill,
} from '@remixicon/react';
import { PetPassport, VaccineRecord, VaccineStatus, PassportPetType } from '../types/petPassport';
import {
  getStoredPassports,
  saveStoredPassports,
  resetStoredPassports,
} from '../data/petPassportData';
import { Button } from '@/components/base/buttons/button';
import { Avatar } from '@/components/base/avatar/avatar';
import { StatusDot } from '@/components/base/badges/status-dot';
import { CatIcon, DogIcon, SmallPetIcon } from './icons/PetIcons';

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
    return 'upcoming';
  }
  return vac.status || 'completed';
}

export const PetHealthPassportModal: React.FC<PetHealthPassportModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
  initialPetId,
}) => {
  const [passports, setPassports] = useState<PetPassport[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'vaccines' | 'treatments'>('vaccines');

  // Form states
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);

  // New Vaccine Form State
  const [vacName, setVacName] = useState('');
  const [vacDate, setVacDate] = useState('');
  const [vacDueDate, setVacDueDate] = useState('');
  const [vacVet, setVacVet] = useState('น.สพ. สัตวแพทย์ประจำบ้าน');
  const [vacLot, setVacLot] = useState('');
  const [vacNotes, setVacNotes] = useState('');

  // New Pet Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<PassportPetType>('cat');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetGender, setNewPetGender] = useState<'male' | 'female'>('female');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Load passports on mount / open
  useEffect(() => {
    if (isOpen) {
      const data = getStoredPassports();
      setPassports(data);
      if (initialPetId && data.some((p) => p.id === initialPetId)) {
        setSelectedPetId(initialPetId);
      } else if (data.length > 0) {
        setSelectedPetId(data[0].id);
      }
    }
  }, [isOpen, initialPetId]);

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

  const activePet = passports.find((p) => p.id === selectedPetId) || passports[0];
  const petVaccines: VaccineRecord[] = activePet?.vaccines ?? [];
  const petTreatments = activePet?.treatments ?? [];

  const handleResetDemo = () => {
    const defaultData = resetStoredPassports();
    setPassports(defaultData);
    if (defaultData.length > 0) {
      setSelectedPetId(defaultData[0].id);
    }
    setShowAddVaccine(false);
    setShowAddPet(false);
  };

  const handleAddVaccineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePet || !vacName.trim()) return;

    const administeredDate = vacDate || new Date().toISOString().split('T')[0];
    let computedStatus: VaccineStatus = 'completed';
    if (vacDueDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (vacDueDate < todayStr) {
        computedStatus = 'overdue';
      } else {
        computedStatus = 'completed';
      }
    }

    const newRecord: VaccineRecord = {
      id: `vac-${Date.now()}`,
      name: vacName.trim(),
      dateAdministered: administeredDate,
      dueDate: vacDueDate || undefined,
      status: computedStatus,
      veterinarian: vacVet.trim(),
      lotNumber: vacLot.trim() || undefined,
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
    setVacDate('');
    setVacDueDate('');
    setVacLot('');
    setVacNotes('');
    setShowAddVaccine(false);
  };

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const newPet: PetPassport = {
      id: `pet-${Date.now()}`,
      name: newPetName.trim(),
      petType: newPetType,
      breed: newPetBreed.trim() || 'ผสม / ไม่ระบุ',
      gender: newPetGender,
      age: newPetAge.trim() || 'ไม่ระบุ',
      weight: newPetWeight.trim() ? `${newPetWeight.trim()} kg` : 'ไม่ระบุ',
      microchipNo: `TH-${Math.floor(100000000 + Math.random() * 900000000)}`,
      ownerName: 'คุณศิษฐิวัชร์',
      vaccines: [],
      treatments: [],
    };

    const updated = [...passports, newPet];
    setPassports(updated);
    saveStoredPassports(updated);
    setSelectedPetId(newPet.id);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetWeight('');
    setShowAddPet(false);
  };

  const getPetIcon = (type: PassportPetType) => {
    switch (type) {
      case 'cat':
        return <CatIcon className="size-4" />;
      case 'dog':
        return <DogIcon className="size-4" />;
      case 'bird':
        return <SmallPetIcon className="size-4" />;
      default:
        return <RiHeartPulseFill className="size-4" />;
    }
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
        className="w-full max-w-4xl bg-background-primary-default border border-border-button-default rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up"
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
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-lime-background text-status-lime-text text-caption-2-bold border border-status-lime-border">
                  <StatusDot color="green" />
                  <span>Verified Passport</span>
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
          {/* Pet Switcher Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-2">
              {passports.map((pet) => {
                const isSelected = pet.id === activePet?.id;
                return (
                  <button
                    key={pet.id}
                    onClick={() => {
                      setSelectedPetId(pet.id);
                      setShowAddVaccine(false);
                      setShowAddPet(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-caption-1-semibold transition-all shrink-0 border cursor-pointer ${
                      isSelected
                        ? 'bg-accent-500 text-text-white border-accent-600 shadow-xs'
                        : 'bg-background-secondary-default text-text-secondary border-border-button-default hover:bg-background-secondary-hover'
                    }`}
                  >
                    {getPetIcon(pet.petType)}
                    <span>{pet.name}</span>
                  </button>
                );
              })}
            </div>
            <Button
              variant="secondary"
              size="small"
              leadingIcon={RiAddLine}
              onClick={() => {
                setShowAddPet(true);
                setShowAddVaccine(false);
              }}
              className="shrink-0"
            >
              เพิ่มสัตว์เลี้ยง
            </Button>
          </div>

          {/* Form: Add New Pet */}
          {showAddPet && (
            <form
              onSubmit={handleAddPetSubmit}
              className="p-5 rounded-3xl bg-background-secondary-default border border-border-button-default space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-body-2-semibold text-text-primary flex items-center gap-2">
                  <RiSparklingFill className="size-4 text-accent-500" />
                  ลงทะเบียนสัตว์เลี้ยงใหม่เข้าสู่สมุดสุขภาพดิจิทัล
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddPet(false)}
                  className="text-text-tertiary hover:text-text-primary cursor-pointer"
                >
                  <RiCloseLine className="size-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    ชื่อสัตว์เลี้ยง *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    placeholder="เช่น น้องส้ม, ชาโคล"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    ชนิดสัตว์
                  </label>
                  <select
                    value={newPetType}
                    onChange={(e) => setNewPetType(e.target.value as PassportPetType)}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  >
                    <option value="cat">แมว (Cat)</option>
                    <option value="dog">สุนัข (Dog)</option>
                    <option value="bird">นก (Bird)</option>
                    <option value="exotic">สัตว์พิเศษ (Exotic)</option>
                    <option value="aquatic">สัตว์น้ำ/สัตว์เลื้อยคลาน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    สายพันธุ์
                  </label>
                  <input
                    type="text"
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                    placeholder="เช่น สกอตติช โฟลด์"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    เพศ
                  </label>
                  <select
                    value={newPetGender}
                    onChange={(e) => setNewPetGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  >
                    <option value="female">เพศเมีย</option>
                    <option value="male">เพศผู้</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    อายุ
                  </label>
                  <input
                    type="text"
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(e.target.value)}
                    placeholder="เช่น 1 ปี 4 เดือน"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    น้ำหนัก (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPetWeight}
                    onChange={(e) => setNewPetWeight(e.target.value)}
                    placeholder="เช่น 3.8"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => setShowAddPet(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" variant="primary" size="small" leadingIcon={RiCheckLine}>
                  บันทึกสัตว์เลี้ยง
                </Button>
              </div>
            </form>
          )}

          {/* Active Pet Bio Summary Card */}
          {activePet ? (
            <div className="p-5 rounded-3xl bg-background-secondary-default/50 border border-border-button-default flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-title-3-semibold text-text-primary">{activePet.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-700 dark:text-accent-300 text-caption-2-bold border border-accent-500/20">
                      {activePet.gender === 'female' ? 'เพศเมีย ♀' : 'เพศผู้ ♂'}
                    </span>
                  </div>
                  <p className="text-body-medium text-text-secondary">{activePet.breed}</p>
                  <p className="text-caption-2-regular text-text-tertiary">
                    ไมโครชิป: {activePet.microchipNo} • เจ้าของ: {activePet.ownerName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:w-auto">
                <div className="px-3.5 py-2 rounded-2xl bg-background-primary-default border border-border-button-default text-center">
                  <div className="text-caption-2-regular text-text-tertiary">อายุ</div>
                  <div className="text-body-2-semibold text-text-primary">{activePet.age}</div>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-background-primary-default border border-border-button-default text-center">
                  <div className="text-caption-2-regular text-text-tertiary">น้ำหนัก</div>
                  <div className="text-body-2-semibold text-text-primary">{activePet.weight}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-2xl bg-background-primary-default border border-border-button-default text-center">
                  <div className="text-caption-2-regular text-text-tertiary">วัคซีนทั้งหมด</div>
                  <div className="text-body-2-semibold text-accent-600 dark:text-accent-400">
                    {petVaccines.length} รายการ
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-text-secondary bg-background-secondary-default rounded-3xl border border-border-button-default">
              <p className="text-body-medium font-medium">ยังไม่มีข้อมูลสัตว์เลี้ยง</p>
              <Button
                variant="primary"
                size="small"
                leadingIcon={RiAddLine}
                onClick={() => setShowAddPet(true)}
                className="mt-3"
              >
                เพิ่มสัตว์เลี้ยงตัวแรก
              </Button>
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
                <span>ตารางวัคซีน & การป้องกัน ({petVaccines.length})</span>
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
                <span>ประวัติการตรวจรักษา ({petTreatments.length})</span>
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
                  {showAddVaccine ? 'ปิดฟอร์ม' : 'บันทึกวัคซีน'}
                </Button>
              )}
              <Button
                variant="primary"
                size="small"
                leadingIcon={RiCalendarEventLine}
                onClick={() => {
                  onClose();
                  onBookAppointment('ตรวจสุขภาพทั่วไปและฉีดวัคซีน', activePet?.petType);
                }}
              >
                นัดฉีดวัคซีนที่โรงพยาบาล
              </Button>
            </div>
          </div>

          {/* Form: Add New Vaccine */}
          {showAddVaccine && activePet && (
            <form
              onSubmit={handleAddVaccineSubmit}
              className="p-5 rounded-3xl bg-background-secondary-default border border-border-button-default space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-body-2-semibold text-text-primary flex items-center gap-2">
                  <RiMedicineBottleLine className="size-4 text-accent-500" />
                  บันทึกประวัติวัคซีนหรือยากันพยาธิ ({activePet.name})
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
                    ชื่อวัคซีน / ยากันเห็บหมัด-หนอนหัวใจ *
                  </label>
                  <input
                    type="text"
                    required
                    value={vacName}
                    onChange={(e) => setVacName(e.target.value)}
                    placeholder="เช่น วัคซีนรวมไข้หัดแมว, พิษสุนัขบ้า, NexGard, Bravecto"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    วันที่ได้รับวัคซีน
                  </label>
                  <input
                    type="date"
                    value={vacDate}
                    onChange={(e) => setVacDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    กำหนดนัดฉีดกระตุ้นรอบถัดไป (Due Date)
                  </label>
                  <input
                    type="date"
                    value={vacDueDate}
                    onChange={(e) => setVacDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    สัตวแพทย์ผู้ฉีด / คลินิก
                  </label>
                  <input
                    type="text"
                    value={vacVet}
                    onChange={(e) => setVacVet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    เลข Lot วัคซีน
                  </label>
                  <input
                    type="text"
                    value={vacLot}
                    onChange={(e) => setVacLot(e.target.value)}
                    placeholder="เช่น LOT-2026-X99"
                    className="w-full px-3 py-2 rounded-xl bg-background-primary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-caption-2-medium text-text-secondary mb-1">
                    หมายเหตุ / อาการหลังฉีด
                  </label>
                  <input
                    type="text"
                    value={vacNotes}
                    onChange={(e) => setVacNotes(e.target.value)}
                    placeholder="เช่น ไม่มีอาการแพ้ แข็งแรง ร่าเริงดี"
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
                  บันทึกประวัติ
                </Button>
              </div>
            </form>
          )}

          {/* TAB 1: Vaccination Timeline */}
          {activeTab === 'vaccines' && (
            <div className="space-y-3">
              {petVaccines.length === 0 ? (
                <div className="py-12 text-center text-text-tertiary">
                  <RiInformationLine className="size-8 mx-auto mb-2 opacity-60" />
                  <p className="text-body-medium">ยังไม่มีประวัติการฉีดวัคซีนสำหรับสัตว์เลี้ยงตัวนี้</p>
                  <p className="text-caption-1-regular mt-1">
                    คลิก "บันทึกวัคซีน" ด้านบนเพื่อเพิ่มข้อมูลประวัติ
                  </p>
                </div>
              ) : (
                petVaccines.map((vac) => {
                  const derivedStatus = deriveVaccineStatus(vac);
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-lime-background text-status-lime-text text-caption-2-bold border border-status-lime-border">
                      <StatusDot color="green" />
                      <span>ได้รับแล้ว</span>
                    </span>
                  );

                  if (derivedStatus === 'upcoming') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-yellow-background text-status-yellow-text text-caption-2-bold border border-border-button-default">
                        <StatusDot color="yellow" />
                        <span>ใกล้ถึงกำหนด</span>
                      </span>
                    );
                  } else if (derivedStatus === 'overdue') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-rose-background text-status-rose-text text-caption-2-bold border border-border-button-default">
                        <span className="size-2 rounded-full bg-status-rose-text inline-block shrink-0" />
                        <span>เกินกำหนดฉีด</span>
                      </span>
                    );
                  }

                  return (
                    <div
                      key={vac.id}
                      className="p-4 rounded-2xl bg-background-secondary-default/40 border border-border-button-default hover:border-accent-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-body-2-semibold text-text-primary">{vac.name}</h4>
                          {statusBadge}
                        </div>
                        <div className="text-caption-1-regular text-text-secondary flex items-center gap-3 flex-wrap">
                          {vac.dateAdministered && (
                            <span>วันที่ฉีด: {vac.dateAdministered}</span>
                          )}
                          {vac.dueDate && (
                            <span className="text-accent-700 dark:text-accent-300 font-medium">
                              กำหนดฉีดถัดไป: {vac.dueDate}
                            </span>
                          )}
                          {vac.lotNumber && (
                            <span className="text-text-tertiary">Lot: {vac.lotNumber}</span>
                          )}
                        </div>
                        {vac.veterinarian && (
                          <p className="text-caption-2-regular text-text-tertiary">
                            สัตวแพทย์ผู้ดูแล: {vac.veterinarian}
                          </p>
                        )}
                        {vac.notes && (
                          <p className="text-caption-1-regular text-text-secondary mt-1 bg-background-primary-default/60 p-2 rounded-xl border border-border-button-default">
                            {vac.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Treatment History */}
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
                    className="p-5 rounded-3xl bg-background-secondary-default/40 border border-border-button-default space-y-2.5"
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
                        การรักษา & หัตถการ:
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
        <div className="px-5 sm:px-7 py-3.5 border-t border-border-button-default bg-background-secondary-default/50 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 text-caption-2-medium text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="รีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้น"
          >
            <RiRestartLine className="size-3.5" />
            <span>รีเซ็ตข้อมูลตัวอย่าง (Demo Reset)</span>
          </button>

          <Button variant="secondary" size="small" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
        </div>
      </div>
    </div>
  );
};
