
// Call to reinitialize application.

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    // This is the only setting that needs to be set across each application
    // load. this needs to occur before cy.visit() which will request the
    // page. Setting all defaults in order to make sure that a change
    // to development defaults does not break a bunch of texts.
    win.INT_TEST_APP_PARAMS = {
      title: 'NCI Search Results',
      searchEndpoint: 'https://webapis.cancer.gov/sitewidesearch/v1/',
      searchCollection: 'cgov',
      searchSiteFilter: 'all',
      bestbetsEndpoint: 'https://webapis.cancer.gov/bestbets/v1/',
      bestbetsCollection: 'live',
      dictionaryEndpoint: 'https://webapis.cancer.gov/glossary/v1/',
      dictionaryName: 'Cancer.gov',
      dictionaryAudience: 'Patient',
      language: 'en',
      dropdownOptions: [ 20, 50 ],
    };
    console.log(win.INT_TEST_APP_PARAMS)
  });
});