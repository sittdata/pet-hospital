import React, { useState, useRef, useEffect } from 'react';
import {
  RiCloseLine,
  RiSendPlane2Fill,
  RiPhoneFill,
  RiAlertFill,
  RiCheckLine,
  RiCalendarCheckLine,
  RiSparklingFill,
  RiHeartPulseFill,
  RiStethoscopeFill,
} from '@remixicon/react';
import { StatusDot } from '@/components/base/badges/status-dot';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'doctor';
  senderName?: string;
  text: string;
  timestamp: string;
  triageLevel?: 'green' | 'yellow' | 'red';
  triageDetails?: {
    alertTitle: string;
    suspectedConditions: string[];
    firstAidInstructions: string[];
    recommendedService: string;
  };
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (serviceName?: string, doctorName?: string) => void;
}

const QUICK_SUGGESTIONS = [
  'แมวซึม ไม่กินอาหาร มีอาการอาเจียน',
  'สุนัขกลืนสิ่งแปลกปลอม ไอ หายใจลำบาก',
  'ปัสสาวะไม่ออก ฉี่กะปริบกะปรอย ร้องปวด',
  'กระต่ายท้องอืด ไม่กินหญ้า ไม่อึ',
  'สอบถามแพ็กเกจวัคซีนและตรวจสุขภาพ',
];

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      senderName: 'ระบบคัดกรองเวชศาสตร์ฉุกเฉิน (AI Triage)',
      text: 'สวัสดีครับคุณเจ้าของ ยินดีต้อนรับสู่ศูนย์บริการการแพทย์และฉุกเฉิน VetPaws 24 ชม. สามารถพิมพ์แจ้งอาการสัตว์เลี้ยง หรือเลือกอาการด่วนด้านล่างเพื่อเริ่มการประเมินเบื้องต้นได้ทันทีครับ',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('ทีมสัตวแพทย์กำลังประเมินอาการ...');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const analyzeTriage = (query: string): {
    level: 'red' | 'yellow' | 'green';
    alertTitle: string;
    suspectedConditions: string[];
    firstAidInstructions: string[];
    recommendedService: string;
    doctorReply: string;
  } => {
    const lower = query.toLowerCase();

    // 🔴 Critical Red Alert Emergency Keywords
    if (
      lower.includes('ไม่หายใจ') ||
      lower.includes('หยุดหายใจ') ||
      lower.includes('ช็อก') ||
      lower.includes('ฉี่ไม่ออก') ||
      lower.includes('ปัสสาวะไม่ออก') ||
      lower.includes('กระเพาะบิด') ||
      lower.includes('ชัก') ||
      lower.includes('รถชน') ||
      lower.includes('ตกตึก') ||
      lower.includes('เลือดไหลไม่หยุด') ||
      lower.includes('หมดสติ') ||
      lower.includes('ลิ้นม่วง') ||
      lower.includes('ซีดขาว')
    ) {
      return {
        level: 'red',
        alertTitle: 'วิกฤตฉุกเฉิน (Red Alert 🚨)',
        suspectedConditions: [
          'ภาวะทางเดินปัสสาวะอุดตันเฉียบพลัน / ภาวะกระเพาะขยายและบิดหมุน (GDV)',
          'ภาวะวิกฤตระบบทางเดินหายใจหรือไหลเวียนโลหิตล้มเหลว',
        ],
        firstAidInstructions: [
          'ห้ามป้อนน้ำ อาหาร หรือยาลดไข้คนเด็ดขาด',
          'จัดท่าให้นอนราบ ตะแคงข้าง ยกศีรษะเสมอลำตัว ป้องกันการสำลัก',
          'นำสัตว์เลี้ยงส่งโรงพยาบาลทันที แพทย์เวรเตรียมเปิดห้องช่วยชีวิต 24 ชม.',
        ],
        recommendedService: 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง',
        doctorReply:
          'หมอสุภัทรา (สัตวแพทย์เวรฉุกเฉิน 24 ชม.) ได้รับข้อมูลแล้วค่ะ! อาการนี้น้องมีความเสี่ยงวิกฤตสูงมาก หมอเตรียมทีมกู้ชีพและอุปกรณ์รองรับไว้ให้ทันที แนะนำให้รีบพาน้องเข้ามาโรงพยาบาลด่วน หรือกดโทรตรงเข้าห้องฉุกเฉินได้เลยนะคะ',
      };
    }

    // 🟡 Urgent Yellow Alert Monitor Keywords
    if (
      lower.includes('อาเจียน') ||
      lower.includes('อ้วก') ||
      lower.includes('ท้องเสีย') ||
      lower.includes('ถ่ายเหลว') ||
      lower.includes('ซึม') ||
      lower.includes('ไม่กิน') ||
      lower.includes('เบื่ออาหาร') ||
      lower.includes('มีไข้') ||
      lower.includes('ตัวร้อน') ||
      lower.includes('ไอ') ||
      lower.includes('คัน') ||
      lower.includes('ขนร่วง') ||
      lower.includes('ตาแฉะ') ||
      lower.includes('ท้องอืด') ||
      lower.includes('ไม่อึ') ||
      lower.includes('แปลกปลอม')
    ) {
      return {
        level: 'yellow',
        alertTitle: 'เฝ้าระวังอาการ (Yellow Alert ⚠️)',
        suspectedConditions: [
          'กระเพาะอาหารและลำไส้อักเสบเฉียบพลัน (Acute Gastroenteritis)',
          'ภาวะทางเดินอาหารหยุดบีบตัว (GI Stasis) หรือสงสัยสิ่งแปลกปลอม',
        ],
        firstAidInstructions: [
          'งดน้ำและอาหาร 2-3 ชม. เพื่อสังเกตอาการและป้องกันการสำลัก',
          'สังเกตสีเหงือก (ต้องไม่ซีดขาว) และวัดอุณหภูมิหากมีเครื่องวัด',
          'เตรียมสมุดวัคซีนหรือประวัติยาที่เคยได้รับเพื่อส่งต่อแพทย์',
        ],
        recommendedService: 'ศูนย์อายุรกรรมและคลินิกเฉพาะทาง',
        doctorReply:
          'สวัสดีค่ะคุณเจ้าของ หมอสุภัทรานะคะ จากอาการที่แจ้ง หมอแนะนำให้งดน้ำและอาหารชั่วคราวก่อนตามที่ระบบประเมินนะคะ เพื่อความปลอดภัยของน้อง แนะนำพาน้องเข้ามาตรวจเพื่อตรวจเลือดและวินิจฉัยอย่างละเอียดค่ะ สามารถกดจองคิวตรวจล่วงหน้าได้เลยนะคะ',
      };
    }

    // 🟢 General Wellness / Vaccines
    if (
      lower.includes('วัคซีน') ||
      lower.includes('ตรวจสุขภาพ') ||
      lower.includes('ทำหมัน') ||
      lower.includes('ขูดหินปูน') ||
      lower.includes('เห็บ') ||
      lower.includes('หมัด') ||
      lower.includes('ปรึกษา')
    ) {
      return {
        level: 'green',
        alertTitle: 'บริการตรวจสุขภาพและเวชศาสตร์ป้องกัน (Green Status ✅)',
        suspectedConditions: [
          'การดูแลสุขภาพเชิงป้องกันและเสริมสร้างภูมิคุ้มกันตามช่วงวัย',
        ],
        firstAidInstructions: [
          'ตรวจเช็กสภาพร่างกายเบื้องต้น น้องต้องไม่มีไข้ ไม่ซึม',
          'นำประวัติวัคซีนเดิมหรือสมุดวัคซีนดิจิทัลมาแสดงในวันนัดหมาย',
        ],
        recommendedService: 'ศูนย์ตรวจสุขภาพและเวชศาสตร์ป้องกัน',
        doctorReply:
          'สวัสดีค่ะคุณเจ้าของ ยินดีให้คำแนะนำเรื่องการดูแลสุขภาพและคอร์สวัคซีนค่ะ ทางโรงพยาบาลมีสัตวแพทย์เฉพาะทางพร้อมให้บริการทุกวัน สามารถนัดหมายเวลาที่สะดวกได้เลยนะคะ',
      };
    }

    // Default Fallback
    return {
      level: 'yellow',
      alertTitle: 'คำแนะนำเบื้องต้นจากสัตวแพทย์',
      suspectedConditions: ['ประเมินอาการเบื้องต้นโดยสัตวแพทย์เวรประจำการ'],
      firstAidInstructions: [
        'สังเกตพฤติกรรมการกิน การขับถ่าย และการหายใจอย่างใกล้ชิด',
        'หากอาการไม่ดีขึ้นภายใน 4-6 ชั่วโมง แนะนำนำส่งโรงพยาบาลทันที',
      ],
      recommendedService: 'บริการตรวจวินิจฉัยและรักษาอายุรกรรม',
      doctorReply:
        'หมอรับเรื่องไว้เรียบร้อยแล้วค่ะ หากน้องยังมีอาการผิดปกติ แนะนำให้พาเข้ามาตรวจกับทีมแพทย์ที่โรงพยาบาล หรือโทรสอบถามทีมเวรได้ตลอด 24 ชั่วโมงนะคะ',
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setTypingMessage('ระบบ AI กำลังประมวลผลข้อมูลอาการ...');

    const triage = analyzeTriage(text);

    // Step 1: Automated Triage Holding & Assessment Card
    setTimeout(() => {
      const triageCardMsg: ChatMessage = {
        id: `triage-${Date.now()}`,
        sender: 'assistant',
        senderName: 'ระบบคัดกรองเวชศาสตร์ฉุกเฉิน (AI Triage)',
        text: 'ระบบได้ทำการประเมินอาการด่วนเบื้องต้น พร้อมส่งต่อข้อมูลให้สัตวแพทย์เวรประจำการเรียบร้อยแล้วครับ',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triageLevel: triage.level,
        triageDetails: {
          alertTitle: triage.alertTitle,
          suspectedConditions: triage.suspectedConditions,
          firstAidInstructions: triage.firstAidInstructions,
          recommendedService: triage.recommendedService,
        },
      };

      setMessages((prev) => [...prev, triageCardMsg]);
      setTypingMessage('พญ. สุภัทรา (สัตวแพทย์เวร) กำลังพิมพ์ข้อความตอบกลับ...');

      // Step 2: Doctor Response
      setTimeout(() => {
        setIsTyping(false);
        const doctorMsg: ChatMessage = {
          id: `doctor-${Date.now()}`,
          sender: 'doctor',
          senderName: 'พญ. สุภัทรา (สัตวแพทย์เวรประจำการ)',
          text: triage.doctorReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, doctorMsg]);
      }, 1600);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="ห้องสนทนาและประเมินอาการสัตว์เลี้ยงตลอด 24 ชม."
      className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-20 sm:right-6 w-auto sm:w-[420px] h-[580px] sm:h-[620px] max-h-[88vh] bg-background-primary-default border border-border-button-default rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-scale-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-blue-900 text-white border-b border-blue-950 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative size-10 rounded-full overflow-hidden bg-blue-800 shrink-0 ring-2 ring-emerald-400">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
              alt="พญ. สุภัทรา"
              className="size-full object-cover"
            />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-1 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-caption-1-semibold font-bold text-white truncate">
                ศูนย์ประเมินอาการสัตว์เลี้ยง
              </h3>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-800 text-[10px] text-blue-200 border border-blue-700 font-medium">
                24 ชม.
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-200 truncate">
              <StatusDot color="green" />
              <span>พญ. สุภัทรา • พร้อมตอบข้อความ</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <a
            href="tel:028889999"
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="โทรด่วน 24 ชม."
            aria-label="โทรด่วน 24 ชม."
          >
            <RiPhoneFill className="size-4 text-emerald-400" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="ปิดหน้าต่างแชท"
            aria-label="ปิดหน้าต่างแชท"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cx(
              'flex flex-col max-w-[88%]',
              msg.sender === 'user' ? 'ms-auto items-end' : 'me-auto items-start'
            )}
          >
            {/* Sender Label */}
            {msg.sender !== 'user' && (
              <div className="flex items-center gap-1.5 ps-1 mb-1 text-[11px] text-text-tertiary">
                {msg.sender === 'doctor' ? (
                  <>
                    <RiStethoscopeFill className="size-3 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {msg.senderName}
                    </span>
                  </>
                ) : (
                  <>
                    <RiSparklingFill className="size-3 text-accent-500" />
                    <span>{msg.senderName}</span>
                  </>
                )}
              </div>
            )}

            {/* Bubble */}
            <div
              className={cx(
                'px-3.5 py-2.5 rounded-2xl text-caption-1-regular leading-relaxed text-sm',
                msg.sender === 'user'
                  ? 'bg-accent-600 text-white rounded-tr-xs shadow-xs'
                  : msg.sender === 'doctor'
                  ? 'bg-emerald-500/10 border border-emerald-500/25 text-text-primary rounded-tl-xs'
                  : 'bg-background-secondary-default border border-border-button-default text-text-primary rounded-tl-xs'
              )}
            >
              {msg.text}
            </div>

            {/* Triage Assessment Card if present */}
            {msg.triageDetails && (
              <div
                className={cx(
                  'mt-2 w-full p-3.5 rounded-2xl border text-caption-1-regular shadow-sm space-y-2.5',
                  msg.triageLevel === 'red'
                    ? 'bg-status-rose-background border-border-button-default'
                    : msg.triageLevel === 'yellow'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                )}
              >
                {/* Alert Title */}
                <div className="flex items-center justify-between gap-1.5 border-b border-separator-border pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-caption-1-semibold text-text-primary">
                    <RiAlertFill
                      className={cx(
                        'size-4 shrink-0',
                        msg.triageLevel === 'red'
                          ? 'text-status-rose-text'
                          : msg.triageLevel === 'yellow'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      )}
                    />
                    <span>{msg.triageDetails.alertTitle}</span>
                  </div>
                </div>

                {/* Suspected Conditions */}
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-text-secondary">
                    ข้อสันนิษฐานเบื้องต้น:
                  </p>
                  <ul className="text-caption-2-medium text-text-primary list-disc list-inside space-y-0.5">
                    {msg.triageDetails.suspectedConditions.map((cond, i) => (
                      <li key={i}>{cond}</li>
                    ))}
                  </ul>
                </div>

                {/* First Aid Instructions */}
                <div className="p-2.5 rounded-xl bg-background-primary-default border border-border-button-default space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-accent-700 dark:text-accent-300">
                    <RiCheckLine className="size-3.5" />
                    <span>คำแนะนำปฐมพยาบาลด่วน:</span>
                  </div>
                  <ul className="text-[11px] text-text-secondary space-y-0.5 ps-1">
                    {msg.triageDetails.firstAidInstructions.map((ins, i) => (
                      <li key={i}>• {ins}</li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Action Buttons */}
                <div className="pt-1 flex flex-col gap-1.5">
                  <Button
                    variant="primary"
                    size="small"
                    leadingIcon={RiCalendarCheckLine}
                    onClick={() => {
                      onOpenBooking(msg.triageDetails?.recommendedService);
                      onClose();
                    }}
                    className="w-full justify-center"
                  >
                    จองคิวตรวจสัตวแพทย์ด่วน
                  </Button>
                  {msg.triageLevel === 'red' && (
                    <a
                      href="tel:028889999"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-status-rose-background text-status-rose-text border border-status-rose-border font-bold text-caption-2-bold hover:bg-status-rose-background/80 transition-colors"
                    >
                      <RiPhoneFill className="size-3.5" />
                      โทรสายด่วนฉุกเฉินทันที (02-888-9999)
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <span className="text-[10px] text-text-tertiary mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-caption-2-regular text-text-tertiary animate-pulse ps-1">
            <RiHeartPulseFill className="size-3.5 text-accent-500 animate-spin" />
            <span>{typingMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Carousel */}
      <div className="px-3 py-2 bg-background-secondary-default border-t border-border-button-default overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {QUICK_SUGGESTIONS.map((sugg) => (
          <button
            key={sugg}
            type="button"
            onClick={() => handleSendMessage(sugg)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-background-primary-default border border-border-button-default hover:border-accent-400 text-caption-2-medium text-text-secondary hover:text-text-primary text-[11px] transition-colors cursor-pointer"
          >
            {sugg}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-background-primary-default border-t border-border-button-default flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="พิมพ์บอกอาการสัตว์เลี้ยง..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-background-secondary-default border border-border-button-default text-caption-1-regular text-text-primary focus:outline-hidden focus:border-border-focus-ring placeholder:text-text-placeholder"
        />
        <Button
          type="submit"
          variant="primary"
          size="small"
          iconOnly
          leadingIcon={RiSendPlane2Fill}
          disabled={!inputText.trim()}
          title="ส่งข้อความ"
          aria-label="ส่งข้อความ"
        />
      </form>
    </div>
  );
};
