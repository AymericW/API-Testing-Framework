@FID_2162
Feature: retrieveCustomerProductList Feature
  
  # Scenario Outline: getContext
  # When I try to hit getContext Service with request <request>
  # Then I should be able to get the correct context
    
  # @QAP
  # Examples:
  #   |PROFILE              |request            |
  #   |USER_QA        |getContextRequest  |

  Scenario: retrieveCustomerProductList
  When I try to hit retrieveCustomerProductList Service with request
  Then I should be able to get the correct customer product list