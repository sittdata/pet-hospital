import React, { useState } from 'react';
import {
  RiWifiLine,
  RiShieldCheckLine,
  RiSparklingFill,
  RiArrowRightLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { cx } from '@/utils/cx';

export interface PetCard3DItem {
  id: string;
  name: string;
  species: string;
  breed: string;
  careTier: string;
  cardColor: string;
  textColor: string;
  chipColor: string;
  image: string;
  imageAlt: string;
  badge: string;
  serial: string;
}

const pet3DCards: PetCard3DItem[] = [
  {
    id: 'dog',
    name: 'น้องไมโล (Milo)',
    species: 'Canine Care',
    breed: 'Golden Retriever',
    careTier: 'TPLO & ICU Platinum',
    cardColor: 'from-[#00c6ff] to-[#0072ff]', // Cyan / Ice Blue metallic
    textColor: 'text-white',
    chipColor: 'bg-gradient-to-br from-amber-200 to-amber-400 border-amber-300',
    image: '/images/pets/hero_dog_3d.jpg',
    imageAlt: '3D Golden Retriever',
    badge: 'ER & Ortho Ready',
    serial: 'ARAK-CANINE-8821',
  },
  {
    id: 'cat',
    name: 'น้องลูนา (Luna)',
    species: 'Feline Care',
    breed: 'British Shorthair',
    careTier: 'ISFM Gold Standard',
    cardColor: 'from-[#3a3f47] via-[#2c3038] to-[#1c1f24]', // Matte Graphite / Dark Platinum
    textColor: 'text-white',
    chipColor: 'bg-gradient-to-br from-amber-200 to-amber-400 border-amber-300',
    image: '/images/pets/hero_cat_3d.jpg',
    imageAlt: '3D British Shorthair Cat',
    badge: 'Stress-Free 0dB',
    serial: 'ARAK-FELINE-4912',
  },
  {
    id: 'exotic',
    name: 'น้องบันบัน (Bunny)',
    species: 'Exotic Care',
    breed: 'Holland Lop Rabbit',
    careTier: 'Micro-Anesthesia Certified',
    cardColor: 'from-[#10b981] via-[#059669] to-[#047857]', // Neon Lime / Emerald
    textColor: 'text-white',
    chipColor: 'bg-gradient-to-br from-amber-200 to-amber-400 border-amber-300',
    image: '/images/pets/exotic.png',
    imageAlt: 'Rabbit Exotic',
    badge: 'Incubator ICU',
    serial: 'ARAK-EXOTIC-3310',
  },
  {
    id: 'small',
    name: 'น้องแฮมมี่ (Hammy)',
    species: 'Small Mammals',
    breed: 'Syrian Hamster',
    careTier: 'Micro-Veterinary Surgery',
    cardColor: 'from-[#c28e67] via-[#a8744f] to-[#7c4f2f]', // Warm Bronze / Rose Gold
    textColor: 'text-white',
    chipColor: 'bg-gradient-to-br from-amber-200 to-amber-400 border-amber-300',
    image: '/images/pets/small.png',
    imageAlt: 'Small Hamster',
    badge: 'Point-of-Care Lab',
    serial: 'ARAK-SMALL-1092',
  },
];

interface PetCardDeck3DProps {
  onOpenBooking?: () => void;
}

export const PetCardDeck3D: React.FC<PetCardDeck3DProps> = ({ onOpenBooking }) => {
  const [activeCardId, setActiveCardId] = useState<string>('dog');

  const activeCard = pet3DCards.find((c) => c.id === activeCardId) || pet3DCards[0];

  return (
    <section className="py-16 sm:py-24 bg-background-primary-default border-b border-border-button-default relative overflow-hidden transition-colors">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 size-[500px] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 size-[350px] rounded-full bg-status-lime-background/40 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Bold Presentation Headlines */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 text-accent-500 border border-accent-500/20 text-caption-1-semibold">
              <RiSparklingFill className="size-3.5" />
              <span>3D Pet Medical Passport • บัตรเวชระเบียนอัจฉริยะ</span>
            </div>

            <h2 className="text-display-3-bold sm:text-display-2-bold text-text-primary tracking-tight leading-[1.15]">
              ดูแลสัตว์เลี้ยงทุกสายพันธุ์ <br />
              <span className="text-accent-500">
                ด้วยความเชี่ยวชาญระดับ 3D
              </span>
            </h2>

            <p className="text-body-large text-text-secondary leading-relaxed max-w-xl">
              ตั้งแต่สุนัข แมว สัตว์พิเศษ จนถึงสัตว์ฟันแทะขนาดเล็ก เราเตรียมห้องตรวจจำเพาะสายพันธุ์ 
              พร้อมประวัติเวชระเบียนดิจิทัลแบบเรียลไทม์ เชื่อมโยงทีมแพทย์ 18 ท่านตลอด 24 ชั่วโมง
            </p>

            {/* Active Card Specs Highlight */}
            <div className="p-4 rounded-2xl bg-background-secondary-default border border-border-button-default max-w-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-caption-1-semibold font-bold text-text-primary flex items-center gap-1.5">
                  <RiShieldCheckLine className="size-4 text-accent-500" />
                  <span>{activeCard.name} ({activeCard.breed})</span>
                </span>
                <Chip color="blue" variant="bold" className="text-[11px]">
                  {activeCard.badge}
                </Chip>
              </div>
              <p className="text-caption-1-medium text-text-secondary">
                มาตรฐานการดูแล: <strong className="text-text-primary">{activeCard.careTier}</strong> • หมายเลขเวชระเบียน: <span className="font-mono text-accent-500">{activeCard.serial}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="medium"
                trailingIcon={RiArrowRightLine}
                onClick={onOpenBooking}
              >
                ลงทะเบียนสัตว์เลี้ยงออนไลน์
              </Button>
              <span className="text-caption-1-medium text-text-tertiary">
                *คลิกที่การ์ด 3D แต่ละใบเพื่อสลับดูผู้ป่วย
              </span>
            </div>
          </div>

          {/* Right Column: 3D Fanned Isometric Card Deck (FANCY Style) */}
          <div className="lg:col-span-6 flex items-center justify-center py-8 lg:py-12">
            <div
              className="relative w-full max-w-[500px] h-[340px] sm:h-[380px]"
              style={{
                perspective: '1200px',
              }}
            >
              {pet3DCards.map((card, index) => {
                const isActive = activeCardId === card.id;

                // 3D Isometric Stacking offsets like in the reference picture
                const defaultX = index * 52;
                const defaultZ = -index * 35;
                const defaultRotY = -14;
                const defaultRotX = 6;
                const defaultRotZ = 4;

                const zIndex = isActive ? 40 : 30 - index;

                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveCardId(card.id)}
                    className={cx(
                      'absolute top-4 left-2 w-[240px] sm:w-[270px] h-[320px] sm:h-[350px] rounded-3xl p-5 shadow-2xl transition-all duration-300 cursor-pointer select-none group',
                      `bg-gradient-to-br ${card.cardColor} ${card.textColor}`,
                      isActive
                        ? 'ring-4 ring-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                    )}
                    style={{
                      transform: isActive
                        ? `translateX(${defaultX - 20}px) translateY(-25px) translateZ(60px) rotateY(${defaultRotY}deg) rotateX(${defaultRotX}deg) rotateZ(${defaultRotZ}deg) scale(1.04)`
                        : `translateX(${defaultX}px) translateZ(${defaultZ}px) rotateY(${defaultRotY}deg) rotateX(${defaultRotX}deg) rotateZ(${defaultRotZ}deg)`,
                      zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Metallic Card Header: Chip & Contactless Wave */}
                    <div className="flex items-center justify-between">
                      {/* Microchip */}
                      <div className={cx('size-9 rounded-lg border flex items-center justify-center p-1.5 shadow-sm', card.chipColor)}>
                        <div className="w-full h-full border border-amber-500/50 rounded-xs grid grid-cols-2 gap-0.5 opacity-80">
                          <div className="border-r border-amber-600/40" />
                          <div />
                        </div>
                      </div>

                      {/* Contactless Wave */}
                      <RiWifiLine className="size-5 rotate-90 opacity-70" />
                    </div>

                    {/* Animal Artwork Area */}
                    <div className="my-3 h-28 sm:h-32 w-full flex items-center justify-center relative">
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        className="h-full w-auto max-w-full object-contain drop-shadow-2xl rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Card Lower Data */}
                    <div className="mt-auto space-y-1">
                      <div className="text-[10px] uppercase tracking-widest opacity-75 font-semibold">
                        {card.species}
                      </div>
                      <div className="font-bold text-body-medium truncate tracking-tight">
                        {card.name}
                      </div>
                      <div className="text-[11px] opacity-85 truncate">
                        {card.breed}
                      </div>
                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono opacity-60 border-t border-white/20">
                        <span>{card.serial}</span>
                        <span>24/7 ER</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PetCardDeck3D;
