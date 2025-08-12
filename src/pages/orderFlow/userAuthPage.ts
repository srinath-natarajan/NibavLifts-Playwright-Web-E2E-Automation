import { Page, expect } from '@playwright/test';
import {
    getOtp,
    generateUniquePhoneNumberByCountry,
    generateEmailByCountry,
    generatePinCodeByCountry,
    generateFirstNameByCountry,
    generateLastNameByCountry,
    getUserAuthLocators
} from '../../utils/index';
import { fillOtpInputs } from '../../helpers/otpHelper';
import { logger } from '../../helpers/logger';

export class UserAuthLogin {
    readonly page: Page;
    readonly locators: ReturnType<typeof getUserAuthLocators>;

    country: string;
    phoneNumber: string;
    pinCode: string;

    constructor(page: Page) {
        this.page = page;
        this.locators = getUserAuthLocators(page);
    }
    async navigateToNibavLiftsHomePage(): Promise<Page> {
        const env = process.env.ENVIRONMENT?.toLowerCase() || 'development';

        const baseUrl = env === 'staging' ? process.env.STAGING_URL : process.env.DEV_URL;

        if (!baseUrl) {
            throw new Error(`Base URL not defined for environment: ${env}`);
        }

        await this.page.goto(baseUrl, { waitUntil: 'load' });
        return this.page;
    }

    async acceptCookiesIfVisible() {
        try {
            await this.locators.cookieAcceptBtn.waitFor({ state: 'visible', timeout: 20000 });
            await this.locators.cookieAcceptBtn.click();
        } catch {
            logger.log('No cookie banner visible');
        }
    }
    async selectCountryFromMegaMenu(region: string, country: string, language: string) {
        await this.locators.globeIcon.waitFor({ state: 'visible', timeout: 20000 });
        await this.locators.globeIcon.click();
        const languageOption = this.page.locator(`xpath=
            //div[@class='nl-locale'][.//h3[normalize-space()='${region}']]
              //div[contains(@class, 'nl-locale-country')][.//h5[normalize-space()='${country}']]
                //a[normalize-space()='${language}']
        `);

        await languageOption.waitFor({ state: 'visible', timeout: 10000 });
        await languageOption.click();
        await this.page.waitForLoadState('networkidle');

        const { width, height } = this.page.viewportSize() || { width: 1280, height: 720 };
        await this.page.mouse.move(width / 2, height - 5);
        await this.page.waitForTimeout(500);
    }
    async generateAndEnterPhoneNumber(): Promise<string> {
        await this.locators.userLoginIcon.waitFor({ state: 'visible', timeout: 5000 });

        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/metadata/get/by/path') && resp.status() === 201),
            this.locators.userLoginIcon.click()
        ]);

        this.phoneNumber = generateUniquePhoneNumberByCountry(this.country);
        await this.locators.phoneInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.locators.phoneInput.fill(this.phoneNumber);
        logger.log(`Phone number created during registration: ${this.phoneNumber}`);
        await this.locators.submitLoginBtn.waitFor({ state: 'visible', timeout: 10000 });

        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/auth/login') && resp.status() === 404),
            this.locators.submitLoginBtn.click()
        ]);

        return this.phoneNumber;
    }
    async userRegistration() {
        const firstName = generateFirstNameByCountry(this.country);
        const lastName = generateLastNameByCountry(this.country, firstName);
        const email = generateEmailByCountry(this.country, firstName, lastName);
        const pinCode = generatePinCodeByCountry(this.country);

        this.pinCode = pinCode;

        await this.locators.firstNameInput.fill(firstName);
        await this.locators.lastNameInput.fill(lastName);
        logger.log(`Full name: ${firstName} ${lastName}`);

        await this.locators.emailInput.fill(email);
        logger.log(`Email: ${email}`);

    
        const digits = pinCode.split('');
        for (let i = 0; i < digits.length; i++) {
            await this.locators.pinCodeInput.press(digits[i]);
            if (i === digits.length - 2) {
                await this.page.waitForTimeout(300); 
            }
        }

        await this.locators.verifyMyAccountBtn.waitFor({ state: 'attached', timeout: 10000 });
        await expect(this.locators.verifyMyAccountBtn).toBeVisible({ timeout: 10000 });
        await expect(this.locators.verifyMyAccountBtn).toBeEnabled({ timeout: 10000 });

        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/auth/register') && resp.status() === 201),
            this.locators.verifyMyAccountBtn.click()
        ]);

        const otp = getOtp();
        await fillOtpInputs(this.page, otp);

        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/auth/verify/otp') && resp.status() === 201),
            this.locators.otpSubmitBtn.click()
        ]);

        await this.page.waitForTimeout(2000);
        await expect(this.locators.otpSuccessPopup).toBeVisible({ timeout: 1000 });
        await this.locators.closePopupBox.click();
        await this.page.waitForLoadState('networkidle');
        await this.locators.profileSettings.waitFor({ state: 'visible', timeout: 10000 });
        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/dashboard/profile-settings') && resp.status() === 200),
            this.locators.profileSettings.click()
        ]);
        await this.locators.profilePage.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.waitForTimeout(2000);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.page.screenshot({ path: `./test-results/screenshots/profile-${timestamp}.png`, fullPage: true });
        await this.page.waitForTimeout(3000);
    }
    async userLogin() {
        await this.locators.signOutBtn.click();
        await this.page.waitForTimeout(3000);

        await this.locators.userLoginIcon.waitFor({ state: 'visible', timeout: 5000 });
        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/metadata/get/by/path') && resp.status() === 201),
            this.locators.userLoginIcon.click()
        ]);
        await this.page.waitForTimeout(1500);
        await this.locators.phoneInput.fill(this.phoneNumber);
        logger.log(`Attempting login with registered number: ${this.phoneNumber}`);

        await this.locators.submitLoginBtn.waitFor({ state: 'visible', timeout: 500 });
        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/auth/login') && resp.status() === 200),
            this.locators.submitLoginBtn.click()
        ]);
        const otp = getOtp();
        await fillOtpInputs(this.page, otp);

        await Promise.all([
            this.page.waitForResponse((resp) => resp.url().includes('/auth/verify/otp') && resp.status() === 201),
            this.locators.otpSubmitBtn.click()
        ]);

        await this.page.waitForTimeout(2000);
        await expect(this.locators.otpSuccessPopup).toBeVisible({ timeout: 5000 });
        await this.locators.closePopupBox.click();
        logger.log(`Successfully logged in with: ${this.phoneNumber}`);
    }
}
