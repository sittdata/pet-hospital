import React from 'react';
import { Accordion, AccordionItem } from '@/components/base/accordion/accordion';

export const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-16 sm:py-20 bg-background-primary-default border-b border-border-button-default transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-title-1-semibold sm:text-large-title-bold text-text-primary tracking-tight">
            คำถามที่พบบ่อย (FAQ)
          </h2>
          <p className="mt-2 text-body-medium text-text-secondary leading-relaxed">
            ข้อแนะนำและคำตอบสำหรับเจ้าของสัตว์เลี้ยง เพื่อการเตรียมตัวและเข้ารับการรักษาอย่างราบรื่น
          </p>
        </div>

        <div className="bg-background-secondary-default rounded-3xl p-6 sm:p-8 border border-border-button-default shadow-xs">
          <Accordion variant="separated" defaultExpandedKeys={['item-1']}>
            <AccordionItem
              id="item-1"
              title="สัตว์เลี้ยงประสบอุบัติเหตุฉุกเฉินตอนดึก ต้องโทรแจ้งล่วงหน้าไหม?"
            >
              <div className="text-body-medium text-text-secondary leading-relaxed space-y-2">
                <p>
                  ศูนย์ฉุกเฉินและ ICU ของโรงพยาบาลเปิดรับเคส 24 ชั่วโมงโดยไม่ต้องนัดหมายล่วงหน้า อย่างไรก็ตาม 
                  <strong>แนะนำให้โทรแจ้งเจ้าหน้าที่ด่วนที่เบอร์ 02-888-9999 ขณะกำลังเดินทาง</strong> 
                  เพื่อให้ทีมกู้ชีพ สัตวแพทย์เวรฉุกเฉิน และห้องผ่าตัดเตรียมอุปกรณ์ช่วยชีวิต ออกซิเจน และคลังเลือดไว้พร้อมทันทีที่มาถึง
                </p>
              </div>
            </AccordionItem>

            <AccordionItem
              id="item-2"
              title="ทำไมแมวถึงต้องมีโซนและห้องตรวจแยกจากสุนัขโดยเฉพาะ (Cat Friendly)?"
            >
              <div className="text-body-medium text-text-secondary leading-relaxed space-y-2">
                <p>
                  แมวเป็นสัตว์ที่ไวต่อเสียง กลิ่น และความเครียดจากสัตว์นักล่าอย่างสุนัข โรงพยาบาลเราได้รับรองมาตรฐาน 
                  <strong>ISFM Gold Standard Cat Friendly Clinic</strong> โดยมีห้องรอตรวจแยกเฉพาะแบบเก็บเสียง 
                  เครื่องพ่นฟีโรโมนสังเคราะห์ (Feliway) เพื่อสร้างความผ่อนคลาย และห้องพักฟื้นผู้ป่วยใน (IPD) ที่มองไม่เห็นสุนัข
                </p>
              </div>
            </AccordionItem>

            <AccordionItem
              id="item-3"
              title="สัตว์พิเศษ Exotic Pets (กระต่าย นก ชินชิลล่า ชูการ์ไกลเดอร์) มีแพทย์ประจำทุกวันไหม?"
            >
              <div className="text-body-medium text-text-secondary leading-relaxed space-y-2">
                <p>
                  เรามีทีมสัตวแพทย์ด้านสัตว์พิเศษ (Exotic Pets & Small Mammals) ประจำทุกวัน โดยมีอุปกรณ์เฉพาะทาง 
                  เช่น ตู้อบควบคุมอุณหภูมิและความชื้น (Incubator), เครื่องดมยาสลบ Isoflurane อัตราไหลต่ำสำหรับสัตว์น้ำหนักน้อย, 
                  และเครื่องตรวจฟันสัตว์ฟันแทะโดยเฉพาะ
                </p>
              </div>
            </AccordionItem>

            <AccordionItem
              id="item-4"
              title="การประเมินค่ารักษาพยาบาล และสามารถผ่อนชำระได้หรือไม่?"
            >
              <div className="text-body-medium text-text-secondary leading-relaxed space-y-2">
                <p>
                  เรามีนโยบาย <strong>Medical Transparency</strong> คุณหมอจะแจ้งแผนการรักษาและใบประเมินค่าใช้จ่ายเบื้องต้น (Treatment Estimate) 
                  ให้เจ้าของทราบและตัดสินใจร่วมกันก่อนทำหัตถการ สำหรับการผ่าตัดหรือเคสแอดมิท รองรับบัตรเครดิตทุกธนาคาร 
                  พร้อมโปรแกรมผ่อนชำระ 0% นานสูงสุด 6 เดือน
                </p>
              </div>
            </AccordionItem>

            <AccordionItem
              id="item-5"
              title="การพาสัตว์เลี้ยงมาตรวจสุขภาพประจำปี ต้องอดอาหารล่วงหน้าไหม?"
            >
              <div className="text-body-medium text-text-secondary leading-relaxed space-y-2">
                <p>
                  กรณีตรวจสุขภาพที่มีการตรวจเลือดทั่วไปและอัลตราซาวด์ช่องท้อง แนะนำให้อดอาหาร 8–10 ชั่วโมง (สามารถดื่มน้ำสะอาดได้ตามปกติ) 
                  แต่สำหรับสัตว์เลี้ยงขนาดเล็กมาก ลูกสัตว์อายุน้อยกว่า 4 เดือน หรือสัตว์ฟันแทะ (กระต่าย หนูแฮมสเตอร์) 
                  <strong>ห้ามอดอาหารเด็ดขาด</strong> เนื่องจากอาจเกิดภาวะลำไส้หยุดทำงานหรือน้ำตาลในเลือดต่ำได้
                </p>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
