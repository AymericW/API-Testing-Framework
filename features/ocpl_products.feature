@FID_2162
Feature: getProducts Feature
  
  Scenario Outline: getProducts
  When I try to get a product according to my age <under28>
  Then I should be able to get the correct products

        Examples:
        |    under28    | 
        |    "YES"      | 
        |    "NO"       |