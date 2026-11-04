import React, { useState } from 'react';
import { cx } from '@/utils/cx';

export interface CardStackItem {
  id: string;
  image: string;
  alt: string;
}

const defaultCards: CardStackItem[] = [
  {
    id: 'corgi',
    image: '/images/vets/vet_corgi_hd.jpg',
    alt: 'สัตวแพทย์กอดน้องคอร์กี้อย่างอบอุ่น',
  },
  {
    id: 'cat',
    image: '/images/vets/vet_cat_hd.jpg',
    alt: 'อาจารย์สัตวแพทย์ตรวจดูแลน้องแมวอย่างอ่อนโยน',
  },
  {
    id: 'golden',
    image: '/images/vets/vet_golden_hd.jpg',
    alt: 'สัตวแพทย์ผู้เชี่ยวชาญกอดน้องหมาโกลเด้นยิ้มสดใส',
  },
];

interface HeroPetCardDeckProps {
  onOpenBooking?: () => void;
}

export const HeroPetCardDeck: React.FC<HeroPetCardDeckProps> = () => {
  const [cards, setCards] = useState<CardStackItem[]>(defaultCards);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click card to bring it to the front/center
  const handleCardClick = (clickedId: string) => {
    setCards((prev) => {
      const clickedCard = prev.find((c) => c.id === clickedId);
      if (!clickedCard) return prev;
      const remaining = prev.filter((c) => c.id !== clickedId);
      // Place remaining at index 0, 1 and clicked card at index 2 (center/top)
      return [remaining[0], remaining[1], clickedCard];
    });
  };

  return (
    <div className="relative w-full flex items-center justify-center py-2 sm:py-4 select-none overflow-hidden sm:overflow-visible">
      {/* Centered Large Card Stack Stage (Frameless, Floats Directly on Page) */}
      <div
        className="relative w-full max-w-[540px] h-[310px] xs:h-[340px] sm:h-[420px] flex items-center justify-center cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredCardId(null);
        }}
        onClick={() => setIsHovered((prev) => !prev)}
        style={{
          perspective: '1200px',
        }}
      >
        {cards.map((card, index) => {
          // 3 cards configuration:
          // index 0: Left card
          // index 1: Right card
          // index 2: Center (Front / Top) card
          const isLeft = index === 0;
          const isRight = index === 1;
          const isCenter = index === 2;
          const isDirectlyHovered = hoveredCardId === card.id;

          // Default Rest State (Tightly stacked in center)
          let translateX = 0;
          let translateY = 0;
          let rotate = 0;
          let scale = 1;
          let zIndex = isCenter ? 20 : isLeft ? 10 : 5;
          let opacity = isCenter ? 1 : 0.88;

          if (isLeft) {
            translateX = isMobile ? -10 : -18;
            translateY = isMobile ? 6 : 10;
            rotate = isMobile ? -6 : -8;
          } else if (isRight) {
            translateX = isMobile ? 10 : 20;
            translateY = isMobile ? 5 : 8;
            rotate = isMobile ? 5 : 7;
          } else {
            translateX = 0;
            translateY = 0;
            rotate = 0;
          }

          // Hovered / Fanned Out State (Spring fan spread)
          if (isHovered) {
            opacity = 1;
            if (isLeft) {
              translateX = isMobile ? -46 : -115;
              translateY = isMobile ? 4 : 6;
              rotate = isMobile ? -9 : -14;
            } else if (isRight) {
              translateX = isMobile ? 46 : 115;
              translateY = isMobile ? 4 : 6;
              rotate = isMobile ? 9 : 14;
            } else {
              translateX = 0;
              translateY = isMobile ? -8 : -15;
              scale = isMobile ? 1.02 : 1.03;
            }
          }

          // Individual Card Hover Boost
          if (isDirectlyHovered) {
            scale = isMobile ? 1.04 : 1.07;
            zIndex = 35;
          }

          return (
            <button
              key={card.id}
              type="button"
              aria-label={card.alt}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(card.id);
              }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={cx(
                'absolute inset-0 m-auto w-[220px] xs:w-[250px] sm:w-[310px] lg:w-[330px] h-[280px] xs:h-[310px] sm:h-[370px] lg:h-[390px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 focus:outline-hidden',
                isCenter ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' : 'shadow-xl'
              )}
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                zIndex,
                opacity,
                transition:
                  'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 360ms ease, box-shadow 360ms ease',
                willChange: 'transform, opacity',
              }}
            >
              {/* Full-bleed Large Photo */}
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-cover transition-transform duration-500 pointer-events-none"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroPetCardDeck;
