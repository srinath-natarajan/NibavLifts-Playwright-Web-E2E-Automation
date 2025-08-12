import { test } from '../src/fixtures/allFixtures';
import { getCurrentProduct } from '../src/helpers/index';

test.describe.parallel('Nibav Lifts - Summary and other Interactions', () => {
    test('Navigate to Product Configuration and Interactions', async ({ userAuth, productConfig, summaryOrderpage }) => {
        test.slow();

        await test.step('Complete user registration and Attempt Login with registered number', async () => {
            await userAuth.generateAndEnterPhoneNumber();
            await userAuth.userRegistration();
            await userAuth.userLogin();
        });

        await test.step('Configurable items, Accessories and Interactions', async () => {
            const productName = getCurrentProduct();

            const { noOfStops, selectedText } = await productConfig.handleNoOfStopsDropDownDynamic(productName);
            const selectedColor = await productConfig.selectRandomLiftColor();
            const selectedHighlight = await productConfig.selectRandomHighlightFinish();
            const selectedBase = await productConfig.selectRandomBaseFinish();
            await productConfig.handleDoorAccessPerFloor(noOfStops);

            const { selectedSides } = await productConfig.completeDoorAccessAndHingeConfig(noOfStops);

            await productConfig.selectRandomHeadUnit();
            const selectedCarpet = await productConfig.selectRandomCarpet();
            await productConfig.selectFoldableOrCabin();
            await productConfig.toggleAlexaAccessory();
            await productConfig.toggleCustomBuildEngravingAccessory();
            await productConfig.handleCoverPlatesAccessory(noOfStops);
            await productConfig.verifySupportBracketCountMatchesNoOfStops(noOfStops);
            await productConfig.selectGrandeAndProAddons();

            const { method } = await productConfig.selectDeliveryMethod(productConfig.region);
            const bookingData = await productConfig.verifyBookingAmountAndCaptureBreakdown(method, userAuth.pinCode);
            const breakdown = await summaryOrderpage.verifyCommercials(bookingData);

            await summaryOrderpage.verifySelectedConfigurationInSummary({
                product: productName,
                noOfStops,
                selectedText,
                carpet: selectedCarpet,
                highlightFinish: selectedHighlight,
                baseFinish: selectedBase,
                liftColor: selectedColor,
                sidesPerFloor: selectedSides
            });

            await summaryOrderpage.placeOrderWithSignature();
            await summaryOrderpage.handleAddressSectionAndExtractRegionData();
            const params = await summaryOrderpage.preparePaymentParams(productConfig, breakdown, userAuth.phoneNumber);
            await summaryOrderpage.selectAndHandlePaymentOption(params);
        });
    });
});
