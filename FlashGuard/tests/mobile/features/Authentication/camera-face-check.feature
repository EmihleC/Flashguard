
Feature: Flash-Guard Camera Face-Check Authentication

  @mobile @authentication @camera @positive
  Scenario: Merchant signs in using camera face-check
    Given the merchant is on the login screen
    When the merchant selects camera face-check
    And the merchant grants camera permission if requested
    Then the camera preview should become ready
    And the camera face-check should complete
    And the merchant should successfully access the dashboard
    And the dashboard should display the name "Alice Ledger"
    And the merchant dismisses the welcome message

  @mobile @authentication @camera @negative
  Scenario: Merchant cancels camera face-check
    Given the merchant is on the login screen
    When the merchant selects camera face-check
    And the merchant cancels camera face-check
    Then the camera face-check modal should close
    And the merchant should remain on the login screen

  @mobile @authentication @camera @negative @permission
  Scenario: Merchant denies camera permission
    Given the merchant is on the login screen
    When the merchant selects camera face-check
    And the merchant denies camera permission
    Then the camera access required alert should be displayed
    And the merchant should remain on the login screen
