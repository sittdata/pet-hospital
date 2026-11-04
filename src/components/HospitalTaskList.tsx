import React from 'react';
import {
  RiHospitalLine,
  RiShieldCheckLine,
  RiPulseLine,
  RiCheckLine,
} from '@remixicon/react';
import { TaskList, TaskItem } from '@/components/application/task-list/task-list';

const pulseIcon = <RiPulseLine className="size-3.5 text-status-lime-text" />;
const successIcon = <RiCheckLine className="size-3.5 text-status-lime-text" />;

const compactPatientJourneyTasks: TaskItem[] = [
  {
    title: 'รับเคสฉุกเฉินและคัดกรองเบื้องต้น',
    runningTitle: 'รับเคส: ตรวจคัดกรองสัญญาณชีพฉุกเฉิน',
    icon: RiHospitalLine,
    steps: [
      {
        label: 'รับน้อง "มีตังค์" (โกลเด้น 4 ปี) กลืนสิ่งแปลกปลอม',
        chips: [{ label: 'ER 24 ชม.' }, { label: '28.5 kg' }],
      },
      {
        label: 'ตรวจวัดสัญญาณชีพวิกฤต',
        chips: [
          { label: 'SpO2 99%', icon: pulseIcon },
          { label: 'HR 128 bpm' },
        ],
      },
      {
        label: 'เอกซเรย์ดิจิทัลระบุตำแหน่งสิ่งแปลกปลอม',
        chips: [{ label: 'Digital X-Ray DR' }],
      },
    ],
  },
  {
    title: 'ส่องกล้องรักษาและส่งน้องกลับบ้าน',
    runningTitle: 'กำลังทำหัตถการส่องกล้อง Endoscopy ไร้แผล',
    icon: RiShieldCheckLine,
    steps: [
      {
        label: 'ส่องกล้อง Endoscopy คีบสิ่งแปลกปลอมสำเร็จ',
        chips: [{ label: 'ไร้แผลผ่าตัด 100%', icon: successIcon }],
      },
      {
        label: 'พักฟื้นในตู้ให้ออกซิเจน สัญญาณชีพคงที่',
        chips: [{ label: 'ICU Recovery' }],
      },
      {
        label: 'แพทย์สรุปผลการรักษา ส่งน้องกลับบ้านปลอดภัย',
        chips: [{ label: 'Discharge สำเร็จ', icon: successIcon }],
      },
    ],
  },
];

export const HospitalTaskList: React.FC = () => {
  return (
    <div className="w-full pt-1">
      <TaskList
        tasks={compactPatientJourneyTasks}
        run={true}
        stepInterval={700}
        startDelay={250}
        working="Working"
        allowReplay={true}
        className="border-0 bg-transparent p-0 shadow-none text-[13px]"
      />
    </div>
  );
};
