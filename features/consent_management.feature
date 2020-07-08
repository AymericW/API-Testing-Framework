 Feature: As a customer I'd like to change my consents without any troubles
 
 Scenario: Set every consent to yes
        Given I log in
        And I reset my emails to none
        And I reset my phone numbers to none
        And I check I have at least one contact point for each type "simon@pin.le" "0489145897" "025692356"
        And I check general optout is on "OU"
        # And I check general optin is on
        # When I change my email consent to yes
        # Then I see a success message

# Scenario: General optout
#         Given I log in 
#         And I check general optin is on
#         When I check general optout is on
#         Then I see all consents to no

# Scenario: General optin
#         Given I log in
#         And I check general optout is on
#         When I check general optin is on
#         Then I see all consents to nyc

