Feature: Nibav Lifts - Summary Page and Order Placement

    As a registered user
    I want to configure a lift and complete the order
    So that I can successfully make a booking with accurate payment

    Background:
        Given the admin is logged into the DevPortal using valid credentials
        And a new user is registered and logged in using a generated phone number

    Scenario: Complete product configuration, validate summary, and place the order
        When the user selects the number of stops dynamically
        And selects a random lift color
        And configures door access for each floor
        And completes hinge configuration
        And selects a random head unit
        And selects a random carpet option
        And chooses either a foldable or cabin type
        And toggles the Alexa accessory
        And adds cover plates per floor
        And verifies that the number of support brackets matches the number of stops
        And selects a delivery method
        And verifies the booking amount and captures the commercial breakdown
        And validates the commercials shown in the summary page
        And places the order with a digital signature
        Then the user completes the payment flow based on the selected payment method
