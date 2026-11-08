import { useState, lazy, Suspense } from 'react';
import { PetType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PetTreatmentExplorer } from './components/PetTreatmentExplorer';
import { Services } from './components/Services';
import Doctors from './components/Doctors';
import { CustomerChatPhoneMockup } from './components/CustomerChatPhoneMockup';
import { TypewriterText } from './components/TypewriterText';
import { FAQ } from './components/FAQ';
import { LocationHours } from './components/LocationHours';
import { Footer } from './components/Footer';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import {
  RiPhoneFill,
  RiCalendarEventLine,
  RiHeartFill,
  RiScissors2Fill,
  RiStethoscopeFill,
  RiHospitalFill,
} from '@remixicon/react';
import { StatCards, type Stat } from '@/components/application/dashboard/stat-cards';

const BookingModal = lazy(() =>
  import('./components/BookingModal').then((m) => ({ default: m.BookingModal }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const PetHealthPassportModal = lazy(() =>
  import('./components/PetHealthPassportModal').then((m) => ({ default: m.PetHealthPassportModal }))
);

export function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPetType, setBookingPetType] = useState<PetType>('cat');
  const [bookingService, setBookingService] = useState<string>('');
  const [bookingDoctor, setBookingDoctor] = useState<string>('');

  // Digital Pet Health Passport State
  const [passportModalOpen, setPassportModalOpen] = useState(false);

  // BoardUI Auth State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenBooking = (serviceName?: string, doctorName?: string) => {
    if (serviceName) setBookingService(serviceName);
    setBookingDoctor(doctorName || '');
    setBookingModalOpen(true);
  };

  const handleSelectTreatmentBooking = (petType: PetType, serviceTitle: string) => {
    setBookingPetType(petType);
    setBookingService(serviceTitle);
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
      delta: "Grooming & Spa",
      deltaColor: "lime",
      tone: "blue",
      hint: "บริการศัลยกรรมและผ่าตัดดูแลรักษาสัตว์เลี้ยงกว่า 10,000 เคสต่อปี",
      caption: "มาตรฐานสุขอนามัยสัตว์เลี้ยง",
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
              {/* Left Column: Interactive Phone Mockup (Desktop only) */}
              <div className="hidden lg:flex lg:col-span-5 justify-center">
                <CustomerChatPhoneMockup onOpenBooking={(service) => handleOpenBooking(service)} />
              </div>

              {/* Right Column: Explanatory Content, Phone Mockup (Mobile), & 2x2 StatCards */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-title-1-medium text-text-primary tracking-tight">
                    <TypewriterText words={['ปรึกษาอาการสัตว์เลี้ยงตลอด 24 ชม.']} />
                    <br />
                    <span className="text-accent-600">ดูแลโดยทีมสัตวแพทย์จริง มั่นใจกว่า 421,000+ เคส</span>
                  </h2>
                  <p className="text-body-regular text-text-secondary max-w-xl leading-relaxed">
                    หมดกังวลเรื่องสัตว์เลี้ยงป่วยฉุกเฉิน ระบบช่วยบันทึกอาการเบื้องต้นใน 5 วินาที พร้อมส่งต่อสัตวแพทย์เวรตอบกลับจริง และเปิดคิวห้องตรวจด่วนรองรับทันทีตลอด 24 ชั่วโมง
                  </p>
                </div>

                {/* Mobile/Responsive Only: Interactive Phone Mockup placed right below description */}
                <div className="block lg:hidden my-6 flex justify-center">
                  <CustomerChatPhoneMockup onOpenBooking={(service) => handleOpenBooking(service)} />
                </div>

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
                    onClick={() => handleOpenBooking('บริการตรวจวินิจฉัยและรักษาอายุรกรรม')}
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
        <Services onOpenBooking={handleOpenBooking} />

        {/* Specialist Veterinary Team */}
        <Doctors onOpenBooking={handleOpenBooking} />

        {/* Interactive FAQ Section with BoardUI Accordion */}
        <FAQ />

        {/* Location & Operating Hours */}
        <LocationHours />
      </main>

      {/* Hospital Footer */}
      <Footer />

      {/* Floating 24/7 Hotline & Quick Booking Bar */}
      {!bookingModalOpen && !authModalOpen && !passportModalOpen && (
        <aside
          aria-label="Quick Emergency and Booking Actions"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-background-primary-default/90 backdrop-blur-md border border-border-button-default shadow-xl sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none transition-all"
        >
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
            variant="primary"
            size="medium"
            leadingIcon={RiCalendarEventLine}
            onClick={() => handleOpenBooking()}
            className="shadow-lg shadow-accent-500/25"
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
            onBookAppointment={(serviceName, petType) => {
              if (petType === 'cat' || petType === 'dog' || petType === 'exotic') {
                setBookingPetType(petType as PetType);
              }
              handleOpenBooking(serviceName || 'ตรวจสุขภาพทั่วไปและฉีดวัคซีน');
            }}
          />
        )}
      </Suspense>

      {/* Interactive Booking Modal (Code Splitting with Suspense) */}
      <Suspense fallback={null}>
        {bookingModalOpen && (
          <BookingModal
            key={`${bookingPetType}-${bookingService}-${bookingDoctor}`}
            isOpen={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            initialPetType={bookingPetType}
            initialService={bookingService}
            initialDoctor={bookingDoctor}
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
              setPassportModalOpen(true);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
