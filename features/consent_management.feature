Feature: Privacy and direct marketing
  I want to manage the consent of my contact details

  Scenario: I want general consent to be optin
    Given I am logged in with user
    And I reset my emails to none
    And I reset my phone numbers to none
    And I check I have at least one contact point for each type "simon.pin@gmail.be" "0489145890" "014145896"
    And My general consent is optout
    When I change my general consent to optin
    Then All my consents are set to "NC"

  Scenario: I want general consent to be optout
    Given I am logged in with user
    And I reset my emails to none
    And I reset my phone numbers to none
    And I check I have at least one contact point for each type "simon.pin@gmail.be" "0489145890" "014145896"
    And My general consent is optin
    When I change my general consent to optout
    Then All my consents are set to "OU"

  Scenario: I want to give one consent in general optout
    Given I am logged in with user
    And I reset my emails to none
    And I reset my phone numbers to none
    And I check I have at least one contact point for each type "simon.pin@gmail.be" "0489145890" "014145896"
    And My general consent is optout
    When I give consent to the email contact point
    Then there is an error

  Scenario: I want to give one consent in general optin
    Given I am logged in with user
    And I reset my emails to none
    And I reset my phone numbers to none
    And I check I have at least one contact point for each type "simon.pin@gmail.be" "0489145890" "014145896"
    And My general consent is optin
    And All my consents are on NC
    When I give consent to the "email" contact point
    Then The consent of the selected contact point is set to "IN"
    And I see the success message
#
#       Scenario Outline: I want to change the consent of a contact point
#              Given I am logged in with user
#              And I reset my emails to none
#              And I reset my phone numbers to none
#              And I check I have at least one contact point for each type "simon.pin@gmail.be" "0489145890" "014145896"
#              And My general consent is optin
#              And My email consent is on <consent>
#              When I modify the consent to <newConsent>
#              Then I should see a success message
#
#              Examples:
#                     |consent  | newConsent  |
#                     | "YES"   | "NO"        |
#                     | "NO"    | "YES"       |