import { Page, Locator } from '@playwright/test';
import { getProductConfigLocators } from '../utils/index';
import path from 'path';
import { logger } from './logger';

export class AccessoriesHelper {
    readonly page: Page;
    readonly locators: ReturnType<typeof getProductConfigLocators>;
    region: string;

    constructor(page: Page) {
        this.page = page;
        this.locators = getProductConfigLocators(page);
    }

    private async isVisible(locator: Locator): Promise<boolean> {
        try {
            return await locator.isVisible();
        } catch {
            return false;
        }
    }

    async selectRandomFoldableOrCabin(currentProduct: string): Promise<string> {
        const pickFoldable = Math.random() < 0.5;

        if (pickFoldable) {
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                this.locators.foldableSeatAdd.click()
            ]);

            await this.locators.foldableSeatRemove.waitFor({ state: 'visible' });

            if (!(await this.isVisible(this.locators.cabinHandleRemove))) {
                throw new Error(`[${currentProduct}] Cabin Handle was not auto-added when Foldable Seat selected`);
            }

            return 'Foldable Seat and Cabin Handle';
        } else {
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                this.locators.cabinHandleAdd.click()
            ]);

            await this.locators.cabinHandleRemove.waitFor({ state: 'visible' });

            if (await this.isVisible(this.locators.foldableSeatRemove)) {
                throw new Error(`[${currentProduct}] Foldable Seat was auto-added when only Cabin Handle selected`);
            }

            return 'Cabin Handle';
        }
    }

    async toggleAlexa(): Promise<string | null> {
        const addAlexa = Math.random() < 0.5;

        if (addAlexa) {
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                this.locators.alexaAdd.click()
            ]);

            await this.locators.alexaRemove.waitFor({ state: 'visible' });
            return 'Alexa';
        }
        return null;
    }

    async toggleCustomBuildEngraving(): Promise<string | null> {
        const isEngravingNeeded = Math.random() < 0.5;
        if (!isEngravingNeeded) return null;

        this.locators.customBuildEngravingAdd.click();

        const name = 'DIEGO';
        await this.locators.secondLineInput.fill(name);

        await Promise.all([
            this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
            this.locators.customBuildEngravingSubmit.click()
        ]);

        await this.locators.customBuildEngravingEdit.waitFor({ state: 'visible' });
        return 'Custom Build Engraving';
    }

    async handleCoverPlates(noOfStops: number, currentProduct: string): Promise<{ roof: number; floor: number }> {
        const max = noOfStops - 1;
        let roofCount = 0;
        let floorCount = 0;

        let addRoof = Math.random() < 0.7;
        let addFloor = Math.random() < 0.7;

        if (!addRoof && !addFloor) {
            addRoof = true;
        }

        let iterations = 0;
        const maxIterations = 100;

        while ((roofCount < max || floorCount < max) && iterations < maxIterations) {
            iterations++;
            const choice = Math.random();

            if (addRoof && roofCount < max && choice < 0.5) {
                if (roofCount === 0) {
                    await this.locators.coverPlateRoofInitialAdd.waitFor({ state: 'visible' });
                    await Promise.all([
                        this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                        this.locators.coverPlateRoofInitialAdd.click()
                    ]);
                } else {
                    await this.locators.coverPlateRoofPlus.waitFor({ state: 'visible' });
                    await Promise.all([
                        this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                        this.locators.coverPlateRoofPlus.click()
                    ]);
                }
                roofCount++;
                logger.log(`[${currentProduct}] Cover Plate Roof Added [${roofCount}/${max}]`);
            }

            if (addFloor && floorCount < max && choice >= 0.5) {
                if (floorCount === 0) {
                    await this.locators.coverPlateFloorInitialAdd.waitFor({ state: 'visible' });
                    await Promise.all([
                        this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                        this.locators.coverPlateFloorInitialAdd.click()
                    ]);
                } else {
                    await this.locators.coverPlateFloorPlus.waitFor({ state: 'visible' });
                    await Promise.all([
                        this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                        this.locators.coverPlateFloorPlus.click()
                    ]);
                }
                floorCount++;
                logger.log(`[${currentProduct}] Cover Plate Floor Added [${floorCount}/${max}]`);
            }
        }

        return { roof: roofCount, floor: floorCount };
    }

    async handleDelivery(region: string): Promise<{ method: string; option: string }> {
        const waitForPriceSync = async (clickPromise: Promise<any>) => {
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                clickPromise
            ]);
        };

        if (region === 'IND') {
            const standardVisible = await this.locators.standardDeliveryDropDownBtnInd.isVisible().catch(() => false);
            const fastVisible = await this.locators.fastDeliveryInd?.isVisible().catch(() => false);
            const rapidVisible = await this.locators.rapidDeliveryInd?.isVisible().catch(() => false);

            const deliveryMethods = [];
            if (standardVisible) deliveryMethods.push('standard');
            if (fastVisible) deliveryMethods.push('fast');
            if (rapidVisible) deliveryMethods.push('rapid');

            if (deliveryMethods.length === 0) throw new Error('No visible delivery options for IND region');

            const method = deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];

            if (method === 'standard') {
                await this.locators.standardDeliveryDropDownBtnInd.click();

                const options = [
                    this.locators.standardDeliveryInd_3_Month,
                    this.locators.standardDeliveryInd_4_Month,
                    this.locators.standardDeliveryInd_5_Month,
                    this.locators.standardDeliveryInd_6_Month
                ];
                const labels = ['3 Months', '4 Months', '5 Months', '6 Months'];
                const index = Math.floor(Math.random() * options.length);

                if (labels[index] === '3 Months') {
                    await options[index].click();
                } else {
                    await waitForPriceSync(options[index].click());
                }
                return { method: 'standard', option: labels[index] };
            }

            if (method === 'fast') {
                await waitForPriceSync(this.locators.fastDeliveryInd.click());
                return { method: 'fast', option: '2 Months' };
            }

            if (method === 'rapid') {
                await waitForPriceSync(this.locators.rapidDeliveryInd.click());
                return { method: 'rapid', option: '1 Month' };
            }
        }

        // NON-IND regions
        else {
            const standardVisible = await this.locators.standardDeliveryDropDownBtnNon_Ind.isVisible().catch(() => false);
            const rapidVisible = await this.locators.rapidDeliveryNon_Ind?.isVisible().catch(() => false);

            const deliveryMethods = [];
            if (standardVisible) deliveryMethods.push('standard');
            if (rapidVisible) deliveryMethods.push('rapid');

            if (deliveryMethods.length === 0) throw new Error(`No visible delivery options for ${region} region`);

            const method = deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];

            if (method === 'standard') {
                await this.locators.standardDeliveryDropDownBtnNon_Ind.click();

                const options = [
                    this.locators.standardDeliveryNonInd_5_Month,
                    this.locators.standardDeliveryNonInd_6_Month,
                    this.locators.standardDeliveryNonInd_7_Month,
                    this.locators.standardDeliveryNonInd_8_Month
                ];
                const labels = ['5 Months', '6 Months', '7 Months', '8 Months'];
                const index = Math.floor(Math.random() * options.length);

                if (labels[index] === '5 Months') {
                    await options[index].click(); 
                } else {
                    await waitForPriceSync(options[index].click()); 
                }
                return { method: 'standard', option: labels[index] };
            }

            if (method === 'rapid') {
                await waitForPriceSync(this.locators.rapidDeliveryNon_Ind.click());
                return { method: 'rapid', option: '2 Months' };
            }
        }

        throw new Error(`Delivery selection failed — unsupported region: ${region}`);
    }

    async verifyBookingAmountAndBreakdown(
        deliveryMethodLabel: string,
        pinCode: string
    ): Promise<{
        totalAmount: string;
        modelPrice: string;
        premiumEnhancementPrice: string;
        logisticsPrice: string;
        installationPrice: string;
        pinCode: string;
    }> {
        const lowerLabel = deliveryMethodLabel.toLowerCase();

        const normalizedMethod = lowerLabel.includes('rapid')
            ? 'Rapid Delivery'
            : lowerLabel.includes('fast')
            ? 'Fast Delivery'
            : 'Standard Delivery';

        const pageUrl = this.page.url().toLowerCase();
        const isNonIndia = pageUrl.includes('/en-us') || pageUrl.includes('/en-ca') || pageUrl.includes('/fr-ca');
        const isInstallationExcluded = isNonIndia;

        const expectedPercentage = normalizedMethod === 'Rapid Delivery' ? '100%' : '30%';

        await Promise.all([
            this.locators.bookingAmount.waitFor({ state: 'visible', timeout: 10000 }),
            this.locators.totalAmountExcludingTax.waitFor({ state: 'visible', timeout: 10000 })
        ]);

        await this.page.waitForTimeout(2000);

        const bookingText = (await this.locators.bookingAmount.textContent())?.trim() || '';
        if (!bookingText.includes(expectedPercentage)) {
            throw new Error(
                `Booking amount "${bookingText}" does not contain expected percentage "${expectedPercentage}" for method: ${normalizedMethod}`
            );
        }

        const totalText = (await this.locators.totalAmountExcludingTax.textContent())?.trim() || '';
        const rawAmount = totalText.replace(/[^0-9.,]/g, '').replace(/,/g, '');

        await this.locators.priceBreakDownBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.locators.priceBreakDownBtn.click();

        await this.locators.priceBreakDownPopup.waitFor({ state: 'visible', timeout: 15000 });
        await this.locators.totalPrice.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1500);

        const safeMethodName = normalizedMethod.replace(/\s+/g, '-').toLowerCase();
        const popupScreenshotPath = path.resolve(`./test-results/screenshots/popup-breakdown-${safeMethodName}.png`);
        await this.page.screenshot({ path: popupScreenshotPath });

        const popupTotalPriceText = (await this.locators.totalPrice.textContent())?.trim() || '';
        const popupAmount = popupTotalPriceText.replace(/[^0-9.,]/g, '').replace(/,/g, '');

        if (popupAmount !== rawAmount) {
            throw new Error(`Mismatch: Page total "${rawAmount}" ≠ Popup total "${popupAmount}"`);
        }

        logger.log(`Verified total Amount for "${normalizedMethod}": ${popupTotalPriceText}`);

        const waitList = [
            this.locators.modelPrice.waitFor({ state: 'visible', timeout: 5000 }),
            this.locators.premiumEnhancementPrice.waitFor({ state: 'visible', timeout: 5000 }),
            this.locators.transportationAndUnloadingPrice.waitFor({ state: 'visible', timeout: 5000 })
        ];
        if (!isInstallationExcluded) {
            waitList.push(this.locators.installationPrice.waitFor({ state: 'visible', timeout: 5000 }));
        }
        await Promise.all(waitList);

        const modelPrice = (await this.locators.modelPrice.textContent())?.trim() || '';
        const premiumEnhancementPrice = (await this.locators.premiumEnhancementPrice.textContent())?.trim() || '';
        const logisticsPrice = (await this.locators.transportationAndUnloadingPrice.textContent())?.trim() || '';
        const installationPrice = isInstallationExcluded ? '' : (await this.locators.installationPrice.textContent())?.trim() || '';

        await this.page.waitForTimeout(1500);

        if (await this.locators.priceBreakdownCloseBtn.isVisible()) {
            await this.locators.priceBreakdownCloseBtn.click();
        }

        await Promise.all([this.page.waitForURL(/\/configure#summary$/, { timeout: 15000 }), this.locators.continueBtn.click()]);

        return {
            totalAmount: rawAmount,
            modelPrice,
            premiumEnhancementPrice,
            logisticsPrice,
            installationPrice,
            pinCode
        };
    }
}
