Nibav Lifts – Playwright Web E2E Automation
📌 Overview
This Playwright test suite automates the complete order journey for Nibav Lifts — from user registration all the way to payment selection.

It verifies:

✅ Successful user sign-up and login

✅ Correct product configuration flow

✅ Order summary matches chosen selections

✅ Smooth checkout & payment flow

📋 Test Flow
1. User Registration & Login

Generate a random phone number

Register a new account

Log in using OTP verification

2. Product Configuration

Select number of stops (dynamically based on product)

Randomly choose:

Lift color

Highlight finish

Base finish

Door access per floor

Hinge positions

Add-ons: Head unit, Carpet

Alexa integration

Custom engraving

Cover plates

Grande & Pro accessories

Validate: Support bracket count matches the number of stops

3. Summary & Checkout

Choose delivery method

Capture booking amount & breakdown

Verify summary matches configurations

Place order with signature

Handle address & extract region data

Prepare payment parameters

Select and process payment option

🛠 Tech Stack
Playwright – browser automation

TypeScript – for strong typing

Page Object Model – maintainable test structure

Custom Fixtures & Helpers – reusability across tests

📦 Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/your-username/your-repo.git

# Navigate into the project
cd your-repo

# Install dependencies
npm install
▶ Running the Tests
bash
Copy
Edit
# Run all tests
npx playwright test

# Run this specific test
npx playwright test nibav-summary-interactions.spec.ts

# Run in headed mode for debugging
npx playwright test nibav-summary-interactions.spec.ts --headed
