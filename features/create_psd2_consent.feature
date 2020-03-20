Feature: Revoke consent
   
    Scenario: Create PSD2 Consent
    Given I get the list of accounts of a user
    When I create a psd2 consent in "Fortis"
    Then The psd2 consent is created
    
    Scenario: Create PSD2 Consent
    Given I get the list of accounts of a user
    When I create a psd2 consent in "Fintro"
    Then The psd2 consent is created