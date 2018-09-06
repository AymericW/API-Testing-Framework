@FID_2162 @prospect
Feature: Prospect Feature
  
  Scenario: Create a prospect
  When I try create a prospect with generated random data
  Then I should be able to get the correct prospect

  Scenario: Create a prospect and retrieve it
  When I try create a prospect with generated random data
  Then I should be able to get the correct prospect
  And I try retrieve data from previously created prospect
  And I should have both data matching

  # Scenario: getProspect with inexistant id
  # When I try retrieve prospect data without id that doesn't exist
  # Then I should be I should get a proper error message