 @FID_2162
 Feature: Prospect Feature
   
    Scenario Outline: Create a prospect
    Given I create a prospect with <firstName> <lastName> <email> <language> <brand>
    Then I get the correct prospect details in the response <firstName> <lastName> <email> <language> <brand>

        Examples:
        |   firstName   |    lastName       |              email                |   language   |  brand  |
        |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |   "FR"       |  "FB"   |
        |   "Naveen"    |    "Anandhan"     |    "naveen.anandhan@gmail.com"    |   "EN"       |  "FB"   |
     

    Scenario Outline: Retrieve the prospect details
    Given I create a prospect with <firstName> <lastName> <email> <language> <brand>
    When I retrieve the prospect with the id received from the creation
    Then I get the correct prospect details in the response <firstName> <lastName> <email> <language> <brand>

    Examples:
        |   firstName   |    lastName       |              email                |   language   |  brand  |
        |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |   "FR"       |  "FB"   |
        |   "Naveen"    |    "Anandhan"     |    "naveen.anandhan@gmail.com"    |   "EN"       |  "FB"   |


    Scenario Outline: Create the prospect with invalid email address
    Given I create a prospect with <firstName> <lastName> <email> <language> <brand>
    Then the response status is "400"

    Examples:
        |   firstName   |    lastName       |              email                |   language   |  brand  |
        |   "Simon"     |    "Pin"          |              ""                   |   "FR"       |  "FB"   |
        |   "Simon"     |    "Pin"          |              "s"                  |   "FR"       |  "FB"   |
        |   "Simon"     |    "Pin"          |              "çà"                 |   "FR"       |  "FB"   |
        |   "Simon"     |    "Pin"          |              "287"                |   "FR"       |  "FB"   |
        |   "Simon"     |    "Pin"          |              "simon@pin"          |   "FR"       |  "FB"   |

    Scenario Outline: Save the scanned Identity details of the prospect
    Given I create a prospect with <firstName> <lastName> <email> <language> <brand>
        And I save his identity details
    When I retrieve the prospect with the id received from the creation
    Then I get the prospect status as identity "ID_RECEIVED"

    Examples:
        |   firstName   |    lastName       |              email                |   language   |  brand  |
        |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |   "FR"       |  "FB"   |
        |   "Naveen"    |    "Anandhan"     |    "naveen.anandhan@gmail.com"    |   "EN"       |  "FB"   |


    Scenario Outline: Create a psp for a new Customer
    Given I create a prospect with <firstName> <lastName> <email> <language> <brand>
        And I save his identity details
        And I set the <product> and address <street> <number> <city> <postalCode>
    When I retrieve the prospect with the id received from the creation
    Then I get the prospect status as identity "CUSTOMER_VALIDATED"

    Examples:
        |   firstName   |    lastName       |              email                |   language   |  brand  |  product |   street             |   number  |   city                    |   postalCode  |   
        |   "Simon"     |    "Pin"          |    "simon.pin@hotmail.com"        |   "FR"       |  "FB"   |  "CCOMF" |  "Rue du progrès"    |   "55"    |   "Saint-Josse-ten-Noode" |   "1210"      |

















    # When I try to retrieve a prospect with the id created
    # Then I should be able to get the correct prospect
    # And I try to retrieve data from previously created prospect
    # And I should have both data matching
 
    # Scenario: getProspect with inexistant id
    # When I try retrieve prospect data with id that doesn't exist
    # Then the http status code is "404"
 
#  ######################################## 200 success code scenarios ##########################################
    
#     # First name validation
    
#     Scenario Outline: Enter valid first name
#     When I try to create a prospect with <valid firstname>, "Cueto", "cuetoscueto@hotmail.com", in "FB" and in "FR"
#     Then the http status code is "200"
 
#         Examples:
#         |    valid firstname                                                                    | 
#         |    "n"                                                                                | 
#         |    " Nicolas "                                                                        | 
#         |    "    Nicolas    "                                                                  | 
#         |    "Nicolas "                                                                         | 
#         |    " Nicolas"                                                                         | 
#         |    " Nic olas "                                                                       | 
#         |    "Nic olas"                                                                         | 
#         |    "Nic     olas"                                                                     | 
#         |    "Nicolas"                                                                          | 
#         |    "Jean-François"                                                                    | 
#         |    "Jêëéèàùäâîïôöûü"                                                                  | 
#         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolass"                 | 

#     # Last name validation

#     Scenario Outline: Enter valid last name
#     When I try to create a prospect with "Nicolas", <valid lastname>, "cuetoscueto@hotmail.com", in "FB" and in "FR"
#     Then the http status code is "200"
 
#         Examples:
#         |    valid lastname                                                                     | 
#         |    "c"                                                                                | 
#         |    " Nicolas "                                                                        | 
#         |    "    Nicolas    "                                                                  | 
#         |    "Nicolas "                                                                         | 
#         |    " Nicolas"                                                                         | 
#         |    " Nic olas "                                                                       | 
#         |    "Nic olas"                                                                         | 
#         |    "Nic     olas"                                                                     | 
#         |    "Nicolas"                                                                          | 
#         |    "Jean-François"                                                                    | 
#         |    "Jêëéèàùäâîïôöûü"                                                                  |
#         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolass"                 |  


#     # Email validation

#     Scenario Outline: Enter valid email
#     When I try to create a prospect with "Nicolas", "Cueto", <valid email>, in "FB" and in "FR"
#     Then the http status code is "200"
 
#         Examples:
#         |    valid email                                                                                                    | 
#         |    " nicolascueto@hotmail.com"                                                                                       | 
#         |    "nicolascueto@hotmail.com "                                                                                       | 
#         |    " nicolascueto@hotmail.com "                                                                                      | 
#         |    "  nicolascueto@hotmail.com   "                                                                                   | 
#         |    "nicolas-cueto@hotmail.com"                                                                                       | 
#         |    "nicolas.cueto@hotmail.com"                                                                                       | 
#         |    "nicolas_cueto@hotmail.com"                                                                                       | 
#         |    "nicolas&cueto@hotmail.com"                                                                                       | 
#         |    "12039110cueto@hotmail.com"                                                                                       | 
#         |    "nicolas120391@hotmail.com"                                                                                       | 
#         |    "n@h.co"                                                                                                          | 
#         |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonico@hotmail.com"            | 
#         |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicohotmail.com"            | 
#         |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuet@hotmail.com"                                    | 
#         |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuet.com"                                    | 

#     # Brand validation

#     Scenario Outline: Enter valid language
#     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in "hb" and in <language>
#     Then the http status code is "200"

#         Examples:
#         |    language      | 
#         |    "FR"          | 
#         |    "EN"          | 
#         |    "DE"          | 
#         |    "NL"          | 
        
#     # Language validation

#     Scenario Outline: Enter valid brand
#     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in <brand> and in "EN"
#     Then the http status code is "200"

#         Examples:
#         |    brand         | 
#         |    "FB"          | 
#         |    "HB"          | 

#  ######################################## 400 error code scenarios ##########################################
 
#     # First name validation

#     Scenario Outline: Enter invalid first name
#     When I try to create a prospect with <wrong firstname>, "Cueto", " cuetoscueto@hotmail.com", in "FB" and in "FR"
#     Then the http status code is "400"
 
#         Examples:
#         |    wrong firstname                                                                    | 
#         |    " "                                                                                | 
#         |    ""                                                                                 | 
#         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasss"                |  
#         |    "Nicola1"                                                                          |  
#         |    "Nicola'"                                                                          |  
#         |    'Nicola"'                                                                          |  
#         |    "Nicola("                                                                          |  
#         |    "Nicola!"                                                                          |  
#         |    "Nicola)"                                                                          |  
#         |    "Nicola°"                                                                          |  
#         |    "Nicola^"                                                                          |  
#         |    "Nicola¨"                                                                          |  
#         |    "Nicola$"                                                                          |  
#         |    "Nicola*"                                                                          |  
#         |    "Nicola€"                                                                          |  
#         |    "Nicolaù"                                                                          |  
#         |    "Nicola%"                                                                          |  
#         |    "Nicola£"                                                                          |  
#         |    "Nicola`"                                                                          |  
#         |    "Nicola="                                                                          |  
#         |    "Nicola+"                                                                          |  
#         |    "Nicola/"                                                                          |  
#         |    "Nicola:"                                                                          |  
#         |    "Nicola;"                                                                          |  
#         # |    "Nicola."                                                                          |  
#         |    "Nicola,"                                                                          |  
#         |    "Nicola?"                                                                          |  
#         |    "Nicola@"                                                                          |  
#         |    "Nicola#"                                                                          |  
#         |    "Nicola_"                                                                          |  
#         |    "Nicola<"                                                                          |  
#         |    "Nicola>"                                                                          |  
        
#     # Last name validation

#     Scenario Outline: Enter invalid last name
#     When I try to create a prospect with "Nicolas", <wrong lastname>, "nicolascueto@hotmail.com", in "FB" and in "FR"
#     Then the http status code is "400"
 
#         Examples:
#         |    wrong lastname                                                                    | 
#         |    " "                                                                               | 
#         |    ""                                                                                | 
#         |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasss"               |  
#         |    "cueto1"                                                                          |  
#         |    "cueto'"                                                                          |  
#         |    'cueto"'                                                                          |  
#         |    "cueto("                                                                          |  
#         |    "cueto!"                                                                          |  
#         |    "cueto)"                                                                          |  
#         |    "cueto°"                                                                          |  
#         |    "cueto^"                                                                          |  
#         |    "cueto¨"                                                                          |  
#         |    "cueto$"                                                                          |  
#         |    "cueto*"                                                                          |  
#         |    "cueto€"                                                                          |  
#         |    "cuetoù"                                                                          |  
#         |    "cueto%"                                                                          |  
#         |    "cueto£"                                                                          |  
#         |    "cueto`"                                                                          |  
#         |    "cueto="                                                                          |  
#         |    "cueto+"                                                                          |  
#         |    "cueto/"                                                                          |  
#         |    "cueto:"                                                                          |  
#         |    "cueto;"                                                                          |  
#         |    "cueto."                                                                          |  
#         |    "cueto,"                                                                          |  
#         |    "cueto?"                                                                          |  
#         |    "cueto@"                                                                          |  
#         |    "cueto#"                                                                          |  
#         |    "cueto_"                                                                          |  
#         |    "cueto<"                                                                          |  
#         |    "cueto>"                                                                          |  
 
 
#     # Email validation

#     Scenario Outline: Enter invalid email
#     When I try to create a prospect with "Nicolas", "Cueto", <wrong email>, in "FB" and in "FR"
#     Then the http status code is "400"

#         Examples:
#         |    wrong email                                                                                                     | 
#         |    "nicolascuetohotmail.com"                                                                                          | 
#         |    "@nicolascuetohotmail.com"                                                                                         | 
#         |    "@nicolascueto@hotmail.com"                                                                                        | 
#         |    "nicolascueto@hotm@ail.com"                                                                                        | 
#         |    "nicolascueto@hotmail..com"                                                                                        | 
#         |    "nicolascueto@@hotmail.com"                                                                                        | 
#         |    "nicolas@cueto@hotmail.com"                                                                                        | 
#         |    ".nicolascueto@hotmail.com"                                                                                        | 
#         |    "nicolascueto@hotmail"                                                                                             | 
#         |    "nicolascueto@hotmail."                                                                                            | 
#         |    "nicolascueto@hotmail.c"                                                                                           | 
#         |    "nicolas cueto@hotmail.com"                                                                                        | 
#         |    "nicolas cueto @hotmail.com"                                                                                       | 
#         |    "nicolascueto@hotmail.@com"                                                                                        | 
#         |    "nicolascueto@hotmail.c@com"                                                                                       | 
#         |    "nicolascueto@hotmail.co@com"                                                                                      | 
#         |    "nicolascueto@.com"                                                                                                | 
#         |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicol@hotmail.com"            | 
#         |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicolhotmail.com"            | 
#         |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto@hotmail.com"                                    | 
#         |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto.com"                                    | 
 
#     # Brand validation

#     Scenario Outline: Enter valid language
#     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in "hb" and in <language>
#     Then the http status code is "400"

#         Examples:
#         |    language      | 
#         |    "fr"          | 
#         |    "en"          | 
#         |    "de"          | 
#         |    "nl"          | 
#         |    "FR "         | 
#         |    "EN "         | 
#         |    "DE "         | 
#         |    "NL "         | 
#         |    "in"          | 
#         |    "IN"          | 
#         |    "23"          | 
#         |    "zzzzz"       | 
#         |    "$ù`"         | 
        
#     # Language validation

#     Scenario Outline: Enter valid brand
#     When I try to create a prospect with "Nicolas", "Cueto", "nicolascueto@hotmail.com", in <brand> and in "EN"
#     Then the http status code is "400"

#         Examples:
#         |    brand         | 
#         |    "fb"          | 
#         |    "hb"          | 
#         |    "HB "         | 
#         |    "FB "         | 
#         |    "FT"          | 
#         |    "ft"          | 
#         |    "eeeee"       | 
#         |    "23"          | 
#         |    "$ù`"         | 