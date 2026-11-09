import { test, expect } from '@playwright/test';

test.describe('Visual Regression: ตรวจสอบความถูกต้องของ UI', () => {
  test('เปรียบเทียบ Snapshot หน้าต่าง Auth Modal (Sign In)', async ({ page }) => {
    await page.goto('/');

    // เปิด Auth Modal
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // รอแอนิเมชันให้เสร็จสมบูรณ์
    await page.waitForTimeout(300);

    // Visual Regression Check: ตรวจจับ UI เพี้ยนของ Auth Card
    await expect(dialog).toHaveScreenshot('auth-modal-signin.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('เปรียบเทียบ Snapshot หน้าจอรีเซ็ตรหัสผ่าน (Forgot Password)', async ({ page }) => {
    await page.goto('/');

    // เปิด Auth Modal แล้วคลิก "ลืมรหัสผ่าน?"
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'ลืมรหัสผ่าน?' }).click();
    await expect(dialog.getByText('รีเซ็ตรหัสผ่าน', { exact: true })).toBeVisible();

    await page.waitForTimeout(300);

    // Visual Regression Check
    await expect(dialog).toHaveScreenshot('auth-modal-forgot-password.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
