import dotenv from 'dotenv';
dotenv.config();

import { test as base } from '@playwright/test';
import { ProductConfiguration, UserAuthLogin, SummaryToOrder_Page } from '../pages/orderFlow/index';
import { getCountryFromPath, getCurrentRegionConfig } from '../utils/index';
import { logger } from '../helpers/logger';

type MyFixtures = {
    userAuth: UserAuthLogin;
    productConfig: ProductConfiguration;
    noOfStops: number;
    summaryOrderpage: SummaryToOrder_Page;
};

export const test = base.extend<MyFixtures>({
    userAuth: async ({ page }, use) => {
        const userAuth = new UserAuthLogin(page);
        const newPage = await userAuth.navigateToNibavLiftsHomePage();
        await newPage.waitForLoadState('networkidle');

        await userAuth.acceptCookiesIfVisible();

        const { config } = getCurrentRegionConfig();

        await userAuth.selectCountryFromMegaMenu(config.region, config.country, config.language);
        await newPage.waitForTimeout(1000);

        const fullPath = await newPage.evaluate(() => window.location.href);
        const detectedCountry = getCountryFromPath(new URL(fullPath).pathname);
        logger.log(`Region Detection Summary:`);
        logger.log(`Full path after country selection: ${fullPath}`);
        logger.log(`Country detected from Mega Menu: ${detectedCountry}`);

        userAuth.country = detectedCountry;

        await use(userAuth);
    },

    productConfig: async ({ userAuth }, use) => {
        const productConfig = new ProductConfiguration(userAuth.page);
        productConfig.region = userAuth.country === 'US' ? 'USA' : userAuth.country === 'CA' ? 'CA' : 'IND';

        await use(productConfig);
    },

    summaryOrderpage: async ({ userAuth }, use) => {
        const summaryOrderpage = new SummaryToOrder_Page(userAuth.page);
        await use(summaryOrderpage);
    }
});
