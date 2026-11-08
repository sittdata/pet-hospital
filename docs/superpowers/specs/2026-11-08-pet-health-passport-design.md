# Design Doc: Digital Pet Health Passport & Vaccine Tracker

- **Date:** 2026-11-08
- **Feature:** Digital Pet Health Passport & Vaccine Tracker
- **Status:** Proposed / Approved by User
- **Target Audience:** Pet owners visiting the hospital web application and examiners/professors during project demonstration.

---

## 1. Intent & The "Why"
Owners need a clear, centralized view of their pets' preventive healthcare (vaccines, deworming, rabies checks) and past treatments. During emergency or routine triage, quick access to a digital medical card prevents duplicate vaccines and ensures timely booster shots. For academic presentation, it showcases end-to-end client-side state management, BoardUI design system compliance, and domain-driven veterinary data modeling.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- Provide an interactive, slide-over / full-dialog modal for pet owners to inspect and manage their pets' digital health passports.
- Display pet switcher tabs (e.g. Moji the Cat, Chao-Kuay the Dog, Chiko the Bird).
- Visual vaccine timeline categorized by status:
  - `completed` (ได้รับแล้ว พร้อมวันที่และสัตวแพทย์ผู้ฉีด)
  - `upcoming` (ใกล้ถึงกำหนดฉีด / แจ้งเตือนล่วงหน้า)
  - `overdue` (เกินกำหนด / ต้องรีบพบแพทย์)
- Medical encounter history list (วันที่, อาการ/การรักษา, สัตวแพทย์, คำแนะนำ).
- Interactive ability to add a new pet and record a new vaccine dose.
- LocalStorage persistence with sample initial state and a "Reset Demo Data" option.
- 100% BoardUI semantic tokens and responsive support (mobile bottom sheet / desktop dialog).

### Non-Goals
- Real backend API / database sync (uses client-side LocalStorage for demo agility).
- Online payment gateway integration (reserved for future scope).

### Anti-Goals
- Bloating existing components (e.g., cramming passport logic into `BookingModal.tsx`).
- Breaking BoardUI rules (no raw palette classes, no hardcoded colors).

---

## 3. Approaches Considered

- **Approach A (Selected): Modular Component & Local Hook**
  - Create dedicated `src/components/PetHealthPassportModal.tsx`.
  - Create data models in `src/types/petPassport.ts` and initial datasets in `src/data/petPassportData.ts`.
  - Expose access points via `Navbar.tsx` (button with status badge) and `App.tsx`.
  - *Trade-offs:* Clean separation of concerns, zero regression risk on existing booking logic, highly testable.
- **Approach B (Rejected): Embedding into `BookingModal.tsx`**
  - Add tab into the existing booking flow.
  - *Trade-offs:* Makes `BookingModal.tsx` over 1,500 lines, couples appointment creation with medical record browsing.

---

## 4. UI / UX Design & Component Structure

### Clarifications from Builder Review (Calls Settled)
1. **Auth & LocalStorage Scope:** Accessible immediately without mandatory login (Demo Guest Mode). Data stored in `localStorage` under `vetpaws_pet_passports`. If user logs in, records link smoothly without wiping demo pets.
2. **Profile Entry Point:** The user avatar pill in `Navbar.tsx` (when logged in) becomes clickable to open the Passport, in addition to the prominent "สมุดวัคซีน" CTA button in the Navbar.
3. **Booking Integration Boundary:** Quick action "นัดหมายฉีดวัคซีน" invokes existing `handleOpenBooking("ตรวจสุขภาพทั่วไปและฉีดวัคซีน")` passing existing props (`initialPetType`, `initialService`). This preserves zero bloating of `BookingModal.tsx`.

### Components & Files
1. `src/types/petPassport.ts`:
   - Interfaces for `PetPassport`, `VaccineRecord`, `TreatmentHistory`, and vaccine statuses.
2. `src/data/petPassportData.ts`:
   - Pre-populated realistic Thai veterinary data (Rabies, FPV, FVRCP, DHPP, Heartworm, Lyme) with dates and vet names.
   - LocalStorage synchronization helper (`getStoredPassports`, `saveStoredPassports`, `resetStoredPassports`).
3. `src/components/PetHealthPassportModal.tsx`:
   - Header with pet summary (Avatar, Species, Breed, Age, Weight, Microchip ID).
   - Pet switcher pill tabs + "เพิ่มสัตว์เลี้ยง" button.
   - Tab 1: **ตารางวัคซีน & การป้องกัน (Vaccination Timeline)** with status badges and next due dates.
   - Tab 2: **ประวัติการรักษา (Medical History)**.
   - Quick Action: "นัดหมายฉีดวัคซีน" (redirects/pre-fills `BookingModal`).
   - "บันทึกวัคซีนใหม่" modal/inline form.
4. `src/components/Navbar.tsx`:
   - Adds "สมุดวัคซีน" CTA button next to theme toggle and auth button.

---

## 5. Verification Plan
- Type checking: `npm run build` / `npx tsc --noEmit` must pass without any errors.
- Visual check: Light and Dark mode rendering using BoardUI semantic tokens.
- Interactive check:
  1. Open modal from Navbar and Profile.
  2. Switch between different pets.
  3. Add a new vaccine record and verify LocalStorage persistence on page refresh.
  4. Test "นัดหมายฉีดวัคซีน" triggers `BookingModal` smoothly.
