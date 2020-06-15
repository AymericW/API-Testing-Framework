@contactpoints
Feature: As a customer i want to manage my contact points

  #  Scenario:
  #  Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #  When I retrieve my contactpoints
  #  Then status code is "200"

  #  Scenario: Adding a correct email
  #   Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #   And my general consent is opt "in"
  #   And I have no email contactpoints
  #   When I introduce a new email address "john@doe.com" with private usage and communication consent to "IN"
  #   Then I see "john@doe.com" in the email list
 
  #  Scenario: Adding an incorrect Email
  #    Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #    And my general consent is opt "in"
  #    And I have no email contactpoints
  #    When I introduce a new email address "<=->@doe.com" with private usage and communication consent to "IN"
  #    Then I see an error message


  ###TO IMPLEMENT-----

  #Add domestic phone
    Scenario Outline: Adding a personal, professional, fixed and forgein phone numbers
      Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
      When I introduce a new domestic phone number <phone_number> with <type>
      Then I see <phone_number> in the phone number list with <type>

      Examples:
      | phone_number | type   |
      | "014145896"  | "01"   |
      | "0489145897" | "05"   |
      | "014145896"  | "02"   |
      | "014145896"  | "06"   |

  #   Delete email
  #   Scenario: Deleting an email
  #   Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #   When I delete an email
  #   Then I should not see the email in the list anymore

  #Delete mobile phone
  #Delete fixed line
  #Modify email
  #Modify mobile phone
  #Modify fixed line

  # 03 is private Email and 04 is professional Email
  # 05 is GSM
  # 01 is Fixed line
