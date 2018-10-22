 @FID_2162 @prospect
 Feature: Prospect Feature
   
   # Scenario: Create a prospect
   # When I try to create a prospect with generated random data
   # Then I should be able to get the correct prospect
 
   # Scenario: Create a prospect and retrieve it
   # When I try to create a prospect with generated random data
   # Then I should be able to get the correct prospect
   # And I try to retrieve data from previously created prospect
   # And I should have both data matching
 
   # To be automated
 
  #  Scenario: getProspect with inexistant id
  #  When I try retrieve prospect data with id that doesn't exist
  #  Then I should get a proper error message


     # Scenario: Enter email with blank space before and after email
   # When I try to create a prospect that has blank space before and after email
   # Then I should be able to get the correct prospect
 
   # Name validation 500 success code

  Scenario Outline: Enter valid first name
  When I try to create a prospect with <valid firstname>, "Cueto" and "cuetoscueto@hotmail.com"
  Then the http status code is "500"
 
     Examples:
     |    valid firstname                                                                    | 
     |    "n"                                                                                | 
     |    " Nicolas "                                                                        | 
     |    "    Nicolas    "                                                                  | 
     |    "Nicolas "                                                                         | 
     |    " Nicolas"                                                                         | 
     |    " Nic olas "                                                                       | 
     |    "Nic olas"                                                                         | 
     |    "Nic     olas"                                                                     | 
     |    "Nicolas"                                                                          | 
     |    "Jean-François"                                                                    | 
     |    "Jêëéèàùäâîïôöûü"                                                                  | 
     |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolass"                 | 

  Scenario Outline: Enter valid last name
  When I try to create a prospect with "Nicolas", <valid lastname> and "cuetoscueto@hotmail.com"
  Then the http status code is "500"
 
     Examples:
     |    valid lastname                                                                     | 
     |    "c"                                                                                | 
     |    " Nicolas "                                                                        | 
     |    "    Nicolas    "                                                                  | 
     |    "Nicolas "                                                                         | 
     |    " Nicolas"                                                                         | 
     |    " Nic olas "                                                                       | 
     |    "Nic olas"                                                                         | 
     |    "Nic     olas"                                                                     | 
     |    "Nicolas"                                                                          | 
     |    "Jean-François"                                                                    | 
     |    "Jêëéèàùäâîïôöûü"                                                                  |
     |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolass"                 |  


  Scenario Outline: Enter valid email
  When I try to create a prospect with "Nicolas", "Cueto" and <valid email>
  Then the http status code is "500"
 
      Examples:
      |    valid lastname                                                                                                    | 
      |    " nicolascueto@hotmail.com"                                                                                       | 
      |    "nicolascueto@hotmail.com "                                                                                       | 
      |    " nicolascueto@hotmail.com "                                                                                      | 
      |    "  nicolascueto@hotmail.com   "                                                                                   | 
      |    "nicolas-cueto@hotmail.com"                                                                                       | 
      |    "nicolas.cueto@hotmail.com"                                                                                       | 
      |    "nicolas_cueto@hotmail.com"                                                                                       | 
      |    "nicolas&cueto@hotmail.com"                                                                                       | 
      |    "12039110cueto@hotmail.com"                                                                                       | 
      |    "nicolas120391@hotmail.com"                                                                                       | 
      |    "n@h.co"                                                                                                          | 
      |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonico@hotmail.com"            | 
      |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicohotmail.com"            | 
      |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuet@hotmail.com"                                    | 
      |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuet.com"                                    | 


   # Name validation 400 Bad request
 
   Scenario Outline: Enter invalid first name
   When I try to create a prospect with <wrong firstname>, "Cueto" and " cuetoscueto@hotmail.com"
   Then the http status code is "400"
 
     Examples:
     |    wrong firstname                                                                    | 
     |    " "                                                                                | 
     |    ""                                                                                 | 
     |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasss"                |  
     |    "Nicola1"                                                                          |  
     |    "Nicola'"                                                                          |  
     |    "Nicola""                                                                          |  
     |    "Nicola("                                                                          |  
     |    "Nicola!"                                                                          |  
     |    "Nicola)"                                                                          |  
     |    "Nicola°"                                                                          |  
     |    "Nicola^"                                                                          |  
     |    "Nicola¨"                                                                          |  
     |    "Nicola$"                                                                          |  
     |    "Nicola*"                                                                          |  
     |    "Nicola€"                                                                          |  
     |    "Nicolaù"                                                                          |  
     |    "Nicola%"                                                                          |  
     |    "Nicola£"                                                                          |  
     |    "Nicola`"                                                                          |  
     |    "Nicola="                                                                          |  
     |    "Nicola+"                                                                          |  
     |    "Nicola/"                                                                          |  
     |    "Nicola:"                                                                          |  
     |    "Nicola;"                                                                          |  
     |    "Nicola."                                                                          |  
     |    "Nicola,"                                                                          |  
     |    "Nicola?"                                                                          |  
     |    "Nicola@"                                                                          |  
     |    "Nicola#"                                                                          |  
     |    "Nicola_"                                                                          |  
     |    "Nicola<"                                                                          |  
     |    "Nicola>"                                                                          |  
 
 Scenario Outline: Enter invalid first name
   When I try to create a prospect with "Nicolas", <wrong lastname> and "nicolascueto@hotmail.com"
   Then the http status code is "400"
 
     Examples:
     |    wrong lastname                                                                    | 
     |    " "                                                                               | 
     |    ""                                                                                | 
     |    "NicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasNicolasss"               |  
     |    "cueto1"                                                                          |  
     |    "cueto'"                                                                          |  
     |    "cueto""                                                                          |  
     |    "cueto("                                                                          |  
     |    "cueto!"                                                                          |  
     |    "cueto)"                                                                          |  
     |    "cueto°"                                                                          |  
     |    "cueto^"                                                                          |  
     |    "cueto¨"                                                                          |  
     |    "cueto$"                                                                          |  
     |    "cueto*"                                                                          |  
     |    "cueto€"                                                                          |  
     |    "cuetoù"                                                                          |  
     |    "cueto%"                                                                          |  
     |    "cueto£"                                                                          |  
     |    "cueto`"                                                                          |  
     |    "cueto="                                                                          |  
     |    "cueto+"                                                                          |  
     |    "cueto/"                                                                          |  
     |    "cueto:"                                                                          |  
     |    "cueto;"                                                                          |  
     |    "cueto."                                                                          |  
     |    "cueto,"                                                                          |  
     |    "cueto?"                                                                          |  
     |    "cueto@"                                                                          |  
     |    "cueto#"                                                                          |  
     |    "cueto_"                                                                          |  
     |    "cueto<"                                                                          |  
     |    "cueto>"                                                                          |  
 
 
   # # Email validation

   Scenario Outline: Enter invalid first name
   When I try to create a prospect with "Nicolas", "Cueto" and <wrong email>
   Then the http status code is "400"

    Examples:
     |    wrong lastname                                                                                                     | 
     |    "nicolascuetohotmail.com"                                                                                          | 
     |    "@nicolascuetohotmail.com"                                                                                         | 
     |    "@nicolascueto@hotmail.com"                                                                                        | 
     |    "nicolascueto@hotm@ail.com"                                                                                        | 
     |    "nicolascueto@hotmail..com"                                                                                        | 
     |    "nicolascueto@@hotmail.com"                                                                                        | 
     |    "nicolas@cueto@hotmail.com"                                                                                        | 
     |    ".nicolascueto@hotmail.com"                                                                                        | 
     |    "nicolascueto@hotmail"                                                                                             | 
     |    "nicolascueto@hotmail."                                                                                            | 
     |    "nicolascueto@hotmail.c"                                                                                           | 
     |    "nicolas cueto@hotmail.com"                                                                                        | 
     |    "nicolas cueto @hotmail.com"                                                                                       | 
     |    "nicolascueto@hotmail.@com"                                                                                        | 
     |    "nicolascueto@hotmail.c@com"                                                                                       | 
     |    "nicolascueto@hotmail.co@com"                                                                                      | 
     |    "nicolascueto@.com"                                                                                                | 
     |    "nicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascuetonicol@hotmail.com"            | 
     |    "nicolascuetonicolascuetonicolascuetonicolas@cuetonicolascuetonicolascuetonicolascuetonicolhotmail.com"            | 
     |    "cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto@hotmail.com"                                    | 
     |    "hotmail@cuetonicolascuetonicolascuetonicolascuetonicolascuetonicolascueto.com"                                    | 
 
   