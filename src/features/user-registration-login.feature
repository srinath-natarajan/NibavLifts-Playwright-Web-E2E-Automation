
Feature: Nibav Lifts - Registration and Login Flow

    As a new user
    I want to register with a phone number
    So that I can access the Nibav customer portal

    Background:
        Given the admin is logged into the DevPortal using valid credentials

    Scenario: User completes registration and logs in with phone number
        When the user generates a new phone number
        And enters the phone number for registration
        And completes the user registration process
        And logs in using the registered phone number
        Then the user should be successfully logged in
