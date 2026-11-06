import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cx } from '@/utils/cx';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badge';
import { ComposerLoader } from '@/components/application/composer-loader/composer-loader';
import {
  RiSparklingLine,
  RiHeartPulseLine,
  RiStethoscopeLine,
  RiShieldCrossLine,
  RiCalendarCheckLine,
  RiPhoneLine,
  RiArrowUpLine,
  RiAttachment2,
  RiAlertLine,
  RiCheckLine,
  RiUserHeartLine,
  RiRefreshLine,
} from '@remixicon/react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'doctor';
  senderName?: string;
  timestamp: string;
  text: string;
  isTriageCard?: boolean;
}

export interface CustomerChatPhoneMockupProps {
  onOpenBooking?: (serviceName?: string) => void;
  className?: string;
}

const SUGGESTIONS = [
  'สุนัขอาเจียนฟองขาว ซึม ไม่กินข้าว',
  'แมวมีไข้ จาม หายใจมีเสียงวี้ด',
  'ลูกสุนัขเผลอกลืนสิ่งแปลกปลอม',
  'สัตว์เลี้ยงหน้าบวมฉับพลันจากแมลงกัด',
];

const DEMO_USER_PROMPT = 'สวัสดีครับ สุนัขพันธุ์ชิบะ อายุ 2 ปี มีอาการอาเจียนเป็นฟองสีขาว ซึม ไม่ยอมแตะอาหารตั้งแต่เช้า อันตรายไหมครับ?';
const DEMO_AI_REPLY = 'สวัสดีครับคุณเจ้าของ ขณะนี้ระบบ AI ได้รับข้อมูลแล้ว เนื่องจากขณะนี้มีผู้ติดต่อจำนวนมาก ระบบขอประเมินอาการเบื้องต้นให้ระหว่างรอทีมสัตวแพทย์เข้ามาตอบข้อความสักครู่นะครับ';
const DEMO_DOCTOR_REPLY = 'สวัสดีค่ะคุณเจ้าของ หมอสุภัทรานะคะ จากอาการที่แจ้ง หมอแนะนำให้งดน้ำและอาหารก่อนตามที่ระบบประเมินเลยนะคะ เดี๋ยวหมอจะเปิดคิวห้องตรวจด่วนรอรับน้องไว้ให้เลยค่ะ คุณเจ้าของสะดวกพาน้องเข้ามาตรวจที่สาขาไหนคะ?';

const EASE_SPRING = [0.16, 1, 0.3, 1] as const;

export function CustomerChatPhoneMockup({
  onOpenBooking,
  className,
}: CustomerChatPhoneMockupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState('ระบบกำลังประเมิน...');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Run showcase typing demo on infinite loop with realistic Human-in-the-loop handoff
  const startDemoSimulation = () => {
    clearAllTimeouts();
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
    setIsDemoRunning(true);

    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < DEMO_USER_PROMPT.length) {
        setInputValue(DEMO_USER_PROMPT.slice(0, charIndex + 1));
        charIndex++;
        const t = window.setTimeout(typeNextChar, 24);
        timeoutsRef.current.push(t);
      } else {
        // Finished typing user prompt -> trigger simulated send
        const t1 = window.setTimeout(() => {
          setInputValue('');
          setMessages([
            {
              id: 'demo-user-1',
              sender: 'user',
              timestamp: '9:38',
              text: DEMO_USER_PROMPT,
            },
          ]);

          // Step 1: AI auto-responder typing indicator
          const t2 = window.setTimeout(() => {
            setTypingLabel('ระบบอัตโนมัติกำลังประเมินเบื้องต้น...');
            setIsTyping(true);

            // Step 2: AI triage holding response arrives
            const t3 = window.setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: 'demo-ai-1',
                  sender: 'assistant',
                  senderName: 'ระบบ AI คัดกรองอัตโนมัติ',
                  timestamp: '9:38',
                  text: DEMO_AI_REPLY,
                  isTriageCard: true,
                },
              ]);

              // Step 3: Real Vet doctor joins & starts typing
              const t4 = window.setTimeout(() => {
                setTypingLabel('พญ. สุภัทรา (สัตวแพทย์เวร) กำลังพิมพ์ตอบกลับ...');
                setIsTyping(true);

                // Step 4: Real Vet doctor sends personal response!
                const t5 = window.setTimeout(() => {
                  setIsTyping(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: 'demo-doc-1',
                      sender: 'doctor',
                      senderName: 'พญ. สุภัทรา (สัตวแพทย์เวรประจำการ)',
                      timestamp: '9:39',
                      text: DEMO_DOCTOR_REPLY,
                    },
                  ]);
                  setIsDemoRunning(false);

                  // Finished -> wait 5.5 seconds to let visitors read full real conversation -> restart
                  const loopTimeout = window.setTimeout(() => {
                    startDemoSimulation();
                  }, 5500);
                  timeoutsRef.current.push(loopTimeout);
                }, 2200);
                timeoutsRef.current.push(t5);
              }, 1200);
              timeoutsRef.current.push(t4);
            }, 1400);
            timeoutsRef.current.push(t3);
          }, 500);
          timeoutsRef.current.push(t2);
        }, 500);
        timeoutsRef.current.push(t1);
      }
    };

    // Pause 1.4s at empty recommendation state before typing starts
    const initialDelay = window.setTimeout(typeNextChar, 1400);
    timeoutsRef.current.push(initialDelay);
  };

  useEffect(() => {
    startDemoSimulation();
    return () => clearAllTimeouts();
  }, []);

  return (
    <div className={cx('relative mx-auto w-full max-w-[330px] select-none', className)}>
      {/* =========================================================================
          Desert Titanium Hardware Outer Frame & Physical Side Buttons (Image 1)
          ========================================================================= */}
      {/* Left: Action Button */}
      <span className="absolute -left-[3px] top-[92px] h-6 w-[3px] rounded-l-xs bg-gradient-to-r from-[#9b5c36] to-[#d68f61] shadow-xs" />
      {/* Left: Volume Up Button */}
      <span className="absolute -left-[3px] top-[124px] h-10 w-[3px] rounded-l-xs bg-gradient-to-r from-[#9b5c36] to-[#d68f61] shadow-xs" />
      {/* Left: Volume Down Button */}
      <span className="absolute -left-[3px] top-[172px] h-10 w-[3px] rounded-l-xs bg-gradient-to-r from-[#9b5c36] to-[#d68f61] shadow-xs" />

      {/* Right: Side / Power Button */}
      <span className="absolute -right-[3px] top-[132px] h-14 w-[3px] rounded-r-xs bg-gradient-to-l from-[#9b5c36] to-[#d68f61] shadow-xs" />
      {/* Right: Camera Control Button */}
      <span className="absolute -right-[3px] top-[385px] h-11 w-[3px] rounded-r-xs bg-gradient-to-l from-[#9b5c36] to-[#d68f61] shadow-xs" />

      {/* Titanium Outer Edge Shell */}
      <div className="relative h-[680px] w-full rounded-[48px] p-[3px] bg-gradient-to-b from-[#e39c6e] via-[#ba7347] to-[#824b2b] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(186,115,71,0.4)]">
        {/* Inner Black Bezel (Ultra Slim Display Border) */}
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[45px] bg-black p-[2.5px]">
          {/* Main OLED Screen Surface */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[42px] bg-background-full">
            
            {/* =====================================================================
                iOS Top Status Bar & Dynamic Island (Native White/App matching)
                ===================================================================== */}
            <div className="relative h-[42px] w-full shrink-0 bg-background-primary-default px-6 pt-1 flex items-center justify-between text-text-primary z-40">
              {/* Left: Time "9:41" */}
              <div className="w-12">
                <span className="text-[13.5px] font-semibold tracking-tight text-text-primary select-none">
                  9:41
                </span>
              </div>

              {/* Center: Dynamic Island Pill (Black floating pill with subtle border) */}
              <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full ring-1 ring-black/10 shadow-sm flex items-center justify-between px-2.5 pointer-events-none">
                {/* Front camera lens & TrueDepth sensor elements */}
                <div className="size-2.5 rounded-full bg-neutral-950 ring-1 ring-neutral-800 flex items-center justify-center">
                  <div className="size-1 rounded-full bg-blue-950/60" />
                </div>
                <div className="size-2 rounded-full bg-neutral-950" />
              </div>

              {/* Right: Signal, Wi-Fi, and Battery */}
              <div className="flex items-center gap-1.5 w-12 justify-end text-text-primary">
                {/* Cellular 4-bar indicator */}
                <svg className="w-3.5 h-2.5 fill-current text-text-primary shrink-0" viewBox="0 0 17 12">
                  <rect x="0" y="8.5" width="2.8" height="3.5" rx="0.5" />
                  <rect x="4.5" y="6" width="2.8" height="6" rx="0.5" />
                  <rect x="9" y="3" width="2.8" height="9" rx="0.5" />
                  <rect x="13.5" y="0" width="2.8" height="12" rx="0.5" />
                </svg>

                {/* Wi-Fi 3-bar waves */}
                <svg className="w-3.5 h-2.5 fill-current text-text-primary shrink-0" viewBox="0 0 16 12">
                  <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.24-2.83a6 6 0 018.48 0 .8.8 0 001.13-1.13 7.6 7.6 0 00-10.74 0 .8.8 0 001.13 1.13zm-2.83-2.83a10 10 0 0114.14 0 .8.8 0 101.13-1.13 11.6 11.6 0 00-16.4 0 .8.8 0 001.13 1.13z" />
                </svg>

                {/* Battery capsule with full fill and tip nub */}
                <div className="flex items-center shrink-0">
                  <div className="w-[18px] h-[9.5px] rounded-[3px] border border-text-primary p-[1px] flex items-center">
                    <div className="h-full w-full bg-text-primary rounded-[1px]" />
                  </div>
                  <div className="w-[1px] h-[3.5px] bg-text-primary rounded-r-xs -ms-px" />
                </div>
              </div>
            </div>

            {/* Chat Navigation Header (Real Medical Team 24/7) */}
            <div className="px-3 py-2 border-b border-border-button-default bg-background-primary-default/95 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src="/images/vets/vet_female_cat.jpg"
                    alt="พญ. สุภัทรา สัตวแพทย์เวร"
                    className="size-8 rounded-full object-cover ring-1.5 ring-emerald-500/40 shadow-2xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background-primary-default" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[12px] font-semibold text-text-primary whitespace-nowrap">
                      ศูนย์เวชศาสตร์ฉุกเฉิน
                    </span>
                    <Badge color="primary" className="text-[9px] py-0 px-1 shrink-0 whitespace-nowrap">
                      24 ชม.
                    </Badge>
                  </div>
                  <span className="text-[10px] text-text-secondary flex items-center gap-1 truncate">
                    {isTyping ? (
                      <span className="text-accent-600 dark:text-accent-400 font-medium animate-pulse truncate">
                        {typingLabel}
                      </span>
                    ) : (
                      <>
                        <RiShieldCrossLine className="size-2.5 text-emerald-500 shrink-0" />
                        <span className="truncate">ทีมสัตวแพทย์เวรประจำการ</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={startDemoSimulation}
                  title="เล่นการจำลองแชทซ้ำ"
                  className="flex size-6 items-center justify-center rounded-full text-foreground-icon-secondary hover:text-foreground-icon-primary hover:bg-background-secondary-default transition-colors"
                >
                  <RiRefreshLine className={cx('size-3.5', isDemoRunning && 'animate-spin')} />
                </button>
                <ButtonLink
                  href="tel:028889999"
                  variant="danger"
                  size="xs"
                  leadingIcon={RiPhoneLine}
                  className="rounded-full px-2 py-1 text-[11px]"
                  title="โทรหาสัตวแพทย์ฉุกเฉิน"
                >
                  โทรด่วน
                </ButtonLink>
              </div>
            </div>

            {/* Chat Messages Feed with Spring Motion */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2.5 text-caption-1-regular scroll-smooth flex flex-col"
            >
              <AnimatePresence mode="wait">
                {/* =============================================================
                    Empty State / Recommendation Pills (BoardUI Style Showcase)
                    Shown before conversation starts
                    ============================================================= */}
                {messages.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: EASE_SPRING }}
                    className="my-auto flex flex-col items-center gap-3 text-center px-2 py-4"
                  >
                    <div className="flex flex-col gap-1 items-center">
                      <div className="size-9 rounded-2xl bg-accent-500/10 text-accent-600 flex items-center justify-center mb-0.5">
                        <RiUserHeartLine className="size-4.5" />
                      </div>
                      <h2 className="text-title-3-semibold text-text-primary tracking-tight">
                        ปรึกษาอาการสัตว์เลี้ยง 24 ชม.
                      </h2>
                      <p className="text-[11px] text-text-secondary max-w-[260px] leading-relaxed">
                        ระบบ AI ช่วยบันทึกอาการเบื้องต้น เพื่อส่งต่อให้ทีมสัตวแพทย์เวรตอบกลับจริงทันที
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 pt-1 w-full max-w-[270px]">
                      {SUGGESTIONS.map((suggestion, index) => (
                        <div
                          key={suggestion}
                          className={cx(
                            "w-full rounded-full border px-3 py-1.5 text-[11px] text-text-secondary shadow-2xs transition-colors text-center",
                            index === 0
                              ? "bg-accent-500/10 border-accent-500/30 text-accent-700 dark:text-accent-300 font-medium"
                              : "bg-background-primary-default border-border-button-default"
                          )}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div key="messages-list" className="space-y-2.5">
                    <div className="text-center my-1">
                      <span className="text-[10px] text-text-tertiary bg-background-secondary-default/80 px-2 py-0.5 rounded-full">
                        วันนี้ • มีสัตวแพทย์เวรประจำการ 24 ชม.
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          layout
                          initial={{ opacity: 0, y: 14, scale: 0.94, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                          transition={{ duration: 0.35, ease: EASE_SPRING }}
                          className={cx(
                            'flex flex-col max-w-[92%]',
                            msg.sender === 'user' ? 'ms-auto items-end' : 'me-auto items-start'
                          )}
                        >
                          {msg.sender === 'user' ? (
                            <div className="bg-button-primary text-white px-3 py-2 rounded-2xl rounded-tr-xs shadow-xs text-caption-1-regular leading-relaxed">
                              {msg.text}
                            </div>
                          ) : msg.sender === 'doctor' ? (
                            /* Doctor Real Response Bubble */
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 ps-0.5">
                                <img
                                  src="/images/vets/vet_female_cat.jpg"
                                  alt="พญ. สุภัทรา"
                                  className="size-4 rounded-full object-cover ring-1 ring-emerald-500/40"
                                />
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  {msg.senderName}
                                </span>
                              </div>
                              <div className="bg-emerald-500/10 border border-emerald-500/25 text-text-primary px-3 py-2 rounded-2xl rounded-tl-xs text-caption-1-regular leading-relaxed">
                                {msg.text}
                              </div>
                            </div>
                          ) : (
                            /* Automated AI Triage Holding Message */
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1 ps-1 text-[10px] text-text-tertiary">
                                <RiSparklingLine className="size-3 text-accent-500" />
                                <span>{msg.senderName}</span>
                              </div>
                              <div className="bg-background-secondary-default border border-border-button-default text-text-primary px-3 py-2 rounded-2xl rounded-tl-xs text-caption-1-regular leading-relaxed">
                                {msg.text}
                              </div>

                              {/* Triage Recommendation Card */}
                              {msg.isTriageCard && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ duration: 0.4, delay: 0.2, ease: EASE_SPRING }}
                                  className="bg-background-primary-default border border-border-button-default rounded-2xl p-2.5 shadow-md space-y-2"
                                >
                                  {/* Urgency Badge */}
                                  <div className="flex items-center justify-between gap-2 border-b border-separator-border pb-1.5">
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <RiAlertLine className="size-3.5 text-amber-500 shrink-0" />
                                      <span className="text-[11px] font-semibold text-text-primary">
                                        ผลประเมินด่วน
                                      </span>
                                    </div>
                                    <span className="inline-flex items-center shrink-0 whitespace-nowrap rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                      เฝ้าระวัง (Yellow Alert)
                                    </span>
                                  </div>

                                  {/* Suspected Diagnoses */}
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] text-text-tertiary">
                                      ข้อสันนิษฐานอาการ:
                                    </span>
                                    <ul className="text-[11px] text-text-secondary space-y-0.5 ps-0.5">
                                      <li className="flex items-start gap-1">
                                        <RiHeartPulseLine className="size-3 text-accent-500 shrink-0 mt-0.5" />
                                        <span>กระเพาะอาหารอักเสบเฉียบพลัน (Gastritis)</span>
                                      </li>
                                      <li className="flex items-start gap-1">
                                        <RiStethoscopeLine className="size-3 text-accent-500 shrink-0 mt-0.5" />
                                        <span>สงสัยการกลืนสิ่งแปลกปลอม (Foreign Body)</span>
                                      </li>
                                    </ul>
                                  </div>

                                  {/* Care Instructions */}
                                  <div className="bg-background-secondary-default rounded-xl p-2 border border-separator-border space-y-0.5">
                                    <span className="text-[11px] text-text-primary font-medium flex items-center gap-1">
                                      <RiCheckLine className="size-3 text-emerald-500" />
                                      คำแนะนำปฐมพยาบาลเบื้องต้น:
                                    </span>
                                    <p className="text-[10.5px] text-text-secondary leading-snug">
                                      • งดอาหารและน้ำ 2 ชม. ป้องกันอาการสำลัก
                                      <br />
                                      • ตรวจดูเยื่อเมือกเหงือก ต้องไม่ซีดหรือขาว
                                      <br />• แพทย์เวรเตรียมเปิดคิวตรวจด่วนให้ทันที
                                    </p>
                                  </div>

                                  {/* Action Buttons inside Triage Card */}
                                  <div className="pt-0.5 flex flex-col gap-1">
                                    <Button
                                      variant="primary"
                                      size="xs"
                                      leadingIcon={RiCalendarCheckLine}
                                      onClick={() =>
                                        onOpenBooking?.('บริการตรวจวินิจฉัยและรักษาอายุรกรรม')
                                      }
                                      className="w-full justify-center text-[11px] py-1"
                                    >
                                      จองคิวตรวจสัตวแพทย์ด่วน
                                    </Button>
                                    <ButtonLink
                                      href="tel:028889999"
                                      variant="secondary"
                                      size="xs"
                                      leadingIcon={RiPhoneLine}
                                      className="w-full justify-center text-[11px] py-1 text-status-rose-text"
                                    >
                                      สายด่วนฉุกเฉิน 24 ชม.
                                    </ButtonLink>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                          <span className="text-[9px] text-text-tertiary mt-0.5 px-1">{msg.timestamp}</span>
                        </motion.div>
                      ))}

                      {/* Typing Indicator Bubble with Staggered Bouncing Dots */}
                      {isTyping && (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 8, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.92 }}
                          transition={{ duration: 0.25, ease: EASE_SPRING }}
                          className="me-auto flex items-center gap-1.5 bg-background-secondary-default border border-border-button-default px-3 py-1.5 rounded-2xl rounded-tl-xs shadow-xs"
                        >
                          <span className="text-[11px] text-text-secondary">{typingLabel}</span>
                          <div className="flex items-center gap-1 ps-0.5">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="size-1.5 rounded-full bg-accent-500"
                                animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: i * 0.15,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* BoardUI Inspired Chat Composer (Showcase Only - ReadOnly) */}
            <div className="p-2.5 bg-background-primary-default border-t border-border-button-default shrink-0">
              <ComposerLoader active={isTyping || isDemoRunning}>
                <div
                  className="flex h-[38px] w-full items-center gap-1.5 rounded-full p-1 bg-background-secondary-default border border-border-button-default"
                >
                  <div
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-foreground-icon-secondary"
                  >
                    <RiAttachment2 className="size-3.5" />
                  </div>

                  <input
                    type="text"
                    value={inputValue}
                    readOnly
                    placeholder="พิมพ์สอบถามอาการสัตว์เลี้ยง..."
                    className="h-full min-w-0 flex-1 bg-transparent text-[11.5px] text-text-primary placeholder:text-text-tertiary outline-none select-none cursor-default"
                  />

                  <div
                    className={cx(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-white transition-opacity",
                      inputValue.trim().length > 0 ? "bg-button-primary opacity-100" : "bg-neutral-300 dark:bg-neutral-700 opacity-50"
                    )}
                  >
                    <RiArrowUpLine className="size-3.5" />
                  </div>
                </div>
              </ComposerLoader>
            </div>

            {/* iPhone Home Indicator Bar */}
            <div className="py-1.5 bg-background-primary-default flex justify-center shrink-0">
              <div className="w-24 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
