@FID_2162
Feature: Products Feature
  
  Scenario Outline: getProducts
  When I try to get a product according to my age <under28> <language>
  Then I should be able to get the correct products

        Examples:
        |    under28    |  language | 
        |    "YES"      |    "fr"   | 
        |    "YES"      |    "en"   | 
        |    "YES"      |    "de"   | 
        |    "YES"      |    "nl"   | 
        |    "NO"       |    "fr"   | 
        |    "NO"       |    "en"   | 
        |    "NO"       |    "de"   | 
        |    "NO"       |    "nl"   | 