# 📑 เอกสารสรุปกระบวนการพัฒนาและชุดคำสั่ง (Prompt Journey & Presentation Guide)
## โครงการ: เว็บไซต์โรงพยาบาลสัตว์ 24 ชั่วโมง (Pet Hospital 24/7)
**Live Demo:** [https://pet-hospital-eta.vercel.app](https://pet-hospital-eta.vercel.app)  
**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + BoardUI + Impeccable UX

---

## 🎯 ภาพรวมแนวคิดในการนำเสนออาจารย์ (Core Concept & Methodology)
ในการทำโปรเจกต์นี้ เราไม่ได้ใช้ AI แบบ "ให้โค้ดมาทั้งดุ้นแล้ววาง" แต่ใช้แนวคิด **AI Agentic Workflow (Pair-Programming with Specialized AI Tools)** โดยแบ่งบทบาทเป็น 5 ขั้นตอนหลัก:
1. **Tooling & Context Injection:** ติดตั้ง MCP และ Design System ให้ AI เข้าใจ Design Tokens ก่อนเริ่มโค้ด
2. **System Scaffolding:** วางสถาปัตยกรรมระดับ Core System และเลือกเทคโนโลยีที่เหมาะสม (Vite + React 19)
3. **Domain-Specific Feature Engineering:** พัฒนาฟีเจอร์เฉพาะทาง (ระบบจำแนกการรักษาตามชนิดสัตว์, 3D Pop-out Card)
4. **Design System Integration:** ใช้ BoardUI ควบคุม Semantic Tokens และ Composite Typography 100%
5. **Autonomous UX Critique & Polish:** ใช้เครื่องมือ Impeccable ตรวจจับจุดบกพร่องตามหลัก UX 10 Heuristics และแก้จุดเสี่ยงทางการแพทย์ (Medical Triage)

---

## 🚀 สรุปชุดคำสั่ง Prompt, วิธีการ และผลลัพธ์ (Step-by-Step Prompts)

### 🔹 ขั้นตอนที่ 1: การเชื่อมต่อ Tooling และ Design System (MCP & Skill)
* **Prompt ที่ใช้:**
  > `[MCP Server | BoardUI](https://www.boardui.com/mcp) เชื่อมให้หน่อย ติดตั้ง skill ลง ~/.gemini/config/skills/boardui พร้อม references`
* **วิธีการ (Methodology):**
  - ติดตั้ง Model Context Protocol (MCP) ของ BoardUI และนำ Rules เข้าสู่ Context ของ Agent
  - บังคับใช้หลักการ Design System: ห้ามใช้สี Palette แบบสุ่มสี่สุ่มห้า (Raw Colors) แต่ให้ใช้ Semantic Tokens เช่น `bg-background-primary-default` เพื่อรองรับ Dark/Light Mode อัตโนมัติ
* **สิ่งที่ AI จัดการให้:**
  - สร้างไฟล์ Config, สิทธิ์การเรียกใช้ Component จาก BoardUI Registry, และกฎ Design Rules

---

### 🔹 ขั้นตอนที่ 2: วางโครงสร้างสถาปัตยกรรมและหน้าบ้าน (System Scaffolding)
* **Prompt ที่ใช้:**
  > `สร้างเป็นเว็บ โรงพยาบาลสัตว์ ครับ เน้นเป็นหน้าบ้านสำหรับเจ้าของสัตว์เลี้ยง (ดูบริการ, ทีมแพทย์, นัดหมายตรวจ/ฉุกเฉิน)`
* **วิธีการ (Methodology):**
  - AI ถามเพื่อตีกรอบความต้องการ (Scoping) และเสนอทางเลือก Tech Stack
  - เลือกทางเลือก Vite + React 19 + Tailwind CSS เพื่อความเบา รวดเร็ว และเป็น Single Page Application (SPA) ที่โหลดข้อมูลได้ทันที
* **สิ่งที่ AI จัดการให้:**
  - วางโครงสร้างโปรเจกต์ `src/components/` (Navbar, Hero, Services, Doctors, BookingModal, LocationHours, Footer)
  - วางระบบแถบแจ้งเตือนฉุกเฉิน 24/7 (Emergency Banner & Speed Dial) ที่ติดอยู่ตลอดเวลาเพื่อสัตว์ป่วยฉุกเฉิน

---

### 🔹 ขั้นตอนที่ 3: ออกแบบฟีเจอร์เฉพาะทางสัตว์เลี้ยง (Pet-Type Treatment Explorer)
* **Prompt ที่ใช้:**
  > `อยากเพิ่มแบบ ที่แบ่งคือ แบบ ประเภทสัตว์และการรักษาที่รองรับ เช่นคือกด ไปที่รูปแมว มีการรักษารองรับแบบนี้`
* **วิธีการ (Methodology):**
  - ออกแบบ Interactive UX ให้ผู้ใช้สามารถเลือกดูตามประเภทสัตว์ (สุนัข, แมว, สัตว์พิเศษ/Exotic, นก, สัตว์น้ำ/สัตว์เลื้อยคลาน)
  - พัฒนาต่อยอดเป็นดีไซน์พิเศษ: 3D Pop-out Sticker Effect (ตัวสัตว์ลอยทะลุกรอบการ์ด) และ Hostinger-Style Auto-cycling Card Deck พร้อมแท็บจำลอง AI Chat Typewriter
* **สิ่งที่ AI จัดการให้:**
  - สร้างคอมโพเนนต์ `PetTreatmentExplorer.tsx` และ `HeroPetCardDeck.tsx`
  - เชื่อมโยงข้อมูลอาการยอดฮิต (เช่น นิ่ว/FLUTD ในแมว, โรคหัวใจในสุนัข, ภาวะลำไส้นิ่งในกระต่าย) พร้อมระบบ Smooth Scroll ไปยังส่วนที่เกี่ยวข้อง

---

### 🔹 ขั้นตอนที่ 4: ยกระดับ UI ด้วย BoardUI Design System
* **Prompt ที่ใช้:**
  > `ติดตั้งและปรับแต่งเว็บไซต์ด้วย BoardUI Design System`
* **วิธีการ (Methodology):**
  - แทนที่ UI Component ดั้งเดิมด้วยคอมโพเนนต์ระดับ Production ของ BoardUI
  - ควบคุมการตัดขอบ `rounded-3xl`, ตัวอักษร Composite Text Utility, และไอคอนทางเทคนิคจาก Remix Icon
* **สิ่งที่ AI จัดการให้:**
  - ติดตั้ง `BoardUI DatePicker / DateCalendar` ลงในระบบจองคิว
  - ติดตั้ง `HospitalAlertsCard.tsx` (การ์ดแสดง Medical Profile เตือนฉีดวัคซีนและไฮไลต์เคส)
  - ติดตั้ง `HospitalTaskList.tsx` (แถบติดตามสเตตัสการตรวจรักษาแบบ Live Process)
  - วางระบบ Font Cascade: ภาษาไทยใช้ **Kanit / Prompt** ควบคู่กับภาษาอังกฤษ **Inter**

---

### 🔹 ขั้นตอนที่ 5: การตรวจสอบ UX ระดับลึกและการเกลากราฟิก (Impeccable Critique & Polish)
* **Prompt ที่ใช้:**
  > `ติดตั้ง Impeccable และรัน /impeccable critique พร้อม /impeccable polish เพื่อตรวจ UX และ Alignment`
* **วิธีการ (Methodology):**
  - ให้ AI รันกระบวนการ Dual-Agent วิเคราะห์หน้าเว็บตามหลัก **10 Nielsen Norman UX Heuristics** (ได้คะแนน 34.5/40 - ระดับ Very Good)
  - ค้นพบช่องโหว่ด้านการแพทย์: ในกรณีฉุกเฉิน หากเจ้าของสัตว์ยังกดฟอร์มนัดหมายทั่วไป สัตว์อาจเสียชีวิตได้ จึงต้องมีระบบสกัดกั้น (Emergency Triage Intercept)
* **สิ่งที่ AI จัดการให้:**
  1. **Emergency Intercept ใน BookingModal:** ดักจับคีย์เวิร์ดวิกฤต (เช่น ช็อก, หายใจไม่ออก, รถชน, เลือดไหล) หากพบ ระบบจะบล็อกการจองล่วงหน้าทันที แล้วเด้งหน้าเตือนสีแดงพร้อมปุ่มโทรด่วนและแผนที่ฉุกเฉิน
  2. **Hero CTA Hierarchy:** จัดระเบียบปุ่ม Action ใหม่ ให้ปุ่มโทรฉุกเฉินสีแดงโดดเด่น ไม่แย่งสายตากับปุ่มจองคิวทั่วไป
  3. **Visual Polish:** เปลี่ยนไอคอนสัตว์เลี้ยงจาก Emoji เป็น SVG สไตล์มินิมอล 2px เส้นคมชัด
  4. **Surface Tuning:** ปรับสี Caret, สี Selection เวลาไฮไลต์ข้อความ, และ Custom Scrollbar ตาม Semantic Theme

---

### 🔹 ขั้นตอนที่ 6: ปรับแต่ง Responsive & ประสบการณ์บนมือถือ (Mobile Optimization)
* **Prompt ที่ใช้:**
  > `ปรับแต่ง responsive layout สำหรับมือถือ ให้ floating action, composer pill และ datepicker ใช้งานได้ลื่นไหล`
* **วิธีการ (Methodology):**
  - ตรวจสอบ Breakpoints (Mobile, Tablet, Desktop)
  - จัดการ Popover ของ DatePicker ไม่ให้ตกขอบหน้าจอบนอุปกรณ์หน้าจอเล็ก
* **สิ่งที่ AI จัดการให้:**
  - แปลงปุ่มจองและโทรฉุกเฉินบนมือถือเป็น Floating Bottom Action Bar ที่แตะง่ายด้วยนิ้วโป้ง (Thumb-friendly design)
  - ทดสอบและ Build ผ่าน 100% ปราศจาก Type Error (`npm run build` ผ่านสมบูรณ์)

---

### 🔹 ขั้นตอนที่ 7: การ Deploy ขึ้น Production และทำเอกสาร (Deployment & Documentation)
* **Prompt ที่ใช้:**
  > `Deploy โปรเจกต์ขึ้น Vercel พร้อมเขียนคู่มือติดตั้งและโครงสร้างโปรเจกต์ภาษาไทยลง README.md`
* **วิธีการ (Methodology):**
  - เชื่อมต่อโปรเจกต์เข้ากับ Vercel Production Environment
  - จัดทำเอกสารคู่มือการติดตั้ง (Prerequisites, Quick Start, Scripts, Architecture)
* **สิ่งที่ AI จัดการให้:**
  - เว็บไซต์เปิดใช้งานจริงที่: https://pet-hospital-eta.vercel.app
  - จัดทำไฟล์ `README.md` และ `prompt.md` สำหรับส่งงานและใช้ในการพรีเซนต์

---

## 🎤 สรุปประเด็นพูดนำเสนออาจารย์ (3-5 นาที Key Takeaways)
1. **ไม่ใช่แค่ Generative AI แต่เป็น Agentic Development:** อธิบายว่าเราใช้ AI ในฐานะคู่คิด (Pair Programmer) ที่เชื่อมต่อ Tools (MCP, Impeccable Linter, BoardUI Design Engine)
2. **Domain-Driven Design (เข้าใจธุรกิจโรงพยาบาลสัตว์):** ชี้ให้อาจารย์ดูว่า มีระบบ Triage ดักสัตว์ป่วยฉุกเฉิน, มีการแบ่งหมวดหมู่โรคตามสายพันธุ์จริง (GDV, FLUTD, GI Stasis) ซึ่งเกิดจากการ Prompt ให้ AI ลงลึกถึง Use Case จริง
3. **Enterprise UI Standard:** หน้าเว็บไม่ได้เขียน CSS มั่ว แต่ควบคุมด้วย Design Tokens ทั้งหมด เปลี่ยนธีมได้โดยที่สีไม่เพี้ยน
4. **ความสมบูรณ์ระดับ Production:** มีทั้งระบบคัดกรอง, ฟอร์มจองแบบ Interactive, โค้ดผ่าน TypeScript Check 100% และ Deploy ใช้งานได้จริงบน Vercel
