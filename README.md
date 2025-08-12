🛗 Nibav Lifts – Summary & Product Configuration E2E Test
📌 Overview
This Playwright test suite automates the complete order journey for Nibav Lifts, from user registration all the way to payment selection.

It verifies:

✅ Successful user sign-up and login

✅ Correct product configuration flow

✅ Order summary matches chosen selections

✅ Smooth checkout & payment flow

🖼️ Flow Diagram
mermaid
Copy
Edit
flowchart TD
    A[Start Test] --> B[Generate & Enter Phone Number]
    B --> C[User Registration]
    C --> D[User Login with OTP]
    D --> E[Select No. of Stops]
    E --> F[Select Lift Color, Highlight, Base Finish]
    F --> G[Configure Door Access per Floor]
    G --> H[Configure Hinge Positions]
    H --> I[Select Head Unit & Carpet]
    I --> J[Toggle Accessories (Alexa, Engraving, Cover Plates)]
    J --> K[Select Grande & Pro Add-ons]
    K --> L[Verify Support Brackets]
    L --> M[Select Delivery Method]
    M --> N[Capture Booking Amount & Breakdown]
    N --> O[Verify Order Summary Matches Configurations]
    O --> P[Place Order with Signature]
    P --> Q[Handle Address & Extract Region]
    Q --> R[Prepare Payment Parameters]
    R --> S[Select Payment Option]
    S --> T[End Test]
🚀 Test Flow
1️⃣ User Registration & Login
Generate a random phone number

Register a new account with that number

Log in using OTP verification

2️⃣ Product Configuration
Select No. of Stops dynamically based on product

Randomly choose:

Lift color

Highlight finish

Base finish

Configure:

Door access per floor

Hinge positions

Add-ons:

Head unit

Carpet

Alexa integration

Custom engraving

Cover plates

Grande & Pro accessories

Validate:

Support bracket count matches no. of stops

3️⃣ Summary & Checkout
Choose delivery method

Capture booking amount & breakdown

Verify summary matches selected configurations

Place order with signature

Handle address & extract region data

Prepare payment parameters

Select and process payment option

🛠️ Tech Stack
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
▶️ Running the Test
bash
Copy
Edit
# Run all tests
npx playwright test

# Run this specific test
npx playwright test nibav-summary-interactions.spec.ts

# Run in headed mode for debugging
npx playwright test nibav-summary-interactions.spec.ts --headed
