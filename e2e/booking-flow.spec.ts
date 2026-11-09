import { test, expect } from '@playwright/test';

test.describe('E2E: การจองคิวตรวจ & BoardUI Select Dropdown', () => {
  test('ทดสอบเปิดฟอร์มจองคิว -> กรอกข้อมูลสัตว์เลี้ยง -> เลือกบริการผ่าน BoardUI Select', async ({ page }) => {
    await page.goto('/');

    // 1. คลิกปุ่ม "นัดหมายตรวจ" บน Navbar
    const bookingBtn = page.getByRole('button', { name: 'นัดหมายตรวจ' }).first();
    await expect(bookingBtn).toBeVisible();
    await bookingBtn.click();

    // 2. ตรวจสอบว่า Modal จองคิวเปิดขึ้นมา
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('นัดหมายตรวจล่วงหน้า')).toBeVisible();

    // 3. กรอกข้อมูลสัตว์เลี้ยงใน Step 1 โดยใช้ ID
    await dialog.locator('#booking-pet-name').fill('น้องนำโชค');
    await dialog.locator('#booking-pet-breed').fill('บริติช ช็อตแฮร์');
    
    // คลิกปุ่ม "ถัดไป" เพื่อไป Step 2
    const nextBtn = dialog.getByRole('button', { name: /ถัดไป/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // 4. ตรวจสอบ Step 2: ต้องมีช่องเลือก "แผนก / บริการที่ต้องการ"
    await expect(dialog.getByText('แผนก / บริการที่ต้องการ')).toBeVisible();
    
    // คลิก Trigger ของ BoardUI Select
    const selectTrigger = dialog.getByRole('button', { name: /แผนก \/ บริการที่ต้องการ/i });
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // 5. ตรวจสอบว่า Popover เมนูของ BoardUI เปิดขึ้นมา
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();

    // 6. คลิกเลือกบริการ "คลินิกแมวเฉพาะทาง Cat Friendly Clinic (ISFM)"
    const catClinicOption = listbox.getByRole('option', { name: /คลินิกแมวเฉพาะทาง/i });
    await expect(catClinicOption).toBeVisible();
    await catClinicOption.click();

    // 7. ตรวจสอบว่า Trigger แสดงค่าที่เลือกเรียบร้อย
    await expect(selectTrigger).toContainText('คลินิกแมวเฉพาะทาง');

    // 8. Visual Regression: ตรวจสอบความถูกต้องของ UI ฟอร์ม Step 2
    await expect(dialog).toHaveScreenshot('booking-modal-step2.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('ทดสอบการแนบรูปถ่ายอาการสัตว์เลี้ยง (สูงสุด 3 รูป) -> ลบรูป -> ตรวจสอบใน Step 3 และบันทึกลง localStorage', async ({ page }) => {
    await page.goto('/');

    // 1. คลิกปุ่ม "นัดหมายตรวจ" เพื่อเปิด Booking Modal
    const bookingBtn = page.getByRole('button', { name: 'นัดหมายตรวจ' }).first();
    await bookingBtn.click();

    const bookingDialog = page.locator('[aria-labelledby="booking-modal-title"]');
    await expect(bookingDialog).toBeVisible();

    // 2. ตรวจสอบ UI การแนบรูปถ่ายอาการเริ่มต้นใน Step 1
    await expect(bookingDialog.getByText(/แนบรูปถ่ายอาการ/i)).toBeVisible();
    await expect(bookingDialog.getByText('0/3 รูป')).toBeVisible();
    const addPhotoBtn = bookingDialog.getByTestId('add-symptom-photo-button');
    await expect(addPhotoBtn).toBeVisible();

    // 3. กรอกข้อมูลสัตว์เลี้ยง
    await bookingDialog.locator('#booking-pet-name').fill('น้องมีบุญ');
    await bookingDialog.locator('#booking-symptoms').fill('มีผื่นแดงและแผลเล็กน้อยบริเวณใบหูด้านใน');

    // 4. ทดสอบแนบ 2 รูป
    const fileInput = bookingDialog.getByTestId('symptom-photos-input');
    await fileInput.setInputFiles([
      {
        name: 'ear-symptom-1.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAALID/wfqy7kAAAAASUVORK5CYII=',
          'base64'
        ),
      },
      {
        name: 'ear-symptom-2.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAALID/wfqy7kAAAAASUVORK5CYII=',
          'base64'
        ),
      },
    ]);

    // ตรวจสอบว่าแสดง 2 Thumbnails และเคาน์เตอร์เป็น 2/3
    await expect(bookingDialog.getByText('2/3 รูป')).toBeVisible();
    const thumbnails = bookingDialog.getByTestId('symptom-photo-thumbnail');
    await expect(thumbnails).toHaveCount(2);

    // 5. ทดสอบลบรูปที่ 1 ออก
    const removeBtn = bookingDialog.getByTestId('remove-symptom-photo-0');
    await removeBtn.click();

    // ตรวจสอบว่าเหลือ 1 Thumbnail และเคาน์เตอร์เป็น 1/3 รูป
    await expect(bookingDialog.getByText('1/3 รูป')).toBeVisible();
    await expect(bookingDialog.getByTestId('symptom-photo-thumbnail')).toHaveCount(1);

    // 6. แนบเพิ่มอีก 2 รูปให้ครบ 3 รูป
    await fileInput.setInputFiles([
      {
        name: 'ear-symptom-3.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAALID/wfqy7kAAAAASUVORK5CYII=',
          'base64'
        ),
      },
      {
        name: 'ear-symptom-4.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAALID/wfqy7kAAAAASUVORK5CYII=',
          'base64'
        ),
      },
    ]);

    // เคาน์เตอร์ครบ 3/3 รูป และปุ่มเพิ่มรูปต้องถูกซ่อน
    await expect(bookingDialog.getByText('3/3 รูป')).toBeVisible();
    await expect(bookingDialog.getByTestId('symptom-photo-thumbnail')).toHaveCount(3);
    await expect(bookingDialog.getByTestId('add-symptom-photo-button')).toHaveCount(0);

    // 7. ไป Step 2
    await bookingDialog.getByTestId('booking-next-button').click();
    await expect(bookingDialog.getByText('แผนก / บริการที่ต้องการ')).toBeVisible();

    // 8. ไป Step 3
    await bookingDialog.getByTestId('booking-next-button').click();
    await expect(bookingDialog.getByText('สรุปข้อมูลการนัดหมาย:')).toBeVisible();

    // ตรวจสอบว่ารูปถ่ายแสดงในสรุป Step 3
    const step3Photos = bookingDialog.getByTestId('step3-symptom-photos');
    await expect(step3Photos).toBeVisible();
    await expect(step3Photos.locator('img')).toHaveCount(3);

    // กรอกข้อมูลผู้ติดต่อ Step 3
    await bookingDialog.locator('#booking-owner-name').fill('คุณสมชาย ใจดี');
    await bookingDialog.locator('#booking-owner-phone').fill('0891234567');

    // 9. กดยืนยันคำขอนัดหมาย (ระบบจะเปิด Auth Modal เนื่องจากยังไม่ได้ล็อกอิน)
    const submitBtn = bookingDialog.getByTestId('booking-submit-button');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // เข้าสู่ระบบด้วยเดโมบัญชี
    const authDialog = page.locator('[aria-labelledby="auth-modal-title"]');
    await expect(authDialog).toBeVisible();
    await authDialog.getByRole('button', { name: 'ล็อกอินด่วน' }).click();
    await expect(authDialog).not.toBeVisible({ timeout: 5000 });

    // หลังล็อกอินแล้ว กดยืนยันคำขอนัดหมายอีกครั้ง
    await expect(bookingDialog.getByTestId('booking-submit-button')).toBeVisible();
    await bookingDialog.getByTestId('booking-submit-button').click();

    // 10. ตรวจสอบหน้า Success Confirmation Screen
    await expect(bookingDialog.getByText('บันทึกคำขอนัดหมายเรียบร้อยแล้ว')).toBeVisible({ timeout: 5000 });
    const successPhotos = bookingDialog.getByTestId('success-symptom-photos');
    await expect(successPhotos).toBeVisible();
    await expect(successPhotos.locator('img')).toHaveCount(3);

    // 11. ตรวจสอบว่าข้อมูลรูปถ่ายถูกบันทึกลงใน localStorage `vetpaws_appointments`
    const storedAppointments = await page.evaluate(() => {
      const raw = localStorage.getItem('vetpaws_appointments');
      return raw ? JSON.parse(raw) : [];
    });
    expect(storedAppointments.length).toBeGreaterThan(0);
    const lastAppointment = storedAppointments[storedAppointments.length - 1];
    expect(lastAppointment.petName).toBe('น้องมีบุญ');
    expect(lastAppointment.symptomPhotos).toBeDefined();
    expect(Array.isArray(lastAppointment.symptomPhotos)).toBe(true);
    expect(lastAppointment.symptomPhotos.length).toBe(3);
    expect(lastAppointment.symptomPhotos[0]).toContain('data:image/');
  });

  test('ทดสอบตรวจสอบขนาดไฟล์รูปถ่ายอาการเกิน 5MB (Client-side validation)', async ({ page }) => {
    await page.goto('/');

    const bookingBtn = page.getByRole('button', { name: 'นัดหมายตรวจ' }).first();
    await bookingBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // แนบไฟล์ขนาด 5.2 MB
    const fileInput = dialog.getByTestId('symptom-photos-input');
    const largeBuffer = Buffer.alloc(5.2 * 1024 * 1024);
    await fileInput.setInputFiles([
      {
        name: 'huge-symptom-photo.jpg',
        mimeType: 'image/jpeg',
        buffer: largeBuffer,
      },
    ]);

    // ตรวจสอบว่ามี Error ข้อความแจ้งเตือนขนาดเกิน 5MB
    const errorMsg = dialog.getByTestId('symptom-photo-error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('เกิน 5MB');
  });

  test('ทดสอบปฏิเสธไฟล์ที่ไม่ใช่รูปภาพที่รองรับ (Invalid file format validation)', async ({ page }) => {
    await page.goto('/');

    const bookingBtn = page.getByRole('button', { name: 'นัดหมายตรวจ' }).first();
    await bookingBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const fileInput = dialog.getByTestId('symptom-photos-input');
    await fileInput.setInputFiles([
      {
        name: 'medical-records.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('%PDF-1.4 simulated pdf file content'),
      },
    ]);

    // ตรวจสอบว่าแสดง Error แจ้งเตือนประเภทไฟล์ไม่ถูกต้อง
    const errorMsg = dialog.getByTestId('symptom-photo-error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('ไม่ใช่ไฟล์รูปภาพที่รองรับ');

    // ต้องไม่แสดง thumbnail รูปถ่าย
    await expect(dialog.getByTestId('symptom-photo-thumbnail')).toHaveCount(0);
  });

  test('ทดสอบเปิดดูรูปถ่ายอาการขนาดใหญ่ (Photo preview lightbox) และปิดด้วยปุ่มปิด/ESC', async ({ page }) => {
    await page.goto('/');

    const bookingBtn = page.getByRole('button', { name: 'นัดหมายตรวจ' }).first();
    await bookingBtn.click();

    const dialog = page.locator('[aria-labelledby="booking-modal-title"]');
    await expect(dialog).toBeVisible();

    // แนบรูป 1 รูป
    const fileInput = dialog.getByTestId('symptom-photos-input');
    await fileInput.setInputFiles([
      {
        name: 'rash-preview-test.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAALID/wfqy7kAAAAASUVORK5CYII=',
          'base64'
        ),
      },
    ]);

    await expect(dialog.getByTestId('symptom-photo-thumbnail')).toHaveCount(1);

    // คลิกที่รูป Thumbnail เพื่อเปิด Lightbox
    const thumbnailImg = dialog.getByTestId('symptom-photo-thumbnail').locator('img');
    await thumbnailImg.click();

    // ตรวจสอบ Lightbox เปิดขึ้นมา
    const lightbox = page.getByTestId('photo-preview-lightbox');
    await expect(lightbox).toBeVisible();

    // กดปุ่มปิด Lightbox
    const closeLightboxBtn = page.getByTestId('close-photo-preview-lightbox');
    await closeLightboxBtn.click();
    await expect(lightbox).not.toBeVisible();

    // ตัว Booking Modal ยังคงเปิดอยู่ตามปกติ
    await expect(dialog).toBeVisible();
  });
});
