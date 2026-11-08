import React, { useState } from 'react';
import { 
  RiHeartPulseLine, 
  RiEyeLine, 
  RiMedicineBottleLine, 
  RiScissors2Line, 
  RiPsychotherapyLine, 
  RiStethoscopeLine,
  RiCalendarCheckLine,
  RiArrowDownSLine,
  RiArrowUpSLine
} from '@remixicon/react';
import { cx } from '@/utils/cx';

interface Doctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  schedule: string;
  avatarUrl?: string;
}

interface Department {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  doctors: Doctor[];
}

const DEPARTMENTS_DATA: Department[] = [
  {
    id: 'cardio',
    name: 'ศูนย์หัวใจและหลอดเลือด',
    icon: RiHeartPulseLine,
    description: 'วินิจฉัยและรักษาโรคหัวใจ ตรวจคลื่นไฟฟ้าหัวใจ (ECG) และอัลตราซาวด์หัวใจขั้นสูง',
    doctors: [
      {
        id: 'doc-1',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
        name: 'สพ.ญ. วรินทร์ธร สุขเกษม',
        degree: 'วท.บ., สพ.บ. (เกียรตินิยม), วุฒิบัตรอายุรศาสตร์โรคหัวใจ',
        specialty: 'อายุรศาสตร์โรคหัวใจและหลอดเลือดสัตว์เลี้ยง',
        schedule: 'จันทร์ - พุธ (09:00 - 17:00 น.)',
      },
      {
        id: 'doc-2',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
        name: 'น.สพ. ปิยะวัฒน์ เจริญผล',
        degree: 'สพ.บ., ป.บัณฑิตคลินิกสัตว์เลี้ยงบำบัดวิกฤต',
        specialty: 'ภาวะหัวใจล้มเหลวเฉียบพลันและระบบไหลเวียนโลหิต',
        schedule: 'พฤหัสบดี - เสาร์ (10:00 - 19:00 น.)',
      },
    ],
  },
  {
    id: 'surgery',
    name: 'ศูนย์ศัลยกรรมและกระดูก',
    icon: RiScissors2Line,
    description: 'ผ่าตัดเนื้อเยื่ออ่อน ผ่าตัดกระดูก ข้อต่อ ผ่าตัดส่องกล้อง และศัลยกรรมระบบประสาท',
    doctors: [
      {
        id: 'doc-3',
        avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
        name: 'น.สพ. ดร. ณัฐพล วัฒนศิริ',
        degree: 'สพ.บ., ปร.ด. ศัลยศาสตร์ทางสัตวแพทย์',
        specialty: 'ศัลยกรรมกระดูกและข้อต่อขั้นสูง (Orthopedics)',
        schedule: 'อังคาร, ศุกร์, อาทิตย์ (09:00 - 18:00 น.)',
      },
      {
        id: 'doc-4',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813637-8e68e4c76b1b?w=500&auto=format&fit=crop&q=80',
        name: 'สพ.ญ. กานต์พิชชา พงษ์ศิริ',
        degree: 'สพ.บ., วุฒิบัตรศัลยกรรมเนื้อเยื่ออ่อน',
        specialty: 'ศัลยกรรมเนื้อเยื่ออ่อนและการผ่าตัดส่องกล้องแผลเล็ก',
        schedule: 'จันทร์ - พฤหัสบดี (13:00 - 20:00 น.)',
      },
    ],
  },
  {
    id: 'eye',
    name: 'ศูนย์โรคตาและจักษุกรรม',
    icon: RiEyeLine,
    description: 'ตรวจวินิจฉัยต้อกระจก ต้อหิน แผลหลุมกระจกตา และผ่าตัดจุลศัลยกรรมตา',
    doctors: [
      {
        id: 'doc-5',
        avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80',
        name: 'สพ.ญ. ภัทรพร รัตนพาณิชย์',
        degree: 'สพ.บ., ประกาศนียบัตรจักษุวิทยาทางสัตวแพทย์ขั้นสูง',
        specialty: 'จุลศัลยกรรมตาและผ่าตัดสลายต้อกระจก',
        schedule: 'พุธ - อาทิตย์ (10:00 - 17:00 น.)',
      },
    ],
  },
  {
    id: 'exotic',
    name: 'ศูนย์สัตว์เลี้ยงพิเศษ',
    icon: RiPsychotherapyLine,
    description: 'เชี่ยวชาญการดูแลกระต่าย กระรอก นก ชูก้าไกลเดอร์ สัตว์เลื้อยคลาน และสัตว์ฟันแทะ',
    doctors: [
      {
        id: 'doc-6',
        avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80',
        name: 'น.สพ. ธีรภัทร ชาญวิริยะ',
        degree: 'สพ.บ., วิทยาศาสตรมหาบัณฑิต (อายุรศาสตร์สัตว์ป่าและสัตว์พิเศษ)',
        specialty: 'อายุรศาสตร์และศัลยกรรมกระต่ายและสัตว์ฟันแทะ',
        schedule: 'ทุกวันพุธ - เสาร์ (11:00 - 20:00 น.)',
      },
    ],
  },
  {
    id: 'internal',
    name: 'ศูนย์อายุรกรรมและโรคแมวเฉพาะทาง',
    icon: RiMedicineBottleLine,
    description: 'รักษาโรคเรื้อรัง เบาหวาน ไตวาย ตับ ตลอดจนการดูแลแบบ Cat-Friendly Clinic',
    doctors: [
      {
        id: 'doc-7',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        name: 'สพ.ญ. มัลลิกา ศิริทรัพย์',
        degree: 'สพ.บ. (เกียรตินิยมอันดับหนึ่ง), ISFM Cat Friendly Veterinarian',
        specialty: 'อายุรศาสตร์โรคแมวและต่อมไร้ท่อ',
        schedule: 'จันทร์ - ศุกร์ (09:00 - 16:00 น.)',
      },
      {
        id: 'doc-8',
        avatarUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=80',
        name: 'น.สพ. เอกรินทร์ สมบูรณ์ทรัพย์',
        degree: 'สพ.บ., ป.โท อายุรศาสตร์สัตว์เลี้ยง',
        specialty: 'โรคระบบทางเดินอาหารและระบบทางเดินปัสสาวะ',
        schedule: 'เสาร์ - พุธ (12:00 - 21:00 น.)',
      },
    ],
  },
  {
    id: 'emergency',
    name: 'ศูนย์ฉุกเฉินและบำบัดวิกฤต 24 ชั่วโมง',
    icon: RiStethoscopeLine,
    description: 'ทีมแพทย์และพยาบาลพร้อมกู้ชีพ ฉุกเฉิน อุบัติเหตุ และเฝ้าระวังผู้ป่วยหนักตลอด 24 ชม.',
    doctors: [
      {
        id: 'doc-9',
        avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
        name: 'น.สพ. ชินดนัย กิตติคุณ',
        degree: 'สพ.บ., Cert. Emergency & Critical Care',
        specialty: 'เวชศาสตร์ฉุกเฉินและการกู้ชีพขั้นสูง',
        schedule: 'ประจำการผลัดดึกและเคสฉุกเฉิน 24 ชั่วโมง',
      },
      {
        id: 'doc-10',
        avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
        name: 'สพ.ญ. ลลิตา บุญประเสริฐ',
        degree: 'สพ.บ., สัตวแพทย์ประจำแผนกวิกฤต',
        specialty: 'การจัดการความเจ็บปวดและการดูแลผู้ป่วยวิกฤต (ICU)',
        schedule: 'ประจำการเคสฉุกเฉิน 24 ชั่วโมง',
      },
    ],
  },
];

export interface DoctorsProps {
  onOpenBooking?: (serviceName?: string, doctorName?: string) => void;
}

export default function Doctors({ onOpenBooking }: DoctorsProps = {}) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'all') {
      setIsExpanded(true);
    }
  };

  const filteredDepartments = activeTab === 'all' 
    ? DEPARTMENTS_DATA 
    : DEPARTMENTS_DATA.filter((dept) => dept.id === activeTab);

  return (
    <section id="doctors" className="py-16 md:py-24 bg-background-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* หัวข้อหลัก */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-button-default bg-background-secondary-default text-text-secondary text-caption-1-semibold mb-4">
            <RiStethoscopeLine className="w-4 h-4 text-foreground-icon-primary" />
            <span>Specialist Veterinary Team</span>
          </div>
          <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight mb-4">
            ทีมสัตวแพทย์ผู้เชี่ยวชาญเฉพาะทาง
          </h2>
          <p className="text-body-regular text-text-secondary">
            พร้อมดูแลสัตว์เลี้ยงแสนรักของคุณด้วยทีมแพทย์เฉพาะทางหลากสาขา อุปกรณ์ตรวจวินิจฉัยทันสมัย และมาตรฐานการรักษาระดับสากลตลอด 24 ชั่วโมง
          </p>
        </div>

        {/* แถบตัวกรองศูนย์การแพทย์ (Filter Tabs) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-full text-body-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover border border-border-button-default'
            }`}
          >
            ศูนย์ทั้งหมด
          </button>
          {DEPARTMENTS_DATA.map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                type="button"
                key={dept.id}
                onClick={() => handleTabChange(dept.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-body-medium transition-colors ${
                  activeTab === dept.id
                    ? 'bg-accent-600 text-white shadow-sm'
                    : 'bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover border border-border-button-default'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{dept.name}</span>
              </button>
            );
          })}
        </div>

        {/* รายชื่อศูนย์และแพทย์ */}
        <div className="relative">
          <div
            className={cx(
              'space-y-16 transition-all duration-500 ease-in-out',
              activeTab === 'all' && !isExpanded
                ? 'max-h-[500px] sm:max-h-[530px] overflow-hidden'
                : 'max-h-none'
            )}
          >
            {filteredDepartments.map((dept) => {
            const DeptIcon = dept.icon;
            return (
              <div key={dept.id} className="space-y-6">
                {/* แถบหัวข้อศูนย์ */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-separator-border gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-background-secondary-default border border-border-button-default text-foreground-icon-primary">
                      <DeptIcon className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="text-title-3-semibold text-text-primary">
                        {dept.name}
                      </h3>
                      <p className="text-body-2-regular text-text-tertiary">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid การ์ดแพทย์ในศูนย์นั้นๆ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dept.doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="group flex flex-col justify-between p-6 rounded-3xl bg-background-secondary-default border border-border-button-default hover:border-border-button-hover transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <div className="space-y-4">
                        {/* Doctor Portrait Photo */}
                        <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-background-tertiary-default border-2 border-border-button-default shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          {doctor.avatarUrl ? (
                            <img
                              src={doctor.avatarUrl}
                              alt={doctor.name}
                              loading="lazy"
                              className="size-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-20 h-20 text-text-placeholder translate-y-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>

                        {/* รายละเอียดแพทย์ */}
                        <div className="text-center space-y-1.5">
                          <h4 className="text-headline-medium text-text-primary group-hover:text-accent-600 transition-colors">
                            {doctor.name}
                          </h4>
                          <p className="text-caption-1-semibold text-accent-600">
                            {doctor.specialty}
                          </p>
                          <p className="text-body-2-regular text-text-tertiary text-xs line-clamp-2">
                            {doctor.degree}
                          </p>
                        </div>
                      </div>

                      {/* ตารางออกตรวจ */}
                      <div className="mt-6 pt-4 border-t border-separator-border flex items-center justify-between gap-2 text-body-2-regular text-text-secondary text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <RiCalendarCheckLine className="w-4 h-4 text-foreground-icon-tertiary shrink-0" />
                          <span className="truncate">{doctor.schedule}</span>
                        </div>
                        {onOpenBooking && (
                          <button
                            type="button"
                            onClick={() => onOpenBooking(dept.name, doctor.name)}
                            className="shrink-0 px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors font-medium text-caption-2-bold"
                          >
                            นัดตรวจ
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          </div>

          {/* Aceternity UI style multi-layer progressive backdrop blur & frosted glass Show More button */}
          {activeTab === 'all' && !isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none flex items-end justify-center pb-10 sm:pb-12 z-10 overflow-hidden">
              {/* Progressive Blur Layer 1 (Subtle top feather) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_50%,transparent_100%)]"
              />
              {/* Progressive Blur Layer 2 (Medium middle blur) */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-48 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_40%,transparent_100%)]"
              />
              {/* Progressive Blur Layer 3 (Deep frosted blur directly behind button) */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-32 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_30%,transparent_100%)]"
              />

              {/* Surface color wash for seamless blend with page background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-background-full via-background-full/85 to-transparent"
              />

              {/* Aceternity Style Frameless Text Trigger */}
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="relative z-10 pointer-events-auto inline-flex items-center gap-1.5 text-body-medium sm:text-headline-medium text-text-primary hover:text-accent-500 font-medium transition-colors duration-200 cursor-pointer group select-none"
              >
                <span>แสดงทีมแพทย์และศูนย์บริการทั้งหมด ({DEPARTMENTS_DATA.length} ศูนย์)</span>
                <RiArrowDownSLine className="w-4 h-4 text-text-secondary group-hover:text-accent-500 group-hover:translate-y-0.5 transition-all" />
              </button>
            </div>
          )}

          {/* Show less button when expanded */}
          {activeTab === 'all' && isExpanded && (
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer group select-none"
              >
                <span>ย่อแสดงเฉพาะส่วน</span>
                <RiArrowUpSLine className="w-4 h-4 text-text-secondary group-hover:text-text-primary group-hover:-translate-y-0.5 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
