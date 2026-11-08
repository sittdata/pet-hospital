# Digital Pet Health Passport & Vaccine Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular, interactive Digital Pet Health Passport & Vaccine Tracker modal for pet owners, enabling multi-pet switching, vaccination status tracking, treatment history browsing, and LocalStorage persistence with zero regression on existing features.

**Architecture:** A standalone presentation modal (`PetHealthPassportModal.tsx`) backed by a dedicated typed data store and local storage sync layer (`src/types/petPassport.ts`, `src/data/petPassportData.ts`). Integrated into `Navbar.tsx` and `App.tsx` via existing props and lightweight event dispatching.

**Tech Stack:** React 19, TypeScript, BoardUI semantic tokens (`@/components/base/*`), `@remixicon/react`, Tailwind CSS v4, LocalStorage.

**Spec:** [docs/superpowers/specs/2026-11-08-pet-health-passport-design.md](file:///c:/Users/sitti/Desktop/pet-hospital/docs/superpowers/specs/2026-11-08-pet-health-passport-design.md)

## Global Constraints

- 100% BoardUI semantic tokens (`bg-background-primary-default`, `text-text-primary`, `border-border-button-default`, `rounded-3xl`, etc.). No raw palette classes or hardcoded hex colors.
- Zero bloat to `BookingModal.tsx`.
- Must compile cleanly with `npm run build` (`tsc -b && vite build`) and pass `npm run lint`.
- Mobile responsive: bottom drawer / full-screen dialog on mobile, centered modal on desktop.

## Review Focus

1. **LocalStorage Corruption or Missing Key:** Must gracefully fall back to default mock data if stored JSON is corrupted or invalid.
2. **Empty Pet / No Pet Selected:** Guard against null pointer when switching or deleting pets.
3. **Overdue Vaccine Calculation:** Ensure date comparison handles past, today, and future dates accurately to determine badge color.
4. **Escape Key & Focus Trap:** Modal must trap focus, dismiss on `Escape`, and restore background scrolling properly.
5. **Dark Mode Readability:** Status dots and table badges must maintain sufficient contrast in both light and dark themes.

---

### Task 1: Data Models and LocalStorage Data Layer

**Files:**
- Create: `src/types/petPassport.ts`
- Create: `src/data/petPassportData.ts`

**Interfaces:**
- Produces:
  - `interface VaccineRecord { id: string; name: string; dateAdministered?: string; dueDate?: string; status: 'completed' | 'upcoming' | 'overdue'; veterinarian?: string; lotNumber?: string; notes?: string; }`
  - `interface TreatmentRecord { id: string; date: string; diagnosis: string; veterinarian: string; clinicDepartment: string; treatment: string; notes?: string; }`
  - `interface PetPassport { id: string; name: string; petType: 'cat' | 'dog' | 'exotic' | 'bird' | 'aquatic'; breed: string; gender: 'male' | 'female'; age: string; weight: string; microchipNo: string; ownerName: string; avatarUrl?: string; vaccines: VaccineRecord[]; treatments: TreatmentRecord[]; }`
  - `getStoredPassports(): PetPassport[]`
  - `saveStoredPassports(passports: PetPassport[]): void`
  - `resetStoredPassports(): PetPassport[]`

- [ ] **Step 1: Create `src/types/petPassport.ts` with complete type definitions**
- [ ] **Step 2: Create `src/data/petPassportData.ts` with realistic Thai mock veterinary data (Moji, Chao-Kuay, Chiko) and safe LocalStorage helper functions**
- [ ] **Step 3: Run TypeScript build check to ensure types are valid**
  Run: `npx tsc --noEmit`
  Expected: PASS with 0 errors
- [ ] **Step 4: Commit**
  ```bash
  git add src/types/petPassport.ts src/data/petPassportData.ts
  git commit -m "feat(passport): add data models and local storage helpers"
  ```

---

### Task 2: Pet Health Passport Modal Component

**Files:**
- Create: `src/components/PetHealthPassportModal.tsx`

**Interfaces:**
- Consumes: `PetPassport`, `VaccineRecord`, `TreatmentRecord` from `src/types/petPassport.ts` and helpers from `src/data/petPassportData.ts`
- Produces:
  - `interface PetHealthPassportModalProps { isOpen: boolean; onClose: () => void; onBookAppointment: (serviceName?: string, petType?: string) => void; }`
  - `export const PetHealthPassportModal: React.FC<PetHealthPassportModalProps>`

- [ ] **Step 1: Implement `PetHealthPassportModal.tsx` layout and header (Pet switcher tabs, pet bio summary card, avatar)**
- [ ] **Step 2: Implement Tab 1 - Vaccination Timeline (status badges, date badges, lot numbers, 'บันทึกวัคซีน' inline form, 'นัดหมายฉีดวัคซีน' CTA)**
- [ ] **Step 3: Implement Tab 2 - Medical History Timeline (date, clinic department, attending veterinarian, prescription/notes)**
- [ ] **Step 4: Implement 'เพิ่มสัตว์เลี้ยงใหม่' sub-flow and 'รีเซ็ตข้อมูลตัวอย่าง' action**
- [ ] **Step 5: Verify modal compilation and linting**
  Run: `npm run lint`
  Expected: PASS
- [ ] **Step 6: Commit**
  ```bash
  git add src/components/PetHealthPassportModal.tsx
  git commit -m "feat(passport): create PetHealthPassportModal component with BoardUI tokens"
  ```

---

### Task 3: Navbar and App Integration

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `PetHealthPassportModal` from `src/components/PetHealthPassportModal.tsx`
- Produces:
  - Navbar prop: `onOpenPassport?: () => void`
  - App state: `passportModalOpen: boolean`

- [ ] **Step 1: Update `src/components/Navbar.tsx` to add "สมุดวัคซีน" CTA button and link user profile avatar to open passport**
- [ ] **Step 2: Update `src/App.tsx` with lazy loaded `PetHealthPassportModal`, state handler, and appointment booking redirection**
- [ ] **Step 3: Run TypeScript compiler and Vite build**
  Run: `npm run build`
  Expected: PASS with 0 errors
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/Navbar.tsx src/App.tsx
  git commit -m "feat(passport): wire passport modal to Navbar and App"
  ```

---

### Task 4: End-to-End Verification and Polish

**Files:**
- Verify: Full web app build and interaction

- [ ] **Step 1: Execute full build and lint check**
  Run: `npm run build && npm run lint`
  Expected: Both exit with code 0
- [ ] **Step 2: Verify responsive design, dark/light theme switching, and local storage read/write**
- [ ] **Step 3: Final commit**
  ```bash
  git add -A
  git commit -m "chore(passport): verify and complete pet health passport feature"
  ```
