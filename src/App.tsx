import { useState, lazy, Suspense } from 'react';
import { PetType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PetTreatmentExplorer, type TreatmentBookingContext } from './components/PetTreatmentExplorer';
import { Services } from './components/Services';
import Doctors from './components/Doctors';
import { TestimonialsMarqueeGrid } from './components/TestimonialsMarqueeGrid';
import { CustomerChatPhoneMockup } from './components/CustomerChatPhoneMockup';
import { TypewriterText } from './components/TypewriterText';
import { FAQ } from './components/FAQ';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import {
  RiPhoneFill,
  RiCalendarEventLine,
  RiChatSmile2Fill,
  RiCloseLine,
  RiHeartFill,
  RiScissors2Fill,
  RiStethoscopeFill,
  RiHospitalFill,
} from '@remixicon/react';
import { StatCards, type Stat } from '@/components/application/dashboard/stat-cards';
import { PetPassport, VaccineRecord } from './types/petPassport';
import { getStoredPassports, saveStoredPassports } from './data/petPassportData';
import { getDepartmentConsultData, type DepartmentConsultData } from './data/departmentConsultData';

const BookingModal = lazy(() =>
  import('./components/BookingModal').then((m) => ({ default: m.BookingModal }))
);
const VaccineBookingModal = lazy(() =>
  import('./components/VaccineBookingModal').then((m) => ({ default: m.VaccineBookingModal }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const PetHealthPassportModal = lazy(() =>
  import('./components/PetHealthPassportModal').then((m) => ({ default: m.PetHealthPassportModal }))
);
const ChangePasswordModal = lazy(() =>
  import('./components/ChangePasswordModal').then((m) => ({ default: m.ChangePasswordModal }))
);
const LiveChatWidget = lazy(() =>
  import('./components/LiveChatWidget').then((m) => ({ default: m.LiveChatWidget }))
);

const CONSULTATION_PHRASES = [
  'ปรึกษาอาการสัตว์เลี้ยงตลอด 24 ชม.',
  'คัดกรองอาการฉุกเฉินเบื้องต้นใน 5 วินาที',
  'ส่งต่อสัตวแพทย์เวรเฉพาะทางตอบกลับจริง',
  'เปิดคิวตรวจด่วนพร้อมรับมือทุกสถานการณ์',
];

export function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPetType, setBookingPetType] = useState<PetType>('cat');
  const [bookingService, setBookingService] = useState<string>('');
  const [bookingDoctor, setBookingDoctor] = useState<string>('');
  const [bookingInitialSymptoms, setBookingInitialSymptoms] = useState<string>('');

  // Digital Pet Health Passport State
  const [passportModalOpen, setPassportModalOpen] = useState(false);

  // Dedicated Vaccine Booking Modal State
  const [vaccineBookingData, setVaccineBookingData] = useState<{
    pet: PetPassport;
    vaccine: VaccineRecord;
  } | null>(null);

  const handleVaccineBookingSuccess = (updatedPet: PetPassport) => {
    const currentPassports = getStoredPassports(currentUser?.email);
    const exists = currentPassports.some((p) => p.id === updatedPet.id);
    const updatedPassports = exists
      ? currentPassports.map((p) => (p.id === updatedPet.id ? updatedPet : p))
      : [updatedPet, ...currentPassports];
    saveStoredPassports(updatedPassports, currentUser?.email);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vetpaws:passports_updated'));
    }
  };

  // Change Password State
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  // 24/7 Live Triage Chat Widget State
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [vaccineChatContext, setVaccineChatContext] = useState<{
    petName: string;
    breed: string;
    vaccineName: string;
    dueDate?: string;
    veterinarian?: string;
    status: string;
  } | null>(null);
  const [departmentChatContext, setDepartmentChatContext] = useState<DepartmentConsultData | null>(null);

  const handleConsultDepartment = (departmentName: string) => {
    const deptContext = getDepartmentConsultData(departmentName);
    setVaccineChatContext(null);
    setDepartmentChatContext(deptContext);
    setLiveChatOpen(true);
  };

  // BoardUI Auth State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenBooking = (serviceName?: string, doctorName?: string, initialSymptoms?: string) => {
    setBookingService(serviceName || 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน');
    setBookingDoctor(doctorName || '');
    setBookingInitialSymptoms(initialSymptoms || '');
    setBookingModalOpen(true);
  };

  const handleSelectTreatmentBooking = (
    petType: PetType,
    serviceTitle: string,
    context?: TreatmentBookingContext
  ) => {
    setBookingPetType(petType);
    setBookingService(serviceTitle);
    setBookingDoctor('');
    if (context?.symptomsSummary) {
      setBookingInitialSymptoms(`สนใจตรวจโปรแกรม: ${serviceTitle} (อาการที่สังเกต: ${context.symptomsSummary})`);
    } else {
      setBookingInitialSymptoms(`สนใจตรวจโปรแกรม: ${serviceTitle}`);
    }
    setBookingModalOpen(true);
  };

  const hospitalStats: Stat[] = [
    {
      icon: RiHeartFill,
      label: "จำนวนเคสที่เราดูแล",
      value: "421,000+ เคส",
      delta: "เคสสะสม",
      deltaColor: "lime",
      tone: "emerald",
      hint: "สถิติจำนวนสัตว์เลี้ยงที่เข้ารับการดูแลและรักษาสำเร็จสะสมกว่า 421,000 เคส",
      caption: "การรักษาและศัลยกรรมสะสม",
    },
    {
      icon: RiScissors2Fill,
      label: "จำนวนเคสผ่าตัดต่อปี",
      value: "10,000+",
      delta: "ศัลยกรรมและความปลอดภัย",
      deltaColor: "lime",
      tone: "blue",
      hint: "บริการศัลยกรรมและผ่าตัดดูแลรักษาสัตว์เลี้ยงกว่า 10,000 เคสต่อปี",
      caption: "มาตรฐานห้องผ่าตัดปลอดเชื้อ",
    },
    {
      icon: RiStethoscopeFill,
      label: "จำนวนสัตวแพทย์และผู้ช่วย",
      value: "300+",
      delta: "ทีมแพทย์เฉพาะทาง",
      deltaColor: "lime",
      tone: "orange",
      hint: "ทีมอาจารย์สัตวแพทย์ผู้เชี่ยวชาญเฉพาะทางทุกสาขา พร้อมดูแลตลอด 24 ชั่วโมง",
      caption: "พร้อมดูแลทุกเคส 24 ชม.",
    },
    {
      icon: RiHospitalFill,
      label: "ทั้งในและต่างประเทศ",
      value: "21 สาขา",
      delta: "เครือข่ายครอบคลุม",
      deltaColor: "lime",
      tone: "pink",
      hint: "เครือข่ายศูนย์การแพทย์และโรงพยาบาลสัตว์เลี้ยง 21 สาขา ทั้งในประเทศและระดับภูมิภาค",
      caption: "เครือข่ายโรงพยาบาลมาตรฐานสากล",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-full text-text-primary selection:bg-accent-500/20 selection:text-accent-700 relative transition-colors overflow-x-hidden">
      {/* Main Sticky Navbar with ThemeToggle, Auth & Pet Health Passport */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={handleOpenAuth}
        onOpenPassport={() => setPassportModalOpen(true)}
        onOpenChangePassword={() => setChangePasswordModalOpen(true)}
        currentUser={currentUser}
        onSignOut={() => setCurrentUser(null)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenBooking={(pet) => {
          if (pet === 'cat' || pet === 'dog') setBookingPetType(pet);
          handleOpenBooking();
        }} />

        {/* 24/7 Consultation & Hospital KPI Stats Section */}
        <section id="ai-triage" className="py-16 md:py-20 bg-background-secondary-default/50 border-b border-border-button-default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Explanatory Content (Mobile: 1st, Desktop: Right Column Top) */}
              <div className="space-y-2 lg:col-start-6 lg:col-span-7 lg:row-start-1">
                <h2 className="text-title-1-medium text-text-primary tracking-tight">
                  <TypewriterText words={CONSULTATION_PHRASES} />
                  <br />
                  <span className="text-accent-600">ดูแลโดยทีมสัตวแพทย์จริง มั่นใจกว่า 421,000+ เคส</span>
                </h2>
                <p className="text-body-regular text-text-secondary max-w-xl leading-relaxed">
                  หมดกังวลเรื่องสัตว์เลี้ยงป่วยฉุกเฉิน ระบบช่วยบันทึกอาการเบื้องต้นใน 5 วินาที พร้อมส่งต่อสัตวแพทย์เวรตอบกลับจริง และเปิดคิวห้องตรวจด่วนรองรับทันทีตลอด 24 ชั่วโมง
                </p>
              </div>

              {/* Single Interactive Phone Mockup (Mobile: 2nd, Desktop: Left Column spanning rows) */}
              <div className="flex justify-center my-4 lg:my-0 lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-2">
                <CustomerChatPhoneMockup onOpenBooking={(service) => handleOpenBooking(service)} />
              </div>

              {/* 2x2 StatCards & CTA (Mobile: 3rd, Desktop: Right Column Bottom) */}
              <div className="space-y-6 lg:col-start-6 lg:col-span-7 lg:row-start-2">
                {/* 2x2 StatCards Grid (2 แถวบน 2 แถวล่าง) */}
                <div className="pt-1">
                  <StatCards stats={hospitalStats} variant="footer" columns={2} />
                </div>

                {/* Call-to-action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="medium"
                    leadingIcon={RiCalendarEventLine}
                    onClick={() => handleOpenBooking('ศูนย์อายุรกรรมและโรคแมวเฉพาะทาง')}
                  >
                    จองคิวนัดตรวจล่วงหน้า
                  </Button>
                  <ButtonLink
                    href="tel:028889999"
                    variant="danger"
                    size="medium"
                    leadingIcon={RiPhoneFill}
                    className="shadow-lg shadow-status-rose-text/25"
                  >
                    สายด่วนฉุกเฉิน 24 ชม.
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pet-Type Specific Treatment Explorer with Animated Pill Tabs */}
        <PetTreatmentExplorer onSelectBooking={handleSelectTreatmentBooking} />

        {/* Medical Services Catalog */}
        <Services
          onOpenBooking={handleOpenBooking}
          onConsultDepartment={handleConsultDepartment}
        />

        {/* Specialist Veterinary Team */}
        <Doctors onOpenBooking={handleOpenBooking} />

        {/* Aceternity UI Style Testimonials Marquee Grid */}
        <TestimonialsMarqueeGrid />

        {/* Interactive FAQ Section with BoardUI Accordion */}
        <FAQ />

        {/* Location & Operating Hours */}
        <LocationHours />
      </main>

      {/* Hospital Footer */}
      <Footer />

      {/* Floating 24/7 Hotline & Quick Booking Bar */}
      {!bookingModalOpen && !authModalOpen && !passportModalOpen && !vaccineBookingData && (
        <aside
          aria-label="Quick Emergency, Booking and Live Chat Actions"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-background-primary-default/90 backdrop-blur-md border border-border-button-default shadow-xl sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none transition-all"
        >
          {/* Live Chat 24/7 Trigger Button */}
          <Button
            variant={liveChatOpen ? "secondary" : "primary"}
            size="medium"
            leadingIcon={liveChatOpen ? RiCloseLine : RiChatSmile2Fill}
            onClick={() => setLiveChatOpen((prev) => !prev)}
            className={liveChatOpen ? "shadow-lg" : "shadow-lg bg-[#06C755] hover:bg-[#05b34c] text-white border-[#06C755] shadow-[#06C755]/25"}
            title="แชทปรึกษาอาการสัตว์เลี้ยง 24 ชั่วโมง"
          >
            <span className="hidden sm:inline">แชทปรึกษา 24 ชม.</span>
          </Button>

          <ButtonLink
            href="tel:028889999"
            variant="danger"
            size="medium"
            leadingIcon={RiPhoneFill}
            className="shadow-lg shadow-status-rose-text/25"
            title="โทรฉุกเฉินสัตว์เลี้ยง 24 ชั่วโมง"
          >
            <span className="hidden sm:inline">โทรฉุกเฉิน 24 ชม.</span>
          </ButtonLink>

          <Button
            variant="secondary"
            size="medium"
            leadingIcon={RiCalendarEventLine}
            onClick={() => handleOpenBooking()}
            className="shadow-lg"
            title="จองนัดหมายตรวจ"
          >
            <span className="hidden sm:inline">นัดหมาย</span>
          </Button>
        </aside>
      )}

      {/* Digital Pet Health Passport & Vaccine Tracker (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {passportModalOpen && (
          <PetHealthPassportModal
            isOpen={passportModalOpen}
            onClose={() => setPassportModalOpen(false)}
            currentUser={currentUser}
            onBookAppointment={(serviceName, petType) => {
              if (petType === 'cat' || petType === 'dog' || petType === 'exotic' || petType === 'small') {
                setBookingPetType(petType as PetType);
              }
              handleOpenBooking(serviceName || 'ศูนย์ตรวจสุขภาพ ฉีดวัคซีน และเวชศาสตร์ป้องกัน');
            }}
            onBookVaccine={(vaccine, pet) => {
              setPassportModalOpen(false);
              setVaccineBookingData({ pet, vaccine });
            }}
            onConsultVaccine={(vac, pet) => {
              setPassportModalOpen(false);
              setVaccineChatContext({
                petName: pet.name,
                breed: pet.breed,
                vaccineName: vac.name,
                dueDate: vac.dueDate,
                veterinarian: vac.veterinarian,
                status: vac.status,
              });
              setLiveChatOpen(true);
            }}
          />
        )}
      </Suspense>

      {/* Fast-Track 1-Step Vaccine Booking Modal (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {vaccineBookingData && (
          <VaccineBookingModal
            key={`${vaccineBookingData.pet.id}-${vaccineBookingData.vaccine.id}-${vaccineBookingData.vaccine.status}-${vaccineBookingData.vaccine.appointmentDate || ''}`}
            isOpen={!!vaccineBookingData}
            onClose={() => setVaccineBookingData(null)}
            pet={vaccineBookingData.pet}
            vaccine={vaccineBookingData.vaccine}
            currentUser={currentUser}
            onSuccessBooking={handleVaccineBookingSuccess}
            onViewPassport={() => {
              setVaccineBookingData(null);
              setPassportModalOpen(true);
            }}
          />
        )}
      </Suspense>

      {/* Interactive Booking Modal (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {bookingModalOpen && (
          <BookingModal
            key={`${bookingPetType}-${bookingService}-${bookingDoctor}-${bookingInitialSymptoms}`}
            isOpen={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            initialPetType={bookingPetType}
            initialService={bookingService}
            initialDoctor={bookingDoctor}
            initialSymptoms={bookingInitialSymptoms}
            currentUser={currentUser}
            onRequireAuth={() => handleOpenAuth('signin')}
            onLoginSuccess={(user) => setCurrentUser(user)}
            onViewPassport={() => {
              setBookingModalOpen(false);
              setPassportModalOpen(true);
            }}
          />
        )}
      </Suspense>

      {/* BoardUI Official Sign-in & Sign-up Auth Modal (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            initialMode={authMode}
            onSuccess={(user) => {
              setCurrentUser(user);
              if (!liveChatOpen && !bookingModalOpen) {
                setPassportModalOpen(true);
              }
            }}
          />
        )}
      </Suspense>

      {/* Change Password Modal for Authenticated Users (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {changePasswordModalOpen && (
          <ChangePasswordModal
            isOpen={changePasswordModalOpen}
            onClose={() => setChangePasswordModalOpen(false)}
            currentUser={currentUser}
          />
        )}
      </Suspense>

      {/* 24/7 Live Interactive Triage Chat Widget (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {liveChatOpen && (
          <LiveChatWidget
            isOpen={liveChatOpen}
            onClose={() => {
              setLiveChatOpen(false);
              setDepartmentChatContext(null);
            }}
            onOpenBooking={(service?: string, doctor?: string) => handleOpenBooking(service, doctor)}
            isLoggedIn={!!currentUser}
            currentUser={currentUser}
            onRequireAuth={() => handleOpenAuth('signin')}
            initialVaccineContext={vaccineChatContext}
            onClearInitialVaccineContext={() => setVaccineChatContext(null)}
            initialDepartmentContext={departmentChatContext}
            onClearInitialDepartmentContext={() => setDepartmentChatContext(null)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
