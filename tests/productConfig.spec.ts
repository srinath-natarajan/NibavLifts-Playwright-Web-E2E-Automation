import { test } from '../src/fixtures/allFixtures';
import { getCurrentProduct } from '../src/helpers/index';

test.describe.parallel('Nibav Lifts - Product Configuration Flow', () => {
    test('Navigate to Product Configuration and Interactions', async ({ userAuth, productConfig }) => {
        await test.step('Complete user registration and Attempt Login with registered number', async () => {
            await userAuth.generateAndEnterPhoneNumber();
            await userAuth.userRegistration();
            await userAuth.userLogin();
        });

        await test.step('Configurable items, Accessories and Interactions', async () => {
            const productName = getCurrentProduct();

            const { noOfStops } = await productConfig.handleNoOfStopsDropDownDynamic(productName);
            await productConfig.selectRandomLiftColor();
            await productConfig.handleDoorAccessPerFloor(noOfStops);
            await productConfig.selectRandomHeadUnit();
            await productConfig.selectFoldableOrCabin();
            await productConfig.toggleAlexaAccessory();
            await productConfig.handleCoverPlatesAccessory(noOfStops);
            await productConfig.verifySupportBracketCountMatchesNoOfStops(noOfStops);
            await productConfig.selectGrandeAndProAddons();
            const { method } = await productConfig.selectDeliveryMethod(productConfig.region);
            await productConfig.verifyBookingAmountAndCaptureBreakdown(method, userAuth.pinCode);
        });
    });
});
