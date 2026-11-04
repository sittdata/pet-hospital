import React, { useState, useEffect, useRef } from 'react';
import { cx } from '@/utils/cx';
import { RiArrowRightLine, RiSparklingFill } from '@remixicon/react';

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
    serviceTag: 'Canine Wellness',
  },
  {
    id: 'cat',
    image: '/images/vets/vet_cat_hd.jpg',
    alt: 'อาจารย์สัตวแพทย์ตรวจดูแลน้องแมวอย่างอ่อนโยน',
    prompt: 'น้องแมวซึม ไม่ทานน้ำ ตรวจแล็บด่วน คลินิกแมวปลอดความเครียด 24 ชม.',
    petType: 'cat',
    serviceTag: 'ISFM Feline Clinic',
  },
  {
    id: 'corgi',
    image: '/images/vets/vet_corgi_hd.jpg',
    alt: 'สัตวแพทย์กอดน้องคอร์กี้อย่างอบอุ่น',
    prompt: 'ผ่าตัดส่องกล้องแผลเล็ก และตรวจหัวใจสัตว์เลี้ยงครบวงจร 24 ชม.',
    petType: 'dog',
    serviceTag: 'Micro-Surgery ICU',
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

  // Hostinger-style Typewriter & Auto-Cycling loop
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
      className="relative w-full flex flex-col items-center justify-center pt-2 pb-8 sm:pb-10 select-none overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Rotating Stack Stage */}
      <div
        className="relative w-full max-w-[540px] h-[310px] xs:h-[340px] sm:h-[410px] flex items-center justify-center cursor-pointer group"
        style={{ perspective: '1200px' }}
      >
        {defaultCards.map((card, idx) => {
          // Relative position in the circular 3-card stack:
          // 0 = Front/Center (active)
          // 1 = Right card
          // 2 = Left card
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

              {/* Subtle gradient vignette to blend bottom with prompt bar */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            </button>
          );
        })}

        {/* Hostinger-style Floating Typewriter Prompt Pill Bar (On top of cards, at the bottom) */}
        <div
          onClick={handlePromptClick}
          className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] xs:w-[88%] sm:w-[480px] max-w-[95%] bg-background-primary-default/95 dark:bg-background-primary-default/90 backdrop-blur-xl border-2 border-accent-500/40 dark:border-accent-400/30 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center gap-2.5 sm:gap-3.5 cursor-pointer hover:border-accent-500 hover:shadow-[0_20px_45px_-8px_rgba(37,99,235,0.25)] transition-all duration-200 group/pill"
          role="button"
          tabIndex={0}
          aria-label="คลิกเพื่อนัดหมายบริการนี้"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePromptClick();
            }
          }}
        >
          {/* Sparkle Icon */}
          <div className="size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0 group-hover/pill:scale-105 group-hover/pill:bg-accent-500 group-hover/pill:text-white transition-all duration-200">
            <RiSparklingFill className="size-4 sm:size-5" />
          </div>

          {/* Typewriter Prompt Text */}
          <div className="min-w-0 flex-1 py-0.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] sm:text-[11px] font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wider">
                {currentCard.serviceTag}
              </span>
              <span className="text-[10px] text-text-tertiary hidden xs:inline">• แตะเพื่อจอง</span>
            </div>
            <div className="text-caption-1-medium sm:text-body-medium text-text-primary leading-snug line-clamp-2 font-medium">
              <span>{displayedText}</span>
              <span className="inline-block w-0.5 h-3.5 sm:h-4 bg-accent-500 ms-0.5 animate-pulse align-middle" />
            </div>
          </div>

          {/* Action Arrow Button */}
          <div
            className="size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-accent-500 hover:bg-accent-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover/pill:translate-x-0.5 transition-transform"
            title="นัดหมายบริการนี้"
          >
            <RiArrowRightLine className="size-4 sm:size-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPetCardDeck;
