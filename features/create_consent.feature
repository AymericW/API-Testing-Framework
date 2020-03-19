@consent
Feature: Create psd2 consent on a psp

Given I have a valid <psp>
When I create a consent
Then the response status "200"

