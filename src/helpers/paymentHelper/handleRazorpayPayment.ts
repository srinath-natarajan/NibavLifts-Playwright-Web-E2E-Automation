import { expect, Page } from '@playwright/test';
import { getsummarylocators } from '../../utils/summaryOrderLocators';
import { PaymentParams } from '../../pages/orderFlow/index';
import { RazorpayOptionKeys } from '../../utils/paymentOptions';
import { logger } from '../logger';
import { getCurrentProduct } from '../productHelper';

export async function handleRazorpayPayment(page: Page, params: PaymentParams) {
    const summary = getsummarylocators(page, getCurrentProduct());

    const options = Object.keys(summary.razorpayOptions) as RazorpayOptionKeys[];
    const randomChoice = options[Math.floor(Math.random() * options.length)];
    logger.log(`Selected Razorpay option: ${randomChoice}`);

    await summary.razorpayOptions[randomChoice].click();

    await page.waitForLoadState('networkidle');

    const processingRate = randomChoice === 'AmexCard' || randomChoice === 'InternationalCard' ? 0.03 : 0.02;
    const gstRate = 0.18;
    const base = params.breakdown.expectedDownPayment;
    const feeWithGST = parseFloat((base * processingRate * (1 + gstRate)).toFixed(2));
    const expectedFinalAmount = parseFloat((base + feeWithGST).toFixed(2));

    const uiAmount = Number(((await summary.downPaymentAmountText.textContent()) || '').replace(/[^0-9.]/g, ''));
    expect(uiAmount).toBeCloseTo(expectedFinalAmount, 2);

    await summary.submitBtnForRazorpay.click();

    const frame = page.frameLocator('iframe.razorpay-checkout-frame');
    await frame.locator('input[name="contact"]').fill(params.phoneNumber);
    await frame.locator(`//span[@data-testid='Netbanking']/ancestor::label`).click();

    const [popup] = await Promise.all([page.waitForEvent('popup'), frame.locator(`//span[text()="ICICI Bank"]`).first().click()]);

    await popup.locator('button.success').click();
    await popup.waitForEvent('close');

    await summary.ViewOrderBtn.click();

    await page.waitForURL(/\/dashboard\/order\/\d+/, { timeout: 10000 });

    await page.waitForResponse((res) => res.url().includes('/order-tracking') && res.request().method() === 'GET' && res.status() === 200);

    const trackingBlock = page.locator(`xpath=//p[contains(@class,'nl-gmd-16 min-lg:nl-gmd-24')]`);
    await trackingBlock.first().waitFor({ state: 'visible', timeout: 10000 });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await page.screenshot({ path: './test-results/screenshots/order-tracking.png', fullPage: true });
}
