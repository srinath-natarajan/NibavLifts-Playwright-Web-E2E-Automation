Feature: Nibav Lifts - Product Configuration Flow

    As a registered user
    I want to configure the lift product
    So that I can view accurate booking and payment details

    Background:
        Given the admin is logged into the DevPortal using valid credentials
        And a new user is registered and logged in using a generated phone number

    Scenario: User completes product configuration and captures payment breakdown
        When the user selects the number of stops dynamically
        And selects a random lift color
        And configures door access for each floor
        And completes hinge configuration for all selected floors
        And selects a random head unit
        And selects a random carpet option
        And chooses either a foldable or cabin type
        And toggles the Alexa accessory option
        And adds cover plates based on number of stops
        And verifies that the number of support brackets matches the number of stops
        And selects a delivery method
        Then the booking amount and payment breakdown should match the expected calculation
