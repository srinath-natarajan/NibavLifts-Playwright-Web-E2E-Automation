import { Page } from '@playwright/test';
import { RazorpayOptionsMap } from './paymentOptions';

export const getsummarylocators = (page: Page, currentProduct: string) => {
    const isSeriesIVorV = currentProduct.includes('IV') || currentProduct.includes('V');
    const deliveryIndex = isSeriesIVorV ? 11 : 9;
    const priceIndex = isSeriesIVorV ? 12 : 10;

    return {
        //Series V / V Max
        seriesV_noOfStops: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p/span)[5]`),
        seriesV_highlightFinishes: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[2]/span`),
        seriesV_baseFinishes: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[4]/span`),
        seriesV_liftColor: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[6]/span`),
        seriesV_floor0: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p)[12]/span`),
        seriesV_floor1: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p)[14]/span`),
        seriesV_floor2: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p)[16]/span`),
        seriesV_floor3: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p)[18]/span`),
        seriesV_carpet: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-3"]/div[@class="grid grid-cols-2"]/p)[8]/span`),

        //Series IV / IV Max / III / III Max
        otherSeries_noOfStops: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p/span)[5]`),
        otherSeries_floor0: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p/span)[6]`),
        otherSeries_floor1: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p/span)[7]`),
        otherSeries_floor2: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p/span)[8]`),
        otherSeries_floor3: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-0"]/div[@class="grid grid-cols-2"]/p/span)[9]`),
        series3_liftColor: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[2]/span`),
        series4_liftColor: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[6]/span`),
        otherSeries_baseFinishes: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[4]/span`),
        otherSeries_highlightFinishes: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-2"]/div[@class="grid grid-cols-2"]/p)[2]/span`),
        otherSeries_carpet: page.locator(`xpath=(//div[@data-testid="summary-detail-item-summary-detail-3"]/div[@class="grid grid-cols-2"]/p)[8]/span`),

        // Summary Commercial Section
        deliveryOption: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${deliveryIndex}"]//p`),

        modelPrice: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[1]/p[2]`),
        premiumEnhancement: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[2]/p[2]`),
        transportation: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[3]/p[2]`),
        installation: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[4]/p[2]`),
        tax: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[5]/p[2]`),
        totalAmountIncludingTax: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[6]/h6[2]`),
        downPaymentAmount: page.locator(`xpath=//div[@data-testid='summary-actions-summary-detail']//p[1]`),

        // USA & Canada Specific Summary
        USAandCA_Tax: page.locator(`xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[4]/p[2]`),
        USAandCA_TotalAmountIncludingTax: page.locator(
            `xpath=//div[@data-testid="summary-detail-item-summary-detail-${priceIndex}"]//div[5]/h6[2]`
        ),

        // Navigation & Order Actions
        paymentTermsLink: page.locator(`//a[contains(@class,'!text-blue nl-link-primary')]`),
        orderNowBtn: page.locator(`xpath=//button[@data-testid='order-summary']`),
        UploadSignatureBtn: page.locator(`//span[@class='p-2']/following-sibling::span[1]`),

        // Terms & Confirmation
        termsAndCondtsCheckBox: page.locator(`//label[@for='agree_checkbox']//span[1]`),
        submitBtn: page.locator(`(//button[contains(@class,'flex items-center')])[3]`),
        quotaionPreviewCheckBox: page.locator(`//div[@data-testid="quotation-preview"]//input[@type="checkbox"]`),
        nextBtn: page.locator(`//div[@class='max-w-full']/following-sibling::button[1]`),

        // GST & Address Details
        gstCheckboxBtn: page.locator(`//div[@data-testid="have-gst"]//input[@type="checkbox" and @name="haveGST"]`),
        enterGST: page.locator(`//div[@data-testid="gst-number"]//input[@name="gstNumber"]`),
        addressLine1: page.locator(`//div[@data-testid="address-line-1"]//input[@name="addressLine1"]`),
        addressLine2: page.locator(`//div[@data-testid="address-line-2"]//input[@name="addressLine2"]`),
        landmark: page.locator(`//div[@data-testid="address-line-1"]//input[@name="landMark"]`),
        gstConfirm: page.locator(`//div[@data-testid="gst-terms"]//input[@name="gstDocumentTerms"]`),

        addressLine1CA_FRInput: page.locator(`(//label[contains(.,'Adresse ligne 1*')]/following::input)[1]`),
        addressLine2CA_FRInput: page.locator(`(//label[normalize-space(text())='Adresse ligne 2']/following::input)[1]`),
        landmarkInputCA_FR: page.locator(`(//label[normalize-space(text())='Point de repère (facultatif)']/following::input)[1]`),

        nextBtnCA_fr1: page.locator(`//button[@type='submit']`),
        nextBtnCA_fr2: page.locator(`//button[normalize-space(text())='Suivant']`),

        // USA Address
        SelectedCityforUSA: page.locator(`input[name='city']`),
        SelectedStateForUSA: page.locator(`//div[contains(@class,'nl-form-input-select overflow-hidden')]`),

        // Navigation Buttons
        NextBtn2: page.locator(`//button[normalize-space(text())='Next']`),
        NextBtn3: page.locator(`//button[normalize-space(text())='Next']`),

        // Payment Details (UI View)
        paymentPercentagelabelText: page.locator(`//h1[contains(@class,'nl-gmd-20 min-lg:nl-gmd-40')]/following-sibling::p[1]`),
        totalAmountWithTaxText: page.locator(`(//p[@data-testid='price-discounted-total-amount'])[2]`),
        totalAmountText: page.locator(`(//p[@data-testid='price-discounted-total-amount'])[1]`),
        downPaymentAmountText: page.locator(`//p[@data-testid='price-down-payment-price']`),

        // paymentOption
        paymentOptionByValue: (value: string) => page.locator(`input[name="payment_method"][value="${value}"]`),

        // Razorpay Payment Options (Page Level)
        razorpayOptions: {
            CreditCard: page.locator(`//label[text()='Credit Card']`),
            DebitCard: page.locator(`//label[text()='Debit Card']`),
            NetBanking: page.locator(`//label[text()='NetBanking']`),
            AmexCard: page.locator(`//label[text()='Amex Card']`),
            InternationalCard: page.locator(`//label[text()='International Card']`)
        } as RazorpayOptionsMap,

        // Razorpay Frame & Payment Flow
        submitBtnForRazorpay: page.locator(`//button[normalize-space(text())='Submit']`),
        ViewOrderBtn: page.locator(`//div[@data-testid='order-success']//button[1]`),

        // Cheque or DD Payment Locators (Global)
        chequeNumberInput: page.locator(`//input[contains(@class,'nl-form-input-text nl-form-input-text')]`),
        downPaymentAmountInput: page.locator(`//div[@data-testid="cheque-input"]//input[@name="amount"]`),
        uploadChequeBtn: page.locator(`//div[@data-testid='input-file']`),
        commonNextButton: page.locator(`//button[contains(@class,'flex items-center')]`),

        chequeOrDdPymentDetailsValidationOtpPopup: page.locator(`[data-testid="payment-details-validation-otp-component"]`),
        chequeOrDdOrderSuccess: page.locator(`[data-testid="order-success"]`),

        // Contact Sales - Employee Verification & OTP
        salesEmployeeDataPopup: page.locator(`[data-testid="sales-employee-data"]`),
        salesEmployeeSubmitButton: page.locator(`//div[@data-testid="sales-employee-data"]//button[1]`),
        contactSalesVerificationOtpPopup: page.locator(`[data-testid="contact-sales-verification-otp-component"]`),
        salesOrderSuccessPopup: page.locator(`[data-testid="order-success"]`),
        salesOrderSuccessGoToDashboardBtn: page.locator(`//div[@data-testid='order-success']//button[1]`),

    };
};
