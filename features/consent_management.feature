 Feature: As a customer I'd like to change my consents without any troubles
 
 Scenario Outline: Set every consent to yes
        Given I log in
        And I go to the contact details settings
        And I reset contact points to none
        And I check I have at least one contact point for each type "simon@pin.le" "0489145897" "025692356" "professional"
        And I go to the consent page settings
        And I check general optout is on
        And I check general optin is on
        When I change my consent to yes
        Then I see a success message
        
        Examples:
        | profile      | email           | mobile         | fixed         | use             |
        | "AdultFR"     | "simon@pin.le"  | "0489145897"   | "025692356"   | "professional"  |
        # | "Adult1"     | "simon@pin.le"  | "0489145897"   | "025692356"   | "professional"  |

Scenario: General optout
        Given I log in 
        And I go to the consent page settings
        And I check general optin is on
        When I check general optout is on
        Then I see all consent to no

Scenario: General optin
        Given I log in
        And I go to the consent page settings
        And I check general optout is on
        When I check general optin is on
        Then I see all consent to nyc

