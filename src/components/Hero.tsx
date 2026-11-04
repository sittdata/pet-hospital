import React from 'react';
import {
  RiCalendarEventLine,
  RiLineFill,
} from '@remixicon/react';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { HeatmapChartCard } from '@/components/application/charts/heatmap-chart-card';
import { HeroPetCardDeck } from './HeroPetCardDeck';
import { HospitalTaskList } from './HospitalTaskList';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden bg-background-primary-default pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-border-button-default transition-colors">
      {/* Background High-End Subtle Geometry */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 size-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 size-96 rounded-full bg-status-blue-background/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Clinical Core Presentation + Heatmap Chart Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Headline */}
            <h1 className="text-large-title-bold sm:text-display-1-bold text-text-primary tracking-tight leading-[1.12]">
              เคียงข้างทุกชีวิตสัตว์เลี้ยง <br />
              <span className="text-accent-500">บริบาลด้วยมาตรฐานสากล</span> ตลอด 24 ชั่วโมง
            </h1>

            {/* Sub-headline */}
            <p className="text-body-medium text-text-secondary leading-relaxed font-normal">
              ศูนย์การแพทย์สัตว์เลี้ยงครบวงจร พร้อมศูนย์ศัลยกรรมปลอดเชื้อความดันบวก คลินิกแมวปลอดความเครียด 
              และศูนย์สัตว์พิเศษ Exotic Pets วินิจฉัยแม่นยำด้วยห้องแล็บด่วนและอาจารย์สัตวแพทย์เฉพาะทาง
            </p>

            {/* Action Buttons with Strict BoardUI Hierarchy */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="medium"
                  leadingIcon={RiCalendarEventLine}
                  onClick={onOpenBooking}
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
              <HeatmapChartCard />
            </div>
          </div>

          {/* Right Column: 3D Pet Medical Passport Deck + Patient Workflow Live Task List */}
          <div className="lg:col-span-6 space-y-4 animate-boardui-condense">
            {/* Bento Card 1: 3D Fanned Pet Medical Passport Deck (FANCY Style) */}
            <HeroPetCardDeck onOpenBooking={onOpenBooking} />

            {/* Patient Workflow Live Task List */}
            <HospitalTaskList />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
