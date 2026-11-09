import { test, expect } from '@playwright/test';

test.describe('E2E & Visual: หน้าจอแชท & สีกล่องข้อความฝั่งหมอ (Emerald Gradient)', () => {
  test('ตรวจสอบดีไซน์ Phone Mockup และกล่องข้อความหมอเฉดเขียวมรกต', async ({ page }) => {
    await page.goto('/');

    // รอให้ข้อความตอบกลับของ สพ.ญ. ลลิตา ปรากฏขึ้นใน Phone Mockup
    const doctorBubble = page.locator('text=สวัสดีค่ะคุณเจ้าของ หมอลลิตานะคะ').first();
    await expect(doctorBubble).toBeVisible({ timeout: 20000 });

    // ตรวจสอบว่ากล่องข้อความหมอมีคลาส Gradient เฉดเขียวมรกต
    await expect(doctorBubble).toHaveClass(/from-emerald-600/);

    // Visual Regression Check: จับภาพกล่องข้อความหมอ เพื่อตรวจจับ UI เพี้ยน
    await expect(doctorBubble).toHaveScreenshot('doctor-bubble-gradient.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('ทดสอบเปิด Live Chat 24 ชม. -> สั่งประเมินอาการแมว -> ตรวจสอบว่าไม่ล้นจอ', async ({ page }) => {
    await page.goto('/');

    // 1. คลิกปุ่มลอย "แชทปรึกษา 24 ชม."
    const chatBtn = page.locator('button[title*="แชทปรึกษาอาการสัตว์เลี้ยง"]').first();
    await expect(chatBtn).toBeVisible({ timeout: 5000 });
    await chatBtn.click();

    // 2. ตรวจสอบว่าหน้าต่าง Live Chat เปิดขึ้นมา
    const chatDialog = page.getByRole('dialog');
    await expect(chatDialog).toBeVisible();

    // 3. คลิกข้อความแนะนำอาการ "แมวมีไข้ จาม หายใจมีเสียงวี้ด"
    const suggestionBtn = chatDialog.getByRole('button', { name: /แมวมีไข้ จาม หายใจมีเสียงวี้ด/i });
    await expect(suggestionBtn).toBeVisible();
    await suggestionBtn.click();

    // 4. ระบบจะขอให้เข้าสู่ระบบก่อน ให้คลิก "ล็อกอินด่วน"
    const authDialog = page.getByRole('dialog').filter({ hasText: 'ยินดีต้อนรับกลับสู่ VetPaws Hospital' });
    await expect(authDialog).toBeVisible({ timeout: 5000 });
    await authDialog.getByRole('button', { name: 'ล็อกอินด่วน' }).click();
    await expect(authDialog).not.toBeVisible({ timeout: 5000 });

    // 5. รอให้บอทประเมินอาการและแสดง Triage Card
    const triageCard = chatDialog.locator('text=ข้อสันนิษฐานอาการ:').locator('xpath=ancestor::div[contains(@class, "rounded-2xl")]').first();
    await expect(triageCard).toBeVisible({ timeout: 8000 });

    // 6. Visual Regression: ตรวจสอบความสมบูรณ์ของการ์ด Triage ไม่ให้ล้นจอ
    await expect(triageCard).toHaveScreenshot('triage-card-isfm.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
