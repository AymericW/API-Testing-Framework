Feature: As a customer I want to update my mifid consent securly

 Scenario: Set MIFID consent to OUT
 Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
 When I update my mifid consent to "OU"
 Then the mifid consent is updated to "OU"

 Scenario: Set MIFID consent to IN without MSMCRequest
  Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
  When I update my mifid consent to "IN"
  Then the mifid consent is not updated

  Scenario: Set MIFID consent to IN with an unsigned MSMC request
  Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
  When I update my mifid consent to "IN" with an invalid signature
  Then the mifid consent is not updated

 Scenario: Set data consent with an MSMC request
 Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
 When I update my data consent to "OU"
 Then the data consent is updated to "OU"
