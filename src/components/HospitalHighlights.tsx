import React, { useState } from 'react';
import {
  RiAwardFill,
  RiPercentLine,
  RiHeartFill,
  RiHospitalLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSparklingFill,
} from '@remixicon/react';
import { cx } from '@/utils/cx';

export interface HospitalHighlightItem {
  id: string;
  category: 'award' | 'promo' | 'community' | 'center';
  title: string;
  description: string;
  badge: string;
  date: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const highlightItems: HospitalHighlightItem[] = [
  {
    id: 'isfm-gold',
    category: 'award',
    title: 'รับรองมาตรฐาน ISFM Cat Friendly Clinic ระดับ Gold',
    description: 'ผ่านการรับรองโรงพยาบาลแมวมาตรฐานสากล แยกโซนตรวจและหอพักฟื้นเฉพาะเพื่อลดความเครียด 100%',
    badge: 'รางวัลสากล',
    date: 'ม.ค. 2026',
    icon: RiAwardFill,
    iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'senior-promo',
    category: 'promo',
    title: 'แคมเปญตรวจสุขภาพสูงวัย Senior Pet Care 2026',
    description: 'แพ็กเกจตรวจเลือด ตรวจหัวใจ และอัลตราซาวด์ช่องท้องสัตว์เลี้ยง 7 ปีขึ้นไป รับสิทธิ์ส่วนลดพิเศษ 20%',
    badge: 'โปรโมชั่น',
    date: 'ตลอดเดือนนี้',
    icon: RiPercentLine,
    iconBg: 'bg-accent-500/15 dark:bg-accent-500/20',
    iconColor: 'text-accent-600 dark:text-accent-400',
  },
  {
    id: 'tplo-center',
    category: 'center',
    title: 'เปิดศูนย์ศัลยกรรมกระดูก TPLO & ส่องกล้องไร้แผล',
    description: 'ยกระดับห้องผ่าตัดปลอดเชื้อระบบ Positive Pressure พร้อมระบบติดตามสัญญาณชีพอัตโนมัติตลอด 24 ชม.',
    badge: 'เปิดบริการใหม่',
    date: 'ก.พ. 2026',
    icon: RiHospitalLine,
    iconBg: 'bg-status-lime-background',
    iconColor: 'text-status-lime-text',
  },
  {
    id: 'rabies-charity',
    category: 'community',
    title: 'โครงการร่วมใจฉีดวัคซีนพิษสุนัขบ้าและฝังไมโครชิปฟรี',
    description: 'ทีมสัตวแพทย์ลงพื้นที่ตรวจสุขภาพและฉีดวัคซีนให้สัตว์เลี้ยงในชุมชนโดยรอบกว่า 500 ตัว',
    badge: 'เพื่อสังคม',
    date: 'ธ.ค. 2025',
    icon: RiHeartFill,
    iconBg: 'bg-status-rose-background',
    iconColor: 'text-status-rose-text',
  },
];

export const HospitalHighlights: React.FC = () => {
  const [filterIndex, setFilterIndex] = useState(0);
  const filterPeriods = ['ปี 2026 (ล่าสุด)', 'ไตรมาส 1/2026', 'ปี 2025 ทั้งหมด'];

  const handlePrev = () => {
    setFilterIndex((prev) => (prev > 0 ? prev - 1 : filterPeriods.length - 1));
  };

  const handleNext = () => {
    setFilterIndex((prev) => (prev < filterPeriods.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full rounded-3xl border border-border-button-default bg-background-primary-default p-4 sm:p-5 shadow-xs transition-colors">
      {/* Header matching BoardUI Medical Profile (Important alerts & Date Selector) */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div>
          <div className="flex items-center gap-1.5">
            <RiSparklingFill className="size-4 text-accent-500 shrink-0" />
            <span className="text-body-medium font-semibold text-text-primary">
              กิจกรรมและรางวัลเกียรติยศ
            </span>
          </div>
          <p className="text-caption-2-medium text-text-tertiary mt-0.5">
            <strong className="text-text-primary font-bold">{highlightItems.length} ไฮไลต์</strong> กิจกรรมและโปรโมชั่นพิเศษ
          </p>
        </div>

        {/* Date / Filter Switcher Capsule (1:1 with BoardUI Medical Profile) */}
        <div className="flex items-center gap-1 rounded-full border border-border-button-default bg-background-secondary-default py-1 px-1.5 shadow-2xs">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="กิจกรรมก่อนหน้า"
            className="size-6 rounded-full flex items-center justify-center text-foreground-icon-secondary hover:text-foreground-icon-primary hover:bg-background-primary-default transition-colors cursor-pointer"
          >
            <RiArrowLeftSLine className="size-4" />
          </button>
          <span className="text-caption-2-bold text-text-secondary px-1.5 whitespace-nowrap select-none">
            {filterPeriods[filterIndex]}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="กิจกรรมถัดไป"
            className="size-6 rounded-full flex items-center justify-center text-foreground-icon-secondary hover:text-foreground-icon-primary hover:bg-background-primary-default transition-colors cursor-pointer"
          >
            <RiArrowRightSLine className="size-4" />
          </button>
        </div>
      </div>

      {/* Highlights Feed List (BoardUI Medical Profile Cards) */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pe-1 [scrollbar-width:thin]">
        {highlightItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="group rounded-2xl border border-border-button-default/60 bg-background-secondary-default/50 hover:bg-background-secondary-default/90 p-3 sm:p-3.5 transition-all duration-200 flex items-start gap-3 hover:shadow-2xs"
            >
              {/* Category Icon */}
              <div
                className={cx(
                  'size-9 sm:size-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform',
                  item.iconBg,
                  item.iconColor
                )}
              >
                <Icon className="size-4.5 sm:size-5" />
              </div>

              {/* Content Body */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-caption-1-semibold sm:text-body-2-bold text-text-primary group-hover:text-accent-500 transition-colors leading-tight line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="shrink-0 rounded-md bg-background-primary-default px-1.5 py-0.5 text-[10px] font-semibold text-text-tertiary border border-border-button-default/50">
                    {item.date}
                  </span>
                </div>

                <p className="text-caption-2-regular sm:text-caption-1-regular text-text-secondary leading-relaxed mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Badge Tag */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-600 dark:text-accent-400">
                    <span>• {item.badge}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HospitalHighlights;
