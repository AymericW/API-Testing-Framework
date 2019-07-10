@FID_2162
Feature: Products Feature
  
  Scenario Outline: getProducts
  When I try to get a product according to my age <under28> <language> <brand>
  Then the response status is "200"
  And I should be able to get the correct products <under28> <language> <brand>

        Examples:
        |    under28      |  language   | brand   |
        |      "y"        |     "fr"    | "FB"    |
        |      "y"        |     "en"    | "FB"    |
        |      "y"        |     "de"    | "FB"    |
        |      "y"        |     "nl"    | "FB"    |
        |      "n"        |     "fr"    | "FB"    |
        |      "n"        |     "en"    | "FB"    |
        |      "n"        |     "de"    | "FB"    | 
        |      "n"        |     "nl"    | "FB"    |


  # Scenario Outline: getProducts error cases
  # When I try to get a product according to my age <under28> <language> <brand>
  # # Then the http status code is "400"
  

  #       Examples:
  #       |    under28      |  language   | brand |
  #       |      "y"        |     "fr"    | "kn"  |
  #       |      "y"        |     "bl"    | "àç"  |
  #       |      "ç"        |     "è!"    | "25"  |
  #       |      "q"        |     "bl"    | "HB"  |
  #       |      "Q"        |     "fr"    | "1à"  |
  #       |      "n"        |     "bl"    | "FB"  |
  #       |      "!è"       |     "fr"    | "HB"  |
        


       
    
