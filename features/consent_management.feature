Feature: Privacy and direct marketing
       I want to manage the consent of my contact details

       Scenario: I want general consent to be optin
              Given I am logged in with user
              And I have an email, fixed number and mobile number
              And My general consent is optout
              When I change my general consent to optin
              Then All my consents are set to "Not yet captured"

       Scenario: I want general consent to be optout
              Given I am logged in with user
              And I have an email, fixed number and mobile number
              And My general consent is optin
              When I change my general consent to optout
              Then All my consents are set to "No"

       Scenario: I want to give one consent in general optout
              Given I am logged in with user
              And I have an email, fixed number and mobile number
              And My general consent is optout
              When I give consent to the "email" contact point
              Then I see an error message

       Scenario: I want to give one consent in general optin
              Given I am logged in with user
              And I have an email, fixed number and mobile number
              And My general consent is optin
              And All my consents are on "Not yet captured"
              When I give consent to the "email" contact point
              Then The consent of the selected contact point is set to "YES"
              And I see the success message

       Scenario Outline: I want to change the consent of a contact point
              Given I am logged in with user
              And I have an email, fixed number and mobile number
              And My general consent is optin
              And My email consent is on <consent>
              When I modify the consent to <newConsent>
              Then I should see a success message

              Examples:
                     |consent  | newConsent  |
                     | "YES"   | "NO"        |
                     | "NO"    | "YES"       |