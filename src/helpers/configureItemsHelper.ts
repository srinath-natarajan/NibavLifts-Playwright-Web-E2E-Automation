import { Page } from '@playwright/test';
import { getProductConfigLocators } from '../utils/productConfigLocators';

export class ConfigureItems {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectRandomHinge(): Promise<string | null> {
        const locators = getProductConfigLocators(this.page);
        const hingeLocator = this.page.locator(locators.hingeOptions);

        const count = await hingeLocator.count();
        if (count === 0) {
            throw new Error('No hinge options found on the page');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const selectedLocator = hingeLocator.nth(randomIndex);

        const selectedHingeText = await selectedLocator.locator('p').textContent();

        await Promise.all([
            this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
            selectedLocator.click()
        ]);

        return selectedHingeText?.trim() || null;
    }

    async selectRandomHeadUnit(): Promise<string | null> {
        const locators = getProductConfigLocators(this.page);
        const headUnitLocator = this.page.locator(locators.headUnitOptions);

        const count = await headUnitLocator.count();
        if (count === 0) {
            throw new Error('No head unit options found on the page');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const selectedLocator = headUnitLocator.nth(randomIndex);

        const selectedHeadUnitText = await selectedLocator.locator('p').textContent();

        await Promise.all([
            this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
            selectedLocator.click()
        ]);

        return selectedHeadUnitText?.trim() || null;
    }

    async selectRandomCarpet(currentProduct: string): Promise<string | null> {
        const locators = getProductConfigLocators(this.page);
        const carpetOptions = locators.carpetOptions;

        const expectedCount = currentProduct.includes('IV') || currentProduct.includes('V') ? 4 : 3;
        const actualCount = await carpetOptions.count();

        if (actualCount === 0) {
            throw new Error(`No carpet options found on the page for ${currentProduct}`);
        }

        if (actualCount !== expectedCount) {
            throw new Error(`Expected ${expectedCount} carpet options for ${currentProduct}, but found ${actualCount}`);
        }

        const randomIndex = Math.floor(Math.random() * actualCount);
        const selectedCarpet = carpetOptions.nth(randomIndex);
        const selectedTitle = await selectedCarpet.getAttribute('title');

        await Promise.all([
            this.page.waitForResponse((res) => res.url().includes('/products/getConfigPriceInfo') && res.status() === 201),
            selectedCarpet.click()
        ]);

        return selectedTitle?.trim() || null;
    }
}
