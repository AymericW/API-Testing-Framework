@FID_2162
Feature: Countries Feature

  Scenario Outline: getCountries
  When I try to hit getCountryList Service with request <language>
  Then I should be able to get the correct country list

        Examples:
        |    language   | 
        |    "fr"       | 
        |    "en"       |
        |    "de"       |
        |    "nl"       |