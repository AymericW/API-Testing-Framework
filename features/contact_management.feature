@contactpoints
Feature: As a customer i want to manage my contact points

   Scenario:
   Given I am logged in as "15923532"
   When I retrieve my contactpoints
   Then status code is "200"