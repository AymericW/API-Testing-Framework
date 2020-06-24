@contactpoints
Feature: As a customer i want to manage my contact points

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


   Scenario Outline: Adding a personal, professional, fixed and forgein phone numbers
     Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
     And I have no phone number contact points
     When I introduce a new domestic phone number <phone_number> with <type>
     Then I see <phone_number> in the phone number list with <type>

     Examples:
       | phone_number | type |
       | "014145896"  | "01" |
       | "0489145890" | "05" |
       | "014145896"  | "02" |
       | "0489145892" | "06" |

   Scenario Outline: Deleting mobile phone and fixed line
     Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
     And There is <phone_number> number in the list with type <type>
     When I delete all the mobile phones
     Then I should not see any mobile phone in the list

     Examples:
       | phone_number | type |
       | "014145896"  | "01" |
       | "0489145890" | "05" |

  #  Scenario: Deleting an email
  #    Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
  #    And There is "simondoe@doe.com" email in the list
  #    When I delete an email
  #    Then I should not see the email in the list anymore


   #Modify email
   Scenario Outline: Modifying an email
     Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
     And <email> is added to current smid
     When I modify an existing email address <email> to <new_email>
     Then I see the modified <new_email> email in the list

     Examples:
       | email              | new_email       |
       | "simondoe@doe.com" | "test@gmail.be" |
       | "aymeric@doe.com"  | "joy@gmail.be"  |



  #Modify mobile phone and fixed line
  Scenario Outline: Modify mobile phone
    Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
    And There is <number> number in the list with type <type>
    When I modify an existing phone number <number> to <new_Number>
    Then I see <new_Number> in the phone number list with <type>

    Examples:
      | number       | type | new_Number    |
      | "014145896"  | "01" | "014845086"   |
      | "0489145890" | "05" | "0470068956"  |

