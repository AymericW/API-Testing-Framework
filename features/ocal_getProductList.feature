@FID_2162
Feature: Get product list Feature
  
  Scenario Outline: getProductList
  When I try get try to get a product according to my age <under28>
  Then I should be able to get product list <under28>

        Examples:
        |    under28    | 
        |    "YES"      | 
        |    "NO"       |