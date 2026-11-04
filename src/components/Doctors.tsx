import React, { useState } from 'react';
import { doctorsData } from '../data/doctorsData';
import { DoctorProfile } from '../types';
import {
  RiCalendarEventLine,
  RiGraduationCapLine,
  RiAwardLine,
  RiTimeLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { StatusDot } from '@/components/base/badges/status-dot';

interface DoctorsProps {
  onBookWithDoctor: (doctorName: string, specialty: string) => void;
}

export const Doctors: React.FC<DoctorsProps> = ({ onBookWithDoctor }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'แพทย์ทั้งหมด' },
    { id: 'surgery', label: 'ศูนย์ศัลยกรรม' },
    { id: 'cat', label: 'คลินิกแมว' },
    { id: 'exotic', label: 'สัตว์พิเศษ Exotic' },
    { id: 'cardio', label: 'โรคหัวใจ' },
  ];

  const filteredDoctors = filterCategory === 'all'
    ? doctorsData
    : doctorsData.filter((d) => d.category === filterCategory);

  return (
    <section id="doctors" className="py-16 sm:py-20 bg-background-secondary-default border-b border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
            ทีมสัตวแพทย์เฉพาะทาง
          </h2>
          <p className="mt-3 text-body-medium text-text-secondary leading-relaxed">
            รวมอาจารย์แพทย์และสัตวแพทย์ผู้ได้รับวุฒิบัตรเฉพาะทาง 
            พร้อมประสบการณ์ทางคลินิกสูง เพื่อการวินิจฉัยที่แม่นยำและการรักษาที่ตรงจุดที่สุด
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-background-primary-default border border-border-button-default shadow-xs gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-caption-1-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  filterCategory === cat.id
                    ? 'bg-accent-500 text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary-default'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 animate-fade-in">
          {filteredDoctors.map((doc: DoctorProfile) => (
            <div
              key={doc.id}
              className="bg-background-primary-default rounded-3xl overflow-hidden border border-border-button-default shadow-xs hover:border-accent-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Photo & Badges */}
                <div className="relative h-64 bg-background-tertiary-default overflow-hidden">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-background-primary-default/90 backdrop-blur-sm px-3 py-1 rounded-full text-caption-1-semibold text-text-primary border border-border-button-default shadow-xs flex items-center gap-1.5">
                    <RiAwardLine className="size-3.5 text-accent-500" />
                    <span>ประสบการณ์ {doc.experienceYears} ปี</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-background-primary-default/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-caption-2-bold text-text-primary border border-border-button-default flex items-center gap-1.5">
                    <StatusDot color="green" />
                    <span>พร้อมรับนัดตรวจ</span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6">
                  <h3 className="font-bold text-title-3-semibold text-text-primary leading-snug">{doc.name}</h3>
                  <p className="text-caption-1-semibold text-accent-500 mt-1">{doc.title}</p>
                  
                  <div className="mt-3.5 mb-4 p-3 bg-background-secondary-default rounded-2xl border border-border-button-default">
                    <span className="text-caption-1-semibold text-text-primary block mb-1">ความเชี่ยวชาญเฉพาะด้าน:</span>
                    <p className="text-caption-1-medium text-text-secondary leading-relaxed">{doc.specialty}</p>
                  </div>

                  {/* Education / Credentials */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-caption-1-semibold text-text-tertiary uppercase tracking-wider block">
                      คุณวุฒิการศึกษาและวุฒิบัตร:
                    </span>
                    {doc.degrees.map((deg, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-1.5 text-caption-1-medium text-text-secondary">
                        <RiGraduationCapLine className="size-4 text-accent-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{deg}</span>
                      </div>
                    ))}
                  </div>

                  {/* On Duty Days */}
                  <div className="flex items-center gap-2 text-caption-1-medium text-text-secondary pt-3 border-t border-border-button-default">
                    <RiTimeLine className="size-4 text-text-tertiary shrink-0" />
                    <span>
                      ออกตรวจ: <strong className="text-text-primary font-semibold">{doc.availableDays.join(', ')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Button
                  variant="secondary"
                  size="small"
                  leadingIcon={RiCalendarEventLine}
                  onClick={() => onBookWithDoctor(doc.name, doc.specialty)}
                  className="w-full justify-center"
                >
                  นัดหมายตรวจกับ {doc.name.split(' ')[1] || doc.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
