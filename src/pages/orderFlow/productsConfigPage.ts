import { expect, Page } from '@playwright/test';
import { getProductConfigLocators } from '../../utils/index';
import {
    ConfigureItems,
    AccessoriesHelper,
    resetSelectedSides,
    getValidRandomSide,
    SideKey,
    sideLabelMap,
    getCurrentProduct
} from '../../helpers/index';
import { logger } from '../../helpers/logger';

export class ProductConfiguration {
    readonly page: Page;
    readonly locators: ReturnType<typeof getProductConfigLocators>;
    readonly configureitems: ConfigureItems;
    readonly accessoriesHelper: AccessoriesHelper;
    readonly currentProduct: string;
    region: string;

    constructor(page: Page) {
        this.page = page;
        this.locators = getProductConfigLocators(page);
        this.configureitems = new ConfigureItems(page);
        this.accessoriesHelper = new AccessoriesHelper(page);
        this.currentProduct = getCurrentProduct();
        logger.log(`Current Product Selected: [${this.currentProduct}]`);
    }

    async handleNoOfStopsDropDownDynamic(productName: string): Promise<{ noOfStops: number; selectedText: string }> {
        await this.locators.products.waitFor({ state: 'visible' });
        await this.locators.products.click();

        if (productName === 'Series V' || productName === 'Series V Max') {
            await this.locators.productLinkBtn('Series V').waitFor({ state: 'visible' });
            await this.locators.productLinkBtn('Series V').click();

            const btnLabel = productName === 'Series V Max' ? 'Series V Max' : 'Series V';
            const versionBtn = this.page.locator(`//button[normalize-space()="${btnLabel}"]`);

            await versionBtn.waitFor({ state: 'visible', timeout: 5000 });
            await Promise.all([
                this.page.waitForResponse(
                    (resp) =>
                        resp.url().includes('/products/getConfigPriceInfo') && resp.request().method() === 'POST' && resp.status() === 201
                ),
                versionBtn.click()
            ]);
            await this.page.waitForTimeout(2000);
        } else {
            await this.locators.productLinkBtn(productName).waitFor({ state: 'visible' });
            await this.locators.productLinkBtn(productName).click();
        }

        await this.locators.noOfStopsDropDownBtn.waitFor({ state: 'visible' });
        await this.locators.noOfStopsDropDownBtn.click();

        await this.locators.noOfStopsDropDownBtnOptions.first().waitFor({ state: 'visible' });

        const count = await this.locators.noOfStopsDropDownBtnOptions.count();
        const randomIndex = Math.floor(Math.random() * count);
        const selectedOption = this.locators.noOfStopsDropDownBtnOptions.nth(randomIndex);
        const selectedText = await selectedOption.innerText();

        await Promise.all([
            this.page.waitForResponse(
                (resp) => resp.url().includes('/products/getConfigPriceInfo') && resp.request().method() === 'POST' && resp.status() === 201
            ),
            selectedOption.click()
        ]);

        const match = selectedText.match(/\d+/);
        const noOfStops = match ? parseInt(match[0], 10) : 1;

        logger.log(`Selected number of stops: ${selectedText}`);

        return { noOfStops, selectedText };
    }

    async selectRandomLiftColor(): Promise<string> {
        const currentProduct = this.currentProduct;

        const count = await this.locators.liftColourCheckboxes.count();
        if (count === 0) {
            throw new Error(`No lift color options found for [${currentProduct}]`);
        }

        const randomIndex = Math.floor(Math.random() * count);
        const selectedLabel = this.locators.liftColourCheckboxes.nth(randomIndex);

        const selectedTitle = (await selectedLabel.getAttribute('title')) ?? (await selectedLabel.innerText());

        await Promise.all([
            this.page.waitForResponse(
                (resp) => resp.url().includes('/products/getConfigPriceInfo') && resp.request().method() === 'POST' && resp.status() === 201
            ),
            selectedLabel.click()
        ]);

        logger.log(`Selected Lift Colour for [${currentProduct}]: ${selectedTitle}`);

        return selectedTitle;
    }

    async selectRandomHighlightFinish(): Promise<string | null> {
        const currentProduct = this.currentProduct;

        if (!currentProduct.includes('IV') && !currentProduct.includes('V')) {
            logger.log(`Skipping Highlight Finish — not available for [${currentProduct}]`);
            return null;
        }

        const highlightOptions = this.locators.highlightFinishOptions;
        const count = await highlightOptions.count();

        if (count === 0) {
            throw new Error(`No highlight finish options found for [${currentProduct}]`);
        }

        const randomIndex = Math.floor(Math.random() * count);
        const selectedOption = highlightOptions.nth(randomIndex);

        const selectedTitle = await selectedOption.getAttribute('title');

        await Promise.all([
            this.page.waitForResponse(
                (resp) => resp.url().includes('/products/getConfigPriceInfo') && resp.request().method() === 'POST' && resp.status() === 201
            ),
            selectedOption.click()
        ]);

        logger.log(`Selected Highlight Finish for [${currentProduct}]: ${selectedTitle}`);

        return selectedTitle?.trim() || null;
    }

    async selectRandomBaseFinish(): Promise<string | null> {
        const currentProduct = this.currentProduct;

        if (!currentProduct.includes('IV') && !currentProduct.includes('V')) {
            logger.log(`Skipping Base Finish — not available for [${currentProduct}]`);
            return null;
        }

        const baseOptions = this.locators.baseFinishOptions;
        const count = await baseOptions.count();

        if (count === 0) {
            throw new Error(`No base finish options found for [${currentProduct}]`);
        }

        const randomIndex = Math.floor(Math.random() * count);
        const selectedOption = baseOptions.nth(randomIndex);

        const selectedTitle = await selectedOption.getAttribute('title');

        await Promise.all([
            this.page.waitForResponse(
                (resp) => resp.url().includes('/products/getConfigPriceInfo') && resp.request().method() === 'POST' && resp.status() === 201
            ),
            selectedOption.click()
        ]);

        logger.log(`Selected Base Finish for [${currentProduct}]: ${selectedTitle}`);

        return selectedTitle?.trim() || null;
    }

    async handleDoorAccessPerFloor(noOfStops: number): Promise<void> {
        const currentProduct = this.currentProduct;

        await this.locators.doorAccessHeaders.first().waitFor({ state: 'visible', timeout: 5000 });

        const count = await this.locators.doorAccessHeaders.count();
        logger.log(`Found ${count} Door Access sections on the page for [${currentProduct}]`);

        if (count !== noOfStops + 1) {
            throw new Error(`Expected ${noOfStops + 1} door access headers, but found ${count}`);
        }

        for (let i = 0; i <= noOfStops; i++) {
            const header = this.locators.doorAccessHeaders.nth(i);
            const text = await header.textContent();

            if (!text || !text.trim()) {
                throw new Error(`Door Access heading at index ${i} is empty or not visible`);
            }
        }
    }

    async selectValidSidesForFloors(noOfStops: number): Promise<SideKey[]> {
        const currentProduct = this.currentProduct;
        const selectedSides: SideKey[] = [];

        resetSelectedSides();

        for (let floor = 0; floor <= noOfStops; floor++) {
            const side = getValidRandomSide(floor);
            selectedSides.push(side);

            const sideLabels = sideLabelMap[side];
            let clicked = false;

            const floorGrid = this.page.locator(`.door-access.product-configurations.doorAccess${floor} .grid.grid-cols-3.gap-3`);

            await floorGrid.locator('[data-testid=door-access-tab]').first().waitFor({ state: 'visible', timeout: 5000 });

            for (const labelText of sideLabels) {
                const buttonLocator = floorGrid.locator('[data-testid=door-access-tab]', { hasText: labelText });

                if ((await buttonLocator.count()) > 0) {
                    await Promise.all([
                        this.page.waitForResponse((resp) => resp.url().includes('products/getConfigPriceInfo') && resp.status() === 201),
                        buttonLocator.first().click()
                    ]);

                    const selectedBtn = floorGrid.locator('[data-testid=door-access-tab].border-primary', { hasText: labelText });
                    await expect(selectedBtn).toBeVisible({ timeout: 3000 });

                    logger.log(`[${currentProduct}] Selected side "${labelText}" for floor ${floor}`);
                    clicked = true;
                    break;
                }
            }

            if (!clicked) {
                logger.log(`[${currentProduct}] Could not find a clickable button for side "${side}" on floor ${floor}`);
            }
        }

        return selectedSides;
    }

    async selectRandomHinge(): Promise<string | null> {
        return await this.configureitems.selectRandomHinge();
    }

    async completeDoorAccessAndHingeConfig(noOfStops: number): Promise<{ selectedSides: SideKey[]; selectedHinge: string }> {
        const currentProduct = this.currentProduct;

        const selectedSides = await this.selectValidSidesForFloors(noOfStops);
        const selectedHinge = await this.selectRandomHinge();

        if (!selectedHinge) {
            throw new Error(`No hinge was selected for [${currentProduct}]. Cannot proceed.`);
        }

        logger.log(`[${currentProduct}] Selected sides per floor: ${JSON.stringify(selectedSides)}`);
        logger.log(`[${currentProduct}] Selected hinge: ${selectedHinge}`);

        return { selectedSides, selectedHinge };
    }

    async selectRandomHeadUnit(): Promise<string> {
        const currentProduct = this.currentProduct;
        const selectedHeadUnit = await this.configureitems.selectRandomHeadUnit();

        if (!selectedHeadUnit) {
            throw new Error(`No Head Unit was selected for [${currentProduct}].`);
        }

        logger.log(`[${currentProduct}] Selected Head Unit: ${selectedHeadUnit}`);
        return selectedHeadUnit;
    }

    async selectRandomCarpet(): Promise<string> {
        const currentProduct = this.currentProduct;
        const selectedCarpet = await this.configureitems.selectRandomCarpet(currentProduct);

        if (!selectedCarpet) {
            throw new Error(`No carpet was selected for [${currentProduct}]`);
        }

        logger.log(`[${currentProduct}] Selected Carpet: ${selectedCarpet}`);
        return selectedCarpet;
    }

    async selectFoldableOrCabin(): Promise<string> {
        const currentProduct = this.currentProduct;
        const selected = await this.accessoriesHelper.selectRandomFoldableOrCabin(currentProduct);
        logger.log(`[${currentProduct}] Selected accessory: ${selected}`);
        return selected;
    }

    async toggleAlexaAccessory(): Promise<string | null> {
        const currentProduct = this.currentProduct;
        const selected = await this.accessoriesHelper.toggleAlexa();

        if (selected === 'Alexa') {
            logger.log(`[${currentProduct}] Selected accessory: Alexa`);
        }
        return selected;
    }

    async toggleCustomBuildEngravingAccessory(): Promise<string | null> {
        const currentProduct = this.currentProduct;
        if (!['Series V', 'Series V Max'].includes(currentProduct)) return null;

        const selected = await this.accessoriesHelper.toggleCustomBuildEngraving();

        if (selected === 'Custom Build Engraving') {
            logger.log(`[${currentProduct}] Selected accessory: Custom Build Engraving`);
        }
        return selected;
    }

    async handleCoverPlatesAccessory(noOfStops: number): Promise<{ roof: number; floor: number }> {
        const result = await this.accessoriesHelper.handleCoverPlates(noOfStops, this.currentProduct);
        logger.log(`[${this.currentProduct}] Final Cover Plates: Roof = ${result.roof}, Floor = ${result.floor}`);
        return result;
    }

    async verifySupportBracketCountMatchesNoOfStops(noOfStops: number): Promise<void> {
        const currentProduct = this.currentProduct;

        const displayedQuantityText = await this.locators.supportBracketQuantity.innerText();
        const displayedQuantity = parseInt(displayedQuantityText, 10);

        if (displayedQuantity !== noOfStops) {
            throw new Error(`[${currentProduct}] Support Bracket count mismatch! Expected: ${noOfStops}, Displayed: ${displayedQuantity}`);
        }

        logger.log(`[${currentProduct}] Support Bracket count matches number of stops: ${displayedQuantity}`);
    }

    async selectGrandeAndProAddons(): Promise<string[]> {
        const currentProduct = this.currentProduct;
        const region = this.region;
        const selectedAddons: string[] = [];

        if (currentProduct.includes('III')) {
            logger.log(`Skipping Grande/Pro — not applicable for [${currentProduct}]`);
            return selectedAddons;
        }

        const isIndia = region === 'IN' || region === 'IND';
        const shouldSelectGrande = Math.random() < 0.5;

        if (isIndia) {
            if (shouldSelectGrande) {
                await Promise.all([
                    this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                    this.locators.grandeAdd.click()
                ]);
                await this.locators.grandeRemove.waitFor({ state: 'visible' });
                selectedAddons.push('Grande');
                logger.log(`[${currentProduct}] Added Grande Add-on`);
            } else {
                await Promise.all([
                    this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                    this.locators.proAdd.click()
                ]);
                await this.locators.proRemove.waitFor({ state: 'visible' });
                selectedAddons.push('Pro');
                logger.log(`[${currentProduct}] Added Pro Add-on`);
            }

            return selectedAddons;
        }

        // USA / CA logic
        const canSeeGrande = await this.locators.grandeAdd.isVisible();
        if (canSeeGrande && shouldSelectGrande) {
            await Promise.all([
                this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
                this.locators.grandeAdd.click()
            ]);
            await this.locators.grandeRemove.waitFor({ state: 'visible' });
            selectedAddons.push('Grande');
            logger.log(`[${currentProduct}] Added Grande Add-on for ${region}`);
        } else {
            logger.log(`[${currentProduct}] Skipped Grande for ${region}`);
        }

        return selectedAddons;
    }

    async selectDeliveryMethod(region: string): Promise<{ method: string; option: string }> {
        const result = await this.accessoriesHelper.handleDelivery(region);
        logger.log(`Selected Delivery Method: ${result.method} - ${result.option}`);
        return result;
    }

    async verifyBookingAmountAndCaptureBreakdown(
        fullDeliveryLabel: string,
        pinCode: string
    ): Promise<{
        totalAmount: string;
        modelPrice: string;
        premiumEnhancementPrice: string;
        logisticsPrice: string;
        installationPrice: string;
        pinCode: string;
    }> {
        const breakdown = await this.accessoriesHelper.verifyBookingAmountAndBreakdown(fullDeliveryLabel, pinCode);

        return {
            ...breakdown,
            pinCode
        };
    }
}
