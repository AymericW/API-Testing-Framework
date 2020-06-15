@contactpoints
Feature: As a customer i want to manage my contact points

  #  Scenario:
  #  Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #  When I retrieve my contactpoints
  #  Then status code is "200"

   Scenario: Adding a correct email
    Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
    And my general consent is opt "in"
    And I have no email contactpoints
    When I introduce a new email address "john@doe.com" with private usage and communication consent to "IN"
    Then I see "john@doe.com" in the email list
 
   Scenario: Adding an incorrect Email
     Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
     And my general consent is opt "in"
     And I have no email contactpoints
     When I introduce a new email address "<=->@doe.com" with private usage and communication consent to "IN"
     Then I see an error message


  ###TO IMPLEMENT-----
  #Add domestic phone
    Scenario: Adding a domestic personal phone number
      Given Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
      When I introduce a new domestic phone number "0497751084"
      Then I see "0497751084" in the phone number list

  #Add domestic fixed line phone no
  #Add foreign no
  #Add foreign fixed line
  #Delete email
  #Delete mobile phone
  #Delete fixed line
  #Modify email
  #Modify mobile phone
  #Modify fixed line
