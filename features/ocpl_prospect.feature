@FID_2162
Feature: Prospect Feature
  
  Scenario: postProspect
  When I try create a prospect with some data
  Then I should be able to get the correct prospect

  Scenario: getProspect with id
  When I try retrieve data from previously created prospect
  Then I should have both data matching

  # Scenario: getProspect with inexistant id
  # When I try retrieve prospect data without id that doesn't exist
  # Then I should be I should get a proper error message