#Comment
#Logged in with English customer

Feature: As a customer i want to get the list of countries

    Scenario: I want to retrieve the list of countries
        Given that i am a logged in user
        When I request the list of countries
        Then I see the list of countries and "FRANCE" is included

    Scenario: The country Yugoslavia is in the list of 1970
        Given that i am a logged in user
        When I request the list of countries with a date of 1970
        Then I see the list of countries and "YOUGOSLAVIE" is included

    Scenario: I want to retrieve the Belgium country details
        Given that i am a logged in user
        When I request details for Belgium
        Then I see nationality is Belgian

    Scenario: I want to retrieve a country list without an Incorrect country
        Given that i am a logged in user
        When I request the list of countries with a date of 1970
        Then I do not see the incorrect country in the list
    