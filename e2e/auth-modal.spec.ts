import { test, expect } from '@playwright/test';

test.describe('E2E: Auth Modal & Validation Flow', () => {
  test('ทดสอบเปิด Modal -> ลืมรหัสผ่าน -> ส่งลิงก์รีเซ็ตสำเร็จ', async ({ page }) => {
    // 1. ไปที่หน้าแรกของเว็บ
    await page.goto('/');

    // 2. คลิกปุ่ม "เข้าสู่ระบบ" ที่ Navbar
    const loginButton = page.getByRole('button', { name: 'เข้าสู่ระบบ' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // 3. ตรวจสอบว่าหน้าต่าง Modal เข้าสู่ระบบเปิดขึ้นมา
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('ยินดีต้อนรับกลับสู่ VetPaws Hospital')).toBeVisible();

    // 4. คลิก "ลืมรหัสผ่าน?"
    const forgotPasswordLink = dialog.getByRole('button', { name: 'ลืมรหัสผ่าน?' });
    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.click();

    // 5. ตรวจสอบว่าโหมดเปลี่ยนเป็น "รีเซ็ตรหัสผ่าน" และแสดงเฉพาะช่อง Email
    await expect(dialog.getByText('รีเซ็ตรหัสผ่าน', { exact: true })).toBeVisible();
    await expect(dialog.getByText('กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่')).toBeVisible();
    await expect(dialog.locator('input[name="password"]')).toHaveCount(0);

    // 6. กรอกอีเมลและกดส่งลิงก์
    await dialog.locator('input[name="email"]').fill('owner@vetpaws.com');
    await dialog.getByRole('button', { name: 'ส่งลิงก์รีเซ็ตรหัสผ่าน' }).click();

    // 7. ตรวจสอบว่ามี Feedback แจ้งเตือนสำเร็จ
    await expect(dialog.getByText(/ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง owner@vetpaws.com เรียบร้อยแล้ว/)).toBeVisible();
  });

  test('ทดสอบสมัครสมาชิก -> ดักรหัสผ่าน 2 ช่องไม่ตรงกัน (Confirm Password Validation)', async ({ page }) => {
    await page.goto('/');

    // เปิด Modal
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    const dialog = page.getByRole('dialog');

    // สลับไปหน้าสมัครสมาชิก
    await dialog.getByRole('button', { name: 'สร้างบัญชีใหม่' }).click();
    await expect(dialog.getByText('สร้างบัญชีเจ้าของสัตว์เลี้ยง')).toBeVisible();

    // ตรวจสอบว่ามีช่องยืนยันรหัสผ่าน (Confirm password) ตามแบบสากล
    await expect(dialog.locator('input[name="password"]')).toBeVisible();
    await expect(dialog.locator('input[name="confirmPassword"]')).toBeVisible();

    // กรอกรหัสผ่านที่ไม่ตรงกัน
    await dialog.locator('input[name="name"]').fill('สมชาย ใจดี');
    await dialog.locator('input[name="email"]').fill('somchai@example.com');
    await dialog.locator('input[name="password"]').fill('Pass1234');
    await dialog.locator('input[name="confirmPassword"]').fill('Wrong999');

    // กดปุ่มสร้างบัญชี
    await dialog.getByRole('button', { name: 'สร้างบัญชี' }).click();

    // ตรวจสอบว่ามีแจ้งเตือนสีแดง "รหัสผ่านทั้งสองช่องไม่ตรงกัน"
    await expect(dialog.getByText('รหัสผ่านทั้งสองช่องไม่ตรงกัน')).toBeVisible();
  });
});
