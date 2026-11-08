import React, { useState, useEffect, useRef } from 'react';
import {
  RiCloseLine,
  RiCheckLine,
  RiLockPasswordLine,
  RiLockLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { name: string; email: string } | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap, initial focus, body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusableElements = Array.from(
          modalRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!modalRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
          return;
        }

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('กรุณาระบุรหัสผ่านปัจจุบัน');
      return;
    }
    if (newPassword.length < 6) {
      setError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-background-primary-default border border-border-button-default rounded-3xl shadow-2xl overflow-hidden animate-scale-up relative"
      >
        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background-primary-default/95 backdrop-blur-xs p-6 text-center animate-fade-in space-y-3">
            <div className="size-14 rounded-full bg-status-lime-background text-status-lime-text flex items-center justify-center text-title-3-semibold border border-status-lime-border">
              <RiCheckLine className="size-7" />
            </div>
            <h4 className="text-title-3-semibold text-text-primary">
              เปลี่ยนรหัสผ่านสำเร็จ
            </h4>
            <p className="text-body-regular text-text-secondary">
              รหัสผ่านใหม่ของคุณได้รับการอัปเดตเรียบร้อยแล้ว
            </p>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-button-default bg-background-secondary-default/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-accent-500/15 text-accent-700 dark:text-accent-300 flex items-center justify-center">
              <RiLockLine className="size-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h3
                id="change-password-title"
                className="text-body-2-semibold text-text-primary"
              >
                เปลี่ยนรหัสผ่านบัญชี
              </h3>
              <p className="text-caption-2-regular text-text-secondary truncate max-w-[220px]">
                {currentUser?.email || 'บัญชีสมาชิก VetPaws'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-background-secondary-default transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่างเปลี่ยนรหัสผ่าน"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-status-rose-background text-status-rose-text text-caption-1-medium border border-border-button-default">
              {error}
            </div>
          )}

          <div>
            <label className="block text-caption-2-medium text-text-secondary mb-1">
              รหัสผ่านปัจจุบัน *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="ระบุรหัสผ่านปัจจุบัน (เช่น demo1234)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
            />
          </div>

          <div>
            <label className="block text-caption-2-medium text-text-secondary mb-1">
              รหัสผ่านใหม่ *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
            />
          </div>

          <div>
            <label className="block text-caption-2-medium text-text-secondary mb-1">
              ยืนยันรหัสผ่านใหม่ *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary-default border border-border-button-default text-body-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-button-default">
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={onClose}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="small"
              leadingIcon={RiLockPasswordLine}
            >
              บันทึกรหัสผ่านใหม่
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
