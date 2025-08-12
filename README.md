## Playwright End-to-End Tests

This project, `el_e2e_cl`, automates end-to-end testing for Nibav applications using Playwright, Cucumber, and TypeScript. It offers a robust framework for developing, managing, and executing browser-based tests with efficiency.

### Key Features

-   **Playwright Integration**: Utilizes Playwright for browser automation, simulating real user actions across different browsers.
-   **Cucumber for BDD**: Supports Behavior-Driven Development (BDD) with Cucumber, allowing tests to be written in natural language.
-   **TypeScript Support**: Leverages TypeScript for static type checking and the latest ECMAScript features, enhancing code quality and maintainability.

**Note**: `Feature files are primarily used for tracking test scenarios and manual testing. Feature tags have been added to Playwright to identify which scenarios are automated.`

### Prerequisites

Before setting up the project, ensure you have installed:

-   Node.js (Version 18 or above, latest stable version recommended)

### Getting Started

To set up the project, follow these steps:

**Clone the Repository**

Clone the repository using the following command:

      git clone https://your-username@bitbucket.org/nibavlifts/el_e2e_cl.git

**Navigate to the Project Directory**

Change to the project directory with:

      cd el_e2e_cl

**Install Dependencies**

Install the required dependencies by running:

      npm install

**Run Tests**

Execute the tests with with browser:

      npx playwright test

To run a specific test file, use:

      npx playwright test "test file name"
