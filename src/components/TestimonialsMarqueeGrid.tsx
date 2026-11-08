import React from 'react';
import {
  RiStarFill,
  RiHeart3Fill,
  RiShieldCheckFill,
} from '@remixicon/react';
import {
  TESTIMONIALS_ROW_1,
  TESTIMONIALS_ROW_2,
  type TestimonialItem,
} from '../data/testimonialsData';
import { Avatar } from '@/components/base/avatar/avatar';

interface TestimonialCardProps {
  item: TestimonialItem;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ item }) => {
  return (
    <div className="w-[320px] sm:w-[380px] shrink-0 p-5 sm:p-6 rounded-3xl bg-background-secondary-default border border-border-button-default hover:border-accent-300 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between select-none">
      <div className="space-y-3">
        {/* Rating Stars & Verified Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: item.rating }).map((_, i) => (
              <RiStarFill key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-600 bg-accent-500/10 px-2 py-0.5 rounded-full">
            <RiShieldCheckFill className="size-3" />
            ผู้รับบริการจริง
          </span>
        </div>

        {/* Testimonial Quote */}
        <p className="text-body-regular text-text-primary leading-relaxed text-sm sm:text-base">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      {/* Author & Pet Info */}
      <div className="mt-5 pt-4 border-t border-separator-border flex items-center gap-3">
        {item.avatarUrl ? (
          <img
            src={item.avatarUrl}
            alt={item.authorName}
            className="size-11 rounded-full object-cover shrink-0 ring-1 ring-border-button-default"
            loading="lazy"
          />
        ) : (
          <Avatar
            initials={item.authorName.slice(0, 2).toUpperCase()}
            size="md"
          />
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-caption-1-semibold text-text-primary truncate">
            {item.authorName}
          </h4>
          <p className="text-caption-2-medium text-text-secondary truncate">
            {item.petName} ({item.petType})
          </p>
          <p className="text-[11px] text-text-tertiary truncate">
            {item.serviceCenter}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsMarqueeGrid: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 bg-background-full border-b border-border-button-default overflow-hidden relative"
      aria-label="เสียงตอบรับจากครอบครัวสัตว์เลี้ยง"
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: marquee-left 42s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: marquee-right 46s linear infinite;
        }
        .marquee-container:hover .marquee-track-left,
        .marquee-container:hover .marquee-track-right {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-button-default bg-background-secondary-default text-text-secondary text-caption-1-semibold mb-3">
          <RiHeart3Fill className="size-3.5 text-accent-500" />
          <span>Patient Stories & Reviews</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
          ความประทับใจจากครอบครัวสัตว์เลี้ยง
        </h2>
        <p className="mt-3 text-body-medium text-text-secondary max-w-2xl mx-auto leading-relaxed">
          เสียงสะท้อนจริงจากเจ้าของสัตว์เลี้ยงที่ไว้วางใจให้เราดูแลและรักษาตลอด 24 ชั่วโมง
        </p>
      </div>

      {/* Marquee Wrapper with Aceternity-style Left/Right Edge Fade Masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] space-y-4 sm:space-y-6">
        {/* Row 1: Scrolling Left */}
        <div className="marquee-container overflow-hidden">
          <div className="marquee-track-left gap-4 sm:gap-6 flex">
            {/* Duplicate list to achieve continuous seamless infinite scroll */}
            {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((item, index) => (
              <TestimonialCard key={`r1-${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="marquee-container overflow-hidden">
          <div className="marquee-track-right gap-4 sm:gap-6 flex">
            {/* Duplicate list to achieve continuous seamless infinite scroll */}
            {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((item, index) => (
              <TestimonialCard key={`r2-${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
