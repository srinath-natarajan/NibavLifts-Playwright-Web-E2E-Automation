Feature: Dev Portal Login Functionality

    As an user
    I want to log in to the Nibav Dev Portal
    So that I can access the dashboard and manage operations

    @navigate @login @assertion
    Scenario: Successful login and dashboard title verification
        Given the user navigates to the Nibav Dev Portal
        When the user enters valid email and password
        And clicks on the login button
        Then the user should be redirected to the dashboard
        And a full-page screenshot should be captured
        And the page title should be "Nibav Core - Admin Dashbaord"