#Comment
#Logged in with English customer

Feature: As a customer i want to get the list of countries

Scenario: I want to retrieve the list of countries
Given I am logged in
When I request the list of countries
Then I see the list of countries and France is included

Scenario: The country Yugoslavia is in the list of 1970
Given I am logged in
When I request the list of countries with a date of 1970
Then I see the list of countries and Yugoslavia is included

Scenario: I want to retrieve the Belgium country details
Given I am logged in
When I request details for Belgium
Then I see nationality is Belgian