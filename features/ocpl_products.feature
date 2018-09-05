@FID_2162
Feature: Products Feature
  
  Scenario Outline: getProducts
  When I try to get a product according to my age <under28> <language>
  Then I should be able to get the correct products <under28> <language>

        Examples:
        |    under28      |  language   | 
        |      "y"        |     "fr"    | 
        # |      "y"        |     "en"    | 
        # |      "y"        |     "de"    | 
        # |      "y"        |     "nl"    | 
        # |      "n"        |     "fr"    | 
        # |      "n"        |     "en"    | 
        # |      "n"        |     "de"    | 
        # |      "n"        |     "nl"    | 