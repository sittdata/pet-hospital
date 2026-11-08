import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RiSparkling2Fill,
  RiPresentationLine,
  RiTerminalBoxLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiCheckLine,
  RiChatQuoteLine,
  RiBrainLine,
  RiCodeSSlashLine,
  RiFileCopyLine,
  RiShieldCheckLine,
  RiImageLine,
  RiLayoutLine,
  RiUserLine,
  RiLockPasswordLine,
  RiLogoutBoxRLine,
  RiHeartPulseFill,
  RiFirstAidKitLine,
  RiScanLine,
  RiHandHeartLine,
  RiCalendarEventLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { cx } from '@/utils/cx';
import {
  promptShowcaseModules,
  type ShowcaseModule,
} from '../data/promptShowcaseData';

interface PromptPresentationShowcaseProps {
  isOpenInModal?: boolean;
  onCloseModal?: () => void;
}

export const PromptPresentationShowcase: React.FC<PromptPresentationShowcaseProps> = ({
  isOpenInModal = false,
  onCloseModal,
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'slides' | 'cheatsheet'>('map');
  const [isFullscreen, setIsFullscreen] = useState(isOpenInModal);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentModule = promptShowcaseModules[activeModuleIndex];

  // Auto-select first callout when switching module
  useEffect(() => {
    if (currentModule.callouts.length > 0) {
      setActiveCalloutId(currentModule.callouts[0].id);
    }
  }, [activeModuleIndex, currentModule]);

  // Sync fullscreen state with prop if controlled
  useEffect(() => {
    setIsFullscreen(isOpenInModal);
  }, [isOpenInModal]);

  // Handle keyboard navigation for slide deck and escape for fullscreen
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (onCloseModal) {
          onCloseModal();
        } else {
          setIsFullscreen(false);
        }
      } else if (e.key === 'ArrowRight' && (isFullscreen || viewMode === 'slides')) {
        setActiveModuleIndex((prev) => (prev + 1) % promptShowcaseModules.length);
      } else if (e.key === 'ArrowLeft' && (isFullscreen || viewMode === 'slides')) {
        setActiveModuleIndex((prev) => (prev - 1 + promptShowcaseModules.length) % promptShowcaseModules.length);
      }
    },
    [isFullscreen, onCloseModal, viewMode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'RiLayoutLine':
        return <RiLayoutLine className="size-5" />;
      case 'RiImageLine':
        return <RiImageLine className="size-5" />;
      case 'RiShieldCheckLine':
        return <RiShieldCheckLine className="size-5" />;
      case 'RiTerminalBoxLine':
      default:
        return <RiTerminalBoxLine className="size-5" />;
    }
  };

  // Render High-fidelity Graphic UI Mockup for the active module
  const renderMockupContent = (module: ShowcaseModule) => {
    switch (module.screenshotType) {
      case 'navbar':
        return (
          <div className="space-y-4">
            {/* 1. Unauthenticated Navbar State */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-caption-2-bold text-text-tertiary px-1">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-status-amber-text inline-block" />
                  สภาพที่ 1: ก่อนเข้าสู่ระบบ (Logged Out) — แสดงเมนูครบ 6 รายการเต็มความกว้าง
                </span>
                <span className="text-text-placeholder font-mono text-[11px]">User: null</span>
              </div>
              <div
                className={cx(
                  'relative rounded-2xl bg-blue-900 text-white p-3 sm:p-4 border shadow-sm transition-all duration-300',
                  activeCalloutId === 'nav-navy-color' ? 'ring-2 ring-accent-400 border-accent-400' : 'border-blue-950'
                )}
              >
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                  {/* Brand */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="size-8 rounded-xl bg-accent-600 flex items-center justify-center text-white">
                      <RiHeartPulseFill className="size-4" />
                    </div>
                    <div>
                      <span className="text-caption-1-semibold text-white font-bold">VetPaws</span>
                      <span className="ms-1.5 px-1.5 py-0.2 rounded-full bg-status-lime-background text-status-lime-text text-[10px] font-bold">
                        24 ชม.
                      </span>
                    </div>
                  </div>

                  {/* 6 Nav Links with Hotspot #3 */}
                  <div
                    className={cx(
                      'relative hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all duration-200',
                      activeCalloutId === 'nav-dynamic-links'
                        ? 'bg-blue-800/80 border-accent-400 ring-2 ring-accent-400/50'
                        : 'border-transparent'
                    )}
                  >
                    <span className="text-caption-1-medium text-white underline decoration-accent-400 decoration-2">
                      ชนิดสัตว์
                    </span>
                    <span className="text-caption-1-medium text-slate-200">ศูนย์การแพทย์</span>
                    <span className="text-caption-1-medium text-slate-200">สัตวแพทย์</span>
                    <span className="text-caption-1-medium text-slate-200">รีวิว</span>
                    <span className="text-caption-1-medium text-slate-200">คำถามที่พบบ่อย</span>
                    <span className="text-caption-1-medium text-slate-200">ที่ตั้งและเวลา</span>

                    {/* Hotspot Pin 3 */}
                    <button
                      type="button"
                      onClick={() => setActiveCalloutId('nav-dynamic-links')}
                      className="absolute -top-3 -end-2 size-6 rounded-full bg-accent-500 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
                      title="คลิกดู Prompt ข้อ 3"
                    >
                      3
                    </button>
                  </div>

                  {/* Right tools with Hotspot #2 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={cx(
                        'relative px-2.5 py-1 rounded-xl transition-all duration-200',
                        activeCalloutId === 'nav-login-button' ? 'ring-2 ring-accent-400' : ''
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold text-caption-1-medium border border-blue-200/80 shadow-xs">
                        <RiUserLine className="size-3.5" />
                        <span>เข้าสู่ระบบ</span>
                      </span>
                      {/* Hotspot Pin 2 */}
                      <button
                        type="button"
                        onClick={() => setActiveCalloutId('nav-login-button')}
                        className="absolute -top-2 -end-1 size-6 rounded-full bg-accent-500 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
                        title="คลิกดู Prompt ข้อ 2"
                      >
                        2
                      </button>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-status-rose-text text-white text-caption-2-bold">
                      สายด่วน
                    </span>
                  </div>
                </div>

                {/* Hotspot Pin 1 (Navy Background) */}
                <button
                  type="button"
                  onClick={() => setActiveCalloutId('nav-navy-color')}
                  className="absolute -top-2.5 start-4 size-6 rounded-full bg-accent-500 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="คลิกดู Prompt ข้อ 1"
                >
                  1
                </button>
              </div>
            </div>

            {/* 2. Authenticated Navbar State */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-caption-2-bold text-text-tertiary px-1">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-status-lime-text inline-block" />
                  สภาพที่ 2: หลังเข้าสู่ระบบ (Logged In) — ย่อเหลือ 4 เมนู + ปรากฏปุ่มสมุดวัคซีน & กล่องโปรไฟล์
                </span>
                <span className="text-text-placeholder font-mono text-[11px]">User: สมชาย ใจดี</span>
              </div>
              <div
                className={cx(
                  'relative rounded-2xl bg-blue-900 text-white p-3 sm:p-4 border shadow-sm transition-all duration-300',
                  activeCalloutId === 'nav-profile-buttons' ? 'ring-2 ring-accent-400 border-accent-400' : 'border-blue-950'
                )}
              >
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                  {/* Brand */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="size-8 rounded-xl bg-accent-600 flex items-center justify-center text-white">
                      <RiHeartPulseFill className="size-4" />
                    </div>
                    <div>
                      <span className="text-caption-1-semibold text-white font-bold">VetPaws</span>
                      <span className="ms-1.5 px-1.5 py-0.2 rounded-full bg-status-lime-background text-status-lime-text text-[10px] font-bold">
                        24 ชม.
                      </span>
                    </div>
                  </div>

                  {/* 4 Nav Links (Clean space) */}
                  <div className="hidden md:flex items-center gap-3.5 px-2 text-caption-1-medium text-slate-200">
                    <span className="text-white font-medium">ชนิดสัตว์</span>
                    <span>ศูนย์การแพทย์</span>
                    <span>สัตวแพทย์</span>
                    <span>รีวิว</span>
                    <span className="text-slate-400 line-through text-caption-2-regular opacity-60">คำถาม...</span>
                    <span className="text-slate-400 line-through text-caption-2-regular opacity-60">ที่ตั้ง...</span>
                  </div>

                  {/* Logged in Right Profile Area with Hotspot #4 */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Pet Passport CTA */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-950/80 text-accent-300 border border-accent-400/40 text-caption-2-bold">
                      <RiShieldCheckLine className="size-3.5" />
                      <span>สมุดวัคซีน</span>
                    </span>

                    {/* Profile Chip with Hotspot Pin 4 */}
                    <div
                      className={cx(
                        'relative flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-950/80 border transition-all duration-200',
                        activeCalloutId === 'nav-profile-buttons'
                          ? 'border-accent-400 ring-2 ring-accent-400/60'
                          : 'border-blue-800'
                      )}
                    >
                      <div className="size-6 rounded-full bg-accent-600 text-white text-[11px] font-bold flex items-center justify-center">
                        สช
                      </div>
                      <span className="text-caption-2-bold text-white hidden sm:inline">สมชาย</span>

                      {/* Password Key Icon */}
                      <span className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15">
                        <RiLockPasswordLine className="size-3.5" />
                      </span>
                      {/* Logout Icon */}
                      <span className="p-1 rounded-md bg-white/10 hover:bg-rose-500/25 text-slate-200 border border-white/15">
                        <RiLogoutBoxRLine className="size-3.5 text-rose-300" />
                      </span>

                      {/* Hotspot Pin 4 */}
                      <button
                        type="button"
                        onClick={() => setActiveCalloutId('nav-profile-buttons')}
                        className="absolute -top-2.5 -end-2 size-6 rounded-full bg-accent-500 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        title="คลิกดู Prompt ข้อ 4"
                      >
                        4
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'facilities':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-caption-2-bold text-text-tertiary">
                ภาพคลินิกและห้องผ่าตัดเสมือนจริง 6 แผนก (Non-repeating AI Clinical Imagery)
              </span>
              <span className="text-caption-2-bold text-status-lime-text bg-status-lime-background px-2 py-0.5 rounded-full">
                ✓ 6 ภาพความคมชัดสูง ไม่ซ้ำกัน
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                {
                  title: 'ศูนย์ฉุกเฉินและ ICU 24 ชม.',
                  badge: '24/7 ICU & Oxygen',
                  img: '/images/veterinary_icu_ward.jpg',
                  icon: RiFirstAidKitLine,
                  pin: 1,
                },
                {
                  title: 'ห้องผ่าตัดปลอดเชื้อ Positive Pressure',
                  badge: 'Clean Surgery Theater',
                  img: '/images/vet_operating_theater.jpg',
                  icon: RiHeartPulseFill,
                  pin: 2,
                },
                {
                  title: 'ศูนย์วินิจฉัยภาพดิจิทัล (DR & US)',
                  badge: 'Digital Imaging DR',
                  img: '/images/vet_diagnostic_imaging_center.jpg',
                  icon: RiScanLine,
                  pin: 3,
                },
                {
                  title: 'คลินิกแมวเฉพาะทาง Cat Friendly',
                  badge: 'ISFM Gold Standard',
                  img: '/images/cat_friendly_exam_suite.jpg',
                  icon: RiHandHeartLine,
                  pin: 4,
                },
                {
                  title: 'ศูนย์สัตว์พิเศษและสัตว์เลื้อยคลาน',
                  badge: 'Exotic Pet Specialist',
                  img: '/images/exotic_pet_clinic_treatment_room.jpg',
                  icon: RiSparkling2Fill,
                },
                {
                  title: 'ศูนย์ตรวจสุขภาพและฉีดวัคซีน',
                  badge: 'Wellness & Prevention',
                  img: '/images/veterinary_wellness_vaccination_room.jpg',
                  icon: RiShieldCheckLine,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl overflow-hidden border border-border-button-default bg-background-secondary-default aspect-video shadow-xs hover:border-accent-400 transition-all"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 inset-x-2">
                    <span className="block text-[10px] font-semibold text-accent-300 truncate">
                      {item.badge}
                    </span>
                    <span className="block text-caption-2-bold text-white truncate">
                      {item.title}
                    </span>
                  </div>

                  {item.pin && (
                    <button
                      type="button"
                      onClick={() => {
                        const callout = module.callouts[item.pin - 1];
                        if (callout) setActiveCalloutId(callout.id);
                      }}
                      className="absolute top-2 end-2 size-5 rounded-full bg-accent-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      {item.pin}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-background-secondary-default border border-border-button-default text-caption-2-medium text-text-secondary">
              <span className="size-2 rounded-full bg-accent-500 shrink-0" />
              <span>
                <strong>Safety Snapshot:</strong> โค้ดและภาพชุดเก่าถูกสำรองไว้ใน Git Branch:{' '}
                <code className="text-accent-600 bg-accent-50 dark:bg-accent-950/50 px-1.5 py-0.5 rounded font-mono">
                  backup-before-image-enhancement
                </code>
              </span>
            </div>
          </div>
        );

      case 'passport':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-caption-2-bold text-text-tertiary">
                สมุดวัคซีนดิจิทัล (Protected Health Passport & Triage Context)
              </span>
              <span className="text-caption-2-bold text-status-lime-text bg-status-lime-background px-2 py-0.5 rounded-full">
                🔒 ป้องกันข้อมูลก่อนล็อกอิน
              </span>
            </div>

            {/* Simulated Passport Dialog Preview */}
            <div className="rounded-2xl border border-border-button-default bg-background-primary-default p-4 shadow-sm space-y-3">
              {/* Pet Info Card */}
              <div className="flex items-center justify-between pb-3 border-b border-separator-border">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-accent-100 dark:bg-accent-950/50 flex items-center justify-center text-accent-600 font-bold">
                    🐱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-body-medium font-bold text-text-primary">น้องการ์ฟิลด์ (Garfield)</span>
                      <Chip color="yellow" variant="caption">แมวสก็อตติชโฟลด์</Chip>
                    </div>
                    <p className="text-caption-2-regular text-text-secondary">
                      Microchip No: <span className="font-mono">900115002981244</span> • อายุ 2 ปี 4 เดือน • เพศผู้
                    </p>
                  </div>
                </div>

                {/* Hotspot 2: Auth Guard */}
                <div className="relative">
                  <Chip color="lime" variant="bold">
                    ✓ ยืนยันตัวตนแล้ว
                  </Chip>
                  <button
                    type="button"
                    onClick={() => setActiveCalloutId('pass-auth-guard')}
                    className="absolute -top-2.5 -end-2 size-5 rounded-full bg-accent-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse"
                    title="คลิกดู Prompt ล็อกอินป้องกันข้อมูล"
                  >
                    2
                  </button>
                </div>
              </div>

              {/* Vaccine Status Timeline Cards with Hotspot #1 */}
              <div className="relative space-y-2">
                <div className="flex items-center justify-between text-caption-2-bold text-text-secondary">
                  <span>รายการวัคซีนตามโปรแกรมสุขภาพ (3-Stage Status)</span>
                  <button
                    type="button"
                    onClick={() => setActiveCalloutId('pass-reorganize')}
                    className="size-5 rounded-full bg-accent-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md"
                    title="คลิกดู Prompt จัดเรียงวัคซีน"
                  >
                    1
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-status-lime-background/50 border border-status-lime-text/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-caption-2-bold text-status-lime-text">ฉีดแล้ว (Completed)</span>
                      <RiCheckLine className="size-3.5 text-status-lime-text" />
                    </div>
                    <p className="text-caption-1-semibold text-text-primary">วัคซีนรวมไข้หัด-หวัดแมว</p>
                    <p className="text-[11px] text-text-tertiary">ฉีดเมื่อ 15 ก.ค. 2025</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-status-amber-background/50 border border-status-amber-text/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-caption-2-bold text-status-amber-text">ใกล้ถึงกำหนด (Upcoming)</span>
                      <RiCalendarEventLine className="size-3.5 text-status-amber-text" />
                    </div>
                    <p className="text-caption-1-semibold text-text-primary">วัคซีนพิษสุนัขบ้า</p>
                    <p className="text-[11px] text-text-tertiary">ครบกำหนด 15 ส.ค. 2025</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-status-blue-background/50 border border-status-blue-text/30 flex flex-col justify-between">
                    <div>
                      <span className="text-caption-2-bold text-status-blue-text">ส่งต่อ Live Chat</span>
                      <p className="text-caption-1-semibold text-text-primary">ปรึกษาสัตวแพทย์</p>
                    </div>
                    <span className="mt-1 text-[10px] text-accent-600 font-semibold flex items-center gap-1">
                      ส่งชื่อวัคซีนอัตโนมัติ ➔
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bugs':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between px-1">
              <span className="text-caption-2-bold text-text-tertiary font-sans">
                Terminal Audit & Diff (/boost /goal Execution)
              </span>
              <span className="text-caption-2-bold text-status-lime-text bg-status-lime-background px-2 py-0.5 rounded-full font-sans">
                ✓ 0 Errors • 0 Warnings
              </span>
            </div>

            {/* Terminal Window Header */}
            <div className="rounded-2xl border border-blue-950 bg-slate-950 text-slate-100 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-rose-500 inline-block" />
                  <span className="size-3 rounded-full bg-amber-500 inline-block" />
                  <span className="size-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="ms-2 text-slate-400 font-mono text-[11px]">autonomous-boost-fix.sh</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCalloutId('bug-boost-trigger')}
                  className="size-5 rounded-full bg-accent-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md animate-bounce"
                  title="คลิกดู Prompt สั่ง Boost"
                >
                  1
                </button>
              </div>

              {/* Code Diffs */}
              <div className="space-y-2.5 font-mono text-[11.5px] leading-relaxed">
                {/* 1. PII Masking */}
                <div
                  onClick={() => setActiveCalloutId('bug-pii-masking')}
                  className={cx(
                    'p-2 rounded-lg transition-colors cursor-pointer',
                    activeCalloutId === 'bug-pii-masking' ? 'bg-slate-900 ring-1 ring-accent-400' : 'bg-slate-900/60'
                  )}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>1. PII Masking Safeguard</span>
                    <span className="text-accent-400 font-bold">Pin 2</span>
                  </div>
                  <div className="text-rose-400 line-through">- phone: &quot;0819876543&quot;</div>
                  <div className="text-emerald-400 font-semibold">
                    + phone: phone.replace(/(\d&#123;3&#125;)\d&#123;3,4&#125;(\d&#123;4&#125;)/, &quot;$1-***-$2&quot;) // 081-***-6543
                  </div>
                </div>

                {/* 2. Memory Leak Cleanup */}
                <div
                  onClick={() => setActiveCalloutId('bug-memory-leak')}
                  className={cx(
                    'p-2 rounded-lg transition-colors cursor-pointer',
                    activeCalloutId === 'bug-memory-leak' ? 'bg-slate-900 ring-1 ring-accent-400' : 'bg-slate-900/60'
                  )}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>2. LiveChat Timer GC Cleanup</span>
                    <span className="text-accent-400 font-bold">Pin 3</span>
                  </div>
                  <div className="text-rose-400 line-through">- useEffect(() =&gt; &#123; const t = setInterval(...); &#125;, [])</div>
                  <div className="text-emerald-400 font-semibold">
                    + return () =&gt; &#123; if (typingTimerRef.current) clearInterval(typingTimerRef.current); &#125;;
                  </div>
                </div>

                {/* 3. TypeScript Strict Build */}
                <div
                  onClick={() => setActiveCalloutId('bug-typescript-strict')}
                  className={cx(
                    'p-2 rounded-lg transition-colors cursor-pointer',
                    activeCalloutId === 'bug-typescript-strict' ? 'bg-slate-900 ring-1 ring-accent-400' : 'bg-slate-900/60'
                  )}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>3. TypeScript Strict Build Check</span>
                    <span className="text-accent-400 font-bold">Pin 4</span>
                  </div>
                  <div className="text-emerald-300">
                    $ tsc -b &amp;&amp; vite build ➔ ✓ 1797 modules transformed in 1.48s (0 errors)
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="prompt-showcase"
      ref={containerRef}
      className={cx(
        'transition-all duration-300',
        isFullscreen
          ? 'fixed inset-0 z-50 overflow-y-auto bg-background-full p-3 sm:p-6 lg:p-8 flex flex-col justify-between'
          : 'py-16 sm:py-20 bg-background-secondary-default/40 border-b border-border-button-default'
      )}
    >
      <div className={cx('mx-auto w-full', isFullscreen ? 'max-w-7xl h-full flex flex-col' : 'max-w-7xl px-4 sm:px-6 lg:px-8')}>
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300 text-caption-2-bold border border-accent-200/50">
                <RiSparkling2Fill className="size-3.5 text-accent-500" />
                <span>AI Agentic Development Showcase</span>
              </span>
              <span className="text-caption-2-regular text-text-tertiary">
                Vite + React 19 + BoardUI Tokens
              </span>
            </div>
            <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
              แผนผังกระบวนการสั่งงานด้วย Prompt (Prompt Journey Graphic)
            </h2>
            <p className="text-body-regular text-text-secondary mt-1 max-w-2xl">
              การถอดรหัสคำสั่งจริงที่ใช้ในการ Pair-Programming กับ AI พร้อมเส้นชี้โยง (Callout) ไปยังชิ้นส่วน UI และการแก้บั๊กอัตโนมัติ
            </p>
          </div>

          {/* View Mode Controls & Fullscreen Trigger */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {/* View Mode Segmented Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-background-primary-default border border-border-button-default shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={cx(
                  'px-3 py-1.5 rounded-lg text-caption-1-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  viewMode === 'map'
                    ? 'bg-accent-600 text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <RiLayoutLine className="size-3.5" />
                <span>ผังโยงกราฟิก</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('slides')}
                className={cx(
                  'px-3 py-1.5 rounded-lg text-caption-1-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  viewMode === 'slides'
                    ? 'bg-accent-600 text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <RiPresentationLine className="size-3.5" />
                <span>สไลด์นำเสนอ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cheatsheet')}
                className={cx(
                  'px-3 py-1.5 rounded-lg text-caption-1-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  viewMode === 'cheatsheet'
                    ? 'bg-accent-600 text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <RiCodeSSlashLine className="size-3.5" />
                <span>ตารางสรุป Prompt</span>
              </button>
            </div>

            {/* Fullscreen Modal Toggle Button */}
            <Button
              variant="secondary"
              size="small"
              leadingIcon={isFullscreen ? RiFullscreenExitLine : RiFullscreenLine}
              onClick={() => {
                if (isFullscreen && onCloseModal) {
                  onCloseModal();
                } else {
                  setIsFullscreen(!isFullscreen);
                }
              }}
              title={isFullscreen ? 'ออกจากโหมดเต็มจอ (Esc)' : 'ขยายเป็นโหมดพรีเซนต์เต็มจอ'}
              className="hidden sm:inline-flex"
            >
              {isFullscreen ? 'ย่อหน้าต่าง' : 'โหมดพรีเซนต์'}
            </Button>
          </div>
        </div>

        {/* Module Selection Pills (Horizontal scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {promptShowcaseModules.map((module, idx) => (
            <button
              key={module.id}
              type="button"
              onClick={() => setActiveModuleIndex(idx)}
              className={cx(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-caption-1-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border',
                activeModuleIndex === idx
                  ? 'bg-accent-600 text-white border-accent-600 shadow-sm shadow-accent-600/20'
                  : 'bg-background-primary-default text-text-secondary border-border-button-default hover:text-text-primary hover:border-border-button-hover'
              )}
            >
              {getModuleIcon(module.iconName)}
              <span>{module.tabLabel}</span>
              <span
                className={cx(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                  activeModuleIndex === idx
                    ? 'bg-white/20 text-white'
                    : 'bg-background-secondary-default text-text-tertiary'
                )}
              >
                {module.callouts.length} Prompts
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Area based on Selected View Mode */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Stylized Mockup Screen with Interactive Hotspots (Col 7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-md overflow-hidden">
                {/* Browser Device Header Window Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-background-secondary-default border-b border-border-button-default">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-status-rose-text inline-block opacity-80" />
                    <span className="size-3 rounded-full bg-status-amber-text inline-block opacity-80" />
                    <span className="size-3 rounded-full bg-status-lime-text inline-block opacity-80" />
                    <span className="ms-2 font-mono text-caption-2-medium text-text-tertiary">
                      https://pet-hospital-eta.vercel.app
                    </span>
                  </div>
                  <Chip color="blue" variant="caption">
                    {currentModule.badge}
                  </Chip>
                </div>

                {/* Viewport Content */}
                <div className="p-4 sm:p-5 bg-background-tertiary-default/30">
                  {renderMockupContent(currentModule)}
                </div>

                {/* Hotspot Guide Footer */}
                <div className="px-4 py-2.5 bg-background-secondary-default/50 border-t border-border-button-default flex items-center justify-between text-caption-2-medium text-text-secondary">
                  <span>💡 คลิกที่หมายเลขพินบนรูปภาพ เพื่อดู Prompt และการทำงานของ AI</span>
                  <span className="text-text-tertiary">Interactive Pins: 1 – {currentModule.callouts.length}</span>
                </div>
              </div>

              {/* Module Description & Summary Box */}
              <div className="p-4 rounded-2xl bg-background-primary-default border border-border-button-default text-body-medium text-text-secondary leading-relaxed">
                <strong className="text-text-primary block text-title-3-semibold mb-1">
                  {currentModule.title}
                </strong>
                {currentModule.summary}
              </div>
            </div>

            {/* Right Column: Prompt & AI Breakdown Cards (Col 5) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-caption-1-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <RiChatQuoteLine className="size-4 text-accent-500" />
                  <span>ชุดคำสั่ง Prompt จริง ({currentModule.callouts.length} จุดชี้โยง)</span>
                </span>
                <span className="text-caption-2-regular text-text-tertiary">
                  คลิกเพื่อโฟกัสจุดที่เกี่ยวข้อง
                </span>
              </div>

              {currentModule.callouts.map((callout) => {
                const isActive = activeCalloutId === callout.id;
                return (
                  <div
                    key={callout.id}
                    onClick={() => setActiveCalloutId(callout.id)}
                    className={cx(
                      'p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-start relative',
                      isActive
                        ? 'bg-background-primary-default border-accent-500 shadow-md ring-2 ring-accent-500/20'
                        : 'bg-background-primary-default/70 border-border-button-default hover:border-accent-300 hover:bg-background-primary-default'
                    )}
                  >
                    {/* Header with Pin Number and Title */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cx(
                            'size-6 rounded-full font-bold text-caption-2-bold flex items-center justify-center shrink-0 transition-colors',
                            isActive
                              ? 'bg-accent-600 text-white'
                              : 'bg-background-secondary-default text-text-secondary border border-border-button-default'
                          )}
                        >
                          {callout.pinNumber}
                        </span>
                        <h4 className="text-caption-1-bold text-text-primary">
                          {callout.title}
                        </h4>
                      </div>

                      {/* Copy Prompt Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(callout.userPrompt, callout.id);
                        }}
                        className="text-text-tertiary hover:text-accent-600 p-1 rounded-md hover:bg-background-secondary-default transition-colors"
                        title="คัดลอกคำสั่ง Prompt"
                      >
                        {copiedPromptId === callout.id ? (
                          <RiCheckLine className="size-4 text-status-lime-text" />
                        ) : (
                          <RiFileCopyLine className="size-4" />
                        )}
                      </button>
                    </div>

                    {/* Speech Bubble: User Prompt */}
                    <div className="p-3 rounded-xl bg-accent-50/60 dark:bg-accent-950/40 border border-accent-200/50 mb-2.5">
                      <div className="text-[11px] font-semibold text-accent-700 dark:text-accent-400 mb-1 flex items-center gap-1">
                        <span>💬 Prompt ที่ผู้ใช้พิมพ์สั่ง:</span>
                      </div>
                      <blockquote className="text-body-medium font-medium text-text-primary italic">
                        &ldquo;{callout.userPrompt}&rdquo;
                      </blockquote>
                    </div>

                    {/* AI Intent & Action */}
                    <div className="space-y-1.5 text-caption-2-regular text-text-secondary">
                      <div className="flex items-start gap-1.5">
                        <RiBrainLine className="size-3.5 text-accent-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-text-primary">สิ่งที่ AI ทำ:</strong> {callout.aiAction}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 font-mono text-[11px] bg-background-secondary-default/80 p-2 rounded-lg border border-border-button-default">
                        <RiCodeSSlashLine className="size-3.5 text-text-tertiary shrink-0 mt-0.5" />
                        <span className="text-accent-600 dark:text-accent-400 break-all">
                          {callout.codeOutcome}
                        </span>
                      </div>
                    </div>

                    {/* Before vs After Pills */}
                    {callout.beforeState && callout.afterState && (
                      <div className="mt-2.5 pt-2 border-t border-separator-border grid grid-cols-2 gap-2 text-[10.5px]">
                        <div className="text-text-tertiary">
                          <span className="text-rose-500 font-semibold block">ก่อนหน้า:</span>
                          <span className="line-clamp-2">{callout.beforeState}</span>
                        </div>
                        <div className="text-text-primary">
                          <span className="text-status-lime-text font-semibold block">ผลลัพธ์ใหม่:</span>
                          <span className="line-clamp-2">{callout.afterState}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: Presentation Slide Deck */}
        {viewMode === 'slides' && (
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
            {/* Slide Header */}
            <div className="flex items-center justify-between border-b border-border-button-default pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-accent-600 text-white font-bold text-caption-2-bold">
                  สไลด์ที่ {activeModuleIndex + 1} จาก {promptShowcaseModules.length}
                </span>
                <h3 className="text-title-2-semibold text-text-primary">
                  {currentModule.title}
                </h3>
              </div>

              {/* Prev / Next Slide Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  leadingIcon={RiArrowLeftLine}
                  disabled={activeModuleIndex === 0}
                  onClick={() => setActiveModuleIndex((prev) => Math.max(0, prev - 1))}
                >
                  ก่อนหน้า
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  leadingIcon={RiArrowRightLine}
                  disabled={activeModuleIndex === promptShowcaseModules.length - 1}
                  onClick={() => setActiveModuleIndex((prev) => Math.min(promptShowcaseModules.length - 1, prev + 1))}
                >
                  ถัดไป
                </Button>
              </div>
            </div>

            {/* Slide Body: Mockup visual + Speaker notes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-border-button-default p-4 bg-background-secondary-default/50 shadow-inner">
                  {renderMockupContent(currentModule)}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-accent-50/50 dark:bg-accent-950/30 border border-accent-200/50">
                  <h4 className="text-caption-1-bold text-accent-700 dark:text-accent-300 flex items-center gap-2 mb-2">
                    <RiPresentationLine className="size-4" />
                    <span>Key Speaker Notes (แนวทางพูดนำเสนออาจารย์)</span>
                  </h4>
                  <ul className="space-y-2 text-body-medium text-text-secondary list-disc ps-5 leading-relaxed">
                    {currentModule.speakerNotes.map((note, nIdx) => (
                      <li key={nIdx}>{note}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-background-secondary-default border border-border-button-default space-y-2">
                  <span className="text-caption-2-bold text-text-tertiary uppercase">สรุปผลลัพธ์เชิงเทคนิค</span>
                  <p className="text-caption-1-regular text-text-primary leading-relaxed">
                    {currentModule.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: Prompt Cheat Sheet Table */}
        {viewMode === 'cheatsheet' && (
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-body-regular">
                <thead>
                  <tr className="bg-background-secondary-default border-b border-border-button-default text-caption-1-bold text-text-secondary">
                    <th className="py-3 px-4 text-start">หมวดหมู่</th>
                    <th className="py-3 px-4 text-start">Prompt ที่ผู้ใช้สั่งจริง (User Prompt)</th>
                    <th className="py-3 px-4 text-start">ความต้องการ (Intent)</th>
                    <th className="py-3 px-4 text-start">สิ่งที่ AI ดำเนินการ (Action)</th>
                    <th className="py-3 px-4 text-start">ผลลัพธ์ในซอร์สโค้ด (Code Output)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-button-default text-caption-1-medium">
                  {promptShowcaseModules.flatMap((mod) =>
                    mod.callouts.map((c) => (
                      <tr key={c.id} className="hover:bg-background-secondary-default/50 transition-colors">
                        <td className="py-3 px-4 shrink-0 whitespace-nowrap">
                          <Chip color="blue" variant="caption">{c.category}</Chip>
                        </td>
                        <td className="py-3 px-4 font-semibold text-text-primary max-w-xs">
                          &ldquo;{c.userPrompt}&rdquo;
                        </td>
                        <td className="py-3 px-4 text-text-secondary max-w-xs">
                          {c.promptIntent}
                        </td>
                        <td className="py-3 px-4 text-text-secondary max-w-sm">
                          {c.aiAction}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-accent-600 dark:text-accent-400">
                          {c.codeOutcome}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
