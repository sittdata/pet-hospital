export interface PromptCallout {
  id: string;
  pinNumber: number;
  title: string;
  userPrompt: string;
  promptIntent: string;
  aiAction: string;
  codeOutcome: string;
  category: 'Navbar & UI' | 'AI Generation' | 'Health Passport' | 'Autonomous Boost';
  highlightArea: {
    top: string;
    left: string;
    width?: string;
    height?: string;
    label: string;
  };
  beforeState?: string;
  afterState?: string;
}

export interface ShowcaseModule {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  summary: string;
  screenshotType: 'navbar' | 'facilities' | 'passport' | 'bugs';
  callouts: PromptCallout[];
  speakerNotes: string[];
}

export const promptShowcaseModules: ShowcaseModule[] = [
  {
    id: 'navbar-evolution',
    tabLabel: '1. Navbar & สีแบรนด์',
    title: 'Navbar Dynamic Links & Color Adaptation',
    subtitle: 'การปรับโครงสร้างแถบนำทางและสีตามคำสั่งผู้ใช้จริงอย่างต่อเนื่อง',
    badge: 'Responsive & Auth UI',
    iconName: 'RiLayoutLine',
    summary: 'วิวัฒนาการของ Navbar จากการรับ Prompt สั้นๆ ของผู้ใช้ เช่น "แล้วสีข้างบนที่เป็นสีน้ำเงินไปไหน", "แก้เป็นสีนี้", ปรับเมนูก่อน/หลังล็อกอินให้สมดุล และการปรับคอนทราสต์ปุ่มในโปรไฟล์',
    screenshotType: 'navbar',
    speakerNotes: [
      'เริ่มแรก Navbar สีเทาทำให้ผู้ใช้ท้วงว่า "สีน้ำเงินไปไหน" AI จึงกู้สี Navy Blue (bg-blue-900) กลับมาทันที',
      'เมื่อผู้ใช้แนบรูปปุ่มสีฟ้าพาสเทล "แก้เป็นสีนี้" AI ปรับปุ่มเข้าสู่ระบบเป็น bg-blue-100 text-blue-600 เพื่อให้อ่านง่ายบนพื้นน้ำเงินเข้ม',
      'แก้ปัญหา Layout Shift: ก่อนล็อกอินแสดงเมนูครบ 6 รายการ แต่พอล็อกอินแล้วลดเหลือ 4 รายการเพื่อเปิดพื้นที่ให้ "สมุดวัคซีน" และกล่องโปรไฟล์',
      'ปรับ Micro-interactions: เปลี่ยนปุ่มเปลี่ยนรหัสและออกจากระบบเป็นพื้นหลังกระจกเข้ม bg-white/10 ไม่กลืนกับพื้นหลัง'
    ],
    callouts: [
      {
        id: 'nav-navy-color',
        pinNumber: 1,
        title: 'ดึงโทนสีกรมท่าเอกลักษณ์กลับมา',
        userPrompt: 'แล้วสีข้างบนที่เป็นสีน้ำเงินไปไหน',
        promptIntent: 'ผู้ใช้ต้องการรักษาสีแบรนด์ดั้งเดิมของโรงพยาบาล ไม่ต้องการสีเทาจืดชืด',
        aiAction: 'แทนที่พื้นหลังด้วย Tailwind bg-blue-900 พร้อมเส้นขอบ border-blue-950 และเงาลอยตัว',
        codeOutcome: 'header: bg-blue-900 text-white shadow-md border-b border-blue-950',
        category: 'Navbar & UI',
        highlightArea: {
          top: '8%',
          left: '12%',
          width: '76%',
          height: '24%',
          label: 'Navy Header Background'
        },
        beforeState: 'bg-background-primary-default (สีพื้นหลังเทาขาว กลืนกับตัวเว็บ)',
        afterState: 'bg-blue-900 (สีกรมท่าความน่าเชื่อถือระดับสถาบันการแพทย์)'
      },
      {
        id: 'nav-login-button',
        pinNumber: 2,
        title: 'ปุ่มเข้าสู่ระบบสีฟ้าพาสเทลตามภาพอ้างอิง',
        userPrompt: 'แก้เป็นสีนี้ (แนบรูปปุ่มเข้าสู่ระบบ)',
        promptIntent: 'สกัด Palette สีจากรูปภาพที่ผู้ใช้แนบมาให้ตรงเป๊ะ',
        aiAction: 'ใช้โทนสีฟ้าพาสเทล bg-blue-100 ตัดกับตัวอักษรสีน้ำเงินสด text-blue-600 ไม่จมกับแถบ Navy',
        codeOutcome: 'className="bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200/80"',
        category: 'Navbar & UI',
        highlightArea: {
          top: '18%',
          left: '74%',
          width: '20%',
          height: '20%',
          label: 'Pastel Blue Login CTA'
        },
        beforeState: 'ปุ่มสีขาวล้วนหรือปุ่มโปร่งใสที่ตัดกับพื้นหลังไม่ลงตัว',
        afterState: 'bg-blue-100 text-blue-600 ตามรูปภาพต้นแบบที่ส่งมา'
      },
      {
        id: 'nav-dynamic-links',
        pinNumber: 3,
        title: 'ระบบ Dynamic Nav Links (6 ลิงก์ ➔ 4 ลิงก์)',
        userPrompt: 'คือก่อนจะล็อคอินมันดูไม่ค่อยสวยอะแบบ แทบด้านบนมันดูไม่เต็ม แต่พอล็อคอินไปแล้วแทบล็อคอินมันดันเกินดันไม่สวย... ตอนไม่ได้ล็อคอินให้โชว์หนาแทบให้ครบ พอล็อคอินให้ลบออกไป 2 อัน',
        promptIntent: 'จัดการ Visual Balance ของแถบนำทาง ไม่ให้โล่งก่อนล็อกอิน และไม่ให้ล้นหลังล็อกอิน',
        aiAction: 'สร้างตัวแปร desktopNavLinks ตรวจสอบสถานะ currentUser ? fullNavLinks.slice(0, 4) : fullNavLinks',
        codeOutcome: 'const desktopNavLinks = currentUser ? fullNavLinks.slice(0, 4) : fullNavLinks;',
        category: 'Navbar & UI',
        highlightArea: {
          top: '18%',
          left: '32%',
          width: '38%',
          height: '20%',
          label: 'Dynamic Links Switcher'
        },
        beforeState: 'แสดง 6 ลิงก์คงที่ ทำให้พอล็อกอินแล้วปุ่มดันกันจนตกขอบจอ',
        afterState: 'ก่อนล็อกอิน 6 เมนู (เต็มตา) ➔ หลังล็อกอิน 4 เมนู (ให้พื้นที่สมุดวัคซีน)'
      },
      {
        id: 'nav-profile-buttons',
        pinNumber: 4,
        title: 'ปุ่มไอคอนโปรไฟล์กระจกเข้ม (Glassmorphism)',
        userPrompt: 'แก้หน่อยตรงปุ่ม เปลี่ยนรหัสกับปุ่มล็อคเอ้า',
        promptIntent: 'ปุ่มเปลี่ยนรหัสและออกจากระบบมองเห็นยาก กลืนกับพื้นหลังกล่องโปรไฟล์',
        aiAction: 'ใส่พื้นหลังกระจกโปร่งแสง bg-white/10 ขอบ border-white/15 และ hover state สีแดงเฉพาะปุ่มออกจากระบบ',
        codeOutcome: 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 rounded-lg',
        category: 'Navbar & UI',
        highlightArea: {
          top: '64%',
          left: '78%',
          width: '18%',
          height: '24%',
          label: 'Glass Icon Actions'
        },
        beforeState: 'ปุ่ม Ghost ไร้พื้นหลัง กลืนกับสีน้ำเงินจนสังเกตไม่ออก',
        afterState: 'ปุ่มกระจกใส bg-white/10 คอนทราสต์ชัดเจน สัมผัสง่ายบนมือถือ'
      }
    ]
  },
  {
    id: 'ai-facilities-images',
    tabLabel: '2. ภาพศูนย์การแพทย์ AI',
    title: 'Medical Facilities AI Image Generation',
    subtitle: 'การวิจัยมาตรฐานโรงพยาบาลจริง สังเคราะห์ภาพเฉพาะทาง และระบบสำรองข้อมูล',
    badge: 'Clinical Grade Generation',
    iconName: 'RiImageLine',
    summary: 'สร้างภาพสิ่งอำนวยความสะดวกทางการแพทย์ 6 แผนกเสมือนจริง โดยมีขั้นตอนการรีเสิร์ชโรงพยาบาลจริง กฎห้ามใช้ภาพซ้ำ และสร้าง Branch สำรองเผื่อผู้ใช้ต้องการย้อนกลับ',
    screenshotType: 'facilities',
    speakerNotes: [
      'ผู้ใช้ต้องการให้เว็บดูเป็นทางการเหมือนโรงพยาบาลสัตว์ระดับแนวหน้า จึงสั่งให้ AI ทำการรีเสิร์ชภาพโรงพยาบาลสัตว์จริง',
      'AI จัดการสร้าง Git Branch สำรองชื่อ "backup-before-image-enhancement" ก่อนลงมือเปลี่ยนแปลง เพื่อความปลอดภัยสูงสุด',
      'AI เจนเนอเรตภาพห้องผ่าตัดความดันบวก, ห้อง ICU ตู้ออกซิเจน, CT Scan/เอ็กซเรย์ดิจิทัล, คลินิกแมว, คลินิกสัตว์พิเศษ และห้องฉีดวัคซีน',
      'ทุกภาพมีสไตล์และความคมชัดสม่ำเสมอ และไม่มีภาพซ้ำกันแม้แต่จุดเดียว'
    ],
    callouts: [
      {
        id: 'fac-research',
        pinNumber: 1,
        title: 'รีเสิร์ชโครงสร้างโรงพยาบาลสัตว์จริง',
        userPrompt: 'ลองทำการ รีเสิร์จหาข้อมูลหน่อย ว่า โรงพยาบาลสัตว์ของเรากับของจริง ว่า เราควรเพิ่่มรูป ไปตรงไหนเพิ่มอะไรยังไง',
        promptIntent: 'สำรวจแผนกการรักษาทางการแพทย์ของโรงพยาบาลสัตว์ระดับสากลเพื่อนำมาเป็นต้นแบบ',
        aiAction: 'วิเคราะห์โครงสร้าง 6 ศูนย์เฉพาะทาง: ICU 24 ชม., ห้องผ่าตัด, ศูนย์ภาพวินิจฉัย, คลินิกแมว ISFM, สัตว์พิเศษ และเวชศาสตร์ป้องกัน',
        codeOutcome: 'กำหนด Schema ใน servicesData.ts พร้อมฟิลด์ imageUrl กำกับทุกบริการ',
        category: 'AI Generation',
        highlightArea: {
          top: '5%',
          left: '5%',
          width: '90%',
          height: '18%',
          label: 'Clinical Research & Architecture'
        },
        beforeState: 'มีการ์ดบริการแต่ไม่มีรูปถ่ายสถานพยาบาลที่สื่อถึงอุปกรณ์จริง',
        afterState: 'มี 6 แผนกการแพทย์ครบวงจรตามแบบแผนโรงพยาบาลสัตว์ชั้นนำ'
      },
      {
        id: 'fac-backup-strategy',
        pinNumber: 2,
        title: 'สร้าง Branch สำรองข้อมูลก่อนเปลี่ยนแปลง',
        userPrompt: 'ของเพิ่มมาให้หน่อย... ทำ back up ไว้ด้วยนะเผื่อผมไม่ชอบจะได้กลับมา',
        promptIntent: 'ป้องกันความเสี่ยงและข้อผิดพลาดในการปรับรูปภาพขนาดใหญ่',
        aiAction: 'สร้างและ checkout git branch สำรองชื่อ backup-before-image-enhancement ไว้อย่างปลอดภัย',
        codeOutcome: 'git branch backup-before-image-enhancement (แยก snapshot ข้อมูลก่อนแก้ไข)',
        category: 'AI Generation',
        highlightArea: {
          top: '28%',
          left: '5%',
          width: '42%',
          height: '30%',
          label: 'Git Safety Backup Branch'
        },
        beforeState: 'แก้ไขโค้ดทับ branch หลักโดยไม่มีจุด rollback',
        afterState: 'Branch สำรองปลอดภัย ย้อนกลับได้ด้วยคำสั่งเดียว 100%'
      },
      {
        id: 'fac-no-duplicates',
        pinNumber: 3,
        title: 'เงื่อนไขห้ามใช้รูปภาพซ้ำกัน',
        userPrompt: 'อย่าใช้รูปซ้ำกัน',
        promptIntent: 'ต้องการให้แต่ละแผนกมีเอกลักษณ์ของตนเอง ไม่ใช้ภาพวนซ้ำ',
        aiAction: 'ผูก imageUrl แต่ละการ์ดเข้ากับ Asset เฉพาะแผนก 6 ไฟล์แยกกันโดยสิ้นเชิง',
        codeOutcome: '6 ไฟล์แยก: veterinary_icu_ward.jpg, vet_operating_theater.jpg, cat_friendly_exam_suite.jpg ฯลฯ',
        category: 'AI Generation',
        highlightArea: {
          top: '28%',
          left: '53%',
          width: '42%',
          height: '30%',
          label: 'Unique Asset Mapping'
        },
        beforeState: 'ภาพสัตว์เลี้ยงทั่วไปหรือภาพคลินิกที่ใช้ซ้ำกันหลายการ์ด',
        afterState: 'ภาพอุปกรณ์เฉพาะทาง 6 แผนก ไม่ซ้ำกันเลยแม้แต่ภาพเดียว'
      },
      {
        id: 'fac-official-generation',
        pinNumber: 4,
        title: 'สังเคราะห์ภาพทางการแพทย์เสมือนจริง',
        userPrompt: 'แก้ ใช้ภาพที่เป็นทางการหน่อยแบบที่โรงพยาบาลเข้าใช้กัน อาจจะไปหารูปของโรงพยาบาลมา แล้วเราก็เจนรูปขึ้นมาเอง',
        promptIntent: 'สร้างภาพสถานพยาบาลระดับมืออาชีพ สะอาด ปลอดเชื้อ และมีเครื่องมือครบครัน',
        aiAction: 'AI เจนภาพห้องปฏิบัติการทางการแพทย์ที่มีแสงสว่างชัดเจน อุปกรณ์เฝ้าระวังสัญญาณชีพ และบรรยากาศมาตรฐานสากล',
        codeOutcome: 'ภาพความละเอียดสูง 6 รูปใน public/images/ บีบอัดแบบ Web-optimized',
        category: 'AI Generation',
        highlightArea: {
          top: '62%',
          left: '5%',
          width: '90%',
          height: '34%',
          label: 'AI Medical Room Synthesis'
        },
        beforeState: 'ภาพลูกสุนัข/ลูกแมวแบบสุ่ม ไม่สะท้อนศักยภาพของโรงพยาบาล',
        afterState: 'ภาพห้องตรวจ ICU, ห้องผ่าตัด, CT Scan, คลินิกสัตว์พิเศษ เสมือนจริง'
      }
    ]
  },
  {
    id: 'pet-passport-tracker',
    tabLabel: '3. สมุดวัคซีนดิจิทัล',
    title: 'Pet Health Passport & Vaccine Tracker',
    subtitle: 'การจัดระเบียบตารางวัคซีน และการปกป้องข้อมูลประวัติการรักษา',
    badge: 'Medical PII & Triage',
    iconName: 'RiShieldCheckLine',
    summary: 'พัฒนาระบบสมุดประวัติวัคซีนและสุขภาพสัตว์เลี้ยงดิจิทัล จัดระเบียบการ์ดและปุ่มแอ็กชัน พร้อมระบบป้องกันการเข้าถึงข้อมูลก่อนการยืนยันตัวตน',
    screenshotType: 'passport',
    speakerNotes: [
      'สมุดวัคซีนดิจิทัลเป็นฟีเจอร์ระดับ Enterprise ที่ช่วยให้เจ้าของเช็คประวัติการฉีดวัคซีนและนัดหมายถัดไปได้ทันที',
      'จากคำสั่ง "จัดเรียงให้มันดีๆหน่อย" AI จัดหมวดหมู่สถานะวัคซีนเป็น ฉีดแล้ว / ใกล้ถึงกำหนด / เกินกำหนด พร้อมปุ่มปรึกษาหมอผ่าน Live Chat ทันที',
      'เมื่อผู้ใช้สั่ง "อันนนี้มันขึ้นตอนยังไม่ล็อคอิน อะ มันไม่ควรขึ้นปรับหน่อย" AI จึงล็อกปุ่มและข้อมูลสุขภาพไว้ ต้องล็อกอินก่อนเท่านั้นเพื่อรักษาความลับของประวัติสัตว์ป่วย'
    ],
    callouts: [
      {
        id: 'pass-reorganize',
        pinNumber: 1,
        title: 'จัดระเบียบการ์ดวัคซีนและปุ่มส่งต่อ LiveChat',
        userPrompt: 'จัดเรียงให้มันดีๆหน่อย',
        promptIntent: 'การ์ดวัคซีนเดิมดูรก ไม่แบ่งสถานะชัดเจน และไม่สามารถต่อยอดไปนัดหมายได้ง่าย',
        aiAction: 'แบ่งกลุ่มสถานะวัคซีนด้วย Status Badge พร้อมปุ่ม "ปรึกษาสัตวแพทย์" ที่ส่ง context วัคซีนไปยังห้องแชททันที',
        codeOutcome: 'deriveVaccineStatus() แยก completed / upcoming / overdue + onConsultVaccine callback',
        category: 'Health Passport',
        highlightArea: {
          top: '25%',
          left: '10%',
          width: '80%',
          height: '40%',
          label: 'Organized Vaccine Pipeline'
        },
        beforeState: 'รายการวัคซีนเรียงต่อกันเป็นแนวยาว อ่านยาก ไม่มีป้ายบอกสถานะเร่งด่วน',
        afterState: 'แยกสถานะสีเขียว/ส้ม/แดง พร้อมปุ่มกดปรึกษาสัตวแพทย์เวร 24 ชม. ได้ทันที'
      },
      {
        id: 'pass-auth-guard',
        pinNumber: 2,
        title: 'ซ่อนสมุดวัคซีนก่อนเข้าสู่ระบบ (Medical Data Privacy)',
        userPrompt: 'อันนนี้มันขึ้นตอนยังไม่ล็อคอิน อะ มันไม่ควรขึ้นปรับหน่อย',
        promptIntent: 'ปกป้องข้อมูลประวัติการรักษา ไม่ให้แสดงต่อผู้เยี่ยมชมทั่วไปที่ยังไม่ได้ยืนยันตัวตน',
        aiAction: 'ผูกการแสดงผลปุ่ม "สมุดวัคซีน" กับสถานะ currentUser ใน Navbar และดักสิทธิ์การเปิด Modal',
        codeOutcome: '{currentUser ? <Button onClick={onOpenPassport}>สมุดวัคซีน</Button> : null}',
        category: 'Health Passport',
        highlightArea: {
          top: '10%',
          left: '60%',
          width: '30%',
          height: '25%',
          label: 'Protected Auth Boundary'
        },
        beforeState: 'ใครเข้าเว็บมาก็เปิดดูและแก้ไขประวัติวัคซีนของสัตว์เลี้ยงได้ทันที',
        afterState: 'ระบบปิดกั้นอย่างสมบูรณ์ ต้องยืนยันตัวตนก่อนจึงจะเปิดดูประวัติได้'
      }
    ]
  },
  {
    id: 'autonomous-bug-fixing',
    tabLabel: '4. Autonomous Bug Fix',
    title: 'Autonomous Critical Fixing (/boost /goal)',
    subtitle: 'การตรวจจับและแก้ไขจุดบกพร่องวิกฤต 4 มิติด้วยคำสั่งกวาดล้างข้อผิดพลาด',
    badge: 'Security & Stability',
    iconName: 'RiTerminalBoxLine',
    summary: 'ใช้คำสั่งพิเศษ "/boost แก้จุดวิกฤตที่ต้องแก้ทันที /goal" ให้ AI ตรวจสอบซอร์สโค้ดเชิงลึก แก้ไขข้อมูลส่วนบุคคล (PII), แก้ไข Memory Leak, ปรับ Gender Type และเปิด TypeScript Strict 100%',
    screenshotType: 'bugs',
    speakerNotes: [
      'คำสั่ง "/boost ... /goal" เป็นการสั่งให้ AI สวมบทบาท Senior Engineer ทำงานแบบ Autonomous โดยไม่ต้องรอคอนเฟิร์มทีละสเต็ป',
      'AI ค้นพบและแก้ไข 4 จุดเสี่ยงสำคัญ: 1. ซ่อนเลขโทรศัพท์ 08X-XXX-XXXX ในเอกสารนัดหมาย, 2. แก้ปัญหา Gender enum สลับเพศ, 3. แก้ Memory leak ใน LiveChat จาก setInterval ที่ค้างอยู่, 4. ปรับ TypeScript ให้ Clean 100%',
      'ผลลัพธ์คือโปรเจกต์คอมไพล์ผ่าน npm run build 0 error และ 0 warning'
    ],
    callouts: [
      {
        id: 'bug-boost-trigger',
        pinNumber: 1,
        title: 'สั่งการกวาดล้างจุดเสี่ยงแบบ Autonomous',
        userPrompt: '/boost แก้จุดวิกฤตที่ต้องแก้ทันที /goal',
        promptIntent: 'ให้ AI สำรวจโค้ดทั้งโปรเจกต์และกำจัดจุดบกพร่องที่ส่งผลต่อความปลอดภัยและประสิทธิภาพทันที',
        aiAction: 'รันการตรวจสอบ Codebase ใน 4 ด้าน: Data Privacy, Memory Lifecycle, Data Consistency, Type Integrity',
        codeOutcome: 'Commit 9ef3654: "fix(core): resolve critical security, memory leaks, and logic bugs"',
        category: 'Autonomous Boost',
        highlightArea: {
          top: '5%',
          left: '5%',
          width: '90%',
          height: '20%',
          label: 'Autonomous Prompt Execution'
        },
        beforeState: 'มีจุดเสี่ยงแฝงอยู่ในโค้ดที่อาจทำให้เกิด Data Breach หรือหน้าเว็บหน่วง',
        afterState: 'กวาดล้าง 4 จุดวิกฤตเสร็จสิ้นในรอบเดียว พร้อม Unit Safety'
      },
      {
        id: 'bug-pii-masking',
        pinNumber: 2,
        title: 'ปิดบังข้อมูลส่วนบุคคล (PII Phone Masking)',
        userPrompt: 'ซ่อนเบอร์โทรศัพท์เจ้าของสัตว์เลี้ยงในหน้าสรุปนัดหมาย',
        promptIntent: 'ป้องกันการถูกแอบถ่ายหน้าจอหรือข้อมูลลูกค้ารั่วไหลในที่สาธารณะ',
        aiAction: 'สร้าง Utility แปลงเบอร์ 081-234-5678 ให้แสดงผลเป็น 081-***-5678 อัตโนมัติ',
        codeOutcome: 'phone.replace(/(\\d{3})\\d{3,4}(\\d{3,4})/, "$1-***-$2")',
        category: 'Autonomous Boost',
        highlightArea: {
          top: '30%',
          left: '5%',
          width: '42%',
          height: '30%',
          label: 'PII Data Sanitization'
        },
        beforeState: 'แสดงเบอร์โทรศัพท์จริง 10 หลักครบถ้วนในทุกหน้าต่าง',
        afterState: 'Masking หมายเลข 4 หลักกลาง ปกป้องความเป็นส่วนตัว 100%'
      },
      {
        id: 'bug-memory-leak',
        pinNumber: 3,
        title: 'แก้ปัญหา Memory Leak ในระบบแชทสด 24 ชม.',
        userPrompt: 'ป้องกันไม่ให้เบราว์เซอร์กินแรมสะสมเวลาเปิดหน้าเว็บทิ้งไว้',
        promptIntent: 'กำจัด Unhandled Timer Intervals ใน LiveChatWidget',
        aiAction: 'เพิ่ม cleanup function ใน useEffect ทุกตัว คืนหน่วยความจำเมื่อผู้ใช้ปิดแชท',
        codeOutcome: 'return () => { if (typingTimerRef.current) clearInterval(typingTimerRef.current); };',
        category: 'Autonomous Boost',
        highlightArea: {
          top: '30%',
          left: '53%',
          width: '42%',
          height: '30%',
          label: 'Timer Cleanup & GC'
        },
        beforeState: 'เปิดหน้าเว็บทิ้งไว้นานๆ ตัวนับเวลายังคงรันในเบื้องหลังและกิน RAM ต่อเนื่อง',
        afterState: 'ทำลาย Timer ทันทีเมื่อ Unmount เบราว์เซอร์ลื่นไหลตลอดเวลา'
      },
      {
        id: 'bug-typescript-strict',
        pinNumber: 4,
        title: 'รับประกัน TypeScript Type Safety 100%',
        userPrompt: 'ทำให้ npm run build ผ่านฉลุย ไม่มี error แดง',
        promptIntent: 'ตรวจทาน Type Definitions และ PetGender enum ให้สอดคล้องกันทั้งแอป',
        aiAction: 'แก้ไขประเภทข้อมูล PetGender ให้รองรับทั้ง male/female ตรงกับ Mockup และปรับ tsconfig',
        codeOutcome: 'tsc -b && vite build ➔ Built in 1.48s (0 errors)',
        category: 'Autonomous Boost',
        highlightArea: {
          top: '65%',
          left: '5%',
          width: '90%',
          height: '28%',
          label: 'Zero-Error Production Build'
        },
        beforeState: 'มี Warning เรื่อง Type mismatch ระหว่าง PetProfile กับ BookingModal',
        afterState: 'คอมไพล์ผ่านสมบูรณ์แบบ 100% พร้อมขึ้นสู่ Production บน Vercel'
      }
    ]
  }
];
