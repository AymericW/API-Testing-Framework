@contactpoints
Feature: As a customer i want to manage my contact points

  #  Scenario:
  #  Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #  When I retrieve my contactpoints
  #  Then status code is "200"

   Scenario:
    Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
    And my general consent is opt "in"
    And I have no email contactpoints
    When I introduce a new email address "john@doe.com" with private usage and communication consent to "IN"
    Then I see "john@doe.com" in the email list
 
   Scenario:
     Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
     And my general consent is opt "in"
     And I have no email contactpoints
     When I introduce a new email address "<=->@doe.com" with private usage and communication consent to "IN"
     Then I see an error message