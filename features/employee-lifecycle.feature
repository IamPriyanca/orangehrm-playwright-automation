Feature: Employee Lifecycle Management

  As an HR administrator
  I want to manage employee information
  So that employee records remain accurate

  Scenario: Complete employee lifecycle

    Given I am on the OrangeHRM login page

    When I login with valid OrangeHRM credentials
    And I navigate to the PIM module
    And I navigate to the Add Employee page
    And I add a new employee with valid details
    And I upload the employee profile picture
    And I save the employee

    Then the employee should be created successfully

    When I search for the newly created employee
    And I update the employee Job Title
    And I update the employee Employment Status
    And I save the employee changes

    Then the employee information should be updated successfully

    When I validate the employee through the API
    Then the API employee information should match the UI information

    When I delete the employee

    Then the employee should no longer exist in the UI
    And the employee should no longer exist through the API

    When I logout
    Then I should be redirected to the login page
    And I should not be able to access the PIM page without logging in
