
Feature: As a customer I want to download my information in a PDF format

Given I am logged with smid "1180546302" and "67030417188221005" as cardnumber
When I download the pdf of my information
Then I can view my information on the pdf

