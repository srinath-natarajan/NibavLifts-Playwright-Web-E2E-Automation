import { Locator, Page, expect } from '@playwright/test';
import { getsummarylocators, getTaxRateByPinCode } from '../../utils/index';
import { ProductConfiguration } from '../../pages/orderFlow/index';
import { handleRazorpayPayment, handleChequeOrDdPayment, handleContactSalesPayment } from '../../helpers/paymentHelper/index';

import Decimal from 'decimal.js';

import path from 'path';
import { PaymentOptions } from '../../utils/paymentOptions';
import { logger } from '../../helpers/logger';
import { getCurrentProduct } from '../../helpers/productHelper';
import { SideKey } from '@/helpers';

export interface PaymentParams {
    region: string;
    phoneNumber: string;

    breakdown: {
        expectedTotalAmount: number;
        subtotal: number;
        expectedDownPayment: number;
        downPaymentPercentage: number;
    };
}

type BookingBreakdown = {
    modelPrice: string;
    premiumEnhancementPrice: string;
    logisticsPrice: string;
    installationPrice: string;
    totalAmount: string;
    pinCode: string;
};

export class SummaryToOrder_Page {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async verifySelectedConfigurationInSummary(expected: {
        product: string;
        selectedText: string;
        noOfStops: number;
        carpet: string;
        highlightFinish: string | null;
        baseFinish: string | null;
        liftColor: string;
        sidesPerFloor: SideKey[];
    }): Promise<void> {
        const summary = getsummarylocators(this.page, getCurrentProduct());
        const isSeriesV = expected.product === 'Series V' || expected.product === 'Series V Max';

        logger.log('Verifying selected configuration in Summary Page...');

        const actualStopsText = await (isSeriesV ? summary.seriesV_noOfStops : summary.otherSeries_noOfStops).textContent();
        const cleaned = actualStopsText?.trim().toLowerCase() || '';
        const actualStops = parseInt(cleaned, 10) || 1;

        const expectedStopsMatch = expected.selectedText.match(/\(([^)]+)/i);
        const word =
            expectedStopsMatch?.[1]
                ?.toLowerCase()
                .replace(/(arrêts?|stops?)/i, '')
                .trim() || '';

        const wordToNumberMap: Record<string, number> = {
            // English
            two: 2,
            three: 3,
            four: 4,
            // French
            deux: 2,
            trois: 3,
            quatre: 4
        };

        const expectedStops = wordToNumberMap[word] || 1;

        expect(actualStops).toBe(expectedStops);
        logger.log(`Stops matched: ${actualStops}`);

        // Lift Color
        const liftColorText = expected.product.includes('Series III')
            ? (await summary.series3_liftColor.textContent()) ?? ''
            : expected.product.includes('Series IV')
            ? (await summary.series4_liftColor.textContent()) ?? ''
            : (await summary.seriesV_liftColor.textContent()) ?? '';

        expect(liftColorText.trim()).toContain(expected.liftColor);
        logger.log(`Lift Color matched: ${liftColorText.trim()}`);

        // Highlight Finish
        if (expected.highlightFinish) {
            const actualHighlight = await (isSeriesV
                ? summary.seriesV_highlightFinishes
                : summary.otherSeries_highlightFinishes
            ).textContent();
            expect(actualHighlight?.trim()).toContain(expected.highlightFinish);
            logger.log(`Highlight Finish matched: ${actualHighlight?.trim()}`);
        }

        // Base Finish
        if (expected.baseFinish) {
            const actualBase = await (isSeriesV ? summary.seriesV_baseFinishes : summary.otherSeries_baseFinishes).textContent();
            expect(actualBase?.trim()).toContain(expected.baseFinish);
            logger.log(`Base Finish matched: ${actualBase?.trim()}`);
        }

        const stopsMap: Record<string, number> = {
            two: 2,
            three: 3,
            four: 4,
            deux: 2,
            trois: 3,
            quatre: 4
        };

        const match = expected.selectedText.match(/\((.*?)\)/);
        const rawStopText = match?.[1]?.toLowerCase().trim() || '';

        const stopText = rawStopText.replace(/(stops?|arrêts?)/gi, '').trim();

        const totalStops = stopsMap[stopText] || 1;

        // Validate side per floor
        for (let floor = 0; floor < totalStops; floor++) {
            const expectedSide = expected.sidesPerFloor[floor];
            const key = (isSeriesV ? `seriesV_floor${floor}` : `otherSeries_floor${floor}`) as keyof typeof summary;

            const locator = summary[key] as Locator;
            const actualSide = await locator.textContent();

            expect(actualSide?.trim()).toContain(expectedSide);
            logger.log(`Floor ${floor} side matched: ${actualSide?.trim()}`);
        }

        // Carpet
        const actualCarpet = await (isSeriesV ? summary.seriesV_carpet : summary.otherSeries_carpet).textContent();
        expect(actualCarpet?.trim()).toContain(expected.carpet);
        logger.log(`Carpet matched: ${actualCarpet?.trim()}`);

        logger.log('Summary verification passed successfully.');
    }

    private async getCleanedText(locator: Locator, isCA_FR = false): Promise<string> {
        const raw = (await locator.textContent()) || '';

        let cleaned = raw
            .replace(/USD|CAD|INR|\$|₹|\/-|Acompte|Payment/gi, '')
            .replace(/[^\d,.\u00A0\s]/g, '')
            .trim()
            .replace(/\u00A0/g, '')
            .replace(/\s/g, '');

        if (isCA_FR) {
            cleaned = cleaned.replace(',', '.');
        } else {
            cleaned = cleaned.replace(/,/g, '');
        }

        return cleaned;
    }

    async waitForPriceToStabilize(timeout = 5000): Promise<void> {
        const summary = getsummarylocators(this.page, getCurrentProduct());
        const url = this.page.url();
        const isUSorCA = url.includes('/en-US') || url.includes('/en-CA') || url.includes('/fr-CA');
        const totalLocator = isUSorCA ? summary.USAandCA_TotalAmountIncludingTax : summary.totalAmountIncludingTax;

        const pollInterval = 300;
        const maxAttempts = Math.ceil(timeout / pollInterval);
        let previousText = await totalLocator.textContent();

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await this.page.waitForTimeout(pollInterval);
            const currentText = await totalLocator.textContent();
            if (currentText?.trim() === previousText?.trim()) {
                return;
            }
            previousText = currentText;
        }

        throw new Error(`Price did not stabilize within ${timeout} ms`);
    }

    async verifyCommercials(expected: BookingBreakdown): Promise<{
        expectedTotalAmount: number;
        subtotal: number;
        expectedDownPayment: number;
        downPaymentPercentage: number;
    }> {
        const summary = getsummarylocators(this.page, getCurrentProduct());
        const url = this.page.url();
        const isUSorCA = url.includes('/en-US') || url.includes('/en-CA') || url.includes('/fr-CA');
        const isCA_FR = url.includes('/fr-CA');
        const isIND = !isUSorCA;

        await this.waitForPriceToStabilize();

        let apiModelPrice = 0;
        let apiEnhancementPrice = 0;
        let apiLogisticsPrice = 0;
        let apiInstallationAmount = 0;
        let apiTaxAmount = 0;
        let apiTotalAmount = 0;
        let apiDownPayment = 0;

        try {
            const [response] = await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201, {
                    timeout: 15000
                }),
                this.page.waitForTimeout(500)
            ]);
            const json = await response.json();

            apiModelPrice = Number(Number(json.modelPrice).toFixed(2)) || 0;
            apiEnhancementPrice = Number(Number(json.premiumEnhancementsPrice).toFixed(2)) || 0;
            apiLogisticsPrice = Number(Number(json.transportUnloadingCost).toFixed(2)) || 0;
            apiInstallationAmount = Number(Number(json.installationPrice).toFixed(2)) || 0;
            apiTaxAmount = Number(Number(json.taxAmount).toFixed(2)) || 0;
            apiTotalAmount = Number(Number(json.totalPriceWithTax).toFixed(2)) || 0;
            apiDownPayment = Number(Number(json.downPayment).toFixed(2)) || 0;
        } catch (err) {
            console.warn('Failed to fetch tax, total, downPayment from API, falling back to manual calculation:', err);
        }

        const parseAmount = (val: string): number => {
            let cleaned = val
                .replace(/[^\d,.\u00A0\s]/g, '')
                .replace(/\u00A0/g, '')
                .replace(/\s/g, '');
            if (isCA_FR) cleaned = cleaned.replace(',', '.');
            else cleaned = cleaned.replace(/,/g, '');
            return Number(cleaned) || 0;
        };

        const extractAmount = async (locator: Locator): Promise<number> => parseAmount(await this.getCleanedText(locator, isCA_FR));

        const installationAmount = (await summary.installation.isVisible({ timeout: 3000 }).catch(() => false))
            ? await extractAmount(summary.installation)
            : 0;
        if (isIND) {
            expect(installationAmount).toBeCloseTo(apiInstallationAmount, 2);
        }
        const taxLocator = isUSorCA ? summary.USAandCA_Tax : summary.tax;
        const totalAmountLocator = isUSorCA ? summary.USAandCA_TotalAmountIncludingTax : summary.totalAmountIncludingTax;

        const actualModelPrice = await extractAmount(summary.modelPrice);
        const actualEnhancementPrice = await extractAmount(summary.premiumEnhancement);
        const actualLogisticsPrice = await extractAmount(summary.transportation);
        const actualTax = await extractAmount(taxLocator);
        const actualTotalAmount = await extractAmount(totalAmountLocator);

        const rawDownPayment = (await summary.downPaymentAmount.textContent()) || '';
        let downPaymentPercentage = 0;
        let actualDownPayment = 0;

        if (/100\s*%/.test(rawDownPayment) || rawDownPayment.includes('100% Payment') || rawDownPayment.includes('100% Acompte')) {
            downPaymentPercentage = 1;
            actualDownPayment = actualTotalAmount;
        } else {
            const percentageMatch = rawDownPayment.match(/(\d+(?:\.\d+)?)\s*%/);
            if (percentageMatch) downPaymentPercentage = Number(percentageMatch[1]) / 100;
            const amountMatch = rawDownPayment.match(/([\d\s,.]+)[^\d]*$/);
            if (amountMatch) actualDownPayment = parseAmount(amountMatch[1]);
        }

        const model = apiModelPrice;
        const enhancement = apiEnhancementPrice;
        const logistics = apiLogisticsPrice;

        const subtotalDecimal = new Decimal(model + enhancement + logistics);
        const taxRateDecimal = new Decimal(getTaxRateByPinCode(expected.pinCode));
        const exactTax = subtotalDecimal.mul(taxRateDecimal);
        const expectedTaxDecimal = exactTax.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        const expectedTotalAmountDecimal = subtotalDecimal.add(expectedTaxDecimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        const calculatedDownPaymentDecimal = expectedTotalAmountDecimal
            .mul(downPaymentPercentage)
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

        const expectedTax = apiTaxAmount || expectedTaxDecimal.toNumber();
        const expectedTotalAmount = apiTotalAmount || expectedTotalAmountDecimal.toNumber();
        const expectedDownPayment = apiDownPayment || calculatedDownPaymentDecimal.toNumber();

        logger.log('---------------- Commercials Details ----------------');
        logger.log(
            `Region: ${
                url.includes('/en-US')
                    ? 'USA Region'
                    : url.includes('/fr-CA')
                    ? 'Canada Region (French)'
                    : url.includes('/en-CA')
                    ? 'Canada Region (English)'
                    : 'IND'
            }`
        );
        logger.log(`${isUSorCA ? 'Postal/Zip Code' : 'Pin Code'}: ${expected.pinCode}`);
        logger.log(`Subtotal: ${subtotalDecimal.toNumber()}`);
        logger.log(`Tax Rate: ${taxRateDecimal.times(100).toNumber()}%`);
        logger.log(`Tax Calc: Actual = ${actualTax}, Expected = ${expectedTax}`);
        logger.log(`Total Amount: Actual = ${actualTotalAmount}, Expected = ${expectedTotalAmount}`);
        logger.log(`Down Payment Percentage: ${downPaymentPercentage * 100}%`);
        logger.log(`Down Payment Amount: Actual = ${actualDownPayment}, Expected = ${expectedDownPayment}`);
        logger.log('-----------------------------------------------------');

        await summary.paymentTermsLink.scrollIntoViewIfNeeded();
        await this.page.waitForLoadState('networkidle');
        await this.page.screenshot({ path: `./test-results/screenshots/Commercials.png` });

        expect(Number(actualModelPrice.toFixed(2))).toBe(Number(model.toFixed(2)));
        expect(Number(actualEnhancementPrice.toFixed(2))).toBe(Number(enhancement.toFixed(2)));
        expect(Number(actualLogisticsPrice.toFixed(2))).toBe(Number(logistics.toFixed(2)));
        expect(Number(actualTax.toFixed(2))).toBe(Number(expectedTax.toFixed(2)));
        expect(Number(actualTotalAmount.toFixed(2))).toBe(Number(expectedTotalAmount.toFixed(2)));
        expect(Number(actualDownPayment.toFixed(2))).toBe(Number(expectedDownPayment.toFixed(2)));

        return { expectedTotalAmount, subtotal: subtotalDecimal.toNumber(), expectedDownPayment, downPaymentPercentage };
    }

    async placeOrderWithSignature(): Promise<void> {
        const summary = getsummarylocators(this.page, getCurrentProduct());
        const url = this.page.url();
        const isCA_FR = url.includes('/fr-CA');

        await expect(summary.orderNowBtn).toBeVisible({ timeout: 5000 });
        await Promise.all([
            this.page.waitForResponse((res) => res.url().includes('/products/configurations/') && res.status() === 201),
            summary.orderNowBtn.click()
        ]);
        logger.log("Clicked 'Order Now'");

        const signaturePath = path.resolve('src/Files/Signature.png');
        const [fileChooser] = await Promise.all([this.page.waitForEvent('filechooser'), summary.UploadSignatureBtn.click()]);
        await fileChooser.setFiles(signaturePath);
        await this.page.waitForTimeout(500);

        await expect(summary.termsAndCondtsCheckBox).toBeVisible({ timeout: 5000 });
        await summary.termsAndCondtsCheckBox.click();

        await expect(summary.submitBtn).toBeEnabled({ timeout: 5000 });
        await Promise.all([
            this.page.waitForResponse((res) => res.url().includes('/users/saveDigitalSignature') && res.status() === 201),
            summary.submitBtn.click()
        ]);
        logger.log('Submitted signature and terms.');

        if (isCA_FR) {
            logger.log('Skipping quotation preview steps for Canada French region.');
            return;
        }

        await summary.quotaionPreviewCheckBox.scrollIntoViewIfNeeded();
        await expect(summary.quotaionPreviewCheckBox).toBeEnabled({ timeout: 50000 });
        await summary.quotaionPreviewCheckBox.click();

        await expect(summary.nextBtn).toBeEnabled({ timeout: 50000 });
        await Promise.all([
            this.page.waitForResponse(
                (res) =>
                    res.url().includes('/contactUs/delivery/Address') &&
                    res.request().method() === 'GET' &&
                    (res.status() === 200 || res.status() === 304)
            ),
            summary.nextBtn.click()
        ]);
        logger.log("Clicked 'Next' on quotation preview.");
        await this.waitForAutoFilledCityAndState();
    }

    async waitForAutoFilledCityAndState(): Promise<void> {
        await this.page.waitForFunction(
            () => {
                const cityInput = document.querySelector('input[name="city"]') as HTMLInputElement;
                return cityInput && cityInput.value.trim().length > 0;
            },
            { timeout: 5000 }
        );

        await this.page.waitForFunction(
            () => {
                const stateDiv = document.querySelector('.nl-form-input-select') as HTMLElement;
                return stateDiv && stateDiv.textContent?.trim() !== '' && stateDiv.textContent?.trim() !== '- Select -';
            },
            { timeout: 5000 }
        );
    }

    async handleAddressSectionAndExtractRegionData(): Promise<void> {
        const summary = getsummarylocators(this.page, getCurrentProduct());
        const url = this.page.url();

        const isIndia =
            url.includes('/en-IN') ||
            (!url.includes('/en-') && !url.includes('/fr-CA') && !url.includes('/en-US') && !url.includes('/en-CA'));
        const isCanadaFrench = url.includes('/fr-CA');
        const isCanadaEnglish = url.includes('/en-CA');
        const isUSA = url.includes('/en-US');

        logger.log(`Region Detection → IN: ${isIndia}, FR-CA: ${isCanadaFrench}, EN-CA: ${isCanadaEnglish}, US: ${isUSA}`);

        if (isCanadaFrench) {
            await summary.addressLine1CA_FRInput.fill('123 Rue Principale');
            await summary.addressLine2CA_FRInput.fill('App 45');
            await summary.landmarkInputCA_FR.fill('Près du WTC');

            await summary.nextBtnCA_fr1.click();
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/storeSavedConfigPrices') && res.status() === 201),
                summary.nextBtnCA_fr2.click()
            ]);
        } else {
            await summary.addressLine1.fill('123 Main St');
            await summary.addressLine2.fill('Apt 45');
            await summary.landmark.fill('Near WTC');

            if (isIndia) {
                await summary.gstCheckboxBtn.click();
                await summary.enterGST.fill('33AABCU9603R1Z2');
                await summary.gstConfirm.click();
            }

            await summary.NextBtn2.click();
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/storeSavedConfigPrices') && res.status() === 201),
                summary.NextBtn3.click()
            ]);

            logger.log('Address submitted');
        }
    }

    async preparePaymentParams(productConfig: ProductConfiguration, breakdown: any, phoneNumber: string): Promise<PaymentParams> {
        const region = productConfig.region || 'IND';
        return {
            region,
            phoneNumber,
            breakdown
        };
    }

    async selectAndHandlePaymentOption(params: PaymentParams) {
        const summary = getsummarylocators(this.page, getCurrentProduct());
        const region = params.region;

        await this.page.waitForResponse(
            (res) => res.url().includes('/payment/getPaymentInfo') && res.request().method() === 'POST' && res.status() === 201
        );

        if (region === 'USA' || region === 'CA') {
            await expect(summary.paymentOptionByValue(PaymentOptions.CHEQUE_OR_DD)).toBeVisible({ timeout: 5000 });
            await summary.paymentOptionByValue(PaymentOptions.CHEQUE_OR_DD).check();
            await this.handleChequeOrDDPaymentAndPlaceOrder();
            return;
        }

        const availableOptions: string[] = [];

        for (const option of Object.values(PaymentOptions)) {
            const optionLocator = summary.paymentOptionByValue(option);
            if (await optionLocator.isVisible()) {
                availableOptions.push(option);
            }
        }

        if (availableOptions.length === 0) {
            throw new Error(`No valid payment options visible for region: ${region}`);
        }

        const selectedOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        logger.log(`Randomly selected payment option for IND: ${selectedOption}`);

        await summary.paymentOptionByValue(selectedOption).check();

        switch (selectedOption) {
            case PaymentOptions.CARD:
                await this.handleOnlinePaymentAndPlaceOrder(params);
                break;
            case PaymentOptions.CHEQUE_OR_DD:
                await this.handleChequeOrDDPaymentAndPlaceOrder();
                break;
            case PaymentOptions.CONTACT_SALES:
                await this.handleContactSalesAndPlaceOrder();
                break;
            default:
                throw new Error(`Unhandled payment option selected: ${selectedOption}`);
        }
    }

    async handleOnlinePaymentAndPlaceOrder(params: PaymentParams) {
        if (params.region === 'IND') {
            await handleRazorpayPayment(this.page, params);
        }
    }

    async handleChequeOrDDPaymentAndPlaceOrder() {
        await handleChequeOrDdPayment(this.page);
    }

    async handleContactSalesAndPlaceOrder() {
        await handleContactSalesPayment(this.page);
    }
}
