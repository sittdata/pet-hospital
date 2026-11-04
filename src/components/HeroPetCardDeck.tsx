import React, { useState, useEffect, useRef } from 'react';
import { cx } from '@/utils/cx';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiMicLine,
  RiArrowUpLine,
  RiGitBranchLine,
  RiFolderLine,
  RiInfinityLine,
} from '@remixicon/react';

export interface CardStackItem {
  id: string;
  image: string;
  alt: string;
  prompt: string;
  petType: 'dog' | 'cat';
  serviceTag: string;
}

const defaultCards: CardStackItem[] = [
  {
    id: 'golden',
    image: '/images/vets/vet_golden_hd.jpg',
    alt: 'สัตวแพทย์ผู้เชี่ยวชาญกอดน้องหมาโกลเด้นยิ้มสดใส',
    prompt: 'ตรวจสุขภาพและฉีดวัคซีนสุนัข นัดหมายอาจารย์สัตวแพทย์เฉพาะทาง',
    petType: 'dog',
    serviceTag: 'Canine Care',
  },
  {
    id: 'cat',
    image: '/images/vets/vet_cat_hd.jpg',
    alt: 'อาจารย์สัตวแพทย์ตรวจดูแลน้องแมวอย่างอ่อนโยน',
    prompt: 'น้องแมวซึม ไม่ทานน้ำ ตรวจแล็บด่วน คลินิกแมวปลอดความเครียด 24 ชม.',
    petType: 'cat',
    serviceTag: 'ISFM Feline',
  },
  {
    id: 'corgi',
    image: '/images/vets/vet_corgi_hd.jpg',
    alt: 'สัตวแพทย์กอดน้องคอร์กี้อย่างอบอุ่น',
    prompt: 'ผ่าตัดส่องกล้องแผลเล็ก และตรวจหัวใจสัตว์เลี้ยงครบวงจร 24 ชม.',
    petType: 'dog',
    serviceTag: 'ER & Surgery',
  },
];

interface HeroPetCardDeckProps {
  onOpenBooking?: (prefillPetType?: string) => void;
}

export const HeroPetCardDeck: React.FC<HeroPetCardDeckProps> = ({ onOpenBooking }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentCard = defaultCards[activeIndex];
  const displayedText = currentCard.prompt.slice(0, charCount);

  // Auto-Cycling & Typewriter loop synchronized with 3D cards
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fullText = defaultCards[activeIndex].prompt;

    const interval = setInterval(() => {
      setCharCount((prev) => {
        if (prev < fullText.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          pauseTimerRef.current = setTimeout(() => {
            if (!isHoveredRef.current) {
              setActiveIndex((i) => (i + 1) % defaultCards.length);
              setCharCount(0);
            } else {
              checkIntervalRef.current = setInterval(() => {
                if (!isHoveredRef.current) {
                  if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
                  setActiveIndex((i) => (i + 1) % defaultCards.length);
                  setCharCount(0);
                }
              }, 600);
            }
          }, 3200);
          return prev;
        }
      });
    }, 38);

    return () => {
      clearInterval(interval);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [activeIndex]);

  const handleCardClick = (targetIndex: number) => {
    setActiveIndex(targetIndex);
    setCharCount(0);
  };

  const handlePromptClick = () => {
    onOpenBooking?.(currentCard.petType);
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center pt-2 pb-12 sm:pb-14 select-none overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Rotating Stack Stage */}
      <div
        className="relative w-full max-w-[540px] h-[310px] xs:h-[340px] sm:h-[410px] flex items-center justify-center cursor-pointer group"
        style={{ perspective: '1200px' }}
      >
        {defaultCards.map((card, idx) => {
          const relPos = (idx - activeIndex + defaultCards.length) % defaultCards.length;
          const isCenter = relPos === 0;
          const isRight = relPos === 1;
          const isLeft = relPos === 2;

          let translateX = 0;
          let translateY = 0;
          let rotate = 0;
          let scale = 1;
          let zIndex = isCenter ? 20 : isLeft ? 10 : 8;
          let opacity = isCenter ? 1 : 0.85;

          if (isLeft) {
            translateX = isMobile ? (isHovered ? -46 : -12) : (isHovered ? -110 : -20);
            translateY = isMobile ? 6 : 10;
            rotate = isMobile ? -6 : -8;
            scale = 0.94;
          } else if (isRight) {
            translateX = isMobile ? (isHovered ? 46 : 12) : (isHovered ? 110 : 20);
            translateY = isMobile ? 5 : 8;
            rotate = isMobile ? 5 : 7;
            scale = 0.94;
          } else {
            translateX = 0;
            translateY = isHovered ? (isMobile ? -6 : -12) : 0;
            rotate = 0;
            scale = isHovered ? 1.02 : 1;
          }

          return (
            <button
              key={card.id}
              type="button"
              aria-label={card.alt}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(idx);
              }}
              className={cx(
                'absolute inset-0 m-auto w-[230px] xs:w-[260px] sm:w-[320px] lg:w-[340px] h-[280px] xs:h-[310px] sm:h-[370px] lg:h-[390px] rounded-3xl overflow-hidden border border-white/20 focus:outline-hidden cursor-pointer transition-all duration-500 ease-out',
                isCenter
                  ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-2 ring-accent-500/20'
                  : 'shadow-xl hover:opacity-100'
              )}
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                zIndex,
                opacity,
                willChange: 'transform, opacity',
              }}
            >
              {/* Full-bleed Photo */}
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Gradient vignette to blend smoothly with Composer below */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
            </button>
          );
        })}

        {/* BoardUI Official AI Chat Composer (Reverse-Engineered 1:1 with BoardUI Semantic Tokens) */}
        <div className="absolute -bottom-7 sm:-bottom-9 left-1/2 -translate-x-1/2 z-40 w-[94%] xs:w-[90%] sm:w-[500px] max-w-[96%]">
          {/* Main Pill Wrapper */}
          <div className="relative">
            {/* Background shadow & soft blur */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-black/15 dark:bg-black/40 blur-xl pointer-events-none"
            />

            {/* Pill Container */}
            <div className="flex h-[52px] w-full items-center gap-2 rounded-full bg-background-primary-default border border-border-button-default py-1.5 pe-1.5 ps-1.5 shadow-lg relative transition-colors duration-200">
              {/* Left Action / Attachment '+' Button */}
              <button
                type="button"
                onClick={handlePromptClick}
                aria-label="เลือกบริการเพิ่มเติม"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full p-2 outline-none transition-colors duration-150 ease hover:bg-background-secondary-default text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                title="เลือกบริการตรวจและรักษา"
              >
                <RiAddLine className="size-5" />
              </button>

              {/* Typewriter Prompt Text Area */}
              <div
                onClick={handlePromptClick}
                className="h-5 min-w-0 flex-1 flex items-center cursor-pointer select-none overflow-hidden px-1"
                title="คลิกเพื่อส่งนัดหมายตรวจ"
              >
                <span className="text-body-regular text-text-primary truncate">
                  {displayedText}
                </span>
                <span className="inline-block w-0.5 h-4 bg-accent-500 ms-0.5 shrink-0 animate-pulse" />
              </div>

              {/* Model / Category Selector Tag */}
              <button
                type="button"
                onClick={handlePromptClick}
                className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-xl bg-background-secondary-default py-1 pe-1 ps-2 outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover border border-border-button-default/50"
              >
                <span className="px-0.5 text-caption-1-semibold whitespace-nowrap text-text-secondary">
                  {currentCard.serviceTag}
                </span>
                <RiArrowDownSLine className="size-4 shrink-0 text-foreground-icon-secondary" />
              </button>

              {/* Right Controls: Voice Call + Send Button */}
              <div className="flex shrink-0 items-center gap-1.5 ps-1">
                {/* Voice hotline button */}
                <button
                  type="button"
                  aria-label="โทรด่วน 24 ชั่วโมง"
                  onClick={() => window.open('tel:028889999')}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-button-default bg-background-primary-default p-2 shadow-2xs transition-colors duration-150 ease hover:bg-background-secondary-default text-foreground-icon-secondary hover:text-foreground-icon-primary"
                  title="โทรสายด่วน 02-888-9999"
                >
                  <RiMicLine className="size-4.5" />
                </button>

                {/* Send / Book button (Accent Blue with White Arrow Up) */}
                <button
                  type="button"
                  aria-label="นัดหมายตรวจ"
                  onClick={handlePromptClick}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-accent-500 hover:bg-accent-600 text-white p-2 transition-all duration-200 ease shadow-xs hover:scale-105 active:scale-95"
                  title="ส่งคำขอนัดหมาย"
                >
                  <RiArrowUpLine className="size-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Composer Official Status Bar (Directly below the pill) */}
          <div className="flex h-[24px] w-full items-center justify-between px-3 mt-1.5 text-caption-2-medium text-text-tertiary">
            {/* Left Status: Hospital Branch & ER unit */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-text-secondary">
                <RiGitBranchLine className="size-3.5 -scale-y-100 text-accent-500" />
                <span>ทองหล่อ (Main)</span>
              </div>
              <span className="text-text-placeholder">•</span>
              <div className="flex items-center gap-1 text-text-secondary">
                <RiFolderLine className="size-3.5 text-foreground-icon-tertiary" />
                <span>24/7 ER & Surgery</span>
              </div>
            </div>

            {/* Right Status: Triage & Live Readiness Meter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-text-secondary">
                <RiInfinityLine className="size-3.5 text-accent-500" />
                <span>Vet Triage</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-status-lime-background/80 px-2 py-0.5 text-status-lime-text font-semibold">
                <span className="size-1.5 rounded-full bg-status-lime-text animate-pulse" />
                <span>Ready 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPetCardDeck;
