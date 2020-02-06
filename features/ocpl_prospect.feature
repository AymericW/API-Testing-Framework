 @FID_2162
 Feature: Prospect Feature
   
    Scenario Outline: Create a prospect
    Given I create a prospect with <firstName> <lastName> <email> <brand> <language>
    Then I get the correct prospect details in the response <firstName> <lastName> <email> <brand> <language>

        Examples:
        |   firstName   |    lastName       |              email                |  brand  |   language   |
        |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |  "FB"   |   "FR"       |
        |   "Naveen"    |    "Anandhan"     |    "naveen.anandhan@gmail.com"    |  "FB"   |   "EN"       |
     

    Scenario Outline: Retrieve the prospect details
    Given I create a prospect with <firstName> <lastName> <email> <brand> <language>
    When I retrieve the prospect with the id received from the creation
    Then I get the correct prospect details in the response <firstName> <lastName> <email> <brand> <language>

    Examples:
        |   firstName   |    lastName       |              email                |  brand  |   language   |
        |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |  "FB"   |   "FR"       |
        |   "Naveen"    |    "Anandhan"     |    "naveen.anandhan@gmail.com"    |  "FB"   |   "EN"       |


    # Scenario Outline: Create the prospect with invalid email address
    # Given I create a prospect with "Simon" "Pin" <email> "FB" "FR"
    # Then the response status is "400"

    # Examples:
    #     |    email                                                                                                    |
    #     |    ""                                                                                                       |
    #     |    "s"                                                                                                      |
    #     |    "çà"                                                                                                     |
    #     |    "287"                                                                                                    |
    #     |    "simon@pin"                                                                                              |
    #     |    "nicolascuetohotmail.com"                                                                                          | 
    #     |    "@nicolascuetohotmail.com"                                                                                         | 
    #     |    "@nicolascueto@hotmail.com"                                                                                        | 
    #     |    "nicolascueto@hotm@ail.com"                                                                                        | 
    #     |    "nicolascueto@hotmail..com"                                                                                        | 
    #     |    "nicolascueto@@hotmail.com"                                                                                        | 
    #     |    "nicolas@cueto@hotmail.com"                                                                                        | 
    #     |    ".nicolascueto@hotmail.com"                                                                                        | 
    #     |    "nicolascueto@hotmail"                                                                                             | 
    #     |    "nicolascueto@hotmail."                                                                                            | 
    #     |    "nicolascueto@hotmail.c"                                                                                           | 
    #     |    "nicolas cueto@hotmail.com"                                                                                        | 
    #     |    "nicolas cueto @hotmail.com"                                                                                       | 
    #     |    "nicolascueto@hotmail.@com"                                                                                        | 
    #     |    "nicolascueto@hotmail.c@com"                                                                                       | 
    #     |    "nicolascueto@hotmail.co@com"                                                                                      | 
    #     |    "nicolascueto@.com"                                                                                                | 
    #     |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicol@hotmail.com"            | 
    #     |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicolhotmail.com"            | 
    #     |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto@hotmail.com"                                    | 
    #     |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto.com"                                    | 
        
#     Scenario Outline: Save the scanned Identity details of the prospect
#     Given I create a prospect with <firstName> <lastName> <email> <brand> <language>
#     And I save his identity details with result <result>
#     When I retrieve the prospect with the id received from the creation
#     Then I get the prospect status as identity "ID_RECEIVED"

#     Examples:
#         |   firstName   |    lastName       |              email                |  brand  |   language   | result           |
#         |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |  "FB"   |   "FR"       | "REVIEW_PENDING" |
#         |   "Naveen"    |    "Anandhan"     |    "naveen.anandhan@gmail.com"    |  "FB"   |   "EN"       | "REVIEW_PENDING" |


#     Scenario Outline: Create a psp for a new Customer
#     Given I create a prospect with <firstName> <lastName> <email> <brand> <language>
#     And I save his identity details with result <result>
#     And I set the <product> and address <street> <number> <city> <postalCode>
#     When I retrieve the prospect with the id received from the creation
#     Then I get the prospect status as identity "CUSTOMER_VALIDATED"

#     Examples:
#         |   firstName   |    lastName       |              email                |  brand  |   language   |  product |   street             |   number  |   city                    |   postalCode  | result           |  
#         |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |  "FB"   |   "FR"       |  "CCOMF" |  "Rue du progrès"    |   "55"    |   "Saint-Josse-ten-Noode" |   "1210"      | "REVIEW_PENDING" |


#     Scenario: Add Product to Prospect
#     Given I create a prospect with "Simon" "Pin" "simon@bbc.com" "FB" "EN"
#     And I save his identity details with result "REVIEW_PENDING"
#     When I add a product "CCOMF" to the prospect 
#     Then the response status is "200"
#     And I see the product "CCOMF" in the prospect


# ######################################## 400 error code scenarios ##########################################
 
# # ---------------------------------    Missing brand field    -------------------------------------------

# @error @error_missing_field @error_missing_one_field
# Scenario Outline: Create a prospect with one missing field
# When I create a prospect with empty fields <firstName> <lastName> "" <brand> <language>
# Then the response status is "400"
# And I have 1 error code <code>
# And I have 1 error message <message>

# Examples:
# |   firstName   |    lastName    |   brand      |   language    |   code            |   message                                 |
# |   ""          |    "Pin"       |   "FB"       |  "FR"         |   "BRC0001"       |   "First name (firstName) is required."   |
# |   "Simon"     |    ""          |   "FB"       |  "FR"         |   "BRC0002"       |   "Last name (lastName) is required."     |
# |   "Simon"     |    "Pin"       |   ""         |  "FR"         |   "BRC0003"       |   "Brand (brand) is required."            |
# |   "Simon"     |    "Pin"       |   "FB"       |  ""           |   "BRC0004"       |   "Language (language)  is required."     |

# @error @error_missing_field @error_missing_two_field
# Scenario Outline: Create a prospect with two missing fields
# When I create a prospect with empty fields <firstName> <lastName> "" <brand> <language>
# Then the response status is "400"
# And I have 2 error code <code>
# And I have 2 error message <message>

# Examples:
# |   firstName   |    lastName    |   brand      |   language    |   code                     |   message                                                                    |
# |   ""          |    ""          |   "FB"       |  "FR"         |   "BRC0001, BRC0002"       |   "First name (firstName) is required., Last name (lastName) is required."   |
# |   ""          |    "Pin"       |   ""         |  "FR"         |   "BRC0001, BRC0003"       |   "First name (firstName) is required., Brand (brand) is required."   |
# |   ""          |    "Pin"       |   "FB"       |  ""           |   "BRC0001, BRC0004"       |   "First name (firstName) is required., Language (language)  is required."   |
# |   "Simon"     |    ""          |   ""         |  "FR"         |   "BRC0002, BRC0003"       |   "Last name (lastName) is required., Brand (brand) is required."   |
# |   "Simon"     |    ""          |   "FB"       |  ""           |   "BRC0002, BRC0004"       |   "Last name (lastName) is required., Language (language)  is required."   |
# |   "Simon"     |    "Pin"       |   ""         |  ""           |   "BRC0003, BRC0004"       |   "Brand (brand) is required., Language (language)  is required."   |

# @error @error_missing_field @error_missing_three_field
# Scenario Outline: Create a prospect with three missing fields
# When I create a prospect with empty fields <firstName> <lastName> "" <brand> <language>
# Then the response status is "400"
# And I have 3 error code <code>
# And I have 3 error message <message>

# Examples:
# |   firstName   |    lastName    |   brand      |   language      |   code                              |   message                                                                                                      |
# |   ""          |    ""          |   ""         |  "FR"           |   "BRC0001, BRC0002, BRC0003"       |   "First name (firstName) is required., Last name (lastName) is required., Brand (brand) is required."         |
# |   ""          |    ""          |   "FB"       |  ""             |   "BRC0001, BRC0002, BRC0004"       |   "First name (firstName) is required., Last name (lastName) is required., Language (language)  is required."  |
# |   "Simon"     |    ""          |   ""         |  ""             |   "BRC0002, BRC0003, BRC0004"       |   "Last name (lastName) is required., Brand (brand) is required., Language (language)  is required."           |

# @error @error_missing_field @error_missing_four_field
# Scenario: Create a prospect with four missing fields
# When I create a prospect with empty fields "" "" "" "" ""
# Then the response status is "400"
# And I have 4 error code "BRC0001, BRC0002, BRC0003, BRC0004"
# And I have 4 error message "First name (firstName) is required., Last name (lastName) is required., Brand (brand) is required., Language (language)  is required."



# # ---------------------------------    Unmatching age and product    -------------------------------------------

# Scenario: Add Hellobank product to Prospect older than 28 years - Error case
# Given I create a prospect with "simon" "pin" "simon@bbc.com" "FB" "EN"
# And I save his identity details with result "REVIEW_PENDING"
# When I add a product "CDIGPK" to the prospect
# Then the response status is "400"
# And I have 1 error code "BRC0002" with the message "The chosen pack is not valid for this prospect"




# # Scenario Outline: Create a prospect with missing required fields
# # Given I create a prospect with empty fields <firstName> <lastName> "" <brand> <language>
# # Then the response status is "400"
# # And I get a message with the missing required fields

# # Examples:
# # |   firstName   |    lastName       |   language   |  brand     |   
# # |   "Simon"     |    "Pin"          |   "FR"       |  ""        |
# # |   "Simon"     |    "Pin"          |   ""         |  ""        |
# # |   "Simon"     |    ""             |   ""         |  ""        |
# # |   ""          |    "Pin"          |   ""         |  ""        |
# # |   ""          |    ""             |   "FR"       |  ""        |
# # |   ""          |    ""             |   ""         |  "FB"      |
# # |   ""          |    "Pin"          |   "FR"       |  "FB"      |
# # |   ""          |    ""             |   "FR"       |  "FB"      |
# # |   ""          |    ""             |   ""         |  "FB"      |
# # |   "Simon"     |    ""             |   "FR"       |  "FB"      |
# # |   "Simon"     |    "Pin"          |   ""         |  "FB"      |
# # |   ""          |    "Pin"          |   ""         |  "FB"      |
# # |   "Simon"     |    ""             |   "FR"       |  ""        |

    

     












#     # When I try to retrieve a prospect with the id created
#     # Then I should be able to get the correct prospect
#     # And I try to retrieve data from previously created prospect
#     # And I should have both data matching
 
#     # Scenario: getProspect with inexistant id
#     # When I try retrieve prospect data with id that doesn't exist
#     # Then the http status code is "404"
 
# #  ######################################## 200 success code scenarios ##########################################
    
# #     # First name validation
    
# #     Scenario Outline: Enter valid first name
# #     When I try to create a prospect with <valid firstname>, "Cueto", "cuetoscueto@hotmail.com", in "FB" and in "FR"
# #     Then the http status code is "200"
 
# #         Examples:
# #         |    valid firstname                                                                    | 
# #         |    "n"                                                                                | 
# #         |    " Nicolas "                                                                        | 
# #         |    "    Nicolas    "                                                                  | 
# #         |    "Nicolas "                                                                         | 
# #         |    " Nicolas"                                                                         | 
# #         |    " Nic olas "                                                                       | 
# #         |    "Nic olas"                                                                         | 
# #         |    "Nic     olas"                                                                     | 
# #         |    "Nicolas"                                                                          | 
# #         |    "Jean-François"                                                                    | 
# #         |    "Jêëéèàùäâîïôöûü"                                                                  | 
# #         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolass"                 | 

# #     # Last name validation

# #     Scenario Outline: Enter valid last name
# #     When I try to create a prospect with "Nicolas", <valid lastname>, "cuetoscueto@hotmail.com", in "FB" and in "FR"
# #     Then the http status code is "200"
 
# #         Examples:
# #         |    valid lastname                                                                     | 
# #         |    "c"                                                                                | 
# #         |    " Nicolas "                                                                        | 
# #         |    "    Nicolas    "                                                                  | 
# #         |    "Nicolas "                                                                         | 
# #         |    " Nicolas"                                                                         | 
# #         |    " Nic olas "                                                                       | 
# #         |    "Nic olas"                                                                         | 
# #         |    "Nic     olas"                                                                     | 
# #         |    "Nicolas"                                                                          | 
# #         |    "Jean-François"                                                                    | 
# #         |    "Jêëéèàùäâîïôöûü"                                                                  |
# #         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolass"                 |  


# #     # Email validation

# #     Scenario Outline: Enter valid email
# #     When I try to create a prospect with "Nicolas", "Cueto", <valid email>, in "FB" and in "FR"
# #     Then the http status code is "200"
 
# #         Examples:
# #         |    valid email                                                                                                    | 
# #         |    " nicolascueto@hotmail.com"                                                                                       | 
# #         |    "nicolascueto@hotmail.com "                                                                                       | 
# #         |    " nicolascueto@hotmail.com "                                                                                      | 
# #         |    "  nicolascueto@hotmail.com   "                                                                                   | 
# #         |    "nicolas-cueto@hotmail.com"                                                                                       | 
# #         |    "nicolas.cueto@hotmail.com"                                                                                       | 
# #         |    "nicolas_cueto@hotmail.com"                                                                                       | 
# #         |    "nicolas&cueto@hotmail.com"                                                                                       | 
# #         |    "12039110cueto@hotmail.com"                                                                                       | 
# #         |    "nicolas120391@hotmail.com"                                                                                       | 
# #         |    "n@h.co"                                                                                                          | 
# #         |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonico@hotmail.com"            | 
# #         |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicohotmail.com"            | 
# #         |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuet@hotmail.com"                                    | 
# #         |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuet.com"                                    | 

# #     # Brand validation

# #     Scenario Outline: Enter valid language
# #     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in "hb" and in <language>
# #     Then the http status code is "200"

# #         Examples:
# #         |    language      | 
# #         |    "FR"          | 
# #         |    "EN"          | 
# #         |    "DE"          | 
# #         |    "NL"          | 
        
# #     # Language validation

# #     Scenario Outline: Enter valid brand
# #     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in <brand> and in "EN"
# #     Then the http status code is "200"

# #         Examples:
# #         |    brand         | 
# #         |    "FB"          | 
# #         |    "HB"          | 

# #  ######################################## 400 error code scenarios ##########################################
 
# #     # First name validation

# #     Scenario Outline: Enter invalid first name
# #     When I try to create a prospect with <wrong firstname>, "Cueto", " cuetoscueto@hotmail.com", in "FB" and in "FR"
# #     Then the http status code is "400"
 
# #         Examples:
# #         |    wrong firstname                                                                    | 
# #         |    " "                                                                                | 
# #         |    ""                                                                                 | 
# #         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasss"                |  
# #         |    "Nicola1"                                                                          |  
# #         |    "Nicola'"                                                                          |  
# #         |    'Nicola"'                                                                          |  
# #         |    "Nicola("                                                                          |  
# #         |    "Nicola!"                                                                          |  
# #         |    "Nicola)"                                                                          |  
# #         |    "Nicola°"                                                                          |  
# #         |    "Nicola^"                                                                          |  
# #         |    "Nicola¨"                                                                          |  
# #         |    "Nicola$"                                                                          |  
# #         |    "Nicola*"                                                                          |  
# #         |    "Nicola€"                                                                          |  
# #         |    "Nicolaù"                                                                          |  
# #         |    "Nicola%"                                                                          |  
# #         |    "Nicola£"                                                                          |  
# #         |    "Nicola`"                                                                          |  
# #         |    "Nicola="                                                                          |  
# #         |    "Nicola+"                                                                          |  
# #         |    "Nicola/"                                                                          |  
# #         |    "Nicola:"                                                                          |  
# #         |    "Nicola;"                                                                          |  
# #         # |    "Nicola."                                                                          |  
# #         |    "Nicola,"                                                                          |  
# #         |    "Nicola?"                                                                          |  
# #         |    "Nicola@"                                                                          |  
# #         |    "Nicola#"                                                                          |  
# #         |    "Nicola_"                                                                          |  
# #         |    "Nicola<"                                                                          |  
# #         |    "Nicola>"                                                                          |  
        
# #     # Last name validation

# #     Scenario Outline: Enter invalid last name
# #     When I try to create a prospect with "Nicolas", <wrong lastname>, "nicolascueto@hotmail.com", in "FB" and in "FR"
# #     Then the http status code is "400"
 
# #         Examples:
# #         |    wrong lastname                                                                    | 
# #         |    " "                                                                               | 
# #         |    ""                                                                                | 
# #         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasss"               |  
# #         |    "cueto1"                                                                          |  
# #         |    "cueto'"                                                                          |  
# #         |    'cueto"'                                                                          |  
# #         |    "cueto("                                                                          |  
# #         |    "cueto!"                                                                          |  
# #         |    "cueto)"                                                                          |  
# #         |    "cueto°"                                                                          |  
# #         |    "cueto^"                                                                          |  
# #         |    "cueto¨"                                                                          |  
# #         |    "cueto$"                                                                          |  
# #         |    "cueto*"                                                                          |  
# #         |    "cueto€"                                                                          |  
# #         |    "cuetoù"                                                                          |  
# #         |    "cueto%"                                                                          |  
# #         |    "cueto£"                                                                          |  
# #         |    "cueto`"                                                                          |  
# #         |    "cueto="                                                                          |  
# #         |    "cueto+"                                                                          |  
# #         |    "cueto/"                                                                          |  
# #         |    "cueto:"                                                                          |  
# #         |    "cueto;"                                                                          |  
# #         |    "cueto."                                                                          |  
# #         |    "cueto,"                                                                          |  
# #         |    "cueto?"                                                                          |  
# #         |    "cueto@"                                                                          |  
# #         |    "cueto#"                                                                          |  
# #         |    "cueto_"                                                                          |  
# #         |    "cueto<"                                                                          |  
# #         |    "cueto>"                                                                          |  
 
 
# #     # Email validation

# #     Scenario Outline: Enter invalid email
# #     When I try to create a prospect with "Nicolas", "Cueto", <wrong email>, in "FB" and in "FR"
# #     Then the http status code is "400"

# #         Examples:
# #         |    wrong email                                                                                                     | 
# #         |    "nicolascuetohotmail.com"                                                                                          | 
# #         |    "@nicolascuetohotmail.com"                                                                                         | 
# #         |    "@nicolascueto@hotmail.com"                                                                                        | 
# #         |    "nicolascueto@hotm@ail.com"                                                                                        | 
# #         |    "nicolascueto@hotmail..com"                                                                                        | 
# #         |    "nicolascueto@@hotmail.com"                                                                                        | 
# #         |    "nicolas@cueto@hotmail.com"                                                                                        | 
# #         |    ".nicolascueto@hotmail.com"                                                                                        | 
# #         |    "nicolascueto@hotmail"                                                                                             | 
# #         |    "nicolascueto@hotmail."                                                                                            | 
# #         |    "nicolascueto@hotmail.c"                                                                                           | 
# #         |    "nicolas cueto@hotmail.com"                                                                                        | 
# #         |    "nicolas cueto @hotmail.com"                                                                                       | 
# #         |    "nicolascueto@hotmail.@com"                                                                                        | 
# #         |    "nicolascueto@hotmail.c@com"                                                                                       | 
# #         |    "nicolascueto@hotmail.co@com"                                                                                      | 
# #         |    "nicolascueto@.com"                                                                                                | 
# #         |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicol@hotmail.com"            | 
# #         |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicolhotmail.com"            | 
# #         |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto@hotmail.com"                                    | 
# #         |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto.com"                                    | 
 
# #     # Brand validation

# #     Scenario Outline: Enter valid language
# #     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in "hb" and in <language>
# #     Then the http status code is "400"

# #         Examples:
# #         |    language      | 
# #         |    "fr"          | 
# #         |    "en"          | 
# #         |    "de"          | 
# #         |    "nl"          | 
# #         |    "FR "         | 
# #         |    "EN "         | 
# #         |    "DE "         | 
# #         |    "NL "         | 
# #         |    "in"          | 
# #         |    "IN"          | 
# #         |    "23"          | 
# #         |    "zzzzz"       | 
# #         |    "$ù`"         | 
        
# #     # Language validation

# #     Scenario Outline: Enter valid brand
# #     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in <brand> and in "EN"
# #     Then the http status code is "400"

# #         Examples:
# #         |    brand         | 
# #         |    "fb"          | 
# #         |    "hb"          | 
# #         |    "HB "         | 
# #         |    "FB "         | 
# #         |    "FT"          | 
# #         |    "ft"          | 
# #         |    "eeeee"       | 
# #         |    "23"          | 
# #         |    "$ù`"         | 