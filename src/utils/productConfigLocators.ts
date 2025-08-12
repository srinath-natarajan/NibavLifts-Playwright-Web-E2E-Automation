import { Page } from '@playwright/test';

export const getProductConfigLocators = (page: Page) => ({
    products: page.locator(`(//a[@data-testid='nav-items'])[1]`),
    productLinkBtn: (productName: string) =>
        page.locator(
            `//div[@data-testid="product-item-wrapper"][.//p[normalize-space() = "${productName}"]]//a[contains(@href, "/configure")]`
        ),
    noOfStopsDropDownBtn: page.locator(`//button[@data-testid='configurations-dropdown']`),
    noOfStopsDropDownBtnOptions: page.locator(
        `//div[@data-testid="no-of-stops-noOfStops"]//div[@id="dropdown-menu"]//ul[contains(@class, "text-sm")]/li/div[@aria-disabled="false" and contains(@class, "cursor-pointer") and normalize-space()]`
    ),

    // Colour
    liftColourCheckboxes: page.locator(`//div[h2[contains(@class, 'nl-gmd-28') and 
            (
                contains(normalize-space(.), 'Lift Colour') or 
                contains(normalize-space(.), 'Lift Color') or 
                contains(normalize-space(.), "Couleur de l'ascenseur") or 
                contains(normalize-space(.), 'Elevator Color')
            )
        ]
    ]//label[contains(@class, 'nl-label--checkbox')]`),

    // Door Access
    doorAccessHeaders: page.locator(`
        //h2[starts-with(normalize-space(), 'Floor') and contains(., 'Door Access') 
        or starts-with(normalize-space(), 'Étage') and contains(., 'Accès à la porte')]
    `),

    // Hinge
    hingeOptions: `xpath=
        //div[contains(@class, 'flex-row') and contains(@class, 'mb-6')]
        //div[contains(@class, 'border-2') and contains(@class, 'cursor-pointer')]
        [p[contains(text(), 'Hinge') or contains(text(), 'Gauche') or contains(text(), 'Droite')]]
    `,

    // Head Unit
    headUnitOptions: `xpath=
        //div[contains(@class, 'w-full') and .//h2[contains(text(), 'Head Unit') or contains(text(), 'Unité principale')]]
        //div[contains(@class, 'cursor-pointer') and contains(@class, 'border-2')]
    `,

    // Highlight Finishes (Series 4 / 4 Max)
    highlightFinishOptions: page.locator(`//h2[
        contains(normalize-space(), 'Highlight Finish') or 
        contains(normalize-space(), 'Finitions en surbrillance')
    ]/following-sibling::div[contains(@class, 'border-2')]//label[contains(@class, 'nl-label--checkbox')]`),

    // Base Finishes (Series 4 / 4 Max)
    baseFinishOptions: page.locator(`//h2[
        contains(normalize-space(), 'Base Finish') or 
        contains(normalize-space(), 'Finitions de base')
    ]/following-sibling::div[contains(@class, 'border-2')]//label[contains(@class, 'nl-label--checkbox')]`),

    // Carpet (same locator, but test should assert length based on series)
    carpetOptions: page.locator(`//div[@data-testid="image-radio-group-carpet"]//label[@title]`),

    // Foldable Seat
    foldableSeatAdd: page.locator(`//button[@data-testid='add-1']`),
    foldableSeatRemove: page.locator(`//button[@data-testid='remove-1']`),

    // Cabin Handle
    cabinHandleAdd: page.locator(`//button[@data-testid='add-2']`),
    cabinHandleRemove: page.locator(`//button[@data-testid='remove-2']`),

    // Engraving
    customBuildEngravingAdd: page.locator(`//button[@data-testid='custom-build-engraving-add']`),
    customBuildEngravingEdit: page.locator(`//button[@data-testid='custom-build-engraving-edit']`),
    customBuildEngravingSubmit: page.locator(`//button[@data-testid='submit-button']`),
    secondLineInput: page.locator(`div[data-testid="second-line"] input[name="secondLine"]`),

    // Alexa
    alexaAdd: page.locator(`//button[@data-testid='add-3']`),
    alexaRemove: page.locator(`//button[@data-testid='remove-3']`),

    // Cover Plate Floor
    coverPlateFloorInitialAdd: page.locator(`//button[@data-testid='add-4']`),
    coverPlateFloorPlus: page.locator(`//button[@data-testid='plus-4-1']`),
    coverPlateFloorMinus: page.locator(`//button[@data-testid='minus-4-1']`),

    // Cover Plate Roof
    coverPlateRoofInitialAdd: page.locator(`//button[@data-testid='add-5']`),
    coverPlateRoofPlus: page.locator(`//button[@data-testid='plus-5-1']`),
    coverPlateRoofMinus: page.locator(`//button[@data-testid='minus-5-1']`),

    // Support Bracket
    supportBracketInitialAdd: page.locator(`//button[@data-testid='add-6']`),
    supportBracketPlus: page.locator(`//button[@data-testid='plus-6-1']`),
    supportBracketMinus: page.locator(`//button[@data-testid='minus-6-1']`),
    supportBracketQuantity: page.locator(`//div[contains(@class, 'supportBracket')]//p[@class='nl-gmd-16']`),

    // Earthquake Bracket
    earthquakeBracketInitialAdd: page.locator(`//button[@data-testid='add-7']`),
    earthquakeBracketPlus: page.locator(`//button[@data-testid='plus-7-1']`),
    earthquakeBracketMinus: page.locator(`//button[@data-testid='minus-7-1']`),

    // Grande (visible in all regions)
    grandeAdd: page.locator(`//button[@data-testid='add-9']`),
    grandeRemove: page.locator(`//button[@data-testid='remove-9']`),

    // Pro (India only)
    proAdd: page.locator(`//button[@data-testid='add-10']`),
    proRemove: page.locator(`//button[@data-testid='remove-10']`),

    // Delivery (IND)
    fastDeliveryInd: page.locator(`(//div[contains(@class,'block text-center')]//p)[2]`), //2Months
    rapidDeliveryInd: page.locator(`(//div[contains(@class,'block text-center')]//p)[3]`), //1Month

    standardDeliveryDropDownBtnInd: page.locator(`(//button[@data-dropdown-placement='auto'])[2]`),
    standardDeliveryInd_3_Month: page.locator(`(//div[contains(@class,'block text-center')]//p)[1]`), //3Months
    standardDeliveryInd_4_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[5]`), //4Months
    standardDeliveryInd_5_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[6]`), //5Months
    standardDeliveryInd_6_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[7]`), //6Months

    // Delivery (NON-IND)
    rapidDeliveryNon_Ind: page.locator(`(//div[contains(@class,'block text-center')]//p)[2]`), 

    standardDeliveryDropDownBtnNon_Ind: page.locator(`(//button[@data-dropdown-placement='auto'])[2]`),
    standardDeliveryNonInd_5_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[4]`),
    standardDeliveryNonInd_6_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[5]`),
    standardDeliveryNonInd_7_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[6]`),
    standardDeliveryNonInd_8_Month: page.locator(`(//div[@data-testid="dropdown-menu"]/ul/li/div[@aria-disabled="false"])[7]`),

    // Price breakdown
    bookingAmount: page.locator(`//div[contains(@class,'flex items-center')]`),
    totalAmountExcludingTax: page.locator(`//span[@datatestid='total-amount-total-amount-bar']`),
    priceBreakDownBtn: page.locator(`(//button[contains(@class,'flex items-center')])[1]`),
    priceBreakDownPopup: page.locator(`//div[contains(@class, 'max-w-[600px]') and contains(@class, 'sm:min-w-[100%]')]`),
    priceBreakdownCloseBtn: page.locator(`//button[@data-testid='popup-close-btn']`),
    totalPrice: page.locator(`//span[@data-testid='price-breakdown-row-amount-totalPrice']`),

    // Price list
    modelPrice: page.locator(`//span[@data-testid='price-breakdown-row-amount-modelPrice']`),
    premiumEnhancementPrice: page.locator(`//span[@data-testid="price-breakdown-row-amount-premiumEnhancementsPrice"]`),
    transportationAndUnloadingPrice: page.locator(`//span[@data-testid="price-breakdown-row-amount-logisticsPrice"]`),
    installationPrice: page.locator(`//span[@data-testid="price-breakdown-row-amount-installationPrice"]`),

    // Continue (to summary page)
    continueBtn: page.locator(`(//div[@data-testid='order-actions-side-menu']//button)[1]`)
});
