import React from 'react';
import {
  RiCalendarEventLine,
  RiLineFill,
} from '@remixicon/react';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { HospitalAlertsCard } from './HospitalAlertsCard';
import { HeroPetCardDeck } from './HeroPetCardDeck';
import { HospitalTaskList } from './HospitalTaskList';

interface HeroProps {
  onOpenBooking: (prefillPetType?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden overflow-x-clip bg-background-primary-default pt-4 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-border-button-default transition-colors">
      {/* Background High-End Subtle Geometry */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 size-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 size-96 rounded-full bg-status-blue-background/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-10 lg:gap-y-4 items-start">
          
          {/* 3D Pet Cards Deck (Mobile: 1st above headline; Desktop: top of right column) */}
          <div className="order-1 lg:order-2 lg:col-span-6 w-full animate-boardui-condense">
            <HeroPetCardDeck onOpenBooking={onOpenBooking} />
          </div>

          {/* Left Column: Clinical Core Presentation + Heatmap Chart Card */}
          <div className="order-2 lg:order-1 lg:col-span-6 lg:row-span-2 space-y-6">
            {/* Main Headline */}
            <h1 className="text-title-1-semibold xs:text-large-title-bold sm:text-display-1-bold text-text-primary tracking-tight leading-[1.15]">
              เคียงข้างทุกชีวิตสัตว์เลี้ยง <br />
              <span className="text-accent-500">พร้อมดูแลคุณทุกวินาที</span> ตลอด 24 ชั่วโมง
            </h1>

            {/* Sub-headline */}
            <p className="text-body-medium text-text-secondary leading-relaxed font-normal">
              ดูแลทั้งเรื่องด่วนและเรื่องทั่วไป ตั้งแต่ตรวจสุขภาพ ฉีดวัคซีน ไปจนถึงผ่าตัดและดูแลอาการวิกฤต โดยสัตวแพทย์เฉพาะทาง ที่คอยอยู่เคียงข้างคุณและสัตว์เลี้ยง
            </p>

            {/* Action Buttons with Strict BoardUI Hierarchy */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="medium"
                  leadingIcon={RiCalendarEventLine}
                  onClick={() => onOpenBooking()}
                  className="justify-center"
                >
                  นัดหมายตรวจล่วงหน้า
                </Button>

                <ButtonLink
                  variant="secondary"
                  size="medium"
                  leadingIcon={RiLineFill}
                  href="https://line.me"
                  target="_blank"
                  rel="noreferrer"
                  className="justify-center bg-[#06C755] hover:bg-[#05b34c] text-white border-transparent shadow-xs transition-colors"
                >
                  ปรึกษาอาการทาง LINE
                </ButtonLink>
              </div>
            </div>

            {/* Heatmap Chart Card (Replaced the 3 micro stat cards) */}
            <div className="pt-2">
              <HospitalAlertsCard />
            </div>
          </div>

          {/* Right Column Bottom: Patient Workflow Live Task List */}
          <div className="order-3 lg:order-3 lg:col-span-6 space-y-4 animate-boardui-condense">
            <HospitalTaskList />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
