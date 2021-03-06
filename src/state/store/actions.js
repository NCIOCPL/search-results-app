import querystring from 'query-string';
import { constructURL } from '../../utilities';
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

export const initiateAPICalls = dispatch => (url, urlOptionsMap) => {
  dispatch(initiateSiteWideSearchQuery(url, urlOptionsMap));
  dispatch(initiateDictionaryQuery(urlOptionsMap));
  // TODO: Don't call this except when the service has been specified in the initialization. (Only CGOV gets best bets)
  // We only want to call bestBets when it's the first page of results.
  const isFirstPage = urlOptionsMap.from < urlOptionsMap.size;
  if (isFirstPage) {
    dispatch(initiateBestBetsQuery(urlOptionsMap));
  }
};

/**
 * We want to pass the url here to use as the cache key before it is transformed to 
 * the syntax used by the api.
 * @param {string} url 
 * @param {Object} urlOptionsMap 
 */
export const initiateSiteWideSearchQuery = (url, urlOptionsMap) => {
  // TODO: To be abstracted into encoding function
  // While it would be preferable to encode this in the external service passed in,
  // we need to generate the query string now for the cache lookup. Since we are already generating it
  // once we don't want to repeat ourselves and potentially have two different methods for doing so
  // existing in the same code pipeline.
  const { term, ...params } = urlOptionsMap;
  const encodedTerm = encodeURI(term);
  const encodedParams = querystring.stringify(params);
  const queryString = `${encodedTerm}?${encodedParams}`;
  urlOptionsMap.queryString = queryString;
  return {
    type: '@@cache/RETRIEVE',
    urlOptionsMap,
    service: 'search',
    cacheKey: url,
    fetchHandlers: {
      // TODO: Validate shape. If no results array, we'll have a fatal error. Could add
      // in empty array instead.
    },
  };
};

export const initiateBestBetsQuery = urlOptionsMap => {
  return {
    type: '@@cache/RETRIEVE',
    urlOptionsMap,
    service: 'bestBets',
    cacheKey: urlOptionsMap.term,
    fetchHandlers: {
      formatResponse: body => {
        // Until the API is changed. We need to do a fair bit of data wrangling to
        // extract the relevant information and put it into a JSON shape.
        const jsonified = body.map(bestBetCategory => {
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

export const initiateDictionaryQuery = urlOptionsMap => {
  return {
    type: '@@cache/RETRIEVE',
    urlOptionsMap,
    service: 'dictionary',
    cacheKey: urlOptionsMap.term,
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

/**
 * Given parameters, we want to create a new querystring and use it
 * to update the URL with. This will in turn kick off a new call to the 
 * API services and update the page results.
 * We also need to clear the current results (if the URL has changed (this won't be
 * a perfect science if we can't guarantee we build the querystring exactly the same
 * way each time)) so that the page doesn't show stale results with a new URL.
 * 
 * For readability, we will call this newSearch even though it really is more of 
 * a simple updating of the URL.
 */
export const newSearch = (urlOptionsMap) => {
  const url = constructURL(urlOptionsMap)
  return {
    type: '@@router/location_change',
    payload: url,
  }
}