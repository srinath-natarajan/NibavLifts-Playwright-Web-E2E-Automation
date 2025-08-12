import { Page } from '@playwright/test';

export async function fillOtpInputs(page: Page, otp: string) {
    const digits = otp.split('');
    for (let i = 0; i < digits.length; i++) {
        await page.locator(`(//div[contains(@class, 'otp-inputs')]//input[@data-testid='otp-component-input'])[${i + 1}]`).fill(digits[i]);
    }
    await page.keyboard.press('Enter');
}

export async function fillOtpInputsAfterOrder(page: Page, otp: string) {
    const digits = otp.split('');
    const inputs = page.locator("//div[contains(@class, 'otp-inputs')]//input[@data-testid='otp-component-input']");
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
        const digit = digits[i] || '';
        await inputs.nth(i).fill('');
        await inputs.nth(i).pressSequentially(digit, { delay: 50 });
    }
    await page.keyboard.press('Enter');
}

export async function fillEmployeeIdInput(page: Page, empId: string) {
    const digits = empId.split('');
    const inputs = page.locator("//input[@data-testid='employee-id-form-input']");
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
        const digit = digits[i] || '';
        await inputs.nth(i).fill('');
        await inputs.nth(i).pressSequentially(digit, { delay: 50 });
    }

    await page.keyboard.press('Enter');
}
