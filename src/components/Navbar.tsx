import React, { useState } from 'react';
import {
  RiHeartPulseFill,
  RiPhoneFill,
  RiCalendarEventLine,
  RiMenuLine,
  RiCloseLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiShieldCheckLine,
  RiLockPasswordLine,
} from '@remixicon/react';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { StatusDot } from '@/components/base/badges/status-dot';
import { Avatar } from '@/components/base/avatar/avatar';
import { ThemeToggle } from '@/components/application/theme/theme-toggle';

interface NavbarProps {
  onOpenBooking: (prefillPetType?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenPassport?: () => void;
  onOpenChangePassword?: () => void;
  currentUser?: { name: string; email: string } | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAuth,
  onOpenPassport,
  onOpenChangePassword,
  currentUser,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'ตามชนิดสัตว์', href: '#pet-treatments' },
    { label: 'ศูนย์การแพทย์', href: '#services' },
    { label: 'ทีมสัตวแพทย์', href: '#doctors' },
    { label: 'รีวิว', href: '#testimonials' },
    { label: 'คำถามที่พบบ่อย', href: '#faq' },
    { label: 'ที่ตั้งและเวลา', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-blue-900 text-white shadow-md border-b border-blue-950 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-2 sm:gap-2.5 min-w-0 group">
            <div className="size-9 sm:size-11 rounded-xl sm:rounded-2xl bg-gradient-to-b from-accent-500 to-accent-600 flex items-center justify-center text-white shadow-xs group-hover:opacity-95 transition-opacity shrink-0">
              <RiHeartPulseFill className="size-5 sm:size-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-headline-medium sm:text-title-3-semibold text-white tracking-tight truncate max-w-[155px] xs:max-w-[210px] sm:max-w-none">
                  VetPaws Hospital
                </span>
                <span className="hidden xs:inline-flex shrink-0 items-center gap-1 px-1.5 py-0.5 rounded-full bg-status-lime-background text-status-lime-text text-caption-2-bold whitespace-nowrap">
                  <StatusDot color="green" />
                  <span>24 ชม.</span>
                </span>
              </div>
              <p className="text-caption-2-regular sm:text-caption-1-medium text-text-secondary truncate hidden xs:block">
                VetPaws Animal Hospital
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-body-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools & Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Theme Toggle (Light / Dark switch) */}
            <ThemeToggle appearance="segmented" size="small" />

            {/* Auth Sign-in / User Profile with Protected Pet Passport */}
            {currentUser ? (
              <div className="flex items-center gap-2 shrink-0">
                {/* Pet Health Passport CTA (Visible only when logged in) */}
                <Button
                  variant="secondary"
                  size="small"
                  leadingIcon={RiShieldCheckLine}
                  onClick={onOpenPassport}
                  className="whitespace-nowrap shrink-0 border-accent-500/40 hover:border-accent-400"
                  title="สมุดวัคซีนและประวัติสุขภาพสัตว์เลี้ยงดิจิทัล"
                >
                  สมุดวัคซีน
                </Button>

                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-background-secondary-default border border-border-button-default shrink-0">
                  <button
                    type="button"
                    onClick={onOpenPassport}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
                    title="คลิกเพื่อเปิดสมุดสุขภาพสัตว์เลี้ยง"
                  >
                    <Avatar initials={currentUser.name.slice(0, 2).toUpperCase()} size="sm" />
                    <span className="text-caption-1-semibold text-text-primary hidden md:inline truncate max-w-28 whitespace-nowrap">
                      {currentUser.name}
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="xs"
                    iconOnly
                    leadingIcon={RiLockPasswordLine}
                    onClick={onOpenChangePassword}
                    title="เปลี่ยนรหัสผ่าน"
                    aria-label="เปลี่ยนรหัสผ่าน"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    iconOnly
                    leadingIcon={RiLogoutBoxRLine}
                    onClick={onSignOut}
                    title="ออกจากระบบ"
                    aria-label="ออกจากระบบ"
                  />
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="small"
                leadingIcon={RiUserLine}
                onClick={() => onOpenAuth('signin')}
                className="whitespace-nowrap shrink-0"
              >
                เข้าสู่ระบบ
              </Button>
            )}

            {/* 24/7 Hotline Button */}
            <ButtonLink
              href="tel:028889999"
              variant="danger"
              size="small"
              leadingIcon={RiPhoneFill}
              title="โทรฉุกเฉิน 24 ชั่วโมง"
              className="whitespace-nowrap shrink-0"
            >
              02-888-9999
            </ButtonLink>

            {/* Book Appointment CTA */}
            <Button
              variant="primary"
              size="small"
              leadingIcon={RiCalendarEventLine}
              onClick={() => onOpenBooking()}
              className="whitespace-nowrap shrink-0"
            >
              นัดหมายตรวจ
            </Button>
          </div>

          {/* Mobile Right Controls: Compact, No Overflow */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {currentUser && (
              <Button
                variant="secondary"
                size="small"
                iconOnly
                leadingIcon={RiShieldCheckLine}
                onClick={onOpenPassport}
                aria-label="สมุดวัคซีนดิจิทัล"
                title="สมุดวัคซีนดิจิทัล"
              />
            )}
            <ButtonLink
              href="tel:028889999"
              variant="danger"
              size="small"
              iconOnly
              leadingIcon={RiPhoneFill}
              aria-label="โทรฉุกเฉิน 24 ชั่วโมง"
            />
            <Button
              variant="secondary"
              size="small"
              iconOnly
              leadingIcon={mobileMenuOpen ? RiCloseLine : RiMenuLine}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="เมนูหลัก"
              aria-expanded={mobileMenuOpen}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-button-default bg-background-primary-default px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-background-secondary-default/50 border border-border-button-default">
            <span className="text-caption-1-medium text-text-secondary">ธีมการแสดงผล</span>
            <ThemeToggle appearance="segmented" size="small" />
          </div>

          {currentUser && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-background-secondary-default border border-border-button-default">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPassport?.();
                }}
                className="flex items-center gap-2.5 text-left cursor-pointer"
              >
                <Avatar initials={currentUser.name.slice(0, 2).toUpperCase()} size="sm" />
                <div>
                  <div className="text-caption-1-semibold text-text-primary font-bold">{currentUser.name}</div>
                  <div className="text-caption-2-medium text-text-secondary">{currentUser.email}</div>
                </div>
              </button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="xs"
                  iconOnly
                  leadingIcon={RiLockPasswordLine}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenChangePassword?.();
                  }}
                  title="เปลี่ยนรหัสผ่าน"
                  aria-label="เปลี่ยนรหัสผ่าน"
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onSignOut}
                >
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-body-medium text-text-primary hover:bg-background-secondary-default font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-border-button-default flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="secondary"
                size="medium"
                leadingIcon={RiShieldCheckLine}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPassport?.();
                }}
                className="w-full justify-center"
              >
                สมุดวัคซีน & ประวัติสุขภาพสัตว์เลี้ยง
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="medium"
                leadingIcon={RiUserLine}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="w-full justify-center"
              >
                เข้าสู่ระบบ / ลงทะเบียนเจ้าของสัตว์เลี้ยง
              </Button>
            )}
            <Button
              variant="primary"
              size="medium"
              leadingIcon={RiCalendarEventLine}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full justify-center"
            >
              นัดหมายตรวจล่วงหน้า
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
