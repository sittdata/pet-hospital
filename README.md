# 🏥 โรงพยาบาลสัตว์เวทพอว์ส (VetPaws Animal Hospital 24/7)

> เว็บไซต์และระบบนัดหมายตรวจสุขภาพสัตว์เลี้ยงออนไลน์ตลอด 24 ชั่วโมง  
> พัฒนาด้วย **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4** และ **BoardUI Design System**

🔗 **Live Demo (Vercel):** [https://pet-hospital-eta.vercel.app](https://pet-hospital-eta.vercel.app)

---

## 📋 สิ่งที่ต้องมีในเครื่องก่อนติดตั้ง (Prerequisites)

ก่อนเริ่มติดตั้ง ตรวจสอบให้แน่ใจว่าเครื่องของคุณมีโปรแกรมเหล่านี้ติดตั้งแล้ว:

1. **Node.js** (แนะนำเวอร์ชัน **18.x** หรือ **20.x LTS** ขึ้นไป)
   - เช็กเวอร์ชันด้วยคำสั่ง:
     ```bash
     node -v
     npm -v
     ```
   - หากยังไม่มี สามารถดาวน์โหลดได้ที่ [nodejs.org](https://nodejs.org/)
2. **Git** (สำหรับโคลนโปรเจกต์) หรือดาวน์โหลดไฟล์เป็น ZIP

---

## 🚀 ขั้นตอนการติดตั้งและเริ่มใช้งาน (Quick Start)

### 1. โคลนโปรเจกต์ (Clone Repository) หรือแตกไฟล์ ZIP
```bash
git clone https://github.com/sittdata/pet-hospital.git
cd pet-hospital
```

### 2. ติดตั้ง Dependencies ทั้งหมด
รันคำสั่งด้านล่างเพื่อติดตั้งแพ็กเกจที่โปรเจกต์จำเป็นต้องใช้:
```bash
npm install
```

### 3. รัน Development Server
เริ่มรันโปรเจกต์ในเครื่องของคุณ:
```bash
npm run dev
```

เมื่อรันสำเร็จ Terminal จะแสดง URL เช่น:
```text
  VITE v8.x.x  ready in 200 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

👉 เปิดเบราว์เซอร์แล้วไปที่: **`http://localhost:5173`** (หรือตามพอร์ตที่ระบบระบุ เช่น `5174`)

---

## 💻 คำสั่งทั้งหมดที่ใช้งานได้ (Available Scripts)

ภายในโปรเจกต์มีคำสั่ง npm ดังต่อไปนี้:

| คำสั่ง | คำอธิบาย |
| :--- | :--- |
| `npm run dev` | รัน Local Development Server พร้อม Hot Module Replacement (HMR) |
| `npm run build` | ตรวจสอบ TypeScript (`tsc -b`) และคอมไพล์โค้ดสำหรับ Production ไปไว้ที่โฟลเดอร์ `dist/` |
| `npm run preview` | ทดสอบเปิดดูไฟล์ Production Build ในเครื่องจำลองเสมือนจริง |
| `npm run lint` | ตรวจสอบคุณภาพโค้ดและ Syntax ด้วย **Oxlint** อย่างรวดเร็ว |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
pet-hospital/
├── components/                  # BoardUI Design System Components
│   ├── application/             # คอมโพเนนต์ระดับแอป (Charts, Cards, Task Lists)
│   ├── base/                    # คอมโพเนนต์พื้นฐาน (Buttons, Badges, DatePicker)
│   └── foundations/             # รากฐานระบบ UI (ScrollFade, Direction, etc.)
├── public/                      # Static Assets (รูปสัตว์เลี้ยง, รูปแพทย์, ไอคอน)
├── src/                         # ซอร์สโค้ดหลักของเว็บ
│   ├── components/              # คอมโพเนนต์เฉพาะของหน้าเว็บ
│   │   ├── Navbar.tsx           # แถบเมนูด้านบน พร้อมปุ่มโทรด่วนและเข้าสู่ระบบ
│   │   ├── Hero.tsx             # ส่วน Hero หลัก + ไฮไลท์
│   │   ├── HeroPetCardDeck.tsx  # กองการ์ด 3D พร้อมแถบ AI Chat Typewriter
│   │   ├── HospitalAlertsCard.tsx # การ์ดแจ้งเตือนและกิจกรรมเด่น (Medical Profile)
│   │   ├── HospitalTaskList.tsx # แถบกระบวนการตรวจรักษาแบบ Live
│   │   ├── BookingModal.tsx     # ระบบฟอร์มนัดหมาย 3 ขั้นตอน พร้อม BoardUI DatePicker
│   │   ├── AuthModal.tsx        # โมดัลเข้าสู่ระบบ / ลงทะเบียน
│   │   ├── PetHealthPassportModal.tsx # สมุดวัคซีนดิจิทัลและประวัติสุขภาพสัตว์เลี้ยง
│   │   ├── PromptPresentationShowcase.tsx # แผนผังนำเสนอกราฟิกเชื่อมโยงคำสั่ง Prompt & UI Breakdown
│   │   ├── Services.tsx         # แผนกเฉพาะทางและการบริการ
│   │   ├── LocationHours.tsx    # แผนที่ สาขา และเวลาทำการ 24 ชม.
│   │   ├── FAQ.tsx              # คำถามที่พบบ่อย (Accordion)
│   │   └── Footer.tsx           # ข้อมูลติดต่อ ทะเบียนสถานพยาบาล
│   ├── data/
│   │   ├── promptShowcaseData.ts # ข้อมูลชุดคำสั่ง Prompt, Pins และ Speaker Notes
│   │   ├── servicesData.ts      # ข้อมูลบริการทางการแพทย์และภาพคลินิก
│   │   └── petPassportData.ts   # ข้อมูลและ Mock Database สมุดวัคซีน
│   ├── styles/                  # ระบบ BoardUI Styling
│   │   ├── theme.css            # Semantic Tokens (Colors, Dark/Light Mode)
│   │   ├── typography.css       # ขนาดและน้ำหนักตัวอักษร Composite
│   │   └── globals.css          # CSS หลักของระบบ
│   ├── types.ts                 # TypeScript Type Definitions
│   ├── App.tsx                  # Root Component
│   ├── index.css                # การตั้งค่า Font Cascade (Kanit + Inter)
│   └── main.tsx                 # Entry Point
├── package.json                 # รายชื่อ Dependencies และ Scripts
└── vite.config.ts               # การตั้งค่า Vite และ Tailwind CSS v4
```

---

## 🛠️ เทคโนโลยีหลักที่ใช้ (Tech Stack)

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/), [BoardUI](https://www.boardui.com/)
- **Accessibility & Forms:** [React Aria Components](https://react-spectrum.adobe.com/react-aria/), [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/)
- **Animations:** [Motion](https://motion.dev/)
- **Icons:** [Remix Icon (`@remixicon/react`)](https://remixicon.com/)
- **Linter:** [Oxlint](https://oxc.rs/)
- **Typography:** Google Fonts (**Inter** สำหรับภาษาอังกฤษ/ตัวเลข + **Kanit** สำหรับภาษาไทย)

---

## ❓ คำถามที่พบบ่อย / การแก้ปัญหา (Troubleshooting)

### 1. รัน `npm install` แล้วติด Permission หรือ Error
- แนะนำให้ลบโฟลเดอร์ `node_modules` และ `package-lock.json` แล้วสั่ง `npm install` ใหม่อีกครั้ง
- ตรวจสอบว่าเวอร์ชัน Node.js ไม่ต่ำกว่า 18 (`node -v`)

### 2. พอร์ต 5173 ถูกใช้งานอยู่แล้ว
- Vite จะตรวจจับและเปลี่ยนไปใช้พอร์ตว่างถัดไปอัตโนมัติ (เช่น `http://localhost:5174/`) ให้ดู URL ที่ขึ้นบนหน้าต่าง Terminal

### 3. ต้องการ Deploy ขึ้น Vercel
- โปรเจกต์นี้รองรับ Vercel แบบ 100% Zero-Config
- เพียง Import repository จาก GitHub เข้า Vercel แล้วกด **Deploy** ได้ทันทีโดยไม่ต้องตั้งค่า Build Command เพิ่มเติม

---

## 👨‍💻 ผู้พัฒนา
- **GitHub:** [@sittdata](https://github.com/sittdata)
- **Repository:** [sittdata/pet-hospital](https://github.com/sittdata/pet-hospital)
