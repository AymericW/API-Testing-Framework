@FID_2162
Feature: Countries

  Scenario Outline: Retrieve all countries
    When I retrieve the countries in <language>
    Then the http status code is "200"
    And I have the same countries as my reference in <language>

    Examples:
    |    language   | 
    |    "fr"       | 
    |    "en"       |
    |    "de"       |
    |    "nl"       |


  Scenario: Retrieve all countries without specifying the language
    When I retrieve the countries
    Then the http status code is "200"
    And I have the same countries as my reference in "en"

  Scenario: Retrieve Belgium with no specified language
    When I retrieve the country "BE"
    Then the http status code is "200"
    And the country code is "BE" and label is "Belgium"

  Scenario Outline: Retrieve a country in a specified language
    When I retrieve the country <countryCode> in <language>
    Then the http status code is "200"
    And the country code is <countryCode> and label is <country>

    Examples:
    |    countryCode    |      language   |     country     |
    |    "BE"           |      "fr"       |    "Belgique"   |
    |    "IN"           |      "de"       |     "Indien"    |

  Scenario: Country not existing
    When I retrieve the country "XXX" in "de"
    Then the http status code is "404"