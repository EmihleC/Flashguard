
Feature: Concurrent Transfers
  As a FlashGuard banking user
  I want mobile and web transfers to process simultaneously
  So that transactions are processed accurately without balance inconsistencies

  @e2e @concurrency @P1
  Scenario: Mobile and Web transfers happen simultaneously
    Given the account balance is R100
    When mobile transfers R50 and web transfers R50 simultaneously
    Then both transfers should succeed
    And both transactions should be saved in the database
    And the final balance should be R0
    And no duplicate transactions should exist

