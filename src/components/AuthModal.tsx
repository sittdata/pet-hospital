import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RiCloseLine, RiHeartPulseFill, RiSparklingFill } from '@remixicon/react';
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
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearPendingTimers();
    setSuccessToast(null);
    setErrorToast(null);
    setMode(initialMode);
    onClose();
  }, [clearPendingTimers, initialMode, onClose]);

  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
    setSuccessToast(null);
    setErrorToast(null);
  }

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setSuccessToast(null);
      setErrorToast(null);
      setMode(initialMode);
    }
  }

  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Clear timers on unmount or when modal is closed
  useEffect(() => {
    if (!isOpen) {
      clearPendingTimers();
    }
    return () => {
      clearPendingTimers();
    };
  }, [isOpen, clearPendingTimers]);

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
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs.length > 0 && dialogs[dialogs.length - 1] !== modalRef.current) {
        return;
      }

      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
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
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = (formData: FormData) => {
    if (successToast || errorToast) return;

    const rawEmail = (formData.get('email') as string) || '';
    const email = rawEmail.trim() || 'demo@vetpaws.com';

    if (mode === 'forgot-password') {
      clearPendingTimers();
      setSuccessToast(`ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} เรียบร้อยแล้ว`);
      timerRef.current = setTimeout(() => {
        setMode('signin');
        setSuccessToast(null);
        timerRef.current = null;
      }, 1800);
      return;
    }

    if (mode === 'signup') {
      const password = (formData.get('password') as string) || '';
      const confirmPassword = (formData.get('confirmPassword') as string) || '';
      if (password && confirmPassword && password !== confirmPassword) {
        clearPendingTimers();
        setErrorToast('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
        timerRef.current = setTimeout(() => {
          setErrorToast(null);
          timerRef.current = null;
        }, 2200);
        return;
      }
    }

    const enteredName = ((formData.get('name') as string) || '').trim();
    const isDemo = email.toLowerCase() === 'demo@vetpaws.com';
    const name = enteredName || (isDemo ? 'คุณศิษฐิวัชร์' : (email.includes('@') ? email.split('@')[0] : email));
    const user = { name, email };

    setSuccessToast(
      mode === 'signin'
        ? `เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ ${name}`
        : `สร้างบัญชีสำเร็จ ยินดีต้อนรับเข้าสู่ VetPaws Hospital`
    );

    clearPendingTimers();
    timerRef.current = setTimeout(() => {
      onSuccess?.(user);
      onClose();
      timerRef.current = null;
    }, 700);
  };

  const handleProvider = (provider: string) => {
    if (successToast) return;
    const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
    const user = { name: `คุณผู้ใช้งาน (${capitalizedProvider})`, email: `${provider}@vetpaws.com` };
    setSuccessToast(`เชื่อมต่อผ่าน ${provider} สำเร็จ`);
    clearPendingTimers();
    timerRef.current = setTimeout(() => {
      onSuccess?.(user);
      onClose();
      timerRef.current = null;
    }, 700);
  };

  const handleQuickDemoLogin = () => {
    if (successToast) return;
    const user = { name: 'คุณศิษฐิวัชร์ (เจ้าของน้องโมจิ)', email: 'demo@vetpaws.com' };
    setSuccessToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณศิษฐิวัชร์');
    clearPendingTimers();
    timerRef.current = setTimeout(() => {
      onSuccess?.(user);
      onClose();
      timerRef.current = null;
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-[400px] animate-boardui-modal mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="small"
            iconOnly
            leadingIcon={RiCloseLine}
            onClick={handleClose}
            aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
          />
        </div>

        {/* Success Feedback Overlay */}
        {successToast && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-background-primary-default/95 backdrop-blur-md p-6 text-center animate-fade-in"
          >
            <div className="space-y-3">
              <div className="size-14 rounded-full bg-status-lime-background text-status-lime-text flex items-center justify-center mx-auto border border-border-button-default text-title-3-semibold">
                ✓
              </div>
              <h4 className="text-title-3-semibold text-text-primary">{successToast}</h4>
              <p className="text-caption-1-medium text-text-secondary">
                {mode === 'forgot-password'
                  ? 'โปรดตรวจสอบกล่องจดหมายของคุณ และทำตามขั้นตอนในอีเมล'
                  : 'กำลังเชื่อมต่อข้อมูลและนำคุณเข้าสู่ระบบ...'}
              </p>
            </div>
          </div>
        )}

        {/* Error Feedback Overlay */}
        {errorToast && (
          <div
            role="alert"
            aria-live="assertive"
            className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-background-primary-default/95 backdrop-blur-md p-6 text-center animate-fade-in"
          >
            <div className="space-y-3">
              <div className="size-14 rounded-full bg-status-rose-background text-status-rose-text flex items-center justify-center mx-auto border border-border-button-default text-title-3-semibold">
                ✕
              </div>
              <h4 className="text-title-3-semibold text-text-primary">{errorToast}</h4>
              <p className="text-caption-1-medium text-text-secondary">
                กรุณาตรวจสอบและกรอกรหัสผ่านทั้งสองช่องให้ตรงกัน
              </p>
            </div>
          </div>
        )}

        {/* Official BoardUI AuthCard */}
        <AuthCard
          mode={mode}
          confirmPassword={mode === 'signup'}
          layout="grid"
          providers={['google', 'apple', 'facebook', 'github', 'microsoft', 'x']}
          onSwitchMode={() => {
            clearPendingTimers();
            setSuccessToast(null);
            setErrorToast(null);
            setMode((prev) => (prev === 'forgot-password' ? 'signin' : prev === 'signin' ? 'signup' : 'signin'));
          }}
          onForgotPassword={() => {
            clearPendingTimers();
            setSuccessToast(null);
            setErrorToast(null);
            setMode('forgot-password');
          }}
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
                ? 'ยินดีต้อนรับกลับสู่ VetPaws Hospital'
                : mode === 'signup'
                ? 'สร้างบัญชีเจ้าของสัตว์เลี้ยง'
                : mode === 'forgot-password'
                ? 'รีเซ็ตรหัสผ่าน'
                : 'ยืนยันรหัส OTP'}
            </span>
          }
          description={
            mode === 'signin'
              ? 'เข้าสู่ระบบเพื่อดูประวัติสุขภาพ นัดหมาย และผลการรักษาน้อง'
              : mode === 'signup'
              ? 'สมัครสมาชิกเพื่อบันทึกประวัติวัคซีนและรับการดูแล 24 ชม.'
              : mode === 'forgot-password'
              ? 'กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่'
              : 'กรอกรหัสที่ได้รับเพื่อยืนยันตัวตน'
          }
          cta={
            mode === 'forgot-password'
              ? 'ส่งลิงก์รีเซ็ตรหัสผ่าน'
              : mode === 'signup'
              ? 'สร้างบัญชี'
              : 'เข้าสู่ระบบ'
          }
          className="w-full max-w-full shadow-2xl border-border-button-default"
          headingLevel={2}
        />

        {/* Presentation Demo Account Helper Card */}
        {mode === 'signin' && (
          <div className="mt-2.5 p-3 rounded-2xl bg-background-primary-default dark:bg-background-secondary-default border border-border-button-default shadow-lg flex items-center justify-between gap-3 animate-fade-in w-full">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <RiSparklingFill className="size-3.5 text-accent-500 shrink-0" />
                <span className="text-caption-1-semibold text-text-primary truncate">บัญชีทดสอบสำหรับนำเสนอ</span>
              </div>
              <p className="text-caption-2-regular text-text-secondary truncate mt-0.5">
                demo@vetpaws.com • รหัสผ่าน: demo1234
              </p>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={handleQuickDemoLogin}
              className="shrink-0"
            >
              ล็อกอินด่วน
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
