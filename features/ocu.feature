#--------QUESTIONS-------
#Specify error codes
#Get smids


Feature: As a customer I want to be able to modify my customer data

 Scenario: Verify update restrictions for your smid
 Given I am logged with smid 
 And I am on the personal data page
 When I click on modify details
 Then I should see the eID update button

  Scenario: Verify update restrictions for a <non_related_smid>
  Given I am logged with smid
  When I try to modify the details of non_related_smid
  Then I should see an error


  Scenario: Create an Ocu Request for your smid
  Given I am logged with smid
  When I start the e-contract flow
  Then I should see the waiting screen


  Scenario: Create an Ocu Request for a <non_related_smid>
  Given I am logged with smid
  When I create an Ocu Request for a non_related_smid
  Then I should see an errorcode

  Scenario: Get the e-contract URL
  Given I am logged with smid
  When I request the e-contract URL
  Then I should receive the correct URL

 Scenario: Retrieve personal data
 Given I am logged with smid
 When I retrieve my personal data
  Then The surname is "MUKUNDAY"

# Scenario: Retrieve personal data for a <non_related_smid>
# Given I am logged with smid
# When I retrieve personal data for <non_related_smid> 
# Then I should see an error

