import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiHeartPulseFill } from '@remixicon/react';
import { AuthCard, type AuthMode } from '@/components/application/auth/auth-card';
import { Button } from '@/components/base/buttons/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [prevInitialMode, setPrevInitialMode] = useState<AuthMode>(initialMode);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
    setSuccessToast(null);
  }

  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap, initial focus, body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus first interactive element inside modal
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

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (formData: FormData) => {
    const email = (formData.get('email') as string) || 'petowner@example.com';
    const name = email.split('@')[0];
    const user = { name, email };

    setSuccessToast(
      mode === 'signin'
        ? `เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ ${name}`
        : `สร้างบัญชีสำเร็จ ยินดีต้อนรับเข้าสู่แม็กเหนือวินเหนือพิกโก้`
    );

    setTimeout(() => {
      onSuccess?.(user);
      onClose();
    }, 900);
  };

  const handleProvider = (provider: string) => {
    const user = { name: `${provider}_user`, email: `${provider}@example.com` };
    setSuccessToast(`เชื่อมต่อผ่าน ${provider} สำเร็จ`);
    setTimeout(() => {
      onSuccess?.(user);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-[440px] animate-boardui-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="small"
            iconOnly
            leadingIcon={RiCloseLine}
            onClick={onClose}
            aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
          />
        </div>

        {/* Success Feedback Overlay */}
        {successToast && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-background-primary-default/95 backdrop-blur-md p-6 text-center animate-fade-in">
            <div className="space-y-3">
              <div className="size-14 rounded-full bg-status-lime-background text-status-lime-text flex items-center justify-center mx-auto border border-border-button-default text-title-3-semibold">
                ✓
              </div>
              <h4 className="text-title-3-semibold text-text-primary">{successToast}</h4>
              <p className="text-caption-1-medium text-text-secondary">กำลังนำคุณเข้าสู่ระบบสมาชิก...</p>
            </div>
          </div>
        )}

        {/* Official BoardUI AuthCard */}
        <AuthCard
          mode={mode}
          layout="grid"
          providers={['google', 'apple', 'facebook', 'github', 'microsoft', 'x']}
          onSwitchMode={() => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
          onSubmit={handleSubmit}
          onProvider={handleProvider}
          logo={
            <div className="size-11 rounded-2xl bg-gradient-to-b from-accent-500 to-accent-600 flex items-center justify-center text-white shadow-xs mb-1">
              <RiHeartPulseFill className="size-6 text-white" />
            </div>
          }
          title={
            <span id="auth-modal-title">
              {mode === 'signin'
                ? 'ยินดีต้อนรับกลับสู่ แม็กเหนือวินเหนือพิกโก้'
                : 'สร้างบัญชีเจ้าของสัตว์เลี้ยง'}
            </span>
          }
          description={
            mode === 'signin'
              ? 'เข้าสู่ระบบเพื่อดูประวัติสุขภาพ นัดหมาย และผลการรักษาน้อง'
              : 'สมัครสมาชิกเพื่อบันทึกประวัติวัคซีนและรับการดูแล 24 ชม.'
          }
          className="shadow-2xl border-border-button-default"
          headingLevel={2}
        />
      </div>
    </div>
  );
};
