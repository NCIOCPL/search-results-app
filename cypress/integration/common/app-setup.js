import { Given } from "cypress-cucumber-preprocessor/steps";

Given('{string} is set to {string}', (key, param) => {
  cy.on('window:before:load', (win) => {
    win.INT_TEST_APP_PARAMS[key] = param;
  })
});
