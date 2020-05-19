
// Call to reinitialize application.

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    // This is the only setting that needs to be set across each application
    // load. this needs to occur before cy.visit() which will request the
    // page. Setting all defaults in order to make sure that a change
    // to development defaults does not break a bunch of texts.
    win.INT_TEST_APP_PARAMS = {
      services: {
        search: urlOptionsMap => {
          const baseEndpoint = '/api/sitewidesearch/v1/Search/cgov/en/';
          const endpoint = baseEndpoint + urlOptionsMap.queryString;
          return endpoint;
        },
        dictionary: urlOptionsMap => {
          const baseEndpoint = '/api/Dictionary.Service/v1/search?dictionary=term&language=English&searchType=exact&offset=0&maxResuts=0';
          const searchText = encodeURI(urlOptionsMap.term);
          const endpoint = `${ baseEndpoint }&searchText=${ searchText }`;
          return endpoint;
        },
        bestBets: urlOptionsMap => {
          const baseEndpoint = '/api/bestbets/v1/BestBets/live/en/';
          const searchText = encodeURI(urlOptionsMap.term);
          const endpoint = baseEndpoint + searchText;
          return endpoint;
        }
      },
      language: 'en',
      dropdownOptions: [ 20, 50 ],
    };
    console.log(win.INT_TEST_APP_PARAMS)
  });
});