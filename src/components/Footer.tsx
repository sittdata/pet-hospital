import React from 'react';
import {
  RiPhoneFill,
  RiMailLine,
  RiMapPin2Line,
  RiShieldCheckLine,
} from '@remixicon/react';
import { StatusDot } from '@/components/base/badges/status-dot';
import { ButtonLink } from '@/components/base/buttons/button';
import { SocialButton } from '@/components/base/social-button/social-button';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary-default text-text-secondary pt-16 pb-12 border-t border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border-button-default">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-3 group w-fit">
              <div className="size-12 rounded-2xl bg-blue-900 flex items-center justify-center p-1.5 shadow-xs border border-blue-800/40 group-hover:scale-105 transition-transform">
                <img 
                  src="/logo-nav.webp" 
                  alt="VetPaws Animal Hospital Logo" 
                  className="h-8.5 w-auto object-contain" 
                />
              </div>
              <div>
                <span className="font-bold text-title-3-semibold text-text-primary tracking-tight">VetPaws Animal Hospital</span>
                <p className="text-caption-1-medium text-text-tertiary">VetPaws Animal Hospital (24 Hours)</p>
              </div>
            </a>

            <p className="text-body-medium text-text-secondary leading-relaxed max-w-md">
              สถานพยาบาลสัตว์ชั้นนำ บริการทางการแพทย์เฉพาะทางตลอด 24 ชั่วโมง 
              ด้วยมาตรฐานความปลอดภัยระดับสูง การแยกโซนสัตว์ป่วยอย่างเคร่งครัด และการบริบาลด้วยความรัก
            </p>

            <div className="flex items-center gap-2 text-caption-1-medium text-text-tertiary pt-2">
              <RiShieldCheckLine className="size-4 text-accent-500 shrink-0" />
              <span>ใบอนุญาตประกอบกิจการสถานพยาบาลสัตว์ เลขที่ 101080024/2565</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-body-medium text-text-primary uppercase tracking-wider">แผนกบริการ</h4>
            <ul className="space-y-2 text-caption-1-medium text-text-secondary">
              <li><a href="#services" className="hover:text-text-primary transition-colors">ศูนย์ฉุกเฉินและ ICU 24 ชั่วโมง</a></li>
              <li><a href="#pet-treatments" className="hover:text-text-primary transition-colors">คลินิกแมวปลอดความเครียด (ISFM)</a></li>
              <li><a href="#pet-treatments" className="hover:text-text-primary transition-colors">ศูนย์ศัลยกรรมกระดูกและข้อ (TPLO)</a></li>
              <li><a href="#pet-treatments" className="hover:text-text-primary transition-colors">ศูนย์สัตว์พิเศษ Exotic Pets และกระต่าย</a></li>
              <li><a href="#services" className="hover:text-text-primary transition-colors">ตรวจวินิจฉัยภาพดิจิทัลและเอ็กซเรย์</a></li>
              <li><a href="#services" className="hover:text-text-primary transition-colors">ตรวจสุขภาพและฉีดวัคซีนตามวัย</a></li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-body-medium text-text-primary uppercase tracking-wider">ติดต่อโรงพยาบาล</h4>
            <ul className="space-y-2.5 text-caption-1-medium text-text-secondary">
              <li className="flex items-start gap-2.5">
                <RiMapPin2Line className="size-4 text-accent-500 shrink-0 mt-0.5" />
                <span>ซอยสุขุมวิท 55 (ทองหล่อ 11) แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110</span>
              </li>
              <li className="flex items-center gap-2.5">
                <RiPhoneFill className="size-4 text-status-rose-text shrink-0" />
                <span>สายด่วนฉุกเฉิน 24 ชม.: <strong className="text-status-rose-text font-bold">02-888-9999</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <RiMailLine className="size-4 text-accent-500 shrink-0" />
                <span>contact@vetpaws-animal.com</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <ButtonLink
                variant="secondary"
                size="small"
                href="https://line.me"
                target="_blank"
                rel="noreferrer"
                className="text-status-lime-text hover:text-status-lime-text"
              >
                LINE Official: @vetpaws
              </ButtonLink>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-primary-default text-text-primary border border-border-button-default text-caption-1-semibold">
                <StatusDot color="green" />
                <span>เปิดบริการ 24 ชั่วโมง</span>
              </span>
            </div>

            {/* Official BoardUI Social Buttons */}
            <div className="pt-3 border-t border-border-button-default">
              <span className="block text-caption-2-medium text-text-tertiary mb-2 uppercase tracking-wider">
                ช่องทางโซเชียล & ชุมชนคนรักสัตว์
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <SocialButton
                  brand="facebook"
                  appearance="colorful"
                  size="small"
                  iconOnly
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook Vetpaws Hospital"
                />
                <SocialButton
                  brand="instagram"
                  appearance="colorful"
                  size="small"
                  iconOnly
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Vetpaws Hospital"
                />
                <SocialButton
                  brand="tiktok"
                  appearance="black"
                  size="small"
                  iconOnly
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok สาระความรู้สัตว์เลี้ยง"
                />
                <SocialButton
                  brand="whatsapp"
                  appearance="colorful"
                  size="small"
                  iconOnly
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp ฉุกเฉิน"
                />
                <SocialButton
                  brand="google"
                  appearance="white"
                  size="small"
                  iconOnly
                  href="https://google.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Google Business & Reviews"
                />
                <SocialButton
                  brand="apple"
                  appearance="black"
                  size="small"
                  iconOnly
                  href="https://apple.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Apple Maps & Wallet Pass"
                />
                <SocialButton
                  brand="discord"
                  appearance="colorful"
                  size="small"
                  iconOnly
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord Pet Community"
                />
                <SocialButton
                  brand="x"
                  appearance="black"
                  size="small"
                  iconOnly
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X Emergency Updates"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-caption-1-medium text-text-tertiary gap-4">
          <p>© 2026 VetPaws Hospital. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text-primary">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-text-primary">เงื่อนไขการใช้บริการ</a>
            <a href="#" className="hover:text-text-primary">สิทธิผู้ป่วยสัตว์เลี้ยง</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
