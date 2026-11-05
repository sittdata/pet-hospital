import React, { useState, useRef } from 'react';
import { PetType, TreatmentItem } from '../types';
import { petCategories, treatmentsByPet } from '../data/petTreatmentsData';
import {
  RiShieldCheckLine,
  RiCheckLine,
  RiCalendarEventLine,
  RiAlertFill,
  RiPriceTag3Line,
} from '@remixicon/react';
import { CatIcon, DogIcon, RabbitIcon, SmallPetIcon } from './icons/PetIcons';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { Breadcrumb, BreadcrumbItem } from '@/components/base/breadcrumb/breadcrumb';
import { cx } from '@/utils/cx';

interface PetTreatmentExplorerProps {
  onSelectBooking: (petType: PetType, serviceTitle: string) => void;
}

// ponytail: using curated high-res CDN pet photography; swap to locally hosted static assets if offline self-hosting required
const petImageMap: Record<PetType, string> = {
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
  exotic: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
  small: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=600',
};

export const PetTreatmentExplorer: React.FC<PetTreatmentExplorerProps> = ({ onSelectBooking }) => {
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const currentCategory = selectedPet ? petCategories.find((c) => c.id === selectedPet) : null;
  const filteredTreatments = selectedPet ? treatmentsByPet.filter((t) => t.petType === selectedPet) : [];

  const handlePetClick = (petId: PetType) => {
    if (selectedPet === petId) {
      setSelectedPet(null);
    } else {
      setSelectedPet(petId);
      // Smoothly scroll down to pet details after state update
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 60);
    }
  };

  const handleCollapse = () => {
    setSelectedPet(null);
    const section = document.getElementById('pet-treatments');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderPetIcon = (type: PetType, className = 'size-5') => {
    switch (type) {
      case 'cat':
        return <CatIcon className={className} />;
      case 'dog':
        return <DogIcon className={className} />;
      case 'exotic':
        return <RabbitIcon className={className} />;
      case 'small':
        return <SmallPetIcon className={className} />;
    }
  };

  return (
    <section id="pet-treatments" className="py-16 sm:py-20 bg-background-secondary-default border-b border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header without banned eyebrow */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
            ดูแลเฉพาะทาง ตามชนิดสัตว์เลี้ยง
          </h2>
          <p className="mt-3 text-body-medium text-text-secondary leading-relaxed">
            สัตว์แต่ละชนิดมีความต้องการและโรคที่ต่างกัน เลือกชนิดสัตว์เลี้ยงของคุณเพื่อดูบริการที่เหมาะสม
          </p>
        </div>

        {/* Lucian #223 Horizontal Pet Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" role="tablist" aria-label="หมวดหมู่ชนิดสัตว์เลี้ยง">
          {petCategories.map((cat) => {
            const isSelected = selectedPet === cat.id;
            const catTreatmentsCount = treatmentsByPet.filter((t) => t.petType === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handlePetClick(cat.id)}
                className={cx(
                  'group relative flex flex-col justify-between text-start rounded-3xl p-4 sm:p-5 transition-all duration-200 button-press-motion cursor-pointer border',
                  isSelected
                    ? 'bg-background-primary-default border-accent-500 ring-2 ring-accent-500/20 shadow-md -translate-y-1'
                    : 'bg-background-primary-default border-border-button-default hover:border-accent-300 hover:shadow-sm hover:-translate-y-0.5'
                )}
              >
                {/* Top bar: Badge & Radio indicator */}
                <div className="flex items-center justify-between w-full gap-2">
                  <Chip
                    color={isSelected ? 'blue' : 'neutral'}
                    variant="bold"
                    className="text-[11px] sm:text-xs truncate max-w-[85%]"
                  >
                    {cat.badge}
                  </Chip>
                  <div
                    className={cx(
                      'size-5 rounded-full flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-accent-500 text-white'
                        : 'border border-border-button-default text-transparent group-hover:border-accent-400'
                    )}
                  >
                    <RiCheckLine className="size-3.5" />
                  </div>
                </div>

                {/* Pet Artwork Visual Container */}
                <div className="relative my-3 h-28 sm:h-36 w-full rounded-2xl bg-background-secondary-default/70 flex items-center justify-center p-2 overflow-hidden transition-colors group-hover:bg-accent-500/5">
                  <img
                    src={petImageMap[cat.id]}
                    alt={cat.name}
                    className="h-full w-full object-cover rounded-xl shadow-xs transition-transform duration-300 select-none group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Details */}
                <div className="space-y-0.5 w-full relative z-10">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={cx(
                        'text-title-3-semibold transition-colors',
                        isSelected ? 'text-accent-500' : 'text-text-primary group-hover:text-accent-500'
                      )}
                    >
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-medium text-text-tertiary">
                      {catTreatmentsCount} บริการ
                    </span>
                  </div>
                  <p className="text-caption-1-medium text-text-tertiary truncate">
                    {cat.enName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pet Selected - Details & Treatment Explorer */}
        {currentCategory && selectedPet && (
          <div ref={detailsRef} id="pet-details-section" className="animate-fade-in space-y-6 pt-2 scroll-mt-24">
            {/* BoardUI Breadcrumb for Pet Category Navigation */}
            <div className="px-1 flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbItem href="#">แม็กเหนือวินเหนือพิกโก้</BreadcrumbItem>
                <BreadcrumbItem href="#pet-treatments">แผนกบริบาลเฉพาะสัตว์</BreadcrumbItem>
                <BreadcrumbItem current>
                  {currentCategory.name} ({currentCategory.enName})
                </BreadcrumbItem>
              </Breadcrumb>
              <Button
                variant="ghost"
                size="small"
                onClick={handleCollapse}
                className="text-text-tertiary hover:text-text-primary text-caption-1-medium cursor-pointer"
              >
                ย่อเก็บ
              </Button>
            </div>

            {/* Active Category Overview Card */}
            <div className="bg-background-primary-default rounded-3xl p-6 sm:p-8 border border-border-button-default shadow-xs mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
                      {renderPetIcon(currentCategory.id, 'size-5')}
                    </div>
                    <h3 className="text-title-2-medium text-text-primary">{currentCategory.headline}</h3>
                    <Chip color="lime" variant="bold">
                      {currentCategory.badge}
                    </Chip>
                  </div>
                  <p className="text-text-secondary text-body-medium leading-relaxed">
                    {currentCategory.description}
                  </p>

                  {/* Common conditions pills */}
                  <div className="pt-2">
                    <span className="text-caption-1-semibold text-text-tertiary uppercase tracking-wider block mb-2">
                      โรคและอาการที่พบบ่อย:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentCategory.commonConditions.map((cond, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl text-caption-1-medium bg-background-secondary-default text-text-secondary border border-border-button-default"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Key Hospital Features for this Pet */}
                <div className="lg:col-span-5 bg-background-secondary-default rounded-2xl p-5 border border-border-button-default space-y-3">
                  <h4 className="font-bold text-body-medium text-text-primary flex items-center gap-2">
                    <RiShieldCheckLine className="size-4 text-accent-500" />
                    <span>{currentCategory.specialCareTitle}</span>
                  </h4>
                  <ul className="space-y-2 text-caption-1-medium text-text-secondary">
                    {currentCategory.specialCarePoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <RiCheckLine className="size-4 text-status-lime-text shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Treatment Cards Grid for Selected Pet */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-title-3-semibold text-text-primary">
                โปรแกรมการรักษาและคลินิกเฉพาะทางสำหรับ {currentCategory.name} ({filteredTreatments.length} รายการ)
              </h4>
              <span className="text-caption-1-medium text-text-tertiary hidden sm:inline">
                คลิกปุ่มจองนัดหมายเพื่อระบุบริการนี้ในแบบฟอร์ม
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTreatments.map((treatment: TreatmentItem) => (
                <div
                  key={treatment.id}
                  className="bg-background-primary-default rounded-3xl p-6 border border-border-button-default shadow-xs hover:border-accent-400 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header & Category Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Chip color="neutral" variant="caption">
                          {treatment.category}
                        </Chip>
                        <h5 className="font-bold text-title-3-semibold text-text-primary mt-2">
                          {treatment.title}
                        </h5>
                      </div>
                      {treatment.isEmergencyRelevant && (
                        <Chip color="rose" variant="bold">
                          <RiAlertFill className="size-3 inline mr-1" />
                          เคสเร่งด่วน 24 ชม.
                        </Chip>
                      )}
                    </div>

                    <p className="text-text-secondary text-body-medium leading-relaxed">
                      {treatment.description}
                    </p>

                    {/* Symptoms / Points */}
                    <div className="space-y-2 pt-1">
                      <div className="text-caption-1-medium text-text-secondary">
                        <strong className="text-text-primary">แนวทางการรักษา:</strong> {treatment.treatmentApproach}
                      </div>
                      <ul className="space-y-1">
                        {treatment.symptoms.map((sym, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-caption-1-medium text-text-secondary">
                            <RiCheckLine className="size-4 text-status-lime-text shrink-0 mt-0.5" />
                            <span>{sym}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer: Duration estimate & Booking Action */}
                  <div className="mt-6 pt-4 border-t border-border-button-default flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <RiPriceTag3Line className="size-4 text-text-tertiary" />
                      <span className="text-caption-1-semibold text-text-primary">ระยะเวลา: {treatment.durationEstimate}</span>
                    </div>

                    <Button
                      variant="secondary"
                      size="small"
                      leadingIcon={RiCalendarEventLine}
                      onClick={() => onSelectBooking(selectedPet, treatment.title)}
                    >
                      จองโปรแกรมนี้
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
