
Feature: As a customer I want to download my information in a PDF format


Scenario: Ask and Download the PDF
  Given I am logged with smid and are on the Privacy portal page
  When I download the pdf of my information
  Then I can view my information on the pdf

