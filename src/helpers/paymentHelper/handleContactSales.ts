import { Page } from '@playwright/test';
import { getsummarylocators, getEmployeeId, getOtpAfterOrder } from '../../utils/index';
import { fillEmployeeIdInput, fillOtpInputsAfterOrder } from '../index';
import { logger } from '../logger';
import { getCurrentProduct } from '../productHelper';

export async function handleContactSalesPayment(page: Page) {
    const summary = getsummarylocators(page, getCurrentProduct());

    const uploadInput = summary.uploadChequeBtn.locator(`//input[@type='file']`);
    await uploadInput.setInputFiles('src/Files/Cheque.png');

    await summary.chequeNumberInput.waitFor({ state: 'visible', timeout: 10000 });
    await summary.chequeNumberInput.fill('950020');

    const downPaymentAmount = ((await summary.downPaymentAmountText.textContent()) || '').replace(/[^0-9.]/g, '');
    await summary.downPaymentAmountInput.fill(downPaymentAmount);

    await summary.commonNextButton.click();

    const empId = getEmployeeId();
    await fillEmployeeIdInput(page, empId);

    await summary.salesEmployeeDataPopup.waitFor({ state: 'visible', timeout: 15000 });
    await summary.salesEmployeeSubmitButton.click();
    await summary.contactSalesVerificationOtpPopup.waitFor({ state: 'visible', timeout: 5000 });

    const otp = getOtpAfterOrder();
    await fillOtpInputsAfterOrder(page, otp);

    await summary.salesOrderSuccessPopup.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(500);

    await summary.salesOrderSuccessGoToDashboardBtn.click();

    await page.waitForURL(/\/dashboard\/order\/\d+/, { timeout: 10000 });

    await page.waitForResponse((res) => res.url().includes('/order-tracking') && res.request().method() === 'GET' && res.status() === 200);

    const trackingBlock = page.locator(`xpath=//p[contains(@class,'nl-gmd-16 min-lg:nl-gmd-24')]`);
    await trackingBlock.first().waitFor({ state: 'visible', timeout: 10000 });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForTimeout(5000);

    await page.screenshot({ path: './test-results/screenshots/order-tracking.png', fullPage: true });

    logger.log('Contact Sales flow with OTP completed successfully.');
}
