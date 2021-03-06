Feature: Revoke consent

    Scenario: Create PSD2 grouped accounts consent in fortis
        Given I get the list of accounts of a user in "Fortis"
        When I create a psd2 consent in "Fortis"
        Then The psd2 consent is created

    Scenario: Create PSD2 grouped accounts consent in fintro
        Given I get the list of accounts of a user in "Fintro"
        When I create a psd2 consent in "Fintro"
        Then The psd2 consent is created

    Scenario: Create 20 + PDS2 consents in fortis
        When I create more than twenty psd2 consents in "Fortis"
        Then The psd2 consent is created

    Scenario: Create 20 + PDS2 consents in fintro
        When I create more than twenty psd2 consents in "Fintro"
        Then The psd2 consent is created

    Scenario: Delete all PSD2 consents
        Given I am logged in with a smid that has PSD2 consents
        When I delete all PSD2 consents
        Then The list is empty