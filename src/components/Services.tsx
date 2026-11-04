import React from 'react';
import { servicesData } from '../data/servicesData';
import { HospitalService } from '../types';
import {
  RiFirstAidKitLine,
  RiHeartPulseLine,
  RiScanLine,
  RiHandHeartLine,
  RiLeafLine,
  RiShieldCheckLine,
  RiCheckLine,
  RiArrowRightLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';

interface ServicesProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenBooking }) => {
  const getIcon = (name: string, isEmergency?: boolean) => {
    const iconClass = isEmergency ? 'size-6 text-status-rose-text' : 'size-6 text-accent-500';
    switch (name) {
      case 'Ambulance':
        return <RiFirstAidKitLine className={iconClass} />;
      case 'Activity':
        return <RiHeartPulseLine className={iconClass} />;
      case 'ScanLine':
        return <RiScanLine className={iconClass} />;
      case 'HeartHandshake':
        return <RiHandHeartLine className={iconClass} />;
      case 'Feather':
        return <RiLeafLine className={iconClass} />;
      default:
        return <RiShieldCheckLine className={iconClass} />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-background-primary-default border-b border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
            ศูนย์การแพทย์และแผนกการรักษาเฉพาะทาง
          </h2>
          <p className="mt-3 text-body-medium text-text-secondary leading-relaxed">
            พร้อมด้วยอุปกรณ์ทางการแพทย์มาตรฐานสากล ห้องปฏิบัติการวิเคราะห์ผลด่วน 
            และทีมสหวิชาชีพสัตวแพทย์ที่พร้อมดูแลสัตว์เลี้ยงอย่างครบวงจร
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {servicesData.map((service: HospitalService) => (
            <div
              key={service.id}
              className={`rounded-3xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between ${
                service.isEmergency
                  ? 'bg-status-rose-background/40 border-status-rose-text/30 shadow-xs hover:border-status-rose-text'
                  : 'bg-background-primary-default border-border-button-default shadow-xs hover:border-accent-400 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center border border-border-button-default ${
                      service.isEmergency ? 'bg-status-rose-background' : 'bg-background-secondary-default'
                    }`}
                  >
                    {getIcon(service.iconName, service.isEmergency)}
                  </div>
                  {service.badge && (
                    <Chip
                      color={service.isEmergency ? 'rose' : 'lime'}
                      variant="bold"
                    >
                      {service.badge}
                    </Chip>
                  )}
                </div>

                <h3 className="text-title-3-semibold text-text-primary">{service.title}</h3>
                <p className="text-caption-1-medium text-text-tertiary mb-3">{service.enTitle}</p>
                <p className="text-body-medium text-text-secondary leading-relaxed mb-5">{service.summary}</p>

                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-caption-1-medium text-text-secondary">
                      <RiCheckLine className="size-4 text-status-lime-text shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-border-button-default">
                <Button
                  variant={service.isEmergency ? 'danger' : 'secondary'}
                  size="medium"
                  trailingIcon={RiArrowRightLine}
                  onClick={() => onOpenBooking(service.title)}
                  className="w-full justify-center"
                >
                  {service.isEmergency ? 'ติดต่อฉุกเฉิน / นัดหมายด่วน' : 'นัดหมายตรวจแผนกนี้'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
