import React, { useState } from 'react';
import { RiCloseLine, RiFullscreenLine, RiFileCopyLine, RiCheckLine } from '@remixicon/react';

interface PromptPresentationSlideProps {
  onClose: () => void;
}

export const PromptPresentationSlide: React.FC<PromptPresentationSlideProps> = ({ onClose }) => {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const prompts = [
    {
      id: 1,
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      title: 'พาดหัวสร้างความอุ่นใจ (Copywriting)',
      prompt: 'ปรับโทนข้อความจากโบรชัวร์แข็งๆ ให้สร้างความอุ่นใจ เน้นเปิด 24 ชม. และย่อยบริการเหลือ 2 บรรทัด ไม่ใช้ศัพท์เทคนิคซับซ้อน',
      note: 'เน้นไฮไลต์สีฟ้า: "พร้อมดูแลคุณทุกวินาที"',
    },
    {
      id: 2,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      title: 'ปุ่มคู่คัดกรองผู้ใช้ (Dual-CTA)',
      prompt: 'ออกแบบปุ่มคู่แยก 2 กลุ่ม: คนวางแผนล่วงหน้าใช้ปุ่มน้ำเงิน accent-500 และคนกังวลใจใช้ปุ่มเขียว LINE #06C755 ส่งรูปถามอาการทันที',
      note: 'ตอบโจทย์ทั้งเคสเตรียมตัวล่วงหน้าและเคสรีบด่วน',
    },
    {
      id: 3,
      color: 'bg-rose-600',
      textColor: 'text-rose-700',
      title: 'ฟีดการแพทย์จริง (Live Trust Card)',
      prompt: 'เพิ่มการ์ด Bento ทรงมน rounded-3xl ซ้อนการ์ดย่อยด้านใน โชว์เคสกู้ชีพผ่าตัดกระเพาะบิด (GDV) สีแดง และรับรองมาตรฐานแมวสากล (ISFM) สีทอง',
      note: 'ใช้หลัก Show, Don\'t Tell เพื่อสร้างความน่าเชื่อถือ',
    },
    {
      id: 4,
      color: 'bg-purple-600',
      textColor: 'text-purple-700',
      title: 'การ์ด 3D สลับรูป + AI Typewriter',
      prompt: 'ทำการ์ดรูปคุณหมอกอดสัตว์เลี้ยงซ้อนกัน 3 ชั้นแบบมีมิติ 3D สลับรูปหมา-แมวอัตโนมัติ และมีแถบแคปซูลแชตสีขาวลอยทับขอบล่าง ทำเอฟเฟกต์ Typewriter พิมพ์คำถามสด พร้อมปุ่มลูกศรสีน้ำเงินส่งตรวจ',
      note: 'Micro-Interactive ทำให้หน้าเว็บดูโมเดิร์น มีชีวิตชีวา',
    },
    {
      id: 5,
      color: 'bg-teal-600',
      textColor: 'text-teal-700',
      title: 'ขั้นตอนตรวจรักษาแบบสด (Live Task List)',
      prompt: 'สร้างขั้นตอน Timeline จำลองเคสน้องมีตังค์กลืนสิ่งแปลกปลอม แบ่ง 2 สเต็ป: รับเคสตรวจ SpO2/HR/เอกซเรย์ และ ส่องกล้องคีบสำเร็จไร้แผล 100% พร้อมป้ายบอกค่าน้ำหนักจริง และปุ่ม Run again ให้กดเล่นใหม่ได้',
      note: 'สร้างความโปร่งใส (Transparency) ในขั้นตอนการดูแล',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#edf2f7] flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto select-none">
      
      {/* Floating Minimal Control Bar */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-md border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
          title="สลับเต็มจอ (Fullscreen)"
        >
          <RiFullscreenLine className="size-3.5" />
          <span>เต็มจอ</span>
        </button>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RiCloseLine className="size-4" />
          <span>ปิดสไลด์กลับหน้าเว็บ</span>
        </button>
      </div>

      {/* Main 16:9 Canvas Area */}
      <div className="w-full max-w-[1720px] aspect-[16/9] min-h-[680px] p-4 sm:p-6 lg:p-10 flex flex-col justify-center relative">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-10 left-10 size-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 size-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-12 gap-5 lg:gap-7 items-center relative z-10 w-full my-auto">
          
          {/* LEFT COLUMN: 3 Cards */}
          <div className="col-span-3 space-y-3.5">
            {prompts.slice(0, 3).map((item) => {
              const isHighlighted = activePin === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActivePin(item.id)}
                  onMouseLeave={() => setActivePin(null)}
                  className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 relative ${
                    isHighlighted
                      ? 'border-blue-500 shadow-lg scale-[1.02] ring-2 ring-blue-500/20'
                      : 'border-slate-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`size-5 rounded-full ${item.color} text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-xs`}>
                        {item.id}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                        {item.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="คัดลอก Prompt"
                    >
                      {copiedIndex === item.id ? (
                        <RiCheckLine className="size-3.5 text-emerald-600" />
                      ) : (
                        <RiFileCopyLine className="size-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 font-normal">
                    <strong className="text-slate-800 font-semibold">Prompt:</strong> "{item.prompt}"
                  </p>

                  <div className={`mt-2 text-[10px] sm:text-[11px] ${item.textColor} font-medium`}>
                    ↳ {item.note}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CENTER COLUMN: Hero Image with Interactive Pins */}
          <div className="col-span-6 flex flex-col items-center justify-center px-1">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              <img
                src="/hero-presentation.jpg"
                alt="Pet Hospital Hero Section UI"
                className="w-full object-cover"
              />
              
              {/* Interactive Pins */}
              {[
                { id: 1, top: '14%', left: '16%', color: 'bg-blue-600' },
                { id: 2, top: '43%', left: '18%', color: 'bg-emerald-600' },
                { id: 3, top: '68%', left: '24%', color: 'bg-rose-600' },
                { id: 4, top: '32%', right: '28%', color: 'bg-purple-600' },
                { id: 5, top: '72%', right: '28%', color: 'bg-teal-600' },
              ].map((pin) => {
                const isActive = activePin === pin.id;
                return (
                  <button
                    key={pin.id}
                    onMouseEnter={() => setActivePin(pin.id)}
                    onMouseLeave={() => setActivePin(null)}
                    style={{
                      top: pin.top,
                      left: pin.left,
                      right: pin.right,
                    }}
                    className={`absolute size-7 sm:size-8 rounded-full ${pin.color} text-white font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xl transition-all duration-200 cursor-pointer ${
                      isActive ? 'scale-125 ring-4 ring-white/80 z-40' : 'hover:scale-110 z-30'
                    }`}
                  >
                    {pin.id}
                  </button>
                );
              })}
            </div>

            {/* Bottom Legend Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-600 font-medium bg-white/85 backdrop-blur-md px-5 py-2 rounded-full border border-slate-200/90 shadow-sm">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-600"></span> 1. ข้อความพาดหัว</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-600"></span> 2. ปุ่มคู่ Dual-CTA</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-600"></span> 3. ฟีดเคสจริง</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-purple-600"></span> 4. 3D AI Card</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-600"></span> 5. ขั้นตอนรักษา</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 Cards */}
          <div className="col-span-3 space-y-4">
            {prompts.slice(3, 5).map((item) => {
              const isHighlighted = activePin === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActivePin(item.id)}
                  onMouseLeave={() => setActivePin(null)}
                  className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 relative ${
                    isHighlighted
                      ? 'border-purple-500 shadow-lg scale-[1.02] ring-2 ring-purple-500/20'
                      : 'border-slate-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`size-5 rounded-full ${item.color} text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-xs`}>
                        {item.id}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                        {item.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="คัดลอก Prompt"
                    >
                      {copiedIndex === item.id ? (
                        <RiCheckLine className="size-3.5 text-emerald-600" />
                      ) : (
                        <RiFileCopyLine className="size-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 font-normal">
                    <strong className="text-slate-800 font-semibold">Prompt:</strong> "{item.prompt}"
                  </p>

                  <div className={`mt-2 text-[10px] sm:text-[11px] ${item.textColor} font-medium`}>
                    ↳ {item.note}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
