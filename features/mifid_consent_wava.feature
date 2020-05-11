Feature: As a customer I want to update my mifid consent securly

 Scenario: Set MIFID consent to OUT
 Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
 When I update my mifid consent to "OU"
 Then the mifid consent is updated to "OU"

# Scenario: Set MIFID consent to IN without MSMCRequest
#  Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
#  When I update my mifid consent to "IN"
#  Then the mifid consent is not updated

#  Scenario: Set MIFID consent to IN with an unsigned MSMC request
#  Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
#  When I update my mifid consent to "IN" with an invalid signature
#  Then the mifid consent is not updated

Scenario: Set data consent with an MSMC request
Given that i am a logged in user with "1180546302" as smid and "67030417188221005" as cardnumber
When I update my data consent to "IN"
Then the data consent is updated to "IN"

# Scenario: Set mutiple consents including a MIFID consent to IN with an unsigned MSMC request
# Given that i am a logged in user <psp>
# And I have a mifid consent on "OUT" with a invalid M2 signature
# And I have two data consents on "OUT"
# When i update all my consents to "IN"
# Then my consents is not updated