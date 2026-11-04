import React, { useState } from 'react';
import { cx } from '@/utils/cx';
import {
  RiHeartPulseFill,
  RiAwardFill,
  RiStethoscopeFill,
  RiShieldCheckFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { useScrollFade, ScrollFade } from '@/components/foundations/scroll-fade/scroll-fade';

export interface AlertItem {
  id: string;
  iconBg: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  date: string;
  description: string;
}

const WEEKS_DATA: Record<string, { label: string; count: number; items: AlertItem[] }> = {
  current: {
    label: '29 Jun - 5 Jul',
    count: 12,
    items: [
      {
        id: '1',
        iconBg: 'bg-[#E11D48]',
        Icon: RiHeartPulseFill,
        title: 'Emergency Trauma Care: กู้ชีพเคสวิกฤตสำเร็จ',
        date: 'June, 12',
        description:
          'ทีมสัตวแพทย์ฉุกเฉิน 24 ชม. ทำการผ่าตัดคลายกระเพาะบิด (GDV) และตรึงกระเพาะฉุกเฉินได้สำเร็จ น้องฟื้นตัวและสัญญาณชีพคงที่',
      },
      {
        id: '2',
        iconBg: 'bg-[#F59E0B]',
        Icon: RiAwardFill,
        title: 'ISFM Gold Accreditation: รับรองมาตรฐานคลินิกแมวสากล',
        date: 'June, 9',
        description:
          'ผ่านการต่ออายุการรับรองมาตรฐานสากล คลินิกแมวปลอดความเครียด (ISFM Gold Standard) ประจำปี 2026 ต่อเนื่องเป็นปีที่ 3',
      },
      {
        id: '3',
        iconBg: 'bg-[#0284C7]',
        Icon: RiStethoscopeFill,
        title: 'New CT-Scan 128-Slice: เปิดบริการศูนย์ภาพวินิจฉัยขั้นสูง',
        date: 'June, 5',
        description:
          'ติดตั้งเครื่อง CT Scan ความละเอียดสูงตัวใหม่ ตรวจสแกนกระดูกและสมองได้รวดเร็ว ลดระยะเวลาดมยาสลบสัตว์เลี้ยงลงกว่า 70%',
      },
      {
        id: '4',
        iconBg: 'bg-[#10B981]',
        Icon: RiShieldCheckFill,
        title: 'Community Vaccine Drive: ตรวจและฉีดวัคซีนฟรี 500 เคส',
        date: 'June, 1',
        description:
          'จัดโครงการตรวจสุขภาพเบื้องต้นและฉีดวัคซีนป้องกันพิษสุนัขบ้าแก่สัตว์เลี้ยงในชุมชนรอบสุขุมวิท-ทองหล่อ',
      },
    ],
  },
  previous: {
    label: '22 Jun - 28 Jun',
    count: 9,
    items: [
      {
        id: '5',
        iconBg: 'bg-[#0284C7]',
        Icon: RiStethoscopeFill,
        title: 'Endoscopic Surgery: ผ่าตัดส่องกล้องคีบสิ่งแปลกปลอม',
        date: 'June, 26',
        description:
          'ส่องกล้องคีบสิ่งแปลกปลอมในกระเพาะอาหารโดยไม่ต้องเปิดแผลหน้าท้อง สัตว์เลี้ยงฟื้นตัวได้ทันทีและกลับบ้านในวันเดียว',
      },
      {
        id: '6',
        iconBg: 'bg-[#E11D48]',
        Icon: RiHeartPulseFill,
        title: 'Blood Bank Donor Drive: รับบริจาคโลหิตสำรองฉุกเฉิน',
        date: 'June, 23',
        description:
          'ร่วมกับเครือข่ายสุนัขใจบุญ สำรองเกล็ดเลือดและพลาสมาสดเพื่อพร้อมรองรับเคสอุบัติเหตุฉุกเฉินตลอด 24 ชั่วโมง',
      },
    ],
  },
};

export const HospitalAlertsCard: React.FC<{ className?: string }> = ({ className }) => {
  const [currentWeekKey, setCurrentWeekKey] = useState<'current' | 'previous'>('current');
  const scrollFade = useScrollFade(24);

  const activeData = WEEKS_DATA[currentWeekKey];

  const handleToggleWeek = () => {
    setCurrentWeekKey((prev) => (prev === 'current' ? 'previous' : 'current'));
    scrollFade.reset();
  };

  return (
    <div
      className={cx(
        'rounded-3xl border border-border-button-default bg-background-secondary-default/50 dark:bg-background-secondary-default/30 p-5 shadow-xs transition-colors',
        className
      )}
    >
      {/* Top Header Row matching Medical Profile Template */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="block text-caption-1-medium text-text-tertiary">Important alerts</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-title-1-bold text-text-primary text-[28px] leading-none font-bold">
              {activeData.count}
            </span>
            <span className="text-caption-1-medium text-text-tertiary">this week</span>
          </div>
        </div>

        {/* Date Range Navigation Pill */}
        <div className="inline-flex items-center rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-primary shadow-2xs">
          <button
            type="button"
            onClick={handleToggleWeek}
            aria-label="Previous week"
            className="p-0.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <RiArrowLeftSLine className="size-4" />
          </button>
          <span className="px-1.5 text-caption-1-semibold select-none">{activeData.label}</span>
          <button
            type="button"
            onClick={handleToggleWeek}
            aria-label="Next week"
            className="p-0.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <RiArrowRightSLine className="size-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Alert List with BoardUI Soft Scroll Edge */}
      <div className="relative">
        <div
          onScroll={scrollFade.onScroll}
          className="max-h-[295px] overflow-y-auto space-y-2.5 pe-1 overscroll-contain"
          style={{ scrollbarWidth: 'thin' }}
        >
          {activeData.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border-button-default/70 bg-background-primary-default p-3.5 shadow-2xs transition-all duration-150 hover:border-border-button-hover hover:shadow-xs"
            >
              {/* Item Top: Circular Colored Icon + Date Pill */}
              <div className="flex items-center justify-between">
                <div
                  className={cx(
                    'size-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs',
                    item.iconBg
                  )}
                >
                  <item.Icon className="size-5" />
                </div>
                <span className="rounded-lg bg-background-secondary-default px-2.5 py-0.5 text-caption-2-medium text-text-tertiary font-medium border border-border-button-default/50 font-mono">
                  {item.date}
                </span>
              </div>

              {/* Item Title */}
              <h4 className="text-body-medium font-semibold text-text-primary mt-2.5 leading-snug">
                {item.title}
              </h4>

              {/* Item Description */}
              <p className="text-caption-1-regular text-text-secondary mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* BoardUI Soft Top Scroll Fade */}
        <ScrollFade
          progress={scrollFade.progress}
          surfaceClassName="from-background-secondary-default/90"
        />
      </div>
    </div>
  );
};

export default HospitalAlertsCard;
