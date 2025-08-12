import { test } from '../src/fixtures/allFixtures';

test.describe.parallel('Nibav Lifts - Registration & Login Flow', () => {
    test('User Registration and Login', async ({ userAuth }) => {
        await test.step('Complete user registration and Attempt Login with registered number', async () => {
            await userAuth.generateAndEnterPhoneNumber();
            await userAuth.userRegistration();
            await userAuth.userLogin();
        });
    });
});
