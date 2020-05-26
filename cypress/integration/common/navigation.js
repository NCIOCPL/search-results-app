import { Given, Then } from "cypress-cucumber-preprocessor/steps";

/*
    --------------------
        Page Visits
    --------------------
*/
Given('user is navigating to {string}', (a) => {
  cy.visit(a);
});

Given("the user visits the app page", () => {
  cy.visit("/");
});

Then("the page title is {string}", title => {
  cy.get('h1').should('contain', title);
});
