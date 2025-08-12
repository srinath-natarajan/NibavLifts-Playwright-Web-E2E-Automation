import { Page } from '@playwright/test';

export const getUserAuthLocators = (page: Page) => ({
    //Signup
    userLoginIcon: page.locator(`//div[@class='max-h-fit max-w-fit']`),
    globeIcon: page.locator(`(//div[@data-testid='header-right-icon']/following-sibling::div)[1]`),

    // Cookies
    cookieAcceptBtn: page.locator(`//button[contains(@class, 'nl-btn-primary')]`),

    // Login
    phoneInput: page.locator(`//input[@data-testid='number-input']`),
    submitLoginBtn: page.locator(`//button[@data-testid='login-submit-button']`),

    // Registration
    firstNameInput: page.locator(`//input[@name='firstName']`),
    lastNameInput: page.locator(`//input[@name='lastName']`),
    emailInput: page.locator(`//input[@name='email']`),
    pinCodeInput: page.locator(`//input[@name='pinCode']`),
    verifyMyAccountBtn: page.locator(`//button[@type='submit']`),

    // OTP
    otpInput: page.locator(`(//input[@data-testid='otp-component-input'])[1]`),
    otpSubmitBtn: page.locator(`//button[@type='submit']`),
    otpSuccessPopup: page.locator(`//div[@data-testid='authentication']//h3`),
    closePopupBox: page.locator(`//button[@data-testid='popup-close-btn']`),

    // Profile
    profileSettings: page.locator(`(//div[contains(@class,'flex items-center')]//h5)[2]`),
    profilePage: page.locator(`(//div[@class='flex-1']//p)[1]`),
    signOutBtn: page.locator(`(//div[contains(@class,'flex items-center')]//h5)[3]`)
});
