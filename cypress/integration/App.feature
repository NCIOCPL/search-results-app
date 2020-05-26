Feature: App Page
  App page
  
  @focus
  Scenario: The app page loads with default title
    Given the user visits the app page
    Then the page title is "NCI Search Results"

  @focus
  Scenario: The app page loads with a set title
    Given "title" is set to "DOC Search Results"
    When the user visits the app page
    Then the page title is "DOC Search Results"