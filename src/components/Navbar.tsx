import React, { useState } from 'react';
import {
  RiHeartPulseFill,
  RiPhoneFill,
  RiCalendarEventLine,
  RiMenuLine,
  RiCloseLine,
  RiUserLine,
  RiLogoutBoxRLine,
} from '@remixicon/react';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { StatusDot } from '@/components/base/badges/status-dot';
import { Avatar } from '@/components/base/avatar/avatar';
import { ThemeToggle } from '@/components/application/theme/theme-toggle';

interface NavbarProps {
  onOpenBooking: (prefillPetType?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentUser?: { name: string; email: string } | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAuth,
  currentUser,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'ศูนย์การแพทย์', href: '#services' },
    { label: 'ตามชนิดสัตว์', href: '#pet-treatments' },
    { label: 'คำถามที่พบบ่อย', href: '#faq' },
    { label: 'ที่ตั้งและเวลา', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background-primary-default/90 backdrop-blur-md border-b border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="size-11 rounded-2xl bg-gradient-to-b from-accent-500 to-accent-600 flex items-center justify-center text-white shadow-xs group-hover:opacity-95 transition-opacity shrink-0">
              <RiHeartPulseFill className="size-6 text-white" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-title-3-semibold text-text-primary tracking-tight whitespace-nowrap">
                  แม็กเหนือวินเหนือพิกโก้
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-full bg-status-lime-background text-status-lime-text text-caption-2-bold whitespace-nowrap">
                  <StatusDot color="green" />
                  <span>24 ชม.</span>
                </span>
              </div>
              <p className="text-caption-1-medium text-text-secondary whitespace-nowrap">Arak Care Animal Hospital</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-body-medium text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools & Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Theme Toggle (Light / Dark switch) */}
            <ThemeToggle appearance="segmented" size="small" />

            {/* Auth Sign-in / User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-background-secondary-default border border-border-button-default shrink-0">
                <Avatar initials={currentUser.name.slice(0, 2).toUpperCase()} size="sm" />
                <span className="text-caption-1-semibold text-text-primary hidden md:inline truncate max-w-28 whitespace-nowrap">
                  {currentUser.name}
                </span>
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

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle appearance="segmented" size="small" />
            <Button
              variant="ghost"
              size="small"
              iconOnly
              leadingIcon={RiUserLine}
              onClick={() => onOpenAuth('signin')}
              aria-label="เข้าสู่ระบบ"
            />
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
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-button-default bg-background-primary-default px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          {currentUser && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-background-secondary-default border border-border-button-default">
              <div className="flex items-center gap-2.5">
                <Avatar initials={currentUser.name.slice(0, 2).toUpperCase()} size="sm" />
                <div>
                  <div className="text-caption-1-semibold text-text-primary font-bold">{currentUser.name}</div>
                  <div className="text-caption-2-medium text-text-secondary">{currentUser.email}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={onSignOut}
              >
                ออกจากระบบ
              </Button>
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
            {!currentUser && (
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
