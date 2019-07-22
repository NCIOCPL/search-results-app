import querystring from 'query-string';
// Action creator and controllers that are not directly associated with reducers. i.e., actions that target middleware
// or complex sets of action creators.

export const NEW_API_RESPONSE = 'NEW API RESPONSE';

export const newAPIResponse = (serviceName, cacheKey, body) => {
  return {
    type: NEW_API_RESPONSE,
    payload: {
      serviceName,
      cacheKey,
      body,
    }
  }
}

export const initiateSearchAction = dispatch => searchConfig => {
  dispatch(initiateSiteWideSearchQuery(searchConfig));
  dispatch(initiateDictionaryQuery(searchConfig));
  // TODO: Don't call this except when the service has been specified in the initialization. (Only CGOV gets best bets)
  // We only want to call bestBets when it's the first page of results.
  const isFirstPage = searchConfig.params.page === 1;
  if (isFirstPage) {
    dispatch(initiateBestBetsQuery(searchConfig));
  }
};

export const initiateSiteWideSearchQuery = searchConfig => {
  // TODO: To be abstracted into encoding function
  // While it would be preferable to encode this in the external service passed in,
  // we need to generate the query string now for the cache lookup. Since we are already generating it
  // once we don't want to repeat ourselves and potentially have two different methods for doing so
  // existing in the same code pipeline.
  const encodedTerm = encodeURI(searchConfig.term);
  const encodedParams = querystring.stringify(searchConfig.params);
  const queryString = `${encodedTerm}?${encodedParams}`;
  searchConfig.queryString = queryString;

  return {
    type: '@@cache/RETRIEVE',
    searchConfig,
    service: 'search',
    cacheKey: queryString,
    fetchHandlers: {
      // TODO: Validate shape. If no results array, we'll have a fatal error. Could add
      // in empty array instead.
    },
  };
};

export const initiateBestBetsQuery = searchConfig => {
  return {
    type: '@@cache/RETRIEVE',
    searchConfig,
    service: 'bestBets',
    cacheKey: searchConfig.term,
    fetchHandlers: {
      formatResponse: body => {
        // Until the API is changed. We need to do a fair bit of data wrangling to
        // extract the relevant information and put it into a JSON shape.
        const jsonified = body.map((bestBetCategory, catIdx) => {
          // We are filtering out the html from the processed result, but that's not really necessary
          // and is slightly more processing intensive (marginally).
          const { html, ...rest } = bestBetCategory;
          // Because of IE11, we can't use template elements or contextual fragments.
          const disconnectedParentWrapper = document.createElement('div');
          disconnectedParentWrapper.innerHTML = html;
          const bestBetEls = Array.from(disconnectedParentWrapper.querySelectorAll('li.general-list-item'));
          const results = bestBetEls.map(el => {
            const anchor = el.querySelector('a');
            const title = anchor.textContent;
            const link = anchor.getAttribute('href');
            const description = el.querySelector('p.body').textContent;
            return {
              title,
              link,
              description,
            }
          })
          const processedBestBetCategory = {
            ...rest,
            results,
          };
          return processedBestBetCategory;
        })
        return jsonified;
      },
    },
  };
};

export const initiateDictionaryQuery = searchConfig => {
  return {
    type: '@@cache/RETRIEVE',
    searchConfig,
    service: 'dictionary',
    cacheKey: searchConfig.term,
    fetchHandlers: {
      formatResponse: body => {
        // We can inspect the metaProperty.result_count value to determine if
        // we are safe to extract the term details.
        const hasResult = body.meta.result_count > 0;
        return hasResult ? body.result[0].term : null;
      },
    },
  };
};
