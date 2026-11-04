import React from 'react';
import {
  RiStarFill,
  RiDoubleQuotesL,
  RiShieldCheckLine,
} from '@remixicon/react';
import { Avatar } from '@/components/base/avatar/avatar';
import { Chip } from '@/components/base/badges/chip';

export const Reviews: React.FC = () => {
  const reviews = [
    {
      author: 'คุณพัชรา และน้องโมจิ (แมวสก็อตติช)',
      initial: 'พ',
      text: 'ประทับใจโซน Cat Friendly มากค่ะ น้องโมจิไม่เครียดเลย ปกติไปคลินิกอื่นจะขู่และร้องเสียงดัง ที่นี่คุณหมอใจเย็น มือเบามาก ผลตรวจเลือดละเอียดและอธิบายเข้าใจง่าย',
      rating: 5,
      service: 'คลินิกแมวและตรวจสุขภาพประจำปี',
    },
    {
      author: 'คุณธีรเดช และน้องลัคกี้ (โกลเด้น รีทรีฟเวอร์)',
      initial: 'ธ',
      text: 'ลัคกี้ผ่าตัดเอ็นไขว้หน้าเข่า TPLO กับคุณหมอณัฐพงศ์ หลังผ่าตัด 3 สัปดาห์เดินได้แทบเป็นปกติ ทีมกายภาพธาราบำบัดดูแลดีมาก คุ้มค่าและวางใจได้เต็มที่ครับ',
      rating: 5,
      service: 'ศูนย์ศัลยกรรมกระดูกและธาราบำบัด',
    },
    {
      author: 'คุณกุลธิดา และน้องบันนี่ (กระต่ายฮอลแลนด์ลอป)',
      initial: 'ก',
      text: 'กระต่ายท้องอืดตอนตีสอง ไม่ยอมกินหญ้า มาที่ศูนย์ฉุกเฉินคุณหมอเข้าตรวจทันที ให้สารน้ำอุ่นและยาระบายในตู้อบ ออกซิเจนดีมาก น้องรอดชีวิตเพราะความพร้อมของที่นี่จริงๆ ขอบคุณทีมแพทย์ค่ะ',
      rating: 5,
      service: 'ศูนย์ฉุกเฉินสัตว์พิเศษ 24 ชม.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background-secondary-default border-b border-border-button-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
            ความไว้วางใจจากครอบครัวสัตว์เลี้ยง
          </h2>
          <p className="mt-2 text-body-medium text-text-secondary leading-relaxed">
            เพราะทุกชีวิตเปรียบเสมือนสมาชิกคนสำคัญในครอบครัว เราจึงทุ่มเทดูแลด้วยหัวใจในทุกเคส
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-background-primary-default rounded-3xl p-6 sm:p-7 border border-border-button-default shadow-xs hover:border-accent-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & verified chip */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-status-yellow-text">
                    {[...Array(rev.rating)].map((_, i) => (
                      <RiStarFill key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <Chip color="lime" variant="caption">
                    <RiShieldCheckLine className="size-3 inline mr-1" />
                    Verified Owner
                  </Chip>
                </div>

                <RiDoubleQuotesL className="size-6 text-accent-400/40 mb-2" />
                <p className="text-body-medium text-text-primary leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-border-button-default flex items-center gap-3">
                <Avatar size="md" initials={rev.initial} />
                <div>
                  <div className="font-bold text-caption-1-semibold text-text-primary flex items-center gap-1.5">
                    <span>{rev.author}</span>
                  </div>
                  <span className="text-caption-2-medium text-accent-500 block mt-0.5">
                    {rev.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
