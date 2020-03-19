Feature: Revoke consent
   
    Scenario: Create PSD2 Consent
    Given I get the list of accounts of a user
    When I create a psd2 consent
    Then I see the list of accounts