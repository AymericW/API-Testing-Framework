@FID_2162
Feature: Countries

  Scenario Outline: Retrieve all countries
    When I retrieve the countries in <language>
    Then the response status code is "200"
    And I have the same countries as my reference in <language>

    Examples:
    |    language   | 
    |    "fr"       | 
    |    "en"       |
    |    "de"       |
    |    "nl"       |


  Scenario: Retrieve all countries without specifying the language
    When I retrieve the countries
    Then the response status code is "200"
    And I have the same countries as my reference in "en"

  Scenario: Retrieve Belgium with no specified language
    When I retrieve the country "BE"
    Then the response status code is "200"
    And the country code is "BE" and label is "Belgium"

  Scenario: Retrieve Belgium in french
    When I retrieve the country "BE" in "fr"
    Then the response status code is "200"
    And the country code is "BE" and label is "Belgique"

  Scenario: Retrieve India in german
    When I retrieve the country "IN" in "de"
    Then the response status code is "200"
    And the country code is "IN" and label is "Indien"

  Scenario: Country not existing
    When I retrieve the country "XXX" in "de"
    Then the response status code is "404"