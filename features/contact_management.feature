@contactpoints
Feature: As a customer i want to manage my contact points

   Scenario:
   Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
   When I retrieve my contactpoints
   Then status code is "200"