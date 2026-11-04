import React from 'react';
import {
  RiMapPin2Line,
  RiCarLine,
  RiCompass3Line,
  RiPhoneFill,
  RiExternalLinkLine,
} from '@remixicon/react';
import { StatusDot } from '@/components/base/badges/status-dot';
import { ButtonLink } from '@/components/base/buttons/button';
import { SocialButton } from '@/components/base/social-button/social-button';

export const LocationHours: React.FC = () => {
  return (
    <section id="location" className="py-16 sm:py-20 bg-background-primary-default border-b border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Location & Hours Information */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
                ที่ตั้งโรงพยาบาลและเวลาทำการ
              </h2>
              <p className="mt-2 text-body-medium text-text-secondary leading-relaxed">
                ตั้งอยู่ใจกลางเมือง เดินทางสะดวกรวดเร็ว ติดถนนใหญ่ พร้อมช่องทางด่วนเทียบรถส่งเคสฉุกเฉินเฉพาะ
              </p>
            </div>

            {/* Address Card */}
            <div className="bg-background-secondary-default rounded-3xl p-6 border border-border-button-default space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-2xl bg-background-primary-default border border-border-button-default text-accent-500 flex items-center justify-center shrink-0">
                  <RiMapPin2Line className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-title-3-semibold text-text-primary">โรงพยาบาลสัตว์แม็กเหนือวินเหนือพิกโก้ (สาขาทองหล่อ)</h4>
                  <p className="text-caption-1-medium text-text-secondary mt-1 leading-relaxed">
                    เลขที่ 123/4 ซอยสุขุมวิท 55 (ทองหล่อ ซอย 11) แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-caption-1-medium">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-primary-default border border-border-button-default text-text-secondary font-medium">
                  <RiCarLine className="size-4 text-accent-500" />
                  <span>ที่จอดรถในร่ม 30+ คัน</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-primary-default border border-border-button-default text-text-secondary font-medium">
                  <RiCompass3Line className="size-4 text-status-blue-text" />
                  <span>ใกล้ BTS ทองหล่อ (ทางออก 3)</span>
                </span>
              </div>
            </div>

            {/* Direct Directions CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonLink
                variant="primary"
                size="medium"
                leadingIcon={RiCompass3Line}
                trailingIcon={RiExternalLinkLine}
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 justify-center"
              >
                เปิดแผนที่นำทาง Google Maps
              </ButtonLink>

              <ButtonLink
                variant="secondary"
                size="medium"
                leadingIcon={RiPhoneFill}
                href="tel:028889999"
                className="justify-center text-status-rose-text hover:text-status-rose-text"
              >
                โทรสอบถามเส้นทาง
              </ButtonLink>

              <SocialButton
                brand="whatsapp"
                appearance="colorful"
                size="medium"
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="justify-center !w-auto"
              >
                WhatsApp ER
              </SocialButton>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive View & Facade */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl overflow-hidden border border-border-button-default shadow-xs relative bg-background-tertiary-default h-96">
              <iframe
                title="โรงพยาบาลสัตว์อารักษ์ แผนที่"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15502.827361849025!2d100.57469792196645!3d13.736109968817454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fa579737119%3A0xc3911b626466336a!2sThong%20Lo%20Rd%2C%20Khwaeng%20Khlong%20Tan%20Nuea%2C%20Khet%20Watthana%2C%20Krung%20Thep%20Maha%20Nakhon%2010110!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Emergency Entrance Guidance */}
            <div className="p-4 rounded-2xl bg-background-secondary-default border border-border-button-default text-caption-1-medium text-text-secondary flex items-start gap-3">
              <StatusDot color="green" className="mt-1" />
              <div>
                <strong className="block font-bold text-text-primary">ช่องทางด่วนส่งผู้ป่วยฉุกเฉิน 24 ชั่วโมง:</strong>
                <span>สามารถเลี้ยวรถเข้าเทียบหน้าประตูห้องฉุกเฉิน (Emergency Bay) ได้ทันที มีเจ้าหน้าที่เวรเปลและวิชาชีพสแตนด์บายตลอดเวลา</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
